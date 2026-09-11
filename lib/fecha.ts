// LA FECHA DE HOY, EN COLOMBIA — fuente única para todo el proyecto.
//
// POR QUÉ EXISTE (bug real, encontrado en la auditoría del 2026-09-11):
// `new Date().toISOString().slice(0, 10)` devuelve la fecha en UTC, que va 5 horas ADELANTE de
// Colombia. Desde las 7:00 p. m. hora local, esa expresión ya devuelve el día SIGUIENTE. Estaba
// usada en 11 lugares, incluidos los dos peores posibles:
//   · la fecha con la que se guarda un comprobante de pago, y
//   · el mes contra el que se decide si "ya registraste la cuota de este mes".
// Un pago hecho el 5 a las 7 p. m. quedaba registrado el 6: en una app cuyo producto ES la prueba
// fechada de que se pagó a tiempo, eso fabrica justo la acusación que la app existe para desmentir.
//
// POR QUÉ COLOMBIA Y NO LA HORA DEL TELÉFONO: la obligación alimentaria se juzga con el calendario
// colombiano. Quien paga desde el exterior (caso frecuente en este avatar) necesita que su
// expediente hable en fechas de Colombia, no en las de su zona horaria. Anclarlo a `America/Bogota`
// hace que el expediente diga lo mismo sin importar desde dónde se abra la app.
//
// `formatToParts` en vez de una plantilla de idioma: el orden de día/mes/año depende del locale y
// no se puede asumir; pidiendo las partes por nombre, el resultado es el mismo en cualquier
// navegador y en el servidor.

const ZONA = 'America/Bogota';

const FORMATO = new Intl.DateTimeFormat('en-US', {
  timeZone: ZONA,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Fecha de un instante dado, en Colombia, como "AAAA-MM-DD". Por defecto, ahora mismo. */
export function fechaEnColombia(momento: Date = new Date()): string {
  const partes = FORMATO.formatToParts(momento);
  const parte = (tipo: 'year' | 'month' | 'day'): string =>
    partes.find((p) => p.type === tipo)?.value ?? '01';
  return `${parte('year')}-${parte('month')}-${parte('day')}`;
}

/** El día de HOY en Colombia, como "AAAA-MM-DD". Reemplaza a `toISOString().slice(0, 10)`. */
export function hoyEnColombia(): string {
  return fechaEnColombia();
}

/** El mes en curso en Colombia, como "AAAA-MM". Reemplaza a `toISOString().slice(0, 7)`. */
export function mesEnColombia(): string {
  return fechaEnColombia().slice(0, 7);
}

/** El número de día del mes en Colombia (1-31). Reemplaza a `new Date().getDate()`. */
export function diaDelMesEnColombia(): number {
  return Number(hoyEnColombia().slice(8, 10));
}

/** El año en curso en Colombia. */
export function anioEnColombia(): number {
  return Number(hoyEnColombia().slice(0, 4));
}

// Colombia no aplica horario de verano: siempre UTC-5. Así que la medianoche colombiana de un día
// es, en el reloj universal con el que la base guarda `created_at`, ese mismo día a las 05:00Z.
// Sin esto, un "desde las 00:00 de hoy" escrito como `...T00:00:00Z` en realidad empieza a contar
// a las 7 de la noche del día ANTERIOR en Colombia.
const DESFASE_COLOMBIA = '05:00:00.000Z';

/** Instante UTC en que empezó (o empieza) el día colombiano indicado — para filtrar por `created_at`. */
export function inicioDelDiaColombiaUTC(fecha: string = hoyEnColombia()): string {
  return `${fecha}T${DESFASE_COLOMBIA}`;
}

/** Instante UTC en que empezó el mes colombiano en curso — para filtrar por `created_at`. */
export function inicioDelMesColombiaUTC(): string {
  return inicioDelDiaColombiaUTC(`${mesEnColombia()}-01`);
}
