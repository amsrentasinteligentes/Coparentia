// Lee, desde el navegador, el estado REAL de la suscripción de quien tiene la sesión iniciada, para la
// tarjeta "Plan actual" de Perfil. La seguridad es la de siempre: la fila de `suscripciones` solo la
// puede leer su dueña (política por el correo de la sesión) y `profiles` solo la propia fila.
// Nunca lanza: si algo falla, Perfil muestra "Plan no disponible" en vez de romperse.

import { crearClienteSupabase } from '@/lib/supabase/client';
import type { FilaSuscripcion } from '@/lib/estado-plan';

export interface EstadoPlan {
  cortesia: boolean;
  suscripcion: FilaSuscripcion | null;
}

const COLUMNAS_BASE = 'status, trial_ends_at, access_until, grace_ends_at';

export async function obtenerEstadoPlan(): Promise<EstadoPlan | null> {
  try {
    const supabase = crearClienteSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return null;

    const { data: perfil } = await supabase
      .from('profiles')
      .select('role, creado_manualmente')
      .eq('id', user.id)
      .maybeSingle();
    const cortesia = perfil?.role === 'admin' || perfil?.creado_manualmente === true;
    if (cortesia) return { cortesia: true, suscripcion: null };

    // `next_charge_at` es una columna nueva (supabase/suscripciones-proximo-cobro.sql). Si aún no existe en
    // la base, la consulta completa falla y se reintenta sin ella: Perfil sigue funcionando, solo sin la fecha.
    type FilaLeida = Omit<FilaSuscripcion, 'next_charge_at'> & { next_charge_at?: string | null };
    const completa = await supabase
      .from('suscripciones')
      .select(`${COLUMNAS_BASE}, next_charge_at`)
      .eq('email', user.email)
      .maybeSingle();
    let fila = completa.data as FilaLeida | null;
    if (completa.error) {
      const base = await supabase.from('suscripciones').select(COLUMNAS_BASE).eq('email', user.email).maybeSingle();
      if (base.error) return null;
      fila = base.data as FilaLeida | null;
    }
    return { cortesia: false, suscripcion: fila ? { ...fila, next_charge_at: fila.next_charge_at ?? null } : null };
  } catch {
    return null;
  }
}
