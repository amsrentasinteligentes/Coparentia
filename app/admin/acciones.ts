'use server';

// ACCIONES DEL PANEL DE ADMINISTRACIÓN — Server Actions. Una Server Action se invoca por su
// propia ruta y NO vuelve a pasar por el render de app/admin/layout.tsx, así que cada acción
// revisa el permiso de dueño DE NUEVO aquí mismo (defensa en profundidad — 09-SEGURIDAD.md: la
// autorización se verifica en cada punto de entrada al servidor, no solo una vez en la pantalla).

import { revalidatePath } from 'next/cache';
import { usuarioAdminActual } from '@/lib/admin-datos';
import { crearClienteSupabaseAdmin, borrarArchivosDelUsuario } from '@/lib/supabase/admin';

interface ResultadoAccion {
  ok: boolean;
  mensaje: string;
}

// Alta manual: crea la cuenta real (auth.users) con el correo ya confirmado — la persona entra
// después por su cuenta con el enlace mágico de siempre en /entrar, sin contraseña que gestionar.
// Sirve para el caso que pidió el dueño: alguien a quien no le llegó el acceso, o una cuenta que
// el dueño quiere abrir de una vez sin pasar por Hotmart.
export async function agregarUsuarioManual(nombre: string, email: string): Promise<ResultadoAccion> {
  const { esAdmin, email: emailAdmin } = await usuarioAdminActual();
  if (!esAdmin) {
    return { ok: false, mensaje: 'No tienes permiso para hacer esto.' };
  }

  const nombreLimpio = nombre.trim();
  const emailLimpio = email.trim().toLowerCase();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio);
  if (!nombreLimpio || !emailValido) {
    return { ok: false, mensaje: 'Revisa el nombre y el correo — alguno no es válido.' };
  }

  const admin = crearClienteSupabaseAdmin();

  const { data, error } = await admin.auth.admin.createUser({
    email: emailLimpio,
    email_confirm: true, // ya queda confirmado: no hace falta que "acepte" un correo aparte
    user_metadata: { nombre: nombreLimpio },
  });

  if (error) {
    const yaExiste = error.message.toLowerCase().includes('already been registered') || error.status === 422;
    return {
      ok: false,
      mensaje: yaExiste
        ? `Ya existe una cuenta con ${emailLimpio} — no hace falta crearla de nuevo.`
        : 'No se pudo crear la cuenta. Intenta de nuevo en un momento.',
    };
  }

  const nuevoUserId = data.user.id;

  // El trigger de la base ya creó la fila en profiles (mismo camino que un registro normal) —
  // aquí solo se marca que este alta fue MANUAL y se deja el rastro de quién la hizo y cuándo.
  await admin
    .from('profiles')
    .update({ creado_manualmente: true, nombre: nombreLimpio })
    .eq('id', nuevoUserId);

  await admin.from('event_log').insert({
    user_id: nuevoUserId,
    nombre: 'usuario_agregado_manualmente',
    propiedades: { email: emailLimpio, nombre: nombreLimpio, agregado_por: emailAdmin },
  });

  revalidatePath('/admin');
  return { ok: true, mensaje: `Cuenta creada para ${nombreLimpio}. Ya puede entrar con su correo en la pantalla de siempre.` };
}

// Deshacer una alta manual — encontrado por el revisor-visual (ronda 4): sin esto, un correo
// mal escrito en el formulario de arriba queda pegado para siempre. Solo alcanza a cuentas
// creadas A MANO desde este mismo panel (creado_manualmente = true) — nunca a alguien que se
// registró por su cuenta o entró por Hotmart, para no convertir esto en un borrado general de
// usuarios sin más salvaguardas.
export async function quitarUsuarioManual(userId: string): Promise<ResultadoAccion> {
  const { esAdmin } = await usuarioAdminActual();
  if (!esAdmin) {
    return { ok: false, mensaje: 'No tienes permiso para hacer esto.' };
  }

  const admin = crearClienteSupabaseAdmin();

  const { data: perfil } = await admin.from('profiles').select('creado_manualmente').eq('id', userId).maybeSingle();
  if (!perfil?.creado_manualmente) {
    return { ok: false, mensaje: 'Esta cuenta no se agregó a mano desde aquí — no se puede quitar desde este botón.' };
  }

  // Los archivos de Storage no están ligados al `on delete cascade` de la cuenta: sin este paso
  // quedaban huérfanos en el bucket para siempre, invisibles y sin fila que los referenciara
  // (auditoría 2026-09-11). Va ANTES del borrado: si fallara después, ya no habría forma de saber
  // de quién eran.
  await borrarArchivosDelUsuario(admin, userId);

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    return { ok: false, mensaje: 'No se pudo quitar la cuenta. Intenta de nuevo en un momento.' };
  }

  revalidatePath('/admin');
  return { ok: true, mensaje: 'Cuenta quitada.' };
}
