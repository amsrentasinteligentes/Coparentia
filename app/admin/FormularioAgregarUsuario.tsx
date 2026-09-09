'use client';

// Alta manual: nombre + correo → un botón. Antes de crear, la propia Server Action revisa que
// el correo no exista ya (dedupe real, no solo del lado del cliente). El formato del correo se
// valida aquí mismo, al perder el foco — encontrado por el revisor-visual (ronda 1): antes solo
// se sabía que el correo era inválido después del viaje de ida y vuelta al servidor.

import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus } from 'lucide-react';
import { agregarUsuarioManual } from './acciones';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FormularioAgregarUsuario() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [emailTocado, setEmailTocado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null);

  const emailEsValido = EMAIL_VALIDO.test(email.trim());
  const mostrarErrorEmail = emailTocado && email.trim() !== '' && !emailEsValido;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando || !emailEsValido || !nombre.trim()) return; // evita doble-clic y correos con formato inválido
    setEnviando(true);
    setResultado(null);
    const r = await agregarUsuarioManual(nombre, email);
    setResultado(r);
    setEnviando(false);
    if (r.ok) {
      setNombre('');
      setEmail('');
      setEmailTocado(false);
    }
  };

  return (
    // <form>, no solo botones sueltos — encontrado por el revisor-visual (ronda 4): sin esto,
    // Enter dentro de un campo no envía nada (heurística de flexibilidad/eficiencia de uso).
    <form onSubmit={enviar} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <label className="text-[12.5px] font-medium text-[var(--text-secondary)]" htmlFor="admin-nombre">
          Nombre
        </label>
        <input
          id="admin-nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="María Gómez"
          className="mt-1.5 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-3.5 text-[14px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />
      </div>
      <div className="flex-1">
        <label className="text-[12.5px] font-medium text-[var(--text-secondary)]" htmlFor="admin-email">
          Correo
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTocado(true)}
          placeholder="maria@correo.com"
          aria-invalid={mostrarErrorEmail}
          className={`mt-1.5 h-11 w-full rounded-[var(--radius-button)] border bg-[var(--surface-2)] px-3.5 text-[14px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)] ${
            mostrarErrorEmail ? 'border-[var(--status-error)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)]'
          }`}
        />
        {mostrarErrorEmail && <p className="mt-1 text-[12px] text-[var(--status-error)]">Ese correo no se ve completo — revísalo.</p>}
      </div>
      <motion.button
        type="submit"
        disabled={!nombre.trim() || !emailEsValido || enviando}
        whileTap={{ scale: 0.97 }}
        className="mt-1.5 flex h-11 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-[14px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-40 [touch-action:manipulation] sm:mt-[26px]"
      >
        <UserPlus size={16} aria-hidden="true" />
        {enviando ? 'Creando…' : 'Agregar'}
      </motion.button>
      {resultado && (
        <p
          className="basis-full text-[12.5px] font-medium"
          style={{ color: resultado.ok ? 'var(--status-success)' : 'var(--status-error)' }}
          role="status"
        >
          {resultado.mensaje}
        </p>
      )}
    </form>
  );
}
