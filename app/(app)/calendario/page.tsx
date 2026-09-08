'use client';

// CALENDARIO — visitas, citas médicas, vacaciones y actividades (MVP #5, aprobado 2026-09-07).
// Registro UNILATERAL de eventos propios — no depende de que el ex lo use ni lo acepte (regla
// 13 del SO: navegación real entre meses con fechas reales, nunca "esta semana" a secas).

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, X, Users, HeartPulse, Plane, Trophy, Globe, Paperclip } from 'lucide-react';
import { ContenedorApp, PageHeader, Tarjeta, IconoCirculo, BotonFlotante } from '@/components/app/ui';
import { type Evento, type TipoEvento, obtenerEventos, agregarEvento, formatoFechaLarga } from '@/lib/datos';

const ICONO: Record<TipoEvento, typeof Users> = { visita: Users, medica: HeartPulse, vacaciones: Plane, extracurricular: Trophy, salida_pais: Globe };
const LABEL: Record<TipoEvento, string> = { visita: 'Visita', medica: 'Cita médica', vacaciones: 'Vacaciones', extracurricular: 'Actividad', salida_pais: 'Salida del país' };

function claveMes(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function nombreMes(d: Date): string {
  const s = d.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function Calendario() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mesActual, setMesActual] = useState(() => new Date());
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    obtenerEventos().then(setEventos);
  }, []);

  const delMes = eventos
    .filter((e) => e.fecha.slice(0, 7) === claveMes(mesActual))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <ContenedorApp>
      <PageHeader titulo="Calendario" subtitulo="Tu registro de eventos — no depende de tu ex" />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMesActual((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          aria-label="Mes anterior"
          className="flex size-11 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <p className="text-[16px] font-semibold text-[var(--text-primary)]">{nombreMes(mesActual)}</p>
        <button
          type="button"
          onClick={() => setMesActual((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          aria-label="Mes siguiente"
          className="flex size-11 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {delMes.length === 0 && (
          <Tarjeta className="items-center py-10 text-center">
            <p className="text-[14px] text-[var(--text-secondary)]">Sin eventos este mes todavía.</p>
          </Tarjeta>
        )}
        {delMes.map((e) => {
          const Icon = ICONO[e.tipo];
          const d = new Date(e.fecha + 'T00:00:00');
          return (
            <Tarjeta key={e.id} className="flex items-center gap-3">
              <div className="flex size-11 flex-col items-center justify-center rounded-[var(--radius-button)] bg-[var(--bg)]">
                <span className="text-[15px] font-bold leading-none text-[var(--text-primary)]">{d.getDate()}</span>
                <span className="text-[10px] uppercase text-[var(--text-tertiary)]">{d.toLocaleDateString('es-CO', { month: 'short' })}</span>
              </div>
              <IconoCirculo icon={Icon} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-[var(--text-secondary)]">{LABEL[e.tipo]}</p>
                <p className="truncate text-[14px] font-medium text-[var(--text-primary)]">{e.titulo}</p>
                {e.documentoAdjunto && (
                  <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[var(--accent)]">
                    <Paperclip size={12} className="shrink-0" aria-hidden="true" />
                    <span className="truncate">{e.documentoAdjunto}</span>
                  </p>
                )}
              </div>
            </Tarjeta>
          );
        })}
      </div>

      <BotonFlotante onClick={() => setModalAbierto(true)}>
        <Plus size={18} aria-hidden="true" />
        Evento
      </BotonFlotante>

      <AnimatePresence>
        {modalAbierto && (
          <ModalEvento
            onCerrar={() => setModalAbierto(false)}
            onGuardado={(nuevo) => {
              setEventos((prev) => [...prev, nuevo]);
              setModalAbierto(false);
            }}
          />
        )}
      </AnimatePresence>
    </ContenedorApp>
  );
}

function ModalEvento({ onCerrar, onGuardado }: { onCerrar: () => void; onGuardado: (e: Evento) => void }) {
  const [tipo, setTipo] = useState<TipoEvento>('visita');
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [documento, setDocumento] = useState<File | null>(null);
  const inputDocRef = useRef<HTMLInputElement>(null);
  const esSalidaPais = tipo === 'salida_pais';

  const guardar = (): void => {
    if (!titulo.trim()) return;
    agregarEvento({
      tipo,
      titulo: titulo.trim(),
      fecha,
      ...(esSalidaPais && documento ? { documentoAdjunto: documento.name } : {}),
    }).then(onGuardado);
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

        {esSalidaPais && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <label className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">Permiso de salida del país</label>
            <input
              ref={inputDocRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => setDocumento(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => inputDocRef.current?.click()}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] text-[14px] text-[var(--text-secondary)] [touch-action:manipulation]"
            >
              <Paperclip size={16} aria-hidden="true" />
              {documento ? documento.name : 'Adjuntar permiso notariado'}
            </button>
            <p className="mt-1.5 text-[12px] text-[var(--text-tertiary)]">
              Opcional aquí, pero queda guardado en tu expediente para cuando lo necesites mostrar.
            </p>
          </motion.div>
        )}

        <button
          type="button"
          disabled={!titulo.trim()}
          onClick={guardar}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-40 [touch-action:manipulation]"
        >
          Guardar evento
        </button>
      </motion.div>
    </motion.div>
  );
}
