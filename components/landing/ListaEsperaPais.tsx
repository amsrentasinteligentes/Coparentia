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

function MensajeError({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm leading-[1.5] text-[var(--status-error)]">
      {texto}
    </p>
  );
}

export function ListaEsperaPais() {
  const id = useId();
  const [pais, setPais] = useState('');
  const [paisOtro, setPaisOtro] = useState('');
  const [email, setEmail] = useState('');
  const [autoriza, setAutoriza] = useState(false);
  const [estado, setEstado] = useState<Estado>('quieto');
  // Errores POR CAMPO (heurística 5): cada mensaje vive bajo su campo, con aria-invalid, y el foco va al primero que falla.
  type Campo = 'pais' | 'otro' | 'correo' | 'autoriza';
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const avisoRef = useRef<HTMLDivElement>(null);
  // La barra fija de abajo puede tapar el aviso del servidor: se trae al centro de la pantalla cuando aparece.
  useEffect(() => {
    if (estado === 'error') avisoRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [estado]);
  const quitarError = (c: Campo): void => setErrores((prev) => (prev[c] ? { ...prev, [c]: undefined } : prev));

  async function enviar(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (estado === 'enviando') return;
    const limpio = email.trim();
    const nuevos: Partial<Record<Campo, string>> = {};
    if (!pais) nuevos.pais = 'Elige tu país.';
    if (pais === 'Otro' && paisOtro.trim().length < 2) nuevos.otro = 'Escribe cuál es tu país.';
    if (!FORMATO_CORREO.test(limpio)) nuevos.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    if (!autoriza) nuevos.autoriza = 'Marca la autorización para que podamos avisarte.';
    setErrores(nuevos);
    const primero = (['pais', 'otro', 'correo', 'autoriza'] as Campo[]).find((c) => nuevos[c]);
    if (primero) {
      document.getElementById(`${id}-${primero}`)?.focus();
      return;
    }
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
      <div className="flex flex-col gap-2">
        <p role="status" className="flex items-start gap-2 text-base font-medium leading-snug text-[var(--text-primary)]">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]">
            <Check size={12} strokeWidth={3} color="var(--on-accent, var(--bg))" aria-hidden="true" />
          </span>
          Listo. Te avisaremos cuando abramos en tu país.
        </p>
        {/* Control y libertad (heurística 3): si te equivocaste de correo, se puede volver al formulario. */}
        <button
          type="button"
          onClick={() => setEstado('quieto')}
          className="flex min-h-11 items-center self-start text-[14px] font-semibold text-[var(--accent-ink,var(--accent))] underline underline-offset-2 [touch-action:manipulation]"
        >
          Usar otro correo
        </button>
      </div>
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
        <select
          id={`${id}-pais`}
          value={pais}
          onChange={(e) => {
            setPais(e.target.value);
            quitarError('pais');
          }}
          aria-invalid={errores.pais ? true : undefined}
          aria-describedby={errores.pais ? `${id}-pais-err` : undefined}
          className={CAMPO}
        >
          <option value="">Elige tu país</option>
          {PAISES.map((p) => (
            <option key={p} value={p}>
              {p === 'Otro' ? 'Otro país' : p}
            </option>
          ))}
        </select>
        <MensajeError id={`${id}-pais-err`} texto={errores.pais} />
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
            onChange={(e) => {
              setPaisOtro(e.target.value);
              quitarError('otro');
            }}
            aria-invalid={errores.otro ? true : undefined}
            aria-describedby={errores.otro ? `${id}-otro-err` : undefined}
            className={CAMPO}
          />
          <MensajeError id={`${id}-otro-err`} texto={errores.otro} />
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
          onChange={(e) => {
            setEmail(e.target.value);
            quitarError('correo');
          }}
          aria-invalid={errores.correo ? true : undefined}
          aria-describedby={errores.correo ? `${id}-correo-err` : undefined}
          className={CAMPO}
        />
        <MensajeError id={`${id}-correo-err`} texto={errores.correo} />
      </div>

      <label className="flex cursor-pointer items-start gap-3 py-1 [touch-action:manipulation]">
        <input
          id={`${id}-autoriza`}
          type="checkbox"
          checked={autoriza}
          onChange={(e) => {
            setAutoriza(e.target.checked);
            quitarError('autoriza');
          }}
          aria-invalid={errores.autoriza ? true : undefined}
          aria-describedby={errores.autoriza ? `${id}-autoriza-err` : undefined}
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
      <MensajeError id={`${id}-autoriza-err`} texto={errores.autoriza} />

      <button
        type="submit"
        // La barra fija de abajo se esconde cuando este botón está a la vista (si no, lo tapaba).
        data-cta-pagina=""
        disabled={estado === 'enviando'}
        className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent)] [touch-action:manipulation] disabled:cursor-wait disabled:opacity-80"
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
        {estado === 'error' && (
          <p role="alert" className="text-sm leading-[1.5] text-[var(--status-error)]">
            No pudimos guardar tu correo. Revisa tu conexión y toca &quot;Avísame&quot; otra vez.
          </p>
        )}
      </div>
    </form>
  );
}
