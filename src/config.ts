// ============================================================
// CONFIGURACIÓN DE LA LANDING DERMAN
// ============================================================

const SUPABASE_URL = 'https://mqwscbpdozrdiqxofmod.supabase.co';

// --- Checkout nativo (mismo backend que pedido.enerplu.com) ---
// Precios, ofertas, envío express y pixel salen de la fila "derman" de checkout_pages.
export const CHECKOUT_API = `${SUPABASE_URL}/functions/v1/checkout-native`;
export const CHECKOUT_SLUG = 'derman';

// --- Embudo y textos editables ---
export const FUNNEL_ENDPOINT = `${SUPABASE_URL}/functions/v1/funnel-track`;
export const SUPABASE_REST_URL = `${SUPABASE_URL}/rest/v1`;
// Llave pública (anon) — solo permite LEER la tabla landing_textos.
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xd3NjYnBkb3pyZGlxeG9mbW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5Mjc1MzgsImV4cCI6MjA5MzUwMzUzOH0.jJ0ex_SYpDbRzpEitXKGqvmnr-_8SWHDf_hBj5GG45Q';
export const FUNNEL_PAGE = 'derman';

// --- Meta Pixel: el mismo de ENERPLU (igual al meta_pixel_id del checkout, para deduplicar con CAPI) ---
export const META_PIXEL_ID = '1248121626590977';

// --- Registro sanitario ---
export const NSOC = 'NSOC36162-24CO';

// --- Packs (respaldo visual; los precios reales vienen del checkout) ---
export type Bundle = {
  id: string;
  units: number;
  price: number;
  compare: number;
  title: string;
  subtitle: string;
  badge?: string;
};

export const UNIT_PRICE = 89900;

export const BUNDLES: Bundle[] = [
  { id: 'x1', units: 1, price: 89900, compare: 0, title: '1 Frasco', subtitle: 'Dosis de emergencia' },
  {
    id: 'x3',
    units: 3,
    price: 179800,
    compare: 269700,
    title: 'Lleva 3 Frascos (Paga 2 Lleva 3)',
    subtitle: 'Tratamiento completo anti-rebrote',
    badge: 'MÁS VENDIDO / RECOMENDADO',
  },
  { id: 'x5', units: 5, price: 269700, compare: 449500, title: 'Lleva 5 Frascos (Paga 3 Lleva 5)', subtitle: 'Máximo ahorro' },
];

export const DEFAULT_BUNDLE = 'x3';

// --- Imágenes: se cambian desde Supabase (landing_textos, claves img.*). Estos son los placeholders. ---
const ph = (w: number, h: number, text: string) =>
  `https://placehold.co/${w}x${h}/png?text=${encodeURIComponent(text).replace(/%20/g, '+')}`;

export const GALLERY_DEFAULT: { key: string; src: string; alt: string }[] = [
  { key: 'img.galeria1', src: ph(600, 600, 'Frasco Derman 30ml'), alt: 'Frasco Derman 30 ml' },
  { key: 'img.galeria2', src: ph(600, 600, 'Zona de aplicación / Puntos críticos'), alt: 'Zona de aplicación' },
  { key: 'img.galeria3', src: ph(600, 600, 'Fórmula Ácido Undecilénico'), alt: 'Fórmula con ácido undecilénico' },
  { key: 'img.galeria4', src: ph(600, 600, 'Empaque 100% Ciego / Discreto'), alt: 'Empaque 100% discreto' },
  { key: 'img.galeria5', src: ph(600, 600, 'Resultados / Regeneración'), alt: 'Resultados y regeneración' },
  { key: 'img.galeria6', src: ph(600, 600, 'Registro INVIMA Oficial'), alt: 'Notificación sanitaria INVIMA' },
];

export const GIF_DEFAULT = {
  textura: ph(650, 350, 'ESPACIO PARA GIF: Textura y Absorcion Inmediata'),
  mecanismo: ph(650, 350, 'ESPACIO PARA GIF: Mecanismo de Accion'),
};
