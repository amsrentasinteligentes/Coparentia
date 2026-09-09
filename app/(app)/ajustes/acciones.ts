'use server';

// Eliminar cuenta — derecho de eliminación real, no solo una promesa en la Política de
// Privacidad (47-LEGAL-FISCAL-Y-PRIVACIDAD.md). Borra también los archivos de Storage: sin esto,
// las fotos de comprobantes quedarían huérfanas pero seguirían existiendo, lo que no cumple con
// "eliminar TODOS los datos" del usuario.

import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';

interface ResultadoAccion {
  ok: boolean;
  mensaje: string;
}

export async function eliminarMiCuenta(): Promise<ResultadoAccion> {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, mensaje: 'No hay sesión activa.' };
  }

  const admin = crearClienteSupabaseAdmin();

  // Borra los archivos reales del usuario en el bucket privado (fotos/PDF de comprobantes y
  // documentos adjuntos) — las filas de titulos/pagos/autorizaciones/eventos/profiles se borran
  // solas por `on delete cascade` al borrar la cuenta de auth, pero los archivos de Storage no
  // están ligados a esa cascada y quedarían huérfanos sin este paso.
  for (const carpeta of ['pagos', 'eventos']) {
    const { data: archivos } = await admin.storage.from('comprobantes').list(`${user.id}/${carpeta}`);
    if (archivos && archivos.length > 0) {
      const rutas = archivos.map((a) => `${user.id}/${carpeta}/${a.name}`);
      await admin.storage.from('comprobantes').remove(rutas);
    }
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return { ok: false, mensaje: 'No se pudo eliminar tu cuenta. Intenta de nuevo o escríbenos a soporte@coparentia.app.' };
  }

  return { ok: true, mensaje: 'Tu cuenta y todos tus datos fueron eliminados.' };
}
