// REGLA DE ACCESO A LA APP — la usan dos sitios: el candado de pantallas (`app/(app)/layout.tsx`) y las
// funciones del servidor que cuestan dinero o mandan correos (constancia, consulta jurídica, lector de
// recibos). Antes el candado solo protegía las PANTALLAS: esas funciones se pueden llamar directo y solo
// revisaban que hubiera una sesión, así que una cuenta gratis podía usarlas sin pagar (auditoría 2026-10-29).
// Vive en un solo archivo para que el candado y las funciones nunca puedan quedar desincronizados.

import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { tieneAccesoCompleto, type Status } from '@/lib/membership-fsm';

type SupabaseServidor = Awaited<ReturnType<typeof crearClienteSupabaseServidor>>;

export const MENSAJE_SIN_SUSCRIPCION = 'Necesitas una suscripción activa para usar esta función.';
export const MENSAJE_NO_SE_PUDO_VERIFICAR = 'No pudimos verificar tu cuenta. Inténtalo de nuevo en un momento.';

export interface Acceso {
  /** 'error' = la consulta falló (red, timeout): NUNCA se traduce a "no pagaste" (Gate 8 de 61). */
  estado: 'ok' | 'sin_acceso' | 'error';
  role: string | null;
  /** Prueba o plan activo (no cuentas exentas ni suscripciones canceladas con acceso restante). */
  suscripcionViva: boolean;
}

export async function resolverAcceso(supabase: SupabaseServidor, userId: string, email: string | undefined): Promise<Acceso> {
  const { data: perfil } = await supabase.from('profiles').select('role, creado_manualmente').eq('id', userId).maybeSingle();
  const role = perfil?.role ?? null;

  // El dueño y las cuentas dadas de alta a mano desde el panel (soporte, pruebas) nunca pasan por
  // Hotmart — se saltan el candado a propósito.
  if (role === 'admin' || perfil?.creado_manualmente === true) return { estado: 'ok', role, suscripcionViva: false };

  const { data: suscripcion, error } = await supabase
    .from('suscripciones')
    .select('status, access_until, grace_ends_at')
    .eq('email', email ?? '')
    .maybeSingle();

  // `error` solo viene poblado ante un fallo real de la consulta, nunca por un maybeSingle() sin resultados.
  if (error) return { estado: 'error', role, suscripcionViva: false };

  const tieneAcceso = suscripcion
    ? tieneAccesoCompleto(
        suscripcion.status as Status,
        new Date(),
        suscripcion.access_until ? new Date(suscripcion.access_until) : null,
        suscripcion.grace_ends_at ? new Date(suscripcion.grace_ends_at) : null
      )
    : false; // sin fila en `suscripciones` (y sin error) = nunca pagó ni empezó una prueba

  if (!tieneAcceso) return { estado: 'sin_acceso', role, suscripcionViva: false };
  return { estado: 'ok', role, suscripcionViva: suscripcion?.status === 'trialing' || suscripcion?.status === 'active' };
}
