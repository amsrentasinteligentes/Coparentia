'use client';

// PAYWALL DE SECUENCIA (C0-C4 de 50-DISENO-ONBOARDING-PAYWALL.md): recap del valor
// personalizado → timeline del trial → precio. +37% de conversión vs una sola página
// (Superwall 2026). Sin Hotmart conectado todavía (Sesión 6): el CTA final lleva a
// /entrar como mock honesto — NUNCA un checkout falso que simule un cobro real (C3ter).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, X, Check, ShieldCheck, Lock, FileCheck2, HeartHandshake } from 'lucide-react';
import { BarraProgreso, CtaFunnel, FunnelHeader, Halo, Marcador, usePasoVariants } from '@/components/funnel/ui';

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
const PLAN_ANUAL = { precioMes: '$7.42', totalAnual: 'Se cobra $89/año', ahorro: '3 meses gratis' };
const PLAN_MENSUAL = { precioMes: '$9.99' };

export default function Paywall() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [r, setR] = useState<Respuestas | null>(null);
  const [plan, setPlan] = useState<'anual' | 'mensual'>('anual');
  const [yendo, setYendo] = useState(false);
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
    setYendo(true);
    try {
      sessionStorage.setItem('coparentia_plan_elegido', plan);
    } catch {}
    router.push('/entrar');
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-[520px] flex-col px-4 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {paso > 0 && (
            <button
              type="button"
              onClick={() => setPaso((p) => Math.max(0, p - 1))}
              aria-label="Volver"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)] text-[var(--text-secondary)] [touch-action:manipulation]"
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

      <div className="mt-1 flex items-center gap-2">
        <BarraProgreso porcentaje={((paso + 1) / 3) * 100} />
        <span className="shrink-0 whitespace-nowrap text-right text-[12px] tabular-nums text-[var(--text-tertiary)]">
          Paso {paso + 1} de 3
        </span>
      </div>

      <div className="relative mt-4 flex flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={paso} variants={variants} initial="enter" animate="center" exit="exit" className="flex flex-1 flex-col">
            {paso === 0 && <Recap situacion={r?.situacion} n={nRespuestas} onContinuar={() => setPaso(1)} />}
            {paso === 1 && <TimelineTrial plan={plan} onContinuar={() => setPaso(2)} />}
            {paso === 2 && (
              <Precio plan={plan} onCambiarPlan={setPlan} onCta={irAlLogin} onAhoraNo={cerrar} yendo={yendo} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Pantalla 1: RECAP del valor personalizado + inversión visible (costo hundido) ── */
function Recap({ situacion, n, onContinuar }: { situacion?: string; n: number; onContinuar: () => void }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-1 flex-col">
      {/* El halo de marca faltaba en esta pantalla (solo estaba en Precio), así que el primer
          paso del paywall se veía sobre fondo plano. Mismos valores que el resto del sistema. */}
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

      {/* `flex-1 justify-center`: antes el bloque quedaba pegado arriba y ~31% de la pantalla
          era fondo plano muerto entre la última tarjeta y el CTA (medido a 375px). Ahora el aire
          sobrante se reparte arriba y abajo del contenido en vez de acumularse en un hueco. */}
      <div className="mt-8 flex flex-1 flex-col justify-center gap-3">
        {[
          'El Sello de Confianza en cada comprobante',
          'Expediente exportable en PDF foliado',
          'Alertas en el momento que elegiste',
        ].map((f, i) => (
          <motion.div
            key={f}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1], delay: reduce ? 0 : i * 0.05 }}
            className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
              <Check size={13} strokeWidth={2.8} color="var(--accent)" />
            </span>
            <span className="text-[15px] text-[var(--text-primary)]">{f}</span>
          </motion.div>
        ))}
      </div>

      <div className="pt-8">
        <CtaFunnel onClick={onContinuar}>Ver cómo funciona mi prueba</CtaFunnel>
      </div>
    </div>
  );
}

