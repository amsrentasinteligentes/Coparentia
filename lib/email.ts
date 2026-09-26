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
// Destino de las consultas de Asistencia jurídica (decisión del usuario, 2026-09-21): la abogada
// que responde. Se puede cambiar sin tocar código con la variable CONSULTAS_JURIDICAS_EMAIL en
// Vercel; sin ella, cae al correo de Ivonne.
const DESTINO_CONSULTAS = process.env.CONSULTAS_JURIDICAS_EMAIL ?? 'ivonnereyes.abogada@gmail.com';
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

/** Escapa el texto que escribió el usuario antes de meterlo en HTML del correo — sin esto, alguien
 *  podría escribir una etiqueta o un enlace falso en su "consulta" y que se renderice de verdad en
 *  la bandeja de quien la recibe. */
function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

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
      (fechaCobro ? ` Si sigues, el primer cobro sería el <strong>${fechaCobro}</strong> — te avisaremos antes.` : '')
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

  // "No se te cobrará DE NUEVO" da a entender que ya hubo un cobro antes — falso si cancela
  // DURANTE la prueba gratis, donde nunca se le cobró nada (hallazgo real del usuario, revisando
  // la previsualización). Las dos frases (esta y la del párrafo de acceso) tienen que concordar.
  const fraseCobro = veniaDePrueba ? 'no te cobraremos nada' : 'no se te cobrará de nuevo';
  const parrafoAcceso = fecha
    ? veniaDePrueba
      ? `Sigues teniendo acceso completo hasta el <strong>${fecha}</strong>, el resto de tu prueba gratis.`
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
          Tu suscripción a Coparentia quedó cancelada — ${fraseCobro}. ${parrafoAcceso}
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

/**
 * Consulta jurídica enviada desde la app (Asistencia Jurídica) — a diferencia de los otros correos
 * de este archivo, este SÍ le importa el resultado a quien lo dispara: la pantalla necesita saber
 * si de verdad llegó para poder decirle "listo, la enviamos" o "no se pudo, intenta de nuevo" en
 * vez de fingir éxito. Por eso devuelve boolean en lugar de tragarse el error en silencio.
 */
export async function enviarConsultaJuridica(emailUsuario: string, mensaje: string, responderA: string = emailUsuario): Promise<boolean> {
  const resend = clienteResend();
  if (!resend) return false;
  try {
    const { error } = await resend.emails.send({
      from: REMITENTE,
      to: DESTINO_CONSULTAS,
      // La respuesta va al correo que la persona eligió (por defecto, el de su cuenta).
      replyTo: responderA,
      subject: 'Consulta jurídica Coparentia',
      html: `
        <p style="font-family:sans-serif;color:#374151;font-size:14px;">
          <strong>De:</strong> ${escaparHtml(emailUsuario)}<br/>
          ${responderA !== emailUsuario ? `<strong>Responder a:</strong> ${escaparHtml(responderA)}<br/>` : ''}
          <span style="color:#6b7280;">Responde a este correo y la respuesta le llega directo a la persona.</span>
        </p>
        <p style="font-family:sans-serif;color:#111827;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escaparHtml(mensaje)}</p>
      `,
    });
    return !error;
  } catch (e) {
    console.error('fallo al enviar consulta jurídica', e instanceof Error ? e.message : e);
    return false;
  }
}

/**
 * Aviso ANTES del primer cobro (promesa activa desde el onboarding/paywall — "te avisamos por
 * correo antes del día 7"). Lo dispara el cron de app/api/cron/aviso-pre-cobro/route.ts, 2 días
 * antes de que termine la prueba gratis. Sin monto ni periodicidad: la tabla `suscripciones` no
 * guarda cuál plan (mensual/anual) eligió cada quien, y decir un monto que podría no ser el
 * correcto es peor que no decirlo — el enlace a Hotmart siempre tiene el dato exacto y real.
 */
export async function enviarCorreoAvisoPreCobro(email: string, nombre: string | undefined, trialEndsAt: Date): Promise<void> {
  const resend = clienteResend();
  if (!resend) return;
  const primero = primerNombre(nombre);
  const fecha = fechaLargaColombia(trialEndsAt);

  try {
    await resend.emails.send({
      from: REMITENTE,
      to: email,
      replyTo: RESPONDER_A,
      subject: 'Tu prueba gratis de Coparentia termina pronto',
      html: `
        <h1 style="font-family:sans-serif;color:#111827;">${primero ? `Hola ${primero}` : 'Hola'} 👋</h1>
        <p style="font-family:sans-serif;color:#374151;font-size:15px;line-height:1.5;">
          Tu prueba gratis termina el <strong>${fecha}</strong>. Si sigues, ese día se hace el
          primer cobro de tu plan — puedes ver el monto exacto y cancelar cuando quieras desde
          el portal de Hotmart.
        </p>
        <p style="margin:24px 0;">
          <a href="https://consumer.hotmart.com" style="${ESTILO_BOTON}">Ver mi plan y método de pago →</a>
        </p>
        <p style="font-family:sans-serif;color:#6b7280;font-size:13px;">
          ¿Dudas? Escríbenos a ${RESPONDER_A}
        </p>
      `,
    });
  } catch (e) {
    console.error('fallo al enviar aviso de pre-cobro', e instanceof Error ? e.message : e);
  }
}

