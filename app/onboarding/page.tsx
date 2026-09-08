'use client';

// ONBOARDING — quiz personalizado derivado de FICHA-AVATAR.md (Carlos, y su sub-avatar
// receptor aprobado 2026-09-07). Sigue 50-DISENO-ONBOARDING-PAYWALL.md §A (preguntas +
// reconocimiento) y §B (loading). Sin backend todavía (Sesión 6): las respuestas se guardan
// en sessionStorage y viajan al paywall — nada se envía a un servidor real aún (mock
// honesto, 50 C3ter).

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform, animate } from 'motion/react';
import {
  MessageCircleWarning,
  FileSearch,
  ReceiptText,
  ShieldAlert,
  Check,
  Wallet,
  HandCoins,
  FileCheck2,
  MessageSquare,
  Scale,
  CalendarClock,
  Pencil,
  ShieldCheck,
  Info,
  Sunrise,
  Sun,
  Moon,
  Bell,
  Sparkles,
  Users,
  HelpCircle,
} from 'lucide-react';
import {
  BarraAtras,
  Chip,
  ContenedorFunnel,
  CtaFunnel,
  FunnelHeader,
  Halo,
  Marcador,
  usePasoVariants,
} from '@/components/funnel/ui';

type Rol = 'paga' | 'recibe' | '';

type Respuestas = {
  rol: Rol;
  situacion: string;
  situacionOtra: string;
  fijacion: string;
  preocupacion: string;
  metaMeses: number;
  momento: string;
  atribucion: string;
};

// Tarjeta "¿Por qué lo preguntamos?" — mismo patrón en TODAS las preguntas de solo-chips
// (antes solo la tenía el paso 0). Da un motivo real (nunca relleno decorativo), ancla el
// cierre de cada pantalla de forma consistente (antes cada paso resolvía el espacio inferior
// distinto — el revisor-visual lo marcó como falta de "encaje" entre pasos) y sube la
// heurística de ayuda contextual (h10) con contenido funcional, no con aire vacío.
// Flechas ↑/↓ para moverse entre opciones sin soltar el teclado (h7 "flexibilidad y atajos" —
// antes solo existía Tab+Enter nativo del <button>, señalado por el revisor-visual).
function manejarFlechasChips(e: KeyboardEvent<HTMLDivElement>): void {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  const botones = Array.from(e.currentTarget.querySelectorAll('button'));
  const actual = botones.indexOf(document.activeElement as HTMLButtonElement);
  if (actual === -1) return;
  e.preventDefault();
  const siguiente = e.key === 'ArrowDown' ? Math.min(actual + 1, botones.length - 1) : Math.max(actual - 1, 0);
  botones[siguiente]?.focus();
}

