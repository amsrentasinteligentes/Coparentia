// RECONCILIACIÓN SEMANAL HOTMART ↔ BASE DE DATOS (2026-09-25, hallazgo de auditoría externa) —
// lo llama Vercel una vez por semana (vercel.json). El webhook es la única fuente de verdad de
// `suscripciones`, y si alguna vez deja de recibir un aviso (una caída, un cambio de config en
// Hotmart, lo que sea), el estado interno queda desincronizado sin que nadie se entere. Este job
// compara la lista REAL de suscriptores de Hotmart contra `suscripciones` y deja un registro de
// cada diferencia — NO corrige el acceso de nadie solo (ver supabase/reconciliacion-hotmart.sql):
// reparar automáticamente es más riesgoso que dejarlo unos días para que el dueño lo revise.
//
// Seguridad: misma puerta que el resto de los crons — `Authorization: Bearer $CRON_SECRET` en
// tiempo constante. Sin CRON_SECRET, o sin las 3 credenciales de Hotmart, responde 503 y no hace
// nada — nunca falla a medias ni deja un estado inconsistente.

import { NextResponse } from 'next/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { obtenerTodasLasSuscripciones, deberiaTenerAcceso, credencialesHotmartCompletas } from '@/lib/hotmart-api';
import { tieneAccesoCompleto, type Status } from '@/lib/membership-fsm';
import { enviarCorreoDriftDetectado } from '@/lib/email';
import { comparacionSegura } from '@/lib/hotmart-verify';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request): Promise<NextResponse> {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 503 });
  }
  if (!comparacionSegura(request.headers.get('authorization') ?? '', `Bearer ${secreto}`)) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }
  const productId = process.env.HOTMART_PRODUCT_ID;
  if (!credencialesHotmartCompletas() || !productId) {
    return NextResponse.json({ error: 'faltan credenciales de la API de Hotmart o HOTMART_PRODUCT_ID' }, { status: 503 });
  }

  const admin = crearClienteSupabaseAdmin();
  const ahora = new Date();

  let suscripcionesHotmart;
  try {
    suscripcionesHotmart = await obtenerTodasLasSuscripciones(productId);
  } catch (e) {
    console.error('reconciliación hotmart: fallo al leer la API', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'fallo al leer la API de Hotmart' }, { status: 502 });
  }

  const hallazgos: { email: string; estado_hotmart: string; deberia_tener_acceso: boolean; estado_interno: string | null; tiene_acceso_interno: boolean }[] = [];

  for (const s of suscripcionesHotmart) {
    const email = s.subscriber.email;
    if (!email) continue;

    const { data: interno } = await admin
      .from('suscripciones')
      .select('status, access_until, grace_ends_at')
      .eq('email', email)
      .maybeSingle();

    const deberiaHotmart = deberiaTenerAcceso(s.status);
    const tieneInterno = interno
      ? tieneAccesoCompleto(
          interno.status as Status,
          ahora,
          interno.access_until ? new Date(interno.access_until) : null,
          interno.grace_ends_at ? new Date(interno.grace_ends_at) : null
        )
      : false;

    if (deberiaHotmart !== tieneInterno) {
      hallazgos.push({
        email,
        estado_hotmart: s.status,
        deberia_tener_acceso: deberiaHotmart,
        estado_interno: interno?.status ?? null,
        tiene_acceso_interno: tieneInterno,
      });
    }
  }

  if (hallazgos.length > 0) {
    await admin.from('hotmart_drift_log').insert(hallazgos.map((h) => ({ ...h, ejecutado_en: ahora.toISOString() })));
    await enviarCorreoDriftDetectado(hallazgos.length);
  }

  return NextResponse.json({ ok: true, revisados: suscripcionesHotmart.length, diferencias: hallazgos.length });
}
