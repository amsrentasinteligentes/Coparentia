'use server';

// ACCIONES DEL DIRECTORIO DE PROFESIONALES — Server Actions. Cada una revisa el permiso de
// dueño DE NUEVO aquí mismo (defensa en profundidad — 09-SEGURIDAD.md), y además la propia
// tabla tiene RLS (supabase/profesionales.sql) que rechaza el insert/update/delete si quien
// llama no es admin, aunque alguien se saltara esta capa.

import { revalidatePath } from 'next/cache';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { usuarioAdminActual } from '@/lib/admin-datos';
import type { CategoriaProfesional } from '@/lib/profesionales';

interface ResultadoAccion {
  ok: boolean;
  mensaje: string;
}

const CATEGORIAS_VALIDAS: CategoriaProfesional[] = ['abogado', 'psicologo', 'trabajador_social'];

interface DatosProfesional {
  categoria: string;
  nombre: string;
  especialidad: string;
  ciudad: string;
  contactoUrl: string;
}

function validar(d: DatosProfesional): string | null {
  if (!CATEGORIAS_VALIDAS.includes(d.categoria as CategoriaProfesional)) return 'Elige una categoría válida.';
  if (!d.nombre.trim()) return 'Falta el nombre.';
  if (!d.especialidad.trim()) return 'Falta la especialidad.';
  if (!d.contactoUrl.trim()) return 'Falta a dónde escriben los interesados (WhatsApp o correo).';
  return null;
}

// De lo que escribe el dueño ("+573001234567" o "correo@x.com") a la URL real que necesita el
// botón "Contactar" — así el formulario no le pide entender qué es un wa.me o un mailto.
function normalizarContacto(valor: string): string {
  const limpio = valor.trim();
  if (limpio.startsWith('http://') || limpio.startsWith('https://') || limpio.startsWith('mailto:') || limpio.startsWith('tel:')) {
    return limpio;
  }
  if (limpio.includes('@')) return `mailto:${limpio}`;
  const soloNumeros = limpio.replace(/[^\d]/g, '');
  return `https://wa.me/${soloNumeros}`;
}

async function subirFotoSiViene(supabase: Awaited<ReturnType<typeof crearClienteSupabaseServidor>>, foto: File | null): Promise<{ url?: string; error?: string }> {
  if (!foto || typeof foto === 'string' || foto.size === 0) return {};
  if (!foto.type.startsWith('image/')) return { error: 'La foto debe ser una imagen.' };
  if (foto.size > 5 * 1024 * 1024) return { error: 'La foto pesa demasiado (máximo 5 MB).' };

  const extension = foto.type === 'image/png' ? 'png' : foto.type === 'image/webp' ? 'webp' : 'jpg';
  const ruta = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('profesionales').upload(ruta, foto, { contentType: foto.type });
  if (error) return { error: 'No se pudo subir la foto. Intenta de nuevo.' };

  const { data } = supabase.storage.from('profesionales').getPublicUrl(ruta);
  return { url: data.publicUrl };
}

export async function crearProfesional(formData: FormData): Promise<ResultadoAccion> {
  // Red de seguridad: cualquier excepción no prevista aquí adentro rompía TODA la página con un
  // error 500 genérico (hallazgo real, 2026-09-28 — el usuario probó agregar un profesional de
  // prueba y le salió "This page couldn't load"). Ahora, pase lo que pase, esta acción devuelve
  // un mensaje que el formulario puede mostrar, nunca tumba la pantalla completa.
  try {
    const { esAdmin } = await usuarioAdminActual();
    if (!esAdmin) return { ok: false, mensaje: 'No tienes permiso para hacer esto.' };

    const datos: DatosProfesional = {
      categoria: String(formData.get('categoria') ?? ''),
      nombre: String(formData.get('nombre') ?? ''),
      especialidad: String(formData.get('especialidad') ?? ''),
      ciudad: String(formData.get('ciudad') ?? ''),
      contactoUrl: String(formData.get('contacto') ?? ''),
    };
    const errorValidacion = validar(datos);
    if (errorValidacion) return { ok: false, mensaje: errorValidacion };

    const supabase = await crearClienteSupabaseServidor();
    const { url: fotoUrl, error: errorFoto } = await subirFotoSiViene(supabase, formData.get('foto') as unknown as File | null);
    if (errorFoto) return { ok: false, mensaje: errorFoto };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('profesionales').insert({
      categoria: datos.categoria,
      nombre: datos.nombre.trim(),
      especialidad: datos.especialidad.trim(),
      ciudad: datos.ciudad.trim() || null,
      contacto_url: normalizarContacto(datos.contactoUrl),
      foto_url: fotoUrl ?? null,
      creado_por: user?.id ?? null,
    });
    if (error) return { ok: false, mensaje: `No se pudo guardar: ${error.message}` };

    revalidatePath('/admin/profesionales');
    return { ok: true, mensaje: `${datos.nombre.trim()} ya aparece en el directorio.` };
  } catch (e) {
    return { ok: false, mensaje: `Ocurrió un error inesperado: ${e instanceof Error ? e.message : String(e)}` };
  }
}

