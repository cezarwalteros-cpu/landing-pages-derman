import { useState } from 'react';
import { GALLERY_DEFAULT } from '../config';
import { useT } from '../lib/textos';

export function Gallery() {
  const t = useT();
  const images = GALLERY_DEFAULT.map((g) => ({ ...g, src: t(g.key) || g.src })).filter((g) => g.src);
  const [active, setActive] = useState(0);
  const img = images[Math.min(active, images.length - 1)];

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
        {images.map((g, i) => (
          <button
            key={g.key}
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