/* ── Pantalla 2: TIMELINE del trial (C4, patrón Blinkist) — responde "¿puedo cancelar?" ── */
function TimelineTrial({ plan, onContinuar }: { plan: 'anual' | 'mensual'; onContinuar: () => void }) {
  const reduce = useReducedMotion();
  // El cobro del día 7 mostraba "$89/año" fijo: si alguien volvía atrás con el plan Mensual
  // elegido, el timeline le prometía un precio que no era el suyo (defecto menor del revisor).
  const cobro = plan === 'anual' ? '$89/año' : '$9.99/mes';
  const nodos = [
    { titulo: 'Hoy — acceso completo', detalle: 'Todo tu expediente, sin límites', activo: true },
    { titulo: 'Día 5 — te avisamos', detalle: 'Correo antes de cualquier cobro', activo: true },
    { titulo: `Día 7 — primer cobro: ${cobro}`, detalle: 'Cancela antes sin costo', activo: false },
  ];
  return (
    <div className="flex flex-1 flex-col">
      {/* Era la única vista del recorrido sin el halo de marca: se leía plana al lado de las otras dos. */}
      <h1 className="relative text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        <Halo />
        7 días gratis, sin sorpresas
      </h1>
      {/* Mismo criterio que Recap: el aire sobrante se reparte, no se acumula bajo el timeline. */}
      <div className="mt-8 flex flex-1 flex-col justify-center">
        {/* Entraban los 3 nodos de golpe y estáticos. Ahora se revelan escalonados (50ms) y la
            línea que los une se DIBUJA de arriba abajo — la baseline de movimiento del SO que a
            esta pantalla le faltaba por completo. */}
        {nodos.map((n, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1], delay: reduce ? 0 : i * 0.05 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <span
                className={`flex size-3 shrink-0 rounded-full ${
                  n.activo ? 'bg-[var(--accent)]' : 'border-2 border-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)] bg-transparent'
                }`}
              />
              {i < nodos.length - 1 && (
                <motion.span
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1], delay: reduce ? 0 : 0.2 + i * 0.05 }}
                  className="mt-1 w-[2px] flex-1 origin-top bg-[color-mix(in_oklab,var(--accent)_35%,transparent)]"
                />
              )}
            </div>
            <div className="pb-8">
              <p className="text-[15px] font-semibold text-[var(--text-primary)]">{n.titulo}</p>
              <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{n.detalle}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Antes esto era una PREGUNTA ("¿Te avisamos también por notificación…?") sin ningún control
          para responderla — un elemento que parece interactivo y no hace nada (anti-patrón del SO,
          regla 11). Reescrita como lo que realmente es: una afirmación tranquilizadora. */}
      <p className="text-[13px] text-[var(--text-tertiary)]">
        El aviso del día 5 llega por correo. Podrás sumar notificaciones desde Ajustes cuando entres.
      </p>
      <div className="pt-8">
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
}: {
  plan: 'anual' | 'mensual';
  onCambiarPlan: (p: 'anual' | 'mensual') => void;
  onCta: () => void;
  onAhoraNo: () => void;
  yendo: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="relative text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        <Halo />
        Una <Marcador>captura de WhatsApp</Marcador> no prueba nada —<span className="text-[var(--accent)]"> tu expediente sí</span>
      </h1>

      <div className="mt-8 flex flex-col gap-3">
        <motion.button
          type="button"
          onClick={() => onCambiarPlan('anual')}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col rounded-[var(--radius-button)] border p-4 text-left transition-colors [touch-action:manipulation] ${
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
          <span className="mb-3 self-start rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)] shadow-[0_2px_8px_color-mix(in_oklab,var(--accent)_35%,transparent)]">
            Ahorras 3 meses · $30.88 al año
          </span>
          <div className="flex w-full items-start gap-3">
            <CheckPlan activo={plan === 'anual'} />
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold text-[var(--text-primary)]">Anual</span>
                <span className="text-[24px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                  {PLAN_ANUAL.precioMes}<span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{PLAN_ANUAL.totalAnual}</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          type="button"
          onClick={() => onCambiarPlan('mensual')}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0.06, ease: [0.16, 1, 0.3, 1] }}
          className={`flex items-start gap-3 rounded-[var(--radius-button)] border p-4 text-left transition-colors [touch-action:manipulation] ${
            plan === 'mensual'
              ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_7%,transparent)] shadow-[0_6px_20px_color-mix(in_oklab,var(--accent)_18%,transparent)]'
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)]'
          }`}
        >
          <CheckPlan activo={plan === 'mensual'} />
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] font-semibold text-[var(--text-primary)]">Mensual</span>
              <span className="text-[24px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                {PLAN_MENSUAL.precioMes}<span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
              </span>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {[
          { icon: ShieldCheck, pre: 'Trazabilidad: ', fuerte: 'fecha y hora exactas', post: ' en cada comprobante.' },
          { icon: FileCheck2, pre: 'Reporte en 1 clic: ', fuerte: 'PDF foliado', post: ' listo para tu abogado.' },
          { icon: HeartHandshake, pre: 'Cero discusiones: ', fuerte: 'fecha exacta', post: ' en cada gasto cubierto.' },
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
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] font-medium text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} color="var(--accent)" aria-hidden="true" />
            Garantía de 15 días
          </span>
          <span aria-hidden="true" className="text-[var(--text-tertiary)]">·</span>
          <span className="flex items-center gap-1.5">
            <Lock size={13} color="var(--accent)" aria-hidden="true" />
            Pago seguro
          </span>
        </div>
        <CtaFunnel onClick={onCta} disabled={yendo}>
          {yendo ? 'Abriendo…' : 'Empezar mis 7 días gratis'}
        </CtaFunnel>
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
