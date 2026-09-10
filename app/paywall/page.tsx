'use client';

// PAYWALL DE SECUENCIA (C0-C4 de 50-DISENO-ONBOARDING-PAYWALL.md): recap del valor
// personalizado → timeline del trial → precio. +37% de conversión vs una sola página
// (Superwall 2026). Sin Hotmart conectado todavía (Sesión 6): el CTA final lleva a
// /entrar como mock honesto — NUNCA un checkout falso que simule un cobro real (C3ter).

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, X, Check, ShieldCheck, Lock, FileCheck2, HeartHandshake } from 'lucide-react';
import { BarraProgreso, CtaFunnel, FunnelHeader, Halo, Marcador, usePasoVariants } from '@/components/funnel/ui';

/* ── <PrecioContado> — el número héroe cuenta desde 0 hasta su valor (baseline 2 de las 7
   animaciones del SO, que a esta pantalla le faltaba: el precio aparecía estático). Cuenta con
   dos decimales porque el precio los tiene; con prefers-reduced-motion se muestra ya final. ── */
function PrecioContado({ valor }: { valor: number }) {
  const reduce = useReducedMotion();
  const [mostrado, setMostrado] = useState(reduce ? valor : 0);

  useEffect(() => {
    if (reduce) {
      setMostrado(valor);
      return;
    }
    const DURACION = 600;
    const inicio = performance.now();
    let frame = 0;
    const paso = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / DURACION);
      const suavizado = 1 - Math.pow(1 - t, 3); // ease-out cúbico, coherente con "Sereno"
      setMostrado(valor * suavizado);
      if (t < 1) frame = requestAnimationFrame(paso);
    };
    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [valor, reduce]);

  return <>US${mostrado.toFixed(2)}</>;
}

