'use server';

// Eliminar cuenta — derecho de eliminación real, no solo una promesa en la Política de
// Privacidad (47-LEGAL-FISCAL-Y-PRIVACIDAD.md). Borra también los archivos de Storage: sin esto,
// las fotos de comprobantes quedarían huérfanas pero seguirían existiendo, lo que no cumple con
// "eliminar TODOS los datos" del usuario.

import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { crearClienteSupabaseAdmin, borrarArchivosDelUsuario } from '@/lib/supabase/admin';

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

  // Red de seguridad: esta pantalla la ve CUALQUIER usuario con sesión, incluido el dueño de la
  // app (no hay una pantalla separada para "usuarios normales" vs "el dueño"). Sin este freno,
  // el dueño podría borrarse a sí mismo por error y perder el único acceso al panel de
  // administración — un error real, no solo teórico, y mucho más costoso de deshacer que
  // cualquier otro borrado (hallazgo real, revisión de seguridad previa a publicar).
  const { data: perfil } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (perfil?.role === 'admin') {
    return {
      ok: false,
      mensaje: 'Esta es tu cuenta de administrador — no se puede eliminar desde aquí. Escríbenos si de verdad quieres cerrarla.',
    };
  }

  // Borra los archivos reales del usuario en el bucket privado (comprobantes, documentos de
  // eventos y el acuerdo) — las filas de titulos/pagos/autorizaciones/eventos/profiles se borran
  // solas por `on delete cascade` al borrar la cuenta de auth, pero los archivos de Storage no
  // están ligados a esa cascada y quedarían huérfanos sin este paso. La lista de carpetas vive en
  // un solo lugar (lib/supabase/admin.ts): tenerla escrita a mano aquí fue exactamente lo que dejó
  // el acuerdo sin borrar cuando se agregó esa carpeta (auditoría 2026-09-11).
  await borrarArchivosDelUsuario(admin, user.id);

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return { ok: false, mensaje: 'No se pudo eliminar tu cuenta. Intenta de nuevo o escríbenos a soporte@coparentia.app.' };
  }

  return { ok: true, mensaje: 'Tu cuenta y todos tus datos fueron eliminados.' };
}
