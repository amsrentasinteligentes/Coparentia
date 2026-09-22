'use server';

// Envío MANUAL de la constancia a la otra parte (botón "Enviar constancia ahora" del Expediente).
// Todo lo importante se vuelve a verificar aquí, en el servidor: que hay sesión, que hay correo de
// la otra parte guardado, y que el período tiene forma de 'YYYY-MM'.

import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { armarResumen, enviarConstancia, mesAnteriorEnColombia } from '@/lib/constancias';
import { hoyEnColombia } from '@/lib/fecha';

interface Resultado {
  ok: boolean;
  mensaje: string;
}

export async function enviarConstanciaAhora(periodo?: string): Promise<Resultado> {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, mensaje: 'No hay sesión activa.' };

  const { data: perfil } = await supabase
    .from('profiles')
    .select('nombre, otro_progenitor_nombre, otro_progenitor_email')
    .eq('id', user.id)
    .maybeSingle();

  const destinatario = perfil?.otro_progenitor_email?.trim();
  if (!destinatario) {
    return { ok: false, mensaje: 'Primero guarda el correo de la otra parte en Perfil → Editar perfil.' };
  }

  const hoy = hoyEnColombia();
  const elegido = periodo && /^\d{4}-\d{2}$/.test(periodo) ? periodo : hoy.slice(0, 7);
  const resumen = await armarResumen(supabase, user.id, elegido);
  // Si el mes en curso todavía no tiene nada, se ofrece el anterior: es el caso real de quien
  // envía la constancia los primeros días del mes.
  if (resumen.movimientos.length === 0 && resumen.contactos === 0 && !periodo) {
    const anterior = await armarResumen(supabase, user.id, mesAnteriorEnColombia(hoy));
    if (anterior.movimientos.length > 0 || anterior.contactos > 0) {
      return enviarConstancia(supabase, user.id, destinatario, anterior, 'manual', perfil?.nombre ?? '', perfil?.otro_progenitor_nombre ?? '', user.email ?? '');
    }
  }
  return enviarConstancia(supabase, user.id, destinatario, resumen, 'manual', perfil?.nombre ?? '', perfil?.otro_progenitor_nombre ?? '', user.email ?? '');
}
