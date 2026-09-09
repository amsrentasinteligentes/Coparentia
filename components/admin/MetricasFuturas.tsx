'use client';

// Agrupa TODAS las métricas que todavía no tienen ningún dato real en UNA sola card plegable —
// encontrado por el revisor-visual (ronda final): 5-6 cards completas sin ningún número real
// pesaban tanto como las reales y alargaban el scroll sin dar valor accionable hoy. Colapsada por
// defecto: el dueño ve que existen (pedido explícito: "pensando a futuro, para visualizar mejor
// el seguimiento"), pero no compiten por atención con los datos que sí importan ahora mismo.

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export interface MetricaFutura {
  titulo: string;
  icon: ReactNode;
  contenido: ReactNode; // el grid de DatoPendiente + <NotaActivacion> de esa métrica
}

export function MetricasFuturas({ metricas }: { metricas: MetricaFutura[] }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-2)]">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        className="flex min-h-11 w-full items-center justify-between gap-3 p-5 text-left [touch-action:manipulation]"
      >
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Métricas futuras</h2>
          <p className="mt-0.5 text-[12px] text-[var(--text-tertiary)]">
            {metricas.length} sin datos todavía — se activan solas cuando conectes cada pieza
          </p>
        </div>
        <motion.span animate={{ rotate: abierto ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-[var(--text-tertiary)]">
          <ChevronDown size={20} aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col divide-y divide-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] px-5 pb-5">
              {metricas.map((m) => (
                <div key={m.titulo} className="pt-4 first:pt-0">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]">
                      {m.icon}
                    </span>
                    <h3 className="text-[13.5px] font-semibold text-[var(--text-primary)]">{m.titulo}</h3>
                  </div>
                  <div className="mt-3">{m.contenido}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
