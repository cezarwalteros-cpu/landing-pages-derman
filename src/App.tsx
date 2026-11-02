import { useEffect, useRef, useState } from 'react';
import { BUNDLES, DEFAULT_BUNDLE, GIF_DEFAULT, NSOC } from './config';
import { Header, TopBar } from './components/Header';
import { Gallery } from './components/Gallery';
import { BuyBox } from './components/BuyBox';
import { Awareness, Comparison, GifSlot, Ingredients, Privacy } from './components/Sections';
import { OrderForm } from './components/OrderForm';
import { Faq } from './components/Faq';
import { initPixel, pixel, track } from './lib/tracking';
import { loadConfig, marcarCheckout, type Bump, type Shipping } from './lib/checkout';
import { LOREM, useT } from './lib/textos';

export default function App() {
  const t = useT();
  const [bundles, setBundles] = useState(BUNDLES);
  const [selected, setSelected] = useState<string>(DEFAULT_BUNDLE);
  const touched = useRef(false); // el cliente ya escogió un pack a mano
  const [shipping, setShipping] = useState<Shipping>({
    standard: { title: 'Estándar', description: 'Llega en 3 a 4 días hábiles' },
    priority: { title: 'Express', description: 'Despacho con prioridad y envío asegurado', price: 5000 },
  });
  const [bump, setBump] = useState<Bump | null>(null);
  const scrolled = useRef({ s50: false, s90: false });

  useEffect(() => {
    initPixel();
    track('page_view');
    pixel('ViewContent', { value: 179800, currency: 'COP', content_name: 'DERMAN' });
    loadConfig().then((c) => {
      if (!c) return;
      setBundles(c.bundles);
      setShipping(c.shipping);
      setBump(c.bump);
      setSelected((cur) =>
        touched.current && c.bundles.some((b) => b.id === cur) ? cur : c.defaultId ?? c.bundles[0].id,
      );
    });
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop + window.innerHeight) / h.scrollHeight;
      if (pct >= 0.5 && !scrolled.current.s50) {
        scrolled.current.s50 = true;
        track('scroll_50');
      }
      if (pct >= 0.9 && !scrolled.current.s90) {
        scrolled.current.s90 = true;
        track('scroll_90');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Embudo: "vio los planes" (packs visibles) y "abrió el checkout" (llegó cerca del formulario)
    const observers: IntersectionObserver[] = [];
    if ('IntersectionObserver' in window) {
      const planes = document.querySelectorAll('[data-dm-planes]');
      if (planes.length) {
        const io = new IntersectionObserver(
          (es) => {
            if (es.some((e) => e.isIntersecting)) {
              track('selector_view');
              io.disconnect();
            }
          },
          { threshold: 0.4 },
        );
        planes.forEach((el) => io.observe(el));
        observers.push(io);
      }
      const pedido = document.getElementById('pedido');
      if (pedido) {
        const io = new IntersectionObserver(
          (es) => {
            if (es.some((e) => e.isIntersecting)) {
              marcarCheckout();
              io.disconnect();
            }
          },
          { rootMargin: '900px 0px' },
        );
        io.observe(pedido);
        observers.push(io);
      }
    } else {
      track('selector_view');
      marcarCheckout();
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const select = (id: string) => {
    touched.current = true;
    setSelected(id);
    track('plan_select', { plan: id });
  };

  const goToOrder = () => {
    track('plan_click', { plan: selected, from: 'buybox' });
    marcarCheckout();
    document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="top">
      <TopBar />
      <Header />

      <main>
        <section className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-2 md:gap-10 md:py-10">
          <Gallery />
          <BuyBox bundles={bundles} selected={selected} onSelect={select} onOrder={goToOrder} />
        </section>

        <GifSlot src={t('img.gif1') || GIF_DEFAULT.textura} label="Textura ligera que se absorbe al instante" badge="Textura y absorción" />

        <Awareness />
        <Ingredients />

        <GifSlot src={t('img.gif2') || GIF_DEFAULT.mecanismo} label={t('gif2.leyenda', LOREM.t)} badge="Mecanismo de acción" />

        <Privacy />
        <Comparison />
        <OrderForm bundles={bundles} selected={selected} onSelect={select} shipping={shipping} bump={bump} />
        <Faq />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 text-center text-xs leading-relaxed text-slate-500">
        <p className="font-semibold text-slate-700">DERMAN™ Dermocare</p>
        <p className="mt-1">Notificación Sanitaria Obligatoria INVIMA {NSOC}</p>
        <p className="mx-auto mt-2 max-w-xl">{t('footer.legal')}</p>
      </footer>
    </div>
  );
}
