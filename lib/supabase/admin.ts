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

// TODAS las carpetas donde la app guarda archivos de una persona, dentro de su propia carpeta del
// bucket privado. Vive aquí, en un solo sitio, porque el bug que motivó esto fue justamente tener
// la lista escrita a mano en el borrado de cuenta: al agregar "Consultar acuerdo" nadie se acordó
// de sumarla ahí, y el acta de conciliación —el documento más sensible del expediente— seguía en
// el servidor DESPUÉS de que la persona pidió borrar todo (auditoría 2026-09-11).
// ⚠️ Si algún día se agrega otra carpeta en `subirArchivoPrivado` (lib/datos.ts), va aquí también.
export const CARPETAS_DE_ARCHIVOS = ['pagos', 'eventos', 'acuerdo'] as const;

type ClienteAdmin = ReturnType<typeof crearClienteSupabaseAdmin>;

// Borra TODOS los archivos de una persona en el bucket privado. `limit: 1000` porque el tope por
// defecto de `.list()` es 100 — con más comprobantes de los esperados quedarían archivos sin borrar.
//
// Barre TAMBIÉN la raíz de la carpeta del usuario: los comprobantes subidos antes de que
// existieran las subcarpetas quedaron en `{userId}/archivo.jpg`, un nivel más arriba, y se
// habrían salvado del borrado (comprobado sobre los archivos reales, 2026-09-11). En la raíz hay
// que distinguir archivos de subcarpetas: Supabase devuelve las subcarpetas como entradas sin
// `metadata`, y pedir el borrado de una carpeta no hace nada.
export async function borrarArchivosDelUsuario(admin: ClienteAdmin, userId: string): Promise<void> {
  const rutas: string[] = [];

  for (const carpeta of CARPETAS_DE_ARCHIVOS) {
    const { data } = await admin.storage.from('comprobantes').list(`${userId}/${carpeta}`, { limit: 1000 });
    for (const a of data ?? []) rutas.push(`${userId}/${carpeta}/${a.name}`);
  }

  const { data: raiz } = await admin.storage.from('comprobantes').list(userId, { limit: 1000 });
  for (const a of raiz ?? []) {
    if (a.metadata) rutas.push(`${userId}/${a.name}`); // con metadata = es un archivo, no una carpeta
  }

  if (rutas.length > 0) {
    await admin.storage.from('comprobantes').remove(rutas);
  }
}
