'use client';

// KIT DEL FUNNEL — onboarding + paywall + login (50-DISENO-ONBOARDING-PAYWALL.md).
// Piezas compartidas: header de marca, barra de progreso (línea fina, nunca dots),
// botón atrás, chip de opción, CTA fijo con safe-area. Consume los mismos tokens de
// components/landing/tokens.css (misma identidad de FICHA-ARTE en todo el producto).

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';
import type { ReactNode } from 'react';

/* ── <FunnelHeader> — logo + nombre arriba de TODA pantalla del funnel (50, regla de marca) ── */
export function FunnelHeader({ appName = 'Coparentia' }: { appName?: string }) {
  return (
    <Link
      href="/"
      className="mb-2 inline-flex items-center gap-2 py-3 text-[15px] font-semibold text-[var(--text-primary)]"
    >
      <span aria-hidden="true" className="size-6 shrink-0 rounded-[8px] bg-[var(--accent)]" />
      {appName}
    </Link>
  );
}

/* ── <BarraProgreso> — línea fina 2-3px, % real, ENDOWED PROGRESS (arranca en 5-8%, nunca 0) ── */
export function BarraProgreso({ porcentaje }: { porcentaje: number }) {
  const reduce = useReducedMotion();
  const p = Math.max(6, Math.min(100, porcentaje));
  return (
    <div
      className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]"
      role="progressbar"
      aria-valuenow={Math.round(p)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full bg-[var(--accent)]"
        initial={false}
        animate={{ width: `${p}%` }}
        transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/* ── <BarraAtras> — atrás (44×44 táctil) + barra de progreso, mismo renglón (A2) ── */
export function BarraAtras({ porcentaje, onAtras }: { porcentaje: number; onAtras?: () => void }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onAtras ?? (() => router.back())}
        aria-label="Volver"
        className="flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>
      <BarraProgreso porcentaje={porcentaje} />
      <span className="w-9 shrink-0 text-right text-[12px] tabular-nums text-[var(--text-tertiary)]">
        {Math.round(Math.max(6, Math.min(100, porcentaje)))}%
      </span>
    </div>
  );
}

/* ── <Chip> — opción de ancho completo (A2): normal / seleccionado, con check custom ── */
export function Chip({
  seleccionado,
  onClick,
  children,
  icon,
}: {
  seleccionado: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex h-14 w-full items-center gap-3 rounded-[var(--radius-button)] border px-4 text-left text-[16px] font-medium transition-colors duration-150 [touch-action:manipulation] ${
        seleccionado
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text-primary)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] text-[var(--text-primary)]'
      }`}
    >
      {icon}
      <span className="flex-1">{children}</span>
      {seleccionado && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, type: 'spring', bounce: 0.35 }}
          aria-hidden="true"
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
        >
          <Check size={12} strokeWidth={3} color="var(--bg)" />
        </motion.span>
      )}
    </motion.button>
  );
}

/* ── <CtaFunnel> — CTA fijo del paso (52-56px), acento pleno, nunca deshabilitado por defecto ── */
export function CtaFunnel({
  children,
  onClick,
  disabled,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className="flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_28%,transparent)] transition-opacity duration-150 disabled:opacity-40 [touch-action:manipulation]"
    >
      {children}
    </motion.button>
  );
}

/* ── Variants de transición entre pasos (A4): sale ←, entra desde la derecha → ── */
export function usePasoVariants(): Variants {
  const reduce = useReducedMotion();
  if (reduce) {
    return { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };
  }
  return {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -24, transition: { duration: 0.2, ease: 'easeIn' } },
  };
}

/* ── <ContenedorFunnel> — 16px de margen lateral, safe-area inferior, altura completa ── */
export function ContenedorFunnel({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[520px] flex-col px-4 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}