/* ── <CheckPlan> — check circular animado del plan activo, mismo device que <Chip> ── */
function CheckPlan({ activo }: { activo: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        activo ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)] bg-transparent'
      }`}
    >
      {activo && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, type: 'spring', bounce: 0.35 }}
          className="flex items-center justify-center"
        >
          <Check size={12} strokeWidth={3} color="var(--bg)" />
        </motion.span>
      )}
    </span>
  );
}

type Respuestas = {
  situacion: string;
  situacionOtra: string;
  preocupacion: string;
  metaMeses: number;
  momento: string;
  atribucion: string;
};

// $89/año vs $9.99×12=$119.88 mensual: ahorro real $30.88 ≈ 3.09 meses de plan mensual — nunca
// redondear al alza (bug real encontrado por el revisor-visual: decía "4 meses", matemáticamente
// incorrecto y dañino para un avatar que desconfía justo de las cuentas que no cuadran).
// Precios en UN solo lugar y como NÚMEROS: el conteo animado los necesita numéricos, y tenerlos
// duplicados como texto era la vía directa a que un cambio de precio actualizara una pantalla y
// no la otra. El costo por día se deriva aquí mismo, nunca se escribe a mano.
const PLAN_ANUAL = { precioMes: 7.42, totalAnual: 'Se cobra US$89 al año', costoDia: 'US$0.24' };
const PLAN_MENSUAL = { precioMes: 9.99, costoDia: 'US$0.33' };

export default function Paywall() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [r, setR] = useState<Respuestas | null>(null);
  const [plan, setPlan] = useState<'anual' | 'mensual'>('anual');
  const [yendo, setYendo] = useState(false);
  const [falloAlAbrir, setFalloAlAbrir] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Sin esto el temporizador seguia vivo tras salir de la pantalla.
  useEffect(() => () => { if (temporizador.current) clearTimeout(temporizador.current); }, []);
  const variants = usePasoVariants();
  // Antes esto caía a 5 cuando NO había respuestas guardadas: quien entrara directo a /paywall
  // leía "Hecho con tus 5 respuestas" sin haber contestado ninguna — personalización falsa, justo
  // el tipo de detalle que este avatar (que desconfía de las cuentas que no cuadran) castiga.
  const nRespuestas = r
    ? [r.situacion, r.preocupacion, String(r.metaMeses), r.momento, r.atribucion].filter(Boolean).length
    : 0;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('coparentia_onboarding');
      if (raw) setR(JSON.parse(raw));
    } catch {}
  }, []);

  const cerrar = (): void => router.push('/');
  // `yendo` bloquea el doble tap en la acción crítica del funnel y deja el botón en estado de
  // espera: sin esto, un tap nervioso en una red lenta dispara dos navegaciones (regla del SO
  // "prevenir doble-click en acciones críticas" — el revisor lo marcó como faltante).
  const irAlLogin = (): void => {
    if (yendo) return;
    setFalloAlAbrir(false);
    setYendo(true);
    try {
      sessionStorage.setItem('coparentia_plan_elegido', plan);
    } catch {}
    router.push('/entrar');
    // Red de seguridad: si la navegación no ocurre (red caída, ruta que falla), sin esto el botón
    // se quedaba en "Abriendo…" y DESHABILITADO para siempre, dejando a la persona encerrada en el
    // último paso de la venta. Y liberarlo en silencio tampoco basta: sin explicación, quien lo ve
    // volver solo asume que la app se rompió.
    // 6s (no 2.5s): en una red lenta de LATAM la navegación puede tardar más que eso, y avisar de
    // un fallo que NO ocurrió es peor que no avisar. El timer se guarda para poder cancelarlo al
    // desmontar — si no, seguía corriendo tras salir de la pantalla.
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      setYendo(false);
      setFalloAlAbrir(true);
    }, 6000);
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-[520px] flex-col px-4 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* "Volver" y "Cerrar" eran DOS círculos rellenos idénticos con consecuencias opuestas:
              uno retrocede un paso, el otro abandona la compra. Ahora el retroceso va sin fondo
              (mismo tratamiento que en el onboarding) y el círculo relleno queda solo para la X. */}
          {paso > 0 && (
            <button
              type="button"
              onClick={() => setPaso((p) => Math.max(0, p - 1))}
              aria-label="Volver al paso anterior"
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
          )}
          <FunnelHeader />
        </div>
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="flex size-11 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)] text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* De 3 pasos a 2: el recap del valor y la línea de tiempo de la prueba vivían en pantallas
          separadas y cada una tenía ~39% de fondo vacío, porque su contenido real eran 3 líneas.
          Fusionadas responden juntas las dos preguntas que van encadenadas ("qué me llevo" y
          "cuándo me cobran") y llenan una pantalla completa. Decisión aprobada por el usuario. */}
      <div className="mt-1 flex items-center gap-2">
        <BarraProgreso porcentaje={((paso + 1) / 2) * 100} />
        <span className="shrink-0 whitespace-nowrap text-right text-[12px] tabular-nums text-[var(--text-tertiary)]">
          Paso {paso + 1} de 2
        </span>
      </div>

      <div className="relative mt-4 flex flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={paso} variants={variants} initial="enter" animate="center" exit="exit" className="flex flex-1 flex-col">
            {paso === 0 && (
              <ValorYPrueba situacion={r?.situacion} n={nRespuestas} plan={plan} onContinuar={() => setPaso(1)} />
            )}
            {paso === 1 && (
              <Precio plan={plan} onCambiarPlan={setPlan} onCta={irAlLogin} onAhoraNo={cerrar} yendo={yendo} falloAlAbrir={falloAlAbrir} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Pantalla 1: VALOR + PRUEBA en una sola vista ──────────────────────────────────────────
   Antes eran DOS pantallas (recap del valor / línea de tiempo del trial). Cada una tenía ~39% de
   fondo vacío porque su contenido real eran 3 líneas, y el revisor-visual señaló que centrarlas
   repartía el aire pero no lo llenaba. Fusionadas responden en cadena las dos preguntas que van
   juntas —"qué me llevo" y "cuándo me cobran"— y llenan la pantalla con valor real. */
function ValorYPrueba({
  situacion,
  n,
  plan,
  onContinuar,
}: {
  situacion?: string;
  n: number;
  plan: 'anual' | 'mensual';
  onContinuar: () => void;
}) {
  const reduce = useReducedMotion();
  const entrada = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.34, ease: [0.22, 0.61, 0.36, 1] as const, delay: reduce ? 0 : i * 0.05 },
  });

  const incluye = [
    'El Sello de Confianza en cada comprobante',
    'Expediente exportable en PDF foliado',
    'Alertas en el momento que elegiste',
  ];
  // El cobro se deriva del plan elegido: antes decía "$89/año" fijo, así que quien volvía atrás
  // con el plan Mensual leía un precio que no era el suyo.
  const cobro = plan === 'anual' ? 'US$89 al año' : 'US$9.99 al mes';
  const nodos = [
    { titulo: 'Hoy — acceso completo', detalle: 'Todo tu expediente, sin límites', activo: true },
    { titulo: 'Día 5 — te avisamos', detalle: 'Correo antes de cualquier cobro', activo: true },
    { titulo: `Día 7 — primer cobro: ${cobro}`, detalle: 'Cancela antes sin costo', activo: false },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="relative text-balance text-[30px] font-bold leading-[1.12] text-[var(--text-primary)] [font-family:var(--font-display)]">
        <Halo />
        Tu expediente está <span className="text-[var(--accent)]">listo para empezar</span>
      </h1>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
        {n > 0 ? (
          <>Hecho con tus {n} respuestas{situacion ? ` · "${situacion}"` : ''}</>
        ) : (
          <>Así funciona tu expediente desde el primer día</>
        )}
      </p>

      {/* BLOQUE 1 — qué te llevas. Filas compactas, sin marco de tarjeta: al convivir con el
          timeline en la misma pantalla, tres tarjetas completas competían por el protagonismo. */}
      <div className="mt-6 flex flex-col gap-3">
        {incluye.map((f, i) => (
          <motion.div key={f} {...entrada(i)} className="flex items-center gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
              <Check size={13} strokeWidth={2.8} color="var(--accent)" />
            </span>
            <span className="text-[15px] text-[var(--text-primary)]">{f}</span>
          </motion.div>
        ))}
      </div>

      {/* Hairline degradada: FICHA-ARTE.md la declara parte del kit de profundidad y no existía en
          ninguna pantalla (defecto del revisor). Aquí separa los dos bloques sin meter otra caja. */}
      <div
        aria-hidden="true"
        className="my-6 h-px w-full"
        style={{
          background:
            'linear-gradient(to right, transparent, color-mix(in oklab, var(--accent) 38%, transparent), transparent)',
        }}
      />

      {/* BLOQUE 2 — cuándo te cobran. ELEVADO sobre superficie propia: el paso 1 era todo texto
          plano mientras el paso 2 es de tarjetas, así que el sistema de profundidad cambiaba entre
          dos pantallas seguidas (defecto del revisor). Además el calendario de cobros es lo que más
          se relee antes de decidir: merece su propio plano. */}
      <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
        <h2 className="text-[19px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
          7 días gratis, sin sorpresas
        </h2>
        <div className="mt-4 flex flex-col">
          {nodos.map((nodo, i) => (
          <motion.div key={i} {...entrada(i + incluye.length)} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex size-3 shrink-0 rounded-full ${
                  nodo.activo ? 'bg-[var(--accent)]' : 'border-2 border-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)] bg-transparent'
                }`}
              />
              {i < nodos.length - 1 && (
                <motion.span
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1], delay: reduce ? 0 : 0.3 + i * 0.05 }}
                  className="mt-1 w-[2px] flex-1 origin-top bg-[color-mix(in_oklab,var(--accent)_35%,transparent)]"
                />
              )}
            </div>
              <div className="pb-5">
                <p className="text-[15px] font-semibold text-[var(--text-primary)]">{nodo.titulo}</p>
                <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{nodo.detalle}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-[13px] leading-[1.5] text-[var(--text-tertiary)]">
          El aviso del día 5 llega por correo. Podrás sumar notificaciones desde Ajustes cuando entres.
        </p>
      </div>

      <div className="mt-auto pt-6">
        <CtaFunnel onClick={onContinuar}>Ver mi plan y precio</CtaFunnel>
      </div>
    </div>
  );
}

