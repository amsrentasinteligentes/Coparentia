'use client';

// CALENDARIO — visitas, citas médicas, vacaciones y actividades (MVP #5, aprobado 2026-09-07).
// Registro UNILATERAL de eventos propios — no depende de que nadie más lo use ni lo acepte (regla
// 13 del SO: navegación real entre meses con fechas reales, nunca "esta semana" a secas).
// Ampliado a pedido del usuario (2026-09-09): calendario visual del mes (aprovecha el espacio
// libre en pantallas grandes — regla 43 §13 "desktop sin vergüenza"; en celular queda apilado,
// una sola columna) + adjunto de archivo real en CUALQUIER tipo de evento, no solo salida del
// país (ej. la fórmula médica real de una cita).

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, X, Users, HeartPulse, Plane, Trophy, Globe, Paperclip, CalendarDays, Phone, Video, ShieldCheck, PhoneOff, PhoneMissed, Clock, Loader2 } from 'lucide-react';
import { SelloConfianza } from '@/components/app/SelloConfianza';
import { ContenedorApp, Tarjeta, IconoCirculo, BotonFlotante, ErrorDeCarga, CabeceraApp, TituloSeccion, NumeroContado } from '@/components/app/ui';
import { VisorImagen } from '@/components/app/VisorImagen';
import { Portal } from '@/components/app/Portal';
import { SelectorHijo, useHijos, type ValorHijo } from '@/components/app/SelectorHijo';
import { type Hijo } from '@/lib/perfil';
import { type Evento, type TipoEvento, type MedioContacto, type ResultadoContacto, esContacto, obtenerEventos, agregarEvento, obtenerUrlArchivo, formatoFechaLarga, formatoFechaCorta, validarArchivoAdjunto } from '@/lib/datos';
import { hoyEnColombia } from '@/lib/fecha';

// CONTACTO CON LOS HIJOS (2026-09-21): dos tipos nuevos —llamada y videollamada— que registran el
// HECHO del contacto (fecha, hora, duración, medio, si contestaron) como prueba de presencia.
// Unilateral (no depende de la otra parte), con Sello de Confianza y sin edición ni borrado.
const ICONO: Record<TipoEvento, typeof Users> = { visita: Users, medica: HeartPulse, vacaciones: Plane, extracurricular: Trophy, salida_pais: Globe, llamada: Phone, videollamada: Video };
const LABEL: Record<TipoEvento, string> = { visita: 'Visita', medica: 'Cita médica', vacaciones: 'Vacaciones', extracurricular: 'Actividad', salida_pais: 'Salida del país', llamada: 'Llamada', videollamada: 'Videollamada' };
const LABEL_ADJUNTO: Record<TipoEvento, string> = {
  visita: 'Adjuntar un documento (opcional)',
  medica: 'Fórmula médica o resultado (opcional)',
  vacaciones: 'Adjuntar un documento (opcional)',
  extracurricular: 'Adjuntar un documento (opcional)',
  salida_pais: 'Permiso de salida del país',
  llamada: 'Captura del registro de llamadas (recomendado)',
  videollamada: 'Captura de la videollamada (recomendado)',
};
const MEDIOS: { valor: MedioContacto; label: string; soloEn?: TipoEvento }[] = [
  { valor: 'llamada', label: 'Llamada normal', soloEn: 'llamada' },
  { valor: 'whatsapp', label: 'WhatsApp' },
  { valor: 'videollamada', label: 'Meet / Zoom / FaceTime', soloEn: 'videollamada' },
  { valor: 'otro', label: 'Otro' },
];
const RESULTADOS: { valor: ResultadoContacto; label: string; icon: typeof Phone }[] = [
  { valor: 'contestada', label: 'Contestó', icon: Phone },
  { valor: 'no_contestada', label: 'No contestó', icon: PhoneMissed },
  { valor: 'no_posible', label: 'No fue posible', icon: PhoneOff },
];
const LABEL_RESULTADO: Record<ResultadoContacto, string> = { contestada: 'Contestó', no_contestada: 'No contestó', no_posible: 'No fue posible' };
const LABEL_MEDIO: Record<MedioContacto, string> = { llamada: 'llamada normal', whatsapp: 'WhatsApp', videollamada: 'videollamada', otro: 'otro medio' };
const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
// Un color por tipo de evento (referencia del usuario: puntos y chips de colores por categoría).
const COLOR: Record<TipoEvento, { fg: string; bg: string }> = {
  visita: { fg: 'var(--cat-visita)', bg: 'var(--cat-visita-bg)' },
  medica: { fg: 'var(--cat-medica)', bg: 'var(--cat-medica-bg)' },
  vacaciones: { fg: 'var(--cat-vacaciones)', bg: 'var(--cat-vacaciones-bg)' },
  extracurricular: { fg: 'var(--cat-extra)', bg: 'var(--cat-extra-bg)' },
  salida_pais: { fg: 'var(--cat-salida)', bg: 'var(--cat-salida-bg)' },
  llamada: { fg: 'var(--cat-llamada)', bg: 'var(--cat-llamada-bg)' },
  videollamada: { fg: 'var(--cat-video)', bg: 'var(--cat-video-bg)' },
};
const LABEL_CONTEO: Record<TipoEvento, (n: number) => string> = {
  visita: (n) => (n === 1 ? '1 visita' : `${n} visitas`),
  medica: (n) => (n === 1 ? '1 cita médica' : `${n} citas médicas`),
  vacaciones: (n) => (n === 1 ? '1 período de vacaciones' : `${n} períodos de vacaciones`),
  extracurricular: (n) => (n === 1 ? '1 actividad' : `${n} actividades`),
  salida_pais: (n) => (n === 1 ? '1 salida del país' : `${n} salidas del país`),
  llamada: (n) => (n === 1 ? '1 llamada' : `${n} llamadas`),
  videollamada: (n) => (n === 1 ? '1 videollamada' : `${n} videollamadas`),
};

