// EL ROL QUE LA PERSONA YA ELIGIÓ EN LAS PREGUNTAS PREVIAS A LA COMPRA ("Yo pago" / "Yo recibo").
//
// POR QUÉ EXISTE: el onboarding guarda las respuestas solo en `sessionStorage`, que es POR PESTAÑA.
// Quien paga en Hotmart y vuelve desde el correo de acceso entra en una pestaña nueva, donde esa
// respuesta ya no existe: en "Primeros pasos" se le volvía a preguntar lo mismo. Aquí se guarda
// ADEMÁS una copia mínima (solo el rol, nada más) en `localStorage` del mismo navegador, para que el
// paso 1 llegue con el rol ya elegido. Se borra apenas la cuota queda guardada en la cuenta.
//
// Nunca lanza: si el almacenamiento está bloqueado (navegación privada, políticas del navegador),
// simplemente no hay rol previo y el paso 1 se comporta como siempre.

export type RolPago = 'paga' | 'recibe';

const CLAVE_ROL_PREVIO = 'coparentia_rol_previo';
const CLAVE_ONBOARDING = 'coparentia_onboarding'; // misma clave que usa app/(funnel)/onboarding

function esRol(valor: unknown): valor is RolPago {
  return valor === 'paga' || valor === 'recibe';
}

/** Guarda el rol elegido. Un valor vacío no escribe nada (no pisa un rol ya guardado). */
export function guardarRolPrevio(rol: string): void {
  if (!esRol(rol)) return;
  try {
    localStorage.setItem(CLAVE_ROL_PREVIO, rol);
  } catch {
    // sin almacenamiento disponible: no hay nada que recordar
  }
}

/** El rol de las preguntas previas: primero la pestaña actual y, si no está, la copia del navegador. */
export function leerRolPrevio(): RolPago | '' {
  try {
    const crudo = sessionStorage.getItem(CLAVE_ONBOARDING);
    if (crudo) {
      const rol = (JSON.parse(crudo) as { rol?: unknown }).rol;
      if (esRol(rol)) return rol;
    }
  } catch {
    // JSON dañado o almacenamiento bloqueado: se intenta la otra fuente
  }
  try {
    const guardado = localStorage.getItem(CLAVE_ROL_PREVIO);
    if (esRol(guardado)) return guardado;
  } catch {
    // sin almacenamiento disponible
  }
  return '';
}

/** Borra la copia del rol (al guardar la cuota en la cuenta, o al empezar el onboarding de nuevo). */
export function borrarRolPrevio(): void {
  try {
    localStorage.removeItem(CLAVE_ROL_PREVIO);
  } catch {
    // nada que borrar
  }
}
