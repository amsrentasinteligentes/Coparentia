'use client';

// INSTALAR LA APP (PWA, 2026-09-24) — toda la lógica de instalación vive en UN solo lugar, para que
// el aviso automático (<BannerInstalar>, en app/(app)/layout.tsx — aparece solo, en cualquier
// pantalla) y el respaldo manual (<FilaInstalar>, dentro de Ajustes) nunca puedan desincronizarse.
//
// POR QUÉ EXISTE EL BANNER: el botón vivía solo en Ajustes, y el dueño probó la app y no lo
// encontró — "Ajustes" ni siquiera aparece en el menú de abajo, hay que entrar a Perfil y bajar
// hasta una fila que dice "Cuota alimentaria y cuenta". Ningún usuario nuevo iba a llegar ahí solo.
// El aviso resuelve eso: aparece SOLO, arriba de cualquier pantalla, sin que nadie tenga que buscar
// nada — y se puede cerrar (queda guardado que ya lo vio, no vuelve a insistir).
//
// Android/Chrome dispara `beforeinstallprompt`: se captura el evento y el botón, al tocarlo, abre
// el instalador NATIVO del propio navegador — un solo toque, sin salir de la app. iPhone/Safari
// NUNCA dispara ese evento (restricción de Apple, no nuestra): ahí se detecta la plataforma y se
// abre una hoja con el paso a paso exacto de "Compartir → Agregar a inicio". Si la persona ya la
// tiene instalada (`display-mode: standalone`), nada de esto se muestra — instalarla dos veces no
// tiene sentido.

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Smartphone, X } from 'lucide-react';

type EventoInstalacion = { prompt: () => void; userChoice: Promise<{ outcome: string }> };

export function useEventoInstalacion(): { disponible: boolean; instalar: () => Promise<void> } {
  const [evento, setEvento] = useState<EventoInstalacion | null>(null);
  useEffect(() => {
    const capturar = (e: Event) => {
      e.preventDefault();
      setEvento(e as unknown as EventoInstalacion);
    };
    window.addEventListener('beforeinstallprompt', capturar);
    return () => window.removeEventListener('beforeinstallprompt', capturar);
  }, []);
  return {
    disponible: evento !== null,
    instalar: async () => {
      if (!evento) return;
      evento.prompt();
      await evento.userChoice;
      setEvento(null); // el navegador no vuelve a ofrecer el mismo evento
    },
  };
}

function leerInstalada(): boolean {
  // `standalone` es el nombre que Safari le da a este mismo modo — dos formas de preguntar lo mismo.
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as { standalone?: boolean }).standalone === true;
}
function suscribirseAInstalada(avisar: () => void): () => void {
  const mq = window.matchMedia('(display-mode: standalone)');
  mq.addEventListener('change', avisar);
  return () => mq.removeEventListener('change', avisar);
}
/** `useSyncExternalStore`, no `useState`+`useEffect`: es la forma correcta de leer un valor que
 *  solo existe en el navegador sin desincronizar el HTML del servidor con el del cliente. */
export function useInstalada(): boolean {
  return useSyncExternalStore(suscribirseAInstalada, leerInstalada, () => false);
}

/** El navegador no cambia de plataforma a mitad de sesión: sin suscripción real, solo el snapshot. */
export function useEsIOS(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => /iphone|ipad|ipod/i.test(window.navigator.userAgent),
    () => false
  );
}

/** Hoja de los 3 pasos para iPhone (única plataforma sin instalación de un toque). Va por PORTAL a
 *  #app-shell (nunca a `document.body` a secas, y nunca sin portal): `app/(app)/template.tsx` anima
 *  cada pantalla con un `motion.div`, y un ancestro con `transform` activo convierte cualquier
 *  `position: fixed` descendiente en algo fijo respecto a ESE ancestro, no al viewport real (regla
 *  de CSS). Portar directo a `document.body` tampoco sirve: se sale de la clase `tema-app-claro` y
 *  pierde los colores del interior (cae al tema oscuro por defecto de la landing) — #app-shell es
 *  el nodo que sí tiene esa clase (ver el id en app/(app)/layout.tsx). */
