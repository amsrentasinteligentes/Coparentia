'use server';

// Envía la consulta jurídica que el usuario escribe en /asistencia a soporte@coparentia.co —
// sigue el mismo patrón de lib/email.ts (Resend), pero a diferencia de los correos que dispara el
// webhook, este SÍ le importa el resultado a la pantalla (necesita decir "se envió" o "falló").

import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { enviarConsultaJuridica } from '@/lib/email';

interface ResultadoAccion {
  ok: boolean;
  mensaje: string;
}

const LARGO_MINIMO = 10;
const LARGO_MAXIMO = 2000;

export async function enviarConsulta(texto: string): Promise<ResultadoAccion> {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return { ok: false, mensaje: 'No hay sesión activa.' };
  }

  const mensaje = texto.trim();
  if (mensaje.length < LARGO_MINIMO || mensaje.length > LARGO_MAXIMO) {
    return { ok: false, mensaje: `Escribe tu consulta con al menos ${LARGO_MINIMO} caracteres.` };
  }

  const enviado = await enviarConsultaJuridica(user.email, mensaje);
  if (!enviado) {
    return { ok: false, mensaje: 'No pudimos enviar tu consulta. Intenta de nuevo en un momento.' };
  }

  return { ok: true, mensaje: 'Listo, la enviamos — te responderemos a tu correo.' };
}
