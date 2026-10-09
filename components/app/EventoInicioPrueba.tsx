'use client';

// Avisa a Meta (evento estándar StartTrial) la PRIMERA vez que alguien con suscripción viva entra
// a la app: es la señal que le sirve a los anuncios, porque ocurre después del pago real en
// Hotmart. Solo corre si la persona aceptó el aviso de cookies; la marca de "ya medido" vive en
// su propia cuenta (user_metadata), sin tocar la base de datos. No envía ningún dato personal.
// No renderiza nada. Ver lib/meta-pixel.ts.

import { useEffect } from 'react';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { leerEleccion, trackMeta } from '@/lib/meta-pixel';

export function EventoInicioPrueba() {
  useEffect(() => {
    if (leerEleccion() !== 'aceptado') return;
    const supabase = crearClienteSupabase();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || user.user_metadata?.meta_inicio_prueba) return;
      if (!trackMeta('StartTrial')) return;
      void supabase.auth.updateUser({ data: { meta_inicio_prueba: true } });
    });
  }, []);

  return null;
}
