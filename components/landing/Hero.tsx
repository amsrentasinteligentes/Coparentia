'use client';

// KIT DE LANDING — §1 HERO (blueprint: 55 §1)
// Reglas embebidas: H1 bold completo con acento vía copy marcado · subtítulo con
// tope duro de 14 palabras (warn + truncado) · CTA vivo ≥52px con sombra tintada ·
// franja de prueba social como slot (SOLO datos reales — 19 §1) · mesh sutil de
// fondo YA incluido · carga inmediata (fade simple, nada que compita con el LCP).
//
// VARIANTE "CUIDADO EN CALMA" (2026-09-17, dirección C elegida por el usuario): el visual
// deja de ser una captura sola en tarjeta y pasa a una ESCENA — una fotografía humana dentro
// de una forma orgánica azul, la captura real de la app montada encima y una burbuja con un
// dato honesto. Es lo que hacen las tres referencias del usuario (2houses, Niddo, OFW): el
// producto nunca va solo, siempre convive con la familia a la que sirve. El header gana
// enlaces de sección en computador (las tres referencias los tienen; en celular sigue mínimo).

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Camera } from 'lucide-react';
import { Blob, CheckCustom, CtaButton } from './ui';
import { MarkedCopy, truncarMarcado, warnCopy } from './MarkedCopy';

export interface EnlaceNav {
  label: string;
  href: string;
}

export interface HeroProps {
  appName: string;
  /** Logo real del proyecto; sin él, marca mínima con el acento. */
  logo?: ReactNode;
  loginHref?: string;
  loginLabel?: string;
  /** Enlaces de sección (solo computador): "Cómo funciona", "Planes"… máx 4. */
  navLinks?: EnlaceNav[];
  /** Copy MARCADO de docs/copy/landing.md — máx 8-10 palabras, 1-3 en [acento]. */
  h1Marked: string;
  /** Copy MARCADO — máx 14 palabras (52): el kit trunca y avisa si excede. */
  subtitleMarked: string;
  /** 1ª persona + beneficio ("Probar mi primer escaneo") — nunca "Registrarse". */
  ctaLabel: string;
  /** Destino según el MODELO de 02C: checkout Hotmart (M1) u /onboarding (M2). */
  ctaHref: string;
  /** Franja bajo el CTA (posición FIJA de 19 §1). Día 1 sin números: la garantía. */
  socialProof?: ReactNode;
  /** Captura real de la app (teléfono). Sin visual → placeholder honesto (55 §1.3). */
  visual?: ReactNode;
  /** Fotografía humana (o su <FotoLugar>) que va dentro de la forma orgánica. */
  foto?: ReactNode;
  /** Burbuja con UN dato honesto sobre la escena ("Tu primer expediente · Listo en 10 minutos"). */
  burbuja?: { titulo: string; dato: string };
  /** Fila de 3 píldoras bajo la escena — el mensaje literal de la dirección C
      ("Gastos al día · Comprobantes con fecha · Mente en calma"). */
  pilares?: string[];
  /** Sugerencia CONCRETA de qué imagen poner en el placeholder — nunca "imagen aquí". */
  visualPlaceholderSugerencia?: string;
  id?: string;
}

