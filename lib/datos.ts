// CAPA DE DATOS DE LA APP INTERNA — Sesión 5. Sin backend todavía (Sesión 6 conecta Supabase):
// todo vive en localStorage, con datos semilla realistas (32 — "la app nunca se enseña vacía").
// Tipos y forma de los datos ya pensados como el futuro esquema real (25-BASE-DE-DATOS.md),
// para que migrar a una base real después sea mecánico, no un rediseño.

export type TipoMovimiento = 'cuota' | 'gasto_extra';
export type EstadoAutorizacion = 'aprobada' | 'pendiente' | 'objetada';
export type TipoEvento = 'visita' | 'medica' | 'vacaciones' | 'extracurricular' | 'salida_pais';

export interface Titulo {
  montoMensual: number; // COP — el valor de la cuota alimentaria, no el precio de la suscripción
  diaPago: number; // día del mes en que se cobra
  indiceReajuste: string;
  fechaInicio: string; // ISO
}

export interface Pago {
  id: string;
  fecha: string; // ISO
  monto: number;
  concepto: string;
  tipo: TipoMovimiento;
  comprobanteNombre: string;
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
  documentoAdjunto?: string; // ej. permiso de salida del país — nombre real del archivo subido
}

const CLAVE_TITULO = 'coparentia_titulo';
const CLAVE_PAGOS = 'coparentia_pagos';
const CLAVE_AUTORIZACIONES = 'coparentia_autorizaciones';
const CLAVE_EVENTOS = 'coparentia_eventos';
const CLAVE_PRIMEROS_PASOS_COMPLETOS = 'coparentia_primeros_pasos_completos';

function leer<T>(clave: string): T | null {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function escribir<T>(clave: string, valor: T): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {}
}

// `tieneOnboardingCompleto` marca el FIN real de "primeros pasos" (cuota + primer comprobante
// subido) — nunca solo la cuota guardada. Si solo mirara el título, recargar la página entre el
// paso 1 y el paso 2 saltaría directo al dashboard mostrando datos semilla como si fueran del
// usuario (bug real encontrado por el revisor-visual, corregido aquí).
export function tieneOnboardingCompleto(): boolean {
  return leer<boolean>(CLAVE_PRIMEROS_PASOS_COMPLETOS) === true;
}

export function marcarPrimerosPasosCompletos(): void {
  escribir(CLAVE_PRIMEROS_PASOS_COMPLETOS, true);
}

export function obtenerTitulo(): Titulo | null {
  return leer<Titulo>(CLAVE_TITULO);
}

// Al guardar el título (arranque real de "primeros pasos") se inicializan pagos/autorizaciones/
// eventos en vacío — NUNCA con la semilla de demostración — para que el usuario real nunca vea
// datos que no son suyos mezclados con los que sí sube.
export function guardarTitulo(t: Titulo): void {
  escribir(CLAVE_TITULO, t);
  escribir(CLAVE_PAGOS, [] as Pago[]);
  escribir(CLAVE_AUTORIZACIONES, [] as Autorizacion[]);
  escribir(CLAVE_EVENTOS, [] as Evento[]);
}

function fechaISO(diasAtras: number): string {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  return d.toISOString().slice(0, 10);
}
function fechaFutura(diasAdelante: number): string {
  const d = new Date();
  d.setDate(d.getDate() + diasAdelante);
  return d.toISOString().slice(0, 10);
}

