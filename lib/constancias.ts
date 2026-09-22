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
import { pdfConstancia } from '@/lib/pdf-constancia';

const REMITENTE_AVISOS = 'Coparentia · Constancias <avisos@coparentia.co>';
const URL_APP = 'https://coparentia.co';

export interface ResumenConstancia {
  periodo: string; // 'YYYY-MM'
  periodoTexto: string; // 'septiembre de 2026'
  // Cuando la constancia es de un hijo concreto (lo normal desde 2026-09-22: un correo por hijo).
  hijoId?: string;
  hijoNombre?: string;
  // Movimientos COMUNES del período (cuota alimentaria y gastos sin hijo asignado): se mencionan
  // en cada correo pero NO se suman al total del hijo, para que nadie los cuente dos veces.
  comunesCantidad: number;
  comunesTotal: number;
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
export async function armarResumen(
  supabase: SupabaseClient,
  userId: string,
  periodo: string,
  hijo?: { id: string; nombre: string }
): Promise<ResumenConstancia> {
  const desde = `${periodo}-01`;
  const [anio, mes] = periodo.split('-').map(Number);
  const hasta = `${mes === 12 ? anio + 1 : anio}-${String(mes === 12 ? 1 : mes + 1).padStart(2, '0')}-01`;

  const [{ data: pagos }, { data: eventos }, { data: hijos }] = await Promise.all([
    supabase.from('pagos').select('fecha, concepto, monto, tipo, hijo_id').eq('user_id', userId).gte('fecha', desde).lt('fecha', hasta).order('fecha'),
    supabase.from('eventos').select('tipo, resultado, hijo_id').eq('user_id', userId).gte('fecha', desde).lt('fecha', hasta),
    supabase.from('hijos').select('nombre').eq('user_id', userId),
  ]);

  const todosPagos = pagos ?? [];
  const todosEventos = eventos ?? [];
  // Con hijo: solo lo suyo. Sin hijo (constancia general): todo.
  const lista = hijo ? todosPagos.filter((p) => p.hijo_id === hijo.id) : todosPagos;
  const comunes = hijo ? todosPagos.filter((p) => !p.hijo_id) : [];
  const contactosTodos = todosEventos.filter((e) => e.tipo === 'llamada' || e.tipo === 'videollamada');
  const contactos = hijo ? contactosTodos.filter((c) => c.hijo_id === hijo.id) : contactosTodos;

  return {
    periodo,
    periodoTexto: periodoTexto(periodo),
    hijoId: hijo?.id,
    hijoNombre: hijo?.nombre,
    comunesCantidad: comunes.length,
    comunesTotal: comunes.reduce((acc, p) => acc + Number(p.monto), 0),
    cuotas: lista.filter((p) => p.tipo === 'cuota').length,
    gastosExtra: lista.filter((p) => p.tipo !== 'cuota').length,
    totalRegistrado: lista.reduce((acc, p) => acc + Number(p.monto), 0),
    contactos: contactos.length,
    contactosContestados: contactos.filter((c) => c.resultado === 'contestada').length,
    movimientos: lista.map((p) => ({ fecha: p.fecha, concepto: p.concepto, monto: Number(p.monto), tipo: p.tipo })),
    hijos: hijo ? [hijo.nombre] : (hijos ?? []).map((h) => h.nombre),
  };
}

/** Los hijos del usuario, para mandar un correo por cada uno. */
export async function hijosDelUsuario(supabase: SupabaseClient, userId: string): Promise<{ id: string; nombre: string }[]> {
  const { data } = await supabase.from('hijos').select('id, nombre').eq('user_id', userId).order('fecha_nacimiento', { ascending: true, nullsFirst: false });
  return (data ?? []).map((h) => ({ id: h.id, nombre: h.nombre }));
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
  const nombresHijos = resumen.hijos.map(escapar);
  const porHijos =
    nombresHijos.length === 0
      ? ''
      : nombresHijos.length === 1
        ? ` de <strong>${nombresHijos[0]}</strong>`
        : ` de <strong>${nombresHijos.slice(0, -1).join(', ')} y ${nombresHijos[nombresHijos.length - 1]}</strong>`;

  return `
  <div style="font-family:Segoe UI,Helvetica,Arial,sans-serif;background:#f3f7fc;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;">
      <p style="color:#14233a;font-size:15px;margin:0 0 16px;">${saludo}</p>
      <p style="color:#14233a;font-size:15px;line-height:1.6;margin:0 0 20px;">
        <strong>${porQuien}</strong> registró en <strong>${resumen.periodoTexto}</strong> los gastos
        y aportes${porHijos} que aparecen abajo. Esta constancia es solo informativa: no necesitas
        hacer nada con este correo, se envía para que tengas la misma información.
      </p>

      <div style="background:#e7eef8;border-radius:12px;padding:16px;margin:0 0 20px;">
        <p style="margin:0;color:#4b5c78;font-size:13px;">${resumen.hijoNombre ? `Total registrado para ${escapar(resumen.hijoNombre)}` : 'Total registrado en el período'}</p>
        <p style="margin:4px 0 0;color:#14233a;font-size:26px;font-weight:700;">${pesos(resumen.totalRegistrado)}</p>
        <p style="margin:8px 0 0;color:#4b5c78;font-size:13px;">
          ${resumen.cuotas} ${resumen.cuotas === 1 ? 'cuota' : 'cuotas'} · ${resumen.gastosExtra} ${resumen.gastosExtra === 1 ? 'gasto extra' : 'gastos extra'}
          ${resumen.contactos > 0 ? ` · ${resumen.contactos} ${resumen.contactos === 1 ? 'contacto' : 'contactos'} con ${resumen.hijos.length === 1 ? 'la niña o el niño' : 'los hijos'} (${resumen.contactosContestados} ${resumen.contactosContestados === 1 ? 'contestado' : 'contestados'})` : ''}
        </p>
      </div>

      ${filas ? `<table style="width:100%;border-collapse:collapse;margin:0 0 20px;">${filas}</table>` : ''}
      ${
        resumen.comunesCantidad > 0
          ? `<p style="color:#5b6d88;font-size:13px;line-height:1.6;margin:0 0 20px;background:#f3f7fc;border-radius:12px;padding:12px;">
               Además, en el período se registraron <strong>${resumen.comunesCantidad}</strong> ${resumen.comunesCantidad === 1 ? 'movimiento común' : 'movimientos comunes'}
               por <strong>${pesos(resumen.comunesTotal)}</strong> (cuota alimentaria y gastos que no corresponden a un hijo en particular).
               No están sumados arriba para no contarlos dos veces.
             </p>`
          : ''
      }
      ${resumen.movimientos.length > 40 ? `<p style="color:#5b6d88;font-size:13px;margin:0 0 20px;">y ${resumen.movimientos.length - 40} movimientos más.</p>` : ''}

      <p style="color:#5b6d88;font-size:13px;line-height:1.6;margin:0 0 8px;">
        Encuentras esta misma información en el <strong>PDF adjunto</strong> a este correo. Cada
        registro quedó guardado con su fecha y su soporte; si necesitas el detalle con los
        comprobantes, puedes pedírselo directamente a ${porQuien}.
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
  // El PDF de la constancia viaja adjunto: la otra parte se queda con el documento, no solo con el
  // correo (pedido del usuario 2026-09-22). Si fallara al generarse, el correo igual sale.
  let adjunto: { filename: string; content: string }[] | undefined;
  try {
    const pdf = pdfConstancia(resumen, remitenteNombre, destinatarioNombre);
    adjunto = [{ filename: pdf.nombreArchivo, content: pdf.base64 }];
  } catch (e) {
    console.error('constancias: no se pudo generar el PDF adjunto', e instanceof Error ? e.message : e);
  }
  try {
    const { data, error } = await resend.emails.send({
      from: REMITENTE_AVISOS,
      to: destinatario,
      replyTo: responderA,
      subject: resumen.hijoNombre
        ? `Constancia de gastos y aportes de ${resumen.hijoNombre} · ${resumen.periodoTexto}`
        : `Constancia de gastos y aportes · ${resumen.periodoTexto}`,
      html: cuerpoHtml(resumen, remitenteNombre, destinatarioNombre),
      attachments: adjunto,
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
    hijo_id: resumen.hijoId ?? null,
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

/** UN CORREO POR CADA HIJO (pedido del usuario, 2026-09-22). Si no hay hijos cargados, o si ninguno
 *  tiene movimientos, cae a una sola constancia general del período — nunca se queda sin informar. */
export async function enviarConstanciasDelPeriodo(
  supabase: SupabaseClient,
  userId: string,
  destinatario: string,
  periodo: string,
  origen: 'manual' | 'mensual',
  remitenteNombre: string,
  destinatarioNombre: string,
  responderA: string
): Promise<{ enviadas: number; fallidas: number; nombres: string[]; sinNada: boolean }> {
  const hijos = await hijosDelUsuario(supabase, userId);
  const nombres: string[] = [];
  let enviadas = 0;
  let fallidas = 0;

  for (const hijo of hijos) {
    const resumen = await armarResumen(supabase, userId, periodo, hijo);
    if (resumen.movimientos.length === 0 && resumen.contactos === 0) continue; // nada suyo este mes
    const r = await enviarConstancia(supabase, userId, destinatario, resumen, origen, remitenteNombre, destinatarioNombre, responderA);
    if (r.ok) {
      enviadas += 1;
      nombres.push(hijo.nombre);
    } else if (!r.sinMovimientos) {
      fallidas += 1;
    }
  }

  if (enviadas === 0 && fallidas === 0) {
    // Ningún hijo con movimientos propios: se informa igual con la constancia general del período
    // (ahí entran la cuota alimentaria y los gastos sin hijo asignado).
    const general = await armarResumen(supabase, userId, periodo);
    if (general.movimientos.length === 0 && general.contactos === 0) return { enviadas: 0, fallidas: 0, nombres: [], sinNada: true };
    const r = await enviarConstancia(supabase, userId, destinatario, general, origen, remitenteNombre, destinatarioNombre, responderA);
    if (r.ok) enviadas += 1;
    else fallidas += 1;
  }

  return { enviadas, fallidas, nombres, sinNada: false };
}
