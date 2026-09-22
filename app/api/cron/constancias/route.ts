// ENVÍO MENSUAL DE CONSTANCIAS (2026-09-22) — lo llama Vercel una vez al día (vercel.json).
// Solo hace trabajo el día 1 de cada mes en Colombia: envía a cada usuario que lo activó el
// resumen del MES ANTERIOR, una sola vez (índice único por usuario+período en la base).
//
// Seguridad: la ruta exige `Authorization: Bearer $CRON_SECRET`. Sin esa variable configurada,
// responde 503 y no envía nada — nunca queda abierta a internet.

import { NextResponse } from 'next/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { enviarConstanciasDelPeriodo, mesAnteriorEnColombia } from '@/lib/constancias';
import { hoyEnColombia } from '@/lib/fecha';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request): Promise<NextResponse> {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 503 });
  }
  if (request.headers.get('authorization') !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }

  const hoy = hoyEnColombia();
  const forzar = new URL(request.url).searchParams.get('forzar') === '1';
  if (!hoy.endsWith('-01') && !forzar) {
    return NextResponse.json({ ok: true, omitido: 'solo corre el día 1 de cada mes', hoy });
  }

  const periodo = mesAnteriorEnColombia(hoy);
  const admin = crearClienteSupabaseAdmin();

  const { data: usuarios, error } = await admin
    .from('profiles')
    .select('id, email, nombre, otro_progenitor_nombre, otro_progenitor_email')
    .eq('constancias_mensuales', true)
    .not('otro_progenitor_email', 'is', null);
  if (error) {
    console.error('cron constancias: no se pudo leer los perfiles', error.message);
    return NextResponse.json({ error: 'fallo al leer perfiles' }, { status: 500 });
  }

  let enviadas = 0;
  let omitidas = 0;
  for (const u of usuarios ?? []) {
    const destinatario = u.otro_progenitor_email?.trim();
    if (!destinatario) continue;
    // Ya enviadas este período (el índice único lo impide igual, pero así no se gastan correos).
    const { data: previas } = await admin
      .from('constancias')
      .select('id')
      .eq('user_id', u.id)
      .eq('periodo', periodo)
      .eq('origen', 'mensual')
      .limit(1);
    if ((previas ?? []).length > 0) {
      omitidas += 1;
      continue;
    }
    // Un correo por cada hijo (y uno general si ninguno tiene movimientos propios).
    const r = await enviarConstanciasDelPeriodo(admin, u.id, destinatario, periodo, 'mensual', u.nombre ?? '', u.otro_progenitor_nombre ?? '', u.email ?? '');
    if (r.sinNada || r.enviadas === 0) {
      omitidas += 1;
      continue;
    }
    enviadas += r.enviadas;
  }

  return NextResponse.json({ ok: true, periodo, enviadas, omitidas });
}
