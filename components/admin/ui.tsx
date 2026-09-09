'use client';

// KIT VISUAL DEL PANEL DE ADMINISTRACIÓN — misma identidad de FICHA-ARTE.md (azul de confianza,
// Spectral+IBM Plex Sans) que el resto de la app, pero en formato dashboard (17-VISUALIZACION-
// DATOS.md: card-based, un dato héroe por card, insight interpretado, nunca solo el número crudo).

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export function ContenedorAdmin({ children }: { children: ReactNode }) {
  // overflow-x-hidden a nivel raíz: sin esto, la tabla con scroll propio ("Todas las cuentas")
  // empujaba el ANCHO DE TODA LA PÁGINA en vez de quedarse contenida en su propio scroll interno
  // — bug real, encontrado midiendo `document.body.scrollWidth` (546px sobre un viewport de
  // 375px) tras la ronda 5. Causa raíz: un `<table>` sin `table-layout: fixed` propaga su ancho
  // de contenido preferido a los ancestros de bloque aunque esté envuelto en `overflow-x-auto`.
  return (
    <div className="mx-auto max-w-[1100px] overflow-x-hidden px-4 pb-16 pt-[max(24px,env(safe-area-inset-top))] sm:px-8">
      {children}
    </div>
  );
}

// Cada sección del panel es una card propia — permite que cada dato "respire" aunque haya
// muchos (regla de dashboard de 17). className opcional para las cards que ocupan más ancho.
// `indice` da la entrada escalonada (stagger, regla de movimiento del SO) — orden visual, no de DOM.
export function TarjetaSeccion({
  titulo,
  subtitulo,
  icon,
  className = '',
  indice = 0,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  // ReactNode, no un componente — un componente-función pasado como prop desde un Server
  // Component no se puede serializar hacia este Client Component (bug real encontrado en la
  // primera captura: "Only plain objects can be passed..."). El llamador ya renderiza el ícono.
  icon: ReactNode;
  className?: string;
  indice?: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : Math.min(indice, 8) * 0.06 }}
      className={`rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_24%,transparent)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)] ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">{titulo}</h2>
          {subtitulo && <p className="line-clamp-2 text-[12px] leading-[1.4] text-[var(--text-tertiary)]">{subtitulo}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

// Cuenta de 0 al valor final al montar (regla de movimiento del SO: un número héroe nunca
// aparece estático) — solo si `valor` es numérico; si no, se muestra tal cual sin animar.
function useConteo(valorFinal: number, activo: boolean): number {
  const [contado, setContado] = useState(activo ? 0 : valorFinal);
  useEffect(() => {
    if (!activo) {
      setContado(valorFinal);
      return;
    }
    let inicio: number | null = null;
    let raf: number;
    const DURACION_MS = 600;
    const paso = (t: number) => {
      if (inicio === null) inicio = t;
      const progreso = Math.min((t - inicio) / DURACION_MS, 1);
      setContado(Math.round(progreso * valorFinal));
      if (progreso < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [valorFinal, activo]);
  return contado;
}

// El dato protagonista de una card (display grande + label debajo) — regla de 17: "el número
// grande que importa va en display, el resto es metadata".
export function DatoHeroe({ valor, label, tono }: { valor: string; label: string; tono?: 'success' | 'warning' | 'error' }) {
  const reduce = useReducedMotion();
  const numero = Number(valor);
  const esNumero = valor.trim() !== '' && !Number.isNaN(numero);
  const contado = useConteo(esNumero ? numero : 0, esNumero && !reduce);
  const color = tono ? `var(--status-${tono})` : 'var(--text-primary)';
  return (
    <div>
      <p className="text-[28px] font-bold leading-none tabular-nums [font-family:var(--font-display)]" style={{ color }}>
        {esNumero ? contado : valor}
      </p>
      <p className="mt-1.5 text-[13px] text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}

// Estado honesto para lo que la app todavía no puede medir — NUNCA se inventa un número.
// Explica qué falta y qué lo activa, en el mismo formato de aviso del SO (qué pasa → qué hacer).
export function SinDatos({ motivo, activaCon }: { motivo: string; activaCon: string }) {
  return (
    <div className="rounded-[var(--radius-button)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] px-3.5 py-3">
      <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Sin datos todavía</p>
      <p className="mt-1 text-[12.5px] leading-[1.5] text-[var(--text-tertiary)]">{motivo}</p>
      <p className="mt-1.5 text-[12px] font-medium text-[var(--accent)]">Se activa cuando: {activaCon}</p>
    </div>
  );
}

// Varias secciones "todavía sin conectar" en UNA sola card compacta, en vez de 4 cards
// completas repitiendo el mismo bloque — encontrado por el revisor-visual (ronda 2): alargaba
// el scroll sin aportar información nueva. Ganancia real queda aparte porque el dueño la pidió
// como el dato que más le importa (no se diluye en la lista).
export function ListaSinConectar({ filas }: { filas: { titulo: string; icon: ReactNode; nota: string }[] }) {
  return (
    <div className="flex flex-col divide-y divide-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)]">
      {filas.map((f) => (
        <div key={f.titulo} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]">
            {f.icon}
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">{f.titulo}</p>
            <p className="mt-0.5 text-[12.5px] leading-[1.45] text-[var(--text-tertiary)]">{f.nota}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
