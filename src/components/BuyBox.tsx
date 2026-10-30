import { CheckCircle2, HandCoins, Package, ShieldCheck, Star } from 'lucide-react';
import { BUNDLES, NSOC, UNIT_PRICE, type Bundle } from '../config';
import { copShort } from '../lib/format';
import { LOREM, useT } from '../lib/textos';

type Props = {
  selected: Bundle['id'];
  onSelect: (id: Bundle['id']) => void;
  onOrder: () => void;
};

export function BuyBox({ selected, onSelect, onOrder }: Props) {
  const t = useT();
  const rating = parseFloat(t('reviews.rating').replace(',', '.'));
  const conteo = parseInt(t('reviews.conteo').replace(/\D/g, ''), 10);
  const showReviews = !Number.isNaN(rating) && !Number.isNaN(conteo);
  return (
    <div>
      {showReviews && (
        <div className="flex items-center gap-2 text-sm">
          <div className="flex text-amber-400" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span className="font-semibold text-ink">{rating.toFixed(1)}/5</span>
          <span className="text-slate-500">· +{conteo.toLocaleString('es-CO')} valoraciones</span>
        </div>
      )}

      <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
        {t('hero.titulo', LOREM.t)}
      </h1>

      <p className="mt-3 rounded-xl border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
        {t('hero.kicker', LOREM.p)}
      </p>

      <fieldset className="mt-5 space-y-3">
        <legend className="mb-1 text-sm font-semibold text-slate-700">Elige tu pack:</legend>
        {BUNDLES.map((b) => {
          const isSel = b.id === selected;
          const regular = b.units * UNIT_PRICE;
          const saving = regular - b.price;
          return (
            <label
              key={b.id}
              className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${
                isSel ? 'border-brand-500 bg-brand-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {b.badge && (
                <span className="absolute -top-3 left-4 rounded-full bg-brand-600 px-3 py-0.5 text-[11px] font-bold tracking-wide text-white shadow">
                  {b.badge}
                </span>
              )}
              <input
                type="radio"
                name="bundle"
                value={b.id}
                checked={isSel}
                onChange={() => onSelect(b.id)}
                className="h-5 w-5 accent-brand-600"
              />
              <div className="flex-1">
                <div className="font-bold text-ink">{b.title}</div>
                <div className="text-xs text-slate-500">{b.subtitle}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-ink">{copShort(b.price)}</div>
                {saving > 0 && (
                  <div className="text-xs">
                    <span className="text-slate-400 line-through">{copShort(regular)}</span>{' '}
                    <span className="font-semibold text-brand-700">Ahorras {copShort(saving)}</span>
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </fieldset>

      <button
        type="button"
        onClick={onOrder}
        className="mt-5 w-full animate-pulseGlow rounded-2xl bg-brand-600 px-6 py-4 text-base font-extrabold tracking-wide text-white shadow-lg transition hover:bg-brand-700 md:text-lg"
      >
        👉 ORDENAR AHORA - PAGO CONTRA ENTREGA
      </button>

      <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-700 sm:text-xs">
        <li className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2">
          <Package className="h-5 w-5 text-brand-600" aria-hidden />
          Despacho discreto
        </li>
        <li className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2">
          <HandCoins className="h-5 w-5 text-brand-600" aria-hidden />
          Pago al repartidor
        </li>
        <li className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2">
          <ShieldCheck className="h-5 w-5 text-brand-600" aria-hidden />
          Registro INVIMA
        </li>
      </ul>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <CheckCircle2 className="h-4 w-4 text-brand-600" aria-hidden />
        Notificación Sanitaria Obligatoria INVIMA {NSOC}
      </p>
    </div>
  );
}
