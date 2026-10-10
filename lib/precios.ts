// ÚNICA fuente de los precios, la prueba gratis y el día del primer cobro (auditoría externa
// 2026-10-02, hallazgo 4). La página principal, el paywall, los términos y los reembolsos leen de
// AQUÍ: antes cada pantalla tenía su propia copia y dijeron cosas distintas ("día 7" en el
// paywall, "día 8" en la página principal). Si cambian en Hotmart (Productos → Coparentia →
// Fijación de precios), se cambian aquí y en ningún otro sitio.
//
// Los montos son los que cobra Hotmart, en dólares. El monto en pesos NO se calcula ni se muestra
// en la app: lo convierte Hotmart con su propio tipo de cambio, que cambia de un día a otro, y
// cualquier cifra copiada acá quedaría distinta del checkout justo antes de ingresar la tarjeta.

/** Días de prueba gratis configurados en AMBOS planes de Hotmart (verificado 2026-10-10). */
export const TRIAL_DIAS = 7;

/** Regla de Hotmart: con una prueba de N días, si la persona empieza el día 1 el primer cobro se
 *  hace el día N + 1 (su propio ejemplo: prueba de 7 días → primer cobro el día 8). */
export const DIA_PRIMER_COBRO = TRIAL_DIAS + 1;

/** Nombre con el que el vendedor aparece en el checkout de Hotmart. */
export const NOMBRE_VENDEDOR_HOTMART = 'amsrentasinteligentes';

export const FRASE_MONTO_HOTMART = 'El monto final en tu moneda lo calcula Hotmart al pagar.';

export const PRECIOS = {
  anual: {
    /** Lo que se cobra una vez al año. */
    cobroUsd: 89,
    /** Equivalente mensual, para comparar con el plan mensual. */
    mesUsd: 7.42,
    /** Equivalente diario ($89 / 365). */
    diaUsd: 0.24,
  },
  mensual: {
    cobroUsd: 9.99,
    /** Equivalente diario ($9.99 / 30). */
    diaUsd: 0.33,
  },
  /** Doce meses pagando mes a mes: 12 × 9.99. */
  mensualPorAnoUsd: 119.88,
  /** Lo que ahorra el plan anual frente a pagar mes a mes: 119.88 − 89. */
  ahorroAnualUsd: 30.88,
} as const;

/** 89 → "US$89"; 7.42 → "US$7.42"; 9.99 → "US$9.99". */
export function usd(valor: number): string {
  return `US$${Number.isInteger(valor) ? valor : valor.toFixed(2)}`;
}
