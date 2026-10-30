// TOPE DIARIO DE ENVÍOS POR PERSONA (auditoría 2026-10-29). Los topes REALES viven en la base de datos
// (supabase/limite-envios.sql, funciones `reservar_envio` / `liberar_envio`): se cuentan por día de
// Colombia, se anotan en una tabla que el navegador no puede escribir y la reserva es atómica (dos clics
// simultáneos no se cuelan). Aquí solo se llama a esas funciones y se arman los mensajes.

import { crearClienteSupabaseServidor } from '@/lib/supabase/server';

type SupabaseServidor = Awaited<ReturnType<typeof crearClienteSupabaseServidor>>;

export type TipoEnvio = 'constancia' | 'consulta';

// Solo para el TEXTO del mensaje — si cambia un tope, cambia en limite-envios.sql y aquí.
const TOPE_PARA_MENSAJE: Record<TipoEnvio, { cuantos: number; singular: string; plural: string }> = {
  constancia: { cuantos: 1, singular: 'constancia', plural: 'constancias' },
  consulta: { cuantos: 1, singular: 'consulta', plural: 'consultas' },
};

export function mensajeTopeAlcanzado(tipo: TipoEnvio): string {
  const t = TOPE_PARA_MENSAJE[tipo];
  return `Ya enviaste ${t.cuantos} ${t.cuantos === 1 ? t.singular : t.plural} hoy. Podrás enviar otra mañana.`;
}

export const MENSAJE_ENVIO_NO_VERIFICADO = 'No pudimos comprobar tu límite de envíos. Inténtalo de nuevo en un momento.';

/**
 * Anota un envío del día y dice si hay cupo. FALLA CERRADA a propósito: si la función de la base no
 * existe todavía o la consulta falla, devuelve 'error' y NO se envía nada (09-SEGURIDAD.md: un tope que
 * se abre solo cuando algo se rompe no es un tope).
 */
export async function reservarEnvio(supabase: SupabaseServidor, tipo: TipoEnvio): Promise<'ok' | 'tope' | 'error'> {
  const { data, error } = await supabase.rpc('reservar_envio', { p_tipo: tipo });
  if (error || typeof data !== 'boolean') return 'error';
  return data ? 'ok' : 'tope';
}

/** Devuelve el cupo cuando al final NO salió ningún correo (nada que enviar, o el envío falló). */
export async function liberarEnvio(supabase: SupabaseServidor, tipo: TipoEnvio): Promise<void> {
  await supabase.rpc('liberar_envio', { p_tipo: tipo });
}
