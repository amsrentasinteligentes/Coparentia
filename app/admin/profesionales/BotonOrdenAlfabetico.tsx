'use client';

// Vuelve el directorio a orden alfabético puro (pedido del usuario, 2026-09-29: una de las 3
// formas de ordenar que quería — manual con las flechas, fijar a alguien primero + alfabético
// para el resto, o alfabético puro). Deshace cualquier orden manual fijado con las flechas.

import { useState } from 'react';
import { ArrowDownAZ } from 'lucide-react';
import { reordenarAlfabeticamente } from './acciones';

export function BotonOrdenAlfabetico() {
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const ordenar = async () => {
    setEnviando(true);
    setMensaje(null);
    const r = await reordenarAlfabeticamente();
    setMensaje(r.mensaje);
    setEnviando(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={ordenar}
        disabled={enviando}
        className="flex h-9 items-center gap-1.5 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] px-3 text-[12.5px] font-medium text-[var(--text-secondary)] disabled:opacity-50 [touch-action:manipulation]"
      >
        <ArrowDownAZ size={14} aria-hidden="true" />
        {enviando ? 'Ordenando…' : 'Ordenar A-Z'}
      </button>
      {mensaje && <span className="text-[12px] text-[var(--text-tertiary)]">{mensaje}</span>}
    </div>
  );
}
