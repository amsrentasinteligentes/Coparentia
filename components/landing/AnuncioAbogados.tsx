'use client';

// SECCIÓN EXTRA — "Asistencia" (fuera de la estructura canónica de 19, pedida explícitamente por
// el usuario 2026-09-07 como "Para abogados de familia"; ampliada 2026-09-28 a las 3 categorías
// que ya existen dentro de la app — Abogados, Psicólogos, Trabajadores sociales — para no
// prometer en la landing algo más angosto que lo que la app ya ofrece). Audiencia distinta:
// profesionales que quieren anunciarse en Coparentia, no padres separados. Va DESPUÉS de la
// sección 9 (CTA final) y ANTES de la 10 (footer legal) — la estructura de 10 secciones que
// vende a Carlos NO se reordena ni se recorta; esto es un bloque aparte, visualmente distinto
// (tono B2B, no compite con el CTA principal). Justificación en ESTADO.md.
//
// RONDA 3 (2026-09-28, pedido del usuario): "que quede igual como está dentro de la app... no que
// se quede solamente en nombrar" — no basta con decir que hay 3 categorías, tienen que verse los
// profesionales reales y los artículos reales, para que la landing también sirva para atraer
// visitantes nuevos. Se reutilizan LOS MISMOS componentes de la app (misma fuente de datos en
// lib/profesionales.ts y lib/articulos.ts): un profesional o artículo nuevo aparece automáticamente
// en los dos lugares, sin tener que repetir el trabajo. Los artículos abren en /articulos/[slug]
// (página pública, sin necesitar cuenta) en vez de /asistencia/[slug] (esa sí exige estar registrado).

import { DirectorioProfesionales } from '@/components/app/DirectorioProfesionales';
import { ArticulosAsistencia } from '@/components/app/ArticulosAsistencia';
import { CtaButton, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { motion } from 'motion/react';

export interface AnuncioAbogadosProps {
  /** Email real de contacto para profesionales interesados. */
  contactoEmail: string;
  id?: string;
}

export function AnuncioAbogados({ contactoEmail, id = 'asistencia' }: AnuncioAbogadosProps) {
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="elevada" compacta ariaLabel="Asistencia profesional">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[720px] rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--bg)] p-6 md:p-10"
      >
        <motion.div variants={item} className="text-center">
          <Kicker>ASISTENCIA PROFESIONAL</Kicker>
          <h2 className="text-balance text-[24px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[32px]">
            Sé quien aparece cuando lo necesitan
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[var(--text-secondary)] lg:text-[17px]">
            Los padres que usan Coparentia documentan su caso mes a mes y, cuando necesitan un
            abogado de familia, un psicólogo o un trabajador social, lo buscan desde la misma app.
            Anúnciate y sé tú quien aparece en ese momento.
          </p>
        </motion.div>

        {/* Mismo directorio y mismos artículos que ve un usuario ya adentro de la app — ver nota
            de "RONDA 3" arriba: la landing no solo nombra las 3 categorías, las muestra. */}
        <motion.div variants={item}>
          <DirectorioProfesionales />
        </motion.div>
        <motion.div variants={item}>
          <ArticulosAsistencia basePath="/articulos" />
        </motion.div>

        <motion.div variants={item} className="mt-8 flex flex-col items-center gap-2">
          <CtaButton href={`mailto:${contactoEmail}?subject=${encodeURIComponent('Quiero anunciarme en Coparentia')}`} variant="outline" fullMobile={false}>
            Quiero anunciarme en Coparentia
          </CtaButton>
          <p className="text-[12px] text-[var(--text-tertiary)] lg:text-[13px]">Te respondemos en menos de 48 horas.</p>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
