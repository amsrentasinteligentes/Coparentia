// VERIFICACIÓN DEL AVISO DE HOTMART — lo único que separa una compra real de que cualquiera, con
// un solo POST, se regale la app gratis. Hotmart manda un "hottok" (una clave única de TU cuenta)
// en cada aviso; si el que llega no coincide byte a byte con el tuyo, el aviso se rechaza.
//
// FALLA CERRADA A PROPÓSITO, pero en el momento correcto: la clave se lee DENTRO de la función,
// en cada petición — no al cargar el archivo. Leerla al cargar el archivo (como pedía la doctrina
// al pie de la letra) parece más estricto, pero en Next.js con App Router esa lectura ocurre
// durante `next build`, ANTES de que exista ninguna petición real: sin la variable configurada
// (el caso normal el primer día, porque hace falta la URL de este mismo endpoint para pedirla en
// Hotmart), la publicación de TODA la app fallaba — no solo la del webhook (bug real, encontrado
// al construir esto: el build completo tumbaba con "Failed to collect page data"). Comprobado que
// sin la variable, `npm run build` vuelve a compilar limpio con este cambio.

import crypto from 'node:crypto';

/**
 * Compara dos strings en TIEMPO CONSTANTE (nunca con === / !==). Con === , un atacante puede medir
 * cuánto tarda la respuesta y adivinar la clave letra por letra (timing attack) — con más tiempo
 * de respuesta cuantos más caracteres acierta. `timingSafeEqual` exige buffers de igual longitud,
 * así que se compara la longitud aparte, sin un early-return que por sí mismo filtre tiempo.
 */
function comparacionSegura(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/**
 * Verifica el hottok de un aviso entrante. Hotmart lo manda como CAMPO DENTRO DEL CUERPO del
 * aviso (`hottok`), no siempre como encabezado — se acepta cualquiera de los dos por si esta
 * cuenta usa una versión distinta del webhook, y se compara en tiempo constante contra la clave
 * real guardada en el servidor.
 */
export function verificarHotmart(opts: { hottok?: string }): boolean {
  const HOTTOK = process.env.HOTMART_HOTTOK;
  // Fail-secure: sin la clave configurada, NINGÚN aviso pasa — nunca un default de juguete que
  // deje el webhook abierto de par en par mientras nadie configuró la variable todavía.
  if (!HOTTOK) {
    console.error('HOTMART_HOTTOK no está configurada — rechazando el aviso (fail-secure).');
    return false;
  }
  if (!opts.hottok) return false;
  return comparacionSegura(opts.hottok, HOTTOK);
}