function claveMes(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function nombreMes(d: Date): string {
  const s = d.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function horaHumana(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h)) return hhmm;
  return new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(2000, 0, 1, h, m));
}
function fechaISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Calendario() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mesActual, setMesActual] = useState(() => new Date());
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaModal, setFechaModal] = useState<string | undefined>(undefined);
  const [selloDe, setSelloDe] = useState<string | null>(null);
  // Hijos del perfil: cada evento puede quedar a nombre de uno ("Cita médica · Sofía").
  const { hijos } = useHijos();

  // Igual que en Inicio y Pagos: un fallo de red mostraba el mes VACÍO, indistinguible de
  // "no tienes eventos registrados".
  const [falloCarga, setFalloCarga] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;
    setFalloCarga(false);
    setCargando(true);
    obtenerEventos()
      .then((r) => {
        if (vigente) setEventos(r);
      })
      .catch(() => {
        if (vigente) setFalloCarga(true);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, [intento]);

  const delMes = eventos
    .filter((e) => e.fecha.slice(0, 7) === claveMes(mesActual))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const abrirModalEnFecha = (fecha: string): void => {
    setFechaModal(fecha);
    setModalAbierto(true);
  };

  const hoyISO = hoyEnColombia();
  const deHoy = delMes.filter((e) => e.fecha === hoyISO);
  const proximos = delMes.filter((e) => e.fecha >= hoyISO).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const listaAgenda = proximos.length > 0 ? proximos : delMes;
  const tituloAgenda = deHoy.length > 0 ? (proximos.length > deHoy.length ? 'Hoy y próximos' : `Hoy · ${formatoFechaCorta(hoyISO)}`) : proximos.length > 0 ? 'Próximos este mes' : `Eventos de ${nombreMes(mesActual)}`;
  const conteo = new Map<TipoEvento, number>();
  for (const e of delMes) conteo.set(e.tipo, (conteo.get(e.tipo) ?? 0) + 1);

  return (
    <>
      <CabeceraApp aviso={proximos.length > 0} />
      <ContenedorApp conFab sinTope>
        <TituloSeccion titulo="Calendario" subtitulo="Organiza visitas, citas y actividades de tus hijos." icon={CalendarDays} />

        {/* Celular: una columna; computador: lista a la izquierda, calendario a la derecha. */}
        <div className="mt-4 flex flex-col gap-3 md:grid md:grid-cols-2 md:items-start md:gap-4">
          <div className="md:order-2 flex flex-col gap-3">
            <CalendarioMes
              mesActual={mesActual}
              eventos={eventos}
              onDiaClick={abrirModalEnFecha}
              onMesAnterior={() => setMesActual((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              onMesSiguiente={() => setMesActual((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            />
          </div>

          <div className="md:order-1 flex flex-col gap-3">
            {falloCarga && <ErrorDeCarga onReintentar={() => setIntento((n) => n + 1)} />}
            {!falloCarga && (
              <Tarjeta indice={1} destacada>
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">{tituloAgenda}</h2>
                  <span className="text-[12px] text-[var(--text-secondary)]">{delMes.length} este mes</span>
                </div>
                {cargando ? (
                  // Esqueleto con la forma de dos filas: el vacío "Sin eventos" solo cuando ya se sabe.
                  <ul className="mt-1 flex flex-col" aria-busy="true" aria-label="Cargando eventos">
                    {[0, 1].map((i) => (
                      <li key={i} className={`flex items-center gap-3 py-2.5 ${i > 0 ? 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]' : ''}`}>
                        <span className="size-11 rounded-[var(--radius-button)] bg-[var(--surface-2)] motion-safe:animate-pulse" />
                        <span className="size-10 rounded-full bg-[var(--surface-2)] motion-safe:animate-pulse" />
                        <span className="flex flex-1 flex-col gap-2"><span className="h-3 w-24 rounded-full bg-[var(--surface-2)] motion-safe:animate-pulse" /><span className="h-3.5 w-40 rounded-full bg-[var(--surface-2)] motion-safe:animate-pulse" /></span>
                      </li>
                    ))}
                  </ul>
                ) : listaAgenda.length === 0 ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <IconoCirculo icon={CalendarDays} size={22} />
                    <p className="mt-3 text-[14px] font-bold text-[var(--text-primary)]">Sin eventos este mes</p>
                    <p className="mt-1 max-w-[30ch] text-[13px] text-[var(--text-secondary)]">Toca un día del calendario o el botón "Nuevo evento" para registrar una visita, una cita o una llamada.</p>
                  </div>
                ) : (
                  <ul className="mt-1 flex flex-col">
                    {listaAgenda.map((e, i) => (
                      <li key={e.id} className={i > 0 ? 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]' : ''}>
                        <TarjetaEvento evento={e} />
                      </li>
                    ))}
                  </ul>
                )}
              </Tarjeta>
            )}

            {/* Cifras del mes por categoría (las tres tarjetitas de la referencia) */}
            {conteo.size > 0 && (
              <div className={`grid gap-2 ${conteo.size > 3 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {Array.from(conteo.entries()).map(([tipo, n], i) => {
                  const Icon = ICONO[tipo];
                  return (
                    <Tarjeta key={tipo} indice={2 + i} className="flex items-center gap-3 p-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)]" style={{ background: COLOR[tipo].bg, color: COLOR[tipo].fg }}>
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[28px] font-extrabold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]"><NumeroContado valor={n} /></p>
                        <p className="mt-1 truncate text-[12px] leading-tight text-[var(--text-secondary)]">{LABEL_CONTEO[tipo](n).replace(/^\d+ /, '')}</p>
                      </div>
                    </Tarjeta>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      <BotonFlotante
        onClick={() => {
          setFechaModal(undefined);
          setModalAbierto(true);
        }}
      >
        <Plus size={18} aria-hidden="true" />
        Nuevo evento
      </BotonFlotante>

      <Portal>
      <AnimatePresence>
        {modalAbierto && (
          <ModalEvento
            hijos={hijos}
            fechaInicial={fechaModal}
            onCerrar={() => setModalAbierto(false)}
            onGuardado={(nuevo) => {
              setEventos((prev) => [...prev, nuevo]);
              setModalAbierto(false);
              // Un registro de contacto es PRUEBA: recibe el Sello igual que un comprobante de pago.
              if (esContacto(nuevo.tipo)) setSelloDe(nuevo.fecha);
            }}
          />
        )}
      </AnimatePresence>
      </Portal>

      <Portal>
      <AnimatePresence>
        {selloDe && <SelloConfianza fecha={formatoFechaLarga(selloDe)} onTerminar={() => setSelloDe(null)} />}
      </AnimatePresence>
      </Portal>
      </ContenedorApp>
    </>
  );
}

/* ── <TarjetaEvento> — fila de la lista; si tiene documento real adjunto, se puede tocar para
   abrirlo (URL firmada y temporal, el bucket es privado). ── */
function TarjetaEvento({ evento: e }: { evento: Evento }) {
  const [abriendo, setAbriendo] = useState(false);
  const [urlVisor, setUrlVisor] = useState<string | null>(null);
  const Icon = ICONO[e.tipo];
  const d = new Date(e.fecha + 'T00:00:00');

  // Las fotos se ven en el visor propio de la app (encaja a pantalla + pellizco para acercar);
  // un PDF sigue abriendo en una pestaña nueva, el navegador ya trae su propio visor con zoom.
  const abrirDocumento = async (): Promise<void> => {
    if (!e.documentoAdjuntoPath || abriendo) return;
    setAbriendo(true);
    const url = await obtenerUrlArchivo(e.documentoAdjuntoPath);
    setAbriendo(false);
    if (!url) return;
    if (e.documentoAdjunto?.toLowerCase().endsWith('.pdf')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setUrlVisor(url);
    }
  };

  const contenido = (
    <>
      <div className="flex size-11 flex-col items-center justify-center rounded-[var(--radius-button)] bg-[var(--bg)]">
        <span className="text-[14px] font-bold leading-none text-[var(--text-primary)]">{d.getDate()}</span>
        <span className="text-[12px] uppercase leading-none text-[var(--text-tertiary)]">{d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')}</span>
      </div>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-button)]" style={{ background: COLOR[e.tipo].bg, color: COLOR[e.tipo].fg }}>
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={esContacto(e.tipo) ? 'truncate text-[14px] font-medium text-[var(--text-primary)]' : 'truncate text-[12px] text-[var(--text-secondary)]'}>
          {LABEL[e.tipo]}
          {e.hijoNombre && <span className="font-semibold text-[var(--accent-ink,var(--accent))]"> · {e.hijoNombre}</span>}
        </p>
        {/* En un contacto, el título automático ("Llamada con Isa") repite la línea de arriba
            ("Llamada · Isa"): se muestra solo si la persona escribió uno propio. */}
        {!(esContacto(e.tipo) && e.titulo === `${LABEL[e.tipo]}${e.hijoNombre ? ` con ${e.hijoNombre}` : ''}`) && (
          <p className="truncate text-[14px] font-medium text-[var(--text-primary)]">{e.titulo}</p>
        )}
        {esContacto(e.tipo) && (
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[var(--text-secondary)]">
            {e.hora && <span className="flex items-center gap-1"><Clock size={11} aria-hidden="true" />{horaHumana(e.hora)}</span>}
            {typeof e.duracionMin === 'number' && e.duracionMin > 0 && <span>· {e.duracionMin} min</span>}
            {e.medio && <span>· {LABEL_MEDIO[e.medio]}</span>}
            {e.resultado && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-bold ${e.resultado === 'contestada' ? 'bg-[var(--status-success-bg,color-mix(in_oklab,var(--status-success)_14%,transparent))] text-[var(--status-success)]' : 'bg-[var(--status-warning-bg,color-mix(in_oklab,var(--status-warning)_14%,transparent))] text-[var(--status-warning)]'}`}>
                <ShieldCheck size={12} aria-hidden="true" />
                {LABEL_RESULTADO[e.resultado]}
              </span>
            )}
          </p>
        )}
        {e.documentoAdjunto && (
          <p className="mt-0.5 flex items-center gap-1 text-[12px] font-semibold text-[var(--accent-ink,var(--accent))]">
            <Paperclip size={12} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{abriendo ? 'Abriendo…' : esContacto(e.tipo) ? 'Ver captura' : e.documentoAdjunto}</span>
          </p>
        )}
      </div>
      {e.documentoAdjuntoPath && <ChevronRight size={16} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />}
    </>
  );

  if (!e.documentoAdjuntoPath) {
    return <div className="flex items-center gap-3 py-2.5">{contenido}</div>;
  }
  return (
    <>
      <button type="button" onClick={abrirDocumento} disabled={abriendo} aria-busy={abriendo} aria-label={`Ver ${e.documentoAdjunto}`} className={`w-full text-left transition-[transform,opacity] duration-100 active:scale-[0.99] [touch-action:manipulation] ${abriendo ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-3 py-2.5">{contenido}</div>
      </button>
      <Portal>
        <VisorImagen url={urlVisor} onCerrar={() => setUrlVisor(null)} />
      </Portal>
    </>
  );
}

/* ── <ResumenMes> — cuántos eventos hay este mes, por tipo (dato real, nunca inventado) —
   llena el espacio junto al calendario visual sin repetir lo que ya muestra la lista. ── */
/* ── <CalendarioMes> — rejilla visual del mes (7 columnas, L→D). El día de hoy se marca con
   acento; los días con eventos llevan un punto debajo del número. Tocar un día abre el modal
   de "Nuevo evento" con esa fecha ya puesta. ── */
function CalendarioMes({
  mesActual,
  eventos,
  onDiaClick,
  onMesAnterior,
  onMesSiguiente,
}: {
  mesActual: Date;
  eventos: Evento[];
  onDiaClick: (fecha: string) => void;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
}) {
  const año = mesActual.getFullYear();
  const mes = mesActual.getMonth();
  const primerDia = new Date(año, mes, 1);
  // getDay(): 0=domingo..6=sábado → lo convertimos a 0=lunes..6=domingo para la rejilla L→D.
  const offsetInicio = (primerDia.getDay() + 6) % 7;
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const hoyISO = hoyEnColombia();

  const eventosPorDia = new Map<number, TipoEvento[]>();
  for (const e of eventos) {
    if (e.fecha.slice(0, 7) !== claveMes(mesActual)) continue;
    const dia = Number(e.fecha.slice(8, 10));
    eventosPorDia.set(dia, [...(eventosPorDia.get(dia) ?? []), e.tipo]);
  }

  const celdas: (number | null)[] = [
    ...Array.from({ length: offsetInicio }, () => null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

  const tiposPresentes = Array.from(new Set(Array.from(eventosPorDia.values()).flat()));

  return (
    <Tarjeta className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={onMesAnterior} aria-label="Mes anterior" className="flex size-10 items-center justify-center rounded-full text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <p className="text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">{nombreMes(mesActual)}</p>
        <button type="button" onClick={onMesSiguiente} aria-label="Mes siguiente" className="flex size-10 items-center justify-center rounded-full text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DIAS_SEMANA.map((d, i) => (
          <div key={i} className="pb-2 text-center text-[12px] font-bold uppercase tracking-[0.04em] text-[var(--accent-ink,var(--accent))]">
            {d}
          </div>
        ))}
        {celdas.map((dia, i) => {
          if (dia === null) return <div key={`vacio-${i}`} />;
          const fecha = fechaISO(new Date(año, mes, dia));
          const esHoy = fecha === hoyISO;
          const tiposDelDia = eventosPorDia.get(dia) ?? [];
          return (
            <button
              key={fecha}
              type="button"
              onClick={() => onDiaClick(fecha)}
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-full text-[14px] font-bold transition-transform duration-100 active:scale-95 [touch-action:manipulation] ${
                esHoy
                  ? 'bg-[var(--accent)] text-[var(--on-accent,var(--bg))] shadow-[var(--shadow-1)]'
                  : 'text-[var(--text-primary)] hover:bg-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)]'
              }`}
            >
              <span className="tabular-nums">{dia}</span>
              <span className="flex h-1.5 items-center gap-0.5" aria-hidden="true">
                {tiposDelDia.slice(0, 3).map((t, idx) => (
                  <span
                    key={idx}
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: esHoy ? 'var(--on-accent, var(--bg))' : COLOR[t].fg }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
      {/* Leyenda de categorías presentes en el mes (chips de la referencia) */}
      {tiposPresentes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tiposPresentes.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold" style={{ background: COLOR[t].bg, color: COLOR[t].fg }}>
              <span className="size-1.5 rounded-full" style={{ background: COLOR[t].fg }} aria-hidden="true" />
              {LABEL[t]}
            </span>
          ))}
        </div>
      )}
    </Tarjeta>
  );
}

function ModalEvento({
  hijos,
  onCerrar,
  onGuardado,
  fechaInicial,
}: {
  hijos: Hijo[];
  onCerrar: () => void;
  onGuardado: (e: Evento) => void;
  fechaInicial?: string;
}) {
  const [tipo, setTipo] = useState<TipoEvento>('visita');
  // Con un solo hijo se preselecciona; con varios, la persona elige (o deja "Todos").
  const [hijoId, setHijoId] = useState<ValorHijo>(hijos.length === 1 ? hijos[0].id : null);
  // Campos del registro de contacto (llamada / videollamada).
  const horaAhora = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Bogota' }).format(new Date()).replace(/^24/, '00');
  const [hora, setHora] = useState(horaAhora);
  const [duracion, setDuracion] = useState('');
  const [medio, setMedio] = useState<MedioContacto | null>(null);
  const [resultado, setResultado] = useState<ResultadoContacto | null>(null);
  const [faltante, setFaltante] = useState<string | null>(null);
  const contacto = esContacto(tipo);
  const nombreHijo = hijos.find((h) => h.id === hijoId)?.nombre;
  // Paso de confirmación: un registro de contacto es IRREVERSIBLE, así que antes del Sello se
  // muestra el resumen y se pide un segundo toque (revisor, defecto 2).
  const [confirmando, setConfirmando] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent): void => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCerrar]);
  // Título automático del contacto ("Llamada con Isa"): la persona no tiene que escribirlo.
  const tituloContacto = `${LABEL[tipo]}${nombreHijo ? ` con ${nombreHijo}` : ''}`;
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState(fechaInicial ?? hoyEnColombia());
  const [documento, setDocumento] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const inputDocRef = useRef<HTMLInputElement>(null);
  const esSalidaPais = tipo === 'salida_pais';

  const guardar = (): void => {
    if (guardando) return;
    if (contacto) {
      if (!resultado) {
        setFaltante('Falta indicar si contestaron o no.');
        return;
      }
      if (resultado === 'contestada' && Number(duracion) < 1) {
        setFaltante('Falta la duración en minutos (al menos 1).');
        return;
      }
      if (fecha === hoyEnColombia() && hora > horaAhora) {
        setFaltante('La hora no puede ser futura: es un registro de algo que ya pasó.');
        return;
      }
      if (!confirmando) {
        setFaltante(null);
        setConfirmando(true);
        setTimeout(() => ctaRef.current?.closest('[role="dialog"]')?.scrollTo({ top: 1e6, behavior: reduce ? 'auto' : 'smooth' }), 50);
        return;
      }
    } else if (!titulo.trim()) {
      setFaltante('Falta el título: escribe de qué es el evento.');
      return;
    }
    setFaltante(null);
    setGuardando(true);
    agregarEvento(
      {
        tipo,
        titulo: contacto ? (titulo.trim() || tituloContacto) : titulo.trim(),
        fecha,
        hijoId: hijoId ?? undefined,
        ...(contacto
          ? {
              hora: hora || undefined,
              duracionMin: resultado === 'contestada' ? Number(duracion) || 0 : 0,
              medio: medio ?? undefined,
              resultado: resultado ?? undefined,
            }
          : {}),
        ...(documento ? { documentoAdjunto: documento.name } : {}),
      },
      documento ?? undefined
    )
      .then(onGuardado)
      .catch(() => { setConfirmando(false); setFaltante('No pudimos guardar el registro. Revisa tu conexión e inténtalo de nuevo.'); })
      .finally(() => setGuardando(false));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex items-end bg-[color-mix(in_oklab,black_55%,transparent)]"
      onClick={onCerrar}
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { y: '100%' }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        exit={reduce ? { opacity: 0 } : { y: '100%' }}
        transition={{ duration: reduce ? 0.12 : 0.28, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label={contacto ? `Registrar ${LABEL[tipo].toLowerCase()}` : 'Nuevo evento'}
        className="mx-auto max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[var(--radius-card)] bg-[var(--surface)] p-5 pb-[max(24px,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky -top-5 z-10 -mx-5 -mt-5 flex items-center justify-between border-b border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] px-5 pt-5 pb-3">
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">{contacto ? `Registrar ${LABEL[tipo].toLowerCase()}` : 'Nuevo evento'}</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="flex size-9 items-center justify-center text-[var(--text-secondary)]">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Dos filas con nombre —Eventos / Contacto con tus hijos— en vez de 7 botones en una grilla
            con fila huérfana (revisor contacto r2). */}
        {([
          { titulo: 'Eventos', tipos: ['visita', 'medica', 'vacaciones', 'extracurricular', 'salida_pais'] as TipoEvento[], cols: 'grid-cols-3' },
          { titulo: 'Contacto con tus hijos', tipos: ['llamada', 'videollamada'] as TipoEvento[], cols: 'grid-cols-2' },
        ]).map((fila) => (
          <div key={fila.titulo} className="mt-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">{fila.titulo}</p>
            <div role="radiogroup" aria-label={fila.titulo} className={`mt-2 grid ${fila.cols} gap-2`}>
              {fila.tipos.map((t) => {
                const Icon = ICONO[t];
                return (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={tipo === t}
                    onClick={() => setTipo(t)}
                    className={`flex flex-col items-center gap-1.5 rounded-[var(--radius-button)] border px-1 py-3 text-center text-[12px] font-medium leading-tight transition-transform duration-100 active:scale-[0.97] [touch-action:manipulation] ${
                      tipo === t ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent-ink,var(--accent))]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {LABEL[t]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <SelectorHijo hijos={hijos} valor={hijoId} onCambio={setHijoId} textoTodos="Todos" ocultarSinHijos />

        {contacto && (
          <p className="mt-4 flex items-start gap-2 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-2.5 text-[12px] leading-[1.5] text-[var(--text-secondary)]">
            <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[var(--accent-ink,var(--accent))]" aria-hidden="true" />
            Este registro queda con el Sello de Confianza y no se puede editar ni borrar: es tu prueba de contacto.
          </p>
        )}

        {!contacto && (
        <>
        <label className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Cita con el pediatra"
          className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />
        </>
        )}

        <div className={contacto ? 'mt-4 grid grid-cols-2 gap-3' : 'mt-4'}>
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)]">Fecha</label>
            <input
              type="date"
              value={fecha}
              max={contacto ? hoyEnColombia() : undefined}
              onChange={(e) => setFecha(e.target.value)}
              className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
            />
          </div>
          {contacto && (
            <div>
              <label className="block text-[13px] font-medium text-[var(--text-secondary)]">Hora</label>
              <input
                type="time"
                max={fecha === hoyEnColombia() ? horaAhora : undefined}
                value={hora}
                onChange={(e) => {
                  setHora(e.target.value);
                  setFaltante(fecha === hoyEnColombia() && e.target.value > horaAhora ? 'La hora no puede ser futura: es un registro de algo que ya pasó.' : null);
                }}
                className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] tabular-nums text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
              />
            </div>
          )}
        </div>

        {contacto && (
          <>
            <p className="mt-4 text-[13px] font-medium text-[var(--text-secondary)]">¿Contestaron?</p>
            <div role="radiogroup" aria-label="Resultado" className="mt-2 grid grid-cols-3 gap-2">
              {RESULTADOS.map(({ valor, label, icon: Icon }) => (
                <button
                  key={valor}
                  type="button"
                  role="radio"
                  aria-checked={resultado === valor}
                  onClick={() => { setResultado(valor); setFaltante(null); }}
                  className={`flex flex-col items-center gap-1.5 rounded-[var(--radius-button)] border px-1 py-3 text-center text-[12px] font-medium leading-tight transition-transform duration-100 active:scale-[0.97] [touch-action:manipulation] ${
                    resultado === valor ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent-ink,var(--accent))]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[var(--text-secondary)]'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)]">Duración (min)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={600}
                  value={duracion}
                  disabled={resultado !== null && resultado !== 'contestada'}
                  onChange={(e) => { setDuracion(e.target.value); setFaltante(null); }}
                  placeholder={resultado && resultado !== 'contestada' ? '—' : 'Ej. 15'}
                  className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] tabular-nums text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)] disabled:opacity-50"
                />
              </div>
            </div>
            <p className="mt-4 text-[13px] font-medium text-[var(--text-secondary)]">Por dónde</p>
            <div role="radiogroup" aria-label="Medio" className="mt-2 flex flex-wrap gap-2">
              {MEDIOS.filter((m) => !m.soloEn || m.soloEn === tipo).map((m) => (
                <button
                  key={m.valor}
                  type="button"
                  role="radio"
                  aria-checked={medio === m.valor}
                  onClick={() => setMedio(medio === m.valor ? null : m.valor)}
                  className={`h-11 rounded-[var(--radius-button)] border px-3.5 text-[13px] font-semibold transition-[background-color,transform] duration-100 active:scale-[0.97] [touch-action:manipulation] ${
                    medio === m.valor ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent-ink,var(--accent))]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[var(--text-secondary)]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </>
        )}

        <label className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">{LABEL_ADJUNTO[tipo]}</label>
        <input
          ref={inputDocRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            if (f) {
              const error = validarArchivoAdjunto(f);
              if (error) {
                setErrorArchivo(error);
                return;
              }
            }
            setErrorArchivo(null);
            setDocumento(f);
          }}
        />
        <button
          type="button"
          onClick={() => inputDocRef.current?.click()}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] text-[14px] text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <Paperclip size={16} aria-hidden="true" />
          {documento ? documento.name : esSalidaPais ? 'Adjuntar permiso notariado' : 'Adjuntar archivo'}
        </button>
        {errorArchivo ? (
          <p className="mt-1.5 text-[12px] text-[var(--status-error)]">{errorArchivo}</p>
        ) : (
          <p className="mt-1.5 text-[12px] text-[var(--text-tertiary)]">
            {esSalidaPais
              ? 'Opcional aquí, pero queda guardado en tu expediente para cuando lo necesites mostrar.'
              : 'Queda guardado de verdad en tu expediente — foto o PDF, listo para mostrar después.'}
          </p>
        )}

        {faltante && (
          <p role="alert" className="mt-3 text-center text-[12px] text-[var(--status-error)]">{faltante}</p>
        )}
        {confirmando && contacto && (
          <div role="status" className="mt-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] p-4">
            <p className="text-[13px] font-bold text-[var(--text-primary)]">Revisa antes de sellar — no se podrá corregir</p>
            <ul className="mt-2 flex flex-col gap-1 text-[13px] leading-[1.5] text-[var(--text-primary)]">
              <li className="font-semibold">{titulo.trim() || tituloContacto}</li>
              <li>{formatoFechaLarga(fecha)}{hora ? ` · ${horaHumana(hora)}` : ''}{resultado === 'contestada' && duracion ? ` · ${duracion} min` : ''}</li>
              <li>{[medio ? LABEL_MEDIO[medio] : null, resultado ? LABEL_RESULTADO[resultado] : null, documento ? 'con captura' : 'sin captura'].filter(Boolean).join(' · ')}</li>
            </ul>
            <button type="button" onClick={() => setConfirmando(false)} className="mt-2 py-1 text-[13px] font-bold text-[var(--accent-ink,var(--accent))] underline-offset-2 hover:underline [touch-action:manipulation]">
              Corregir algo
            </button>
          </div>
        )}
        <motion.button
          ref={ctaRef}
          type="button"
          disabled={guardando}
          onClick={guardar}
          whileTap={guardando ? undefined : { scale: 0.97 }}
          aria-busy={guardando}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent,var(--bg))] transition-opacity disabled:opacity-70 [touch-action:manipulation]"
        >
          {guardando ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="motion-safe:animate-spin" aria-hidden="true" />
              {contacto ? 'Aplicando el Sello de Confianza…' : 'Guardando…'}
            </span>
          ) : contacto ? (confirmando ? 'Sellar registro' : 'Registrar contacto') : 'Guardar evento'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
