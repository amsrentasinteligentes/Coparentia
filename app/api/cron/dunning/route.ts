// CADENCIA DE RECORDATORIOS DE PAGO FALLIDO (2026-09-25, hallazgo de auditoría externa) — lo
// llama Vercel una vez al día (vercel.json). Antes de esto, un pago fallido mandaba un único
// correo (el que ya dispara el webhook al entrar a `past_due`) y nada más durante los 5 días de
// gracia. Este cron completa la cadencia sobre esos MISMOS 5 días, sin cambiarlos:
//   quedan ~2-3 días de gracia → recordatorio (paso 1)
//   queda ~1 día de gracia      → último aviso (paso 2)
//
// Seguridad: misma puerta que el resto de los crons — `Authorization: Bearer $CRON_SECRET` en
// tiempo constante. Sin la variable configurada, responde 503 y no envía nada.

import { NextResponse } from 'next/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { enviarCorreoRecordatorioPago, enviarCorreoUltimoAvisoPago } from '@/lib/email';
import { comparacionSegura } from '@/lib/hotmart-verify';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const UN_DIA_MS = 86_400_000;
const UMBRAL_ULTIMO_AVISO_MS = 1.5 * UN_DIA_MS; // queda ≤1.5 días de gracia
const UMBRAL_RECORDATORIO_MS = 3.5 * UN_DIA_MS; // queda ≤3.5 días de gracia (y más de 1.5)

export async function GET(request: Request): Promise<NextResponse> {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 503 });
  }
  if (!comparacionSegura(request.headers.get('authorization') ?? '', `Bearer ${secreto}`)) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }

  const admin = crearClienteSupabaseAdmin();
  const ahora = Date.now();

  const { data: pendientes, error } = await admin
    .from('suscripciones')
    .select('email, grace_ends_at, aviso_dunning_paso')
    .eq('status', 'past_due')
    .lt('aviso_dunning_paso', 2)
    .not('grace_ends_at', 'is', null);
  if (error) {
    console.error('cron dunning: no se pudo leer suscripciones', error.message);
    return NextResponse.json({ error: 'fallo al leer suscripciones' }, { status: 500 });
  }

  let recordatorios = 0;
  let ultimosAvisos = 0;
  for (const s of pendientes ?? []) {
    if (!s.grace_ends_at) continue;
    const graceEndsAt = new Date(s.grace_ends_at);
    const faltan = graceEndsAt.getTime() - ahora;
    if (faltan <= 0) continue; // ya se acabó la gracia — el próximo evento de Hotmart lo resuelve, no un correo tardío

    if (faltan <= UMBRAL_ULTIMO_AVISO_MS && s.aviso_dunning_paso < 2) {
      await enviarCorreoUltimoAvisoPago(s.email, graceEndsAt);
      await admin.from('suscripciones').update({ aviso_dunning_paso: 2 }).eq('email', s.email);
      ultimosAvisos += 1;
    } else if (faltan <= UMBRAL_RECORDATORIO_MS && s.aviso_dunning_paso < 1) {
      await enviarCorreoRecordatorioPago(s.email, graceEndsAt);
      await admin.from('suscripciones').update({ aviso_dunning_paso: 1 }).eq('email', s.email);
      recordatorios += 1;
    }
  }

  return NextResponse.json({ ok: true, recordatorios, ultimosAvisos });
}
