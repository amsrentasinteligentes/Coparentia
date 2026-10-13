'use client';

// KIT DE LANDING — §2 PROBLEMA (blueprint: 55 §2)
// 3-5 PREGUNTAS que hacen asentir, apiladas — NUNCA párrafo corrido. Cada una con
// su ícono de dolor SVG en IconChip tone="muted" (neutro apagado: los checks son
// de la solución, no del problema). Máx 12 palabras por card (warn). Fondo
// ELEVADO: abre el bloque problema+agitación (un solo movimiento visual, T1).

import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { IconChip, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy, warnRango } from './MarkedCopy';

export interface PreguntaProblema {
  /** Ícono de dolor de Lucide (Inbox, AlarmClock, Repeat…) — jamás emoji. */
  icon: LucideIcon;
  /** Copy MARCADO — pregunta directa al lector, máx 12 palabras. */
  textoMarked: string;
}

export interface GrupoProblema {
  /** Encabezado del grupo ("Si recibes la cuota"): a quién le habla cada tanda de preguntas. */
  encabezado: string;
  preguntas: PreguntaProblema[];
}

export interface ProblemaProps {
  /** Título opcional ("¿Te suena?") — o entrar directo a la primera pregunta. */
  titulo?: string;
  /** 3-5 preguntas, cada una trazada a un dolor de FICHA-AVATAR.md. */
  preguntas?: PreguntaProblema[];
  /** Alternativa a `preguntas`: las mismas tarjetas repartidas en grupos con encabezado
   *  (hallazgo 3 de la auditoría: la página mezclaba, sin avisar, dolores de quien PAGA la cuota
   *  y de quien la RECIBE). Cada grupo: 2-5 preguntas. */
  grupos?: GrupoProblema[];
  id?: string;
}

export function Problema({ titulo, preguntas, grupos, id }: ProblemaProps) {
  const listas: { encabezado?: string; preguntas: PreguntaProblema[] }[] = grupos ?? [{ preguntas: preguntas ?? [] }];
  listas.forEach((l) => {
    const origen = l.encabezado ? `Problema → ${l.encabezado}` : 'Problema → preguntas';
    warnRango(origen, l.preguntas.length, grupos ? 2 : 3, 5);
    l.preguntas.forEach((p, i) => warnCopy(`${origen} ${i + 1}`, p.textoMarked, 12));
  });
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="elevada" flush="bottom" ariaLabel="El problema">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[620px] lg:max-w-[760px] lg:max-w-[900px]"
      >
        {titulo && (
          <motion.h2
            variants={item}
            className="mb-8 text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px] lg:text-[46px]"
          >
            {titulo}
          </motion.h2>
        )}
        {listas.map((l, g) => (
          <div key={g} className={g > 0 ? 'mt-10' : undefined}>
            {l.encabezado && (
              <motion.h3
                variants={item}
                className="mb-4 text-balance text-[20px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)] lg:text-[24px]"
              >
                {l.encabezado}
              </motion.h3>
            )}
            <ul className="flex flex-col gap-4">
              {l.preguntas.map((p, i) => (
                <motion.li
                  key={i}
                  variants={item}
                  className="flex items-start gap-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--bg)] p-4 shadow-[var(--shadow-1)]"
                >
                  <IconChip icon={p.icon} tone="muted" />
                  <p className="pt-2 text-[17px] font-medium leading-snug text-[var(--text-primary)] lg:text-[19px]">
                    <MarkedCopy text={p.textoMarked} />
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
