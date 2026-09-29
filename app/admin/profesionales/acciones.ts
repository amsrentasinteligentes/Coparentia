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

// El PREFIJO FIJADO más chico posible: recorre la lista buscando desde dónde el resto ya queda
// alfabético por sí solo — todo lo que esté ANTES de ese punto necesita un `orden` explícito;
// todo lo que esté DESPUÉS se deja en null para que siempre sea alfabético, sin importar quién se
// agregue más adelante (2026-09-29, pedido del usuario: "que Ivonne quede SIEMPRE de primera y el
// resto por orden alfabético" — con un `orden` fijo para todos, un profesional nuevo con nombre
// que alfabéticamente vaya antes rompería eso; con esto, solo Ivonne queda con `orden`, el resto
// null, así que cualquier nombre nuevo siempre se ordena bien entre ellos).
function calcularPrefijoFijado<T extends { id: string; nombre: string }>(lista: T[]): number {
  for (let k = 0; k <= lista.length; k++) {
    const sufijo = lista.slice(k);
    const sufijoAlfabetico = [...sufijo].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    if (sufijo.every((p, idx) => p.id === sufijoAlfabetico[idx].id)) return k;
  }
  return lista.length;
}

async function guardarOrden(
  supabase: Awaited<ReturnType<typeof crearClienteSupabaseServidor>>,
  lista: { id: string; nombre: string }[]
): Promise<string | null> {
  const k = calcularPrefijoFijado(lista);
  const resultados = await Promise.all(
    lista.map((p, indice) => supabase.from('profesionales').update({ orden: indice < k ? indice : null }).eq('id', p.id))
  );
  return resultados.find((r) => r.error)?.error?.message ?? null;
}

// Sube/baja a un profesional un puesto (pedido del usuario, 2026-09-29: "poder ubicarlos en el
// orden que yo desee").
export async function moverProfesional(id: string, direccion: 'arriba' | 'abajo'): Promise<ResultadoAccion> {
  try {
    const { esAdmin } = await usuarioAdminActual();
    if (!esAdmin) return { ok: false, mensaje: 'No tienes permiso para hacer esto.' };

    const supabase = await crearClienteSupabaseServidor();
    const { data, error } = await supabase
      .from('profesionales')
      .select('id, nombre')
      .order('orden', { ascending: true, nullsFirst: false })
      .order('nombre', { ascending: true });
    if (error) return { ok: false, mensaje: `No se pudo leer el orden actual: ${error.message}` };

    const lista = data ?? [];
    const i = lista.findIndex((p) => p.id === id);
    if (i === -1) return { ok: false, mensaje: 'No se encontró ese profesional.' };
    const j = direccion === 'arriba' ? i - 1 : i + 1;
    if (j < 0 || j >= lista.length) return { ok: true, mensaje: 'Ya está en esa posición.' };

    [lista[i], lista[j]] = [lista[j], lista[i]];

    const errorGuardado = await guardarOrden(supabase, lista);
    if (errorGuardado) return { ok: false, mensaje: `No se pudo guardar el nuevo orden: ${errorGuardado}` };

    revalidatePath('/admin/profesionales');
    return { ok: true, mensaje: 'Orden actualizado.' };
  } catch (e) {
    return { ok: false, mensaje: `Ocurrió un error inesperado: ${e instanceof Error ? e.message : String(e)}` };
  }
}

// "Que este quede SIEMPRE primero y el resto por orden alfabético" (pedido del usuario,
// 2026-09-29) — un solo botón, sin tener que entender qué es `orden`. Deja a este con posición
// fija y a TODOS los demás en null (alfabético), aunque antes tuvieran un orden manual propio.
export async function fijarPrimero(id: string): Promise<ResultadoAccion> {
  try {
    const { esAdmin } = await usuarioAdminActual();
    if (!esAdmin) return { ok: false, mensaje: 'No tienes permiso para hacer esto.' };

    const supabase = await crearClienteSupabaseServidor();
    const [{ error: error1 }, { error: error2 }] = await Promise.all([
      supabase.from('profesionales').update({ orden: 0 }).eq('id', id),
      supabase.from('profesionales').update({ orden: null }).neq('id', id),
    ]);
    const error = error1 ?? error2;
    if (error) return { ok: false, mensaje: `No se pudo fijar: ${error.message}` };

    revalidatePath('/admin/profesionales');
    return { ok: true, mensaje: 'Listo — queda siempre primero, el resto en orden alfabético.' };
  } catch (e) {
    return { ok: false, mensaje: `Ocurrió un error inesperado: ${e instanceof Error ? e.message : String(e)}` };
  }
}

// Deshace `fijarPrimero` — vuelve TODO el directorio a orden alfabético puro.
export async function reordenarAlfabeticamente(): Promise<ResultadoAccion> {
  try {
    const { esAdmin } = await usuarioAdminActual();
    if (!esAdmin) return { ok: false, mensaje: 'No tienes permiso para hacer esto.' };

    const supabase = await crearClienteSupabaseServidor();
    const { error } = await supabase.from('profesionales').update({ orden: null }).not('id', 'is', null);
    if (error) return { ok: false, mensaje: `No se pudo reordenar: ${error.message}` };

    revalidatePath('/admin/profesionales');
    return { ok: true, mensaje: 'Directorio ordenado alfabéticamente.' };
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
