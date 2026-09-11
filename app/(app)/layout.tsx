import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { BottomNav } from '@/components/app/ui';
import { AvisoSinConexion } from '@/components/app/AvisoSinConexion';
import { RegistradorEventos } from '@/components/app/RegistradorEventos';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { tieneAccesoCompleto, type Status } from '@/lib/membership-fsm';

// SHELL de la app interna: altura dinámica de viewport + nav al fondo (regla 43 §13).
// Sesión 6: gate de sesión REAL con Supabase Auth — sin sesión válida, no se entra.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/entrar');
  }

  // CANDADO DE SUSCRIPCIÓN (2026-09-11) — antes de esto, CUALQUIERA con sesión iniciada entraba
  // completo a la app para siempre, sin haber pagado nunca: no existía ni una sola verificación
  // de prueba/plan en todo el código (hallazgo crítico de la auditoría). Ahora, con el webhook de
  // Hotmart ya conectado, esta es la única puerta real: si la persona no tiene una suscripción
  // viva, se la manda a la pantalla de planes en vez de dejarla pasar.
  const { data: perfil } = await supabase
    .from('profiles')
    .select('role, creado_manualmente')
    .eq('id', user.id)
    .maybeSingle();

  // El dueño y las cuentas dadas de alta a mano desde el panel (soporte, pruebas) nunca pasan por
  // Hotmart — se saltan el candado a propósito, igual que ya se saltaban el resto de la app.
  const exento = perfil?.role === 'admin' || perfil?.creado_manualmente === true;

  if (!exento) {
    const { data: suscripcion } = await supabase
      .from('suscripciones')
      .select('status, access_until, grace_ends_at')
      .eq('email', user.email ?? '')
      .maybeSingle();

    const tieneAcceso = suscripcion
      ? tieneAccesoCompleto(
          suscripcion.status as Status,
          new Date(),
          suscripcion.access_until ? new Date(suscripcion.access_until) : null,
          suscripcion.grace_ends_at ? new Date(suscripcion.grace_ends_at) : null
        )
      : false; // sin fila en `suscripciones` = nunca pagó ni empezó una prueba

    if (!tieneAcceso) {
      redirect('/paywall');
    }
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <AvisoSinConexion />
      <RegistradorEventos />
      {children}
      <BottomNav />
    </div>
  );
}
