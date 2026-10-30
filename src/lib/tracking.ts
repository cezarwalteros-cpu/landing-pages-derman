import { FUNNEL_ENDPOINT, FUNNEL_PAGE, META_PIXEL_ID, STORE_SLUG } from '../config';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export type Utms = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  ttclid: string | null;
};

const UTM_KEY = 'derman_utms';

export function getUtms(): Utms {
  const p = new URLSearchParams(window.location.search);
  const fromUrl: Utms = {
    utm_source: p.get('utm_source'),
    utm_medium: p.get('utm_medium'),
    utm_campaign: p.get('utm_campaign'),
    utm_content: p.get('utm_content'),
    utm_term: p.get('utm_term'),
    fbclid: p.get('fbclid'),
    ttclid: p.get('ttclid'),
  };
  const hasAny = Object.values(fromUrl).some(Boolean);
  try {
    if (hasAny) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const saved = sessionStorage.getItem(UTM_KEY);
    if (saved) return JSON.parse(saved) as Utms;
  } catch {
    /* storage bloqueado: seguimos con lo de la URL */
  }
  return fromUrl;
}

function sessionId(): string {
  const key = 'derman_sid';
  try {
    let sid = sessionStorage.getItem(key);
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    return 'nosid-' + Date.now().toString(36);
  }
}

export const SID = sessionId();

type FunnelEvent = 'page_view' | 'plan_select' | 'cta_click' | 'scroll_50' | 'scroll_90';

export function track(ev: FunnelEvent, extra?: Record<string, unknown>) {
  const u = getUtms();
  const body = JSON.stringify({
    sid: SID,
    ev,
    page: FUNNEL_PAGE,
    store: STORE_SLUG,
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
  fetch(FUNNEL_ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(
    () => {},
  );
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
  if (!META_PIXEL_ID || !window.fbq) return;
  if (eventId) window.fbq('track', event, params ?? {}, { eventID: eventId });
  else window.fbq('track', event, params ?? {});
}
