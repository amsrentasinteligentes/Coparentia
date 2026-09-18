'use client';

// CALENDARIO — visitas, citas médicas, vacaciones y actividades (MVP #5, aprobado 2026-09-07).
// Registro UNILATERAL de eventos propios — no depende de que nadie más lo use ni lo acepte (regla
// 13 del SO: navegación real entre meses con fechas reales, nunca "esta semana" a secas).
// Ampliado a pedido del usuario (2026-09-09): calendario visual del mes (aprovecha el espacio
// libre en pantallas grandes — regla 43 §13 "desktop sin vergüenza"; en celular queda apilado,
// una sola columna) + adjunto de archivo real en CUALQUIER tipo de evento, no solo salida del
// país (ej. la fórmula médica real de una cita).

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, X, Users, HeartPulse, Plane, Trophy, Globe, Paperclip, CalendarDays } from 'lucide-react';
import { ContenedorApp, Tarjeta, IconoCirculo, BotonFlotante, ErrorDeCarga, CabeceraApp, TituloSeccion } from '@/components/app/ui';
import { VisorImagen } from '@/components/app/VisorImagen';
import { Portal } from '@/components/app/Portal';
import { SelectorHijo, useHijos, type ValorHijo } from '@/components/app/SelectorHijo';
import { type Hijo } from '@/lib/perfil';
import { type Evento, type TipoEvento, obtenerEventos, agregarEvento, obtenerUrlArchivo, formatoFechaLarga, formatoFechaCorta, validarArchivoAdjunto } from '@/lib/datos';
import { hoyEnColombia } from '@/lib/fecha';

const ICONO: Record<TipoEvento, typeof Users> = { visita: Users, medica: HeartPulse, vacaciones: Plane, extracurricular: Trophy, salida_pais: Globe };
const LABEL: Record<TipoEvento, string> = { visita: 'Visita', medica: 'Cita médica', vacaciones: 'Vacaciones', extracurricular: 'Actividad', salida_pais: 'Salida del país' };
const LABEL_ADJUNTO: Record<TipoEvento, string> = {
  visita: 'Adjuntar un documento (opcional)',
  medica: 'Fórmula médica o resultado (opcional)',
  vacaciones: 'Adjuntar un documento (opcional)',
  extracurricular: 'Adjuntar un documento (opcional)',
  salida_pais: 'Permiso de salida del país',
};
const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
// Un color por tipo de evento (referencia del usuario: puntos y chips de colores por categoría).
const COLOR: Record<TipoEvento, { fg: string; bg: string }> = {
  visita: { fg: 'var(--cat-visita)', bg: 'var(--cat-visita-bg)' },
  medica: { fg: 'var(--cat-medica)', bg: 'var(--cat-medica-bg)' },
  vacaciones: { fg: 'var(--cat-vacaciones)', bg: 'var(--cat-vacaciones-bg)' },
  extracurricular: { fg: 'var(--cat-extra)', bg: 'var(--cat-extra-bg)' },
  salida_pais: { fg: 'var(--cat-salida)', bg: 'var(--cat-salida-bg)' },
};
const LABEL_CONTEO: Record<TipoEvento, (n: number) => string> = {
  visita: (n) => (n === 1 ? '1 visita' : `${n} visitas`),
  medica: (n) => (n === 1 ? '1 cita médica' : `${n} citas médicas`),
  vacaciones: (n) => (n === 1 ? '1 período de vacaciones' : `${n} períodos de vacaciones`),
  extracurricular: (n) => (n === 1 ? '1 actividad' : `${n} actividades`),
  salida_pais: (n) => (n === 1 ? '1 salida del país' : `${n} salidas del país`),
};

