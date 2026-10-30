import { useEffect, useRef, useState } from 'react';
import { DEFAULT_BUNDLE, GIF_SLOTS, NSOC, BUNDLES, type Bundle } from './config';
import { Header, TopBar } from './components/Header';
import { Gallery } from './components/Gallery';
import { BuyBox } from './components/BuyBox';
import { Awareness, Comparison, GifSlot, Ingredients, Privacy } from './components/Sections';
import { OrderForm } from './components/OrderForm';
import { Faq } from './components/Faq';
import { initPixel, pixel, track } from './lib/tracking';
import { LOREM, useT } from './lib/textos';

export default function App() {
  const t = useT();
  const [selected, setSelected] = useState<Bundle['id']>(DEFAULT_BUNDLE);
  const scrolled = useRef({ s50: false, s90: false });

  useEffect(() => {
    initPixel();
    track('page_view');
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
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const select = (id: Bundle['id']) => {
    setSelected(id);
    track('plan_select', { plan: id });
  };

  const goToOrder = () => {
    const b = BUNDLES.find((x) => x.id === selected)!;
    track('cta_click', { plan: selected });
    pixel('InitiateCheckout', { value: b.price, currency: 'COP', num_items: b.units });
    document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="top">
      <TopBar />
      <Header />

      <main>
        <section className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-2 md:gap-10 md:py-10">
          <Gallery />
          <BuyBox selected={selected} onSelect={select} onOrder={goToOrder} />
        </section>

        <GifSlot src={GIF_SLOTS.textura} label="Textura ligera que se absorbe al instante" badge="Textura y absorción" />

        <Awareness />
        <Ingredients />

        <GifSlot src={GIF_SLOTS.aplicacion} label={t('gif2.leyenda', LOREM.t)} badge="Mecanismo de acción" />

        <Privacy />
        <Comparison />
        <OrderForm selected={selected} onSelect={select} />
        <Faq />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 text-center text-xs leading-relaxed text-slate-500">
        <p className="font-semibold text-slate-700">DERMAN™ Dermocare</p>
        <p className="mt-1">Notificación Sanitaria Obligatoria INVIMA {NSOC}</p>
        <p className="mx-auto mt-2 max-w-xl">
          {t('footer.legal')}
        </p>
      </footer>
    </div>
  );
}
