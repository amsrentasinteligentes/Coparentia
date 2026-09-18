// LAYOUT DEL FUNNEL — onboarding, paywall y login en el MISMO estilo claro de la página de
// ventas (2026-09-18, orden del usuario: "cámbiala toda a la imagen actual que tenemos").
// Antes estas tres pantallas vivían sueltas bajo app/ y heredaban el tema oscuro de tokens.css;
// el grupo de rutas (funnel) no cambia ninguna URL, solo envuelve las tres en `.tema-claro`
// (components/landing/tokens-claro.css — los mismos tokens de la landing) y carga las mismas
// fuentes. Así la persona pasa de la página de ventas al recorrido, al plan y al login sin que
// la app cambie de piel a mitad de camino.

import { Figtree, Nunito_Sans } from 'next/font/google';

const figtree = Figtree({ variable: '--font-figtree', subsets: ['latin'], weight: ['500', '600', '700', '800'] });
const nunitoSans = Nunito_Sans({ variable: '--font-nunito-sans', subsets: ['latin'], weight: ['400', '600', '700'] });

export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="main"
      className={`tema-claro ${figtree.variable} ${nunitoSans.variable} min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]`}
    >
      {children}
    </div>
  );
}
