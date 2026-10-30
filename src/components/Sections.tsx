import { Check, Droplets, Flame, Lock, Minus, RefreshCw, Stethoscope, Wind, X } from 'lucide-react';
import { LOREM, useT } from '../lib/textos';

export function GifSlot({ src, label, badge }: { src: string; label: string; badge: string }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6">
      <figure className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
        <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-700 shadow ring-1 ring-brand-100 backdrop-blur">
          {badge}
        </span>
        <img src={src} alt={label} className="aspect-[13/7] w-full object-cover" loading="lazy" />
        <figcaption className="px-4 py-3 text-center text-sm font-medium text-slate-600">{label}</figcaption>
      </figure>
    </section>
  );
}

const CARD_ICONS = [Droplets, Flame, RefreshCw, Wind];

export function Awareness() {
  const t = useT();
  const aviso = t('aviso.texto');
  return (
    <section className="bg-slate-50">
      <div className="section">
        <h2 className="section-title">{t('conciencia.titulo', LOREM.t)}</h2>
        <p className="section-lead">{t('conciencia.lead', LOREM.p)}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {CARD_ICONS.map((Icon, i) => (
            <article key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-3 text-lg font-bold">{t(`tarjeta${i + 1}.titulo`, LOREM.t)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{t(`tarjeta${i + 1}.texto`, LOREM.p)}</p>
            </article>
          ))}
        </div>
        {aviso && (
          <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <Stethoscope className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p>{aviso}</p>
          </div>
        )}
      </div>
    </section>
  );
}

const INGREDIENTS = ['Ácido Undecilénico', 'Ácido Salicílico', 'Lanolina pura', 'L-Arginina'];

export function Ingredients() {
  const t = useT();
  return (
    <section className="section">
      <h2 className="section-title">{t('ingredientes.titulo', LOREM.t)}</h2>
      <p className="section-lead">{t('ingredientes.mecanismo', LOREM.p)}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {INGREDIENTS.map((name, i) => (
          <article key={name} className="flex gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-extrabold text-white">
              {i + 1}
            </div>
            <div>
              <h3 className="font-bold text-ink">{name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{t(`ing${i + 1}.texto`, LOREM.p)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Privacy() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-brand-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:text-left">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white">
          <Lock className="h-8 w-8" aria-hidden />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">Cero vergüenza al recibir tu paquete</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Tu pedido llega en bolsa sellada y neutra, sin logos ni descripciones comprometedoras en la guía de envío.
            Nadie sabe qué hay adentro: ni el portero, ni tu familia, ni el repartidor.
          </p>
        </div>
      </div>
    </section>
  );
}

type Cell = 'yes' | 'no' | 'partial';
const ROWS: { label: string; derman: Cell; ungüento: Cell; talco: Cell }[] = [
  { label: 'Formulada para la piel íntima externa', derman: 'yes', ungüento: 'partial', talco: 'no' },
  { label: 'Calma ardor y puntos rojos por roce o afeitado', derman: 'yes', ungüento: 'partial', talco: 'no' },
  { label: 'Ayuda con granitos y vellos encarnados', derman: 'yes', ungüento: 'no', talco: 'no' },
  { label: 'Hidrata sin resecar', derman: 'yes', ungüento: 'partial', talco: 'no' },
  { label: 'No deja sensación grasosa ni manchas', derman: 'yes', ungüento: 'no', talco: 'partial' },
  { label: 'Para hombres y mujeres', derman: 'yes', ungüento: 'partial', talco: 'yes' },
  { label: 'Envío discreto y pago contra entrega', derman: 'yes', ungüento: 'no', talco: 'no' },
];

function Mark({ v }: { v: Cell }) {
  if (v === 'yes') return <Check className="mx-auto h-5 w-5 text-brand-600" aria-label="Sí" />;
  if (v === 'partial') return <Minus className="mx-auto h-5 w-5 text-amber-500" aria-label="A veces" />;
  return <X className="mx-auto h-5 w-5 text-red-500" aria-label="No" />;
}

export function Comparison() {
  return (
    <section className="bg-slate-50">
      <div className="section">
        <h2 className="section-title">¿Por qué Derman y no lo de siempre?</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 text-left font-semibold"> </th>
                <th className="bg-brand-600 px-3 py-3 text-center font-bold text-white">Derman™</th>
                <th className="px-3 py-3 text-center font-semibold">Ungüentos genéricos de farmacia</th>
                <th className="px-3 py-3 text-center font-semibold">Talcos / jabones comerciales</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-700">{r.label}</td>
                  <td className="bg-brand-50 px-3 py-3">
                    <Mark v={r.derman} />
                  </td>
                  <td className="px-3 py-3">
                    <Mark v={r.ungüento} />
                  </td>
                  <td className="px-3 py-3">
                    <Mark v={r.talco} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