export function HojaPasosInstalarIOS({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  const reduceMovimiento = useReducedMotion() ?? false;
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {abierta && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMovimiento ? 0.12 : 0.2 }}
          className="fixed inset-0 z-30 flex items-end bg-[color-mix(in_oklab,black_55%,transparent)]"
          onClick={onCerrar}
        >
          <motion.div
            initial={reduceMovimiento ? { opacity: 0 } : { y: '100%' }}
            animate={reduceMovimiento ? { opacity: 1 } : { y: 0 }}
            exit={reduceMovimiento ? { opacity: 0 } : { y: '100%' }}
            transition={{ duration: reduceMovimiento ? 0.12 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Cómo instalar Coparentia en tu iPhone"
            className="mx-auto max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[var(--radius-card)] bg-[var(--surface)] p-5 pb-[max(24px,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky -top-5 z-10 -mx-5 -mt-5 flex items-center justify-between bg-[var(--surface)] px-5 pt-5 pb-3">
              <h2 className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Instalar en tu iPhone</h2>
              <button type="button" onClick={onCerrar} aria-label="Cerrar" className="flex size-9 items-center justify-center text-[var(--text-secondary)]">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
              Apple no deja que ninguna página lo haga con un solo toque — son 3 pasos, una sola vez.
            </p>
            <ol className="mt-5 flex flex-col gap-4">
              {[
                { texto: <>Toca el botón <b>Compartir</b> (el cuadrado con la flecha hacia arriba) en la barra de Safari.</> },
                { texto: <>Baja hasta encontrar <b>&quot;Agregar a inicio&quot;</b> y tócalo.</> },
                { texto: <>Toca <b>&quot;Agregar&quot;</b> arriba a la derecha. Listo: el ícono ya está en tu pantalla.</> },
              ].map((paso, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[13px] font-bold text-[var(--accent-ink,var(--accent))]">
                    {i + 1}
                  </span>
                  <span className="pt-1.5 text-[14px] leading-[1.5] text-[var(--text-primary)]">{paso.texto}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('app-shell') ?? document.body
  );
}

const CLAVE_DESCARTADO = 'coparentia_instalar_descartado';

function leerDescartadoAntes(): boolean {
  try {
    return localStorage.getItem(CLAVE_DESCARTADO) === '1';
  } catch {
    return false; // sin localStorage (navegación privada, etc.): se muestra igual, sin recordar el cierre
  }
}
/** Si ya lo cerró en una visita ANTERIOR. `useSyncExternalStore` (nunca `useState`+`useEffect`) para
 *  no desincronizar el HTML del servidor del cliente — el servidor no tiene `localStorage`, así que
 *  responde `true` (oculto) y React corrige solo en cuanto monta, sin parpadeo ni aviso de error. */
function useDescartadoAntes(): boolean {
  return useSyncExternalStore(
    () => () => {}, // no hay evento nativo para "esta misma pestaña escribió localStorage": el cierre EN esta visita se controla aparte, con estado normal
    leerDescartadoAntes,
    () => true
  );
}

/** El aviso automático — vive en app/(app)/layout.tsx, así que aparece en TODAS las pantallas de la
 *  app hasta que la persona la instale o lo cierre. Cerrarlo es DEFINITIVO para este navegador (una
 *  sola insistencia, nunca un recordatorio que vuelve): quien lo cerró siempre puede instalarla
 *  después desde Perfil → Ajustes y cuenta → Cuota alimentaria y cuenta. */
export function BannerInstalar() {
  const { disponible, instalar } = useEventoInstalacion();
  const instalada = useInstalada();
  const ios = useEsIOS();
  const [mostrarPasos, setMostrarPasos] = useState(false);
  const descartadoAntes = useDescartadoAntes();
  // El cierre DE ESTA visita es estado normal (no hay evento nativo de "esta pestaña escribió
  // localStorage" al que suscribirse) — arranca en `false` en servidor y cliente por igual, cero
  // riesgo de desincronizar el HTML entre los dos.
  const [cerradoAhora, setCerradoAhora] = useState(false);

  const cerrar = (): void => {
    setCerradoAhora(true);
    try {
      localStorage.setItem(CLAVE_DESCARTADO, '1');
    } catch {}
  };

  const visible = !instalada && (ios || disponible) && !descartadoAntes && !cerradoAhora;

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            role="status"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden border-b border-[color-mix(in_oklab,var(--accent)_18%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))]"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]">
                <Smartphone size={17} color="var(--accent-ink,var(--accent))" aria-hidden="true" />
              </span>
              <p className="min-w-0 flex-1 text-[13px] leading-[1.4] text-[var(--text-primary)]">
                <span className="font-bold">Instálala en tu teléfono</span> — sin pasar por el navegador
              </p>
              <button
                type="button"
                onClick={ios ? () => setMostrarPasos(true) : instalar}
                className="shrink-0 rounded-[var(--radius-button)] bg-[var(--accent)] px-3.5 py-2 text-[13px] font-semibold text-[var(--on-accent)] transition-transform duration-100 active:scale-95 [touch-action:manipulation]"
              >
                Instalar
              </button>
              <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar este aviso"
                className="flex size-8 shrink-0 items-center justify-center text-[var(--text-tertiary)] [touch-action:manipulation]"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HojaPasosInstalarIOS abierta={mostrarPasos} onCerrar={() => setMostrarPasos(false)} />
    </>
  );
}
