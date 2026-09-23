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
import { Camera, Check, X } from 'lucide-react';
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
      className="accent-word text-[var(--accent)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{
        // Mismo subrayado nativo que el <Marcador> del funnel (2026-09-17): antes era un gradiente
        // por porcentaje del alto de línea, que en el H1 del hero (40px en celular, 58px en
        // computador) se convertía en un bloque sólido detrás de media frase. `text-decoration`
        // mantiene el grosor proporcional a la letra Y abre hueco alrededor de las descendentes
        // (`skip-ink` por defecto), que es justo donde fallaban las versiones anteriores.
        // …salvo aquí: en un H1 de 40-58px los huecos del skip-ink se ven como una raya partida en
        // guiones (revisor, 4ª ronda). En display se dibuja continuo y un pelo más fino.
        textDecorationLine: 'underline',
        textDecorationColor: 'var(--accent-underline)',
        textDecorationThickness: '0.10em',
        textUnderlineOffset: '0.12em',
        textDecorationSkipInk: 'none',
      }}
    >
      {children}
    </span>
  );
}

/* ── <Kicker> — caps 12px/600 tracking +0.08em en acento (máx 1 por sección) ── */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent-ink)] lg:text-[13px]">
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
  radio = 'card',
  className = '',
  children,
}: {
  emphasis?: boolean;
  surface?: 'surface' | 'surface-2' | 'bg';
  /** 'button' para chips/píldoras: una sola forma de chip por página. */
  radio?: 'card' | 'button';
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${radio === 'button' ? 'rounded-[var(--radius-button)]' : 'rounded-[var(--radius-card)]'} ${className}`}
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
      <div className="mx-auto w-full max-w-[1140px] lg:max-w-[1280px] 2xl:max-w-[1400px] px-5">{children}</div>
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
  variant = 'solid',
}: {
  href: string;
  children: ReactNode;
  alto?: 52 | 56;
  fullMobile?: boolean;
  /** 'outline' — plan secundario (ej. "Elegir mensual"), nunca compite con el CTA principal. */
  variant?: 'solid' | 'outline';
}) {
  // Feedback inmediato al tocar (heurística 1): la navegación completa a /onboarding tarda y sin
  // esto el botón parecía muerto durante ese instante. `yendo` atenúa el botón hasta que la
  // página cambia; si el navegador vuelve atrás (bfcache), se limpia.
  const [yendo, setYendo] = useState(false);
  useEffect(() => {
    const limpiar = () => setYendo(false);
    window.addEventListener('pageshow', limpiar);
    return () => window.removeEventListener('pageshow', limpiar);
  }, []);
  return (
    <motion.a
      whileTap={{ scale: 0.97 }}
      href={href}
      onClick={() => setYendo(true)}
      aria-busy={yendo || undefined}
      data-cta-pagina=""
      className={`inline-flex items-center justify-center rounded-[var(--radius-button)] px-8 text-[17px] font-semibold transition-[colors,opacity] lg:px-10 lg:text-[18px] duration-150 [touch-action:manipulation] ${yendo ? 'opacity-80' : ''} ${
        variant === 'outline'
          ? 'border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[var(--accent-ink)] hover:bg-[var(--chip-bg)]'
          : 'cta-solid bg-[var(--accent)] text-[var(--on-accent)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] hover:bg-[color-mix(in_oklab,var(--accent)_88%,var(--text-primary))]'
      } ${alto === 56 ? 'h-14 lg:h-16' : 'h-[52px] lg:h-14'} ${fullMobile ? 'w-full sm:w-auto' : ''}`}
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
  // Control manual de cierre (heurística 3: control y libertad) — un "x" que la descarta hasta
  // el PRÓXIMO hito de scroll (entra/sale de hero, oferta o cta-final), nunca la esconde para
  // siempre: si el usuario sigue navegando, la barra vuelve a ofrecer ayuda cuando haga falta.
  const [descartada, setDescartada] = useState(false);
  const [ctaEnPantalla, setCtaEnPantalla] = useState(false);
  const ultimoHito = useRef({ heroVisible, ofertaVisible, finalVisible });

  useEffect(() => {
    const cambio =
      ultimoHito.current.heroVisible !== heroVisible ||
      ultimoHito.current.ofertaVisible !== ofertaVisible ||
      ultimoHito.current.finalVisible !== finalVisible;
    if (cambio) {
      setDescartada(false);
      ultimoHito.current = { heroVisible, ofertaVisible, finalVisible };
    }
  }, [heroVisible, ofertaVisible, finalVisible]);

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

    const botones = Array.from(document.querySelectorAll('[data-cta-pagina]'));
    const alaVista = new Set<Element>();
    const ioCtas = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? alaVista.add(e.target) : alaVista.delete(e.target)));
        setCtaEnPantalla(alaVista.size > 0);
      },
      { threshold: 0.1 }
    );
    botones.forEach((el) => ioCtas.observe(el));

    return () => {
      a?.disconnect();
      b?.disconnect();
      c?.disconnect();
      ioCtas.disconnect();
    };
  }, [heroId, ofertaId, ctaFinalId]);

  const visible = !heroVisible && !ofertaVisible && !finalVisible && !ctaEnPantalla && !descartada;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: reduce ? 0 : 88, opacity: reduce ? 0 : 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : 88, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] px-4 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden"
        >
          <motion.a
            whileTap={{ scale: 0.97 }}
            href={ofertaVista ? href : `#${ofertaId}`}
            className="flex h-12 flex-1 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent)] [touch-action:manipulation] lg:text-[18px]"
          >
            {ofertaVista ? labelComercial : labelPre}
          </motion.a>
          <button
            type="button"
            onClick={() => setDescartada(true)}
            aria-label="Cerrar esta barra"
            className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-tertiary)] [touch-action:manipulation]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── <Blob> — forma orgánica en degradé de marca (dispositivo ownable de la variante clara
   "Cuidado en calma"): enmarca lo humano (fotos) y da profundidad sin un solo rectángulo.
   Puramente decorativo → aria-hidden. La forma (border-radius orgánico) vive en tokens-claro.css. ── */
