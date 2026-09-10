'use client';

// EL MOMENTO DEL SELLO DE CONFIANZA.
//
// "El Sello de Confianza" es el mecanismo BAUTIZADO del producto — lo que se promete en la página
// de ventas y en el paywall. Hasta ahora, al subir un comprobante solo aparecía una fila más en una
// lista: el momento más importante de la app no tenía momento, y lo que se vende no se veía por
// ningún lado dentro de la app.
//
// Cómo se resolvió, según la personalidad "Sereno · Sobrio · Cálido" de FICHA-ARTE (celebración
// N3: "sello de fecha/firma, SIN fanfarria" — nada de confeti):
//   · el sello aparece a escala 0.8 y se asienta, como algo que se estampa;
//   · un anillo de luz se expande UNA vez desde el centro y se desvanece;
//   · muestra la FECHA REAL con la que quedó registrado el comprobante — el sello no es un adorno,
//     es literalmente lo que el producto promete: dejar constancia fechada;
//   · dura ~1.6s y se va solo. No pide un toque para cerrarse: felicitar y estorbar es peor que
//     no felicitar (regla del SO: la animación nunca bloquea la siguiente acción).

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

const DURACION_VISIBLE_MS = 1600;

export function SelloConfianza({ fecha, onTerminar }: { fecha: string; onTerminar: () => void }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(onTerminar, reduce ? 700 : DURACION_VISIBLE_MS);
    return () => clearTimeout(t);
  }, [onTerminar, reduce]);

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] backdrop-blur-[2px]"
    >
      <div className="relative flex size-24 items-center justify-center">
        {/* Anillo de luz que se expande una sola vez: es el "pulso" del sello al asentarse. */}
        {!reduce && (
          <motion.span
            aria-hidden="true"
            initial={{ scale: 0.7, opacity: 0.55 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0 rounded-full border-2 border-[var(--accent)]"
          />
        )}
        <motion.span
          initial={reduce ? false : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="flex size-24 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]"
        >
          <ShieldCheck size={44} strokeWidth={2.2} color="var(--accent)" aria-hidden="true" />
        </motion.span>
      </div>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.14, duration: 0.3 }}
        className="mt-5 text-[19px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]"
      >
        Sello de Confianza aplicado
      </motion.p>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.2, duration: 0.3 }}
        className="mt-1 text-[13.5px] text-[var(--text-secondary)]"
      >
        Queda fechado el {fecha}
      </motion.p>
    </motion.div>
  );
}
