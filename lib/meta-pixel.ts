// PIXEL DE META — medición del embudo de venta (auditoría externa 2026-10-02, hallazgo 1).
//
// REGLAS (no negociables, del prompt de la auditoría):
//  · Solo se carga si la persona pulsó "Aceptar" en el aviso de cookies; "Rechazar" o no elegir =
//    no se descarga ni una línea de Meta.
//  · El número del Pixel vive SOLO en NEXT_PUBLIC_META_PIXEL_ID. Sin esa variable todo este módulo
//    es inerte: sin medición, sin aviso y sin errores.
//  · Nunca se envía un dato personal ni de menores: ni correo, ni nombre, ni montos, ni el texto de
//    las respuestas. Solo nombres de evento y parámetros genéricos (botón, número de pregunta, plan).
//  · No se mide nada dentro de la app interna, salvo el evento único de inicio de prueba.

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

const CLAVE_ELECCION = 'coparentia_cookies_meta_v1';
export const EVENTO_CAMBIO = 'coparentia:cookies';
// Dos disparos idénticos dentro de esta ventana cuentan como un solo gesto (doble toque, doble
// montaje de React en desarrollo): "cada evento una sola vez por acción".
const VENTANA_DUPLICADO_MS = 1500;

export type EleccionCookies = 'aceptado' | 'rechazado' | null;

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push: unknown;
  allowDuplicatePageViews?: boolean;
  disablePushState?: boolean;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const ultimosEnvios = new Map<string, number>();

export function leerEleccion(): EleccionCookies {
  try {
    const v = localStorage.getItem(CLAVE_ELECCION);
    return v === 'aceptado' || v === 'rechazado' ? v : null;
  } catch {
    return null;
  }
}

// Meta guarda dos cookies propias (_fbp, _fbc). Si la persona cambia de "Aceptar" a "Rechazar",
// se borran para no dejar rastro de la elección anterior.
function borrarCookiesMeta(): void {
  const partes = window.location.hostname.split('.');
  const dominios = ['', window.location.hostname, partes.length > 2 ? `.${partes.slice(-2).join('.')}` : `.${window.location.hostname}`];
  for (const nombre of ['_fbp', '_fbc']) {
    for (const dominio of dominios) {
      document.cookie = `${nombre}=; Max-Age=0; path=/${dominio ? `; domain=${dominio}` : ''}`;
    }
  }
}

export function guardarEleccion(eleccion: EleccionCookies): void {
  try {
    if (eleccion) localStorage.setItem(CLAVE_ELECCION, eleccion);
    else localStorage.removeItem(CLAVE_ELECCION);
  } catch {
    // Sin almacenamiento (modo privado estricto): la elección no se recuerda, pero la sesión sigue.
  }
  if (eleccion !== 'aceptado') borrarCookiesMeta();
  window.dispatchEvent(new Event(EVENTO_CAMBIO));
}

// Mismo arranque oficial de Meta, escrito en TypeScript. Idempotente: llamarla dos veces no
// duplica el script.
export function cargarPixel(): boolean {
  if (!META_PIXEL_ID || typeof window === 'undefined') return false;
  if (window.fbq) return true;

  const fbq: Fbq = function () {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments as unknown as unknown[];
    // .apply a propósito: es el arranque oficial de Meta y conserva su `this`.
    // eslint-disable-next-line prefer-spread
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
    else fbq.queue.push(args);
  } as unknown as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  // Privacidad: sin "configuración automática" (Meta no detecta botones ni lee la página por su
  // cuenta, solo viajan nuestros eventos), sin PageView automático en cada cambio de ruta (lo
  // disparamos nosotros, solo en las páginas del embudo) y sin "coincidencias avanzadas" (no se
  // pasa ningún dato de la persona al iniciar).
  fbq('set', 'autoConfig', false, META_PIXEL_ID);
  fbq.disablePushState = true;
  fbq.allowDuplicatePageViews = true;
  fbq('init', META_PIXEL_ID);
  return true;
}

// Las únicas páginas donde se mide la vista: la principal y los dos pasos del embudo antes de la
// cuenta. Nada de la app interna.
export function esPaginaMedida(pathname: string): boolean {
  return pathname === '/' || pathname === '/onboarding' || pathname === '/paywall';
}

export function trackMeta(
  evento: string,
  params?: Record<string, string | number>,
  opciones?: { personalizado?: boolean }
): boolean {
  if (!META_PIXEL_ID || typeof window === 'undefined') return false;
  if (leerEleccion() !== 'aceptado') return false;

  const clave = evento + JSON.stringify(params ?? {});
  const ahora = Date.now();
  const ultimo = ultimosEnvios.get(clave);
  if (ultimo !== undefined && ahora - ultimo < VENTANA_DUPLICADO_MS) return false;
  ultimosEnvios.set(clave, ahora);

  if (!cargarPixel()) return false;
  window.fbq?.(opciones?.personalizado ? 'trackCustom' : 'track', evento, params ?? {});
  return true;
}

// Clic en un botón de la página principal que lleva al embudo (/onboarding...): cuenta como
// "Lead", con el texto del botón y, si el enlace lo trae, el plan. Los enlaces a otras cosas
// (correo, anclas) no se miden.
export function rastrearClicCta(href: string, etiqueta: string): void {
  if (!href.startsWith('/onboarding')) return;
  const plan = new URLSearchParams(href.split('?')[1] ?? '').get('plan');
  trackMeta('Lead', plan === 'anual' || plan === 'mensual' ? { boton: etiqueta, plan } : { boton: etiqueta });
}
