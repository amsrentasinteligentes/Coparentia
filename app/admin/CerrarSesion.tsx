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
      // Sin borde propio (a diferencia de "Volver a la app") — encontrado por el revisor-visual
      // (ronda final): las dos acciones tenían el mismo peso pese a ser de frecuencia y riesgo
      // muy distintos ("volver" se usa siempre; "cerrar sesión" rara vez).
      className="flex h-11 items-center gap-1.5 px-2 text-[12.5px] font-medium text-[var(--text-tertiary)] transition-opacity disabled:opacity-50 [touch-action:manipulation]"
    >
      <LogOut size={14} aria-hidden="true" />
      {saliendo ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  );
}
