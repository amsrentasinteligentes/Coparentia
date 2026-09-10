// CAPA DE DATOS DE LA APP INTERNA — Sesión 6: conectada a Supabase de verdad (supabase/schema.sql).
// Mismos tipos y firmas de función que la Sesión 5 (localStorage) para que las pantallas casi no
// cambien — ahora cada función habla con la base real, filtrada por el usuario autenticado (RLS
// en el servidor lo refuerza igual si algo se nos escapa aquí).

import { crearClienteSupabase } from '@/lib/supabase/client';

export type TipoMovimiento = 'cuota' | 'gasto_extra';
export type EstadoAutorizacion = 'aprobada' | 'pendiente' | 'objetada';
export type TipoEvento = 'visita' | 'medica' | 'vacaciones' | 'extracurricular' | 'salida_pais';

export interface Titulo {
  montoMensual: number; // COP — el valor de la cuota alimentaria, no el precio de la suscripción
  diaPago: number; // día del mes en que se cobra
  indiceReajuste: string;
  fechaInicio: string; // ISO
  acuerdoPath?: string; // ruta en Storage del acta de conciliación / sentencia que fija la cuota
  acuerdoNombre?: string; // nombre real del archivo subido
}

export interface Pago {
  id: string;
  fecha: string; // ISO
  monto: number;
  concepto: string;
  tipo: TipoMovimiento;
  comprobanteNombre: string;
  comprobantePath?: string; // ruta real en Supabase Storage (bucket "comprobantes")
}

export interface Autorizacion {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  estado: EstadoAutorizacion;
  nota?: string;
}

export interface Evento {
  id: string;
  fecha: string; // ISO
  tipo: TipoEvento;
  titulo: string;
  nota?: string;
  documentoAdjunto?: string; // nombre real del archivo subido (fórmula médica, permiso, etc.)
  documentoAdjuntoPath?: string; // ruta real en Supabase Storage (bucket "comprobantes")
}

// Anota una acción real en event_log (36-ANALITICA-Y-EVENTOS.md) — es lo que el panel de
// administración lee en "Uso de la app". Nunca bloquea ni rompe la acción principal: si el
// registro falla (ej. la tabla no existe todavía en una instalación vieja), se ignora en
// silencio — guardar el pago/evento del usuario importa más que anotar que se guardó.
async function registrarEvento(supabase: ReturnType<typeof crearClienteSupabase>, userId: string, nombre: string): Promise<void> {
  try {
    await supabase.from('event_log').insert({ user_id: userId, nombre, propiedades: {} });
  } catch {
    // silencioso a propósito — ver comentario de arriba
  }
}

async function usuarioActual() {
  const supabase = crearClienteSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No hay sesión activa.');
  return { supabase, userId: user.id };
}

function mapPago(row: {
  id: string;
  fecha: string;
  monto: number | string;
  concepto: string;
  tipo: TipoMovimiento;
  comprobante_nombre: string;
  comprobante_path: string | null;
}): Pago {
  return {
    id: row.id,
    fecha: row.fecha,
    monto: Number(row.monto),
    concepto: row.concepto,
    tipo: row.tipo,
    comprobanteNombre: row.comprobante_nombre,
    comprobantePath: row.comprobante_path ?? undefined,
  };
}

function mapAutorizacion(row: {
  id: string;
  fecha: string;
  concepto: string;
  monto: number | string;
  estado: EstadoAutorizacion;
  nota: string | null;
}): Autorizacion {
  return {
    id: row.id,
    fecha: row.fecha,
    concepto: row.concepto,
    monto: Number(row.monto),
    estado: row.estado,
    nota: row.nota ?? undefined,
  };
}

function mapEvento(row: {
  id: string;
  fecha: string;
  tipo: TipoEvento;
  titulo: string;
  nota: string | null;
  documento_adjunto: string | null;
  documento_adjunto_path: string | null;
}): Evento {
  return {
    id: row.id,
    fecha: row.fecha,
    tipo: row.tipo,
    titulo: row.titulo,
    nota: row.nota ?? undefined,
    documentoAdjunto: row.documento_adjunto ?? undefined,
    documentoAdjuntoPath: row.documento_adjunto_path ?? undefined,
  };
}

// `tieneOnboardingCompleto` marca el FIN real de "primeros pasos" (cuota + primer comprobante
// subido) — nunca solo la cuota guardada. Se deriva de datos reales (título creado Y al menos un
// pago) en vez de una bandera aparte, así nunca puede quedar desincronizada de lo que hay guardado.
export async function tieneOnboardingCompleto(): Promise<boolean> {
  const { supabase, userId } = await usuarioActual();
  const [{ data: titulo }, { count }] = await Promise.all([
    supabase.from('titulos').select('id').eq('user_id', userId).maybeSingle(),
    supabase.from('pagos').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ]);
  return Boolean(titulo) && (count ?? 0) > 0;
}

