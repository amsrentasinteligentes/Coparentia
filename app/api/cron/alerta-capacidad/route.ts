// ALERTA DE CAPACIDAD (2026-10-22) — lo llama Vercel una vez al día (vercel.json). Mide cuánto del plan gratuito de
// Supabase se está usando y le escribe AL DUEÑO (a soporte@coparentia.co, que llega a su correo) cuando conviene pasar a
// Pro. No toca datos de clientes: solo lee tamaños y conteos con la función `uso_del_proyecto` (supabase/alerta-capacidad.sql).
//
// Cuándo avisa:
//   · base de datos ≥ 70% del tope gratuito (500 MB);
//   · fotos de comprobantes ≥ 70% del tope gratuito (1 GB) — lo primero que se llena;
//   · ya hay clientes que pagaron (≥ CLIENTES_PARA_PRO): el plan gratuito no guarda copias de seguridad restaurables;
//   · ≥ 50 personas pidieron un correo de acceso en 24 h: el plan gratuito de Resend se llena a los 100 correos al día.
// Cada aviso se repite como máximo cada 7 días (tabla `alertas_capacidad`).
// NO se puede medir desde aquí: las descargas del mes (egress, tope 5 GB) ni los usuarios activos del mes; el correo
// recuerda revisarlos a mano en Supabase → Reports.
//
// `?prueba=1` (con el mismo secreto) manda un correo de muestra con los valores reales y NO toca la memoria de envíos.
// Seguridad: misma puerta que el resto de los crons — `Authorization: Bearer $CRON_SECRET` en tiempo constante.

import { NextResponse } from 'next/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { enviarCorreoAlertaCapacidad, type AvisoCapacidad } from '@/lib/email';
import { comparacionSegura } from '@/lib/hotmart-verify';
import { reportarError } from '@/lib/monitoreo';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Topes del plan gratuito de Supabase (verificar en supabase.com/pricing: pueden cambiar).
const TOPE_DB_MB = 500;
const TOPE_STORAGE_MB = 1024;
const UMBRAL = 0.7;
const CLIENTES_PARA_PRO = 3;
const REAVISO_MS = 7 * 86_400_000;
const MB = 1024 * 1024;

// Resend (plan gratuito) permite 100 correos al día. Como el acceso es por código de correo, cada ingreso gasta uno; se avisa a
// partir de 50 personas distintas en 24 h (aproximación por debajo, ver supabase/alerta-capacidad.sql). `correos_acceso_24h` es
// opcional: si el dueño todavía no volvió a correr el SQL, la función no lo devuelve y este aviso simplemente no se evalúa.
const UMBRAL_CORREOS_ACCESO = 50;
const TOPE_RESEND_DIA = 100;

type Uso = {
  db_bytes: number;
  storage_bytes: number;
  usuarios: number;
  suscripciones_con_cobro: number;
  correos_acceso_24h?: number;
};

export async function GET(request: Request): Promise<NextResponse> {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 503 });
  }
  if (!comparacionSegura(request.headers.get('authorization') ?? '', `Bearer ${secreto}`)) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }
  const prueba = new URL(request.url).searchParams.get('prueba') === '1';

  const admin = crearClienteSupabaseAdmin();
  const { data, error } = await admin.rpc('uso_del_proyecto');
  if (error || !data) {
    console.error('cron alerta-capacidad: no se pudo leer el uso', error?.message);
    reportarError('cron alerta-capacidad: no se pudo leer el uso');
    return NextResponse.json({ error: 'fallo al leer el uso' }, { status: 500 });
  }
  const uso = data as Uso;
  const dbMb = uso.db_bytes / MB;
  const storageMb = uso.storage_bytes / MB;

  const avisos: (AvisoCapacidad & { clave: string })[] = [];
  if (dbMb >= TOPE_DB_MB * UMBRAL) {
    avisos.push({
      clave: 'db',
      titulo: `La base de datos va por el ${Math.round((dbMb / TOPE_DB_MB) * 100)}% del plan gratuito`,
      detalle: `Usa ${dbMb.toFixed(0)} MB de ${TOPE_DB_MB} MB. Conviene pasar a Supabase Pro antes de llegar al tope.`,
    });
  }
  if (storageMb >= TOPE_STORAGE_MB * UMBRAL) {
    avisos.push({
      clave: 'storage',
      titulo: `Las fotos de comprobantes van por el ${Math.round((storageMb / TOPE_STORAGE_MB) * 100)}% del plan gratuito`,
      detalle: `Usan ${storageMb.toFixed(0)} MB de ${TOPE_STORAGE_MB} MB. Es lo primero que se llena: conviene pasar a Supabase Pro antes de llegar al tope.`,
    });
  }
  if (uso.suscripciones_con_cobro >= CLIENTES_PARA_PRO) {
    avisos.push({
      clave: 'clientes',
      titulo: `Ya tienes ${uso.suscripciones_con_cobro} clientes que pagan`,
      detalle:
        'El plan gratuito de Supabase no guarda copias de seguridad restaurables y se pausa tras una semana sin actividad. Con clientes pagando, conviene pasar a Supabase Pro (US$25/mes).',
    });
  }

  if (typeof uso.correos_acceso_24h === 'number' && uso.correos_acceso_24h >= UMBRAL_CORREOS_ACCESO) {
    avisos.push({
      clave: 'correos',
      titulo: `${uso.correos_acceso_24h} personas pidieron acceso en las últimas 24 horas`,
      detalle: `El plan gratuito de Resend permite ${TOPE_RESEND_DIA} correos al día en total y esta cifra es una aproximación por debajo. Si el tope se llena, quien pida su código ese día no lo recibe. Conviene pasar Resend a un plan pago y subir el límite de correos por hora de Supabase (Authentication → Rate Limits) antes de seguir con publicidad.`,
    });
  }

  const resumen = {
    dbMb: Math.round(dbMb),
    storageMb: Math.round(storageMb),
    usuarios: uso.usuarios,
    suscripcionesConCobro: uso.suscripciones_con_cobro,
  };

  if (prueba) {
    const enviado = await enviarCorreoAlertaCapacidad(
      avisos.length > 0
        ? avisos
        : [{ titulo: 'Prueba: todo en orden por ahora', detalle: 'Este es un correo de muestra; todavía no hay nada que avisar.' }],
      resumen,
      true
    );
    return NextResponse.json({ prueba: true, enviado, resumen, avisos: avisos.map((a) => a.clave) });
  }

  // Solo se avisa lo que no se avisó en los últimos 7 días.
  const { data: previos } = await admin.from('alertas_capacidad').select('clave, ultimo_envio');
  const ultimo = new Map((previos ?? []).map((p) => [p.clave as string, new Date(p.ultimo_envio as string).getTime()]));
  const ahora = Date.now();
  const nuevos = avisos.filter((a) => ahora - (ultimo.get(a.clave) ?? 0) >= REAVISO_MS);

  let enviado = false;
  if (nuevos.length > 0) {
    enviado = await enviarCorreoAlertaCapacidad(nuevos, resumen, false);
    if (enviado) {
      await admin
        .from('alertas_capacidad')
        .upsert(nuevos.map((a) => ({ clave: a.clave, ultimo_envio: new Date(ahora).toISOString() })));
    }
  }

  return NextResponse.json({
    resumen,
    avisos: avisos.map((a) => a.clave),
    enviados: enviado ? nuevos.map((a) => a.clave) : [],
  });
}
