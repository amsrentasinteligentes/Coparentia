// Aviso de errores a Sentry desde los puntos críticos del servidor (aviso de pago de Hotmart y tareas diarias).
// Es un complemento de `console.error`: el registro de Vercel sigue igual, y además, si hay SENTRY_DSN, llega un correo.
// REGLA: el mensaje y los datos que se pasan NO pueden llevar correos, nombres ni montos de una persona (solo códigos,
// nombres de evento y cantidades). Si Sentry está apagado o falla, esto no hace nada ni rompe el flujo.

import * as Sentry from '@sentry/nextjs';

export function reportarError(mensaje: string, detalle?: Record<string, string | number | boolean | undefined>): void {
  try {
    Sentry.captureMessage(mensaje, { level: 'error', extra: detalle });
  } catch {
    // La vigilancia nunca debe romper el cobro ni una tarea diaria.
  }
}