export async function actualizarProfesional(id: string, formData: FormData): Promise<ResultadoAccion> {
  try {
    const { esAdmin } = await usuarioAdminActual();
    if (!esAdmin) return { ok: false, mensaje: 'No tienes permiso para hacer esto.' };

    const datos: DatosProfesional = {
      categoria: String(formData.get('categoria') ?? ''),
      nombre: String(formData.get('nombre') ?? ''),
      especialidad: String(formData.get('especialidad') ?? ''),
      ciudad: String(formData.get('ciudad') ?? ''),
      contactoUrl: String(formData.get('contacto') ?? ''),
    };
    const errorValidacion = validar(datos);
    if (errorValidacion) return { ok: false, mensaje: errorValidacion };

    const supabase = await crearClienteSupabaseServidor();
    const { url: fotoUrl, error: errorFoto } = await subirFotoSiViene(supabase, formData.get('foto') as unknown as File | null);
    if (errorFoto) return { ok: false, mensaje: errorFoto };

    const cambios: Record<string, unknown> = {
      categoria: datos.categoria,
      nombre: datos.nombre.trim(),
      especialidad: datos.especialidad.trim(),
      ciudad: datos.ciudad.trim() || null,
      contacto_url: normalizarContacto(datos.contactoUrl),
    };
    if (fotoUrl) cambios.foto_url = fotoUrl; // solo se pisa la foto si subieron una nueva

    const { error } = await supabase.from('profesionales').update(cambios).eq('id', id);
    if (error) return { ok: false, mensaje: `No se pudo guardar el cambio: ${error.message}` };

    revalidatePath('/admin/profesionales');
    return { ok: true, mensaje: 'Cambios guardados.' };
  } catch (e) {
    return { ok: false, mensaje: `Ocurrió un error inesperado: ${e instanceof Error ? e.message : String(e)}` };
  }
}

// Pausar/reactivar en vez de un único botón "activo": permite reactivar sin volver a llenar el
// formulario — pedido implícito de cualquier catálogo de anuncios (alguien deja de pagar por
// una temporada y vuelve después).
export async function pausarProfesional(id: string, activo: boolean): Promise<ResultadoAccion> {
  try {
    const { esAdmin } = await usuarioAdminActual();
    if (!esAdmin) return { ok: false, mensaje: 'No tienes permiso para hacer esto.' };

    const supabase = await crearClienteSupabaseServidor();
    const { error } = await supabase.from('profesionales').update({ activo }).eq('id', id);
    if (error) return { ok: false, mensaje: `No se pudo guardar el cambio: ${error.message}` };

    revalidatePath('/admin/profesionales');
    return { ok: true, mensaje: activo ? 'Reactivado.' : 'Pausado — ya no aparece en la app ni en la página de ventas.' };
  } catch (e) {
    return { ok: false, mensaje: `Ocurrió un error inesperado: ${e instanceof Error ? e.message : String(e)}` };
  }
}

export async function eliminarProfesional(id: string): Promise<ResultadoAccion> {
  try {
    const { esAdmin } = await usuarioAdminActual();
    if (!esAdmin) return { ok: false, mensaje: 'No tienes permiso para hacer esto.' };

    const supabase = await crearClienteSupabaseServidor();
    const { error } = await supabase.from('profesionales').delete().eq('id', id);
    if (error) return { ok: false, mensaje: `No se pudo quitar: ${error.message}` };

    revalidatePath('/admin/profesionales');
    return { ok: true, mensaje: 'Profesional quitado.' };
  } catch (e) {
    return { ok: false, mensaje: `Ocurrió un error inesperado: ${e instanceof Error ? e.message : String(e)}` };
  }
}
