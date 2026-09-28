'use client';

// Una fila del directorio en el panel: foto + datos + 3 acciones (editar en línea, pausar/
// reactivar, quitar). Pausar es reversible con un toque (el catálogo real: un profesional deja
// de pagar por una temporada y vuelve); quitar pide confirmación en dos pasos porque sí borra la
// fila (regla 8 del SO — mismo patrón que AccionesFila.tsx del panel de usuarios).

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Pencil, Trash2, Pause, Play, MessageCircle, Scale, Brain, HeartHandshake } from 'lucide-react';
import type { Profesional } from '@/lib/profesionales';
import { actualizarProfesional, pausarProfesional, eliminarProfesional } from './acciones';

// Los componentes de ícono NO viajan bien como prop desde un Server Component (page.tsx) hacia
// este Client Component — Next.js solo serializa datos planos por ese límite, no referencias a
// funciones/componentes (mismo bug ya documentado en components/admin/ui.tsx → TarjetaSeccion:
// "Only plain objects can be passed..."). Por eso el ícono y su etiqueta se resuelven AQUÍ, a
// partir de `profesional.categoria` (un string, eso sí es serializable), en vez de recibirlos
// como prop ya armados.
const ICONO_CATEGORIA = { abogado: Scale, psicologo: Brain, trabajador_social: HeartHandshake } as const;
const ETIQUETA_CATEGORIA = { abogado: 'Abogados de familia', psicologo: 'Psicólogos familiares', trabajador_social: 'Trabajadores sociales' } as const;

