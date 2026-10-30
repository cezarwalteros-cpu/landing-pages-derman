import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LOREM, useT } from '../lib/textos';

const FAQS_FIJAS = [
  {
    q: '¿Cómo se aplica?',
    a: 'Lava y seca bien la zona. Aplica una capa delgada en la piel externa con irritación o roce, 1 o 2 veces al día. Después de afeitarte, aplícala sobre la piel seca para calmar el ardor.',
  },
  {
    q: '¿Cuánto se demora la entrega?',
    a: 'En ciudades principales llega normalmente entre 2 y 4 días hábiles; en municipios y zonas alejadas puede tardar un poco más. Te escribimos por WhatsApp para confirmar tu dirección antes de despachar.',
  },
  {
    q: '¿Cómo pago? ¿Tengo que pagar algo por adelantado?',
    a: 'No pagas nada por adelantado. Pagas en efectivo al repartidor cuando recibes tu paquete. El envío es gratis.',
  },
  {
    q: '¿El paquete dice lo que lleva adentro?',
    a: 'No. Llega en bolsa sellada y neutra, sin logos ni descripciones del producto en la guía.',
  },
];

export function Faq() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  const FAQS = [
    { q: t('faq1.pregunta', LOREM.t + '?'), a: t('faq1.respuesta', LOREM.p) },
    { q: t('faq2.pregunta', LOREM.t + '?'), a: t('faq2.respuesta', LOREM.p) },
    ...FAQS_FIJAS,
  ].filter((f) => f.q && f.a);
  return (
    <section className="section">
      <h2 className="section-title">Preguntas frecuentes</h2>
      <div className="mx-auto mt-8 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink"
              >
                {f.q}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
