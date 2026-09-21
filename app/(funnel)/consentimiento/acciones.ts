'use server';

// Guarda el consentimiento expreso de la persona (una fila nueva, nunca se edita: es evidencia).
// Las tres casillas obligatorias se vuelven a verificar AQUÍ, en el servidor — el botón del
// cliente puede engañarse, el registro no.

import { headers } from 'next/headers';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { VERSION_CONSENTIMIENTO, type Consentimiento } from '@/lib/consentimiento';

interface Resultado {
  ok: boolean;
  mensaje?: string;
}

export async function guardarConsentimiento(c: Consentimiento): Promise<Resultado> {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, mensaje: 'No hay sesión activa.' };

  if (!c.terminos || !c.datos || !c.renovacion) {
    return { ok: false, mensaje: 'Para continuar necesitas aceptar las tres autorizaciones obligatorias.' };
  }

  const userAgent = (await headers()).get('user-agent')?.slice(0, 300) ?? null;
  const { error } = await supabase.from('consentimientos').insert({
    user_id: user.id,
    version: VERSION_CONSENTIMIENTO,
    terminos: true,
    datos: true,
    renovacion: true,
    marketing: Boolean(c.marketing),
    user_agent: userAgent,
  });
  if (error) {
    console.error('consentimientos: no se pudo guardar', error.message);
    return { ok: false, mensaje: 'No pudimos guardar tu autorización. Revisa tu conexión e inténtalo de nuevo.' };
  }
  return { ok: true };
}
