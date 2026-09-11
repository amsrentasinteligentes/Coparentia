// CAPA DE DATOS DEL PANEL DE ADMINISTRACIÓN — solo lectura, solo server-side (Server Components
// dentro de app/admin/). Cada función que devuelve un número lo saca de una tabla real; ninguna
// inventa cifras. Las secciones que hoy no tienen fuente real (ventas, ganancia, IA, errores)
// no tienen función aquí — el componente las marca "Sin datos" directamente (21-BACKOFFICE.md:
// "si un dato no existe todavía, se marca como tal, nunca se inventa").

import type { SupabaseClient } from '@supabase/supabase-js';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { fechaEnColombia, hoyEnColombia, inicioDelDiaColombiaUTC, inicioDelMesColombiaUTC } from '@/lib/fecha';

export interface PerfilAdmin {
  id: string;
  email: string;
  nombre: string | null;
  role: 'user' | 'admin';
  source: string | null;
  creadoManualmente: boolean;
  createdAt: string;
}

// Verifica en el SERVIDOR si quien pide la pantalla es el dueño — la RLS de `profiles`/`event_log`
// (supabase/admin.sql) refuerza esto igual del lado de la base de datos si algo se escapara aquí;
// esto es la primera barrera, no la única (09-SEGURIDAD.md).
export async function usuarioAdminActual(): Promise<{ esAdmin: boolean; email: string | null }> {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { esAdmin: false, email: null };

  const { data: perfil } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  return { esAdmin: perfil?.role === 'admin', email: user.email ?? null };
}

export interface ResumenUsuarios {
  total: number;
  nuevos7d: number;
  nuevos30d: number;
  activosHoy: number; // usuarios con sesion_iniciada hoy (event_log) — 0 hasta que haya tráfico real
}

export async function obtenerResumenUsuarios(supabase: SupabaseClient): Promise<ResumenUsuarios> {
  const hace7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const hace30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  // "Hoy" empieza a medianoche EN COLOMBIA. Con la medianoche universal, el panel mostraba
  // 0 activos todas las tardes a partir de las 7 p. m. (ya estaba contando el día siguiente).
  const desdeHoy = inicioDelDiaColombiaUTC();

  const [{ count: total }, { count: nuevos7d }, { count: nuevos30d }, { data: sesionesHoy }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', hace7d),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', hace30d),
    supabase
      .from('event_log')
      .select('user_id')
      .eq('nombre', 'sesion_iniciada')
      .gte('created_at', desdeHoy),
  ]);

  const activosHoy = new Set((sesionesHoy ?? []).map((r: { user_id: string | null }) => r.user_id)).size;

  return { total: total ?? 0, nuevos7d: nuevos7d ?? 0, nuevos30d: nuevos30d ?? 0, activosHoy };
}

export interface FilaUso {
  nombre: string;
  total: number;
}

// Cuenta cada tipo de evento de los últimos 30 días — el "USO" real de la app, sin inventar
// nombres bonitos: lo que diga el event_log es lo que hay.
export async function obtenerUsoUltimos30Dias(supabase: SupabaseClient): Promise<FilaUso[]> {
  const hace30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase.from('event_log').select('nombre').gte('created_at', hace30d);
  if (!data || data.length === 0) return [];

  const conteo = new Map<string, number>();
  for (const fila of data as { nombre: string }[]) {
    conteo.set(fila.nombre, (conteo.get(fila.nombre) ?? 0) + 1);
  }
  return Array.from(conteo.entries())
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total);
}

export interface ResumenIA {
  llamadasHoy: number;
  gastoHoyUsd: number;
  gastoMesUsd: number;
  fallasHoy: number;
}

// Costo real de IA desde ai_calls (31-EVALS-OBSERVABILIDAD-OPERACION.md) — cero si nunca se llamó,
// nunca inventado. Vacío hasta que el usuario corra supabase/ai.sql (tabla nueva).
export async function obtenerResumenIA(supabase: SupabaseClient): Promise<ResumenIA | null> {
  const hoy = hoyEnColombia();

  const { data, error } = await supabase
    .from('ai_calls')
    .select('cost_usd, status, created_at')
    .gte('created_at', inicioDelMesColombiaUTC());

  if (error) return null; // la tabla todavía no existe en esta base — sección "sin conectar"

  const filas = (data ?? []) as { cost_usd: number | null; status: string; created_at: string }[];
  // `created_at` viene en hora universal: hay que traducirlo al día colombiano antes de comparar,
  // no cortar la cadena (eso dejaba fuera todo lo ocurrido después de las 7 p. m.).
  const deHoy = filas.filter((f) => fechaEnColombia(new Date(f.created_at)) === hoy);

  return {
    llamadasHoy: deHoy.length,
    gastoHoyUsd: deHoy.reduce((s, f) => s + (f.cost_usd ?? 0), 0),
    gastoMesUsd: filas.reduce((s, f) => s + (f.cost_usd ?? 0), 0),
    fallasHoy: deHoy.filter((f) => f.status !== 'ok').length,
  };
}

export async function obtenerListaUsuarios(supabase: SupabaseClient): Promise<PerfilAdmin[]> {
  const { data } = await supabase
    .from('profiles')
    .select('id, email, nombre, role, source, creado_manualmente, created_at')
    .order('created_at', { ascending: false });

  return (data ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    nombre: p.nombre,
    role: p.role,
    source: p.source,
    creadoManualmente: p.creado_manualmente,
    createdAt: p.created_at,
  }));
}
