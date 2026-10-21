'use client';

// BLOQUE "LO QUE DICEN PROFESIONALES DE FAMILIA" (2026-10-15) — prueba de terceros, justo antes de las
// preguntas frecuentes. Las citas se publican PALABRA POR PALABRA como las entregó el dueño, cada una con
// autorización escrita de quien la dijo (solo se corrige ortografía). Nada aquí se inventa: nombre,
// especialidad y ciudad vienen de quien autorizó. Si algún profesional tiene un vínculo con Coparentia,
// se dice debajo de su nombre (`vinculo`) — una opinión con vínculo no se presenta como independiente.
// Con UNA sola cita el bloque sigue viéndose bien (la columna de la imagen no depende de cuántas haya).

import { useId, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, MapPin, Quote } from 'lucide-react';
import { Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export interface CitaProfesional {
  texto: string;
  /** Frase completa copiada TAL CUAL de `texto`: es lo que se ve recogido; el texto entero se abre con "Leer cita completa". */
  extracto?: string;
  nombre: string;
  especialidad: string;
  ciudad: string;
  /** Vínculo con Coparentia, si existe (se muestra bajo el nombre). */
  vinculo?: string;
}

export interface OpinionProfesionalesProps {
  kicker?: string;
  titulo: string;
  citas: CitaProfesional[];
  imagen: { src: string; alt: string; pie: string; ancho: number; alto: number };
  /** Aclaración legal pequeña bajo el bloque. */
  nota: string;
  id?: string;
}

// Cada cita se ve recogida (un extracto = una frase literal de la misma cita) y se despliega entera con un
// toque: el texto completo sigue en la página palabra por palabra, como lo autorizó cada profesional.
function TextoCita({ texto, extracto }: { texto: string; extracto?: string }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();
  const larga = !!extracto && extracto !== texto;
  return (
    <>
      <blockquote
        id={id}
        className="text-[15px] leading-[1.65] text-[var(--text-primary)] lg:text-[16px]"
      >
        “{larga && !abierta ? extracto : texto}”
      </blockquote>
      {larga && (
        <button
          type="button"
          onClick={() => setAbierta((v) => !v)}
          aria-expanded={abierta}
          aria-controls={id}
          className="-mt-2 flex min-h-11 items-center self-start text-[14px] font-semibold text-[var(--accent-ink,var(--accent))] underline underline-offset-2 [touch-action:manipulation]"
        >
          {abierta ? 'Leer menos' : 'Leer cita completa'}
        </button>
      )}
    </>
  );
}

export function OpinionProfesionales({ kicker = 'OPINIÓN DE PROFESIONALES', titulo, citas, imagen, nota, id }: OpinionProfesionalesProps) {
  const { contenedor, item } = useReveal();
  // 2026-10-20 (ruta 1): la página de ejemplo del PDF ya no ocupa media pantalla en celular; se abre con un toque.
  const [verEjemplo, setVerEjemplo] = useState(false);
  const ejemploId = useId();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Opinión de profesionales de familia">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[1040px]"
      >
        <motion.div variants={item} className="mx-auto max-w-[680px] text-center">
          <Kicker>{kicker}</Kicker>
          <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px] lg:text-[46px]">
            {titulo}
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start">
          <motion.ul variants={item} className="flex flex-col gap-4">
            {citas.map((c) => (
              <li
                key={c.nombre}
                className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] p-6 shadow-[var(--shadow-1)]"
              >
                <figure className="flex flex-col gap-4">
                  <span
                    aria-hidden="true"
                    className="hidden size-10 items-center justify-center rounded-full sm:flex border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)]"
                  >
                    <Quote size={18} strokeWidth={1.9} color="var(--accent)" aria-hidden="true" />
                  </span>
                  <TextoCita texto={c.texto} extracto={c.extracto} />
                  <figcaption>
                    <p className="text-[16px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">{c.nombre}</p>
                    <p className="mt-0.5 text-[14px] leading-snug text-[var(--text-secondary)]">{c.especialidad}</p>
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-[var(--text-tertiary)]">
                      <MapPin size={13} aria-hidden="true" />
                      {c.ciudad}
                    </p>
                    {c.vinculo && <p className="mt-2 text-[13px] font-semibold text-[var(--accent-ink,var(--accent))]">{c.vinculo}</p>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </motion.ul>

          <motion.figure variants={item} className="mx-auto w-full max-w-[420px] lg:sticky lg:top-24">
            <button
              type="button"
              onClick={() => setVerEjemplo((v) => !v)}
              aria-expanded={verEjemplo}
              aria-controls={ejemploId}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[15px] font-semibold text-[var(--accent-ink,var(--accent))] [touch-action:manipulation] lg:hidden"
            >
              {verEjemplo ? 'Ocultar la página de ejemplo' : 'Ver una página de ejemplo del expediente'}
              <ChevronDown size={18} aria-hidden="true" className={`transition-transform duration-200 ${verEjemplo ? 'rotate-180' : ''}`} />
            </button>
            <div id={ejemploId} className={`${verEjemplo ? 'mt-4 block' : 'hidden'} lg:mt-0 lg:block`}>
            <a
              href={imagen.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${imagen.alt} (se abre ampliada en otra pestaña)`}
              className="block overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-white shadow-[var(--shadow-2)] [touch-action:manipulation]"
            >
              <img src={imagen.src} alt={imagen.alt} width={imagen.ancho} height={imagen.alto} loading="lazy" className="block h-auto w-full" />
            </a>
            <figcaption className="mt-3 text-center text-[13px] leading-snug text-[var(--text-secondary)]">
              {imagen.pie} <span className="text-[var(--text-tertiary)]">Tócala para ampliarla.</span>
            </figcaption>
            </div>
          </motion.figure>
        </div>

        <motion.p variants={item} className="mx-auto mt-8 max-w-[62ch] text-center text-[13px] leading-[1.55] text-[var(--text-tertiary)] lg:text-[14px]">
          {nota}
        </motion.p>
      </motion.div>
    </SectionShell>
  );
}
