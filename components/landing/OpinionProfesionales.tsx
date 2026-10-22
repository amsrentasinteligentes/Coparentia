'use client';

// BLOQUE "LO QUE DICEN PROFESIONALES DE FAMILIA" (2026-10-15) — prueba de terceros, justo antes de las
// preguntas frecuentes. Las citas se publican PALABRA POR PALABRA como las entregó el dueño, cada una con
// autorización escrita de quien la dijo (solo se corrige ortografía). Nada aquí se inventa: nombre,
// especialidad y ciudad vienen de quien autorizó. Si algún profesional tiene un vínculo con Coparentia,
// se dice debajo de su nombre (`vinculo`) — una opinión con vínculo no se presenta como independiente.
// Con UNA sola cita el bloque sigue viéndose bien (la columna de la imagen no depende de cuántas haya).

import { useId, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
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
        className="text-[16px] leading-[1.65] text-[var(--text-primary)] lg:text-[16px]"
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

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function OpinionProfesionales({ kicker = 'OPINIÓN DE PROFESIONALES', titulo, citas, imagen, nota, id }: OpinionProfesionalesProps) {
  const { contenedor, item } = useReveal();
  // Carrusel móvil: qué cita está al centro (para los puntos) y cómo llevar a una cita con un toque.
  const lista = useRef<HTMLUListElement>(null);
  const [activa, setActiva] = useState(0);
  const alDeslizar = () => {
    const ul = lista.current;
    const primera = ul?.firstElementChild as HTMLElement | null;
    if (!ul || !primera) return;
    setActiva(Math.min(citas.length - 1, Math.max(0, Math.round(ul.scrollLeft / (primera.offsetWidth + 16)))));
  };
  const irA = (i: number) => {
    const ul = lista.current;
    const tarjeta = ul?.children[i] as HTMLElement | undefined;
    if (!ul || !tarjeta) return;
    ul.scrollTo({ left: tarjeta.offsetLeft - (ul.clientWidth - tarjeta.offsetWidth) / 2, behavior: 'smooth' });
  };

  return (
    <SectionShell id={id} elevacion="marino" ariaLabel="Opinión de profesionales de familia">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[1040px]"
      >
        <motion.div variants={item} className="mx-auto max-w-[680px] text-center">
          <Kicker sobreMarino>{kicker}</Kicker>
          <h2 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--on-marino)] [font-family:var(--font-display)] md:text-[40px] lg:text-[46px]">
            {titulo}
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start">
          {/* En celular las citas van en un carrusel horizontal con snap (la siguiente asoma, así se ve que se desliza), igual que
              "Así se ve por dentro"; en pantallas grandes vuelven a ser una columna. */}
          <motion.ul
            ref={lista}
            onScroll={alDeslizar}
            variants={item}
            aria-label="Opiniones de profesionales, desliza para ver más"
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {citas.map((c) => (
              <li
                key={c.nombre}
                className="flex w-[85%] max-w-[420px] shrink-0 snap-center flex-col rounded-[var(--radius-card)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)] lg:w-auto lg:max-w-none"
              >
                <figure className="flex flex-1 flex-col gap-4">
                  {/* Monograma de quien opina (sus iniciales): le da un rostro tipográfico a cada cita sin inventar fotos. */}
                  <span
                    aria-hidden="true"
                    className="flex size-12 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)] text-[16px] font-bold text-[var(--accent-ink)] [font-family:var(--font-display)]"
                  >
                    {iniciales(c.nombre)}
                  </span>
                  <TextoCita texto={c.texto} extracto={c.extracto} />
                  <figcaption className="mt-auto">
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
          {/* Puntos tocables del carrusel (solo celular): dicen cuántas citas hay y en cuál vas. */}
          <div className="-mt-4 flex justify-center lg:hidden" role="group" aria-label="Ir a la opinión">
            {citas.map((c, i) => (
              <button
                key={c.nombre}
                type="button"
                onClick={() => irA(i)}
                aria-label={`Opinión ${i + 1} de ${citas.length}: ${c.nombre}`}
                aria-current={activa === i}
                className="flex size-11 items-center justify-center [touch-action:manipulation]"
              >
                {/* Mismos puntos que "Así se ve por dentro" (círculo de 8 px, el activo en el color de acento): un solo patrón. */}
                <span
                  className={`size-2 rounded-full transition-colors duration-200 ${
                    activa === i ? 'bg-[var(--accent-on-marino)]' : 'bg-[color-mix(in_oklab,var(--on-marino-2)_40%,transparent)]'
                  }`}
                />
              </button>
            ))}
          </div>

          <motion.figure variants={item} className="mx-auto hidden w-full max-w-[420px] lg:sticky lg:top-24 lg:block">
            {/* En celular la página de ejemplo vive en "Cómo funciona" (EjemploPdf), donde prueba lo que produce el Sello. */}
            <a
              href={imagen.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${imagen.alt} (se abre ampliada en otra pestaña)`}
              className="block overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-white shadow-[var(--shadow-2)] [touch-action:manipulation]"
            >
              <img src={imagen.src} alt={imagen.alt} width={imagen.ancho} height={imagen.alto} loading="lazy" className="block h-auto w-full" />
            </a>
            <figcaption className="mt-3 text-center text-[13px] leading-snug text-[var(--on-marino-2)]">
              {imagen.pie} Tócala para ampliarla.
            </figcaption>
          </motion.figure>
        </div>

        <motion.p variants={item} className="mx-auto mt-8 max-w-[62ch] text-center text-[13px] leading-[1.55] text-[var(--on-marino-2)] lg:text-[14px]">
          {nota}
        </motion.p>
      </motion.div>
    </SectionShell>
  );
}
