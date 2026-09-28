// ENVÍO DE NOTIFICACIONES PUSH (2026-09-28) — capa fina sobre `web-push`, usada solo por
// app/api/cron/recordatorio-cuota/route.ts. Configura las claves UNA vez por proceso (el propio
// paquete las guarda en memoria del módulo) y expone una función que manda a TODOS los
// dispositivos de un usuario, limpiando las suscripciones que ya no sirven.

import webpush from 'web-push';
import type { SupabaseClient } from '@supabase/supabase-js';

let configurado = false;
function asegurarConfiguracion(): boolean {
  const publica = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privada = process.env.VAPID_PRIVATE_KEY;
  if (!publica || !privada) return false;
  if (!configurado) {
    webpush.setVapidDetails('mailto:soporte@coparentia.co', publica, privada);
    configurado = true;
  }
  return true;
}

interface Aviso {
  titulo: string;
  cuerpo: string;
  url?: string;
}

/**
 * Manda `aviso` a todos los navegadores suscritos de `userId`. Una suscripción "muerta" (410/404
 * — la persona desinstaló, borró datos del navegador, etc.) se borra sola de la tabla: es la
 * única forma confiable de saberlo, Web Push no avisa de otra manera.
 */
export async function enviarPushAUsuario(admin: SupabaseClient, userId: string, aviso: Aviso): Promise<number> {
  if (!asegurarConfiguracion()) return 0;

  const { data: suscripciones } = await admin.from('push_subscriptions').select('id, endpoint, p256dh, auth').eq('user_id', userId);
  if (!suscripciones || suscripciones.length === 0) return 0;

  const payload = JSON.stringify({ titulo: aviso.titulo, cuerpo: aviso.cuerpo, url: aviso.url ?? '/inicio' });
  let enviados = 0;

  for (const s of suscripciones) {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
      enviados += 1;
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await admin.from('push_subscriptions').delete().eq('id', s.id);
      } else {
        console.error('push: fallo al enviar', status, e instanceof Error ? e.message : e);
      }
    }
  }

  return enviados;
}
