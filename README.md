# Landing Derman

Landing de Derman (crema íntima 30 ml, dropshipping UNMERCO) para tráfico de Meta.
Vite + React + Tailwind, publicada en Vercel (`derman-landing`).

- **Textos editables:** Supabase → Table Editor → `landing_textos` (landing = `derman`). Cambias `valor` y recargas.
- **Pedidos:** Edge Function `landing-order-receiver` (tienda `bienestar`, producto Mastershop 61835, prefijo `DER-`).
- **Carritos abandonados:** `Landing-cart-receiver`. **Embudo:** `funnel-track` (page = `derman`).
- **Configuración** (packs, imágenes, pixel, token): `src/config.ts`.

Cada push a `main` se publica solo en Vercel.
