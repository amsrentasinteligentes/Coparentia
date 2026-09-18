// PERFIL PERSONALIZABLE + "MI FAMILIA" (2026-09-18) — capa de datos de la pestaña Perfil.
// Guarda en Supabase: columnas propias de `profiles` (nombre, rol, foto, nombre de la otra parte) y
// la tabla `hijos`. Las fotos viven en el bucket privado `perfiles`, en la carpeta del usuario, y se
// muestran con URL firmada temporal (nunca un enlace público). SQL: supabase/perfil-familia.sql.

import { crearClienteSupabase } from '@/lib/supabase/client';
import { comprimirParaLectura } from '@/lib/comprimir-imagen';

export type RolFamiliar = 'papa' | 'mama';

export interface Perfil {
  email: string;
  nombre: string;
  rolFamiliar: RolFamiliar | null;
  avatarPath: string | null;
  otroProgenitorNombre: string;
  creadoEl: string | null;
}

export interface Hijo {
  id: string;
  nombre: string;
  fechaNacimiento: string | null; // ISO yyyy-mm-dd
  avatarPath: string | null;
}

const BUCKET = 'perfiles';

async function usuarioActual() {
  const supabase = crearClienteSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No hay sesión activa.');
  return { supabase, user };
}

export async function obtenerPerfil(): Promise<Perfil> {
  const { supabase, user } = await usuarioActual();
  const { data, error } = await supabase
    .from('profiles')
    .select('nombre, rol_familiar, avatar_path, otro_progenitor_nombre')
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;
  return {
    email: user.email ?? '',
    nombre: data?.nombre ?? '',
    rolFamiliar: (data?.rol_familiar as RolFamiliar | null) ?? null,
    avatarPath: data?.avatar_path ?? null,
    otroProgenitorNombre: data?.otro_progenitor_nombre ?? '',
    creadoEl: user.created_at ?? null,
  };
}

export async function guardarPerfil(cambios: { nombre?: string; rolFamiliar?: RolFamiliar | null; otroProgenitorNombre?: string }): Promise<void> {
  const { supabase, user } = await usuarioActual();
  const fila: Record<string, string | null> = {};
  if (cambios.nombre !== undefined) fila.nombre = cambios.nombre.trim().slice(0, 60) || null;
  if (cambios.rolFamiliar !== undefined) fila.rol_familiar = cambios.rolFamiliar;
  if (cambios.otroProgenitorNombre !== undefined) fila.otro_progenitor_nombre = cambios.otroProgenitorNombre.trim().slice(0, 60) || null;
  const { error } = await supabase.from('profiles').update(fila).eq('id', user.id);
  if (error) throw error;
}

/** Sube una foto (comprimida) a la carpeta del usuario y devuelve su ruta. Reemplaza la anterior. */
async function subirFoto(carpeta: string, archivo: File, anterior: string | null): Promise<string> {
  const { supabase, user } = await usuarioActual();
  const comprimida = await comprimirParaLectura(archivo);
  const ruta = `${user.id}/${carpeta}/${Date.now()}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(ruta, comprimida, { contentType: comprimida.type || 'image/jpeg' });
  if (error) throw error;
  if (anterior && anterior !== ruta) await supabase.storage.from(BUCKET).remove([anterior]);
  return ruta;
}

export async function guardarAvatar(archivo: File, anterior: string | null): Promise<string> {
  const ruta = await subirFoto('avatar', archivo, anterior);
  const { supabase, user } = await usuarioActual();
  const { error } = await supabase.from('profiles').update({ avatar_path: ruta }).eq('id', user.id);
  if (error) throw error;
  return ruta;
}

export async function quitarAvatar(actual: string | null): Promise<void> {
  const { supabase, user } = await usuarioActual();
  const { error } = await supabase.from('profiles').update({ avatar_path: null }).eq('id', user.id);
  if (error) throw error;
  if (actual) await supabase.storage.from(BUCKET).remove([actual]);
}

export async function urlFoto(ruta: string | null): Promise<string | null> {
  if (!ruta) return null;
  const supabase = crearClienteSupabase();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(ruta, 3600);
  if (error || !data) return null;
  return data.signedUrl;
}

export async function obtenerHijos(): Promise<Hijo[]> {
  const { supabase, user } = await usuarioActual();
  const { data, error } = await supabase
    .from('hijos')
    .select('id, nombre, fecha_nacimiento, avatar_path')
    .eq('user_id', user.id)
    .order('fecha_nacimiento', { ascending: true, nullsFirst: false });
  if (error) throw error;
  return (data ?? []).map((h) => ({ id: h.id, nombre: h.nombre, fechaNacimiento: h.fecha_nacimiento, avatarPath: h.avatar_path }));
}

export async function agregarHijo(nombre: string, fechaNacimiento: string | null): Promise<Hijo> {
  const { supabase, user } = await usuarioActual();
  const { data, error } = await supabase
    .from('hijos')
    .insert({ user_id: user.id, nombre: nombre.trim().slice(0, 60), fecha_nacimiento: fechaNacimiento || null })
    .select('id, nombre, fecha_nacimiento, avatar_path')
    .single();
  if (error) throw error;
  return { id: data.id, nombre: data.nombre, fechaNacimiento: data.fecha_nacimiento, avatarPath: data.avatar_path };
}

export async function actualizarHijo(id: string, cambios: { nombre?: string; fechaNacimiento?: string | null }): Promise<void> {
  const { supabase, user } = await usuarioActual();
  const fila: Record<string, string | null> = {};
  if (cambios.nombre !== undefined) fila.nombre = cambios.nombre.trim().slice(0, 60);
  if (cambios.fechaNacimiento !== undefined) fila.fecha_nacimiento = cambios.fechaNacimiento || null;
  const { error } = await supabase.from('hijos').update(fila).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
}

export async function guardarFotoHijo(hijo: Hijo, archivo: File): Promise<string> {
  const ruta = await subirFoto(`hijos/${hijo.id}`, archivo, hijo.avatarPath);
  const { supabase, user } = await usuarioActual();
  const { error } = await supabase.from('hijos').update({ avatar_path: ruta }).eq('id', hijo.id).eq('user_id', user.id);
  if (error) throw error;
  return ruta;
}

export async function eliminarHijo(hijo: Hijo): Promise<void> {
  const { supabase, user } = await usuarioActual();
  const { error } = await supabase.from('hijos').delete().eq('id', hijo.id).eq('user_id', user.id);
  if (error) throw error;
  if (hijo.avatarPath) await supabase.storage.from(BUCKET).remove([hijo.avatarPath]);
}

/** "7 años" a partir de la fecha de nacimiento (en la fecha de Colombia). */
export function edadTexto(fechaNacimiento: string | null): string {
  if (!fechaNacimiento) return '';
  const hoy = new Date();
  const [y, m, d] = fechaNacimiento.split('-').map(Number);
  let edad = hoy.getFullYear() - y;
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) edad -= 1;
  if (edad < 0) return '';
  if (edad === 0) return 'menos de 1 año';
  return `${edad} ${edad === 1 ? 'año' : 'años'}`;
}

/** Nombre corto para el saludo ("Hola, Carlos"): la primera palabra del nombre. */
export function nombreCorto(nombre: string): string {
  return nombre.trim().split(/\s+/)[0] ?? '';
}
