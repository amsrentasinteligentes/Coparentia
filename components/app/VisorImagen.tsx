'use client';

// Visor de fotos EN LA APP — antes se abría la imagen cruda en una pestaña nueva del navegador
// y dependía de su visor por defecto, que no siempre ajusta la foto al tamaño de la pantalla
// (hallazgo real del usuario: la foto de un comprobante se veía cortada, sin ajustar). Este visor
// SIEMPRE encaja la imagen completa en la pantalla al abrir (object-contain), y deja el pellizco
// para acercar (pinch-to-zoom) nativo del navegador — no se bloquea ningún gesto táctil.

import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export function VisorImagen({ url, onCerrar }: { url: string | null; onCerrar: () => void }) {
  return (
    <AnimatePresence>
      {url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-[color-mix(in_oklab,black_88%,transparent)]"
          onClick={onCerrar}
        >
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="absolute right-4 top-[max(16px,env(safe-area-inset-top))] z-10 flex size-11 items-center justify-center rounded-full bg-[color-mix(in_oklab,white_15%,transparent)] text-white [touch-action:manipulation]"
          >
            <X size={22} aria-hidden="true" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- foto privada por URL firmada, sin beneficio de next/image aquí */}
          <img
            src={url}
            alt="Comprobante"
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
