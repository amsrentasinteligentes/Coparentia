// FECHAS DE HOTMART — `date_next_charge` llega como un número de época, pero no siempre en la misma
// unidad: los avisos del 2026-10-13 venían en milisegundos y la cancelación por reembolso del
// 2026-10-29 llegó en SEGUNDOS. Leída como milisegundos, una fecha en segundos cae el 21 de enero
// de 1970: el correo de cancelación decía "acceso hasta el 21 de enero de 1970" y el candado de la
// app daba por vencido un acceso que podía estar pagado. Un número menor a 1e11 es una fecha en
// segundos (1e11 segundos = año 5138; 1e11 milisegundos = marzo de 1973).

const LIMITE_SEGUNDOS = 1e11;

/** Convierte el valor de Hotmart a fecha, acepte segundos o milisegundos; `null` si no es una fecha válida. */
export function fechaDeHotmart(valor: unknown): Date | null {
  const numero = Number(valor);
  if (!Number.isFinite(numero) || numero <= 0) return null;
  const fecha = new Date(numero < LIMITE_SEGUNDOS ? numero * 1000 : numero);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}
