import { BUNDLES, CHECKOUT_API, CHECKOUT_SLUG, type Bundle } from '../config';
import { SID } from './tracking';

// Cliente del checkout nativo (Edge Function checkout-native), el mismo de pedido.enerplu.com.
// - Precios y total se calculan en el servidor.
// - Antifraude, 1 pedido / 24 h por número, carrito abandonado, push y Meta CAPI.
// - ?prueba=1 en la URL → el servidor valida y calcula todo pero NO crea pedido, lead ni carrito.

export const DRY_RUN = new URLSearchParams(window.location.search).get('prueba') === '1';

export type Ciudad = { municipio: string; departamento: string; solo_pago_anticipado: boolean };

export type Shipping = {
  standard: { title: string; description: string | null };
  priority: { title: string; description: string | null; price: number } | null;
};

export type Bump = { title: string; description: string | null; image_url: string | null; price: number; compare_at_price: number | null };

export type ServerConfig = { bundles: Bundle[]; defaultId: string | null; shipping: Shipping; bump: Bump | null };

export type ApiResult = {
  status: number;
  success?: boolean;
  error?: string;
  fields?: Record<string, string>;
  order_number?: string;
  total_cop?: number;
  event_id?: string;
  blocked?: boolean;
  cod_allowed?: boolean;
  message?: string;
  [k: string]: unknown;
};

export async function api(body: Record<string, unknown>): Promise<ApiResult> {
  const r = await fetch(CHECKOUT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: CHECKOUT_SLUG, session_id: SID, ...body }),
  });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, ...j };
}

export async function loadConfig(): Promise<ServerConfig | null> {
  try {
    const r = await fetch(`${CHECKOUT_API}?slug=${CHECKOUT_SLUG}`);
    const j = await r.json();
    if (!j.success || !j.config) return null;
    const c = j.config;
    const bundles: Bundle[] = (c.offers ?? []).map((o: any) => {
      const local = BUNDLES.find((b) => b.id === o.key);
      return {
        id: o.key,
        units: o.units || local?.units || 1,
        price: o.price,
        compare: o.compare_at_price || 0,
        title: o.label || local?.title || o.key,
        subtitle: o.sublabel || local?.subtitle || '',
        badge: o.badge || undefined,
      };
    });
    const def = (c.offers ?? []).find((o: any) => o.is_default);
    return {
      bundles: bundles.length ? bundles : BUNDLES,
      defaultId: def?.key ?? null,
      shipping: {
        standard: c.standard_shipping ?? { title: 'Estándar', description: 'Llega en 3 a 4 días hábiles' },
        priority: c.priority_shipping ?? null,
      },
      bump: c.order_bump && c.order_bump.price ? c.order_bump : null,
    };
  } catch {
    return null;
  }
}

export async function buscarCiudad(q: string): Promise<Ciudad[]> {
  const r = await fetch(`${CHECKOUT_API}?q=${encodeURIComponent(q)}`);
  const j = await r.json().catch(() => ({}));
  return (j && j.ciudades) || [];
}

export const clean = (v: unknown) => String(v ?? '').replace(/\s+/g, ' ').trim();
export const phone10 = (v: unknown) => {
  let d = String(v ?? '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('57')) d = d.slice(2);
  return d;
};

// Fecha estimada de entrega (días hábiles, festivos de Colombia)
const HOLIDAYS = new Set([
  '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25', '2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25',
  '2027-03-26', '2027-05-01', '2027-05-10', '2027-05-31', '2027-06-07', '2027-07-05', '2027-07-20', '2027-08-07',
  '2027-08-16', '2027-10-18', '2027-11-01', '2027-11-15', '2027-12-08', '2027-12-25',
]);
function addBiz(d: Date, n: number) {
  const x = new Date(d);
  while (n > 0) {
    x.setDate(x.getDate() + 1);
    const iso = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
    if (x.getDay() !== 0 && x.getDay() !== 6 && !HOLIDAYS.has(iso)) n--;
  }
  return x;
}
const DAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export function eta(priority: boolean) {
  const now = new Date();
  const [a, b] = priority ? [2, 3] : [3, 4];
  const d1 = addBiz(now, a);
  const d2 = addBiz(now, b);
  return `entre el ${DAYS[d1.getDay()]} ${d1.getDate()} y el ${DAYS[d2.getDay()]} ${d2.getDate()} de ${MONTHS[d2.getMonth()]}`;
}
