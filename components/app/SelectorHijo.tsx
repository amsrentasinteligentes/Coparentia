'use client';

// SELECTOR "¿PARA QUIÉN?" — elige a qué hijo corresponde un gasto o un evento (2026-09-18).
// Pedido del usuario: con 2 o 3 hijos, las cuentas deben poder separarse por cada uno. Usa los
// hijos que la persona ya cargó en Perfil → Mi familia; con UN solo hijo se preselecciona (cero
// toques extra); con ninguno, invita a agregarlos sin bloquear el registro.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Users, UserRoundPlus } from 'lucide-react';
import { type Hijo, obtenerHijos } from '@/lib/perfil';

export type ValorHijo = string | null; // id del hijo · null = todos / general

export function useHijos(): { hijos: Hijo[]; cargando: boolean } {
  const [hijos, setHijos] = useState<Hijo[]>([]);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    let vigente = true;
    obtenerHijos()
      .then((h) => { if (vigente) setHijos(h); })
      .catch(() => {})
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, []);
  return { hijos, cargando };
}

export function inicialHijo(nombre: string): string {
  return nombre.trim().charAt(0).toUpperCase() || '·';
}

export function SelectorHijo({
  hijos,
  valor,
  onCambio,
  etiqueta = '¿Para quién?',
  textoTodos = 'Todos',
  ocultarSinHijos = false,
}: {
  hijos: Hijo[];
  valor: ValorHijo;
  onCambio: (v: ValorHijo) => void;
  etiqueta?: string;
  /** Texto del chip general: "Todos" en gastos (la cuota es de todos), "General" en eventos. */
  textoTodos?: string;
  /** true → sin hijos no se pinta nada (ni la invitación). */
  ocultarSinHijos?: boolean;
}) {
  if (hijos.length === 0) {
    if (ocultarSinHijos) return null;
    return (
      <Link
        href="/perfil"
        className="mt-4 flex items-center gap-2.5 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3.5 py-3 text-[12.5px] text-[var(--text-secondary)] [touch-action:manipulation]"
      >
        <UserRoundPlus size={16} className="shrink-0 text-[var(--accent-ink,var(--accent))]" aria-hidden="true" />
        <span>
          <span className="font-bold text-[var(--text-primary)]">Agrega a tus hijos en Perfil</span> para separar las cuentas de cada uno.
        </span>
      </Link>
    );
  }

  const chipBase = 'flex h-10 items-center gap-2 rounded-[var(--radius-chip,999px)] border pl-1 pr-3 text-[13px] font-semibold transition-colors duration-150 [touch-action:manipulation]';
  const activo = 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent-ink,var(--accent))]';
  const inactivo = 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[var(--text-secondary)]';

  return (
    <div className="mt-4">
      <p className="text-[13px] font-medium text-[var(--text-secondary)]">{etiqueta}</p>
      <div role="radiogroup" aria-label={etiqueta} className="mt-2 flex flex-wrap gap-2">
        {hijos.map((h) => {
          const sel = valor === h.id;
          return (
            <button
              key={h.id}
              type="button"
              role="radio"
              aria-checked={sel}
              onClick={() => onCambio(h.id)}
              className={`${chipBase} ${sel ? activo : inactivo}`}
            >
              <span
                className="flex size-7 items-center justify-center rounded-full text-[12px] font-bold"
                style={{ background: sel ? 'var(--accent)' : 'var(--surface-2)', color: sel ? 'var(--on-accent)' : 'var(--text-primary)' }}
              >
                {inicialHijo(h.nombre)}
              </span>
              {h.nombre}
            </button>
          );
        })}
        <button
          type="button"
          role="radio"
          aria-checked={valor === null}
          onClick={() => onCambio(null)}
          className={`${chipBase} ${valor === null ? activo : inactivo}`}
        >
          <span
            className="flex size-7 items-center justify-center rounded-full"
            style={{ background: valor === null ? 'var(--accent)' : 'var(--surface-2)', color: valor === null ? 'var(--on-accent)' : 'var(--text-primary)' }}
          >
            <Users size={14} aria-hidden="true" />
          </span>
          {textoTodos}
        </button>
      </div>
    </div>
  );
}
