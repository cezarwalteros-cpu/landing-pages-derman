import { useState } from 'react';
import { GALLERY } from '../config';

export function Gallery() {
  const [active, setActive] = useState(0);
  const img = GALLERY[active];

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className="aspect-square w-full object-cover transition-opacity duration-300"
          loading="eager"
        />
      </div>
      <div className="mt-3 grid grid-cols-6 gap-2">
        {GALLERY.map((g, i) => (
          <button
            key={g.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ver imagen: ${g.alt}`}
            aria-pressed={i === active}
            className={`overflow-hidden rounded-lg border-2 transition ${
              i === active ? 'border-brand-500 ring-2 ring-brand-100' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img src={g.src} alt="" className="aspect-square w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
