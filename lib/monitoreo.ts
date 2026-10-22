// Aviso de errores a Sentry desde los puntos críticos del servidor (aviso de pago de Hotmart y tareas diarias).
// Es un complemento de `console.error`: el registro de Vercel sigue igual, y además, si hay SENTRY_DSN, llega un correo.
// REGLA: el mensaje y los datos que se pasan NO pueden llevar correos, nombres ni montos de una persona (solo códigos,
// nombres de evento y cantidades). Si Sentry está apagado o falla, esto no hace nada ni rompe el flujo.

import * as Sentry from '@sentry/nextjs';

// "Latido" de una tarea diaria: al terminar bien, avisa a Better Stack ("sigo viva"). Si pasa más tiempo del esperado sin latido,
// Better Stack escribe al dueño; así se detecta una tarea que NO se ejecutó (algo que Sentry no ve porque no hay error).
// La dirección de cada latido vive en una variable de Vercel (HEARTBEAT_<NOMBRE>), nunca en el código. Sin variable no hace nada.
export type TareaConLatido = 'CONSTANCIAS' | 'AVISO_PRE_COBRO' | 'DUNNING' | 'RECONCILIACION';

export async function latido(tarea: TareaConLatido): Promise<void> {
  const direccion = process.env[`HEARTBEAT_${tarea}`];
  if (!direccion || !direccion.startsWith('https://')) return;
  try {
    await fetch(direccion, { signal: AbortSignal.timeout(5000) });
  } catch {
    // Un latido que falla nunca debe romper la tarea: Better Stack avisará por la falta de latido.
  }
}

export function reportarError(mensaje: string, detalle?: Record<string, string | number | boolean | undefined>): void {
  try {
    Sentry.captureMessage(mensaje, { level: 'error', extra: detalle });
  } catch {
    // La vigilancia nunca debe romper el cobro ni una tarea diaria.
  }
}
