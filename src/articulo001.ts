/* =========================================================
   DERMAN · Advertorial 504 (/articulo001)
   Calienta tráfico frío y lo manda a la landing (/) con el plan de 2 frascos marcado.
   Misma sesión (dm_sid) y mismos UTM que la landing, para que el embudo del CRM
   una al lector con su pedido. Eventos con page = "/articulo001".
   ========================================================= */
import { FUNNEL_ENDPOINT, META_PIXEL_ID } from './config';
import { getUtms, SID } from './lib/tracking';

const UTM = getUtms() as Record<string, string | undefined>;

function funnel(ev: string, extra?: Record<string, unknown>) {
  const body = JSON.stringify({
    sid: SID, ev, page: '/articulo001', store: 'derman',
    utm_source: UTM.utm_source, utm_campaign: UTM.utm_campaign, utm_content: UTM.utm_content, utm_term: UTM.utm_term,
    extra: extra || null,
  });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon(FUNNEL_ENDPOINT, new Blob([body], { type: 'text/plain' }));
    else fetch(FUNNEL_ENDPOINT, { method: 'POST', body, keepalive: true });
  } catch { /* nada */ }
}

/* Meta Pixel (el mismo de la landing) */
type Fbq = ((...a: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; push: unknown; loaded: boolean; version: string };
const w = window as unknown as { fbq?: Fbq; _fbq?: Fbq };
if (META_PIXEL_ID && !w.fbq) {
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args); else n.queue.push(args);
  } as Fbq;
  n.queue = []; n.push = n; n.loaded = true; n.version = '2.0';
  w.fbq = n; w._fbq = n;
  const t = document.createElement('script');
  t.async = true; t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(t);
  n('init', META_PIXEL_ID);
  n('track', 'PageView');
}

/* Botones → landing con 2 frascos marcados y los mismos UTM */
const dest = new URLSearchParams();
dest.set('combo', '2');
Object.keys(UTM).forEach((k) => { const v = UTM[k]; if (v) dest.set(k, v); });
document.querySelectorAll<HTMLAnchorElement>('[data-art-cta]').forEach((a) => {
  a.href = '/?' + dest.toString();
  a.addEventListener('click', () => funnel('cta_click', { where: 'articulo001-' + a.getAttribute('data-art-cta'), pack: 'x2' }));
});

/* Autotest */
const boxes = Array.from(document.querySelectorAll<HTMLInputElement>('#quiz input'));
const res = document.getElementById('qres');
boxes.forEach((b) => b.addEventListener('change', () => {
  const n = boxes.filter((x) => x.checked).length;
  if (!res) return;
  res.textContent = n >= 2
    ? `Marcaste ${n}. No es sudor normal: tu piel necesita cuidado. Sigue leyendo.`
    : n === 1 ? 'Marcaste 1. Sigue leyendo.' : 'Marca las que te pasan.';
}));

/* Scroll */
const seen: Record<string, boolean> = {};
addEventListener('scroll', () => {
  const pct = (scrollY + innerHeight) / document.documentElement.scrollHeight;
  if (pct > 0.5 && !seen.s50) { seen.s50 = true; funnel('scroll_50'); }
  if (pct > 0.9 && !seen.s90) { seen.s90 = true; funnel('scroll_90'); }
}, { passive: true });

funnel('page_view');
