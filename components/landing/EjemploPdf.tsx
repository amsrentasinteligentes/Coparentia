'use client';

// Página de ejemplo del expediente en PDF (datos FICTICIOS), plegada tras un botón. Vive en "Cómo funciona":
// es la prueba concreta de lo que sale del Sello de Confianza (el revisor marcó que bajo las opiniones quedaba huérfana).
// Solo celular: en computador la misma imagen sigue junto a las opiniones.

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function EjemploPdf({ src, alt, pie, ancho, alto }: { src: string; alt: string; pie: string; ancho: number; alto: number }) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  return (
    <div className="mx-auto mt-8 w-full max-w-[420px] lg:hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls={id}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[15px] font-semibold text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]"
      >
        {abierto ? 'Ocultar la página de ejemplo' : 'Ver una página de ejemplo del expediente'}
        <ChevronDown size={18} aria-hidden="true" className={`transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`} />
      </button>
      <figure id={id} className={abierto ? 'mt-4 block' : 'hidden'}>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${alt} (se abre ampliada en otra pestaña)`}
          className="block overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-white shadow-[var(--shadow-2)] [touch-action:manipulation]"
        >
          <img src={src} alt={alt} width={ancho} height={alto} loading="lazy" className="block h-auto w-full" />
        </a>
        <figcaption className="mt-3 text-center text-[13px] leading-snug text-[var(--text-secondary)]">
          {pie} <span className="text-[var(--text-tertiary)]">Tócala para ampliarla.</span>
        </figcaption>
      </figure>
    </div>
  );
}
