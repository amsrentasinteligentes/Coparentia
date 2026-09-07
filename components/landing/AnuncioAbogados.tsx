'use client';

// SECCIÓN EXTRA — "Para abogados de familia" (fuera de la estructura canónica de 19,
// pedida explícitamente por el usuario 2026-09-07: audiencia distinta — abogados que
// quieren anunciarse en Coparentia, no padres separados). Va DESPUÉS de la sección 9
// (CTA final) y ANTES de la 10 (footer legal) — la estructura de 10 secciones que
// vende a Carlos NO se reordena ni se recorta; esto es un bloque aparte, visualmente
// distinto (tono B2B, no compite con el CTA principal). Justificación en ESTADO.md.

import { BadgeCheck, MessageSquareText, Users } from 'lucide-react';
import { IconChip, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { motion } from 'motion/react';

export interface AnuncioAbogadosProps {
  /** Email real de contacto para abogados interesados. */
  contactoEmail: string;
  id?: string;
}

const BENEFICIOS = [
  {
    icon: Users,
    titulo: 'Tu cliente ideal, ya buscando ayuda',
    detalle: 'Padres separados que documentan su caso y necesitan asesoría de un abogado de familia real.',
  },
  {
    icon: BadgeCheck,
    titulo: 'Perfil verificado en la app',
    detalle: 'Apareces con tu nombre, tu especialidad y tu ciudad — no un banner genérico.',
  },
  {
    icon: MessageSquareText,
    titulo: 'Contacto directo, sin intermediarios',
    detalle: 'El usuario te escribe a ti cuando decide que necesita acompañamiento legal.',
  },
];

export function AnuncioAbogados({ contactoEmail, id = 'para-abogados' }: AnuncioAbogadosProps) {
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="elevada" compacta ariaLabel="Para abogados de familia">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[720px] rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--bg)] p-6 md:p-10"
      >
        <motion.div variants={item} className="text-center">
          <Kicker>PARA ABOGADOS DE FAMILIA</Kicker>
          <h2 className="text-balance text-[24px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[32px]">
            Sé el abogado que nuestros usuarios ya están buscando
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Coparentia conecta a diario con padres separados que documentan su caso y, tarde o
            temprano, necesitan un abogado de familia de confianza. Anúnciate y sé tú quien
            aparece cuando llega ese momento.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {BENEFICIOS.map((b, i) => (
            <motion.div key={i} variants={item} className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <IconChip icon={b.icon} tone="accent" />
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">{b.titulo}</h3>
                <p className="mt-1 text-[13px] leading-snug text-[var(--text-secondary)]">{b.detalle}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={item} className="mt-8 flex flex-col items-center gap-2">
          <a
            href={`mailto:${contactoEmail}?subject=${encodeURIComponent('Quiero anunciarme en Coparentia')}`}
            className="inline-flex h-12 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] px-8 text-[15px] font-semibold text-[var(--accent)] transition-colors duration-150 hover:bg-[var(--chip-bg)] [touch-action:manipulation]"
          >
            Quiero anunciarme como abogado
          </a>
          <p className="text-[12px] text-[var(--text-tertiary)]">Cupos limitados por ciudad — te contactamos en menos de 48 horas.</p>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
