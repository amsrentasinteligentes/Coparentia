'use client';

// Botón "Quitar" para una cuenta agregada a mano por error — solo aparece en filas con
// `creadoManualmente` (ver acciones.ts). Confirmación en dos pasos en el propio botón, sin
// modal: evita el borrado accidental (regla 8 del SO: confirmación para lo irreversible) sin
// construir un componente nuevo solo para esto.

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { quitarUsuarioManual } from './acciones';

export function AccionesFila({ userId }: { userId: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [quitando, setQuitando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmar = async () => {
    setQuitando(true);
    setError(null);
    // Bug real encontrado por el revisor-visual (ronda 5): antes no se leía el resultado — si la
    // Server Action fallaba, el botón quedaba en "Quitando…" para siempre, sin salida posible.
    const r = await quitarUsuarioManual(userId);
    if (!r.ok) {
      setError(r.mensaje);
      setQuitando(false);
      setConfirmando(false);
    }
    // Si funcionó, revalidatePath refresca la tabla y esta fila deja de existir — no hace falta
    // volver a tocar el estado local.
  };

  if (quitando) {
    return <span className="flex min-h-11 items-center text-[12px] text-[var(--text-tertiary)]">Quitando…</span>;
  }

  if (confirmando) {
    return (
      <span className="flex min-h-11 items-center gap-3">
        <button
          type="button"
          onClick={confirmar}
          className="flex min-h-11 items-center text-[12px] font-semibold text-[var(--status-error)] [touch-action:manipulation]"
        >
          ¿Seguro? Sí
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          className="flex min-h-11 items-center text-[12px] text-[var(--text-tertiary)] [touch-action:manipulation]"
        >
          No
        </button>
      </span>
    );
  }

  if (error) {
    return (
      <span className="flex flex-col items-start gap-1">
        <span className="text-[11.5px] text-[var(--status-error)]">{error}</span>
        <button
          type="button"
          onClick={() => setError(null)}
          className="flex min-h-11 items-center gap-1 text-[12px] text-[var(--text-tertiary)] [touch-action:manipulation]"
        >
          <Trash2 size={13} aria-hidden="true" />
          Reintentar
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirmando(true)}
      className="flex min-h-11 items-center gap-1 text-[12px] text-[var(--text-tertiary)] [touch-action:manipulation]"
    >
      <Trash2 size={13} aria-hidden="true" />
      Quitar
    </button>
  );
}
