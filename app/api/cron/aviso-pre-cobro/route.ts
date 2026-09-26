// AVISO ANTES DEL PRIMER COBRO (2026-09-25, hallazgo de auditoría externa) — lo llama Vercel una
// vez al día (vercel.json). Cumple la promesa activa del onboarding/paywall ("te avisamos por
// correo antes del día 7"): a cada prueba gratis que termina en 1-3 días y todavía no recibió el
// aviso, le manda el correo una sola vez (la columna `aviso_pre_cobro_enviado` evita repetirlo si
// el cron corre más de un día dentro de esa ventana).
//
// Seguridad: misma puerta que el resto de los crons — `Authorization: Bearer $CRON_SECRET` en
// tiempo constante. Sin la variable configurada, responde 503 y no envía nada.

import { NextResponse } from 'next/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { enviarCorreoAvisoPreCobro } from '@/lib/email';
import { comparacionSegura } from '@/lib/hotmart-verify';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const VENTANA_MIN_MS = 1 * 86_400_000; // no molestar si faltan menos de 1 día (ya es tarde para "avisar antes")
const VENTANA_MAX_MS = 3 * 86_400_000; // ventana de 3 días de margen para que un cron diario no se lo salte

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
  const desde = new Date(ahora + VENTANA_MIN_MS).toISOString();
  const hasta = new Date(ahora + VENTANA_MAX_MS).toISOString();

  const { data: pendientes, error } = await admin
    .from('suscripciones')
    .select('email, trial_ends_at')
    .eq('status', 'trialing')
    .eq('aviso_pre_cobro_enviado', false)
    .gte('trial_ends_at', desde)
    .lte('trial_ends_at', hasta);
  if (error) {
    console.error('cron aviso-pre-cobro: no se pudo leer suscripciones', error.message);
    return NextResponse.json({ error: 'fallo al leer suscripciones' }, { status: 500 });
  }

  let enviados = 0;
  for (const s of pendientes ?? []) {
    if (!s.trial_ends_at) continue;
    const { data: perfil } = await admin.from('profiles').select('nombre').eq('email', s.email).maybeSingle();
    await enviarCorreoAvisoPreCobro(s.email, perfil?.nombre ?? undefined, new Date(s.trial_ends_at));
    // Se marca como intentado sin esperar a saber si Resend lo entregó de verdad —
    // `enviarCorreoAvisoPreCobro` atrapa su propio error y nunca lanza (mismo criterio que el
    // resto de los correos de esta app: el estado de la suscripción es lo que de verdad importa,
    // no si este aviso puntual llegó). Evita reintentar de más si Resend sí lo mandó pero algo
    // más tarde en el loop falla.
    await admin.from('suscripciones').update({ aviso_pre_cobro_enviado: true }).eq('email', s.email);
    enviados += 1;
  }

  return NextResponse.json({ ok: true, enviados });
}
