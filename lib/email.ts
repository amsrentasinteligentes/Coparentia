// CORREOS TRANSACCIONALES CON RESEND — sigue docs/sistema/18-VENTA-HOTMART.md, sección "EMAILS
// CON RESEND". Los dispara el webhook de Hotmart (app/api/webhooks/hotmart/route.ts) en el
// momento justo: bienvenida al empezar la prueba/pagar, despedida al cancelar, aviso al fallar
// un cobro. Nunca bloquean el webhook: si Resend falla, el estado de la suscripción YA quedó
// guardado (es lo que de verdad importa) — el correo se pierde, no la venta.
//
// EL DOMINIO DEBE ESTAR VERIFICADO EN RESEND antes de que esto funcione (SPF/DKIM en el DNS del
// dominio — hoy vive en Vercel, ver ESTADO.md). Sin `RESEND_API_KEY` configurada, cada función
// se salta el envío en silencio (log, no excepción) — degradación elegante, igual que el resto
// de integraciones externas de esta app (30-INTEGRACION-IA.md).
//
// ⚠️ Todas las fechas que se muestran van ancladas a `America/Bogota` (lib/fecha.ts) — mismo
// cuidado que el resto de la app: sin esto, cerca de la medianoche el correo puede mostrar un día
// distinto al que de verdad rige en Colombia (auditoría 2026-09-11, mismo tipo de bug).

import { Resend } from 'resend';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';

const REMITENTE = 'Coparentia <hola@coparentia.co>';
const RESPONDER_A = 'soporte@coparentia.co'; // a donde llegan las respuestas, no al remitente
const URL_APP = 'https://coparentia.co';

function clienteResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('RESEND_API_KEY no está configurada — correo NO enviado (la suscripción sí quedó guardada).');
    return null;
  }
  return new Resend(key);
}

