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
      <img src="/logo-isotipo.png" alt="" aria-hidden="true" className="size-6 shrink-0 object-contain" />
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
export function BarraAtras({
  porcentaje,
  onAtras,
  pasoActual,
  pasoTotal,
}: {
  porcentaje: number;
  onAtras?: () => void;
  pasoActual?: number;
  pasoTotal?: number;
}) {
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
      <span className="shrink-0 whitespace-nowrap text-right text-[12px] tabular-nums text-[var(--text-tertiary)]">
        {pasoActual && pasoTotal ? `Paso ${pasoActual} de ${pasoTotal}` : `${Math.round(Math.max(6, Math.min(100, porcentaje)))}%`}
      </span>
    </div>
  );
}

/* ── <Marcador> — subrayado en la palabra clave (dispositivo ownable de FICHA-ARTE.md,
   halo + marcador — mismo device que <Accent> de la landing).
   Bug real encontrado y corregido (revisor-visual, ronda de pulido): con `leading-[1.1]`
   (tipografía display muy compacta) el alto real de la caja de línea de un span inline
   supera el line-height calculado (el bloque de tinta de Spectral es más alto que el
   interlineado apretado) — un gradiente por PORCENTAJE del alto de esa caja (62%) quedaba
   entonces varios px más abajo de lo esperado, y en títulos que envuelven a 2 líneas se veía
   como un rectángulo flotante, desconectado del texto. Fix: tamaño y posición del subrayado
   en unidades FIJAS (em, ancladas al borde inferior de la caja) en vez de un porcentaje del
   alto total — así el grosor y la posición ya no dependen de cuánto se infle esa caja. ── */
export function Marcador({ children }: { children: ReactNode }) {
  return (
    <span
      className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{
        backgroundImage:
          'linear-gradient(color-mix(in oklab, var(--accent) 30%, transparent), color-mix(in oklab, var(--accent) 30%, transparent))',
        backgroundRepeat: 'no-repeat',
        // Anclado al borde inferior de la caja inline (`0 100%`), el trazo quedaba ~6px por debajo
        // de las letras y se leía como una barra flotante suelta, no como un subrayado. Subirlo
        // 0.14em lo pega a la base del texto en cualquier tamaño de fuente.
        backgroundPosition: '0 calc(100% - 0.14em)',
        backgroundSize: '100% 0.22em',
        padding: '0 0.05em',
      }}
    >
      {children}
    </span>
  );
}

/* ── <Halo> — mancha radial detrás de un título (dispositivo ownable, mismo device que
   el hero de la landing) — para sostener 3 niveles de profundidad en pantallas de solo-chips ── */
export function Halo() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -left-8 -right-8 -top-16 -bottom-24 -z-10"
      style={{
        // DOS bugs corregidos aquí, y este componente alimenta TODO el onboarding:
        // (a) `220px 140px` son RADIOS, o sea una elipse de 440×280 dentro de una caja de ~190px:
        //     se recortaba y dejaba un rectángulo con borde horizontal duro. Sin radios, el
        //     degradado se dimensiona contra su caja y siempre termina de desvanecerse dentro.
        // (b) al 16% el revisor lo declaró imperceptible: no cumplía su función de dar
        //     profundidad ni identidad. Subido al 26%, el valor único del sistema.
        background:
          'radial-gradient(ellipse at 22% 34%, color-mix(in oklab, var(--accent) 26%, transparent) 0%, transparent 62%)',
      }}
    />
  );
}

/* ── <Chip> — opción de ancho completo (A2): normal / seleccionado, con check custom ── */
export function Chip({
  seleccionado,
  onClick,
  children,
  icon,
  index = 0,
}: {
  seleccionado: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`flex h-14 w-full items-center gap-3 rounded-[var(--radius-button)] border px-4 text-left text-[16px] font-medium transition-colors duration-150 [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
        seleccionado
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text-primary)] shadow-[0_4px_16px_color-mix(in_oklab,var(--accent)_22%,transparent)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[0_2px_8px_rgb(6_12_24_/_0.45)]'
      }`}
    >
      {icon}
      <span className="flex-1">{children}</span>
      {seleccionado && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.24, type: 'spring', bounce: 0.1 }}
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
      // El foco de teclado global (globals/tokens.css) dibuja un anillo del color de ACENTO — y
      // este botón ya ES de color acento, así que el anillo se perdía sobre su propio relleno.
      // Aquí se fuerza un anillo de alto contraste para que navegar con teclado se vea.
      className="flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_28%,transparent)] transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)] disabled:opacity-40 [touch-action:manipulation]"
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
