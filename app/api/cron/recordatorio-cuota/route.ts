// RECORDATORIO DE CUOTA POR NOTIFICACIÓN PUSH (2026-09-28) — lo llama Vercel una vez al día
// (vercel.json). Cumple la promesa del onboarding ("alertas en el momento que elegiste"), acotada
// al único aviso que hoy se puede mandar con un dato real y confiable: el día de pago que cada
// quien configuró. El mensaje cambia según el rol (app/api/cron/recordatorio-cuota — pedido del
// usuario, 2026-09-28): a quien paga, que suba el comprobante; a quien recibe, que ya casi le llega.
//
// Se avisa UNA vez al mes, dentro de una ventana de 4 días antes del día de pago (no exactamente
// "3 días antes": con meses de 28-31 días, un `dia_pago` alto puede no tener un match exacto —
// la ventana absorbe eso). Se salta si ya hay un pago de tipo "cuota" registrado este mes: ya no
// hace falta recordarle a nadie nada.
//
// Seguridad: misma puerta que el resto de los crons — `Authorization: Bearer $CRON_SECRET` en
// tiempo constante. Sin CRON_SECRET o sin las claves VAPID, responde 503 y no hace nada.

import { NextResponse } from 'next/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { enviarPushAUsuario } from '@/lib/push';
import { comparacionSegura } from '@/lib/hotmart-verify';
import { diaDelMesEnColombia, mesEnColombia } from '@/lib/fecha';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const DIAS_DE_VENTANA = 4; // avisa si faltan entre 0 y 4 días para el día de pago

export async function GET(request: Request): Promise<NextResponse> {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 503 });
  }
  if (!comparacionSegura(request.headers.get('authorization') ?? '', `Bearer ${secreto}`)) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'faltan las claves VAPID' }, { status: 503 });
  }

  const admin = crearClienteSupabaseAdmin();
  const hoy = diaDelMesEnColombia();
  const mesActual = mesEnColombia();

  const { data: titulos, error } = await admin
    .from('titulos')
    .select('user_id, dia_pago, rol_pago, recordatorio_cuota_enviado_mes')
    .not('rol_pago', 'is', null)
    .neq('recordatorio_cuota_enviado_mes', mesActual);
  if (error) {
    console.error('cron recordatorio-cuota: no se pudo leer titulos', error.message);
    return NextResponse.json({ error: 'fallo al leer titulos' }, { status: 500 });
  }

  let avisados = 0;
  for (const t of titulos ?? []) {
    const faltan = t.dia_pago - hoy;
    if (faltan < 0 || faltan > DIAS_DE_VENTANA) continue;

    // ¿Ya hay un pago de tipo "cuota" este mes? Entonces ya no hace falta el recordatorio.
    const { data: yaPago } = await admin
      .from('pagos')
      .select('id')
      .eq('user_id', t.user_id)
      .eq('tipo', 'cuota')
      .is('eliminado_en', null)
      .gte('fecha', `${mesActual}-01`)
      .limit(1);
    if (yaPago && yaPago.length > 0) continue;

    const aviso =
      t.rol_pago === 'paga'
        ? { titulo: 'Recuerda tu cuota alimentaria', cuerpo: 'Ya casi es tu día de pago — sube el comprobante para que quede en tu expediente.' }
        : { titulo: 'Tu cuota alimentaria está por llegar', cuerpo: 'En los próximos días deberías recibirla — revisa tu expediente cuando llegue.' };

    const enviados = await enviarPushAUsuario(admin, t.user_id, aviso);
    if (enviados > 0) {
      await admin.from('titulos').update({ recordatorio_cuota_enviado_mes: mesActual }).eq('user_id', t.user_id);
      avisados += 1;
    }
  }

  return NextResponse.json({ ok: true, revisados: (titulos ?? []).length, avisados });
}
