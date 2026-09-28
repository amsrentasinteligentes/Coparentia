// GUARDA/BORRA LA SUSCRIPCIÓN DE NOTIFICACIONES PUSH DE ESTE NAVEGADOR (2026-09-28) — la llama
// components/app/NotificacionesPush.tsx cuando la persona activa/desactiva los recordatorios en
// Ajustes. Requiere sesión real (RLS de push_subscriptions ya exige `user_id = auth.uid()`, esto
// solo confirma que hay sesión antes de intentar nada).

import { NextResponse } from 'next/server';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';

interface CuerpoSuscripcion {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function POST(request: Request): Promise<NextResponse> {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }

  let cuerpo: CuerpoSuscripcion;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'cuerpo inválido' }, { status: 400 });
  }
  if (!cuerpo.endpoint || !cuerpo.keys?.p256dh || !cuerpo.keys?.auth) {
    return NextResponse.json({ error: 'faltan campos' }, { status: 400 });
  }

  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: user.id,
      endpoint: cuerpo.endpoint,
      p256dh: cuerpo.keys.p256dh,
      auth: cuerpo.keys.auth,
    },
    { onConflict: 'endpoint' }
  );
  if (error) {
    console.error('push/suscribir: fallo al guardar', error.message);
    return NextResponse.json({ error: 'no se pudo guardar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }

  let cuerpo: { endpoint?: string };
  try {
    cuerpo = await request.json();
  } catch {
    cuerpo = {};
  }
  if (!cuerpo.endpoint) {
    return NextResponse.json({ error: 'falta endpoint' }, { status: 400 });
  }

  // RLS ya limita el borrado a filas propias — el `.eq('user_id', ...)` es defensa en profundidad,
  // no la única barrera.
  const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', cuerpo.endpoint).eq('user_id', user.id);
  if (error) {
    console.error('push/suscribir: fallo al borrar', error.message);
    return NextResponse.json({ error: 'no se pudo borrar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
