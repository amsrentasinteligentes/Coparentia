// CONSTANCIAS A LA OTRA PARTE (2026-09-22) — el resumen de lo registrado en un mes, enviado por
// correo a la otra parte, y la PRUEBA de que se envió.
//
// POR QUÉ ASÍ Y NO UN CORREO POR REGISTRO (decisión del usuario, opción 1):
//   · Treinta correos al mes a una expareja en conflicto se leen como hostigamiento, y basta con
//     que los marque como spam para que TODOS los correos del dominio (los de acceso, los de
//     compra) empiecen a caer en spam para el resto de los clientes.
//   · Un resumen mensual —o uno enviado a mano cuando la persona decide— tiene el mismo valor
//     probatorio y se ve ordenado, no persecutorio.
//
// QUÉ SE ENVÍA: totales y lista breve del período. NUNCA los comprobantes ni las capturas: son
// datos sensibles y no hacen falta para informar. Quien los quiera, los pide por el canal legal.
//
// PUBLICIDAD: una sola línea al pie ("esta constancia la generó Coparentia"). Invitar a comprar a
// alguien que nunca aceptó nada sería publicidad no consentida (Ley 1581 de 2012).

import { Resend } from 'resend';
import type { SupabaseClient } from '@supabase/supabase-js';

const REMITENTE_AVISOS = 'Coparentia · Constancias <avisos@coparentia.co>';
const URL_APP = 'https://coparentia.co';

export interface ResumenConstancia {
  periodo: string; // 'YYYY-MM'
  periodoTexto: string; // 'septiembre de 2026'
  cuotas: number;
  gastosExtra: number;
  totalRegistrado: number;
  contactos: number;
  contactosContestados: number;
  movimientos: { fecha: string; concepto: string; monto: number; tipo: string }[];
  hijos: string[];
}

