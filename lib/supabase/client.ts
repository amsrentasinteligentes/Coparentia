// Cliente de Supabase para COMPONENTES DE CLIENTE ('use client'). Usa la anon key
// (pública por diseño, protegida por RLS — nunca la service_role key aquí).
// Sesión 6: conecta la base de datos real. Requiere NEXT_PUBLIC_SUPABASE_URL y
// NEXT_PUBLIC_SUPABASE_ANON_KEY configuradas en el entorno (Vercel + .env.local).

import { createBrowserClient } from '@supabase/ssr';

export function crearClienteSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
