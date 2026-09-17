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

  // Se muestran las contestadas + las que siguen, nunca las siete de golpe: una lista de 7 ítems
  // (con 5 en gris) supera el tope de 4-5 del SO, se lee como ruido y hace ver el expediente más
  // vacío de lo que está (defecto del revisor-visual). El resto se resume en una línea.
  // Piso de 3 y techo de 5: con una sola fila la tarjeta se veía escuálida al arrancar, y con más
  // de cinco vuelve a ser una lista larga de grises.
  const MIN_VISIBLES = 3;
  const MAX_VISIBLES = 5;
  const contestadas = filas.filter((f) => f.valor);
  const pendientes = filas.filter((f) => !f.valor);
  const cuantasPendientes = Math.max(
    contestadas.length >= filas.length ? 0 : 1,
    MIN_VISIBLES - contestadas.length
  );
  const visibles = [...contestadas, ...pendientes.slice(0, cuantasPendientes)].slice(0, MAX_VISIBLES);
  const ocultas = filas.length - visibles.length;

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
      {/* Sin contador propio: la pantalla ya tiene el suyo arriba ("Paso 3 de 10") y dos cifras
          distintas en la misma vista se contradicen a la vista (defecto del revisor-visual). El
          avance de esta tarjeta lo cuenta la barra, que es la misma señal sin número que compita. */}
      <p className="text-[13px] font-semibold text-[var(--text-primary)]">Tu expediente</p>

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

      {/* `aria-live`: quien usa lector de pantalla oye que su respuesta quedó registrada en el
          expediente, que es justo el mensaje de esta tarjeta — sin él, el cambio pasaba mudo. */}
      <ul aria-live="polite" className={`mt-4 flex flex-col ${compacto ? 'gap-2' : 'gap-3'}`}>
        {visibles.map((fila) => {
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
              {/* La fila pendiente usa --text-tertiary PLENO (5.1:1 sobre --surface): con el
                  `color-mix` al 75% caía a 3.46:1 y no pasaba AA — el revisor lo midió. */}
              <div className="min-w-0 flex-1">
                <p className={lista ? 'text-[12px] text-[var(--text-tertiary)]' : 'text-[13px] text-[var(--text-tertiary)]'}>
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

      {ocultas > 0 && (
        <p className="mt-3 text-[12px] text-[var(--text-tertiary)]">
          y {ocultas} {ocultas === 1 ? 'pregunta más' : 'preguntas más'}
        </p>
      )}

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
