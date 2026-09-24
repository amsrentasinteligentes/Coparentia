'use client';

// KIT DE LANDING — §4 SOLUCIÓN (blueprint: 55 §4)
// Vuelve al fondo BASE (el alivio también es visual). Kicker + título + el
// MECANISMO BAUTIZADO en su chip con <Accent> y hairline (uno de los 1-3 usos
// permitidos por vista) + Big Idea + EXACTAMENTE 3 pasos con number chip 44px
// (tupla en el tipo: ni 2 ni 4). Pasos entran escalonados (whileInView +
// stagger, reduced-motion respetado).
//
// LA DEMO VIVE AQUÍ (2026-09-23, decisión del dueño): antes era una sección aparte
// más abajo, después del precio, y el revisor marcaba que la única prueba del
// mecanismo llegaba cuando mucha gente ya se había ido. Ahora el video ACOMPAÑA a
// los 3 pasos —cada paso lleva su marca de tiempo—, así que se lee y se ve en el
// mismo movimiento. Se reproduce sola, muda, en bucle y SOLO al entrar en pantalla
// (no gasta datos de quien nunca llega hasta aquí); con `prefers-reduced-motion` se
// queda en su primer cuadro, con el botón para verla.

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Loader2, Pause, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import { Accent, Blob, CtaButton, Hairline, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import type { ReactNode } from 'react';
import { MarkedCopy, warnCopy } from './MarkedCopy';

export interface PasoMecanismo {
  /** Título del paso — 16px/600. */
  titulo: string;
  /** UNA línea (warn a las 14 palabras). */
  detalle: string;
  /** Marca de tiempo del video donde se ve este paso — "0:03". Solo con demo. */
  marca?: string;
}

export interface SolucionProps {
  /** Kicker en acento — default "EL MECANISMO". */
  kicker?: string;
  /** Copy MARCADO del título de sección (máx 8 palabras). */
  tituloMarked: string;
  /** Nombre PROPIO del mecanismo bautizado (19) — se pinta en el chip con <Accent>. */
  mecanismo: string;
  /** Big Idea en 1-2 líneas, copy MARCADO. */
  bigIdeaMarked: string;
  /** Los 3 pasos del mecanismo — la tupla obliga a que sean exactamente 3. */
  pasos: [PasoMecanismo, PasoMecanismo, PasoMecanismo];
  /** El mecanismo GRABADO de la app real (datos de ejemplo, nunca de un cliente).
   *  `video` es la ruta sin extensión: se sirven .webm y .mp4, más el póster .jpg */
  demo?: { video: string; pie?: string; inicioSeg?: number };
  /** Fotografía humana (o <FotoLugar>) en forma orgánica — variante clara.
   *  Se ignora cuando hay `demo`: dos bloques grandes en una sección la saturan. */
  foto?: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  id?: string;
}

export function Solucion({
  kicker = 'CÓMO FUNCIONA',
  tituloMarked,
  mecanismo,
  bigIdeaMarked,
  pasos,
  demo,
  foto,
  ctaLabel,
  ctaHref,
  id,
}: SolucionProps) {
  warnCopy('Solución → título', tituloMarked, 8);
  warnCopy('Solución → Big Idea', bigIdeaMarked, 30);
  pasos.forEach((p, i) => warnCopy(`Solución → paso ${i + 1}`, p.detalle, 14));
  const { contenedor, item } = useReveal();
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [cargando, setCargando] = useState(false);
  // Una vez que el video arrancó, el botón grande no vuelve: los controles del propio
  // video quedan como único mando (dos plays a la vez confunden).
  const [yaArranco, setYaArranco] = useState(false);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          el.play().then(() => setReproduciendo(true)).catch(() => setReproduciendo(false));
        } else {
          el.pause();
          setReproduciendo(false);
        }
      },
      { threshold: 0.4 }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, [reduce, demo]);

  const reproducir = (): void => {
    setCargando(true);
    ref.current?.play().then(() => setReproduciendo(true)).catch(() => setCargando(false));
  };

  /** Segundo por el que entra —y vuelve a entrar— la reproducción. El montaje v2 ya empieza
   *  dentro de la app, así que es 0; queda como prop por si un montaje futuro trae cabecera.
   *  No se usa `loop`: el bucle nativo ignoraría ese punto de entrada. */
  const INICIO = demo?.inicioSeg ?? 0;

  const alEmpezar = (): void => {
    const el = ref.current;
    if (el && el.currentTime < INICIO) el.currentTime = INICIO;
  };

  const alTerminar = (): void => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = INICIO;
    void el.play();
  };

  const alternarPausa = (): void => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPausado(false);
    } else {
      el.pause();
      setPausado(true);
    }
  };

  /** "0:10" → 10. Las marcas de cada paso saltan al momento del video donde ocurre. */
  const segundosDe = (marca: string): number => {
    const [m, sg] = marca.split(':').map((n) => Number(n));
    return (m || 0) * 60 + (sg || 0);
  };

  const irA = (marca: string): void => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = Math.max(INICIO, segundosDe(marca));
    void el.play();
    setPausado(false);
    // En celular el video va ARRIBA de los pasos: sin esto el salto ocurría fuera de pantalla.
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Cómo funciona">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[780px] lg:max-w-[940px]"
      >
        <motion.div variants={item}>
          <Kicker>{kicker}</Kicker>
          <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px] lg:text-[46px]">
            <MarkedCopy text={tituloMarked} />
          </h2>
        </motion.div>

        {/* El chip del mecanismo bautizado — hairline + <Accent> (55 §4) */}
        <motion.div variants={item} className="mt-4">
          <Hairline surface="bg" radio="button" className="w-fit">
            <span className="block px-4 py-2 text-[15px] font-semibold [--accent:var(--accent-ink)] lg:text-[17px]">
              <Accent>{mecanismo}</Accent>
            </span>
          </Hairline>
        </motion.div>

        <motion.p variants={item} className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-[var(--text-secondary)] md:text-[18px] lg:text-[20px]">
          <MarkedCopy text={bigIdeaMarked} />
        </motion.p>

        {/* Con demo: el video a un lado y los 3 pasos al otro (en celular, uno bajo el otro),
            para que se lea el paso y se vea ocurriendo. Sin demo: la foto humana y los pasos
            en 3 columnas, como en el resto del kit. */}
        {demo ? (
          <div className="mt-10 flex flex-col lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
            <motion.div variants={item} className="order-2 mt-10 flex flex-col items-center lg:order-2 lg:mt-0">
              <Hairline emphasis surface="surface" className="relative w-full max-w-[220px] p-2 shadow-[var(--shadow-2)] lg:max-w-[320px]">
                <video
                  ref={ref}
                  className="block w-full rounded-[calc(var(--radius-card)-6px)]"
                  poster={`${demo.video}-poster.jpg`}
                  muted
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={alEmpezar}
                  onWaiting={() => setCargando(true)}
                  onPlaying={() => { setCargando(false); setReproduciendo(true); setYaArranco(true); setPausado(false); }}
                  onEnded={alTerminar}
                  aria-label="Demostración: registrar un comprobante, el Sello de Confianza y el expediente en PDF"
                >
                  <source src={`${demo.video}.webm`} type="video/webm" />
                  <source src={`${demo.video}.mp4`} type="video/mp4" />
                  Tu navegador no puede mostrar el video.
                </video>

                {/* Si el navegador bloquea la reproducción automática, el botón la dispara. */}
                {!reproduciendo && !yaArranco && !reduce && (
                  <button
                    type="button"
                    onClick={reproducir}
                    aria-label="Ver la demostración"
                    className="absolute inset-2 flex items-center justify-center rounded-[calc(var(--radius-card)-6px)] bg-gradient-to-b from-[color-mix(in_oklab,var(--text-primary)_12%,transparent)] via-[color-mix(in_oklab,var(--text-primary)_10%,transparent)] to-transparent [touch-action:manipulation]"
                  >
                    <span className="flex size-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_45%,transparent)]">
                      {cargando ? (
                        <Loader2 size={22} className="motion-safe:animate-spin" aria-hidden="true" />
                      ) : (
                        <Play size={22} fill="currentColor" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                )}

              </Hairline>

              {/* Mando propio: los controles del navegador montaban su barra negra sobre la
                  navegación de la app grabada, y encima del cuadro tapaban contenido. Van fuera
                  del teléfono, con 44px de área táctil. */}
              {yaArranco && (
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={alternarPausa}
                    aria-label={pausado ? 'Reanudar la demostración' : 'Pausar la demostración'}
                    className="flex size-11 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)] text-[var(--accent-ink,var(--accent))] transition-transform active:scale-95 [touch-action:manipulation]"
                  >
                    {pausado ? <Play size={16} fill="currentColor" aria-hidden="true" /> : <Pause size={16} fill="currentColor" aria-hidden="true" />}
                  </button>
                  <button
                    type="button"
                    onClick={alTerminar}
                    aria-label="Volver a empezar la demostración"
                    className="flex size-11 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)] text-[var(--accent-ink,var(--accent))] transition-transform active:scale-95 [touch-action:manipulation]"
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </motion.div>

            <ol className="order-1 flex flex-col gap-6 lg:order-1">
              {pasos.map((p, i) => (
                <motion.li key={i} variants={item} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 flex-col items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)] text-[17px] font-bold tabular-nums text-[var(--accent-ink,var(--accent))] lg:text-[19px]"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="pt-1">
                    <h3 className="flex flex-wrap items-baseline gap-x-2 text-[16px] font-semibold text-[var(--text-primary)] lg:text-[18px]">
                      {p.titulo}
                      {p.marca && (
                        <button
                          type="button"
                          onClick={() => irA(p.marca as string)}
                          aria-label={`Ver este paso en el video, en el segundo ${p.marca}`}
                          className="-my-3 inline-flex min-h-11 items-center rounded-[var(--radius-button)] px-2 text-[12px] font-bold tabular-nums text-[var(--accent-ink,var(--accent))] underline decoration-[color-mix(in_oklab,var(--accent)_45%,transparent)] underline-offset-2 transition-colors hover:bg-[var(--chip-bg)] lg:text-[13px]"
                        >
                          {p.marca}
                        </button>
                      )}
                    </h3>
                    <p className="mt-1 text-[15px] leading-snug text-[var(--text-secondary)] lg:text-[17px]">{p.detalle}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        ) : (
          <>
            {foto && (
              <motion.div variants={item} className="relative mx-auto mt-10 h-[220px] w-full max-w-[520px] sm:h-[260px]">
                <Blob variante="b" className="-left-6 -top-4 h-full w-[70%]" opacidad={0.12} />
                <div className="absolute inset-y-0 right-0 w-[82%] overflow-hidden blob-b shadow-[var(--shadow-2)]">{foto}</div>
              </motion.div>
            )}

            <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {pasos.map((p, i) => (
                <motion.li key={i} variants={item} className="flex items-start gap-4 md:flex-col">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)] text-[17px] font-bold tabular-nums text-[var(--accent-ink,var(--accent))] lg:text-[19px]"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="pt-1 md:pt-0">
                    <h3 className="text-[16px] font-semibold text-[var(--text-primary)] lg:text-[18px]">{p.titulo}</h3>
                    <p className="mt-1 text-[15px] leading-snug text-[var(--text-secondary)] lg:text-[17px]">{p.detalle}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </>
        )}

        {demo?.pie && (
          <motion.p variants={item} className="mt-8 flex items-center justify-center gap-2 text-[13px] text-[var(--text-tertiary)] lg:text-[14px]">
            <ShieldCheck size={15} className="shrink-0 text-[var(--accent-ink,var(--accent))]" aria-hidden="true" />
            {demo.pie}
          </motion.p>
        )}

        {ctaLabel && ctaHref && (
          <motion.div variants={item} className="mt-8 flex justify-center">
            <CtaButton href={ctaHref} fullMobile>{ctaLabel}</CtaButton>
          </motion.div>
        )}
      </motion.div>
    </SectionShell>
  );
}
