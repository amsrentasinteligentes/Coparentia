'use client';

// Salida del panel: volver a la app normal, o cerrar sesión del todo. Encontrado por el
// revisor-visual (ronda 1): sin esto, la única forma de salir era el botón atrás del navegador.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';

export function CerrarSesion() {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  const salir = async () => {
    if (saliendo) return; // evita doble-clic mientras la petición de red está en curso
    setSaliendo(true);
    const supabase = crearClienteSupabase();
    await supabase.auth.signOut();
    router.push('/entrar');
  };

  return (
    <button
      type="button"
      onClick={salir}
      disabled={saliendo}
      className="flex h-11 items-center gap-1.5 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] px-3 text-[12.5px] font-medium text-[var(--text-secondary)] transition-opacity disabled:opacity-50 [touch-action:manipulation]"
    >
      <LogOut size={14} aria-hidden="true" />
      {saliendo ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  );
}
