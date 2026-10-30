// ============================================================
// CONFIGURACIÓN DE LA LANDING DERMAN
// Todo lo que se cambia sin tocar diseño está aquí.
// ============================================================

// --- CRM (Supabase Bienestar Total) ---
export const SUPABASE_FUNCTIONS_URL = 'https://mqwscbpdozrdiqxofmod.supabase.co/functions/v1';
export const ORDER_ENDPOINT = `${SUPABASE_FUNCTIONS_URL}/landing-order-receiver`;
export const CART_ENDPOINT = `${SUPABASE_FUNCTIONS_URL}/Landing-cart-receiver`;
export const FUNNEL_ENDPOINT = `${SUPABASE_FUNCTIONS_URL}/funnel-track`;
export const SUPABASE_REST_URL = 'https://mqwscbpdozrdiqxofmod.supabase.co/rest/v1';
// Llave pública (anon) — solo permite LEER la tabla landing_textos.
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xd3NjYnBkb3pyZGlxeG9mbW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5Mjc1MzgsImV4cCI6MjA5MzUwMzUzOH0.jJ0ex_SYpDbRzpEitXKGqvmnr-_8SWHDf_hBj5GG45Q';

// Mismo token que usan las otras landings (secreto LANDING_WEBHOOK_TOKEN de Supabase).
export const LANDING_TOKEN = 'lovable2026';

export const STORE_SLUG = 'bienestar';
export const FUNNEL_PAGE = 'derman';
export const ORDER_PREFIX = 'DER';

// Producto creado en el CRM: DERMAN CREMA ÍNTIMA 30 ml (Mastershop 61835)
export const MASTERSHOP_PRODUCT_ID = 61835;
export const PRODUCT_NAME = 'DERMAN CREMA ÍNTIMA 30 ml';
export const UNIT_PRICE = 89900;

// --- Meta Pixel (opcional). Déjalo vacío para no cargar el pixel. ---
export const META_PIXEL_ID = '';

// --- Registro sanitario ---
export const NSOC = 'NSOC36162-24CO';

// --- Packs ---
export type Bundle = {
  id: 'x1' | 'x3' | 'x5';
  units: number;
  price: number;
  title: string;
  subtitle: string;
  badge?: string;
};

export const BUNDLES: Bundle[] = [
  { id: 'x1', units: 1, price: 89900, title: '1 Frasco', subtitle: 'Dosis de emergencia' },
  {
    id: 'x3',
    units: 3,
    price: 179800,
    title: 'Lleva 3 Frascos (Paga 2 Lleva 3)',
    subtitle: 'Tratamiento completo anti-rebrote',
    badge: 'MÁS VENDIDO / RECOMENDADO',
  },
  { id: 'x5', units: 5, price: 269700, title: 'Lleva 5 Frascos (Paga 3 Lleva 5)', subtitle: 'Máximo ahorro' },
];

export const DEFAULT_BUNDLE: Bundle['id'] = 'x3';

// --- Imágenes (reemplaza los placeholders por tus URLs reales) ---
const ph = (w: number, h: number, text: string) =>
  `https://placehold.co/${w}x${h}/png?text=${encodeURIComponent(text).replace(/%20/g, '+')}`;

export const GALLERY: { src: string; alt: string }[] = [
  { src: ph(600, 600, 'Frasco Derman 30ml'), alt: 'Frasco Derman 30 ml' },
  { src: ph(600, 600, 'Zona de aplicación / Puntos críticos'), alt: 'Zona de aplicación' },
  { src: ph(600, 600, 'Fórmula Ácido Undecilénico'), alt: 'Fórmula con ácido undecilénico' },
  { src: ph(600, 600, 'Empaque 100% Ciego / Discreto'), alt: 'Empaque 100% discreto' },
  { src: ph(600, 600, 'Resultados / Regeneración'), alt: 'Resultados y regeneración' },
  { src: ph(600, 600, 'Registro INVIMA Oficial'), alt: 'Notificación sanitaria INVIMA' },
];

export const GIF_SLOTS = {
  textura: ph(650, 350, 'ESPACIO PARA GIF: Textura y Absorcion Inmediata'),
  aplicacion: ph(650, 350, 'ESPACIO PARA GIF: Mecanismo de Accion'),
};
