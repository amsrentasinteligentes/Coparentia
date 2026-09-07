'use client';

// ONBOARDING — quiz personalizado derivado de FICHA-AVATAR.md (Carlos). Sigue
// 50-DISENO-ONBOARDING-PAYWALL.md §A (preguntas + reconocimiento) y §B (loading).
// Sin backend todavía (Sesión 6): las respuestas se guardan en sessionStorage y
// viajan al paywall — nada se envía a un servidor real aún (mock honesto, 50 C3ter).

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MessageCircleWarning, FileSearch, ReceiptText, ShieldAlert, Check } from 'lucide-react';
import {
  BarraAtras,
  Chip,
  ContenedorFunnel,
  CtaFunnel,
  FunnelHeader,
  usePasoVariants,
} from '@/components/funnel/ui';

type Respuestas = {
  situacion: string;
  situacionOtra: string;
  preocupacion: string;
  metaMeses: number;
  momento: string;
  atribucion: string;
};

const VACIAS: Respuestas = {
  situacion: '',
  situacionOtra: '',
  preocupacion: '',
  metaMeses: 3,
  momento: '',
  atribucion: '',
};

// Pasos numerados solo para el % de la barra (5 preguntas reales + 2 reconocimientos + loading).
const TOTAL_PASOS = 8;

export default function Onboarding() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [r, setR] = useState<Respuestas>(VACIAS);
  const variants = usePasoVariants();

  const avanzar = (patch?: Partial<Respuestas>): void => {
    if (patch) setR((prev) => ({ ...prev, ...patch }));
    setPaso((p) => p + 1);
  };
  const atras = (): void => setPaso((p) => Math.max(0, p - 1));

  useEffect(() => {
    if (paso === 7) {
      try {
        sessionStorage.setItem('coparentia_onboarding', JSON.stringify(r));
      } catch {}
    }
  }, [paso, r]);

  return (
    <ContenedorFunnel>
      <FunnelHeader />
      {paso < 7 && <BarraAtras porcentaje={((paso + 1) / TOTAL_PASOS) * 100} onAtras={paso === 0 ? undefined : atras} />}

      <div className="relative mt-8 flex flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={paso}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-1 flex-col"
          >
            {paso === 0 && <PreguntaSituacion valor={r.situacion} onElegir={(v) => avanzar({ situacion: v })} />}
            {paso === 1 && <PreguntaPreocupacion valor={r.preocupacion} onElegir={(v) => avanzar({ preocupacion: v })} />}
            {paso === 2 && <ReconocimientoPreocupacion preocupacion={r.preocupacion} onContinuar={() => avanzar()} />}
            {paso === 3 && <PreguntaMeta valor={r.metaMeses} onFijar={(v) => avanzar({ metaMeses: v })} />}
            {paso === 4 && <PreguntaMomento valor={r.momento} onElegir={(v) => avanzar({ momento: v })} />}
            {paso === 5 && <PreguntaAtribucion valor={r.atribucion} onElegir={(v) => avanzar({ atribucion: v })} />}
            {paso === 6 && <ReconocimientoFinal respuestas={r} onContinuar={() => avanzar()} />}
            {paso === 7 && <LoadingPlan respuestas={r} onListo={() => router.push('/paywall')} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ContenedorFunnel>
  );
}

