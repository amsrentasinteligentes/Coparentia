'use client';

// LISTA DE ESPERA POR PAÍS (2026-10-21, decisión #8: por ahora solo Colombia). Vive dentro de la respuesta de
// "¿Funciona fuera de Colombia?": en vez de prometer "Pronto" sin saber a quién, guarda el correo y el país de quien
// pide que Coparentia llegue a su país. Nada de esto toca el pago ni las cuentas. Se envía a /api/lista-espera; un
// fallo muestra un aviso y deja reintentar. La autorización es expresa (casilla) y no se envía sin ella.

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { trackMeta } from '@/lib/meta-pixel';

const PAISES = ['México', 'Chile', 'Argentina', 'Ecuador', 'Perú', 'Otro'] as const;
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Estado = 'quieto' | 'enviando' | 'listo' | 'error';

const CAMPO =
  'mt-1 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]';

export function ListaEsperaPais() {
  const id = useId();
  const [pais, setPais] = useState('');
  const [paisOtro, setPaisOtro] = useState('');
  const [email, setEmail] = useState('');
  const [autoriza, setAutoriza] = useState(false);
  const [estado, setEstado] = useState<Estado>('quieto');
  const [falta, setFalta] = useState('');
  const avisoRef = useRef<HTMLDivElement>(null);
  // La barra fija de abajo puede tapar el aviso: se trae al centro de la pantalla cuando aparece.
  useEffect(() => {
    if (falta || estado === 'error') avisoRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [falta, estado]);

  async function enviar(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (estado === 'enviando') return;
    const limpio = email.trim();
    if (!pais) return setFalta('Elige tu país.');
    if (pais === 'Otro' && paisOtro.trim().length < 2) return setFalta('Escribe cuál es tu país.');
    if (!FORMATO_CORREO.test(limpio)) return setFalta('Escribe un correo válido, por ejemplo nombre@correo.com.');
    if (!autoriza) return setFalta('Marca la autorización para que podamos avisarte.');
    setFalta('');
    setEstado('enviando');
    try {
      const r = await fetch('/api/lista-espera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: limpio, pais, paisOtro: paisOtro.trim(), autoriza: true }),
      });
      if (!r.ok) throw new Error('fallo');
      // Solo el país (sin correo): sirve para saber de dónde llega el interés.
      trackMeta('ListaEspera', { pais }, { personalizado: true });
      setEstado('listo');
    } catch {
      setEstado('error');
    }
  }

  if (estado === 'listo') {
    return (
      <p role="status" className="flex items-start gap-2 text-base font-medium leading-snug text-[var(--text-primary)]">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]">
          <Check size={12} strokeWidth={3} color="var(--on-accent, var(--bg))" aria-hidden="true" />
        </span>
        Listo. Te avisaremos cuando abramos en tu país.
      </p>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-3">
      <p className="text-base leading-[1.55] text-[var(--text-secondary)]">
        <strong className="font-semibold text-[var(--text-primary)]">Por ahora, solo en Colombia.</strong> Si quieres que
        llegue a tu país, déjanos tu correo y te avisamos.
      </p>

      <div>
        <label htmlFor={`${id}-pais`} className="text-sm font-medium text-[var(--text-secondary)]">
          Tu país
        </label>
        <select id={`${id}-pais`} value={pais} onChange={(e) => setPais(e.target.value)} className={CAMPO}>
          <option value="">Elige tu país</option>
          {PAISES.map((p) => (
            <option key={p} value={p}>
              {p === 'Otro' ? 'Otro país' : p}
            </option>
          ))}
        </select>
      </div>

      {pais === 'Otro' && (
        <div>
          <label htmlFor={`${id}-otro`} className="text-sm font-medium text-[var(--text-secondary)]">
            ¿Cuál?
          </label>
          <input
            id={`${id}-otro`}
            type="text"
            maxLength={60}
            value={paisOtro}
            onChange={(e) => setPaisOtro(e.target.value)}
            className={CAMPO}
          />
        </div>
      )}

      <div>
        <label htmlFor={`${id}-correo`} className="text-sm font-medium text-[var(--text-secondary)]">
          Tu correo
        </label>
        <input
          id={`${id}-correo`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={CAMPO}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 py-1 [touch-action:manipulation]">
        <input
          type="checkbox"
          checked={autoriza}
          onChange={(e) => setAutoriza(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[8px] border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--text-primary)] ${
            autoriza
              ? 'border-[var(--accent)] bg-[var(--accent)]'
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_55%,transparent)] bg-[var(--surface)]'
          }`}
        >
          {autoriza && <Check size={13} strokeWidth={3} color="var(--on-accent, var(--bg))" />}
        </span>
        <span className="text-sm leading-[1.5] text-[var(--text-secondary)]">
          Autorizo guardar mi correo para avisarme cuando Coparentia llegue a mi país, según la{' '}
          <a
            href="/privacidad"
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap text-[var(--accent-ink,var(--accent))] underline"
          >
            Política de Privacidad
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent)] [touch-action:manipulation] disabled:cursor-wait disabled:opacity-80"
      >
        {estado === 'enviando' ? (
          <span className="flex items-center gap-2">
            <Loader2 size={18} className="motion-safe:animate-spin" aria-hidden="true" />
            Guardando…
          </span>
        ) : (
          'Avísame'
        )}
      </button>

      <div ref={avisoRef}>
        {falta && (
          <p role="alert" className="text-sm leading-[1.5] text-[var(--status-error)]">
            {falta}
          </p>
        )}
        {estado === 'error' && (
          <p role="alert" className="text-sm leading-[1.5] text-[var(--status-error)]">
            No pudimos guardar tu correo. Revisa tu conexión y toca &quot;Avísame&quot; otra vez.
          </p>
        )}
      </div>
    </form>
  );
}