function pagosSemilla(): Pago[] {
  return [
    { id: 'p1', fecha: fechaISO(3), monto: 450000, concepto: 'Cuota de septiembre', tipo: 'cuota', comprobanteNombre: 'transferencia_sept.pdf' },
    { id: 'p2', fecha: fechaISO(34), monto: 450000, concepto: 'Cuota de agosto', tipo: 'cuota', comprobanteNombre: 'transferencia_ago.pdf' },
    { id: 'p3', fecha: fechaISO(40), monto: 180000, concepto: 'Matrícula extracurricular — natación', tipo: 'gasto_extra', comprobanteNombre: 'recibo_natacion.jpg' },
    { id: 'p4', fecha: fechaISO(65), monto: 450000, concepto: 'Cuota de julio', tipo: 'cuota', comprobanteNombre: 'transferencia_jul.pdf' },
    { id: 'p5', fecha: fechaISO(96), monto: 450000, concepto: 'Cuota de junio', tipo: 'cuota', comprobanteNombre: 'transferencia_jun.pdf' },
    { id: 'p6', fecha: fechaISO(110), monto: 95000, concepto: 'Medicamentos — control pediatra', tipo: 'gasto_extra', comprobanteNombre: 'factura_farmacia.jpg' },
  ];
}

function autorizacionesSemilla(): Autorizacion[] {
  return [
    { id: 'a1', fecha: fechaISO(40), concepto: 'Matrícula extracurricular — natación', monto: 180000, estado: 'aprobada' },
    { id: 'a2', fecha: fechaISO(12), concepto: 'Uniforme nuevo de colegio', monto: 130000, estado: 'pendiente', nota: 'Esperando respuesta por WhatsApp desde hace 5 días.' },
    { id: 'a3', fecha: fechaISO(58), concepto: 'Consulta con especialista', monto: 220000, estado: 'objetada', nota: 'Se objetó por no ser gasto médico urgente — quedó registrado con la respuesta completa.' },
  ];
}

function eventosSemilla(): Evento[] {
  return [
    { id: 'e1', fecha: fechaFutura(2), tipo: 'visita', titulo: 'Fin de semana con papá' },
    { id: 'e2', fecha: fechaFutura(6), tipo: 'medica', titulo: 'Control pediatra — Dra. Ramírez' },
    { id: 'e3', fecha: fechaFutura(14), tipo: 'extracurricular', titulo: 'Clase de natación' },
    { id: 'e4', fecha: fechaFutura(30), tipo: 'vacaciones', titulo: 'Vacaciones de mitad de año' },
    { id: 'e5', fecha: fechaISO(5), tipo: 'visita', titulo: 'Fin de semana con papá' },
    { id: 'e6', fecha: fechaFutura(38), tipo: 'salida_pais', titulo: 'Viaje a Panamá con mamá', documentoAdjunto: 'permiso_salida_notariado.pdf' },
  ];
}

export function obtenerPagos(): Pago[] {
  let p = leer<Pago[]>(CLAVE_PAGOS);
  if (!p) {
    p = pagosSemilla();
    escribir(CLAVE_PAGOS, p);
  }
  return p;
}

export function agregarPago(pago: Omit<Pago, 'id'>): Pago {
  const nuevo: Pago = { ...pago, id: `p${Date.now()}` };
  const actuales = obtenerPagos();
  const actualizados = [nuevo, ...actuales];
  escribir(CLAVE_PAGOS, actualizados);
  return nuevo;
}

export function obtenerAutorizaciones(): Autorizacion[] {
  let a = leer<Autorizacion[]>(CLAVE_AUTORIZACIONES);
  if (!a) {
    a = autorizacionesSemilla();
    escribir(CLAVE_AUTORIZACIONES, a);
  }
  return a;
}

export function agregarAutorizacion(auth: Omit<Autorizacion, 'id'>): Autorizacion {
  const nueva: Autorizacion = { ...auth, id: `a${Date.now()}` };
  const actuales = obtenerAutorizaciones();
  escribir(CLAVE_AUTORIZACIONES, [nueva, ...actuales]);
  return nueva;
}

export function obtenerEventos(): Evento[] {
  let e = leer<Evento[]>(CLAVE_EVENTOS);
  if (!e) {
    e = eventosSemilla();
    escribir(CLAVE_EVENTOS, e);
  }
  return e;
}

export function agregarEvento(evento: Omit<Evento, 'id'>): Evento {
  const nuevo: Evento = { ...evento, id: `e${Date.now()}` };
  const actuales = obtenerEventos();
  escribir(CLAVE_EVENTOS, [...actuales, nuevo]);
  return nuevo;
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