export function Hero({
  appName,
  logo,
  loginHref,
  loginLabel = 'Entrar',
  navLinks = [],
  h1Marked,
  subtitleMarked,
  ctaLabel,
  ctaHref,
  socialProof,
  visual,
  foto,
  burbuja,
  pilares = [],
  visualPlaceholderSugerencia = 'captura de la pantalla principal con datos reales',
  id = 'hero',
}: HeroProps) {
  warnCopy('Hero → h1', h1Marked, 10);
  warnCopy('Hero → subtítulo', subtitleMarked, 14);
  const subtitulo = truncarMarcado(subtitleMarked, 14);

  return (
    <section id={id} className="relative overflow-hidden pb-16 md:pb-24">
      {/* Fondo con profundidad: mesh/radial sutil del acento — nunca fill plano */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(900px 480px at 50% -10%, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 62%), ' +
            'radial-gradient(640px 420px at 100% 0%, color-mix(in oklab, var(--accent-2) 10%, transparent) 0%, transparent 58%)',
        }}
      />

      <div className="mx-auto w-full max-w-[1140px] lg:max-w-[1280px] 2xl:max-w-[1400px] px-5">
        {/* Header 64px: marca a la izquierda; en computador enlaces de sección + CTA chico;
            en celular SOLO "Entrar" terciario (19). */}
        <header className="flex h-16 items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 text-[16px] font-semibold text-[var(--text-primary)] lg:text-[18px]">
            {logo ?? <span aria-hidden="true" className="size-6 rounded-[8px] bg-[var(--accent)]" />}
            {appName}
          </a>
          <nav aria-label="Secciones" className="flex items-center gap-1 md:gap-2">
            {navLinks.slice(0, 4).map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hidden px-3 py-3 text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] md:inline-block lg:text-[16px]"
              >
                {l.label}
              </a>
            ))}
            {loginHref && (
              <a href={loginHref} className="px-2 py-3 text-[14px] font-medium text-[var(--text-tertiary)] md:px-3 md:text-[var(--text-secondary)] lg:text-[16px]">
                {loginLabel}
              </a>
            )}
            <a
              href={ctaHref}
              className="cta-solid hidden h-10 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-[14px] font-semibold text-[var(--on-accent)] shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--accent)_55%,transparent)] md:inline-flex lg:text-[16px]"
            >
              {ctaLabel}
            </a>
          </nav>
        </header>

        {/* HERO EN DOS COLUMNAS DESDE `lg`: copy a la izquierda + escena a la derecha (como las
            tres apps del nicho). En celular: pila centrada, la escena debajo del CTA.
            Carga inmediata: fade simple 300ms — el LCP manda (55 T4). */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-auto flex max-w-[820px] flex-col items-center pt-8 text-center md:pt-14 lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pt-10 lg:text-left"
        >
          <div className="flex flex-col items-center lg:items-start">
            {/* H1: bold completo por defecto; el acento lo pone el [acento] del copy */}
            <h1 className="text-balance text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[56px] lg:text-[64px] 2xl:text-[70px]">
              <MarkedCopy text={h1Marked} />
            </h1>

            <p className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-[var(--text-secondary)] md:text-[18px] lg:text-[21px]">
              <MarkedCopy text={subtitulo} />
            </p>

            <div className="mt-7 w-full sm:w-auto">
              <CtaButton href={ctaHref} alto={56}>{ctaLabel}</CtaButton>
            </div>

            {/* Franja de prueba social: 8-12px bajo el CTA — SOLO números reales */}
            {socialProof && (
              <div className="mt-3 text-[13px] text-[var(--text-secondary)] lg:text-[15px]">{socialProof}</div>
            )}
          </div>

          {/* LA ESCENA: forma orgánica + foto + captura + burbuja. Alto fijo por breakpoint para
              que no haya salto de layout (CLS 0) mientras cargan las imágenes. */}
          <div className="relative mt-10 h-[340px] w-full max-w-[420px] sm:h-[400px] lg:mt-0 lg:h-[540px] lg:max-w-none lg:justify-self-end">
            <Blob className="-right-10 -top-6 h-[92%] w-[88%]" opacidad={0.14} />
            {foto && (
              <div className="absolute right-0 top-0 h-[66%] w-[74%] overflow-hidden blob shadow-[var(--shadow-2)]">
                {foto}
              </div>
            )}
            {visual ? (
              /* La captura tiene filas que PARECEN tapables: tocarla lleva al mismo destino que el
                 CTA, nunca a nada (regla 11 de UX). */
              <a
                href={ctaHref}
                aria-label={ctaLabel}
                className="absolute bottom-0 left-0 block w-[38%] max-w-[180px] overflow-hidden rounded-[var(--radius-phone)] border-[5px] border-[color-mix(in_oklab,var(--text-primary)_92%,var(--accent))] bg-[var(--text-primary)] shadow-[var(--shadow-2)] transition-transform duration-150 active:scale-[0.99] lg:bottom-4 lg:left-[4%]"
              >
                {visual}
              </a>
            ) : (
              /* Placeholder HONESTO (55 §1.3): dashed + sugerencia. */
              <div className="absolute bottom-0 left-[14%] flex aspect-[9/19] w-[46%] max-w-[210px] flex-col items-center justify-center gap-3 rounded-[var(--radius-phone)] border-2 border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)] bg-[var(--surface)] px-4">
                <Camera size={20} color="var(--text-secondary)" aria-hidden="true" />
                <p className="text-center text-[13px] font-medium leading-snug text-[var(--text-secondary)] lg:text-[15px]">
                  Sugerencia: {visualPlaceholderSugerencia}
                </p>
              </div>
            )}
            {burbuja && (
              <div
                className="absolute bottom-2 right-0 w-[48%] max-w-[220px] rounded-[var(--radius-card)] rounded-bl-[8px] px-5 py-4 text-left text-[var(--on-accent)] shadow-[0_18px_40px_-14px_color-mix(in_oklab,var(--accent-deep,var(--accent))_60%,transparent)] lg:bottom-6 lg:right-2"
                // Desde --accent (4.7:1 con blanco), no desde la nota clara: con #5b93e8 el 12px al 85%
                // medía 2.8:1 (revisor, clara r3) — mismo fallo ya corregido en el bloque de cierre.
                style={{ background: 'linear-gradient(150deg, var(--accent), var(--accent-deep, var(--accent)))' }}
              >
                <p className="text-[12px] font-semibold lg:text-[13px]">{burbuja.titulo}</p>
                <p className="mt-1 text-[22px] font-extrabold leading-[1.1] [font-family:var(--font-display)] md:text-[26px]">
                  {burbuja.dato}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {pilares.length > 0 && (
          <ul className="mx-auto mt-10 grid max-w-[820px] grid-cols-1 gap-3 sm:grid-cols-3 lg:mx-0 lg:max-w-none">
            {pilares.slice(0, 3).map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 rounded-[var(--radius-button)] bg-[var(--surface)] px-5 py-4 text-[15px] font-semibold text-[var(--text-primary)] shadow-[var(--shadow-1)] lg:py-5 lg:text-[17px]"
              >
                <CheckCustom />
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
