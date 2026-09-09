'use client';

// Tooltip del panel de administración — un ícono de información al lado de cada título que
// explica la métrica en una frase, para un dueño no técnico. Toque/clic para abrir (no depende
// de hover: en el celular no hay hover) y se cierra tocando fuera o con Escape.

import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';

export function Tooltip({ texto }: { texto: string }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!abierto) return;
    const cerrarFuera = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    };
    const cerrarConEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('click', cerrarFuera);
    document.addEventListener('keydown', cerrarConEscape);
    return () => {
      document.removeEventListener('click', cerrarFuera);
      document.removeEventListener('keydown', cerrarConEscape);
    };
  }, [abierto]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setAbierto((a) => !a);
        }}
        aria-expanded={abierto}
        aria-describedby={abierto ? id : undefined}
        aria-label="Qué significa esto"
        className="flex min-h-11 min-w-11 items-center justify-center [touch-action:manipulation]"
      >
        {/* El fondo circular visible se queda pequeño (18px) para no competir con el ícono de la
            card — el área de toque real (44px, invisible) es más grande que lo que se ve, patrón
            estándar de accesibilidad táctil. Sin fondo, el glifo no se leía como botón (defecto
            real, ronda final del revisor). */}
        <span className="flex size-4 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] text-[var(--text-tertiary)] hover:bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] hover:text-[var(--accent)]">
          <Info size={11} aria-hidden="true" />
        </span>
      </button>
      {abierto && (
        <div
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-9 z-20 w-56 -translate-x-1/2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface-2)] p-3 text-[12px] leading-[1.45] text-[var(--text-secondary)] shadow-[var(--shadow-2)]"
        >
          {texto}
        </div>
      )}
    </div>
  );
}
