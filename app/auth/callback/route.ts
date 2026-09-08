// Recibe el enlace mágico de Supabase Auth: intercambia el código de un solo uso por
// una sesión real (cookies) y manda al usuario a su expediente. Patrón oficial de
// @supabase/ssr para App Router.

import { NextResponse } from 'next/server';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const destino = searchParams.get('next') ?? '/inicio';

  if (code) {
    const supabase = await crearClienteSupabaseServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${destino}`);
    }
  }

  // Enlace inválido, expirado o ya usado — de vuelta al login con aviso claro.
  return NextResponse.redirect(`${origin}/entrar?error=enlace_invalido`);
}