/* ── Paso 1: situación (eco de FICHA-AVATAR §objeciones/consciencia — categoría abierta → escape hatch) ── */
function PreguntaSituacion({ valor, onElegir }: { valor: string; onElegir: (v: string) => void }) {
  const [otra, setOtra] = useState(false);
  const [texto, setTexto] = useState('');
  const opciones = [
    'Pago pero sin registro ordenado',
    'Tengo disputas frecuentes con mi ex',
    'Ya tengo un proceso legal en curso',
  ];
  if (otra) {
    return (
      <div className="flex flex-1 flex-col">
        <h1 className="text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Cuéntanos con tus palabras
        </h1>
        <input
          autoFocus
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Tu situación..."
          className="mt-6 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />
        <div className="mt-auto pt-6">
          <CtaFunnel disabled={!texto.trim()} onClick={() => onElegir(texto.trim())}>
            Continuar
          </CtaFunnel>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Cuál es tu situación hoy?
      </h1>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Esto nos ayuda a armar tu expediente</p>
      <div className="mt-6 flex flex-col gap-3">
        {opciones.map((op) => (
          <Chip key={op} seleccionado={valor === op} onClick={() => onElegir(op)}>
            {op}
          </Chip>
        ))}
        <Chip seleccionado={false} onClick={() => setOtra(true)}>
          Otra cosa (escribe la tuya)
        </Chip>
      </div>
    </div>
  );
}

/* ── Paso 2: preocupación (eco literal de dolores #1-#4 de FICHA-AVATAR) ── */
function PreguntaPreocupacion({ valor, onElegir }: { valor: string; onElegir: (v: string) => void }) {
  const opciones = [
    { icon: MessageCircleWarning, label: 'Que no me crean que ya pagué' },
    { icon: FileSearch, label: 'No tener comprobantes organizados' },
    { icon: ReceiptText, label: 'Gastos sin autorizar que me reclaman' },
    { icon: ShieldAlert, label: 'Miedo a una demanda futura' },
  ];
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Qué te preocupa más ahora mismo?
      </h1>
      <div className="mt-6 flex flex-col gap-3">
        {opciones.map(({ icon: Icon, label }) => (
          <Chip
            key={label}
            seleccionado={valor === label}
            onClick={() => onElegir(label)}
            icon={<Icon size={20} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />}
          >
            {label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/* ── Reconocimiento 1 (A5): desculpa con la causa real, en el lenguaje del avatar ── */
function ReconocimientoPreocupacion({ preocupacion, onContinuar }: { preocupacion: string; onContinuar: () => void }) {
  const textos: Record<string, string> = {
    'Que no me crean que ya pagué':
      'No es que no pagues — es que una captura de WhatsApp no prueba nada por sí sola. El problema es el registro, no tu cumplimiento.',
    'No tener comprobantes organizados':
      'Nadie te enseñó a archivar comprobantes como un abogado. No es desorden tuyo: es que ningún sistema estaba pensado para esto.',
    'Gastos sin autorizar que me reclaman':
      'Sin un registro de autorizaciones, cualquier gasto se vuelve una discusión. El problema es la falta de un canal, no tu buena fe.',
    'Miedo a una demanda futura':
      'Ese miedo baja cuando tienes con qué responder. No se trata de "tener razón" — se trata de tener la prueba a la mano.',
  };
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
      >
        <Check size={28} strokeWidth={2.4} color="var(--accent)" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tiene sentido que te preocupe
      </h1>
      <p className="mt-4 max-w-[38ch] text-[16px] leading-[1.5] text-[var(--text-secondary)]">
        {textos[preocupacion] ?? 'Es un problema de registro, no de cumplimiento — y por eso Coparentia existe.'}
      </p>
      <div className="mt-auto w-full pt-8">
        <CtaFunnel onClick={onContinuar}>Continuar</CtaFunnel>
      </div>
    </div>
  );
}

/* ── Paso 3: compromiso (A6, slider/valor héroe) ── */
function PreguntaMeta({ valor, onFijar }: { valor: number; onFijar: (v: number) => void }) {
  const [n, setN] = useState(valor || 3);
  const feedback =
    n <= 2 ? 'Un buen punto de partida' : n <= 6 ? 'Meta realista para empezar' : 'Ambiciosa — te acompañamos';
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Cuántos meses de comprobantes quieres organizar primero?
      </h1>
      <div className="mt-10 flex flex-col items-center">
        <p className="text-[48px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {n}
        </p>
        <p className="mt-1 text-[14px] text-[var(--text-secondary)]">meses</p>
        <input
          type="range"
          min={1}
          max={12}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="mt-8 w-full accent-[var(--accent)]"
          aria-label="Meses de comprobantes a organizar"
        />
        <div className="mt-1 flex w-full justify-between text-[12px] tabular-nums text-[var(--text-tertiary)]">
          <span>1</span>
          <span>12</span>
        </div>
        <p className="mt-6 text-[14px] font-medium text-[var(--accent)]">⚡ {feedback}</p>
      </div>
      <div className="mt-auto pt-8">
        <CtaFunnel onClick={() => onFijar(n)}>Fijar mi meta</CtaFunnel>
      </div>
    </div>
  );
}

/* ── Paso 4: anclaje contextual (siempre va — fija hora de recordatorio) ── */
function PreguntaMomento({ valor, onElegir }: { valor: string; onElegir: (v: string) => void }) {
  const opciones = ['En la mañana', 'A mitad de tarde', 'En la noche', 'Cuando llega un reclamo'];
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Cuándo revisas tus gastos familiares?
      </h1>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Así te avisamos en el momento correcto</p>
      <div className="mt-6 flex flex-col gap-3">
        {opciones.map((op) => (
          <Chip key={op} seleccionado={valor === op} onClick={() => onElegir(op)}>
            {op}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/* ── Paso 5: atribución (Cal AI pattern — dato de marketing) ── */
function PreguntaAtribucion({ valor, onElegir }: { valor: string; onElegir: (v: string) => void }) {
  const opciones = ['Instagram o TikTok', 'Mi abogado me la recomendó', 'Google', 'Un amigo o familiar', 'Otro'];
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Cómo conociste Coparentia?
      </h1>
      <div className="mt-6 flex flex-col gap-3">
        {opciones.map((op) => (
          <Chip key={op} seleccionado={valor === op} onClick={() => onElegir(op)}>
            {op}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/* ── Reconocimiento final (A5, variante etiquetado positivo — regla b de LA ESCALERA) ── */
function ReconocimientoFinal({ respuestas, onContinuar }: { respuestas: Respuestas; onContinuar: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
      >
        <Check size={28} strokeWidth={2.4} color="var(--accent)" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tus respuestas te describen
      </h1>
      <p className="mt-4 max-w-[40ch] text-[16px] leading-[1.5] text-[var(--text-secondary)]">
        Eres alguien que prefiere <span className="font-semibold text-[var(--text-primary)]">prevenir antes que discutir</span> —
        la mayoría espera hasta la primera pelea para buscar una solución. Tu expediente ya tiene ventaja.
      </p>
      <div className="mt-auto w-full pt-8">
        <CtaFunnel onClick={onContinuar}>Ver mi plan</CtaFunnel>
      </div>
    </div>
  );
}

/* ── Loading "construyendo tu plan" (B) — el argumento de apertura del paywall ── */
function LoadingPlan({ respuestas, onListo }: { respuestas: Respuestas; onListo: () => void }) {
  const reduce = useReducedMotion();
  const lineas = [
    `Registrando tu situación: ${respuestas.situacion || 'tu caso'}`,
    `Ajustando a tu meta de ${respuestas.metaMeses} ${respuestas.metaMeses === 1 ? 'mes' : 'meses'} de comprobantes`,
    `Configurando tus alertas para ${respuestas.momento || 'el momento que elegiste'}`,
    'Preparando tu primer expediente',
  ];
  const [activa, setActiva] = useState(0);
  const [completadas, setCompletadas] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let i = 0;
    const avanzarLinea = (): void => {
      if (i < lineas.length) {
        setCompletadas((c) => [...c, i]);
        i += 1;
        if (i < lineas.length) {
          setActiva(i);
          timerRef.current = setTimeout(avanzarLinea, reduce ? 100 : 800);
        } else {
          timerRef.current = setTimeout(onListo, reduce ? 200 : 900);
        }
      }
    };
    timerRef.current = setTimeout(avanzarLinea, reduce ? 100 : 700);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round(((completadas.length) / lineas.length) * 100);

  return (
    <div className="flex flex-1 flex-col items-center pt-6" aria-live="polite" aria-busy={pct < 100}>
      <div className="relative flex size-28 items-center justify-center">
        <svg width={112} height={112} viewBox="0 0 112 112" aria-hidden="true">
          <circle cx="56" cy="56" r="48" fill="none" stroke="color-mix(in oklab, var(--text-tertiary) 18%, transparent)" strokeWidth="9" />
          <motion.circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 48}
            animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - pct / 100) }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            transform="rotate(-90 56 56)"
          />
        </svg>
        <span className="absolute text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {pct}%
        </span>
      </div>
      <h1 className="mt-6 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Construyendo tu expediente…
      </h1>
      <ul className="mt-8 flex w-full flex-col gap-4">
        {lineas.map((linea, i) => {
          const hecha = completadas.includes(i);
          const enCurso = activa === i && !hecha;
          return (
            <li key={i} className={`flex items-start gap-3 ${hecha || enCurso ? 'opacity-100' : 'opacity-40'}`}>
              {hecha ? (
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]">
                  <Check size={12} strokeWidth={3} color="var(--bg)" />
                </span>
              ) : (
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    enCurso ? 'border-[var(--accent)] animate-pulse' : 'border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)]'
                  }`}
                />
              )}
              <span className="text-[15px] leading-snug text-[var(--text-primary)]">{linea}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
