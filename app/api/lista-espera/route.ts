// GUARDA EL CORREO Y EL PAÍS DE QUIEN PIDE QUE COPARENTIA LLEGUE A SU PAÍS (2026-10-21, decisión #8: por ahora solo
// Colombia). La persona no tiene cuenta, así que no hay sesión: por eso esto pasa por el servidor (service_role) y la
// tabla `lista_espera_paises` no tiene ninguna política para el navegador. Valida el correo y el país (lista cerrada),
// exige la autorización expresa y limita el abuso: el mismo correo y país no se vuelve a guardar dentro de la misma
// hora. Un fallo aquí NO afecta nada más de la página (no toca pagos ni cuentas).

import { NextResponse } from 'next/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PAISES = ['México', 'Chile', 'Argentina', 'Ecuador', 'Perú', 'Otro'] as const;

export async function POST(request: Request): Promise<NextResponse> {
  let cuerpo: { email?: unknown; pais?: unknown; paisOtro?: unknown; autoriza?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'cuerpo inválido' }, { status: 400 });
  }

  const email = typeof cuerpo.email === 'string' ? cuerpo.email.trim().toLowerCase() : '';
  if (email.length < 5 || email.length > 254 || !FORMATO_CORREO.test(email)) {
    return NextResponse.json({ error: 'correo inválido' }, { status: 400 });
  }
  const pais = PAISES.find((p) => p === cuerpo.pais);
  if (!pais) {
    return NextResponse.json({ error: 'país inválido' }, { status: 400 });
  }
  let paisOtro: string | null = null;
  if (pais === 'Otro') {
    const texto = typeof cuerpo.paisOtro === 'string' ? cuerpo.paisOtro.trim() : '';
    if (texto.length < 2 || texto.length > 60) {
      return NextResponse.json({ error: 'país inválido' }, { status: 400 });
    }
    paisOtro = texto;
  }
  // Sin autorización expresa de tratamiento de datos no se guarda nada.
  if (cuerpo.autoriza !== true) {
    return NextResponse.json({ error: 'falta autorización' }, { status: 400 });
  }

  try {
    const admin = crearClienteSupabaseAdmin();
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: reciente } = await admin
      .from('lista_espera_paises')
      .select('id')
      .eq('email', email)
      .eq('pais', pais)
      .gte('created_at', haceUnaHora)
      .limit(1);
    if (reciente && reciente.length > 0) return NextResponse.json({ ok: true });

    const { error } = await admin.from('lista_espera_paises').insert({ email, pais, pais_otro: paisOtro, autoriza: true });
    if (error) {
      console.error('lista-espera: fallo al guardar', error.message);
      return NextResponse.json({ error: 'no se pudo guardar' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('lista-espera: error inesperado', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'no se pudo guardar' }, { status: 500 });
  }
}