// Genera el enlace mágico de Supabase (entrar sin contraseña) para incrustarlo en el correo. Si
// falla (ej. el correo no tiene cuenta de auth todavía — es normal: el pago llega ANTES de que la
// persona haya iniciado sesión la primera vez), se cae a la pantalla de login normal: ahí puede
// pedir su propio enlace escribiendo el mismo correo, como cualquier otro día.
async function enlaceDeAcceso(email: string): Promise<string> {
  try {
    const admin = crearClienteSupabaseAdmin();
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${URL_APP}/auth/callback` },
    });
    if (error || !data?.properties?.action_link) return `${URL_APP}/entrar`;
    return data.properties.action_link;
  } catch {
    return `${URL_APP}/entrar`;
  }
}

/** Fecha en formato largo, SIEMPRE en el calendario de Colombia (nunca en la hora del servidor). */
function fechaLargaColombia(fecha: Date): string {
  return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' });
}

/** Solo el primer nombre — "¡Hola Juan Camilo Restrepo Uribe!" suena a plantilla, no a bienvenida. */
function primerNombre(nombre?: string): string | null {
  const limpio = nombre?.trim();
  return limpio ? limpio.split(/\s+/)[0] : null;
}

const ESTILO_BOTON =
  'background:#5b93e8;color:#ffffff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600;display:inline-block';

/**
 * Se manda al confirmarse el ACCESO por primera vez. `esPrueba` distingue las DOS situaciones
 * reales que disparan este correo — decirlas mal es una promesa de dinero incumplida:
 *   - true  → empieza la prueba gratis (nadie ha pagado nada todavía, `trialEndsAt` = cuándo sería
 *             el primer cobro real). NUNCA decir "tu compra se confirmó" aquí.
 *   - false → hubo un cobro real directo (sin prueba, o la prueba ya se convirtió en pago).
 */
export async function enviarCorreoBienvenida(
  email: string,
  nombre: string | undefined,
  esPrueba: boolean,
  trialEndsAt?: Date | null
): Promise<void> {
  const resend = clienteResend();
  if (!resend) return;
  const enlace = await enlaceDeAcceso(email);
  const primero = primerNombre(nombre);
  const saludo = primero ? `¡Hola ${primero}!` : '¡Hola!';
  const fechaCobro = esPrueba && trialEndsAt ? fechaLargaColombia(trialEndsAt) : null;

  const parrafoEstado = esPrueba
    ? `Tu prueba gratis de Coparentia ya está activa — <strong>hoy no se te cobró nada</strong>.` +
      (fechaCobro ? ` Si sigues, el primer cobro sería el <strong>${fechaCobro}</strong> — te avisamos antes.` : '')
    : `Tu compra se confirmó y tu expediente en Coparentia ya está activo.`;

  try {
    await resend.emails.send({
      from: REMITENTE,
      to: email,
      replyTo: RESPONDER_A,
      subject: 'Tu acceso a Coparentia ya está listo',
      html: `
        <h1 style="font-family:sans-serif;color:#111827;">${saludo} 👋</h1>
        <p style="font-family:sans-serif;color:#374151;font-size:15px;line-height:1.5;">
          ${parrafoEstado}
        </p>
        <p style="margin:24px 0;">
          <a href="${enlace}" style="${ESTILO_BOTON}">Entrar a mi expediente →</a>
        </p>
        <p style="font-family:sans-serif;color:#6b7280;font-size:13px;line-height:1.5;">
          Este enlace te deja entrar sin contraseña. Si ya caducó, entra a
          <a href="${URL_APP}/entrar">coparentia.co/entrar</a> con este mismo correo y te mandamos uno nuevo.
        </p>
        <p style="font-family:sans-serif;color:#6b7280;font-size:13px;">
          ¿Dudas? Escríbenos a ${RESPONDER_A}
        </p>
      `,
    });
  } catch (e) {
    console.error('fallo al enviar correo de bienvenida', e instanceof Error ? e.message : e);
  }
}

/**
 * Se manda cuando la suscripción pasa a CANCELADA. `veniaDePrueba` distingue si la persona
 * alguna vez llegó a pagar: cancelar DURANTE la prueba gratis (nunca hubo cobro) es distinto de
 * cancelar una suscripción ya pagada — decir "el período que ya pagaste" cuando nunca pagó nada
 * es una afirmación falsa, justo el tipo de detalle que este avatar (que desconfía de las cuentas
 * que no cuadran, FICHA-AVATAR.md) no perdona.
 */
export async function enviarCorreoCancelacion(
  email: string,
  accessUntil: Date | null | undefined,
  veniaDePrueba: boolean
): Promise<void> {
  const resend = clienteResend();
  if (!resend) return;
  const fecha = accessUntil ? fechaLargaColombia(accessUntil) : null;

  const parrafoAcceso = fecha
    ? veniaDePrueba
      ? `Sigues teniendo acceso completo hasta el <strong>${fecha}</strong>, el resto de tu prueba gratis. No se te cobrará nada.`
      : `Sigues teniendo acceso completo hasta el <strong>${fecha}</strong>, el período que ya pagaste.`
    : '';

  try {
    await resend.emails.send({
      from: REMITENTE,
      to: email,
      replyTo: RESPONDER_A,
      subject: 'Confirmamos la cancelación de tu suscripción',
      html: `
        <h1 style="font-family:sans-serif;color:#111827;">Lamentamos que te vayas</h1>
        <p style="font-family:sans-serif;color:#374151;font-size:15px;line-height:1.5;">
          Tu suscripción a Coparentia quedó cancelada — no se te cobrará de nuevo. ${parrafoAcceso}
        </p>
        <p style="font-family:sans-serif;color:#374151;font-size:15px;line-height:1.5;">
          Tu expediente y tus comprobantes siguen guardados — si vuelves más adelante, todo va a
          seguir donde lo dejaste.
        </p>
        <p style="font-family:sans-serif;color:#6b7280;font-size:13px;">
          ¿Cancelaste por error, o hay algo que podamos mejorar? Escríbenos a ${RESPONDER_A} — lo leemos de verdad.
        </p>
      `,
    });
  } catch (e) {
    console.error('fallo al enviar correo de cancelación', e instanceof Error ? e.message : e);
  }
}

/** Se manda cuando un cobro de renovación FALLA (estado `past_due`) — hay días de gracia, no se corta el acceso todavía. */
export async function enviarCorreoPagoFallido(email: string, graceEndsAt?: Date | null): Promise<void> {
  const resend = clienteResend();
  if (!resend) return;
  const fecha = graceEndsAt ? fechaLargaColombia(graceEndsAt) : null;

  try {
    await resend.emails.send({
      from: REMITENTE,
      to: email,
      replyTo: RESPONDER_A,
      subject: 'No pudimos procesar tu pago de Coparentia',
      html: `
        <h1 style="font-family:sans-serif;color:#111827;">Tu pago no se pudo procesar</h1>
        <p style="font-family:sans-serif;color:#374151;font-size:15px;line-height:1.5;">
          Intentamos cobrar tu renovación y no se pudo completar — puede ser la fecha de
          vencimiento de la tarjeta o el cupo disponible. Tu acceso sigue activo
          ${fecha ? `hasta el <strong>${fecha}</strong>` : 'por unos días más'} mientras lo resuelves.
        </p>
        <p style="margin:24px 0;">
          <a href="https://purchases.hotmart.com" style="${ESTILO_BOTON}">Actualizar mi método de pago →</a>
        </p>
        <p style="font-family:sans-serif;color:#6b7280;font-size:13px;">
          ¿Necesitas ayuda? Escríbenos a ${RESPONDER_A}
        </p>
      `,
    });
  } catch (e) {
    console.error('fallo al enviar correo de pago fallido', e instanceof Error ? e.message : e);
  }
}
