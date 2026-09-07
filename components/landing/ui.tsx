'use client';

// KIT DE LANDING — ui.tsx
// Piezas compartidas de las 10 secciones. La estructura premium vive AQUÍ
// (chips 44px, hairline degradada, checkmarks custom, sticky CTA con safe-area,
// alternancia base/elevado, reveal con reduced-motion): las secciones componen,
// no re-estilan. Consume SOLO los tokens de tokens.css.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
  type Variants,
} from 'motion/react';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ── <CountUp> — cifra héroe que cuenta desde 0 al entrar en viewport (eje
   MOVIMIENTO del craft). Recibe el texto YA formateado ("$7.42", "$9.99") y
   anima solo la parte numérica, conservando prefijo/sufijo tal cual. ── */
export function CountUp({ text, durationMs = 900 }: { text: string; durationMs?: number }) {
  const match = text.match(/-?\d+(\.\d+)?/);
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const target = match ? parseFloat(match[0]) : 0;
  const decimals = match?.[1] ? match[1].length - 1 : 0;
  const mv = useMotionValue(reduce ? target : 0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));
  const [display, setDisplay] = useState(reduce ? (match ? target.toFixed(decimals) : '') : '0'.padStart(1, '0'));

  useEffect(() => {
    if (!match || reduce) return;
    if (!inView) return;
    const controls = animate(mv, target, { duration: durationMs / 1000, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, match, mv, reduce, target, durationMs]);

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  if (!match) return <>{text}</>;
  const pre = text.slice(0, match.index);
  const post = text.slice((match.index ?? 0) + match[0].length);
  return (
    <span ref={ref}>
      {pre}
      {display}
      {post}
    </span>
  );
}

/* ── <Accent> — la palabra que vende, en el acento del kit + el dispositivo
     ownable de FICHA-ARTE.md (halo + subrayado marcador, fusión banco 54 dir.1/dir.6) ── */
export function Accent({ children }: { children: ReactNode }) {
  return (
    <span
      className="text-[var(--accent)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{
        backgroundImage:
          'linear-gradient(transparent 66%, color-mix(in oklab, var(--accent) 28%, transparent) 66%)',
        padding: '0 0.05em',
      }}
    >
      {children}
    </span>
  );
}

/* ── <Kicker> — caps 12px/600 tracking +0.08em en acento (máx 1 por sección) ── */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
      {children}
    </p>
  );
}

/* ── <IconChip> — ícono SVG 22px dentro de chip 44px (55: jamás emoji) ──────
   tone 'accent' para secciones cálidas · 'muted' para íconos de dolor (§2:
   neutro apagado, nunca checks verdes). La FORMA la decide --radius-button:
   una sola forma de chip por página. */
export function IconChip({ icon: Icono, tone = 'accent' }: { icon: LucideIcon; tone?: 'accent' | 'muted' }) {
  const acento = tone === 'accent';
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-button)] border ${
        acento
          ? 'border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] bg-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)]'
      }`}
    >
      <Icono size={22} strokeWidth={2} color={acento ? 'var(--accent)' : 'var(--text-secondary)'} aria-hidden="true" />
    </span>
  );
}

/* ── <Hairline> — borde degradado 1-2px, técnica padding-box/border-box (49 §13).
   Señal de "esto importa": máx 1-3 usos por página (plan recomendado, garantía,
   chip del mecanismo). emphasis = EL elemento de la vista (2px, acento 55%). ── */
export function Hairline({
  emphasis = false,
  surface = 'surface',
  className = '',
  children,
}: {
  emphasis?: boolean;
  surface?: 'surface' | 'surface-2' | 'bg';
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] ${className}`}
      style={{
        border: `${emphasis ? 2 : 1}px solid transparent`,
        background:
          `linear-gradient(var(--${surface}), var(--${surface})) padding-box, ` +
          `linear-gradient(135deg, color-mix(in oklab, var(--accent) ${emphasis ? 55 : 40}%, transparent), transparent 60%) border-box`,
      }}
    >
      {children}
    </div>
  );
}

/* ── <CheckCustom> — círculo acento 12% + check SVG (55 repertorio #9).
   Nunca el ✓ del sistema ni emoji. ── */
export function CheckCustom() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
    >
      <Check size={13} strokeWidth={2.5} color="var(--accent)" aria-hidden="true" />
    </span>
  );
}

/* ── <MiniRing> — anillo de progreso compacto (el mismo dispositivo del anillo
   de avance de la app, en miniatura) — rompe bloques de puro texto con un dato
   visual real, nunca decorativo: SIEMPRE va con un valor y una etiqueta reales. ── */
export function MiniRing({
  value,
  size = 72,
  stroke = 7,
  tone = 'accent',
}: {
  /** 0-100 */
  value: number;
  size?: number;
  stroke?: number;
  tone?: 'accent' | 'muted';
}) {
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, value)) / 100);
  const color = tone === 'accent' ? 'var(--accent)' : 'var(--text-tertiary)';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="color-mix(in oklab, var(--text-tertiary) 18%, transparent)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

/* ── <SectionShell> — ritmo vertical y alternancia base↔elevado (55 T1).
   64px mobile / 96px desktop; compacta (garantía) 48/64. flush pega las
   secciones que son UN movimiento visual (problema+agitación). ── */
