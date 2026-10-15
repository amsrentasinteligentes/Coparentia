// REGISTRA EL CLIC EN "CONTACTAR" DEL DIRECTORIO (2026-10-14, auditoría de seguridad, punto 4).
// Antes el NAVEGADOR escribía directo en `event_log` con permiso anónimo, así que cualquiera sin
// sesión podía inflar el conteo. Ahora lo escribe el servidor (service_role), que:
//   · toma nombre y categoría del profesional DE LA BASE (no de lo que mande el navegador),
//   · acepta solo profesionales activos que existen,
//   · limita por visitante (huella de IP, nunca la IP en claro): 5 por minuto y 30 por día.
// El evento queda igual que siempre (mismo nombre y mismas propiedades), así que el panel de
// /admin lo sigue contando sin cambios. Un fallo aquí NUNCA bloquea el botón: el enlace se abre igual.

import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';

const EVENTO = 'contacto_profesional_click';
const TOPE_POR_MINUTO = 5;
const TOPE_POR_DIA = 30;
const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Huella del visitante: la IP que pone Vercel (no se puede falsear desde el navegador) mezclada con
// un texto fijo y pasada por SHA-256. Se guarda solo la huella, nunca la IP.
function huellaDelVisitante(request: Request): string {
  const reenviada = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = reenviada || request.headers.get('x-real-ip') || 'sin-ip';
  return createHash('sha256').update(`coparentia-contacto:${ip}`).digest('hex').slice(0, 32);
}

export async function POST(request: Request): Promise<NextResponse> {
  let cuerpo: { profesional_id?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'cuerpo inválido' }, { status: 400 });
  }
  const profesionalId = cuerpo.profesional_id;
  if (typeof profesionalId !== 'string' || !FORMATO_UUID.test(profesionalId)) {
    return NextResponse.json({ error: 'profesional inválido' }, { status: 400 });
  }

  try {
    const admin = crearClienteSupabaseAdmin();
    const visitante = huellaDelVisitante(request);

    const ahora = Date.now();
    const hace = (ms: number): string => new Date(ahora - ms).toISOString();
    const contar = async (desde: string): Promise<number> => {
      const { count } = await admin
        .from('event_log')
        .select('id', { count: 'exact', head: true })
        .eq('nombre', EVENTO)
        .eq('propiedades->>visitante', visitante)
        .gte('created_at', desde);
      return count ?? 0;
    };
    if ((await contar(hace(60 * 1000))) >= TOPE_POR_MINUTO || (await contar(hace(24 * 60 * 60 * 1000))) >= TOPE_POR_DIA) {
      // Sobre el tope: no se cuenta, pero se responde bien — al visitante no se le muestra nada raro.
      return NextResponse.json({ ok: true, contado: false });
    }

    const { data: profesional } = await admin
      .from('profesionales')
      .select('id, nombre, categoria')
      .eq('id', profesionalId)
      .eq('activo', true)
      .maybeSingle();
    if (!profesional) return NextResponse.json({ error: 'profesional no encontrado' }, { status: 404 });

    // Si quien toca el botón tiene sesión, el evento queda a su nombre (igual que antes).
    let userId: string | null = null;
    try {
      const supabase = await crearClienteSupabaseServidor();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
    } catch {
      userId = null;
    }

    const { error } = await admin.from('event_log').insert({
      user_id: userId,
      nombre: EVENTO,
      propiedades: {
        profesional_id: profesional.id,
        nombre: profesional.nombre,
        categoria: profesional.categoria,
        visitante,
      },
    });
    if (error) {
      console.error('contacto-profesional: fallo al guardar', error.message);
      return NextResponse.json({ error: 'no se pudo guardar' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, contado: true });
  } catch (e) {
    console.error('contacto-profesional: error inesperado', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'no se pudo guardar' }, { status: 500 });
  }
}
