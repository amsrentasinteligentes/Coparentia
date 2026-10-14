// /ESPECIALISTAS (2026-10-14) — el directorio de especialistas, los artículos y "Quiero anunciarme en
// Coparentia", que antes estaban al final de la página de ventas, justo después del cierre de venta.
// Eran salidas hacia WhatsApp de terceros colocadas donde la persona debe decidir suscribirse; ahora
// viven aquí, en una página pública propia. El bloque se MUEVE tal cual (mismo componente, mismos
// datos, mismo registro de clics en "Contactar"): no se duplica ni se cambia su contenido.
//
// Va dentro del grupo (funnel) solo para heredar el estilo claro y las fuentes de la página principal
// (app/(funnel)/layout.tsx); la URL sigue siendo /especialistas.

import type { Metadata } from 'next';
import Link from 'next/link';
import { AnuncioAbogados } from '@/components/landing/AnuncioAbogados';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { ENLACES_LEGALES } from '@/components/landing/enlaces-legales';

export const metadata: Metadata = {
  title: 'Especialistas y artículos — Coparentia',
  description:
    'Directorio de abogados de familia, psicólogos y trabajadores sociales, y artículos para madres y padres separados.',
};

export default function Especialistas() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between px-5 py-3">
        <Link href="/" aria-label="Coparentia — volver al inicio">
          <img src="/logo-horizontal.webp" alt="Coparentia" className="h-9 w-auto object-contain" />
        </Link>
        <Link
          href="/"
          className="px-2 py-3 text-[14px] font-medium text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
        >
          ← Volver al inicio
        </Link>
      </header>

      <main>
        <AnuncioAbogados id="asistencia" contactoEmail="alianzas@coparentia.co" />
      </main>

      <FooterLegal
        appName="Coparentia"
        logo={<img src="/logo-horizontal.webp" alt="Coparentia" className="h-7 w-auto object-contain" />}
        marcaSoloLogo
        soporteEmail="soporte@coparentia.co"
        enlaces={ENLACES_LEGALES}
      />
    </>
  );
}
