import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { FUNNEL_PAGE, SUPABASE_ANON_KEY, SUPABASE_REST_URL } from '../config';

// Textos editables desde Supabase → tabla landing_textos (landing = 'derman').
// Se cambia la columna "valor" y se recarga la página.

type Textos = Record<string, string>;
const Ctx = createContext<Textos>({});

export function TextosProvider({ children }: { children: ReactNode }) {
  const [textos, setTextos] = useState<Textos | null>(null);

  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 2500);
    fetch(`${SUPABASE_REST_URL}/landing_textos?landing=eq.${FUNNEL_PAGE}&select=clave,valor`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { clave: string; valor: string }[]) => {
        if (alive) setTextos(Object.fromEntries(rows.map((r) => [r.clave, r.valor ?? ''])));
      })
      .catch(() => {
        if (alive) setTextos({});
      })
      .finally(() => window.clearTimeout(timer));
    return () => {
      alive = false;
      window.clearTimeout(timer);
      ctrl.abort();
    };
  }, []);

  if (textos === null) return <div className="min-h-screen bg-white" />;
  return <Ctx.Provider value={textos}>{children}</Ctx.Provider>;
}

const LOREM_T = 'Lorem ipsum dolor sit amet';
const LOREM_P = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
export const LOREM = { t: LOREM_T, p: LOREM_P };

export function useT() {
  const m = useContext(Ctx);
  return (clave: string, porDefecto = '') => (clave in m ? m[clave] : porDefecto);
}
