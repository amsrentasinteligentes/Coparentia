'use client';

// AYUDA CONTEXTUAL — botón "?" chiquito que vive junto al título de una pantalla y abre una
// hoja corta explicando para qué sirve esa pantalla y su mecanismo menos obvio (2026-09-29,
// pedido del usuario: reemplaza la idea de "tutoriales" por ayuda puntual y opcional — un
// tutorial forzado es anti-patrón del SO; esto nunca interrumpe, se ignora sin costo).

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CircleHelp, X } from 'lucide-react';
import { Portal } from './Portal';

export function AyudaContextual({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  const [abierta, setAbierta] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierta(true)}
        aria-label={`Ayuda: ${titulo}`}
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--text-tertiary)] [touch-action:manipulation]"
      >
        <CircleHelp size={20} aria-hidden="true" />
      </button>

      <Portal>
        <AnimatePresence>
          {abierta && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-end bg-[color-mix(in_oklab,black_55%,transparent)]"
              onClick={() => setAbierta(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-h-[80dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[var(--radius-card)] bg-[var(--surface)] p-5 pb-[max(24px,env(safe-area-inset-bottom))]"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label={titulo}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[17px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">{titulo}</h2>
                  <button
                    type="button"
                    onClick={() => setAbierta(false)}
                    aria-label="Cerrar"
                    className="flex size-9 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 flex flex-col gap-2.5 text-[14px] leading-[1.55] text-[var(--text-secondary)]">{children}</div>
                <button
                  type="button"
                  onClick={() => setAbierta(false)}
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--on-accent,var(--bg))] [touch-action:manipulation]"
                >
                  Entendido
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
