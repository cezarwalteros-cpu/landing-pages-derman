import { FUNNEL_ENDPOINT, FUNNEL_PAGE, META_PIXEL_ID } from '../config';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid'] as const;
type UtmKey = (typeof UTM_KEYS)[number];
export type Utms = Partial<Record<UtmKey, string>>;

export function getUtms(): Utms {
  const qs = new URLSearchParams(window.location.search);
  const out: Utms = {};
  for (const k of UTM_KEYS) {
    let v = qs.get(k);
    try {
      if (v) sessionStorage.setItem('dm_' + k, v);
      else v = sessionStorage.getItem('dm_' + k);
    } catch {
      /* storage bloqueado */
    }
    if (v) out[k] = v;
  }
  return out;
}

function sessionId(): string {
  try {
    let sid = sessionStorage.getItem('dm_sid');
    if (!sid) {
      sid = 'dm-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem('dm_sid', sid);
    }
    return sid;
  } catch {
    return 'dm-' + Date.now().toString(36);
  }
}

export const SID = sessionId();

const cookie = (n: string) => {
  const m = document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
};

// Lo que el checkout guarda con el pedido (atribución por anuncio + CAPI)
export function trackingPayload() {
  return {
    ...getUtms(),
    fbp: cookie('_fbp'),
    fbc: cookie('_fbc'),
    landing_url: window.location.href.split('#')[0].slice(0, 300),
    user_agent: navigator.userAgent.slice(0, 300),
  };
}

type FunnelEvent = 'page_view' | 'plan_select' | 'cta_click' | 'scroll_50' | 'scroll_90';

export function track(ev: FunnelEvent, extra?: Record<string, unknown>) {
  const u = getUtms();
  const body = JSON.stringify({
    sid: SID,
    ev,
    page: FUNNEL_PAGE,
    store: 'derman',
    utm_source: u.utm_source,
    utm_campaign: u.utm_campaign,
    utm_content: u.utm_content,
    utm_term: u.utm_term,
    extra: extra ?? null,
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(FUNNEL_ENDPOINT, new Blob([body], { type: 'text/plain' }));
      return;
    }
  } catch {
    /* cae al fetch */
  }
  fetch(FUNNEL_ENDPOINT, { method: 'POST', body, keepalive: true }).catch(() => {});
}

export function initPixel() {
  if (!META_PIXEL_ID || window.fbq) return;
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq!('init', META_PIXEL_ID);
  window.fbq!('track', 'PageView');
}

export function pixel(event: string, params?: Record<string, unknown>, eventId?: string) {
  try {
    if (!window.fbq) return;
    if (eventId) window.fbq('track', event, params ?? {}, { eventID: eventId });
    else window.fbq('track', event, params ?? {});
  } catch {
    /* nunca bloquear */
  }
}
