'use client';

// PAYWALL DE SECUENCIA (C0-C4 de 50-DISENO-ONBOARDING-PAYWALL.md): recap del valor
// personalizado → timeline del trial → precio. +37% de conversión vs una sola página
// (Superwall 2026). Sin Hotmart conectado todavía (Sesión 6): el CTA final lleva a
// /entrar como mock honesto — NUNCA un checkout falso que simule un cobro real (C3ter).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, X, Check, ShieldCheck, Lock, FileCheck2, HeartHandshake } from 'lucide-react';
import { BarraProgreso, CtaFunnel, FunnelHeader, Marcador, usePasoVariants } from '@/components/funnel/ui';

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
  const variants = usePasoVariants();
  const nRespuestas = r
    ? [r.situacion, r.preocupacion, String(r.metaMeses), r.momento, r.atribucion].filter(Boolean).length
    : 5;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('coparentia_onboarding');
      if (raw) setR(JSON.parse(raw));
    } catch {}
  }, []);

  const cerrar = (): void => router.push('/');
  const irAlLogin = (): void => {
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
              className="flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
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
          className="flex size-11 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
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
            {paso === 1 && <TimelineTrial onContinuar={() => setPaso(2)} />}
            {paso === 2 && (
              <Precio plan={plan} onCambiarPlan={setPlan} onCta={irAlLogin} onAhoraNo={cerrar} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Pantalla 1: RECAP del valor personalizado + inversión visible (costo hundido) ── */
function Recap({ situacion, n, onContinuar }: { situacion?: string; n: number; onContinuar: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance text-[30px] font-bold leading-[1.12] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tu expediente está <span className="text-[var(--accent)]">listo para empezar</span>
      </h1>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
        Hecho con tus {n} respuestas{situacion ? ` · "${situacion}"` : ''}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {[
          'El Sello de Confianza en cada comprobante',
          'Expediente exportable en PDF foliado',
          'Alertas en el momento que elegiste',
        ].map((f) => (
          <div
            key={f}
            className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-4"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
              <Check size={13} strokeWidth={2.8} color="var(--accent)" />
            </span>
            <span className="text-[15px] text-[var(--text-primary)]">{f}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <CtaFunnel onClick={onContinuar}>Ver cómo funciona mi prueba</CtaFunnel>
      </div>
    </div>
  );
}

/* ── Pantalla 2: TIMELINE del trial (C4, patrón Blinkist) — responde "¿puedo cancelar?" ── */
function TimelineTrial({ onContinuar }: { onContinuar: () => void }) {
  const nodos = [
    { titulo: 'Hoy — acceso completo', detalle: 'Todo tu expediente, sin límites', activo: true },
    { titulo: 'Día 5 — te avisamos', detalle: 'Correo antes de cualquier cobro', activo: true },
    { titulo: 'Día 7 — primer cobro: $89/año', detalle: 'Cancela antes sin costo', activo: false },
  ];
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        7 días gratis, sin sorpresas
      </h1>
      <div className="mt-8 flex flex-col">
        {nodos.map((n, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex size-3 shrink-0 rounded-full ${
                  n.activo ? 'bg-[var(--accent)]' : 'border-2 border-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)] bg-transparent'
                }`}
              />
              {i < nodos.length - 1 && (
                <span className="mt-1 w-[2px] flex-1 bg-[color-mix(in_oklab,var(--accent)_35%,transparent)]" />
              )}
            </div>
            <div className="pb-8">
              <p className="text-[15px] font-semibold text-[var(--text-primary)]">{n.titulo}</p>
              <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{n.detalle}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[13px] text-[var(--text-tertiary)]">¿Te avisamos también por notificación además del correo? Puedes ajustarlo luego.</p>
      <div className="mt-auto pt-8">
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
}: {
  plan: 'anual' | 'mensual';
  onCambiarPlan: (p: 'anual' | 'mensual') => void;
  onCta: () => void;
  onAhoraNo: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="relative text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10"
          style={{
            background:
              'radial-gradient(220px 140px at 20% 30%, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 65%)',
          }}
        />
        Una <Marcador>captura de WhatsApp</Marcador> no prueba nada —<span className="text-[var(--accent)]"> tu expediente sí</span>
      </h1>

      <div className="mt-6 flex flex-col gap-3">
        <motion.button
          type="button"
          onClick={() => onCambiarPlan('anual')}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0, ease: [0.16, 1, 0.3, 1] }}
          className={`relative flex items-start gap-3 rounded-[var(--radius-button)] border p-4 text-left transition-colors [touch-action:manipulation] ${
            plan === 'anual'
              ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_7%,transparent)] shadow-[0_6px_20px_color-mix(in_oklab,var(--accent)_18%,transparent)]'
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)]'
          }`}
        >
          <span className="absolute -top-2.5 left-4 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
            Más popular · ahorra 3 meses
          </span>
          <CheckPlan activo={plan === 'anual'} />
          <div className="mt-1.5 flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] font-semibold text-[var(--text-primary)]">Anual</span>
              <span className="text-[24px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                {PLAN_ANUAL.precioMes}<span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
              </span>
            </div>
            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{PLAN_ANUAL.totalAnual}</p>
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
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)]'
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

      <div className="mt-6 flex flex-col gap-3">
        {[
          { icon: ShieldCheck, texto: 'Trazabilidad inalterable: cada comprobante con fecha y respaldo' },
          { icon: FileCheck2, texto: 'Reporte en 1 clic: expediente en PDF listo para tu abogado' },
          { icon: HeartHandshake, texto: 'Cero discusiones: evita reclamos por gastos que ya cubriste' },
        ].map(({ icon: Icon, texto }) => (
          <div key={texto} className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
              <Icon size={15} color="var(--accent)" aria-hidden="true" />
            </span>
            <span className="text-[14px] text-[var(--text-secondary)]">{texto}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <div className="mb-3 flex items-center justify-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)]">
          <ShieldCheck size={14} color="var(--accent)" aria-hidden="true" />
          Garantía del Primer Expediente · 15 días
        </div>
        <CtaFunnel onClick={onCta}>Empezar mis 7 días gratis</CtaFunnel>
        <p className="mt-2 text-center text-[13px] text-[var(--text-secondary)]">
          Hoy no pagas nada · Cancela en 1 tap · Menos de $0.25 al día después
        </p>
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <button type="button" onClick={onAhoraNo} className="px-2 py-3 text-[14px] text-[var(--text-tertiary)] [touch-action:manipulation]">
          Ahora no
        </button>
        <a href="mailto:soporte@coparentia.app" className="px-2 py-3 text-[14px] text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]">
          ¿Dudas? Escríbenos
        </a>
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
        <Lock size={13} aria-hidden="true" />
        Pago seguro
      </div>
      <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-[var(--text-tertiary)]">
        <a href="/terminos" className="underline-offset-2 hover:underline">Términos</a>
        <span aria-hidden="true">·</span>
        <a href="/privacidad" className="underline-offset-2 hover:underline">Privacidad</a>
      </div>
    </div>
  );
}