function claveMes(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function nombreMes(d: Date): string {
  const s = d.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function fechaISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Calendario() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mesActual, setMesActual] = useState(() => new Date());
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaModal, setFechaModal] = useState<string | undefined>(undefined);
  // Hijos del perfil: cada evento puede quedar a nombre de uno ("Cita médica · Sofía").
  const { hijos } = useHijos();

  // Igual que en Inicio y Pagos: un fallo de red mostraba el mes VACÍO, indistinguible de
  // "no tienes eventos registrados".
  const [falloCarga, setFalloCarga] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;
    setFalloCarga(false);
    obtenerEventos()
      .then((r) => {
        if (vigente) setEventos(r);
      })
      .catch(() => {
        if (vigente) setFalloCarga(true);
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
  const tituloAgenda = deHoy.length > 0 ? `Hoy · ${formatoFechaCorta(hoyISO)}` : proximos.length > 0 ? 'Próximos este mes' : `Eventos de ${nombreMes(mesActual)}`;
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
              <Tarjeta indice={1}>
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">{tituloAgenda}</h2>
                  <span className="text-[12px] text-[var(--text-secondary)]">{delMes.length} este mes</span>
                </div>
                {listaAgenda.length === 0 ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <IconoCirculo icon={CalendarDays} size={22} />
                    <p className="mt-3 text-[14px] font-bold text-[var(--text-primary)]">Sin eventos este mes</p>
                    <p className="mt-1 max-w-[30ch] text-[13px] text-[var(--text-secondary)]">Toca un día del calendario o el botón "Evento" para registrar una visita, cita o actividad.</p>
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
              <div className="grid grid-cols-3 gap-2">
                {Array.from(conteo.entries()).slice(0, 3).map(([tipo, n], i) => {
                  const Icon = ICONO[tipo];
                  return (
                    <Tarjeta key={tipo} indice={2 + i} className="flex flex-col items-start gap-2 p-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-chip,999px)]" style={{ background: COLOR[tipo].bg, color: COLOR[tipo].fg }}>
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[17px] font-extrabold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{n}</p>
                        <p className="truncate text-[10.5px] leading-tight text-[var(--text-secondary)]">{LABEL_CONTEO[tipo](n).replace(/^\d+ /, '')}</p>
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
            }}
          />
        )}
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
        <span className="text-[15px] font-bold leading-none text-[var(--text-primary)]">{d.getDate()}</span>
        <span className="text-[10px] uppercase text-[var(--text-tertiary)]">{d.toLocaleDateString('es-CO', { month: 'short' })}</span>
      </div>
      <IconoCirculo icon={Icon} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-[var(--text-secondary)]">
          {LABEL[e.tipo]}
          {e.hijoNombre && <span className="font-semibold text-[var(--accent-ink,var(--accent))]"> · {e.hijoNombre}</span>}
        </p>
        <p className="truncate text-[14px] font-medium text-[var(--text-primary)]">{e.titulo}</p>
        {e.documentoAdjunto && (
          <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[var(--accent)]">
            <Paperclip size={12} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{e.documentoAdjunto}</span>
          </p>
        )}
      </div>
    </>
  );

  if (!e.documentoAdjuntoPath) {
    return <div className="flex items-center gap-3 py-2.5">{contenido}</div>;
  }
  return (
    <>
      <button type="button" onClick={abrirDocumento} disabled={abriendo} className="text-left [touch-action:manipulation]">
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
        <p className="text-[16px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">{nombreMes(mesActual)}</p>
        <button type="button" onClick={onMesSiguiente} aria-label="Mes siguiente" className="flex size-10 items-center justify-center rounded-full text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DIAS_SEMANA.map((d, i) => (
          <div key={i} className="pb-2 text-center text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--accent-ink,var(--accent))]">
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
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-full text-[13px] font-bold transition-transform duration-100 active:scale-95 [touch-action:manipulation] ${
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
            <span key={t} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: COLOR[t].bg, color: COLOR[t].fg }}>
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
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState(fechaInicial ?? hoyEnColombia());
  const [documento, setDocumento] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const inputDocRef = useRef<HTMLInputElement>(null);
  const esSalidaPais = tipo === 'salida_pais';

  const guardar = (): void => {
    if (!titulo.trim() || guardando) return;
    setGuardando(true);
    agregarEvento(
      {
        tipo,
        titulo: titulo.trim(),
        fecha,
        hijoId: hijoId ?? undefined,
        ...(documento ? { documentoAdjunto: documento.name } : {}),
      },
      documento ?? undefined
    )
      .then(onGuardado)
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
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-[520px] rounded-t-[var(--radius-card)] bg-[var(--surface)] p-5 pb-[max(24px,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Nuevo evento</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="flex size-9 items-center justify-center text-[var(--text-secondary)]">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {(Object.keys(ICONO) as TipoEvento[]).map((t) => {
            const Icon = ICONO[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`flex flex-col items-center gap-1.5 rounded-[var(--radius-button)] border py-3 text-[11px] font-medium [touch-action:manipulation] ${
                  tipo === t ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[var(--text-secondary)]'
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {LABEL[t]}
              </button>
            );
          })}
        </div>

        <SelectorHijo hijos={hijos} valor={hijoId} onCambio={setHijoId} textoTodos="Todos" ocultarSinHijos />

        <label className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Cita con el pediatra"
          className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />

        <label className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />

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

        <button
          type="button"
          disabled={!titulo.trim() || guardando}
          onClick={guardar}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent,var(--bg))] transition-opacity disabled:opacity-40 [touch-action:manipulation]"
        >
          {guardando ? 'Guardando…' : 'Guardar evento'}
        </button>
      </motion.div>
    </motion.div>
  );
}
