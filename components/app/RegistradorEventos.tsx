'use client';

// Registra en `event_log` que el usuario abrió la app hoy — la fuente real que el panel de
// administración usa para "usuarios activos" y retención (36-ANALITICA-Y-EVENTOS.md). Deduplicado
// por día con localStorage: sin esto, cada recarga inflaría el conteo de "activos hoy".
// No renderiza nada — vive montado en app/(app)/layout.tsx, una vez por sesión de navegador.

import { useEffect } from 'react';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { hoyEnColombia } from '@/lib/fecha';

const CLAVE_STORAGE = 'coparentia_ultima_sesion_registrada';

export function RegistradorEventos() {
  useEffect(() => {
    const hoy = hoyEnColombia();
    let yaRegistradoHoy = false;
    try {
      yaRegistradoHoy = localStorage.getItem(CLAVE_STORAGE) === hoy;
    } catch {
      return; // almacenamiento bloqueado (modo privado, etc.) — mejor no registrar que duplicar
    }
    if (yaRegistradoHoy) return;

    const supabase = crearClienteSupabase();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('event_log')
        .insert({ user_id: user.id, nombre: 'sesion_iniciada', propiedades: {} })
        .then(() => {
          try {
            localStorage.setItem(CLAVE_STORAGE, hoy);
          } catch {
            // sin localStorage no se puede deduplicar la próxima vez — no es crítico, se
            // reintentará (y podría registrar dos veces en un caso raro; preferible a no medir nada)
          }
        });
    });
  }, []);

  return null;
}
