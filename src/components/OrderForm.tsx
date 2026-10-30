import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { BUNDLES, UNIT_PRICE, type Bundle } from '../config';
import { CIUDADES_SIN_COD, DEPARTAMENTOS, DEPARTAMENTOS_SIN_COD } from '../data/departamentos';
import { isValidPhone, sendCart, sendOrder, type OrderForm as Form } from '../lib/api';
import { copShort } from '../lib/format';
import { pixel } from '../lib/tracking';

type Props = {
  selected: Bundle['id'];
  onSelect: (id: Bundle['id']) => void;
};

const EMPTY: Form = { nombre: '', telefono: '', departamento: '', ciudad: '', direccion: '', barrio: '' };

type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (f.nombre.trim().split(/\s+/).length < 2) e.nombre = 'Escribe nombre y apellido';
  if (!isValidPhone(f.telefono)) e.telefono = 'Celular de 10 dígitos que empiece por 3';
  if (!f.departamento) e.departamento = 'Elige tu departamento';
  if (f.ciudad.trim().length < 3) e.ciudad = 'Escribe tu ciudad o municipio';
  if (f.direccion.trim().length < 6) e.direccion = 'Escribe la dirección completa';
  if (f.barrio.trim().length < 2) e.barrio = 'Escribe tu barrio';
  return e;
}

export function OrderForm({ selected, onSelect }: Props) {
  const bundle = BUNDLES.find((b) => b.id === selected)!;
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [orderNumber, setOrderNumber] = useState('');
  const [serverError, setServerError] = useState('');
  const cartTimer = useRef<number | undefined>(undefined);

  // Carrito abandonado: se envía cuando hay un celular válido (con pausa para no saturar)
  useEffect(() => {
    if (status === 'done' || !isValidPhone(form.telefono)) return;
    window.clearTimeout(cartTimer.current);
    cartTimer.current = window.setTimeout(() => sendCart(form, bundle), 1500);
    return () => window.clearTimeout(cartTimer.current);
  }, [form.telefono, form.nombre, bundle, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: keyof Form) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: ev.target.value }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const noCod =
    DEPARTAMENTOS_SIN_COD.includes(form.departamento) ||
    CIUDADES_SIN_COD.some((c) => form.ciudad.trim().toLowerCase().includes(c));

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = document.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`);
      first?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    const res = await sendOrder(form, bundle);
    if (res.ok) {
      setOrderNumber(res.orderNumber);
      setStatus('done');
      pixel('Purchase', { value: bundle.price, currency: 'COP', content_name: 'Derman', num_items: bundle.units }, res.orderNumber);
      document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setServerError(res.error);
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <section id="pedido" className="bg-brand-900 px-4 py-14 text-white">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center text-ink shadow-xl">
          <CheckCircle2 className="mx-auto h-14 w-14 text-brand-600" aria-hidden />
          <h2 className="mt-3 text-2xl font-extrabold">¡Pedido recibido!</h2>
          <p className="mt-2 text-slate-600">
            Tu número de pedido es <strong className="text-ink">{orderNumber}</strong>.
          </p>
          <p className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
            En los próximos minutos te escribimos por WhatsApp al <strong>{form.telefono}</strong> para confirmar tu
            dirección. Pagas {copShort(bundle.price)} en efectivo cuando recibas tu paquete discreto.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="pedido" className="bg-brand-900 px-4 py-14">
      <div className="mx-auto max-w-xl">
        <h2 className="text-center text-2xl font-extrabold text-white md:text-3xl">Completa tu pedido</h2>
        <p className="mt-2 text-center text-sm text-brand-100">Pagas al recibir. Sin tarjetas ni pagos por adelantado.</p>

        <form onSubmit={submit} noValidate className="mt-6 space-y-4 rounded-3xl bg-white p-5 shadow-xl md:p-7">
          {/* Resumen dinámico */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">Tu pedido</div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-ink">Derman™ · {bundle.title}</div>
                <div className="text-xs text-slate-500">
                  {bundle.units} {bundle.units === 1 ? 'frasco' : 'frascos'} de 30 ml · Envío gratis
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-ink">{copShort(bundle.price)}</div>
                {bundle.units > 1 && (
                  <div className="text-xs text-slate-400 line-through">{copShort(bundle.units * UNIT_PRICE)}</div>
                )}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {BUNDLES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onSelect(b.id)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                    b.id === selected
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-brand-500'
                  }`}
                >
                  {b.units} {b.units === 1 ? 'frasco' : 'frascos'}
                </button>
              ))}
            </div>
          </div>

          <Field label="Nombre completo" error={errors.nombre}>
            <input
              name="nombre"
              autoComplete="name"
              value={form.nombre}
              onChange={set('nombre')}
              placeholder="Ej: Juan Pérez"
              className={`field ${errors.nombre ? 'field-error' : ''}`}
            />
          </Field>

          <Field label="Teléfono / WhatsApp" error={errors.telefono}>
            <input
              name="telefono"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={form.telefono}
              onChange={set('telefono')}
              placeholder="300 123 4567"
              className={`field ${errors.telefono ? 'field-error' : ''}`}
            />
          </Field>

          <Field label="Departamento" error={errors.departamento}>
            <select
              name="departamento"
              value={form.departamento}
              onChange={set('departamento')}
              className={`field ${errors.departamento ? 'field-error' : ''}`}
            >
              <option value="">Selecciona tu departamento</option>
              {DEPARTAMENTOS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Ciudad / Municipio" error={errors.ciudad}>
            <input
              name="ciudad"
              autoComplete="address-level2"
              value={form.ciudad}
              onChange={set('ciudad')}
              placeholder="Ej: Medellín"
              className={`field ${errors.ciudad ? 'field-error' : ''}`}
            />
          </Field>

          {noCod && (
            <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
              En esta zona la transportadora no recibe pago contra entrega. Igual deja tu pedido y te escribimos por
              WhatsApp para coordinar el pago.
            </div>
          )}

          <Field label="Dirección" error={errors.direccion}>
            <input
              name="direccion"
              autoComplete="street-address"
              value={form.direccion}
              onChange={set('direccion')}
              placeholder="Calle, carrera, número, apto o casa"
              className={`field ${errors.direccion ? 'field-error' : ''}`}
            />
          </Field>

          <Field label="Barrio" error={errors.barrio}>
            <input
              name="barrio"
              value={form.barrio}
              onChange={set('barrio')}
              placeholder="Ej: Laureles"
              className={`field ${errors.barrio ? 'field-error' : ''}`}
            />
          </Field>

          {status === 'error' && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              No pudimos registrar tu pedido ({serverError}). Inténtalo de nuevo en un momento.
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-4 text-base font-extrabold text-white shadow-lg transition hover:bg-brand-700 disabled:cursor-wait disabled:opacity-70"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Enviando pedido…
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" aria-hidden /> CONFIRMAR MI PEDIDO Y PAGAR AL RECIBIR
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-500">Tus datos solo se usan para enviar tu pedido.</p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}
