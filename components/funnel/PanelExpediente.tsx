'use client';

// PANEL "TU EXPEDIENTE SE ESTÁ ARMANDO" (2026-09-17) — resuelve DOS problemas a la vez:
//
// 1. EL VACÍO. El revisor-visual lleva 9 rondas marcando lo mismo en el onboarding: una pantalla
//    de 2-4 opciones deja ~43% del alto en negro plano, y no había contenido HONESTO que poner ahí
//    (rellenar con decoración habría sido peor). Esto sí lo es: son las respuestas que la persona
//    YA dio, mostradas como lo que son — su expediente empezando a existir. El aire deja de ser
//    "aquí falta algo" y pasa a ser "esto es lo que llevas".
//
// 2. LA PÉRDIDA DE DATOS. Para poder mostrar el resumen hay que guardar cada respuesta en el
//    momento, no solo al final: antes, cerrar la pestaña en el paso 5 de 10 borraba TODO sin aviso
//    (bug real encontrado por el revisor-visual en la ronda de hoy).
//
// Patrón tomado de las tres apps del nicho (Niddo, OurFamilyWizard, 2houses) y de la página que
// generó Hotmart: el formulario nunca va solo — convive con una pieza que MUESTRA el producto
// funcionando. Aquí esa pieza no es un mockup decorativo: es el expediente real de quien responde.

import { motion, useReducedMotion } from 'motion/react';
import { Check, ShieldCheck } from 'lucide-react';

export interface FilaExpediente {
  /** Qué se preguntó ("Tu rol", "Tu situación"…) — SIEMPRE visible, aunque no haya respuesta. */
  label: string;
  /** La respuesta, ya en palabras humanas. Vacío = todavía no la contestó. */
  valor?: string;
}

export function PanelExpediente({
  filas,
  /** `compacto` es la variante de celular: mismas filas, menos aire y sin el pie de confianza. */
  compacto = false,
}: {
  filas: FilaExpediente[];
  compacto?: boolean;
}) {
  const reduce = useReducedMotion();
  const listas = filas.filter((f) => f.valor).length;
  const total = filas.length;
  const porcentaje = total === 0 ? 0 : Math.round((listas / total) * 100);

  return (
    <div
      className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
      style={
        compacto
          ? undefined
          : {
              // En el panel de computador la tarjeta es EL objeto de la columna: se le da el
              // borde degradado del kit (hairline de FICHA-ARTE) en vez del borde plano.
              border: '1px solid transparent',
              background:
                'linear-gradient(var(--surface), var(--surface)) padding-box, ' +
                'linear-gradient(135deg, color-mix(in oklab, var(--accent) 45%, transparent), transparent 62%) border-box',
            }
      }
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-semibold text-[var(--text-primary)]">Tu expediente</p>
        <span className="text-[12px] tabular-nums text-[var(--text-tertiary)]">
          {listas} de {total}
        </span>
      </div>

      {/* Barra de avance del propio expediente — el mismo lenguaje visual del anillo de la app
          interna, en su versión más simple: un dato real, nunca decoración. */}
      <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]">
        <motion.div
          className="h-full rounded-full bg-[var(--accent)]"
          initial={false}
          animate={{ width: `${porcentaje}%` }}
          transition={{ duration: reduce ? 0 : 0.34, ease: [0.22, 0.61, 0.36, 1] }}
        />
      </div>

      <ul className={`mt-4 flex flex-col ${compacto ? 'gap-2' : 'gap-3'}`}>
        {filas.map((fila) => {
          const lista = Boolean(fila.valor);
          return (
            <li key={fila.label} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  lista
                    ? 'bg-[var(--accent)]'
                    : 'border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)]'
                }`}
              >
                {lista && (
                  <motion.span
                    initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.24, type: 'spring', bounce: 0.1 }}
                    className="flex items-center justify-center"
                  >
                    <Check size={12} strokeWidth={3} color="var(--bg)" />
                  </motion.span>
                )}
              </span>
              {/* Una fila contestada muestra etiqueta + respuesta; una pendiente muestra SOLO su
                  etiqueta, atenuada. Repetir "Pendiente" siete veces llenaba la tarjeta de ruido
                  y hacía ver el expediente más vacío de lo que está. */}
              <div className="min-w-0 flex-1">
                <p className={lista ? 'text-[12px] text-[var(--text-tertiary)]' : 'text-[13px] text-[color-mix(in_oklab,var(--text-tertiary)_75%,transparent)]'}>
                  {fila.label}
                </p>
                {lista && (
                  <motion.p
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.34, ease: [0.22, 0.61, 0.36, 1] }}
                    className="text-[14px] font-medium leading-[1.35] text-[var(--text-primary)]"
                  >
                    {fila.valor}
                  </motion.p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {!compacto && (
        <p className="mt-4 flex items-start gap-2 border-t border-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] pt-4 text-[12px] leading-[1.5] text-[var(--text-tertiary)]">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
          Con tu primer comprobante se activa el Sello de Confianza: fecha, monto y soporte quedan
          asociados a este expediente.
        </p>
      )}
    </div>
  );
}
