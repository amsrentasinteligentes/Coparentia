'use server';

// LECTOR AUTOMÁTICO DE RECIBOS — lee el monto de la foto de un comprobante con IA, para
// pre-llenar el campo (el usuario SIEMPRE ve el número antes de guardar y puede corregirlo — la
// IA nunca guarda dinero sin que una persona lo confirme). Sigue 30-INTEGRACION-IA.md:
// - Síncrono: es una extracción corta (no genera imagen/audio/video), responde en segundos.
// - Salida forzada por esquema (tool use) + zod, nunca parseo de texto libre a ciegas.
// - Modelo económico de extracción (Haiku), en env var AI_MODEL — nunca hardcodeado.
// - Cada llamada se registra en ai_calls (costo real, lo que ve el panel de administración).
// - Kill-switch de gasto diario ANTES de llamar — protege contra un bug en loop o abuso.

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';

// Nota: se intentó reforzar con `export const maxDuration` aquí, pero un archivo 'use server'
// solo puede exportar funciones — cualquier otro export rompe TODAS las Server Actions del
// archivo (error real de build: "The module has no exports at all"). El fix real contra una
// llamada lenta vive del lado del cliente: comprimir la foto antes de mandarla (pagos/page.tsx,
// lib/comprimir-imagen.ts) + un tope de 20s que libera el campo si nada responde a tiempo.

const FEATURE = 'lector_recibo';

// Precio aproximado del modelo de extracción (Haiku 4.5, USD por 1M tokens) — VERIFICAR el precio
// vigente en la doc oficial de Anthropic antes de confiar en el costo mostrado en el panel.
const PRECIO_ENTRADA_POR_1M = 1;
const PRECIO_SALIDA_POR_1M = 5;

// Kill-switch de gasto — tope conservador y muy por encima del uso esperado de una app de este
// tamaño (300 recibos/mes ≈ $0.60 USD/mes); protege contra un bug en loop, no contra el uso normal.
//
// ⚠️ EL TOPE YA NO VIVE AQUÍ: vive en la función `presupuesto_ia_disponible` de
// supabase/freno-gasto-ia.sql. Antes se comprobaba desde este archivo leyendo `ai_calls` con la
// sesión del usuario, pero la política de seguridad de esa tabla solo deja leerla al dueño: para
// cualquier usuario normal la suma daba 0 y el freno NUNCA cortaba (auditoría 2026-09-11).
// Ponerlo en el servidor también impide que el tope se pueda alterar desde el cliente.

const EsquemaMonto = z.object({
  monto: z.number().positive().nullable(),
  confianza: z.enum(['alta', 'media', 'baja']),
});
type ResultadoExtraccion = z.infer<typeof EsquemaMonto>;

const TOOL = {
  name: 'extraer_monto',
  description: 'Extrae el monto total pagado que aparece en la foto de un comprobante de pago.',
  input_schema: {
    type: 'object' as const,
    properties: {
      monto: {
        type: ['number', 'null'],
        description: 'El monto total en pesos colombianos, solo el número (sin símbolo de moneda ni puntos de miles). null si no se puede leer con confianza.',
      },
      confianza: { type: 'string', enum: ['alta', 'media', 'baja'], description: 'Qué tan seguro estás de la lectura.' },
    },
    required: ['monto', 'confianza'],
    additionalProperties: false,
  },
};

export interface ResultadoLectura {
  monto: number | null;
  confianza: 'alta' | 'media' | 'baja' | null;
}

