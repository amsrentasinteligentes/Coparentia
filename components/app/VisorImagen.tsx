'use client';

// Visor de fotos EN LA APP — antes se abría la imagen cruda en una pestaña nueva del navegador
// y dependía de su visor por defecto, que no siempre ajusta la foto al tamaño de la pantalla
// (hallazgo real del usuario: la foto de un comprobante se veía cortada, sin ajustar). Este visor
// SIEMPRE encaja la imagen completa en la pantalla al abrir (object-contain), y deja el pellizco
// para acercar (pinch-to-zoom) nativo del navegador — no se bloquea ningún gesto táctil.
//
// ESTADOS DE CARGA Y FALLO (hallazgo real del usuario, 2026-09-11: "tomé la foto, lee el monto,
// pero al quedar registrado no puedo ver la foto"). La causa NO era el archivo: se comprobó que el
// comprobante era un JPEG válido y que su enlace respondía bien. El problema era que las fotos de
// cámara pesan 4-5 MB y este visor abría un rectángulo NEGRO sin nada mientras la imagen viajaba:
// sin hilandera, sin texto, sin error. En un celular con datos móviles eso son varios segundos
// mirando el vacío, que cualquiera lee como "está roto" — y si de verdad fallaba, se veía igual.
// Ahora dice que está cargando, avisa si falla y ofrece una salida para abrir el archivo aparte.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ImageOff, ExternalLink } from 'lucide-react';

export function VisorImagen({ url, onCerrar }: { url: string | null; onCerrar: () => void }) {
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState(false);

  // Cada foto que se abre arranca su propio ciclo: sin esto, la segunda foto heredaría el estado
  // "ya cargada" de la primera y no mostraría su propia espera.
  useEffect(() => {
    if (url) {
      setCargando(true);
      setFallo(false);
    }
  }, [url]);

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

          {cargando && !fallo && (
            <div
              role="status"
              aria-live="polite"
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center"
            >
              <span className="size-9 animate-spin rounded-full border-2 border-white/25 border-t-white" aria-hidden="true" />
              <p className="text-[14px] font-medium text-white">Cargando tu comprobante…</p>
              <p className="max-w-[30ch] text-[12.5px] leading-[1.5] text-white/60">
                Las fotos de cámara pesan varios MB. Si tu señal está lenta, puede tardar un momento.
              </p>
            </div>
          )}

          {fallo && (
            <div
              role="alert"
              onClick={(e) => e.stopPropagation()}
              className="mx-8 flex max-w-[34ch] flex-col items-center gap-3 text-center"
            >
              <ImageOff size={32} className="text-white/70" aria-hidden="true" />
              <p className="text-[15px] font-medium text-white">No pudimos mostrar la foto aquí</p>
              <p className="text-[13px] leading-[1.5] text-white/70">
                Tu comprobante sigue guardado y a salvo — es la conexión la que no alcanzó a traerlo.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex h-11 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-white/30 px-5 text-[13.5px] font-semibold text-white [touch-action:manipulation]"
              >
                Abrirla aparte
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element -- foto privada por URL firmada, sin beneficio de next/image aquí */}
          <img
            src={url}
            alt="Comprobante"
            onLoad={() => setCargando(false)}
            onError={() => {
              setCargando(false);
              setFallo(true);
            }}
            className={`max-h-full max-w-full object-contain transition-opacity duration-200 ${
              cargando || fallo ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