export function SectionShell({
  id,
  elevacion = 'base',
  compacta = false,
  flush = 'none',
  ariaLabel,
  className = '',
  children,
}: {
  id?: string;
  elevacion?: 'base' | 'elevada';
  compacta?: boolean;
  flush?: 'none' | 'top' | 'bottom';
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}) {
  const pt = flush === 'top' ? 'pt-0' : compacta ? 'pt-12 md:pt-16' : 'pt-16 md:pt-24';
  const pb = flush === 'bottom' ? 'pb-8 md:pb-10' : compacta ? 'pb-12 md:pb-16' : 'pb-16 md:pb-24';
  /* Degradé suave dentro de la misma familia de FICHA-ARTE (nunca un color nuevo):
     mesh radial del acento sobre la superficie base/elevada — rompe el fill plano
     sin tocar los hex aprobados (solo color-mix del token ya existente). */
  const mesh =
    elevacion === 'elevada'
      ? 'radial-gradient(1100px 620px at 15% -10%, color-mix(in oklab, var(--accent) 16%, transparent) 0%, transparent 60%), ' +
        'radial-gradient(700px 500px at 105% 105%, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 55%), ' +
        'var(--surface)'
      : 'radial-gradient(900px 560px at 100% -5%, color-mix(in oklab, var(--accent) 13%, transparent) 0%, transparent 60%), ' +
        'var(--bg)';
  /* Hairline horizontal en el cambio base↔elevada (nunca entre secciones "flush",
     que son UN solo movimiento visual — 55 T1): ancla el ojo al límite exacto de
     cada bloque, el mismo problema que "Secciones adyacentes distinguibles". */
  const borderTop =
    flush === 'top' ? '' : '1px solid color-mix(in oklab, var(--text-tertiary) 12%, transparent)';
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`${pt} ${pb} ${className}`}
      style={{ background: mesh, borderTop }}
    >
      <div className="mx-auto w-full max-w-[1140px] px-5">{children}</div>
    </section>
  );
}

/* ── useReveal — variants de entrada whileInView con stagger, UNA sola vez,
   reduced-motion respetado (movimiento fuera, fade dentro — 55 T4). ── */
export function useReveal(stagger = 0.07): { contenedor: Variants; item: Variants } {
  const reduce = useReducedMotion();
  return {
    contenedor: {
      hidden: {},
      visible: { transition: { staggerChildren: reduce ? 0 : stagger } },
    },
    item: {
      hidden: { opacity: 0, y: reduce ? 0 : 20 },
      visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.45, ease: [0.16, 1, 0.3, 1] } },
    },
  };
}

/* Props estándar para el contenedor con reveal — evita repetir en cada sección. */
export const VIEWPORT_ONCE = { once: true, amount: 0.2 } as const;

/* ── <CtaButton> — el CTA vivo del kit: ≥52px, whileTap 0.97, sombra tintada.
   El texto sobre acento usa --bg: si tu FICHA-ARTE rompe el contraste AA ahí,
   ajusta los tokens, no el componente. ── */
export function CtaButton({
  href,
  children,
  alto = 52,
  fullMobile = true,
}: {
  href: string;
  children: ReactNode;
  alto?: 52 | 56;
  fullMobile?: boolean;
}) {
  return (
    <motion.a
      whileTap={{ scale: 0.97 }}
      href={href}
      className={`inline-flex items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-8 text-[17px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--accent)_88%,var(--text-primary))] [touch-action:manipulation] ${
        alto === 56 ? 'h-14' : 'h-[52px]'
      } ${fullMobile ? 'w-full sm:w-auto' : ''}`}
    >
      {children}
    </motion.a>
  );
}

/* ── <StickyCtaMobile> — barra fija inferior SOLO mobile (55 T2).
   Aparece cuando el hero sale del viewport; se oculta frente a la oferta y al
   CTA final; safe-area respetada. DOS estados (T2): antes de ver la oferta el
   botón hace scroll a #oferta ("ver precios"); después de verla, cambia al CTA
   comercial — nunca saltar una oferta que la persona todavía no vio. */
export function StickyCtaMobile({
  labelComercial,
  href,
  labelPre = 'Ver plan y precios',
  heroId = 'hero',
  ofertaId = 'oferta',
  ctaFinalId = 'cta-final',
}: {
  labelComercial: string;
  href: string;
  labelPre?: string;
  heroId?: string;
  ofertaId?: string;
  ctaFinalId?: string;
}) {
  const reduce = useReducedMotion();
  const [heroVisible, setHeroVisible] = useState(true);
  const [ofertaVisible, setOfertaVisible] = useState(false);
  const [ofertaVista, setOfertaVista] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const observar = (id: string, onChange: (visible: boolean) => void): IntersectionObserver | null => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          if (e) onChange(e.isIntersecting);
        },
        { threshold: 0.1 }
      );
      io.observe(el);
      return io;
    };
    const a = observar(heroId, setHeroVisible);
    const b = observar(ofertaId, (v) => {
      setOfertaVisible(v);
      if (v) setOfertaVista(true);
    });
    const c = observar(ctaFinalId, setFinalVisible);
    return () => {
      a?.disconnect();
      b?.disconnect();
      c?.disconnect();
    };
  }, [heroId, ofertaId, ctaFinalId]);

  const visible = !heroVisible && !ofertaVisible && !finalVisible;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: reduce ? 0 : 88, opacity: reduce ? 0 : 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : 88, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] px-4 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden"
        >
          <motion.a
            whileTap={{ scale: 0.97 }}
            href={ofertaVista ? href : `#${ofertaId}`}
            className="flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
          >
            {ofertaVista ? labelComercial : labelPre}
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
