'use client';

// MOMENTOS EMOCIONALES M1 y M2 de `56-MOMENTOS-EMOCIONALES.md`, con la personalidad de FICHA-ARTE
// ("Sereno · Sobrio · Cálido", celebración N3: sello, SIN fanfarria ni confeti):
//   · M1 "primera victoria": el primer comprobante REAL de la cuenta. Pantalla completa en 3 actos:
//     el resultado (el comprobante con su Sello) → qué significa → el siguiente paso.
//   · M2 "hito": 3, 6 o 12 meses con cuota registrada. Pantalla completa con el anillo que se dibuja
//     y el número protagonista.
// Solo se muestran con datos REALES y una única vez por hito (quien lo llama guarda la marca).
// Pantalla completa sin barra inferior (es un momento, no una vista); el CTA lleva a la siguiente
// acción del loop (el expediente), nunca a "Cerrar". Respeta prefers-reduced-motion.

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { Pildora } from '@/components/app/ui';

type Dato = { valor: string; etiqueta: string };

type Props =
  | {
      tipo: 'primera';
      /** Lo que el usuario acaba de subir: el ARTEFACTO real que se muestra en grande. */
      comprobante: { concepto: string; monto: string; fecha: string };
      onVer: () => void;
      onCerrar: () => void;
    }
  | {
      tipo: 'hito';
      meses: number;
      /** Fracción 0-1 del anillo (meses logrados sobre la meta del caso). */
      avance: number;
      datos: Dato[];
      onVer: () => void;
      onCerrar: () => void;
    };

const EASE = [0.22, 0.61, 0.36, 1] as const;

export function MomentoHito(props: Props) {
  const reduce = useReducedMotion();
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ctaRef.current?.focus();
    const alTeclear = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') props.onCerrar();
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [props]);

  const esPrimera = props.tipo === 'primera';
  const titulo = esPrimera ? 'Tu primer comprobante quedó sellado' : `${props.meses} meses de registro`;
  const cuerpo = esPrimera
    ? 'Ya existe constancia fechada de que pagaste. Cada comprobante nuevo se suma a tu expediente, listo para mostrar cuando lo necesites.'
    : 'Tu expediente ya cuenta meses enteros de pagos con Sello. Es justo lo que un abogado o un conciliador quiere ver.';

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.12 : 0.25 }}
      className="fixed inset-0 z-50 flex min-h-dvh flex-col bg-[var(--bg)]"
    >
      {/* Fondo con profundidad: mancha radial de marca detrás del protagonista (nunca plano). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
        style={{ background: 'radial-gradient(ellipse at 50% 32%, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 68%)' }}
      />

      <div className="relative mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center px-6 pt-[max(24px,env(safe-area-inset-top))] text-center">
        {esPrimera ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="w-full max-w-[340px] rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)]"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--status-success-bg,color-mix(in_oklab,var(--status-success)_16%,transparent))] text-[var(--status-success)]">
                {!reduce && (
                  <motion.span
                    aria-hidden="true"
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                    className="absolute inset-0 rounded-full border-2 border-[var(--status-success)]"
                  />
                )}
                <ShieldCheck size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[16px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">{props.comprobante.concepto}</p>
                <p className="text-[14px] text-[var(--text-secondary)]">{props.comprobante.fecha}</p>
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] pt-3">
              <p className="text-[24px] font-extrabold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{props.comprobante.monto}</p>
              <Pildora texto="Con Sello" tono="exito" />
            </div>
          </motion.div>
        ) : (
          <div className="relative flex size-[168px] items-center justify-center">
            <svg viewBox="0 0 168 168" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
              <circle cx="84" cy="84" r="72" fill="none" stroke="color-mix(in oklab, var(--accent) 16%, transparent)" strokeWidth="11" />
              <motion.circle
                cx="84"
                cy="84"
                r="72"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 72}
                initial={{ strokeDashoffset: reduce ? 2 * Math.PI * 72 * (1 - props.avance) : 2 * Math.PI * 72 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 72 * (1 - props.avance) }}
                transition={{ duration: reduce ? 0 : 1.1, ease: 'easeOut' }}
              />
            </svg>
            <motion.span
              initial={reduce ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 14, delay: 1.0 }}
              className="text-[64px] font-extrabold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]"
            >
              {props.meses}
            </motion.span>
          </div>
        )}

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.35 }}
          className="mt-8 text-balance text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]"
        >
          {titulo}
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.5 }}
          className="mt-3 max-w-[34ch] text-[16px] leading-[1.5] text-[var(--text-secondary)]"
        >
          {cuerpo}
        </motion.p>

        {!esPrimera && props.datos.length > 0 && (
          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.65 }}
            className="mt-6 flex gap-3"
          >
            {props.datos.slice(0, 2).map((d) => (
              <div key={d.etiqueta} className="min-w-[120px] rounded-[var(--radius-button)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-1)]">
                <dd className="text-[24px] font-extrabold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{d.valor}</dd>
                <dt className="mt-1 text-[12px] text-[var(--text-secondary)]">{d.etiqueta}</dt>
              </div>
            ))}
          </motion.dl>
        )}
      </div>

      <div className="relative mx-auto w-full max-w-[520px] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
        <motion.button
          ref={ctaRef}
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={props.onVer}
          className="flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-bold text-[var(--on-accent,var(--bg))] [touch-action:manipulation]"
        >
          {esPrimera ? 'Ver mi expediente' : 'Exportar mi expediente'}
        </motion.button>
        <button
          type="button"
          onClick={props.onCerrar}
          className="mt-2 flex min-h-11 w-full items-center justify-center text-[14px] font-semibold text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          {esPrimera ? 'Seguir registrando' : 'Ahora no'}
        </button>
      </div>
    </motion.div>
  );
}
