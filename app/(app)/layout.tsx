import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { BottomNav } from '@/components/app/ui';
import { AvisoSinConexion } from '@/components/app/AvisoSinConexion';
import { RegistradorEventos } from '@/components/app/RegistradorEventos';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';

// SHELL de la app interna: altura dinámica de viewport + nav al fondo (regla 43 §13).
// Sesión 6: gate de sesión REAL con Supabase Auth — sin sesión válida, no se entra.
// (Los datos que se muestran adentro siguen en localStorage por ahora — lib/datos.ts
// se migra a las tablas reales de supabase/schema.sql en el siguiente paso de esta
// misma sesión, ya con el usuario autenticado disponible.)
export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/entrar');
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
