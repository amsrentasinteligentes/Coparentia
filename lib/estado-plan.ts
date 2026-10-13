// TEXTO DE LA TARJETA "PLAN ACTUAL" DE PERFIL — antes decía siempre "Suscripción activa", aunque la
// persona estuviera en prueba, con un pago atrasado o cancelada (auditoría externa 2026-10-02).
// Función pura, sin base de datos: se puede probar con casos ficticios.

import type { Status } from './membership-fsm';

export interface FilaSuscripcion {
  status: Status;
  trial_ends_at: string | null;
  access_until: string | null;
  grace_ends_at: string | null;
  /** Fecha del próximo cobro que Hotmart avisó en el último cobro real (puede faltar). */
  next_charge_at: string | null;
}

const ZONA = 'America/Bogota';

/** "13 de noviembre" (con el año solo si no es el actual), en hora de Colombia. */
export function fechaDelPlan(iso: string, ahora: Date = new Date()): string {
  const d = new Date(iso);
  const conAnio = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: ZONA }).format(d);
  const anioFecha = new Intl.DateTimeFormat('es-CO', { year: 'numeric', timeZone: ZONA }).format(d);
  const anioHoy = new Intl.DateTimeFormat('es-CO', { year: 'numeric', timeZone: ZONA }).format(ahora);
  return anioFecha === anioHoy ? conAnio.replace(` de ${anioFecha}`, '') : conAnio;
}

function esFutura(iso: string | null, ahora: Date): iso is string {
  return !!iso && new Date(iso).getTime() > ahora.getTime();
}

export function textoPlanActual(opciones: {
  /** Admin o cuenta dada de alta a mano: nunca pasan por el cobro. */
  cortesia: boolean;
  suscripcion: FilaSuscripcion | null;
  ahora?: Date;
}): string {
  const { cortesia, suscripcion, ahora = new Date() } = opciones;
  if (cortesia) return 'Acceso de cortesía';
  if (!suscripcion) return 'Sin suscripción';

  switch (suscripcion.status) {
    case 'trialing':
      return esFutura(suscripcion.trial_ends_at, ahora)
        ? `En prueba — termina el ${fechaDelPlan(suscripcion.trial_ends_at, ahora)}`
        : 'En prueba';
    case 'active':
      // Si la fecha guardada ya pasó (un cobro posterior no trajo la nueva), es mejor no mostrarla que mostrar una vieja.
      return esFutura(suscripcion.next_charge_at, ahora)
        ? `Activa — próximo cobro el ${fechaDelPlan(suscripcion.next_charge_at, ahora)}`
        : 'Activa';
    case 'past_due':
      return 'Pago pendiente';
    case 'cancelled':
      return esFutura(suscripcion.access_until, ahora)
        ? `Cancelada — acceso hasta el ${fechaDelPlan(suscripcion.access_until, ahora)}`
        : 'Cancelada';
    default:
      return 'Suscripción inactiva'; // vencida / reembolsada / contracargo: la app ya no la deja entrar
  }
}
