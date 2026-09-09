// Recibe el enlace mágico de Supabase Auth: intercambia el código de un solo uso por
// una sesión real (cookies) y manda al usuario a su expediente. Patrón oficial de
// @supabase/ssr para App Router.

import { NextResponse } from 'next/server';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';

// Un `next` sin validar es un open-redirect clásico: "/@evil.com" o "//evil.com" concatenado
// con el origen puede terminar navegando a otro dominio (el navegador lee "@" como el separador
// de userinfo de una URL). Solo se acepta una ruta interna real: empieza con "/" simple, nunca
// con "//" (protocolo-relativo) ni contiene "://" o "@" (hallazgo de la auditoría de seguridad,
// 27-REVISION-SEGURIDAD.md — A01/Insecure Design).
function rutaInternaSegura(valor: string | null): string {
  if (!valor || !valor.startsWith('/') || valor.startsWith('//') || valor.includes('://') || valor.includes('@')) {
    return '/inicio';
  }
  return valor;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const destino = rutaInternaSegura(searchParams.get('next'));

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
