// EL "OYENTE" DE HOTMART — a esta dirección Hotmart avisa cada vez que alguien paga, se le vence
// la prueba, cancela, le rechazan el cobro o pide un reembolso. Sigue el pipeline obligatorio de
// docs/sistema/18-VENTA-HOTMART.md: autenticidad → frescura → parseo → catálogo → idempotencia →
// cambio de estado atómico → responder. Implementación real, no un ejemplo simplificado — un
// webhook de pagos "didáctico" suele omitir justo lo que evita pérdidas (regalar el producto
// gratis, o perder ventas reales sin que nadie se entere).

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { verificarHotmart } from '@/lib/hotmart-verify';
import { estadoParaEvento } from '@/lib/membership-fsm';

export const runtime = 'nodejs'; // node:crypto y raw body — no corre en Edge

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const VENTANA_REPLAY_MS = 5 * 60 * 1000; // anti-repetición: rechaza avisos con fecha de más de 5 min
const DIAS_PRUEBA = 7; // FICHA-MERCADO §4 — mismo plazo que promete el paywall

/** Registra un intento (éxito o no) — es lo único que permite ver después si algo se rompió. */
async function registrar(eventId: string | null, tipo: string | null, resultado: string): Promise<void> {
  try {
    await admin.from('hotmart_webhook_log').insert({ event_id: eventId, event_type: tipo, result: resultado });
  } catch {
    // Nunca dejar que un fallo al REGISTRAR tumbe la respuesta al aviso real.
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Bytes exactos, ANTES de parsear — necesarios para el hash de auditoría y por si algún día
  //    hay que verificar una firma documentada por Hotmart sobre el cuerpo crudo.
  const rawBody = await req.text();

  // 2. AUTENTICIDAD — el hottok puede venir como encabezado o como campo del cuerpo (según la
  //    versión de webhook de la cuenta). Leer el campo del cuerpo exige un parseo mínimo, pero eso
  //    NO es "confiar" en el aviso: solo se lee un string para compararlo, nada se ejecuta ni se
  //    guarda hasta que la comparación en tiempo constante pase.
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    await registrar(null, null, 'error');
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
  const cuerpo = payload as Record<string, unknown>;
  const hottokEncabezado = req.headers.get('x-hotmart-hottok') ?? undefined;
  const hottokCuerpo = typeof cuerpo.hottok === 'string' ? cuerpo.hottok : undefined;

  if (!verificarHotmart({ hottok: hottokEncabezado ?? hottokCuerpo })) {
    await registrar(null, typeof cuerpo.event === 'string' ? cuerpo.event : null, 'unauthorized');
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 }); // genérico, no revela por qué
  }

  // 3. FRESCURA (anti-replay) — se prueban varios nombres de campo de fecha porque cambian según
  //    el evento; si ninguno aparece, no se bloquea por esto (la idempotencia de abajo ya protege).
  const data = (cuerpo.data ?? {}) as Record<string, any>;
  const tsCandidato: number | undefined = cuerpo.creation_date as number | undefined
    ?? data.purchase?.approved_date
    ?? data.purchase?.order_date;
  if (tsCandidato && Date.now() - Number(tsCandidato) > VENTANA_REPLAY_MS) {
    await registrar(null, typeof cuerpo.event === 'string' ? cuerpo.event : null, 'error');
    return NextResponse.json({ error: 'stale' }, { status: 400 });
  }

  // 4. Datos del evento.
  const evento = String(cuerpo.event ?? '');
  const email: string | undefined = data.buyer?.email;
  const subscriberCode: string | undefined = data.subscription?.subscriber?.code;
  const montoPagado: number | null = data.purchase?.price?.value ?? null;
  const eventId: string =
    String(cuerpo.id ?? data.purchase?.transaction ?? `${evento}:${email ?? 'sin-correo'}:${tsCandidato ?? Date.now()}`);

  const nuevoEstado = estadoParaEvento(evento, montoPagado);
  if (!nuevoEstado || !email) {
    // Evento que no cambia el acceso (SWITCH_PLAN, uno aún no mapeado) o sin correo identificable:
    // se reconoce con 200 (Hotmart deja de reintentar), nunca se ignora en silencio.
    return NextResponse.json({ received: true, ignorado: evento || 'desconocido' });
  }

  // 5. Fechas derivadas. La fecha del PRÓXIMO cobro (para saber hasta cuándo dura el acceso tras
  //    cancelar) se intenta leer del aviso; si Hotmart no la manda en este evento, se usa un
  //    resguardo de 30 días.
  //    ⚠️ PLACEHOLDER A CONFIRMAR: ajustar en cuanto se vea el aviso REAL de una cancelación de
  //    prueba (ver la Prueba end-to-end antes de anunciar la venta).
  const ahora = new Date();
  const trialEndsAt = nuevoEstado === 'trialing' ? new Date(ahora.getTime() + DIAS_PRUEBA * 86_400_000) : null;
  const fechaProximoCobro: number | undefined = data.subscription?.date_next_charge ?? data.purchase?.date_next_charge;
  const accessUntil =
    nuevoEstado === 'cancelled'
      ? fechaProximoCobro
        ? new Date(Number(fechaProximoCobro))
        : new Date(ahora.getTime() + 30 * 86_400_000)
      : null;
  const graceEndsAt = nuevoEstado === 'past_due' ? new Date(ahora.getTime() + 5 * 86_400_000) : null;

  const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');

  // 6. IDEMPOTENCIA + CAMBIO DE ESTADO, atómico en una función de Postgres (o se guarda todo, o
  //    no se guarda nada — nunca un estado a medias).
  const { data: resultadoRpc, error } = await admin.rpc('aplicar_evento_hotmart', {
    p_event_id: eventId,
    p_event_type: evento,
    p_payload_hash: payloadHash,
    p_email: email,
    p_subscriber_code: subscriberCode ?? null,
    p_new_status: nuevoEstado,
    p_trial_ends_at: trialEndsAt,
    p_access_until: accessUntil,
    p_grace_ends_at: graceEndsAt,
  });

  if (error) {
    // Nunca loguear el payload completo (correo/nombre = datos personales) — solo el código.
    console.error('webhook hotmart error', { evento, code: error.code });
    await registrar(eventId, evento, 'error');
    return NextResponse.json({ error: 'processing failed' }, { status: 500 }); // 5xx → Hotmart reintenta
  }

  const estadoRpc = (resultadoRpc as { status?: string } | null)?.status;
  const resultado = estadoRpc === 'applied' ? 'applied' : estadoRpc === 'duplicate' ? 'duplicate' : 'illegal';
  await registrar(eventId, evento, resultado);

  // 7. 200 SIEMPRE que la decisión ya se tomó (incluidos duplicado/ilegal): Hotmart deja de
  //    reintentar. Solo un 5xx real (arriba) le pide que reintente.
  return NextResponse.json({ received: true, resultado: estadoRpc ?? 'ok' });
}
