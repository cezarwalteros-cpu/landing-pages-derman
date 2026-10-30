import {
  CART_ENDPOINT,
  LANDING_TOKEN,
  MASTERSHOP_PRODUCT_ID,
  ORDER_ENDPOINT,
  ORDER_PREFIX,
  PRODUCT_NAME,
  STORE_SLUG,
  type Bundle,
} from '../config';
import { getUtms, SID } from './tracking';

export type OrderForm = {
  nombre: string;
  telefono: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  barrio: string;
};

// Reparte el total del pack en líneas con precio entero por unidad,
// para que la suma cuadre exacto en el CRM y en Mastershop
// (ej. 3 und por $179.800 = 2 x $59.933 + 1 x $59.934).
export function bundleLineItems(b: Bundle) {
  const per = Math.floor(b.price / b.units);
  const rem = b.price - per * b.units;
  const base = {
    mastershop_id_product: MASTERSHOP_PRODUCT_ID,
    commercial_name: PRODUCT_NAME,
    title: `${PRODUCT_NAME} · ${b.title}`,
  };
  const items = [] as Array<typeof base & { quantity: number; price: number }>;
  if (b.units - rem > 0) items.push({ ...base, quantity: b.units - rem, price: per });
  if (rem > 0) items.push({ ...base, quantity: rem, price: per + 1 });
  return items;
}

export function normalizePhone(raw: string) {
  return raw.replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, '');
}

export function isValidPhone(raw: string) {
  return /^3\d{9}$/.test(normalizePhone(raw));
}

function headers() {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (LANDING_TOKEN) h['x-landing-token'] = LANDING_TOKEN;
  return h;
}

const CART_REF = `derman-${SID}`;

export async function sendCart(form: Partial<OrderForm>, bundle: Bundle) {
  if (!form.telefono || !isValidPhone(form.telefono)) return;
  const u = getUtms();
  try {
    await fetch(CART_ENDPOINT, {
      method: 'POST',
      headers: headers(),
      keepalive: true,
      body: JSON.stringify({
        store_slug: STORE_SLUG,
        cart_ref: CART_REF,
        nombre: form.nombre || null,
        telefono: normalizePhone(form.telefono),
        pack: `${PRODUCT_NAME} · ${bundle.title}`,
        total_cop: bundle.price,
        line_items: bundleLineItems(bundle),
        landing_url: window.location.href,
        ...u,
      }),
    });
  } catch {
    /* el carrito nunca bloquea la compra */
  }
}

export type OrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

export async function sendOrder(form: OrderForm, bundle: Bundle): Promise<OrderResult> {
  const u = getUtms();
  const orderRef = `${ORDER_PREFIX}-${Date.now().toString().slice(-8)}`;
  const phone = normalizePhone(form.telefono);
  try {
    const res = await fetch(ORDER_ENDPOINT, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        store_slug: STORE_SLUG,
        order_ref: orderRef,
        customer: { name: form.nombre.trim(), phone },
        shipping_address: {
          name: form.nombre.trim(),
          phone,
          department: form.departamento,
          city: form.ciudad.trim(),
          address1: form.direccion.trim(),
          neighborhood: form.barrio.trim() || null,
        },
        line_items: bundleLineItems(bundle),
        total_cop: bundle.price,
        payment: 'cod',
        notes: `Landing Derman · ${bundle.title}`,
        landing_url: window.location.href,
        ...u,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return { ok: false, error: data.error || `Error ${res.status}` };
    }
    return { ok: true, orderNumber: data.order_number || orderRef };
  } catch {
    return { ok: false, error: 'Sin conexión' };
  }
}
