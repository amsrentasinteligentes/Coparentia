'use client';

// KIT DE LANDING — §3 AGITACIÓN (blueprint: 55 §3)
// El costo de seguir igual, visible. El tipo de `frases` es string[] a propósito:
// es IMPOSIBLE pasarle un párrafo de 72 palabras — cada frase es corta (máx 2
// líneas; warn a las 18 palabras). El NÚMERO del costo va en [b]/[acento] desde
// el copy marcado (es el dato héroe de la sección). MISMO fondo elevado que §2
// (un solo movimiento visual, sin separador). Cero decoración de miedo.

import { motion } from 'motion/react';
import { MiniRing, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy, warnRango } from './MarkedCopy';

export interface AgitacionProps {
  /** Título opcional, centrado, mismo estilo que el h2 de "Directorio de especialistas"
   *  (2026-09-29, pedido del usuario) — para cuando la sección abre con una frase-ancla en vez
   *  de entrar directo a las frases justificadas. */
  titulo?: string;
  /** 2-4 frases MARCADAS y cortas — el array es el contrato: nada de párrafos. */
  frases: string[];
  /** Mini-card opcional "hoy vs en 6 meses" (55 §3). anilloValor (0-100) es
   *  OPCIONAL y solo se pinta con un dato real y honesto — nunca decorativo. */
  contraste?: {
    labelHoy: string;
    hoy: string;
    anilloHoy?: number;
    labelFuturo: string;
    futuro: string;
    anilloFuturo?: number;
  };
  id?: string;
}

export function Agitacion({ titulo, frases, contraste, id }: AgitacionProps) {
  warnRango('Agitación → frases', frases.length, 2, 4);
  frases.forEach((f, i) => warnCopy(`Agitación → frase ${i + 1}`, f, 18));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="elevada" flush="top" ariaLabel="El costo de seguir igual">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[620px] lg:max-w-[760px] lg:max-w-[900px]"
      >
        {titulo && (
          // Mismo tamaño y alineación (izquierda, no centrado) que el h2 de §4 Solución
          // ("Tu prueba, lista antes de que te pidan") — pedido del usuario, 2026-09-29, para que
          // no se vea "tan diferente" al resto de títulos de la landing. El bloque completo sigue
          // centrado DENTRO de la sección gracias al `mx-auto` del contenedor de arriba — lo que
          // cambia es que el TEXTO adentro ya no se centra, se alinea a la izquierda como el resto.
          <motion.h2
            variants={item}
            className="text-balance text-[30px] font-bold uppercase leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px] lg:text-[46px]"
          >
            <MarkedCopy text={titulo} />
          </motion.h2>
        )}
        <div className={`flex flex-col gap-4 ${titulo ? 'mt-4' : ''}`}>
          {frases.map((f, i) => (
            <motion.p
              key={i}
              variants={item}
              className="text-justify text-[17px] leading-[1.6] text-[var(--text-secondary)] lg:text-[19px]"
            >
              <MarkedCopy text={f} />
            </motion.p>
          ))}
        </div>

        {contraste && (
          <motion.div variants={item} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-[var(--bg)] p-5">
              {contraste.anilloHoy !== undefined && (
                <div className="relative shrink-0">
                  <MiniRing value={contraste.anilloHoy} tone="muted" />
                  <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold tabular-nums text-[var(--text-secondary)] [font-family:var(--font-display)] lg:text-[17px]">
                    {contraste.anilloHoy}%
                  </span>
                </div>
              )}
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)] lg:text-[13px]">
                  {contraste.labelHoy}
                </p>
                <p className="mt-2 text-[15px] leading-snug text-[var(--text-primary)] lg:text-[17px]">{contraste.hoy}</p>
              </div>
            </div>
            {/* "si nada cambia": más apagado/frío — el peso lo pone el copy, no el rojo */}
            <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-5">
              {contraste.anilloFuturo !== undefined && (
                <div className="relative shrink-0">
                  <MiniRing value={contraste.anilloFuturo} tone="muted" />
                  <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold tabular-nums text-[var(--text-secondary)] [font-family:var(--font-display)] lg:text-[17px]">
                    {contraste.anilloFuturo}%
                  </span>
                </div>
              )}
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)] lg:text-[13px]">
                  {contraste.labelFuturo}
                </p>
                <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)] lg:text-[17px]">{contraste.futuro}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </SectionShell>
  );
}
