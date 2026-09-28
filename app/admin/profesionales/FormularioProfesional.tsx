'use client';

// Alta de un profesional nuevo. Los mismos 6 datos que se le piden al usuario en el chat
// (nombre, categoría, especialidad, ciudad, a dónde escriben, foto) — un solo botón, sin jerga.

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus } from 'lucide-react';
import { crearProfesional } from './acciones';

export function FormularioProfesional() {
  const formRef = useRef<HTMLFormElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null);

  const enviar = async (formData: FormData) => {
    setEnviando(true);
    setResultado(null);
    const r = await crearProfesional(formData);
    setResultado(r);
    setEnviando(false);
    if (r.ok) formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={enviar} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Campo id="nombre" label="Nombre" placeholder="María Gómez" required />
        <div>
          <label className="text-[12.5px] font-medium text-[var(--text-secondary)]" htmlFor="pf-categoria">
            Categoría
          </label>
          <select
            id="pf-categoria"
            name="categoria"
            required
            defaultValue="abogado"
            className="mt-1.5 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-3.5 text-[14px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
          >
            <option value="abogado">Abogado de familia</option>
            <option value="psicologo">Psicólogo familiar</option>
            <option value="trabajador_social">Trabajador social</option>
          </select>
        </div>
      </div>

      <Campo id="especialidad" label="Especialidad" placeholder="Abogada especialista en..." required />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Campo id="ciudad" label="Ciudad" placeholder="Bogotá D.C." />
        <Campo id="contacto" label="A dónde escriben (WhatsApp o correo)" placeholder="+57 300 123 4567" required />
      </div>

      <div>
        <label className="text-[12.5px] font-medium text-[var(--text-secondary)]" htmlFor="pf-foto">
          Foto
        </label>
        <input
          id="pf-foto"
          name="foto"
          type="file"
          accept="image/*"
          className="mt-1.5 block w-full text-[13px] text-[var(--text-secondary)] file:mr-3 file:h-9 file:rounded-[var(--radius-button)] file:border-0 file:bg-[var(--accent)] file:px-3.5 file:text-[13px] file:font-semibold file:text-[var(--bg)]"
        />
      </div>

      <motion.button
        type="submit"
        disabled={enviando}
        whileTap={{ scale: 0.97 }}
        className="flex h-11 items-center justify-center gap-2 self-start rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-[14px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-40 [touch-action:manipulation]"
      >
        <UserPlus size={16} aria-hidden="true" />
        {enviando ? 'Guardando…' : 'Agregar'}
      </motion.button>

      {resultado && (
        <p className="text-[12.5px] font-medium" style={{ color: resultado.ok ? 'var(--status-success)' : 'var(--status-error)' }} role="status">
          {resultado.mensaje}
        </p>
      )}
    </form>
  );
}

function Campo({ id, label, placeholder, required = false }: { id: string; label: string; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label className="text-[12.5px] font-medium text-[var(--text-secondary)]" htmlFor={`pf-${id}`}>
        {label}
      </label>
      <input
        id={`pf-${id}`}
        name={id}
        type="text"
        required={required}
        placeholder={placeholder}
        className="mt-1.5 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-3.5 text-[14px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
      />
    </div>
  );
}
