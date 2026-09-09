// Cliente de Supabase con la service_role key — SOLO se importa desde código de SERVIDOR
// (Server Actions / Route Handlers dentro de app/admin/). Nunca desde un componente de cliente:
// esta clave se salta toda la seguridad de Supabase (09-SEGURIDAD.md). Se usa exclusivamente
// para la ÚNICA operación que la anon key no puede hacer: crear una cuenta de usuario a mano
// (alta manual del dueño) — todo lo demás del panel lee con el cliente normal + RLS.

import { createClient } from '@supabase/supabase-js';

export function crearClienteSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      'Falta SUPABASE_SERVICE_ROLE_KEY en el servidor — sin ella no se pueden crear cuentas a mano.'
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
