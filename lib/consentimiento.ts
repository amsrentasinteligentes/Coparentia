// CONSENTIMIENTO EXPRESO (2026-09-21) — qué versión de los textos legales rige y cómo saber si la
// persona ya la aceptó. Lo consume el layout de la app (gate) y la pantalla /consentimiento.
// Si cambian los Términos o la Política, se sube la versión aquí y TODOS vuelven a aceptar una vez.

import type { SupabaseClient } from '@supabase/supabase-js';

export const VERSION_CONSENTIMIENTO = 'v1-2026-09-21';

/** Última decisión sobre novedades (marketing) del usuario, o null si nunca aceptó nada. */
export async function obtenerPreferenciaNovedades(supabase: SupabaseClient, userId: string): Promise<boolean | null> {
  const { data } = await supabase
    .from('consentimientos')
    .select('marketing')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ? Boolean(data.marketing) : null;
}

/** Cambia SOLO la preferencia de novedades: inserta una fila nueva (las obligatorias siguen en true). */
export async function cambiarPreferenciaNovedades(supabase: SupabaseClient, userId: string, marketing: boolean): Promise<void> {
  const { error } = await supabase.from('consentimientos').insert({
    user_id: userId,
    version: VERSION_CONSENTIMIENTO,
    terminos: true,
    datos: true,
    renovacion: true,
    marketing,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 300) : null,
  });
  if (error) throw error;
}

export interface Consentimiento {
  terminos: boolean;
  datos: boolean;
  renovacion: boolean;
  marketing: boolean;
}

/** true si el usuario ya aceptó las 3 casillas obligatorias de la versión vigente. */
export async function tieneConsentimientoVigente(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('consentimientos')
    .select('id')
    .eq('user_id', userId)
    .eq('version', VERSION_CONSENTIMIENTO)
    .eq('terminos', true)
    .eq('datos', true)
    .eq('renovacion', true)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error('consentimientos: no se pudo consultar', error.code, error.message);
    // SOLO si la tabla aún no existe (SQL pendiente de correr) se deja pasar: bloquear a todos los
    // clientes por una migración pendiente sería peor. Cualquier otro error exige el consentimiento
    // (sin fail-open genérico — 09-SEGURIDAD.md).
    return error.code === '42P01' || error.code === 'PGRST205';
  }
  return Boolean(data);
}