/**
 * Alerta al DUEÑO (no al cliente) cuando la reconciliación semanal (app/api/cron/
 * reconciliacion-hotmart/route.ts) encuentra diferencias entre lo que dice Hotmart y lo que
 * guarda `suscripciones` — sea porque un webhook se perdió, o por cualquier otra razón. Se manda
 * a `soporte@coparentia.co` (el mismo correo que ya monitorea) — nunca al cliente afectado.
 */
export async function enviarCorreoDriftDetectado(cantidad: number): Promise<void> {
  const resend = clienteResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: REMITENTE,
      to: RESPONDER_A,
      subject: `Coparentia: ${cantidad} diferencia${cantidad === 1 ? '' : 's'} entre Hotmart y tu base de datos`,
      html: `
        <h1 style="font-family:sans-serif;color:#111827;">La reconciliación semanal encontró diferencias</h1>
        <p style="font-family:sans-serif;color:#374151;font-size:15px;line-height:1.5;">
          Se compararon tus suscriptores reales en Hotmart contra lo que guarda la app, y se
          encontraron <strong>${cantidad}</strong> ${cantidad === 1 ? 'caso' : 'casos'} donde no
          coinciden — puede ser un aviso de pago que nunca llegó, entre otras causas. Revísalos en
          el panel de administración, sección "Pagos", antes de que un cliente reclame.
        </p>
        <p style="margin:24px 0;">
          <a href="${URL_APP}/admin" style="${ESTILO_BOTON}">Ver el panel de administración →</a>
        </p>
      `,
    });
  } catch (e) {
    console.error('fallo al enviar alerta de reconciliación', e instanceof Error ? e.message : e);
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
          <a href="https://consumer.hotmart.com" style="${ESTILO_BOTON}">Actualizar mi método de pago →</a>
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

/**
 * Recordatorio A MITAD de los días de gracia de un pago fallido (además del correo inmediato de
 * `enviarCorreoPagoFallido`) — antes no existía ninguna cadencia, solo ese primer aviso. Lo manda
 * el cron de app/api/cron/dunning/route.ts.
 */
export async function enviarCorreoRecordatorioPago(email: string, graceEndsAt: Date): Promise<void> {
  const resend = clienteResend();
  if (!resend) return;
  const fecha = fechaLargaColombia(graceEndsAt);

  try {
    await resend.emails.send({
      from: REMITENTE,
      to: email,
      replyTo: RESPONDER_A,
      subject: 'Recordatorio: tu pago de Coparentia sigue sin procesarse',
      html: `
        <h1 style="font-family:sans-serif;color:#111827;">Sigue pendiente tu pago</h1>
        <p style="font-family:sans-serif;color:#374151;font-size:15px;line-height:1.5;">
          Tu acceso a Coparentia sigue activo, pero si no actualizas tu método de pago antes del
          <strong>${fecha}</strong> se pausará. Suele ser rápido de resolver desde el portal de Hotmart.
        </p>
        <p style="margin:24px 0;">
          <a href="https://consumer.hotmart.com" style="${ESTILO_BOTON}">Actualizar mi método de pago →</a>
        </p>
        <p style="font-family:sans-serif;color:#6b7280;font-size:13px;">
          ¿Necesitas ayuda? Escríbenos a ${RESPONDER_A}
        </p>
      `,
    });
  } catch (e) {
    console.error('fallo al enviar recordatorio de pago', e instanceof Error ? e.message : e);
  }
}

/**
 * ÚLTIMO aviso antes de que termine la gracia de un pago fallido y se pause el acceso — el tono
 * sube de "recordatorio" a "esto se corta pronto", con la fecha exacta en juego.
 */
export async function enviarCorreoUltimoAvisoPago(email: string, graceEndsAt: Date): Promise<void> {
  const resend = clienteResend();
  if (!resend) return;
  const fecha = fechaLargaColombia(graceEndsAt);

  try {
    await resend.emails.send({
      from: REMITENTE,
      to: email,
      replyTo: RESPONDER_A,
      subject: 'Último aviso: tu acceso a Coparentia se pausa pronto',
      html: `
        <h1 style="font-family:sans-serif;color:#111827;">Tu acceso se pausa el ${fecha}</h1>
        <p style="font-family:sans-serif;color:#374151;font-size:15px;line-height:1.5;">
          No hemos podido cobrar tu renovación. Si no actualizas tu método de pago antes del
          <strong>${fecha}</strong>, tu expediente queda en pausa (tus datos NO se borran — vuelves
          a tener acceso apenas se resuelva el pago).
        </p>
        <p style="margin:24px 0;">
          <a href="https://consumer.hotmart.com" style="${ESTILO_BOTON}">Actualizar mi método de pago →</a>
        </p>
        <p style="font-family:sans-serif;color:#6b7280;font-size:13px;">
          ¿Necesitas ayuda? Escríbenos a ${RESPONDER_A}
        </p>
      `,
    });
  } catch (e) {
    console.error('fallo al enviar último aviso de pago', e instanceof Error ? e.message : e);
  }
}
