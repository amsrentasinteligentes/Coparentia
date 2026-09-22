'use server';

// Envío MANUAL de la constancia a la otra parte (botón "Enviar constancia ahora" del Expediente).
// Todo lo importante se vuelve a verificar aquí, en el servidor: que hay sesión, que hay correo de
// la otra parte guardado, y que el período tiene forma de 'YYYY-MM'.

import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { armarResumen, enviarConstanciasDelPeriodo, mesAnteriorEnColombia, periodoTexto } from '@/lib/constancias';
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
  let elegido = periodo && /^\d{4}-\d{2}$/.test(periodo) ? periodo : hoy.slice(0, 7);
  // Si el mes en curso todavía no tiene nada, se usa el anterior: es el caso real de quien envía la
  // constancia los primeros días del mes.
  if (!periodo) {
    const resumen = await armarResumen(supabase, user.id, elegido);
    if (resumen.movimientos.length === 0 && resumen.contactos === 0) {
      const anteriorPeriodo = mesAnteriorEnColombia(hoy);
      const anterior = await armarResumen(supabase, user.id, anteriorPeriodo);
      if (anterior.movimientos.length > 0 || anterior.contactos > 0) elegido = anteriorPeriodo;
    }
  }

  // UN CORREO POR CADA HIJO con lo suyo (pedido del usuario): así la otra parte recibe las cuentas
  // separadas y no un solo correo mezclado.
  const r = await enviarConstanciasDelPeriodo(
    supabase,
    user.id,
    destinatario,
    elegido,
    'manual',
    perfil?.nombre ?? '',
    perfil?.otro_progenitor_nombre ?? '',
    user.email ?? ''
  );

  if (r.sinNada) return { ok: false, mensaje: `No hay nada registrado en ${periodoTexto(elegido)}: no tiene sentido enviar una constancia vacía.` };
  if (r.enviadas === 0) return { ok: false, mensaje: 'No pudimos enviar la constancia. Revisa el correo de la otra parte e inténtalo de nuevo.' };

  const quienes = r.nombres.length > 0 ? ` (${r.nombres.join(' y ')})` : '';
  const base = r.enviadas === 1 ? `Constancia de ${periodoTexto(elegido)}${quienes} enviada a ${destinatario}.` : `${r.enviadas} constancias de ${periodoTexto(elegido)}${quienes} enviadas a ${destinatario}.`;
  return { ok: true, mensaje: r.fallidas > 0 ? `${base} ${r.fallidas} no se pudo enviar.` : base };
}
