'use server';

// TRM — Tasa Representativa del Mercado, el tipo de cambio USD→COP OFICIAL de Colombia que publica
// la Superintendencia Financiera cada día hábil.
//
// POR QUÉ EN VIVO Y NO UN NÚMERO FIJO: FICHA-MERCADO.md pide comunicar los precios "también en
// referencia COP", pero el cobro real de Hotmart es en USD. Dejar una tasa escrita a mano en el
// código la convierte en un número FALSO a las pocas semanas — justo el tipo de cifra que este
// avatar castiga (desconfía de las cuentas que no cuadran). Atado a la TRM oficial, el aproximado
// se corrige solo todos los días sin que nadie tenga que acordarse de actualizarlo.
//
// FUENTE: datos.gov.co, conjunto "Tasa de Cambio Representativa del Mercado histórica" (32sa-8pi3),
// el portal de datos abiertos del Estado colombiano.

const FUENTE = 'https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=1';

// 12 horas: la TRM cambia una vez al día hábil, así que consultarla más seguido no aporta nada y
// sí ataría la pantalla de precios a la disponibilidad de un servicio externo.
const HORAS_DE_CACHE = 12 * 60 * 60;

// Tope duro de espera: la pantalla de precios NUNCA debe quedarse esperando a un servicio de
// terceros (misma lección que el bloqueo real del lector de recibos). Si no responde a tiempo, se
// muestra solo el precio en dólares y ya.
const MAXIMO_MS = 4000;

// Rango de cordura: si la fuente devolviera un valor absurdo (0, negativo, o un formato que cambió),
// es preferible NO mostrar nada antes que mostrarle a alguien un precio en pesos que no es real.
const MINIMO_RAZONABLE = 1000;
const MAXIMO_RAZONABLE = 20000;

export async function obtenerTRM(): Promise<number | null> {
  try {
    const respuesta = await fetch(FUENTE, {
      signal: AbortSignal.timeout(MAXIMO_MS),
      next: { revalidate: HORAS_DE_CACHE },
    });
    if (!respuesta.ok) return null;

    const datos: unknown = await respuesta.json();
    if (!Array.isArray(datos) || datos.length === 0) return null;

    const valor = Number((datos[0] as { valor?: string })?.valor);
    if (!Number.isFinite(valor) || valor < MINIMO_RAZONABLE || valor > MAXIMO_RAZONABLE) return null;

    return valor;
  } catch {
    // Sin conexión, servicio caído, formato cambiado: se cae en silencio a "solo dólares".
    return null;
  }
}

// (El formateo a pesos NO vive aquí: en un archivo 'use server' cualquier función exportada se
//  vuelve una acción de servidor, y dar formato a un número no necesita un viaje a la red.
//  Vive en lib/formato-cop.ts, que es código normal y corre en el navegador.)
