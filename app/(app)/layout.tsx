import type { ReactNode } from 'react';
import { BottomNav } from '@/components/app/ui';

// SHELL de la app interna (Sesión 5): altura dinámica de viewport + nav al fondo (regla 43 §13).
// Sin gate de sesión real todavía (Sesión 6 conecta Supabase Auth) — estas rutas son navegables
// directo mientras el login es mock, igual que /onboarding y /paywall en esta etapa del proyecto.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {children}
      <BottomNav />
    </div>
  );
}
