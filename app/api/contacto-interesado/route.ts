// GUARDA EL CORREO DE QUIEN LLEGA AL PASO DE PRECIO DEL PAYWALL (2026-10-09, auditoría externa,
// hallazgo 2). La persona todavía no tiene cuenta, así que no hay sesión: por eso esto pasa por el
// servidor (service_role) y la tabla `contactos_interesados` no tiene ninguna política para el
// navegador. Valida el correo y limita el abuso: el mismo correo y plan no se vuelve a guardar
// dentro de la misma hora. Un fallo aquí NUNCA debe impedir pagar — el paywall sigue igual.

import { NextResponse } from 'next/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request): Promise<NextResponse> {
  let cuerpo: { email?: unknown; plan?: unknown; autoriza?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'cuerpo inválido' }, { status: 400 });
  }

  const email = typeof cuerpo.email === 'string' ? cuerpo.email.trim().toLowerCase() : '';
  const plan = cuerpo.plan;
  if (email.length < 5 || email.length > 254 || !FORMATO_CORREO.test(email)) {
    return NextResponse.json({ error: 'correo inválido' }, { status: 400 });
  }
  if (plan !== 'anual' && plan !== 'mensual') {
    return NextResponse.json({ error: 'plan inválido' }, { status: 400 });
  }
  // Sin autorización expresa de tratamiento de datos no se guarda nada.
  if (cuerpo.autoriza !== true) {
    return NextResponse.json({ error: 'falta autorización' }, { status: 400 });
  }

  try {
    const admin = crearClienteSupabaseAdmin();
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: reciente } = await admin
      .from('contactos_interesados')
      .select('id')
      .eq('email', email)
      .eq('plan', plan)
      .gte('created_at', haceUnaHora)
      .limit(1);
    if (reciente && reciente.length > 0) return NextResponse.json({ ok: true });

    const { error } = await admin.from('contactos_interesados').insert({ email, plan, autoriza: true });
    if (error) {
      console.error('contacto-interesado: fallo al guardar', error.message);
      return NextResponse.json({ error: 'no se pudo guardar' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('contacto-interesado: error inesperado', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'no se pudo guardar' }, { status: 500 });
  }
}