/* ── Pantalla 3: PRECIO (C1) — headline con meta, cards, CTA, salida limpia ── */
function Precio({
  plan,
  onCambiarPlan,
  onCta,
  onAhoraNo,
  yendo,
  falloAlAbrir,
}: {
  plan: 'anual' | 'mensual';
  onCambiarPlan: (p: 'anual' | 'mensual') => void;
  onCta: () => void;
  onAhoraNo: () => void;
  yendo: boolean;
  falloAlAbrir: boolean;
}) {
  const reduce = useReducedMotion();
  // Derivado del precio REAL del plan activo, no un número de marketing: $89/365 = $0.24 ·
  // $9.99/30 = $0.33. Cualquiera puede comprobarlo con la calculadora, que es justo lo que
  // este avatar hace antes de confiar en una cuenta.
  const costoDiario = plan === 'anual' ? PLAN_ANUAL.costoDia : PLAN_MENSUAL.costoDia;
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="relative text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        <Halo />
        {/* El <Marcador> envolvía "captura de WhatsApp": a 375px esa frase cruza tres renglones y
            el subrayado se partía en tres trazos sueltos que parecían marcar palabras al azar.
            Marcando UNA sola palabra —la memorable— el trazo siempre cae entero en un renglón. */}
        Una captura de <Marcador>WhatsApp</Marcador> no prueba nada —<span className="text-[var(--accent)]"> tu expediente sí</span>
      </h1>

      {/* `radiogroup` + `aria-checked`: las dos tarjetas eran <button> sueltos y el check estaba
          marcado como decorativo, así que con lector de pantalla NINGÚN plan aparecía elegido —
          alguien ciego no podía saber qué está por contratar. */}
      <div role="radiogroup" aria-label="Elige tu plan" className="mt-8 flex flex-col gap-3">
        <motion.button
          type="button"
          role="radio"
          aria-checked={plan === 'anual'}
          onClick={() => onCambiarPlan('anual')}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col rounded-[var(--radius-card)] border p-4 text-left transition-colors [touch-action:manipulation] ${
            plan === 'anual'
              ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_7%,transparent)] shadow-[0_6px_20px_color-mix(in_oklab,var(--accent)_18%,transparent)]'
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)]'
          }`}
        >
          {/* El badge estaba `absolute -top-3`: quedaba montado justo sobre el borde, ni dentro ni
              fuera de la tarjeta (defecto del revisor). Ahora vive DENTRO, en el flujo normal —
              sin superposición posible y sin depender de un padding-top mágico. */}
          {/* Decía "Más popular": prueba social FABRICADA — la app todavía no tiene ni un cliente,
              así que no hay ningún plan que sea "el más popular". Sustituido por el único dato
              verificable y comprobable con la calculadora: $9.99×12 = $119.88 vs $89 = $30.88. */}
          <span className="mb-3 self-start rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
            Ahorras 3 meses · US$30.88 al año
          </span>
          <div className="flex w-full items-start gap-3">
            <CheckPlan activo={plan === 'anual'} />
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold text-[var(--text-primary)]">Anual</span>
                <span className="text-[24px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                  <PrecioContado valor={PLAN_ANUAL.precioMes} /><span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{PLAN_ANUAL.totalAnual}</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          type="button"
          role="radio"
          aria-checked={plan === 'mensual'}
          onClick={() => onCambiarPlan('mensual')}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0.06, ease: [0.16, 1, 0.3, 1] }}
          className={`flex items-start gap-3 rounded-[var(--radius-card)] border p-4 text-left transition-colors [touch-action:manipulation] ${
            plan === 'mensual'
              ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_7%,transparent)] shadow-[0_6px_20px_color-mix(in_oklab,var(--accent)_18%,transparent)]'
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)]'
          }`}
        >
          <CheckPlan activo={plan === 'mensual'} />
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] font-semibold text-[var(--text-primary)]">Mensual</span>
              <span className="text-[24px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                <PrecioContado valor={PLAN_MENSUAL.precioMes} /><span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
              </span>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Estas 3 filas repetían los MISMOS beneficios del paso anterior (y dos decían literalmente
          lo mismo: "fecha y hora exactas" / "fecha exacta"). A un tap de distancia, leer dos veces
          la misma lista hace que la pantalla se sienta vacía de argumentos. Ahora responden lo que
          de verdad se pregunta EN EL MOMENTO DE PAGAR: cuánto cuesta en realidad, si sirve sin la
          otra parte, y qué pasa si me arrepiento. Los tres son hechos comprobables del producto. */}
      <div className="mt-4 flex flex-col gap-2.5">
        {[
          { icon: ShieldCheck, pre: 'Te sale a ', fuerte: costoDiario, post: ' al día.' },
          { icon: HeartHandshake, pre: 'Funciona ', fuerte: 'aunque la otra persona no la use', post: '.' },
          { icon: FileCheck2, pre: 'Cancelas ', fuerte: 'cuando quieras', post: ', desde Ajustes.' },
        ].map(({ icon: Icon, pre, fuerte, post }) => (
          <div key={fuerte} className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
              <Icon size={15} color="var(--accent)" aria-hidden="true" />
            </span>
            <span className="text-[14px] text-[var(--text-secondary)]">
              {pre}
              <span className="font-semibold text-[var(--text-primary)]">{fuerte}</span>
              {post}
            </span>
          </div>
        ))}
      </div>

      {/* PIE REORDENADO. Antes: 4 líneas apiladas con separaciones de 4px (mt-1) que se leían como
          un bloque legal denso, con 5 elementos tocables al borde de la sobrecarga (defectos 1 y 5
          del revisor). Ahora hay 3 grupos con jerarquía y separación mínima de 8px:
          (a) señales de confianza JUNTAS sobre el CTA — garantía y pago seguro son lo mismo;
          (b) el CTA con su aviso de renovación (obligatorio, no se toca);
          (c) la salida y la letra chica, separadas 16px del resto para que no compitan. */}
      <div className="mt-auto pt-6">
        {/* Hairline degradada también aquí: existía solo en el paso 1, así que el sistema de
            profundidad cambiaba entre dos pantallas seguidas (defecto del revisor). */}
        <div
          aria-hidden="true"
          className="mb-4 h-px w-full"
          style={{
            background:
              'linear-gradient(to right, transparent, color-mix(in oklab, var(--accent) 38%, transparent), transparent)',
          }}
        />
        {/* La garantía había perdido su NOMBRE al compactar esta franja, y nunca dijo cómo se
            reclama: una promesa de protección sin mecánica no tranquiliza a quien ya desconfía. */}
        {/* Dos renglones propios en vez de una fila que se parte: con `flex-wrap` el separador "·"
            quedaba colgando solo al final del primer renglón. */}
        <div className="mb-3 flex flex-col items-center gap-1 text-[13px] font-medium text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} color="var(--accent)" aria-hidden="true" />
            Garantía del Primer Expediente · 15 días
          </span>
          <span className="flex items-center gap-1.5">
            <Lock size={13} color="var(--accent)" aria-hidden="true" />
            Pago seguro
          </span>
        </div>
        <p className="mb-3 text-center text-[13px] leading-[1.5] text-[var(--text-secondary)]">
          Si en 15 días tu expediente no te sirve, escribes a soporte y te devolvemos todo. Sin explicaciones.
        </p>
        <CtaFunnel onClick={onCta} disabled={yendo}>
          {yendo ? 'Abriendo…' : 'Empezar mis 7 días gratis'}
        </CtaFunnel>
        {falloAlAbrir && !yendo && (
          <p role="status" className="mt-2 text-center text-[13px] leading-[1.5] text-[var(--status-error)]">
            No pudimos abrir el siguiente paso. Revisa tu conexión y toca el botón otra vez.
          </p>
        )}
        <p className="mt-2 text-center text-[13px] text-[var(--text-secondary)]">
          Hoy no pagas nada · Se renueva automáticamente tras el día 7, cancela cuando quieras
        </p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 text-[13px] text-[var(--text-secondary)]">
        <button type="button" onClick={onAhoraNo} className="py-2 [touch-action:manipulation]">
          Ahora no
        </button>
        <span aria-hidden="true" className="text-[var(--text-tertiary)]">·</span>
        <a href="mailto:soporte@coparentia.app" className="py-2 underline-offset-2 hover:underline [touch-action:manipulation]">
          ¿Dudas? Escríbenos
        </a>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-[var(--text-tertiary)]">
        <a href="/terminos" className="underline-offset-2 hover:underline">Términos</a>
        <span aria-hidden="true">·</span>
        <a href="/privacidad" className="underline-offset-2 hover:underline">Privacidad</a>
      </div>
    </div>
  );
}
