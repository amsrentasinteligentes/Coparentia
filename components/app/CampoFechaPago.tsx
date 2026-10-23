'use client';

// CAMPO "FECHA DEL PAGO" — lo comparten Pagos ("Nuevo registro") y el primer comprobante de Inicio.
// Por defecto muestra hoy; deja elegir un día anterior y NO uno futuro (`max`). La base vuelve a
// comprobarlo al guardar (supabase/pagos-fecha-del-pago.sql), así que esto es la ayuda visible y no
// la única defensa. Aparte de esta fecha, el sistema anota cuándo se SUBIÓ el comprobante: eso no
// se elige ni se ve aquí.

import { hoyEnColombia } from '@/lib/fecha';

export function CampoFechaPago({
  valor,
  onCambio,
  id = 'fecha-pago',
  className = '',
}: {
  valor: string;
  onCambio: (fecha: string) => void;
  id?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[14px] font-medium text-[var(--text-secondary)]">
        Fecha del pago
      </label>
      <input
        id={id}
        type="date"
        value={valor}
        max={hoyEnColombia()}
        onChange={(e) => onCambio(e.target.value)}
        className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[16px] tabular-nums text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
      />
      <p className="mt-1.5 text-[12px] text-[var(--text-tertiary)]">
        Si pagaste antes, elige ese día. El sistema anota aparte cuándo lo subes.
      </p>
    </div>
  );
}