function InfoContextual({ children, anclar = true }: { children: ReactNode; anclar?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--bg)_60%,black)] p-4 shadow-[inset_0_1px_2px_rgb(0_0_0_/_0.3)] ${anclar ? 'mt-auto' : 'mt-6'}`}
    >
      <Info size={18} className="mt-0.5 shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
      <p className="text-[13px] leading-[1.5] text-[var(--text-secondary)]">{children}</p>
    </div>
  );
}

// Retrasa ~180ms el avance real tras elegir una opción: sin esto, `avanzar()` cambia de paso
// en el MISMO tick del clic y el spring del check de <Chip> nunca alcanza a verse (defecto real
// encontrado por el revisor-visual). El estado local muestra el check de inmediato; el padre
// se entera un instante después, cuando ya se vio la selección.
function useSeleccionRetrasada<T>(onElegir: (v: T) => void, ms = 180): { local: T | null; elegir: (v: T) => void } {
  const [local, setLocal] = useState<T | null>(null);
  const elegir = (v: T): void => {
    setLocal(v);
    setTimeout(() => onElegir(v), ms);
  };
  return { local, elegir };
}

const VACIAS: Respuestas = {
  rol: '',
  situacion: '',
  situacionOtra: '',
  fijacion: '',
  preocupacion: '',
  metaMeses: 3,
  momento: '',
  atribucion: '',
};

// Pasos numerados solo para el % de la barra (7 preguntas reales + 2 reconocimientos + loading).
const TOTAL_PASOS = 10;
const PASO_LOADING = 9;

export default function Onboarding() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [r, setR] = useState<Respuestas>(VACIAS);
  const variants = usePasoVariants();
  // Permite que un paso (ej. el sub-estado "otra cosa" de la pregunta de situación) capture
  // el botón Atrás para volver a SU estado anterior, en vez de salir del paso completo.
  const [atrasLocal, setAtrasLocal] = useState<(() => void) | null>(null);

  const avanzar = (patch?: Partial<Respuestas>): void => {
    if (patch) setR((prev) => ({ ...prev, ...patch }));
    setPaso((p) => p + 1);
  };
  const atras = (): void => setPaso((p) => Math.max(0, p - 1));

  useEffect(() => {
    if (paso === PASO_LOADING) {
      try {
        sessionStorage.setItem('coparentia_onboarding', JSON.stringify(r));
      } catch {}
    }
  }, [paso, r]);

  return (
    <ContenedorFunnel>
      <FunnelHeader />
      {paso < PASO_LOADING && (
        <BarraAtras
          porcentaje={((paso + 1) / TOTAL_PASOS) * 100}
          pasoActual={paso + 1}
          pasoTotal={TOTAL_PASOS}
          onAtras={atrasLocal ?? (paso === 0 ? () => router.push('/') : atras)}
        />
      )}

      <div className="relative mt-6 flex flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={paso}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-1 flex-col"
          >
            {paso === 0 && <PreguntaRol valor={r.rol} onElegir={(v) => avanzar({ rol: v })} />}
            {paso === 1 && (
              <PreguntaSituacion
                rol={r.rol}
                valor={r.situacion}
                onElegir={(v) => avanzar({ situacion: v })}
                onAtrasLocal={setAtrasLocal}
              />
            )}
            {paso === 2 && <PreguntaFijacion valor={r.fijacion} onElegir={(v) => avanzar({ fijacion: v })} />}
            {paso === 3 && (
              <PreguntaPreocupacion rol={r.rol} valor={r.preocupacion} onElegir={(v) => avanzar({ preocupacion: v })} />
            )}
            {paso === 4 && (
              <ReconocimientoPreocupacion
                rol={r.rol}
                situacion={r.situacion}
                preocupacion={r.preocupacion}
                onContinuar={() => avanzar()}
              />
            )}
            {paso === 5 && <PreguntaMeta valor={r.metaMeses} onFijar={(v) => avanzar({ metaMeses: v })} />}
            {paso === 6 && <PreguntaMomento valor={r.momento} onElegir={(v) => avanzar({ momento: v })} />}
            {paso === 7 && <PreguntaAtribucion valor={r.atribucion} onElegir={(v) => avanzar({ atribucion: v })} />}
            {paso === 8 && <ReconocimientoFinal respuestas={r} onContinuar={() => avanzar()} />}
            {paso === PASO_LOADING && <LoadingPlan respuestas={r} onListo={() => router.push('/paywall')} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ContenedorFunnel>
  );
}

/* ── Paso 0: rol (aprobado 2026-09-07 — abre la app también a quien RECIBE la cuota,
   ver FICHA-AVATAR.md "Sub-avatar secundario"). Bifurca el copy de las 2 preguntas siguientes. ── */
function PreguntaRol({ valor, onElegir }: { valor: Rol; onElegir: (v: Rol) => void }) {
  const { local, elegir } = useSeleccionRetrasada<Rol>(onElegir);
  const opciones: { icon: typeof Wallet; label: string; value: Rol }[] = [
    { icon: Wallet, label: 'Yo pago la cuota alimentaria', value: 'paga' },
    { icon: HandCoins, label: 'Yo recibo la cuota alimentaria', value: 'recibe' },
  ];
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="relative text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
        <Halo />
        ¿Cuál es tu <Marcador>rol</Marcador> hoy?
      </h1>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Así adaptamos las preguntas y tu expediente</p>
      <div className="mt-6 flex flex-col gap-3" onKeyDown={manejarFlechasChips}>
        {opciones.map(({ icon: Icon, label, value }, i) => (
          <Chip
            key={value}
            index={i}
            seleccionado={(local ?? valor) === value}
            onClick={() => elegir(value)}
            icon={<Icon size={20} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />}
          >
            {label}
          </Chip>
        ))}
      </div>
      <InfoContextual anclar={false}>
        ¿Por qué lo preguntamos? Quien paga y quien recibe la cuota enfrentan riesgos distintos —
        así usamos las palabras y ejemplos correctos en tu expediente.
      </InfoContextual>
      <div className="mt-auto pt-4 flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
        <p className="text-[13px] leading-[1.5] text-[var(--text-secondary)]">
          Sin importar tu rol, tu expediente queda blindado aunque el otro padre no use la app.
        </p>
      </div>
    </div>
  );
}

/* ── Paso 1: situación (eco de FICHA-AVATAR §objeciones/consciencia — categoría abierta →
   escape hatch). Opciones adaptadas al rol elegido en el paso anterior. ── */
function PreguntaSituacion({
  rol,
  valor,
  onElegir,
  onAtrasLocal,
}: {
  rol: Rol;
  valor: string;
  onElegir: (v: string) => void;
  onAtrasLocal: (fn: (() => void) | null) => void;
}) {
  const [otra, setOtra] = useState(false);
  const [texto, setTexto] = useState('');
  const opciones = [
    { icon: FileSearch, label: rol === 'recibe' ? 'Recibo pero sin registro ordenado' : 'Pago pero sin registro ordenado' },
    { icon: MessageCircleWarning, label: 'Tengo disputas frecuentes con mi ex' },
    { icon: Scale, label: 'Ya tengo un proceso legal en curso' },
  ];
  // Bug real encontrado por el revisor-visual: este hook estaba DESPUÉS del `if (otra) return`
  // de abajo — al pasar otra=false→true, React llamaba MENOS hooks que en el render anterior
  // ("Rendered fewer hooks than expected"), rompiendo la pantalla justo al tocar "Otra cosa".
  // Todo hook va ANTES de cualquier return condicional (regla de hooks de React).
  const { local, elegir } = useSeleccionRetrasada<string>(onElegir);

  // Mientras "otra" está abierto, Atrás debe volver a la lista de opciones — no salir del paso.
  useEffect(() => {
    // setAtrasLocal recibe una función: hay que envolverla en un updater explícito,
    // si no React la ejecuta como updater en vez de guardarla como valor.
    onAtrasLocal(() => (otra ? () => setOtra(false) : null));
    return () => onAtrasLocal(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otra]);

  if (otra) {
    return (
      <div className="flex flex-1 flex-col">
        <h1 className="relative text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          <Halo />
          Cuéntanos con <Marcador>tus palabras</Marcador>
        </h1>
        <input
          autoFocus
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Tu situación..."
          className="mt-6 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />
        <p className="mt-2 text-[13px] text-[var(--text-tertiary)]">Escribe al menos unas palabras para continuar.</p>
        <p className="mt-auto pt-8 text-center text-[13px] text-[var(--text-tertiary)]">
          Tus respuestas son privadas — solo se usan para armar tu expediente.
        </p>
        <div className="pt-6">
          <CtaFunnel disabled={!texto.trim()} onClick={() => onElegir(texto.trim())}>
            Continuar
          </CtaFunnel>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="relative text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          <Halo />
          ¿Cuál es tu <Marcador>situación</Marcador> hoy?
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Esto nos ayuda a armar tu expediente</p>
        <div className="mt-6 flex flex-col gap-3" onKeyDown={manejarFlechasChips}>
          {opciones.map(({ icon: Icon, label }, i) => (
            <Chip
              key={label}
              index={i}
              seleccionado={(local ?? valor) === label}
              onClick={() => elegir(label)}
              icon={<Icon size={20} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />}
            >
              {label}
            </Chip>
          ))}
          <Chip
            index={opciones.length}
            seleccionado={false}
            onClick={() => setOtra(true)}
            icon={<Pencil size={20} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />}
          >
            Otra cosa (escribe la tuya)
          </Chip>
        </div>
      </div>
      <InfoContextual anclar={false}>
        ¿Por qué lo preguntamos? Tu situación actual decide qué evidencia prioriza tu expediente
        — nunca cambia tus derechos, solo el orden en que los organizamos. Tus respuestas son
        privadas.
      </InfoContextual>
    </div>
  );
}

/* ── Paso 2: cómo está fijada la cuota (nuevo — personaliza el formato del expediente:
   informal, con acta/sentencia, o en proceso). El diagnóstico es parte del producto. ── */
function PreguntaFijacion({ valor, onElegir }: { valor: string; onElegir: (v: string) => void }) {
  const opciones = [
    { icon: FileCheck2, label: 'Acta de conciliación o sentencia judicial' },
    { icon: MessageSquare, label: 'Acuerdo informal, de palabra' },
    { icon: Scale, label: 'Estoy en proceso legal ahora mismo' },
  ];
  const { local, elegir } = useSeleccionRetrasada<string>(onElegir);
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="relative text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
        <Halo />
        ¿Cómo está <Marcador>fijada</Marcador> tu cuota?
      </h1>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Así damos el formato correcto a tu expediente</p>
      <div className="mt-6 flex flex-col gap-3" onKeyDown={manejarFlechasChips}>
        {opciones.map(({ icon: Icon, label }, i) => (
          <Chip
            key={label}
            index={i}
            seleccionado={(local ?? valor) === label}
            onClick={() => elegir(label)}
            icon={<Icon size={20} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />}
          >
            {label}
          </Chip>
        ))}
      </div>
      <InfoContextual>
        ¿Por qué lo preguntamos? El formato de tu expediente cambia según cómo esté fijada tu
        cuota — así el PDF que generes tiene el respaldo correcto para tu caso. No reemplazamos a
        tu abogado.
      </InfoContextual>
    </div>
  );
}

/* ── Paso 3: preocupación (eco literal de dolores de FICHA-AVATAR). Opciones bifurcadas por
   rol — quien paga y quien recibe viven el mismo conflicto desde lados opuestos. ── */
function PreguntaPreocupacion({ rol, valor, onElegir }: { rol: Rol; valor: string; onElegir: (v: string) => void }) {
  const opcionesPaga = [
    { icon: MessageCircleWarning, label: 'Que no me crean que ya pagué' },
    { icon: FileSearch, label: 'No tener comprobantes organizados' },
    { icon: ReceiptText, label: 'Gastos sin autorizar que me reclaman' },
    { icon: ShieldAlert, label: 'Miedo a una demanda futura' },
  ];
  const opcionesRecibe = [
    { icon: CalendarClock, label: 'Que no me paguen a tiempo o completo' },
    { icon: FileSearch, label: 'No tener claro qué gastos ya cubrí yo' },
    { icon: ReceiptText, label: 'Que digan que ya pagaron cuando no fue así' },
    { icon: ShieldAlert, label: 'Miedo a tener que reclamar y no tener pruebas' },
  ];
  const opciones = rol === 'recibe' ? opcionesRecibe : opcionesPaga;
  const { local, elegir } = useSeleccionRetrasada<string>(onElegir);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="relative text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          <Halo />
          ¿Qué te <Marcador>preocupa</Marcador> más ahora mismo?
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">No hay respuesta incorrecta</p>
        <div className="mt-6 flex flex-col gap-3" onKeyDown={manejarFlechasChips}>
          {opciones.map(({ icon: Icon, label }, i) => (
            <Chip
              key={label}
              index={i}
              seleccionado={(local ?? valor) === label}
              onClick={() => elegir(label)}
              icon={<Icon size={20} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>
      <InfoContextual anclar={false}>
        ¿Por qué lo preguntamos? Priorizamos qué te mostramos primero en tu expediente según lo
        que más te preocupa.
      </InfoContextual>
    </div>
  );
}

/* ── Reconocimiento 1 (A5): desculpa con la causa real, en el lenguaje del avatar —
   bifurcado por rol. Si hay conflicto declarado, refuerza la ventaja unilateral (objeción
   #1 de FICHA-AVATAR). ── */
function ReconocimientoPreocupacion({
  rol,
  situacion,
  preocupacion,
  onContinuar,
}: {
  rol: Rol;
  situacion: string;
  preocupacion: string;
  onContinuar: () => void;
}) {
  const textos: Record<string, string> = {
    'Que no me crean que ya pagué':
      'No es que no pagues — es que una captura de WhatsApp no prueba nada por sí sola. El problema es el registro, no tu cumplimiento.',
    'No tener comprobantes organizados':
      'Nadie te enseñó a archivar comprobantes como un abogado. No es desorden tuyo: es que ningún sistema estaba pensado para esto.',
    'Gastos sin autorizar que me reclaman':
      'Sin un registro de autorizaciones, cualquier gasto se vuelve una discusión. El problema es la falta de un canal, no tu buena fe.',
    'Miedo a una demanda futura':
      'Ese miedo baja cuando tienes con qué responder. No se trata de "tener razón" — se trata de tener la prueba a la mano.',
    'Que no me paguen a tiempo o completo':
      'No es que no tengas derecho a reclamar — es que sin fechas ni montos claros, cualquier reclamo se vuelve tu palabra contra la suya. El problema es el registro, no tu razón.',
    'No tener claro qué gastos ya cubrí yo':
      'Cargar con gastos sin dejar constancia no es falta de organización tuya: es que nadie te dio un lugar donde quedaran, con fecha y soporte.',
    'Que digan que ya pagaron cuando no fue así':
      'Sin un registro neutral, cualquier pago se vuelve una discusión de memoria. El problema es la falta de un canal, no tu palabra.',
    'Miedo a tener que reclamar y no tener pruebas':
      'Ese miedo baja cuando tienes con qué respaldar tu reclamo. No se trata de "tener razón" — se trata de tener la prueba a la mano.',
  };
  const mostrarRefuerzoUnilateral = situacion === 'Tengo disputas frecuentes con mi ex';
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4, duration: reduce ? 0 : 0.5 }}
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
      >
        <Check size={28} strokeWidth={2.4} color="var(--accent)" aria-hidden="true" />
      </motion.span>
      <h1 className="mt-6 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tiene sentido que te preocupe
      </h1>
      <p className="mt-4 max-w-[38ch] text-[16px] leading-[1.5] text-[var(--text-secondary)]">
        {textos[preocupacion] ??
          (rol === 'recibe'
            ? 'Es un problema de registro, no de tu derecho a reclamar — y por eso Coparentia existe.'
            : 'Es un problema de registro, no de cumplimiento — y por eso Coparentia existe.')}
      </p>
      {mostrarRefuerzoUnilateral && (
        <div className="mt-6 flex max-w-[36ch] items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] p-4 text-left">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
          <p className="text-[14px] leading-[1.5] text-[var(--text-secondary)]">
            No necesitas que tu ex también use la app: tu <Marcador>expediente queda blindado</Marcador> igual, la use o no.
          </p>
        </div>
      )}
      <div className="mt-auto w-full pt-8">
        <CtaFunnel onClick={onContinuar}>Continuar</CtaFunnel>
      </div>
    </div>
  );
}

/* ── Paso 5: compromiso (A6, slider/valor héroe) ── */
function PreguntaMeta({ valor, onFijar }: { valor: number; onFijar: (v: number) => void }) {
  const [n, setN] = useState(valor || 3);
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? n : 1);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState(reduce ? n : 1);
  const feedback =
    n <= 2 ? 'Un buen punto de partida' : n <= 6 ? 'Meta realista para empezar' : 'Ambiciosa — te acompañamos';

  useEffect(() => {
    const controls = animate(mv, n, { duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  useEffect(() => {
    const unsub = rounded.on('change', setDisplay);
    return unsub;
  }, [rounded]);

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Cuántos <Marcador>meses</Marcador> de comprobantes quieres organizar primero?
      </h1>
      <div className="mt-10 flex flex-col items-center">
        <p className="text-[48px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {display}
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

/* ── Paso 6: anclaje contextual (siempre va — fija hora de recordatorio) ── */
function PreguntaMomento({ valor, onElegir }: { valor: string; onElegir: (v: string) => void }) {
  const opciones = [
    { icon: Sunrise, label: 'En la mañana' },
    { icon: Sun, label: 'A mitad de tarde' },
    { icon: Moon, label: 'En la noche' },
    { icon: Bell, label: 'Cuando llega un reclamo' },
  ];
  const { local, elegir } = useSeleccionRetrasada<string>(onElegir);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="relative text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          <Halo />
          ¿Cuándo <Marcador>revisas</Marcador> tus gastos familiares?
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Así te avisamos en el momento correcto</p>
        <div className="mt-6 flex flex-col gap-3" onKeyDown={manejarFlechasChips}>
          {opciones.map(({ icon: Icon, label }, i) => (
            <Chip
              key={label}
              index={i}
              seleccionado={(local ?? valor) === label}
              onClick={() => elegir(label)}
              icon={<Icon size={20} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>
      <InfoContextual anclar={false}>
        ¿Por qué lo preguntamos? Así te avisamos justo antes de que necesites revisar tus
        comprobantes — puedes cambiar el horario de tus alertas cuando quieras.
      </InfoContextual>
    </div>
  );
}

/* ── Paso 7: atribución (Cal AI pattern — dato de marketing) ── */
function PreguntaAtribucion({ valor, onElegir }: { valor: string; onElegir: (v: string) => void }) {
  const opciones = [
    { icon: Sparkles, label: 'Redes sociales (Instagram, TikTok, Google)' },
    { icon: Scale, label: 'Mi abogado me la recomendó' },
    { icon: Users, label: 'Un amigo o familiar' },
    { icon: HelpCircle, label: 'Otro' },
  ];
  const { local, elegir } = useSeleccionRetrasada<string>(onElegir);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="relative text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          <Halo />
          ¿Cómo <Marcador>conociste</Marcador> Coparentia?
        </h1>
        <div className="mt-6 flex flex-col gap-3" onKeyDown={manejarFlechasChips}>
          {opciones.map(({ icon: Icon, label }, i) => (
            <Chip
              key={label}
              index={i}
              seleccionado={(local ?? valor) === label}
              onClick={() => elegir(label)}
              icon={<Icon size={20} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>
      <InfoContextual anclar={false}>
        ¿Por qué lo preguntamos? Nos ayuda a saber dónde encontrarte, para seguir ayudando a más
        familias como la tuya. Último paso antes de ver tu plan.
      </InfoContextual>
    </div>
  );
}

/* ── Reconocimiento final (A5, variante etiquetado positivo — regla b de LA ESCALERA).
   Nombra el mecanismo (regla del 02B: "el usuario debe poder decir el nombre de lo que
   acaba de configurar") — antes solo vivía en landing/paywall, nunca en el onboarding. ── */
function ReconocimientoFinal({ respuestas, onContinuar }: { respuestas: Respuestas; onContinuar: () => void }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4, duration: reduce ? 0 : 0.5 }}
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
      >
        <Check size={28} strokeWidth={2.4} color="var(--accent)" aria-hidden="true" />
      </motion.span>
      <h1 className="mt-6 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tus respuestas te describen
      </h1>
      <p className="mt-4 max-w-[40ch] text-[16px] leading-[1.5] text-[var(--text-secondary)]">
        Eres alguien que prefiere <span className="font-semibold text-[var(--text-primary)]">prevenir antes que discutir</span> —
        la mayoría espera hasta la primera pelea para buscar una solución. Tu expediente ya tiene ventaja.
      </p>
      <div className="mt-6 flex max-w-[38ch] items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] p-4 text-left">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
        <p className="text-[14px] leading-[1.5] text-[var(--text-secondary)]">
          Cada comprobante que subas llevará el <Marcador>Sello de Confianza</Marcador>: fecha y respaldo que nadie puede alterar en silencio.
        </p>
      </div>
      <div className="mt-auto w-full pt-8">
        <CtaFunnel onClick={onContinuar}>Ver mi plan</CtaFunnel>
      </div>
    </div>
  );
}

/* ── Loading "construyendo tu plan" (B) — el argumento de apertura del paywall. Nombra el
   Sello de Confianza explícitamente (antes solo aparecía en landing/paywall). ── */
function LoadingPlan({ respuestas, onListo }: { respuestas: Respuestas; onListo: () => void }) {
  const reduce = useReducedMotion();
  const lineas = [
    `Registrando tu situación: ${respuestas.situacion || 'tu caso'}`,
    'Activando el Sello de Confianza para tus comprobantes',
    `Ajustando a tu meta de ${respuestas.metaMeses} ${respuestas.metaMeses === 1 ? 'mes' : 'meses'} de comprobantes`,
    `Configurando tus alertas para ${respuestas.momento || 'el momento que elegiste'}`,
    'Preparando tu primer expediente',
  ];
  const [activa, setActiva] = useState(0);
  const [completadas, setCompletadas] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // `cancelado` (no solo el clearTimeout del ref) evita que una cadena vieja de timeouts
    // siga escribiendo estado si el efecto se reinicia (ej. Strict Mode en desarrollo) —
    // sin esto, dos cadenas superpuestas pueden marcar los pasos fuera de orden.
    let cancelado = false;
    let i = 0;
    const avanzarLinea = (): void => {
      if (cancelado || i >= lineas.length) return;
      // Capturar el índice en una constante ANTES de mutar `i`: el updater funcional de
      // setCompletadas se ejecuta después (React lo difiere), así que si usara `i` directamente
      // (variable mutable del closure) vería el valor YA incrementado, no el de esta vuelta —
      // esto era la causa real del checklist marcando pasos fuera de orden.
      const idx = i;
      setCompletadas((c) => [...c, idx]);
      i += 1;
      if (i < lineas.length) {
        setActiva(i);
        timerRef.current = setTimeout(avanzarLinea, reduce ? 100 : 700);
      } else {
        timerRef.current = setTimeout(() => {
          if (!cancelado) onListo();
        }, reduce ? 200 : 800);
      }
    };
    timerRef.current = setTimeout(avanzarLinea, reduce ? 100 : 600);
    return () => {
      cancelado = true;
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
            initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
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
