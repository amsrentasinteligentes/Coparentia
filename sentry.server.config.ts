// VIGILANCIA DE ERRORES DEL SERVIDOR (Sentry) — 2026-10-22. SOLO SERVIDOR: no hay configuración de navegador, así que las
// pantallas del cliente no cargan nada de Sentry ni envían nada desde el celular de nadie.
//
// Privacidad (la app guarda datos de hijos y pagos): se apaga TODO lo que pueda llevar datos de una persona —
//   · usuario, IP, cookies, encabezados, cuerpos de peticiones, parámetros de la dirección, datos de consultas a la base y
//     variables de las funciones (`dataCollection`);
//   · se enmascara cualquier correo que aparezca dentro de un texto de error (`beforeSend`);
//   · sin trazas de rendimiento, sin reproducción de sesiones, sin registros.
// Solo viaja el tipo de error, su pila de código y el entorno. Sin la variable SENTRY_DSN (que el dueño pega en Vercel,
// nunca en el código) Sentry queda APAGADO: la app funciona igual.

import * as Sentry from '@sentry/nextjs';

const CORREO = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const CONTROL_DE_NEXT = /NEXT_REDIRECT|NEXT_NOT_FOUND|NEXT_HTTP_ERROR_FALLBACK/;

function enmascarar(texto: string | undefined): string | undefined {
  return texto?.replace(CORREO, '[correo]');
}

const dsn = process.env.SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn) && process.env.NODE_ENV === 'production',
  environment: process.env.VERCEL_ENV ?? 'local',
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  tracesSampleRate: 0,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
    databaseQueryData: false,
    stackFrameVariables: false,
  },
  beforeSend(evento, pista) {
    // Next usa errores especiales para redirigir o mostrar 404: no son fallos.
    const original = pista?.originalException;
    const mensajeOriginal = original instanceof Error ? original.message : typeof original === 'string' ? original : '';
    if (CONTROL_DE_NEXT.test(mensajeOriginal) || CONTROL_DE_NEXT.test(evento.message ?? '')) return null;

    evento.message = enmascarar(evento.message);
    for (const valor of evento.exception?.values ?? []) {
      valor.value = enmascarar(valor.value);
    }
    delete evento.user;
    delete evento.request;
    return evento;
  },
});

// Prueba de conexión (2026-10-22): con SENTRY_PRUEBA=1 en Vercel, al arrancar el servidor se envía UN mensaje de muestra
// para comprobar que la clave está bien puesta. Después se borra esa variable.
if (process.env.SENTRY_PRUEBA === '1' && dsn) {
  Sentry.captureMessage('Prueba de Sentry: la conexión del servidor funciona', 'info');
  void Sentry.flush(2000);
}
