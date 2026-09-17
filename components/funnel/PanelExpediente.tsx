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
  /** `compacto` es la variante de celular: mismas filas, menos aire entre ellas. */
  compacto = false,
}: {
  filas: FilaExpediente[];
  compacto?: boolean;
}) {
  const reduce = useReducedMotion();

  // Se muestran las contestadas + las que siguen, nunca las siete de golpe: una lista de 7 ítems
  // (con 5 en gris) supera el tope de 4-5 del SO, se lee como ruido y hace ver el expediente más
  // vacío de lo que está (defecto del revisor-visual). El resto se resume en una línea.
  // Piso de 4 y techo de 5: con una o dos filas la tarjeta se veía escuálida al arrancar, y con más
  // de cinco vuelve a ser una lista larga de grises.
  const MIN_VISIBLES = 4;
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
      // Hairline degradado en las DOS variantes (antes solo en computador): en celular la tarjeta
      // quedaba con borde plano y era el único bloque de la pantalla sin el kit de profundidad.
      style={{
        border: '1px solid transparent',
        background:
          'linear-gradient(var(--surface), var(--surface)) padding-box, ' +
          'linear-gradient(135deg, color-mix(in oklab, var(--accent) 45%, transparent), transparent 62%) border-box',
      }}
    >
      {/* NI contador NI barra propia. Primero se quitó el "3 de 7" porque contradecía al "Paso 3
          de 10" del encabezado; la barra que quedó reintrodujo el mismo problema en otro formato
          (dos barras de 3px en acento, con porcentajes distintos, en la misma vista — el revisor lo
          volvió a marcar). El avance ya lo cuenta el encabezado: esta tarjeta muestra CONTENIDO,
          no progreso. */}
      <p className="text-[13px] font-semibold text-[var(--text-primary)]">Tu expediente</p>

      {/* En celular, con CERO respuestas, cuatro filas vacías + "y 3 más" ocupaban el 37% de la
          vista sin un solo dato (revisor, 6ª ronda): se resume en una línea y las filas aparecen
          desde la primera respuesta. En computador el panel sí muestra el índice completo. */}
      {compacto && contestadas.length === 0 ? (
        <p className="mt-2 text-[13px] text-[var(--text-tertiary)]">
          {filas.length} preguntas · unos 2 minutos. Cada respuesta aparece aquí.
        </p>
      ) : (
      <>

      {/* `aria-live`: quien usa lector de pantalla oye que su respuesta quedó registrada en el
          expediente, que es justo el mensaje de esta tarjeta — sin él, el cambio pasaba mudo. */}
      <ul aria-live="polite" className={`mt-4 flex flex-col ${compacto ? 'gap-1.5' : 'gap-3'}`}>
        {visibles.map((fila) => {
          const lista = Boolean(fila.valor);
          return (
            <li key={fila.label} className="flex items-start gap-3">
              {/* La fila pendiente ya NO lleva círculo punteado: parecía una casilla marcable y no
                  hacía nada al tocarla (afordancia falsa, defecto del revisor). Una rayita tenue
                  dice "esto viene después" sin prometer una interacción que no existe. */}
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  lista ? 'bg-[var(--accent)]' : ''
                }`}
              >
                {!lista && <span className="h-px w-2.5 rounded-full bg-[var(--text-tertiary)]" />}
                {lista && (
                  <motion.span
                    initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.24, type: 'spring', bounce: 0.1 }}
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
      </>
      )}

      <p className="mt-4 flex items-start gap-2 border-t border-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] pt-4 text-[12px] leading-[1.5] text-[var(--text-tertiary)]">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
          Con tu primer comprobante se activa el Sello de Confianza: fecha, monto y soporte quedan
          asociados a este expediente.
        </p>
    </div>
  );
}
