// Next.js ejecuta `register()` una vez al arrancar el servidor. Aquí se enciende la vigilancia de errores (Sentry) solo del
// lado del servidor; el navegador no carga nada. `onRequestError` envía a Sentry los errores no controlados de las rutas
// y páginas del servidor. Ver sentry.server.config.ts para lo que se envía (y lo que NO).

import * as Sentry from '@sentry/nextjs';

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