export async function obtenerTitulo(): Promise<Titulo | null> {
  const { supabase, userId } = await usuarioActual();
  const { data } = await supabase.from('titulos').select('*').eq('user_id', userId).maybeSingle();
  if (!data) return null;
  return {
    montoMensual: Number(data.monto_mensual),
    diaPago: data.dia_pago,
    indiceReajuste: data.indice_reajuste,
    fechaInicio: data.fecha_inicio,
    acuerdoPath: data.acuerdo_path ?? undefined,
    acuerdoNombre: data.acuerdo_nombre ?? undefined,
  };
}

export async function guardarTitulo(t: Titulo): Promise<void> {
  const { supabase, userId } = await usuarioActual();
  const { error } = await supabase.from('titulos').upsert(
    {
      user_id: userId,
      monto_mensual: t.montoMensual,
      dia_pago: t.diaPago,
      indice_reajuste: t.indiceReajuste,
      fecha_inicio: t.fechaInicio,
    },
    { onConflict: 'user_id' }
  );
  if (error) throw error;
  registrarEvento(supabase, userId, 'titulo_guardado');
}

// ── ACUERDO DE LA CUOTA (acta de conciliación o sentencia) ──────────────────────
// El documento base que fija la cuota. Se guarda como referencia en la fila del título
// (una por usuario) + el archivo real en la carpeta "{userId}/acuerdo/" del bucket privado.
// Al reemplazar, el archivo viejo se borra DESPUÉS de que la fila ya apunta al nuevo, así la
// referencia nunca queda apuntando a un archivo inexistente.
export async function guardarAcuerdo(archivo: File): Promise<Pick<Titulo, 'acuerdoPath' | 'acuerdoNombre'>> {
  const { supabase, userId } = await usuarioActual();
  const { data: actual } = await supabase
    .from('titulos')
    .select('acuerdo_path')
    .eq('user_id', userId)
    .maybeSingle();

  const ruta = await subirArchivoPrivado(userId, 'acuerdo', archivo);
  const { data, error } = await supabase
    .from('titulos')
    .update({ acuerdo_path: ruta, acuerdo_nombre: archivo.name })
    .eq('user_id', userId)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    // Sin fila de título que actualizar, el archivo recién subido quedaría huérfano: se borra.
    await supabase.storage.from('comprobantes').remove([ruta]);
    throw error ?? new Error('Primero configura tu cuota en Ajustes para guardar el acuerdo.');
  }

  if (actual?.acuerdo_path && actual.acuerdo_path !== ruta) {
    await supabase.storage.from('comprobantes').remove([actual.acuerdo_path]);
  }
  registrarEvento(supabase, userId, 'acuerdo_guardado');
  return { acuerdoPath: ruta, acuerdoNombre: archivo.name };
}

export async function quitarAcuerdo(): Promise<void> {
  const { supabase, userId } = await usuarioActual();
  const { data: actual } = await supabase
    .from('titulos')
    .select('acuerdo_path')
    .eq('user_id', userId)
    .maybeSingle();

  if (actual?.acuerdo_path) {
    await supabase.storage.from('comprobantes').remove([actual.acuerdo_path]);
  }
  const { error } = await supabase
    .from('titulos')
    .update({ acuerdo_path: null, acuerdo_nombre: null })
    .eq('user_id', userId);
  if (error) throw error;
  registrarEvento(supabase, userId, 'acuerdo_eliminado');
}

export async function obtenerPagos(): Promise<Pago[]> {
  const { supabase, userId } = await usuarioActual();
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false });
  // Antes se ignoraba `error` y se devolvía `[]`: si la consulta fallaba (red caída, sesión
  // vencida), la app mostraba el expediente VACÍO — indistinguible de "no tienes nada guardado".
  // En una app cuya promesa entera es "tus pruebas están a salvo", ese vacío es una MENTIRA
  // alarmante. Ahora el fallo se propaga para que la pantalla muestre un error con reintento.
  if (error) throw error;
  return (data ?? []).map(mapPago);
}

// Elimina un movimiento y SU ARCHIVO. No existía ninguna forma de borrar: una foto equivocada
// —la del recibo del vecino, una captura mal tomada, un duplicado— quedaba para siempre dentro del
// expediente que se va a llevar a un juzgado, y ahora además se incrusta en el PDF que se le
// entrega al abogado. Un registro que no se puede corregir no es un expediente confiable.
// El archivo de Storage se borra ANTES que la fila: si se borrara después y algo fallara en el
// medio, quedaría un archivo huérfano sin ninguna fila que lo referencie, imposible de encontrar.
export async function eliminarPago(pago: Pago): Promise<void> {
  const { supabase, userId } = await usuarioActual();

  if (pago.comprobantePath) {
    await supabase.storage.from('comprobantes').remove([pago.comprobantePath]);
  }

  const { error } = await supabase.from('pagos').delete().eq('id', pago.id).eq('user_id', userId);
  if (error) throw error;
  registrarEvento(supabase, userId, 'pago_eliminado');
}

// Valida tamaño/tipo ANTES de subir — mismo tope que se aplica del lado del servidor en el bucket
// (supabase/fix-limites-storage.sql), para que el usuario vea un mensaje claro al elegir el
// archivo en vez de un error de red genérico cuando Supabase lo rechace en el servidor.
const TIPOS_ADJUNTO_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
const TAMANO_MAXIMO_ADJUNTO = 15 * 1024 * 1024; // 15 MB

