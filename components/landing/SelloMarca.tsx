'use client';

// EL SELLO DE CONFIANZA COMO FIRMA DE MARCA (2026-10-20, aprobado por el dueño: escudo con logo, opción E).
// Es el "dispositivo propio" de la identidad: el mismo escudo con visto bueno que la app ya muestra al
// sellar un comprobante (components/app/SelloConfianza.tsx), ahora con el isotipo de Coparentia adentro.
//
// · `compacto` (sin logo, solo visto bueno): para tamaños de menos de ~90 px, donde el isotipo se vuelve mancha.
// · La palabra es "FECHADO", sin número: una fecha escrita en la imagen sería falsa mañana. La fecha real
//   solo va dentro de la app, donde sí es la del comprobante.
// · Se asienta una sola vez al entrar en pantalla (como un sello que se estampa), sin fanfarria; con
//   "reducir movimiento" aparece ya asentado.
// El tamaño lo manda el contenedor (el svg ocupa el 100% del ancho).

import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const ESCUDO = 'M60 4 L110 21 V62 C110 94 87 114 60 127 C33 114 10 94 10 62 V21 Z';
const AZUL_PROFUNDO = 'color-mix(in oklab, var(--accent-deep, #2757a8) 48%, black)';

export function SelloMarca({
  compacto = false,
  animar = true,
  className = '',
}: {
  compacto?: boolean;
  animar?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  const quieta = reduce || !animar;

  return (
    <motion.span
      role="img"
      aria-label="Sello de Confianza de Coparentia: tu comprobante queda fechado"
      className={`block ${className}`}
      initial={quieta ? false : { opacity: 0, scale: 1.18, rotate: -7 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: 'spring', stiffness: 220, damping: 17 }}
    >
      <svg viewBox="0 0 120 134" width="100%" aria-hidden="true" focusable="false" className="block h-auto w-full overflow-visible">
        <defs>
          <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--accent, #2f6fdc)' }} />
            <stop offset="1" style={{ stopColor: AZUL_PROFUNDO }} />
          </linearGradient>
          <radialGradient id={`l${uid}`} cx=".5" cy=".38" r=".5">
            <stop offset="0" stopColor="#fff" stopOpacity=".22" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`c${uid}`}>
            <path d={ESCUDO} />
          </clipPath>
        </defs>
        <path d={ESCUDO} fill={`url(#g${uid})`} />
        <path d={ESCUDO} fill={`url(#l${uid})`} />
        <g clipPath={`url(#c${uid})`}>
          <rect x="0" y="88" width="120" height="50" fill="#fff" />
          <rect x="0" y="86.5" width="120" height="2.5" style={{ fill: 'var(--accent, #2f6fdc)' }} />
        </g>
        {compacto ? (
          <path d="M36 50l17 17 31-35" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <image href="/logo-isotipo.png" x="30" y="20" width="60" height="60" />
            <circle cx="91" cy="70" r="12.5" fill="#fff" />
            <circle cx="91" cy="70" r="10" style={{ fill: 'var(--accent, #2f6fdc)' }} />
            <path d="M86 70.5l3.6 3.6 6.6-7.2" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        <text
          x="60"
          y="108"
          textAnchor="middle"
          fontFamily="var(--font-display, Figtree, system-ui)"
          fontWeight={800}
          fontSize="12.5"
          letterSpacing="2.2"
          style={{ fill: AZUL_PROFUNDO }}
        >
          FECHADO
        </text>
      </svg>
    </motion.span>
  );
}
