import { useT } from '../lib/textos';

export function GifSlot({ src, label, badge }: { src: string; label: string; badge: string }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <div className="absolute left-4 top-4 z-10 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase backdrop-blur-sm">
          {badge}
        </div>
        <div className="flex min-h-[260px] items-center justify-center bg-slate-950/60 p-4">
          <img src={src} alt={label} className="max-h-[360px] w-auto object-contain rounded-lg" />
        </div>
        <div className="border-t border-slate-800 bg-slate-900/90 p-4 text-center text-sm font-medium text-slate-300">
          {label}
        </div>
      </div>
    </section>
  );
}

export function Awareness() {
  const t = useT();

  const cards = [
    {
      titulo: t('awareness.card1.titulo', 'Tiña Inguinal y Candidiasis'),
      desc: t(
        'awareness.card1.desc',
        'El hongo se alimenta de queratina y se multiplica en los pliegues húmedos, generando una comezón descontrolada que empeora con agua caliente o jabones perfumados.'
      ),
      icon: '🦠',
      tag: 'FASE 1: COLONIZACIÓN',
    },
    {
      titulo: t('awareness.card2.titulo', 'Balanitis y Puntos Rojos'),
      desc: t(
        'awareness.card2.desc',
        'Ardor punzante, resequedad con micro-grietas en glande o prepucio, e hipersensibilidad dolorosa al roce de la tela o al tener intimidad.'
      ),
      icon: '🔥',
      tag: 'FASE 2: INFLAMACIÓN AGUDA',
    },
    {
      titulo: t('awareness.card3.titulo', 'El Círculo Vicioso del Rascado'),
      desc: t(
        'awareness.card3.desc',
        'Rascarte de forma inconsciente rompe la primera capa de piel, dispersando las esporas fúngicas hacia la entrepierna y abriendo paso a infecciones bacterianas.'
      ),
      icon: '⚠️',
      tag: 'FASE 3: DISEMINACIÓN',
    },
    {
      titulo: t('awareness.card4.titulo', 'Fermentación y Mal Olor Agrio'),
      desc: t(
        'awareness.card4.desc',
        'La flora alterada descompone el sudor acumulado en horas de calor o deporte, generando un olor penetrante que los talcos comunes solo empeoran al crear grumos.'
      ),
      icon: '🛑',
      tag: 'FASE 4: DESCOMPOSICIÓN',
    },
  ];

  return (
    <section className="bg-slate-900 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-red-500/20 px-3 py-1 text-xs font-extrabold tracking-wider text-red-400 uppercase">
            Nivel de Conciencia Médica
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white md:text-4xl">
            {t('awareness.titulo', 'No es sudor normal: Por qué la picazón y el ardor no ceden')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            {t(
              'awareness.intro',
              'La zona íntima masculina combina tres aceleradores críticos: calor continuo, tela sintética apretada y humedad retenida. Este microambiente es el caldo de cultivo donde los dermatofitos destruyen tu barrera cutánea.'
            )}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-6">
          {cards.map((c, i) => (
            <div key={i} className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{c.icon}</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">{c.tag}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{c.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Ingredients() {
  const t = useT();

  const items = [
    {
      titulo: t('ingredients.item1.titulo', 'Ácido Undecilénico Activo'),
      desc: t(
        'ingredients.item1.desc',
        'Inhibe la reproducción de Candida y destruye la biopelícula fúngica que las cremas comunes no logran disolver.'
      ),
      badge: 'Acción Antifúngica de Choque',
    },
    {
      titulo: t('ingredients.item2.titulo', 'Ácido Salicílico Micro-Dosificado'),
      desc: t(
        'ingredients.item2.desc',
        'Exfolia químicamente el estrato córneo infectado, desprendiendo células descamadas y destapando los poros.'
      ),
      badge: 'Exfoliación y Penetración',
    },
    {
      titulo: t('ingredients.item3.titulo', 'Lanolina Pura Grado Emoliente'),
      desc: t(
        'ingredients.item3.desc',
        'Crea una película protectora invisible y transpirable que corta el dolor por roce de los muslos al caminar.'
      ),
      badge: 'Escudo Anti-Fricción',
    },
    {
      titulo: t('ingredients.item4.titulo', 'L-Arginina Regenerativa'),
      desc: t(
        'ingredients.item4.desc',
        'Reactiva la microcirculación cutánea, cerrando micro-fisuras y devolviendo la elasticidad natural a la piel.'
      ),
      badge: 'Cicatrización Rápida',
    },
  ];

  return (
    <section className="bg-slate-950 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold tracking-wider text-emerald-400 uppercase">
            Sinergia Bioactiva
          </span>
          <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
            {t('ingredients.titulo', 'La fórmula de choque contra la micosis íntima')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
            {t(
              'ingredients.subtitulo',
              'A diferencia de las cremas cosméticas espesas que asfixian la piel y alimentan al hongo, Derman combina activos clínicos de acción dirigida.'
            )}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-6">
          {items.map((it, i) => (
            <div key={i} className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6">
              <span className="text-[11px] font-bold text-emerald-400 uppercase">{it.badge}</span>
              <h3 className="mt-2 text-base font-bold text-white">{it.titulo}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Privacy() {
  const t = useT();
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl border-2 border-emerald-500/40 bg-slate-900 p-6 text-white shadow-2xl md:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-3xl text-emerald-400">
            🔒
          </div>
          <h3 className="mt-4 text-xl font-black text-white md:text-2xl">
            {t('privacy.titulo', 'PRIVACIDAD BLINDADA: CERO VERGÜENZA AL RECIBIR')}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-slate-300">
            {t('privacy.p1', 'Tu privacidad es innegociable. Tu tratamiento se despacha en un empaque 100% neutro, opaco y sellado al vacío.')}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-950/70 p-4 text-center border border-slate-800">
            <p className="text-xs font-bold text-emerald-400">RÓTULO ANÓNIMO</p>
            <p className="mt-1 text-xs text-slate-400">
              {t('privacy.p2', 'En la guía NO aparece la palabra "hongos", "zona íntima" ni nada similar. Solo tus datos y el valor a cobrar.')}
            </p>
          </div>
          <div className="rounded-lg bg-slate-950/70 p-4 text-center border border-slate-800">
            <p className="text-xs font-bold text-emerald-400">REPARTIDOR A CIEGAS</p>
            <p className="mt-1 text-xs text-slate-400">
              El mensajero solo entrega una caja logística estándar. Nadie sabe qué hay dentro.
            </p>
          </div>
          <div className="rounded-lg bg-slate-950/70 p-4 text-center border border-slate-800">
            <p className="text-xs font-bold text-emerald-400">PAGO SEGURO</p>
            <p className="mt-1 text-xs text-slate-400">
              {t('privacy.p3', 'Pagas en efectivo al recibir en tu puerta. Sin registros de tarjeta en extractos bancarios.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Comparison() {
  return (
    <section className="bg-slate-950 py-12 text-white">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl font-black md:text-3xl">¿Por qué Derman vs. Soluciones Tradicionales?</h2>
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-800/80 text-slate-200 uppercase">
              <tr>
                <th className="p-3 md:p-4">Criterio</th>
                <th className="p-3 font-bold text-emerald-400 md:p-4">Derman™ Activo</th>
                <th className="p-3 text-slate-400 md:p-4">Cremas Genéricas / Talcos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="p-3 font-medium md:p-4">Acción en pliegues íntimos</td>
                <td className="p-3 font-bold text-emerald-400 md:p-4">Fórmula balanceada para pH genital</td>
                <td className="p-3 text-red-400 md:p-4">Grasosas o con perfumes irritantes</td>
              </tr>
              <tr>
                <td className="p-3 font-medium md:p-4">Absorción</td>
                <td className="p-3 font-bold text-emerald-400 md:p-4">Secado instantáneo sin manchar ropa</td>
                <td className="p-3 text-red-400 md:p-4">Deja película blanca pegajosa o grumos</td>
              </tr>
              <tr>
                <td className="p-3 font-medium md:p-4">Ataque a la causa</td>
                <td className="p-3 font-bold text-emerald-400 md:p-4">Ácido Undecilénico disuelve el biofilm</td>
                <td className="p-3 text-red-400 md:p-4">Solo alivio temporal momentáneo</td>
              </tr>
              <tr>
                <td className="p-3 font-medium md:p-4">Privacidad en compra</td>
                <td className="p-3 font-bold text-emerald-400 md:p-4">Entrega 100% anónima a domicilio</td>
                <td className="p-3 text-red-400 md:p-4">Exponer el problema en el mostrador</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
