# Landing Derman

Landing de Derman (crema íntima 30 ml, dropshipping UNMERCO) para tráfico de Meta.
Vite + React + Tailwind, publicada en Vercel (`derman-landing`).

- **Textos editables:** Supabase → Table Editor → `landing_textos` (landing = `derman`). Cambias `valor` y recargas.
- **Imágenes:** misma tabla, claves `img.galeria1`…`img.galeria6`, `img.gif1`, `img.gif2` (URL pública).
- **Formulario:** checkout nativo (`checkout-native`, slug `derman` en `checkout_pages`), el mismo de pedido.enerplu.com: precios en servidor, buscador de ciudad DANE, express, antifraude, 1 pedido/24 h, carrito abandonado, push y Meta CAPI. Pedidos `DER-2001…`.
- **Packs:** productos DERMAN X1 / X3 / X5 (Mastershop 61835, `units_count` 1/3/5). `mastershop-create-order` los envía como 1, 3 y 5 unidades.
- **Prueba sin crear pedidos:** agrega `?prueba=1` a la URL.
- **Pixel:** el de ENERPLU (`1248121626590977`). CAPI necesita el secreto `META_CAPI_TOKEN_DERMAN` en Supabase.

Cada push a `main` se publica solo en Vercel.
