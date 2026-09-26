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

type ClienteAdmin = ReturnType<typeof crearClienteSupabaseAdmin>;

// Los DOS buckets privados donde la app guarda archivos de una persona (ver lib/datos.ts para
// "comprobantes" y lib/perfil.ts para "perfiles"). Antes esto recorría una lista de subcarpetas
// escrita a mano, y ese patrón falló DOS veces por la misma razón: al agregar "Consultar acuerdo"
// dentro de comprobantes nadie se acordó de sumarla al borrado de cuenta (auditoría 2026-09-11), y
// después el bucket "perfiles" completo —con las fotos de los hijos— quedó fuera por el mismo
// motivo (auditoría externa, 2026-09-25). Recorrer TODO lo que haya bajo la carpeta del usuario,
// recursivamente, en vez de mantener una lista de nombres, cierra esa clase de bug de raíz: ya no
// hay ninguna lista que se pueda olvidar de actualizar.
const BUCKETS_CON_ARCHIVOS_DE_USUARIO = ['comprobantes', 'perfiles'] as const;

// `limit: 1000` porque el tope por defecto de `.list()` es 100. Supabase devuelve las subcarpetas
// como entradas sin `metadata` (a diferencia de los archivos, que sí la traen) — así se distingue
// cuándo hay que bajar un nivel más y cuándo ya se llegó a un archivo real.
async function rutasDeArchivos(admin: ClienteAdmin, bucket: string, carpeta: string): Promise<string[]> {
  const { data } = await admin.storage.from(bucket).list(carpeta, { limit: 1000 });
  const rutas: string[] = [];
  for (const item of data ?? []) {
    const ruta = `${carpeta}/${item.name}`;
    if (item.metadata) {
      rutas.push(ruta);
    } else {
      rutas.push(...(await rutasDeArchivos(admin, bucket, ruta)));
    }
  }
  return rutas;
}

// Borra TODOS los archivos de una persona en los buckets privados (comprobantes + perfiles),
// sin importar en qué subcarpeta estén guardados.
export async function borrarArchivosDelUsuario(admin: ClienteAdmin, userId: string): Promise<void> {
  for (const bucket of BUCKETS_CON_ARCHIVOS_DE_USUARIO) {
    const rutas = await rutasDeArchivos(admin, bucket, userId);
    if (rutas.length > 0) {
      await admin.storage.from(bucket).remove(rutas);
    }
  }
}
