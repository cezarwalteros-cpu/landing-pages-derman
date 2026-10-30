import { BadgeCheck, Zap } from 'lucide-react';

export function TopBar() {
  return (
    <div className="sticky top-0 z-50 bg-brand-900 px-3 py-2 text-center text-[11px] font-semibold tracking-wide text-white sm:text-xs">
      <span className="inline-flex items-center gap-1">
        <Zap className="h-3.5 w-3.5 text-yellow-300" aria-hidden />
        ENVÍO PRIORITARIO Y 100% DISCRETO EN COLOMBIA | PAGA AL RECIBIR EN CASA
      </span>
    </div>
  );
}

export function Header() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-baseline gap-1.5">
          <span className="text-xl font-extrabold tracking-tight text-ink">DERMAN™</span>
          <span className="text-sm font-medium text-brand-600">Dermocare</span>
        </a>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          <BadgeCheck className="h-4 w-4" aria-hidden />
          Verificado / Oficial
        </span>
      </div>
    </header>
  );
}
