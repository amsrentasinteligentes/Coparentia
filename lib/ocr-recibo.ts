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
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { resolverAcceso } from '@/lib/acceso';

// Nota: se intentó reforzar con `export const maxDuration` aquí, pero un archivo 'use server'
// solo puede exportar funciones — cualquier otro export rompe TODAS las Server Actions del
// archivo (error real de build: "The module has no exports at all"). El fix real contra una
// llamada lenta vive del lado del cliente: comprimir la foto antes de mandarla (pagos/page.tsx,
// lib/comprimir-imagen.ts) + un tope de 20s que libera el campo si nada responde a tiempo.

const FEATURE = 'lector_recibo';

// Modelo de respaldo cuando no existe la variable AI_MODEL (hoy es el caso en producción).
const MODELO_POR_DEFECTO = 'claude-haiku-4-5';

// Precio por MODELO (USD por 1M tokens), tomado de la tabla oficial platform.claude.com/docs/en/about-claude/pricing
// (verificada 2026-10-29). El costo que ve el panel se calcula con el precio del modelo que REALMENTE
// respondió, no con uno fijo. Haiku 5.5 tiene un precio mayor solo para prompts de más de 100.000 tokens:
// una foto de recibo queda muy por debajo, así que aquí va el precio de hasta 100.000.
const PRECIOS_POR_1M: Record<string, { entrada: number; salida: number }> = {
  'claude-haiku-4-5': { entrada: 1, salida: 5 },
  'claude-haiku-5-5': { entrada: 0.1, salida: 0.5 },
  'claude-sonnet-4-5': { entrada: 3, salida: 15 },
  'claude-sonnet-4-6': { entrada: 3, salida: 15 },
  'claude-sonnet-5': { entrada: 2, salida: 10 },
  'claude-sonnet-5-5': { entrada: 2, salida: 10 },
  'claude-opus-4-5': { entrada: 5, salida: 25 },
  'claude-opus-5': { entrada: 5, salida: 25 },
  'claude-opus-5-5': { entrada: 4, salida: 20 },
};
// Un modelo que no está en la tabla se cobra al precio MÁS ALTO conocido (Fable 5.x: $10 / $50): preferimos
// sobrestimar el gasto y que el freno corte antes, a subestimarlo y que no corte nunca.
const PRECIO_DESCONOCIDO = { entrada: 10, salida: 50 };