export interface ResultadoConstancia {
  ok: boolean;
  mensaje: string;
  sinMovimientos?: boolean;
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function periodoTexto(periodo: string): string {
  const [anio, mes] = periodo.split('-').map(Number);
  return `${MESES[(mes || 1) - 1]} de ${anio}`;
}

/** El mes anterior al de hoy, en Colombia, como 'YYYY-MM' (lo que resume el envío automático). */
export function mesAnteriorEnColombia(hoy: string): string {
  const [anio, mes] = hoy.split('-').map(Number);
  return mes === 1 ? `${anio - 1}-12` : `${anio}-${String(mes - 1).padStart(2, '0')}`;
}

function pesos(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

function escapar(texto: string): string {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fechaCorta(iso: string): string {
  const [, mes, dia] = iso.split('-').map(Number);
  return `${dia} de ${MESES[(mes || 1) - 1]}`;
}

/** Arma el resumen de un período leyendo los datos REALES del usuario (con el cliente que se le pase:
 *  el del servidor para el botón manual, el admin para el envío mensual). */
export async function armarResumen(supabase: SupabaseClient, userId: string, periodo: string): Promise<ResumenConstancia> {
  const desde = `${periodo}-01`;
  const [anio, mes] = periodo.split('-').map(Number);
  const hasta = `${mes === 12 ? anio + 1 : anio}-${String(mes === 12 ? 1 : mes + 1).padStart(2, '0')}-01`;

  const [{ data: pagos }, { data: eventos }, { data: hijos }] = await Promise.all([
    supabase.from('pagos').select('fecha, concepto, monto, tipo').eq('user_id', userId).gte('fecha', desde).lt('fecha', hasta).order('fecha'),
    supabase.from('eventos').select('tipo, resultado').eq('user_id', userId).gte('fecha', desde).lt('fecha', hasta),
    supabase.from('hijos').select('nombre').eq('user_id', userId),
  ]);

  const lista = pagos ?? [];
  const contactos = (eventos ?? []).filter((e) => e.tipo === 'llamada' || e.tipo === 'videollamada');

  return {
    periodo,
    periodoTexto: periodoTexto(periodo),
    cuotas: lista.filter((p) => p.tipo === 'cuota').length,
    gastosExtra: lista.filter((p) => p.tipo !== 'cuota').length,
    totalRegistrado: lista.reduce((acc, p) => acc + Number(p.monto), 0),
    contactos: contactos.length,
    contactosContestados: contactos.filter((c) => c.resultado === 'contestada').length,
    movimientos: lista.map((p) => ({ fecha: p.fecha, concepto: p.concepto, monto: Number(p.monto), tipo: p.tipo })),
    hijos: (hijos ?? []).map((h) => h.nombre),
  };
}

function cuerpoHtml(resumen: ResumenConstancia, remitenteNombre: string, destinatarioNombre: string): string {
  const filas = resumen.movimientos
    .slice(0, 40)
    .map(
      (m) => `
        <tr>
          <td style="padding:8px 0;color:#4b5c78;font-size:14px;white-space:nowrap;">${fechaCorta(m.fecha)}</td>
          <td style="padding:8px 12px;color:#14233a;font-size:14px;">${escapar(m.concepto)}</td>
          <td style="padding:8px 0;color:#14233a;font-size:14px;text-align:right;white-space:nowrap;"><strong>${pesos(m.monto)}</strong></td>
        </tr>`
    )
    .join('');

  const saludo = destinatarioNombre ? `Hola, ${escapar(destinatarioNombre)}:` : 'Hola:';
  const porQuien = remitenteNombre ? escapar(remitenteNombre) : 'la otra parte';
  const porHijos = resumen.hijos.length > 0 ? ` de ${escapar(resumen.hijos.join(', '))}` : '';

  return `
  <div style="font-family:Segoe UI,Helvetica,Arial,sans-serif;background:#f3f7fc;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;">
      <p style="color:#14233a;font-size:15px;margin:0 0 16px;">${saludo}</p>
      <p style="color:#14233a;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Esta es una constancia informativa de los gastos y aportes${porHijos} que
        <strong>${porQuien}</strong> registró en <strong>${resumen.periodoTexto}</strong>.
        No necesitas hacer nada con este correo; se envía para que tengas la misma información.
      </p>

      <div style="background:#e7eef8;border-radius:12px;padding:16px;margin:0 0 20px;">
        <p style="margin:0;color:#4b5c78;font-size:13px;">Total registrado en el período</p>
        <p style="margin:4px 0 0;color:#14233a;font-size:26px;font-weight:700;">${pesos(resumen.totalRegistrado)}</p>
        <p style="margin:8px 0 0;color:#4b5c78;font-size:13px;">
          ${resumen.cuotas} ${resumen.cuotas === 1 ? 'cuota' : 'cuotas'} · ${resumen.gastosExtra} ${resumen.gastosExtra === 1 ? 'gasto extra' : 'gastos extra'}
          ${resumen.contactos > 0 ? ` · ${resumen.contactos} ${resumen.contactos === 1 ? 'contacto' : 'contactos'} con ${resumen.hijos.length === 1 ? 'la niña o el niño' : 'los hijos'} (${resumen.contactosContestados} contestados)` : ''}
        </p>
      </div>

      ${filas ? `<table style="width:100%;border-collapse:collapse;margin:0 0 20px;">${filas}</table>` : ''}
      ${resumen.movimientos.length > 40 ? `<p style="color:#5b6d88;font-size:13px;margin:0 0 20px;">y ${resumen.movimientos.length - 40} movimientos más.</p>` : ''}

      <p style="color:#5b6d88;font-size:13px;line-height:1.6;margin:0 0 8px;">
        Cada registro quedó guardado con su fecha y su soporte. Si necesitas el detalle completo con
        los comprobantes, puedes pedírselo directamente a ${porQuien}.
      </p>
      <p style="color:#8494ab;font-size:12px;line-height:1.6;margin:16px 0 0;border-top:1px solid #e7eef8;padding-top:16px;">
        Esta constancia la generó <a href="${URL_APP}" style="color:#2757a8;">Coparentia</a>, la app que
        ${porQuien} usa para llevar el registro. Si no quieres recibir estas constancias, responde a este
        correo con la palabra BAJA y dejaremos de enviártelas.
      </p>
    </div>
  </div>`;
}

/** Envía la constancia y DEJA EL RASTRO en la tabla `constancias` (prueba de que se informó). */
export async function enviarConstancia(
  supabase: SupabaseClient,
  userId: string,
  destinatario: string,
  resumen: ResumenConstancia,
  origen: 'manual' | 'mensual',
  remitenteNombre: string,
  destinatarioNombre: string,
  responderA: string
): Promise<ResultadoConstancia> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('constancias: RESEND_API_KEY no configurada');
    return { ok: false, mensaje: 'El servicio de correo no está configurado.' };
  }
  if (resumen.movimientos.length === 0 && resumen.contactos === 0) {
    return { ok: false, sinMovimientos: true, mensaje: `No hay nada registrado en ${resumen.periodoTexto}: no tiene sentido enviar una constancia vacía.` };
  }

  const resend = new Resend(key);
  let proveedorId: string | null = null;
  let estado: 'enviada' | 'fallida' = 'enviada';
  try {
    const { data, error } = await resend.emails.send({
      from: REMITENTE_AVISOS,
      to: destinatario,
      replyTo: responderA,
      subject: `Constancia de gastos y aportes · ${resumen.periodoTexto}`,
      html: cuerpoHtml(resumen, remitenteNombre, destinatarioNombre),
    });
    if (error) throw new Error(error.message);
    proveedorId = data?.id ?? null;
  } catch (e) {
    console.error('constancias: fallo al enviar', e instanceof Error ? e.message : e);
    estado = 'fallida';
  }

  // El registro se guarda SIEMPRE, también cuando falla: saber que un envío no salió es parte del
  // expediente (y evita que la persona crea que informó cuando no lo hizo).
  const { error: errorFila } = await supabase.from('constancias').insert({
    user_id: userId,
    destinatario,
    periodo: resumen.periodo,
    origen,
    estado,
    proveedor_id: proveedorId,
    resumen: {
      total: resumen.totalRegistrado,
      cuotas: resumen.cuotas,
      gastos_extra: resumen.gastosExtra,
      contactos: resumen.contactos,
      movimientos: resumen.movimientos.length,
    },
  });
  if (errorFila) console.error('constancias: no se pudo registrar el envío', errorFila.message);

  return estado === 'enviada'
    ? { ok: true, mensaje: `Constancia de ${resumen.periodoTexto} enviada a ${destinatario}.` }
    : { ok: false, mensaje: 'No pudimos enviar la constancia. Revisa el correo de la otra parte e inténtalo de nuevo.' };
}
