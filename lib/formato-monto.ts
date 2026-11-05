// FORMATO DEL MONTO EN EL FORMULARIO DE PAGOS (2026-11-05, pedido del dueño): el campo muestra "$ 2.913.025"
// (signo de pesos y punto de miles), pero lo que se guarda y se valida es SOLO el número ("2913025").
// El estado del formulario guarda siempre los dígitos; estas funciones traducen entre lo que la persona
// escribe o pega y lo que ve.

const MAX_DIGITOS = 12; // hasta $ 999.999.999.999: muy por encima de cualquier cuota real, y seguro como número

/**
 * Lo que hay en el campo mientras la persona ESCRIBE o BORRA → solo los dígitos. Aquí NO se interpretan
 * centavos: al borrar un dígito de "$ 2.913.025" el campo queda "$ 2.913.02" y eso es 291.302, no centavos.
 */
export function digitosDelMonto(texto: string): string {
  return texto.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, MAX_DIGITOS);
}

/**
 * Lo que la persona PEGA → solo los dígitos. Acepta "$ 2.913.025", "2913025" o "2.913.025,00". Un final de
 * uno o dos dígitos después de coma o punto ("…,00", "…,5", "…25.50") son centavos y se descartan: si no,
 * pegar "5.000.000,00" guardaría 500.000.000 (cien veces más).
 */
export function digitosDelMontoPegado(texto: string): string {
  return digitosDelMonto(texto.replace(/[.,]\d{1,2}\s*$/, ''));
}

/** Dígitos → texto del campo: "2913025" → "$ 2.913.025". Vacío si no hay dígitos. */
export function montoParaCampo(digitos: string): string {
  if (!digitos) return '';
  return `$ ${digitos.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}
