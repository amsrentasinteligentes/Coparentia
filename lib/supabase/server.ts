// Cliente de Supabase para SERVER COMPONENTS / SERVER ACTIONS / ROUTE HANDLERS.
// Lee/escribe la sesión desde las cookies de Next.js — patrón oficial de @supabase/ssr
// para App Router. Sigue usando la anon key (nunca la service_role key en código que
// corre en una ruta pública; la service_role solo en tareas de servidor con webhook
// verificado, ej. el webhook de Hotmart en 18-VENTA-HOTMART.md).

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function crearClienteSupabaseServidor() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Se llama desde un Server Component sin permiso de escritura de cookies —
            // es seguro ignorarlo si hay middleware refrescando la sesión (ver middleware.ts).
          }
        },
      },
    }
  );
}
