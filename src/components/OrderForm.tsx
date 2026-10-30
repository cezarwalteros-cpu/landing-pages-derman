import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Lock, MapPin, Truck } from 'lucide-react';
import { UNIT_PRICE, type Bundle } from '../config';
import { api, buscarCiudad, clean, DRY_RUN, eta, phone10, type Ciudad, type Shipping } from '../lib/checkout';
import { copShort } from '../lib/format';
import { pixel, trackingPayload } from '../lib/tracking';

type Props = {
  bundles: Bundle[];
  selected: string;
  onSelect: (id: string) => void;
  shipping: Shipping;
};

type Field = 'first_name' | 'last_name' | 'phone' | 'city' | 'address1' | 'additional' | 'shipping_option' | 'payment_method';
type Errors = Partial<Record<Field, string>>;

const fmtPhone = (v: string) =>
  phone10(v).slice(0, 10).replace(/^(\d{3})(\d{0,3})(\d{0,4}).*/, (_m, a, b, c) => [a, b, c].filter(Boolean).join(' '));

export function OrderForm({ bundles, selected, onSelect, shipping }: Props) {
  const bundle = bundles.find((b) => b.id === selected) ?? bundles[0];

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [additional, setAdditional] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [shipOpt, setShipOpt] = useState<'standard' | 'priority'>('standard');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ number: string; total: number } | null>(null);

  // Ciudad con buscador (municipios DANE del checkout)
  const [cityQ, setCityQ] = useState('');
  const [city, setCity] = useState<Ciudad | null>(null);
  const [cityItems, setCityItems] = useState<Ciudad[]>([]);
  const [cityOpen, setCityOpen] = useState(false);
  const [cityAct, setCityAct] = useState(-1);
  const cityReq = useRef(0);
  const cityTimer = useRef<number | undefined>(undefined);

  const phoneBlock = useRef<string | null>(null);
  const lastChecked = useRef('');
  const started = useRef(false);
  const cartKey = useRef('');
  const cartTimer = useRef<number | undefined>(undefined);

  const priority = shipOpt === 'priority' && shipping.priority ? shipping.priority : null;
  const shipCost = priority ? priority.price : 0;
  const total = bundle.price + shipCost;
  const regular = bundle.units * UNIT_PRICE;
  const save = Math.max((bundle.compare || regular) - bundle.price, 0);

  useEffect(() => {
    if (!shipping.priority && shipOpt === 'priority') setShipOpt('standard');
  }, [shipping.priority, shipOpt]);

  const setErr = (f: Field, msg?: string) => setErrors((e) => ({ ...e, [f]: msg }));

  const rules: Record<Exclude<Field, 'shipping_option' | 'payment_method'>, () => string | null> = {
    first_name: () => (clean(firstName).length >= 2 ? null : 'Escribe tu nombre'),
    last_name: () => (clean(lastName).length >= 2 ? null : 'Escribe tu apellido'),
    phone: () => (/^3\d{9}$/.test(phone10(phone)) ? phoneBlock.current : 'Número inválido: 10 dígitos y empieza por 3'),
    city: () => (city ? null : 'Escribe tu ciudad y elígela de la lista'),
    address1: () => {
      const t = clean(address1);
      return t.length >= 6 && /\d/.test(t) ? null : 'Escribe la dirección completa (calle y número)';
    },
    additional: () => (clean(additional).length >= 3 ? null : 'Escribe barrio, apto, casa o una referencia'),
  };
  const checkField = (f: keyof typeof rules) => setErr(f, rules[f]() ?? undefined);

  // --- Carrito abandonado: en cuanto hay celular válido ---
  function sendCart() {
    const p = phone10(phone);
    if (DRY_RUN || done || !/^3\d{9}$/.test(p)) return;
    const name = clean(`${firstName} ${lastName}`);
    const key = [p, name, bundle.id].join('|');
    if (key === cartKey.current) return;
    cartKey.current = key;
    api({ action: 'cart', phone: p, name, offer_key: bundle.id, bump: false, tracking: trackingPayload() }).catch(() => {});
  }
  const queueCart = () => {
    window.clearTimeout(cartTimer.current);
    cartTimer.current = window.setTimeout(sendCart, 800);
  };
  useEffect(() => {
    queueCart();
  }, [bundle.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const h = () => sendCart();
    window.addEventListener('pagehide', h);
    return () => window.removeEventListener('pagehide', h);
  });

  // --- Revisión del número (lista negra / pedido en las últimas 24 h) ---
  function onPhoneBlur() {
    const p = phone10(phone);
    if (phone) checkField('phone');
    queueCart();
    if (!/^3\d{9}$/.test(p) || p === lastChecked.current) return;
    lastChecked.current = p;
    api({ action: 'phone_check', phone: p })
      .then((j) => {
        phoneBlock.current =
          j && (j.blocked || j.cod_allowed === false)
            ? (j.message as string) || 'No podemos tomar pedidos contraentrega con este número.'
            : null;
        if (phoneBlock.current) setErr('phone', phoneBlock.current);
      })
      .catch(() => {});
  }

  // --- Ciudad ---
  function onCityInput(v: string) {
    setCityQ(v);
    setCity(null);
    window.clearTimeout(cityTimer.current);
    const q = clean(v);
    if (q.length < 2) {
      setCityOpen(false);
      return;
    }
    cityTimer.current = window.setTimeout(() => {
      const id = ++cityReq.current;
      buscarCiudad(q)
        .then((items) => {
          if (id !== cityReq.current) return;
          setCityItems(items);
          setCityAct(items.length ? 0 : -1);
          setCityOpen(true);
        })
        .catch(() => {});
    }, 180);
  }
  function pickCity(c: Ciudad) {
    setCityQ(`${c.municipio}, ${c.departamento}`);
    setCityOpen(false);
    if (c.solo_pago_anticipado) {
      setCity(null);
      setErr('city', `En ${c.municipio} no tenemos pago contra entrega por ahora.`);
    } else {
      setCity(c);
      setErr('city', undefined);
    }
    queueCart();
  }
  function onCityKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!cityOpen || !cityItems.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCityAct((a) => (a + 1) % cityItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCityAct((a) => (a - 1 + cityItems.length) % cityItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (cityAct >= 0) pickCity(cityItems[cityAct]);
    } else if (e.key === 'Escape') setCityOpen(false);
  }
  function onCityBlur() {
    window.setTimeout(() => {
      if (!city && cityItems.length === 1 && cityOpen) pickCity(cityItems[0]);
      setCityOpen(false);
    }, 150);
  }

  function onFocusForm() {
    if (started.current) return;
    started.current = true;
    pixel('InitiateCheckout', { value: bundle.price, currency: 'COP', num_items: bundle.units, content_name: 'DERMAN ' + bundle.title });
  }

  // --- Envío del pedido ---
  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (sending) return;
    setFormError('');
    const errs: Errors = {};
    (Object.keys(rules) as (keyof typeof rules)[]).forEach((f) => {
      const m = rules[f]();
      if (m) errs[f] = m;
    });
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.querySelector<HTMLElement>(`[data-f="${first}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSending(true);
    try {
      const j = await api({
        action: 'order',
        offer_key: bundle.id,
        bump: false,
        upsell: false,
        customer: { first_name: clean(firstName), last_name: clean(lastName), phone: phone10(phone) },
        address: { department: city!.departamento, city: city!.municipio, address1: clean(address1), additional: clean(additional) },
        shipping_option: shipOpt,
        payment_method: 'cod',
        website,
        tracking: trackingPayload(),
        ...(DRY_RUN ? { dry_run: true } : {}),
      });
      if (!j.success) {
        if (j.fields) {
          const mapped: Errors = {};
          Object.entries(j.fields).forEach(([k, m]) => {
            mapped[(k === 'full_name' ? 'first_name' : k) as Field] = m;
          });
          setErrors((e) => ({ ...e, ...mapped }));
        }
        setFormError(j.error || 'No pudimos registrar tu pedido. Intenta de nuevo.');
        return;
      }
      window.clearTimeout(cartTimer.current);
      const t = j.total_cop || total;
      if (j.event_id && j.event_id !== 'dry_run') {
        pixel('Purchase', { value: t, currency: 'COP', num_items: bundle.units, content_name: 'DERMAN ' + bundle.title }, j.event_id);
      }
      setDone({ number: j.order_number || '', total: t });
      window.setTimeout(() => document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch {
      setFormError('No pudimos registrar tu pedido. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <section id="pedido" className="bg-brand-900 px-4 py-14">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl" role="status" aria-live="polite">
          <CheckCircle2 className="mx-auto h-14 w-14 text-brand-600" aria-hidden />
          <h2 className="mt-3 text-2xl font-extrabold">¡Pedido recibido!</h2>
          {DRY_RUN && <p className="mt-2 rounded-lg bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">MODO PRUEBA · no se creó ningún pedido</p>}
          <p className="mt-3 text-slate-600">
            Te escribiremos al WhatsApp <b className="text-ink">{fmtPhone(phone)}</b> para confirmar tu pedido. Ten tu celular a
            la mano.
          </p>
          <p className="mt-3 text-slate-600">
            Total a pagar al recibir: <b className="text-ink">{copShort(done.total)}</b>
          </p>
          {done.number && (
            <span className="mt-4 inline-block rounded-full bg-brand-50 px-4 py-1 text-sm font-bold text-brand-700">Pedido {done.number}</span>
          )}
        </div>
      </section>
    );
  }

  const fieldCls = (f: Field) => `field ${errors[f] ? 'field-error' : ''}`;

  return (
    <section id="pedido" className="bg-brand-900 px-4 py-14">
      <div className="mx-auto max-w-xl">
        <h2 className="text-center text-2xl font-extrabold text-white md:text-3xl">Completa tu pedido</h2>
        <p className="mt-2 text-center text-sm text-brand-100">Pagas en efectivo al recibir · Empaque 100% discreto</p>
        {DRY_RUN && (
          <p className="mx-auto mt-3 w-fit rounded-lg bg-amber-300 px-3 py-1 text-xs font-bold text-amber-950">
            MODO PRUEBA (?prueba=1): valida todo pero no crea pedidos
          </p>
        )}

        <form onSubmit={submit} onFocus={onFocusForm} noValidate autoComplete="on" className="mt-6 space-y-4 rounded-3xl bg-white p-5 shadow-xl md:p-7">
          {/* Plan */}
          <div>
            <div className="mb-2 text-sm font-bold text-ink">1. Elige tu pack</div>
            <div className="space-y-2" role="radiogroup" aria-label="Pack">
              {bundles.map((b) => {
                const on = b.id === bundle.id;
                const reg = b.compare || b.units * UNIT_PRICE;
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onSelect(b.id)}
                    className={`relative flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                      on ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {b.badge && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">{b.badge}</span>
                    )}
                    <span className={`h-5 w-5 shrink-0 rounded-full border-2 ${on ? 'border-brand-600 bg-brand-600 ring-4 ring-inset ring-white' : 'border-slate-300'}`} />
                    <span className="flex-1">
                      <b className="block text-sm text-ink">{b.title}</b>
                      <span className="text-xs text-slate-500">{b.subtitle}</span>
                    </span>
                    <span className="text-right">
                      <b className="block text-ink">{copShort(b.price)}</b>
                      {reg > b.price && <s className="text-xs text-slate-400">{copShort(reg)}</s>}
                      {b.units > 1 && <em className="block text-[11px] not-italic text-brand-700">{copShort(Math.round(b.price / b.units / 100) * 100)} c/u</em>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-sm font-bold text-ink">2. ¿A dónde te lo enviamos?</div>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrap f="first_name" label="Nombre" error={errors.first_name}>
              <input name="first_name" autoComplete="given-name" maxLength={60} value={firstName}
                onChange={(e) => setFirstName(e.target.value)} onBlur={() => { if (firstName) checkField('first_name'); queueCart(); }}
                className={fieldCls('first_name')} />
            </FieldWrap>
            <FieldWrap f="last_name" label="Apellido" error={errors.last_name}>
              <input name="last_name" autoComplete="family-name" maxLength={60} value={lastName}
                onChange={(e) => setLastName(e.target.value)} onBlur={() => { if (lastName) checkField('last_name'); queueCart(); }}
                className={fieldCls('last_name')} />
            </FieldWrap>
          </div>

          <FieldWrap f="phone" label="Celular / WhatsApp" error={errors.phone}>
            <div className="flex">
              <span className="flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm font-bold text-slate-600">+57</span>
              <input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="300 123 4567" maxLength={14}
                value={phone} onChange={(e) => { setPhone(fmtPhone(e.target.value)); phoneBlock.current = null; }} onBlur={onPhoneBlur}
                className={`${fieldCls('phone')} rounded-l-none`} />
            </div>
          </FieldWrap>

          <FieldWrap f="city" label="Ciudad o municipio" error={errors.city}>
            <div className="relative">
              <MapPin className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${city ? 'text-brand-600' : 'text-slate-400'}`} aria-hidden />
              <input name="city_q" autoComplete="off" placeholder="Escribe y elige de la lista" maxLength={60} role="combobox"
                aria-expanded={cityOpen} aria-controls="dmCityList" aria-autocomplete="list"
                value={cityQ} onChange={(e) => onCityInput(e.target.value)} onKeyDown={onCityKey} onBlur={onCityBlur}
                className={`${fieldCls('city')} pl-9 ${city ? 'border-brand-500' : ''}`} />
              {cityOpen && (
                <ul id="dmCityList" role="listbox" className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  {cityItems.length ? (
                    cityItems.map((c, i) => (
                      <li key={`${c.municipio}-${c.departamento}`} role="option" aria-selected={i === cityAct}
                        onMouseDown={(e) => { e.preventDefault(); pickCity(c); }}
                        className={`flex cursor-pointer items-baseline justify-between gap-2 px-4 py-2.5 text-sm ${i === cityAct ? 'bg-brand-50' : 'hover:bg-slate-50'}`}>
                        <b className="text-ink">{c.municipio}</b>
                        <span className="text-xs text-slate-500">{c.departamento}</span>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-sm text-slate-500">No encontramos esa ciudad. Revisa cómo la escribiste.</li>
                  )}
                </ul>
              )}
            </div>
          </FieldWrap>

          <FieldWrap f="address1" label="Dirección" error={errors.address1}>
            <input name="address1" autoComplete="street-address" placeholder="Ej: Calle 45 # 23-10" maxLength={160} value={address1}
              onChange={(e) => setAddress1(e.target.value)} onBlur={() => { if (address1) checkField('address1'); queueCart(); }}
              className={fieldCls('address1')} />
          </FieldWrap>

          <FieldWrap f="additional" label="Barrio y referencia" error={errors.additional}>
            <input name="additional" placeholder="Barrio, apto, casa o una referencia" maxLength={160} value={additional}
              onChange={(e) => setAdditional(e.target.value)} onBlur={() => { if (additional) checkField('additional'); queueCart(); }}
              className={fieldCls('additional')} />
          </FieldWrap>

          {/* honeypot antibots */}
          <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website}
            onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          <div>
            <div className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink">
              <Truck className="h-4 w-4 text-brand-600" aria-hidden /> 3. Envío
            </div>
            <div className="space-y-2" role="radiogroup" aria-label="Envío">
              {[
                { k: 'standard' as const, t: shipping.standard.title, d: shipping.standard.description, p: 0 },
                ...(shipping.priority ? [{ k: 'priority' as const, t: shipping.priority.title, d: shipping.priority.description, p: shipping.priority.price }] : []),
              ].map((o) => {
                const on = shipOpt === o.k;
                return (
                  <button key={o.k} type="button" role="radio" aria-checked={on} onClick={() => setShipOpt(o.k)}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${on ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <span className={`h-4 w-4 shrink-0 rounded-full border-2 ${on ? 'border-brand-600 bg-brand-600 ring-[3px] ring-inset ring-white' : 'border-slate-300'}`} />
                    <span className="flex-1">
                      <b className="block text-sm text-ink">{o.t}</b>
                      {o.d && <small className="text-xs text-slate-500">{o.d}</small>}
                    </span>
                    <span className={`text-sm font-bold ${o.p ? 'text-ink' : 'text-brand-700'}`}>{o.p ? '+' + copShort(o.p) : 'Gratis'}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500">Si pides hoy, llega <b className="text-ink">{eta(!!priority)}</b>.</p>
          </div>

          {/* Resumen */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="flex justify-between gap-2">
              <span>DERMAN™ · {bundle.title}</span>
              <span className="whitespace-nowrap">
                {save > 0 && <s className="mr-1 text-slate-400">{copShort(bundle.price + save)}</s>}
                {copShort(bundle.price)}
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span>Envío {priority ? priority.title : ''}</span>
              <span className={shipCost ? '' : 'font-semibold text-brand-700'}>{shipCost ? copShort(shipCost) : 'Gratis'}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold">
              <span>Total</span>
              <span>{copShort(total)}</span>
            </div>
            {save > 0 && <p className="mt-1 text-right text-xs font-semibold text-brand-700">Ahorras {copShort(save)} en este pedido</p>}
          </div>

          {(errors.shipping_option || errors.payment_method) && (
            <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
              {errors.shipping_option || errors.payment_method}
            </div>
          )}
          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
              {formError}
            </div>
          )}

          <button type="submit" disabled={sending}
            className="flex w-full items-center justify-between gap-3 rounded-2xl bg-brand-600 px-5 py-4 text-left text-white shadow-lg transition hover:bg-brand-700 disabled:cursor-wait disabled:opacity-70">
            <span className="flex items-center gap-2">
              {sending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Lock className="h-5 w-5" aria-hidden />}
              <span>
                <b className="block text-sm font-extrabold leading-tight md:text-base">
                  {sending ? 'Enviando tu pedido…' : 'CONFIRMAR MI PEDIDO Y PAGAR AL RECIBIR'}
                </b>
                <small className="text-xs text-brand-100">Pagas en efectivo al recibir</small>
              </span>
            </span>
            <span className="text-lg font-extrabold">{copShort(total)}</span>
          </button>
          <p className="text-center text-xs text-slate-500">Tus datos solo se usan para enviar tu pedido.</p>
        </form>
      </div>
    </section>
  );
}

function FieldWrap({ f, label, error, children }: { f: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div data-f={f}>
      <label className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
}