export function FilaProfesionalAdmin({ profesional, activo, contactos }: { profesional: Profesional; activo: boolean; contactos: number }) {
  const Icono = ICONO_CATEGORIA[profesional.categoria];
  const etiquetaCategoria = ETIQUETA_CATEGORIA[profesional.categoria];
  const [editando, setEditando] = useState(false);
  const [confirmandoQuitar, setConfirmandoQuitar] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePausa = async () => {
    setOcupado(true);
    setError(null);
    const r = await pausarProfesional(profesional.id, !activo);
    if (!r.ok) setError(r.mensaje);
    setOcupado(false);
  };

  const quitar = async () => {
    setOcupado(true);
    setError(null);
    const r = await eliminarProfesional(profesional.id);
    if (!r.ok) {
      setError(r.mensaje);
      setOcupado(false);
      setConfirmandoQuitar(false);
    }
  };

  if (editando) {
    return <FormularioEdicion profesional={profesional} onCancelar={() => setEditando(false)} onGuardado={() => setEditando(false)} />;
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-[var(--radius-card)] border p-4 ${
        activo ? 'border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--surface)]' : 'border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] opacity-70'
      }`}
    >
      {profesional.fotoUrl ? (
        <Image src={profesional.fotoUrl} alt="" width={48} height={48} className="size-12 shrink-0 rounded-[var(--radius-card)] object-cover object-top" />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
          <Icono size={20} className="text-[var(--accent)]" aria-hidden="true" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[14.5px] font-bold text-[var(--text-primary)]">{profesional.nombre}</p>
          {!activo && <span className="shrink-0 rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--text-tertiary)]">Pausado</span>}
        </div>
        <p className="truncate text-[12.5px] text-[var(--text-secondary)]">
          {etiquetaCategoria} · {profesional.especialidad}
        </p>
        {profesional.ciudad && <p className="truncate text-[12px] text-[var(--text-tertiary)]">{profesional.ciudad}</p>}
        <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-[var(--accent)]">
          <MessageCircle size={12} aria-hidden="true" />
          {contactos === 0 ? 'Nadie lo ha contactado todavía' : contactos === 1 ? '1 persona lo contactó' : `${contactos} personas lo contactaron`}
        </p>
        {error && <p className="mt-1 text-[12px] text-[var(--status-error)]">{error}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setEditando(true)}
          disabled={ocupado}
          className="flex size-9 items-center justify-center rounded-full text-[var(--text-tertiary)] disabled:opacity-40 [touch-action:manipulation]"
          aria-label="Editar"
        >
          <Pencil size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={togglePausa}
          disabled={ocupado}
          className="flex size-9 items-center justify-center rounded-full text-[var(--text-tertiary)] disabled:opacity-40 [touch-action:manipulation]"
          aria-label={activo ? 'Pausar' : 'Reactivar'}
        >
          {activo ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
        </button>
        {confirmandoQuitar ? (
          <span className="flex items-center gap-2">
            <button type="button" onClick={quitar} disabled={ocupado} className="text-[12px] font-semibold text-[var(--status-error)] [touch-action:manipulation]">
              ¿Seguro?
            </button>
            <button type="button" onClick={() => setConfirmandoQuitar(false)} className="text-[12px] text-[var(--text-tertiary)] [touch-action:manipulation]">
              No
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmandoQuitar(true)}
            disabled={ocupado}
            className="flex size-9 items-center justify-center rounded-full text-[var(--text-tertiary)] disabled:opacity-40 [touch-action:manipulation]"
            aria-label="Quitar"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

function FormularioEdicion({ profesional, onCancelar, onGuardado }: { profesional: Profesional; onCancelar: () => void; onGuardado: () => void }) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async (formData: FormData) => {
    setEnviando(true);
    setError(null);
    const r = await actualizarProfesional(profesional.id, formData);
    setEnviando(false);
    if (r.ok) onGuardado();
    else setError(r.mensaje);
  };

  return (
    <form action={enviar} className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--accent)] bg-[var(--surface)] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CampoEdicion id="nombre" label="Nombre" defaultValue={profesional.nombre} />
        <div>
          <label className="text-[12.5px] font-medium text-[var(--text-secondary)]" htmlFor={`pf-edit-categoria-${profesional.id}`}>
            Categoría
          </label>
          <select
            id={`pf-edit-categoria-${profesional.id}`}
            name="categoria"
            defaultValue={profesional.categoria}
            className="mt-1.5 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-3.5 text-[14px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
          >
            <option value="abogado">Abogado de familia</option>
            <option value="psicologo">Psicólogo familiar</option>
            <option value="trabajador_social">Trabajador social</option>
          </select>
        </div>
      </div>
      <CampoEdicion id="especialidad" label="Especialidad" defaultValue={profesional.especialidad} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CampoEdicion id="ciudad" label="Ciudad" defaultValue={profesional.ciudad ?? ''} />
        <CampoEdicion id="contacto" label="A dónde escriben" defaultValue={profesional.contactoUrl} />
      </div>
      <div>
        <label className="text-[12.5px] font-medium text-[var(--text-secondary)]" htmlFor={`pf-edit-foto-${profesional.id}`}>
          Cambiar foto (opcional)
        </label>
        <input
          id={`pf-edit-foto-${profesional.id}`}
          name="foto"
          type="file"
          accept="image/*"
          className="mt-1.5 block w-full text-[13px] text-[var(--text-secondary)] file:mr-3 file:h-9 file:rounded-[var(--radius-button)] file:border-0 file:bg-[var(--accent)] file:px-3.5 file:text-[13px] file:font-semibold file:text-[var(--bg)]"
        />
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          type="submit"
          disabled={enviando}
          whileTap={{ scale: 0.97 }}
          className="flex h-10 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-4 text-[13.5px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-40 [touch-action:manipulation]"
        >
          {enviando ? 'Guardando…' : 'Guardar cambios'}
        </motion.button>
        <button type="button" onClick={onCancelar} className="text-[13px] text-[var(--text-tertiary)] [touch-action:manipulation]">
          Cancelar
        </button>
      </div>
      {error && <p className="text-[12.5px] text-[var(--status-error)]">{error}</p>}
    </form>
  );
}

function CampoEdicion({ id, label, defaultValue }: { id: string; label: string; defaultValue: string }) {
  return (
    <div>
      <label className="text-[12.5px] font-medium text-[var(--text-secondary)]" htmlFor={`pf-edit-${id}`}>
        {label}
      </label>
      <input
        id={`pf-edit-${id}`}
        name={id}
        type="text"
        defaultValue={defaultValue}
        className="mt-1.5 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-3.5 text-[14px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
      />
    </div>
  );
}
