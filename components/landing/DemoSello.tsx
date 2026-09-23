'use client';

// MINI-DEMO DEL SELLO DE CONFIANZA (2026-09-23) — el mecanismo funcionando, no descrito.
//
// POR QUÉ EXISTE: el revisor marcó la especificidad del copy en 2/5 porque la página CUENTA lo que
// hace el Sello pero nunca lo MUESTRA. Esto es la grabación real de la app —cuenta de demostración
// con datos inventados (nunca datos de un cliente)— haciendo el recorrido completo: registrar el
// comprobante, el Sello fechándolo y el PDF saliendo.
//
// CÓMO SE COMPORTA: se reproduce sola, muda, en bucle, y SOLO cuando entra en pantalla (así no
// gasta datos de quien nunca baja hasta aquí, que es la mitad de las visitas en celular). Con
// `prefers-reduced-motion` no se mueve: se queda en su primer cuadro, con el botón para verla.

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Play, ShieldCheck } from 'lucide-react';
import { Hairline, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy } from './MarkedCopy';

export interface DemoSelloProps {
  id?: string;
  tituloMarked: string;
  subtitulo: string;
  pasos: string[];
  /** Ruta del video sin extensión: se sirven .mp4 y .webm, más el póster .jpg */
  video: string;
}

export function DemoSello({ id, tituloMarked, subtitulo, pasos, video }: DemoSelloProps) {
  const { contenedor, item } = useReveal();
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);

  // Se reproduce al entrar en pantalla y se pausa al salir: nunca corre de fondo.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          el.play().then(() => setReproduciendo(true)).catch(() => setReproduciendo(false));
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, [reduce]);

  const reproducir = (): void => {
    ref.current?.play().then(() => setReproduciendo(true)).catch(() => {});
  };

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="El Sello de Confianza en acción">
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE} className="mx-auto max-w-[1140px]">
        <div className="lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <motion.div variants={item} className="text-center lg:text-left">
            <Kicker>El Sello, en 24 segundos</Kicker>
            <h2 className="text-balance text-[28px] font-extrabold leading-[1.12] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[36px] lg:text-[42px]">
              <MarkedCopy text={tituloMarked} />
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-secondary)] lg:text-[18px]">{subtitulo}</p>

            <ol className="mx-auto mt-6 flex max-w-[420px] flex-col gap-3 text-left lg:mx-0">
              {pasos.map((paso, i) => (
                <li key={paso} className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--chip-bg)] text-[13px] font-bold tabular-nums text-[var(--accent-ink,var(--accent))]">
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-[1.5] text-[var(--text-primary)] lg:text-[16px]">{paso}</span>
                </li>
              ))}
            </ol>

            <p className="mt-6 flex items-center justify-center gap-2 text-[13px] text-[var(--text-tertiary)] lg:justify-start lg:text-[14px]">
              <ShieldCheck size={15} className="shrink-0 text-[var(--accent-ink,var(--accent))]" aria-hidden="true" />
              Grabado de la app real, con datos de ejemplo.
            </p>
          </motion.div>

          {/* El teléfono: mismo marco que la captura del hero, para que se lea como la misma app. */}
          <motion.div variants={item} className="mt-10 flex justify-center lg:mt-0">
            <Hairline emphasis surface="surface" className="relative w-full max-w-[300px] p-2 shadow-[var(--shadow-2)] lg:max-w-[340px]">
              <video
                ref={ref}
                className="block w-full rounded-[calc(var(--radius-card)-6px)]"
                poster={`${video}-poster.jpg`}
                muted
                loop
                playsInline
                preload="none"
                controls={reduce}
                aria-label="Demostración: registrar un comprobante, el Sello de Confianza y el expediente en PDF"
              >
                <source src={`${video}.webm`} type="video/webm" />
                <source src={`${video}.mp4`} type="video/mp4" />
                Tu navegador no puede mostrar el video.
              </video>

              {/* Si el navegador bloquea la reproducción automática, el botón la dispara. */}
              {!reproduciendo && !reduce && (
                <button
                  type="button"
                  onClick={reproducir}
                  aria-label="Ver la demostración"
                  className="absolute inset-2 flex items-center justify-center rounded-[calc(var(--radius-card)-6px)] bg-[color-mix(in_oklab,var(--text-primary)_18%,transparent)] [touch-action:manipulation]"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_45%,transparent)]">
                    <Play size={22} fill="currentColor" aria-hidden="true" />
                  </span>
                </button>
              )}
            </Hairline>
          </motion.div>
        </div>
      </motion.div>
    </SectionShell>
  );
}