// Lee el monto de una foto de comprobante — nunca lanza al llamador: cualquier fallo (sin
// presupuesto, error del proveedor, foto ilegible) degrada a "no se pudo leer" y la persona
// sigue pudiendo escribir el monto a mano, como siempre pudo (degradación elegante, 30).
export async function leerMontoDeRecibo(archivo: File): Promise<ResultadoLectura> {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { monto: null, confianza: null };

  const inicio = Date.now();

  if (!(await dentroDelPresupuestoDiario(supabase))) {
    await registrarLlamada(supabase, user.id, { status: 'error', error: 'presupuesto_diario_agotado' });
    return { monto: null, confianza: null };
  }

  try {
    const bytes = await archivo.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mediaType = archivo.type === 'application/pdf' ? null : archivo.type || 'image/jpeg';

    // Un PDF no se puede mandar como imagen a este modelo — se degrada de inmediato a manual,
    // sin gastar una llamada que fallaría de todos modos.
    if (!mediaType) return { monto: null, confianza: null };

    const client = new Anthropic(); // ANTHROPIC_API_KEY del entorno (servidor, nunca en el cliente)
    const modelo = process.env.AI_MODEL || 'claude-haiku-4-5';

    const res = await client.messages.create({
      model: modelo,
      max_tokens: 256,
      tool_choice: { type: 'tool', name: 'extraer_monto' },
      tools: [TOOL],
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType as 'image/jpeg', data: base64 } },
            { type: 'text', text: 'Esta es la foto de un comprobante de pago (transferencia, consignación o recibo). Extrae el monto total pagado.' },
          ],
        },
      ],
    });

    const toolUse = res.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use');
    const parsed = EsquemaMonto.safeParse(toolUse?.input);
    const costoUsd = calcularCostoUsd(res.usage.input_tokens, res.usage.output_tokens);

    await registrarLlamada(supabase, user.id, {
      status: 'ok',
      tokensIn: res.usage.input_tokens,
      tokensOut: res.usage.output_tokens,
      costoUsd,
      latenciaMs: Date.now() - inicio,
      modelo,
    });

    if (!parsed.success) return { monto: null, confianza: null };
    return normalizar(parsed.data);
  } catch (e) {
    await registrarLlamada(supabase, user.id, {
      status: 'error',
      error: e instanceof Error ? e.message : 'error_desconocido',
      latenciaMs: Date.now() - inicio,
    });
    return { monto: null, confianza: null };
  }
}

function normalizar(r: ResultadoExtraccion): ResultadoLectura {
  if (r.monto === null) return { monto: null, confianza: null };
  return { monto: r.monto, confianza: r.confianza };
}

function calcularCostoUsd(tokensIn: number, tokensOut: number): number {
  return (tokensIn / 1_000_000) * PRECIO_ENTRADA_POR_1M + (tokensOut / 1_000_000) * PRECIO_SALIDA_POR_1M;
}

type SupabaseServidor = Awaited<ReturnType<typeof crearClienteSupabaseServidor>>;

// Le pregunta al servidor si todavía hay presupuesto del día. La función de la base suma TODAS las
// llamadas (cosa que este usuario no puede hacer por su cuenta) y devuelve solo un sí/no.
//
// FALLA CERRADA A PROPÓSITO: si la función no existe todavía o la consulta falla, se responde
// "no hay presupuesto" y la lectura automática se apaga. Un freno de gasto que se abre solo cuando
// algo se rompe no es un freno (09-SEGURIDAD.md: nada de defaults inseguros). La persona no queda
// bloqueada: escribe el monto a mano, que es la salida que esta pantalla siempre tuvo.
async function dentroDelPresupuestoDiario(supabase: SupabaseServidor): Promise<boolean> {
  const { data, error } = await supabase.rpc('presupuesto_ia_disponible', { p_feature: FEATURE });
  if (error || typeof data !== 'boolean') return false;
  return data;
}

async function registrarLlamada(
  supabase: SupabaseServidor,
  userId: string,
  datos: {
    status: 'ok' | 'error';
    tokensIn?: number;
    tokensOut?: number;
    costoUsd?: number;
    latenciaMs?: number;
    modelo?: string;
    error?: string;
  }
): Promise<void> {
  await supabase.from('ai_calls').insert({
    user_id: userId,
    feature: FEATURE,
    model: datos.modelo ?? process.env.AI_MODEL ?? 'claude-haiku-4-5',
    tokens_in: datos.tokensIn ?? null,
    tokens_out: datos.tokensOut ?? null,
    cost_usd: datos.costoUsd ?? null,
    latency_ms: datos.latenciaMs ?? null,
    status: datos.status,
    error: datos.error ?? null,
  });
}
