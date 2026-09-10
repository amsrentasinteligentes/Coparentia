'use client';

// TRANSICIÓN ENTRE SECCIONES de la app interna (Inicio · Pagos · Calendario · Expediente).
//
// POR QUÉ EXISTE ESTE ARCHIVO: al tocar el nav de abajo, una pantalla reemplazaba a la otra de
// golpe, sin transición — el corte seco es lo que más hace sentir "esto son cuatro páginas
// sueltas" en vez de una sola app. El funnel sí tenía transiciones; la app interna, donde la
// persona vive todos los días, no.
//
// `template.tsx` (no `layout.tsx`) porque Next vuelve a montarlo en CADA navegación: eso es
// justamente lo que hace que la animación de entrada se dispare cada vez. Un layout se mantiene
// montado y la animación solo correría la primera vez.
//
// El movimiento es corto y contenido a propósito (6px, 280ms): en una pantalla que se abre veinte
// veces al día, una animación vistosa se vuelve un peaje. Debe leerse como continuidad, no como
// espectáculo — coherente con "Sereno" de FICHA-ARTE.

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export default function TemplateApp({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