// Kill-switch de gasto — tope conservador y muy por encima del uso esperado de una app de este
// tamaño (300 recibos/mes ≈ $0.60 USD/mes); protege contra un bug en loop, no contra el uso normal.
//
// ⚠️ EL TOPE YA NO VIVE AQUÍ: vive en la función `presupuesto_ia_disponible` de
// supabase/freno-gasto-ia-v2.sql (US$1/día entre todos + 30 lecturas/día por persona). Antes se
// comprobaba desde este archivo leyendo `ai_calls` con la sesión del usuario, pero la política de
// seguridad de esa tabla solo deja leerla al dueño: para cualquier usuario normal la suma daba 0 y el
// freno NUNCA cortaba (auditoría 2026-09-11). Ponerlo en el servidor también impide que el tope se
// pueda alterar desde el cliente.
//
// Y LAS LLAMADAS SE ANOTAN CON LA CLAVE DE SERVICIO, no con la sesión del usuario (auditoría 2026-10-29):
// antes `ai_calls` tenía una política que dejaba a cualquier usuario insertar filas con el costo que
// quisiera, y una sola fila falsa agotaba el tope diario de TODOS. Ahora nadie inserta desde el navegador.

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

  // Mismo candado que las pantallas: esta función se puede llamar directo y cada lectura gasta IA real.
  // Sin acceso (o si no se pudo verificar) NO se lee la foto: degrada a "no se pudo leer" y no se llama a la IA.
  const acceso = await resolverAcceso(supabase, user.id, user.email);
  if (acceso.estado !== 'ok') return { monto: null, confianza: null };

  const inicio = Date.now();

  // El freno y el registro de gasto van con la clave de servicio. Si no está disponible, FALLA CERRADO:
  // no se llama a la IA y la persona escribe el monto a mano.
  let admin: ClienteAdmin;
  try {
    admin = crearClienteSupabaseAdmin();
  } catch {
    return { monto: null, confianza: null };
  }

  if (!(await dentroDelPresupuestoDiario(admin, user.id))) {
    await registrarLlamada(admin, user.id, { status: 'error', error: 'presupuesto_diario_agotado' });
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
    const modelo = process.env.AI_MODEL || MODELO_POR_DEFECTO;

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
    // El costo y el modelo anotados son los del modelo que REALMENTE respondió, no solo el configurado.
    const modeloReal = res.model || modelo;
    const costoUsd = calcularCostoUsd(modeloReal, res.usage.input_tokens, res.usage.output_tokens);

    await registrarLlamada(admin, user.id, {
      status: 'ok',
      tokensIn: res.usage.input_tokens,
      tokensOut: res.usage.output_tokens,
      costoUsd,
      latenciaMs: Date.now() - inicio,
      modelo: modeloReal,
    });

    if (!parsed.success) return { monto: null, confianza: null };
    return normalizar(parsed.data);
  } catch (e) {
    await registrarLlamada(admin, user.id, {
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

// Precio del modelo: coincidencia por el nombre MÁS LARGO que encaje, para que `claude-opus-5-5` no caiga en
// `claude-opus-5` y para aceptar nombres con fecha (`claude-haiku-4-5-20251001`).
function precioDelModelo(modelo: string): { entrada: number; salida: number } {
  let mejor: string | null = null;
  for (const nombre of Object.keys(PRECIOS_POR_1M)) {
    if ((modelo === nombre || modelo.startsWith(`${nombre}-`)) && (mejor === null || nombre.length > mejor.length)) {
      mejor = nombre;
    }
  }
  return mejor ? PRECIOS_POR_1M[mejor] : PRECIO_DESCONOCIDO;
}

function calcularCostoUsd(modelo: string, tokensIn: number, tokensOut: number): number {
  const precio = precioDelModelo(modelo);
  return (tokensIn / 1_000_000) * precio.entrada + (tokensOut / 1_000_000) * precio.salida;
}

type ClienteAdmin = ReturnType<typeof crearClienteSupabaseAdmin>;

// Le pregunta al servidor si todavía hay presupuesto: tope global del día y tope de lecturas de ESTA
// persona. La función de la base suma las llamadas de todos (cosa que un usuario no puede hacer por su
// cuenta) y devuelve solo un sí/no; solo se puede llamar con la clave de servicio.
//
// FALLA CERRADA A PROPÓSITO: si la función no existe todavía o la consulta falla, se responde
// "no hay presupuesto" y la lectura automática se apaga. Un freno de gasto que se abre solo cuando
// algo se rompe no es un freno (09-SEGURIDAD.md: nada de defaults inseguros). La persona no queda
// bloqueada: escribe el monto a mano, que es la salida que esta pantalla siempre tuvo.
async function dentroDelPresupuestoDiario(admin: ClienteAdmin, userId: string): Promise<boolean> {
  const { data, error } = await admin.rpc('presupuesto_ia_disponible', { p_user_id: userId, p_feature: FEATURE });
  if (error || typeof data !== 'boolean') return false;
  return data;
}

async function registrarLlamada(
  admin: ClienteAdmin,
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
  const { error } = await admin.from('ai_calls').insert({
    user_id: userId,
    feature: FEATURE,
    model: datos.modelo ?? (process.env.AI_MODEL || MODELO_POR_DEFECTO),
    tokens_in: datos.tokensIn ?? null,
    tokens_out: datos.tokensOut ?? null,
    cost_usd: datos.costoUsd ?? null,
    latency_ms: datos.latenciaMs ?? null,
    status: datos.status,
    error: datos.error ?? null,
  });
  // Una llamada que no se anota deja al freno "ciego" para esa lectura: se deja constancia en los logs del servidor.
  if (error) console.error('[ai_calls] no se pudo anotar una llamada de IA');
}