export function validarArchivoAdjunto(archivo: File): string | null {
  if (archivo.size > TAMANO_MAXIMO_ADJUNTO) return 'El archivo pesa más de 15 MB. Elige uno más liviano.';
  if (archivo.type && !TIPOS_ADJUNTO_PERMITIDOS.includes(archivo.type)) return 'Ese tipo de archivo no se puede adjuntar. Usa una foto o un PDF.';
  return null;
}

// Sube el archivo REAL (foto/PDF) al bucket privado "comprobantes" — cada usuario tiene su
// propia carpeta (`{userId}/...`), reforzada por las políticas de supabase/storage.sql; `carpeta`
// separa por tipo (pagos/eventos) dentro de esa misma carpeta del usuario, sin necesitar otro
// bucket ni otra política. Antes de esto, la app solo guardaba el NOMBRE del archivo — nunca el
// archivo en sí, así que no había forma de comprobar que el comprobante existiera de verdad
// (hallazgo real de un usuario probando en su celular).
async function subirArchivoPrivado(userId: string, carpeta: 'pagos' | 'eventos' | 'acuerdo', archivo: File): Promise<string> {
  const supabase = crearClienteSupabase();
  const nombreSeguro = archivo.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ruta = `${userId}/${carpeta}/${Date.now()}_${nombreSeguro}`;
  const { error } = await supabase.storage.from('comprobantes').upload(ruta, archivo);
  if (error) throw error;
  return ruta;
}

// URL firmada y temporal (10 min) para ver/descargar un archivo real (comprobante de pago o
// documento de un evento) — el bucket es privado, así que nunca hay un link público permanente.
export async function obtenerUrlArchivo(ruta: string): Promise<string | null> {
  const supabase = crearClienteSupabase();
  const { data, error } = await supabase.storage.from('comprobantes').createSignedUrl(ruta, 600);
  if (error || !data) return null;
  return data.signedUrl;
}

export async function agregarPago(pago: Omit<Pago, 'id' | 'comprobantePath'>, archivo: File): Promise<Pago> {
  const { supabase, userId } = await usuarioActual();
  const rutaComprobante = await subirArchivoPrivado(userId, 'pagos', archivo);
  const { data, error } = await supabase
    .from('pagos')
    .insert({
      user_id: userId,
      fecha: pago.fecha,
      monto: pago.monto,
      concepto: pago.concepto,
      tipo: pago.tipo,
      comprobante_nombre: pago.comprobanteNombre,
      comprobante_path: rutaComprobante,
    })
    .select()
    .single();
  if (error || !data) throw error ?? new Error('No se pudo guardar el pago.');
  registrarEvento(supabase, userId, 'pago_agregado');
  return mapPago(data);
}

export async function obtenerAutorizaciones(): Promise<Autorizacion[]> {
  const { supabase, userId } = await usuarioActual();
  const { data } = await supabase
    .from('autorizaciones')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false });
  return (data ?? []).map(mapAutorizacion);
}

export async function agregarAutorizacion(auth: Omit<Autorizacion, 'id'>): Promise<Autorizacion> {
  const { supabase, userId } = await usuarioActual();
  const { data, error } = await supabase
    .from('autorizaciones')
    .insert({
      user_id: userId,
      fecha: auth.fecha,
      concepto: auth.concepto,
      monto: auth.monto,
      estado: auth.estado,
      nota: auth.nota ?? null,
    })
    .select()
    .single();
  if (error || !data) throw error ?? new Error('No se pudo guardar la autorización.');
  registrarEvento(supabase, userId, 'autorizacion_agregada');
  return mapAutorizacion(data);
}

export async function obtenerEventos(): Promise<Evento[]> {
  const { supabase, userId } = await usuarioActual();
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: true });
  // Mismo criterio que en obtenerPagos: un fallo NUNCA se disfraza de "no hay nada".
  if (error) throw error;
  return (data ?? []).map(mapEvento);
}

export async function agregarEvento(
  evento: Omit<Evento, 'id' | 'documentoAdjuntoPath'>,
  archivo?: File
): Promise<Evento> {
  const { supabase, userId } = await usuarioActual();
  const rutaDocumento = archivo ? await subirArchivoPrivado(userId, 'eventos', archivo) : null;
  const { data, error } = await supabase
    .from('eventos')
    .insert({
      user_id: userId,
      fecha: evento.fecha,
      tipo: evento.tipo,
      titulo: evento.titulo,
      nota: evento.nota ?? null,
      documento_adjunto: evento.documentoAdjunto ?? null,
      documento_adjunto_path: rutaDocumento,
    })
    .select()
    .single();
  if (error || !data) throw error ?? new Error('No se pudo guardar el evento.');
  registrarEvento(supabase, userId, 'evento_agregado');
  return mapEvento(data);
}

export function formatoCOP(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

export function formatoFechaCorta(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

export function formatoFechaLarga(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}
