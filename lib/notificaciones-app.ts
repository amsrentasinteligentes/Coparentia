// HISTORIAL DE NOTIFICACIONES DENTRO DE LA APP (2026-09-28) — copia de cada aviso push real
// (app/api/cron/recordatorio-cuota) para que quede visible en Inicio hasta que la persona lo vea,
// aunque haya cerrado la notificación del sistema sin tocarla. Mismo patrón de
// `usuarioActual()` de lib/datos.ts, en su propio archivo por ser una feature aparte.

import { crearClienteSupabase } from '@/lib/supabase/client';

export interface NotificacionApp {
  id: string;
  titulo: string;
  cuerpo: string;
  url: string;
  creadaEn: string;
}

async function usuarioActual() {
  const supabase = crearClienteSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No hay sesión activa.');
  return { supabase, userId: user.id };
}

/** Solo las últimas 3 sin leer — no es un buzón para revisar historial completo, es un aviso que
 *  desaparece apenas se ve. Si algún día se necesita más, se agrega paginación real. */
export async function obtenerNotificacionesSinLeer(): Promise<NotificacionApp[]> {
  const { supabase, userId } = await usuarioActual();
  const { data, error } = await supabase
    .from('notificaciones_app')
    .select('id, titulo, cuerpo, url, created_at')
    .eq('user_id', userId)
    .eq('leida', false)
    .order('created_at', { ascending: false })
    .limit(3);
  if (error) throw error;
  return (data ?? []).map((n) => ({ id: n.id, titulo: n.titulo, cuerpo: n.cuerpo, url: n.url, creadaEn: n.created_at }));
}

export async function marcarNotificacionLeida(id: string): Promise<void> {
  const { supabase, userId } = await usuarioActual();
  const { error } = await supabase.from('notificaciones_app').update({ leida: true }).eq('id', id).eq('user_id', userId);
  if (error) throw error;
}