export function Blob({
  className = '',
  variante = 'a',
  opacidad = 0.16,
}: {
  className?: string;
  /** dos siluetas distintas para que dos formas juntas no se vean clonadas */
  variante?: 'a' | 'b';
  opacidad?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute ${variante === 'a' ? 'blob' : 'blob-b'} ${className}`}
      style={{
        background: 'linear-gradient(150deg, var(--accent-2), var(--accent-deep, var(--accent)))',
        opacity: opacidad,
      }}
    />
  );
}

/* ── <FotoLugar> — marcador de posición HONESTO de una fotografía (55 §1.3): bloque con tono
   cálido, ícono y la descripción exacta de la foto que va ahí. Se reemplaza por una foto con
   licencia (Unsplash/Pexels) elegida con el usuario — nunca se publica como si fuera la foto. ── */
export function FotoLugar({
  descripcion,
  className = '',
  forma = 'blob',
}: {
  /** "Foto: mamá e hijo revisando el celular en el sofá" — concreta, para poder buscarla. */
  descripcion: string;
  className?: string;
  forma?: 'blob' | 'blob-b' | 'redonda';
}) {
  return (
    <div
      role="img"
      aria-label={`Espacio para fotografía: ${descripcion}`}
      className={`relative flex items-start justify-center overflow-hidden p-3 ${forma === 'redonda' ? 'rounded-[var(--radius-card)]' : forma} ${className}`}
      style={{
        background:
          'radial-gradient(120% 80% at 30% 20%, rgb(255 255 255 / 0.45), transparent 60%), ' +
          'linear-gradient(160deg, var(--foto-1), var(--foto-2))',
      }}
    >
      <Camera size={28} strokeWidth={1.6} aria-hidden="true" className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 text-white/70" />
      <span className="relative mt-[12%] max-w-[70%] rounded-[var(--radius-button)] bg-black/30 px-2.5 py-1 text-center text-[11px] font-semibold leading-snug text-white/95 backdrop-blur-[2px] lg:text-[12px]">
        {descripcion}
      </span>
    </div>
  );
}
