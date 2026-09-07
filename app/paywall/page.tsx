'use client';

// PAYWALL DE SECUENCIA (C0-C4 de 50-DISENO-ONBOARDING-PAYWALL.md): recap del valor
// personalizado → timeline del trial → precio. +37% de conversión vs una sola página
// (Superwall 2026). Sin Hotmart conectado todavía (Sesión 6): el CTA final lleva a
// /entrar como mock honesto — NUNCA un checkout falso que simule un cobro real (C3ter).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { X, Check, ShieldCheck, Lock } from 'lucide-react';
import { CtaFunnel, FunnelHeader, usePasoVariants } from '@/components/funnel/ui';

type Respuestas = {
  situacion: string;
  situacionOtra: string;
  preocupacion: string;
  metaMeses: number;
  momento: string;
  atribucion: string;
};

const PLAN_ANUAL = { precioMes: '$7.42', totalAnual: 'Se cobra $89/año', ahorro: '4 meses gratis' };
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
        <FunnelHeader />
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="flex size-11 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <X size={20} aria-hidden="true" />
        </button>
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
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Blinda tu expediente <span className="text-[var(--accent)]">desde hoy</span>
      </h1>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onCambiarPlan('anual')}
          className={`relative rounded-[var(--radius-card)] border p-4 text-left transition-colors [touch-action:manipulation] ${
            plan === 'anual'
              ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_7%,transparent)]'
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)]'
          }`}
        >
          <span className="absolute -top-2.5 left-4 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
            Más popular · 4 meses gratis
          </span>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[15px] font-semibold text-[var(--text-primary)]">Anual</span>
            <span className="text-[24px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
              {PLAN_ANUAL.precioMes}<span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
            </span>
          </div>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{PLAN_ANUAL.totalAnual}</p>
        </button>

        <button
          type="button"
          onClick={() => onCambiarPlan('mensual')}
          className={`rounded-[var(--radius-card)] border p-4 text-left transition-colors [touch-action:manipulation] ${
            plan === 'mensual'
              ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_7%,transparent)]'
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)]'
          }`}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[15px] font-semibold text-[var(--text-primary)]">Mensual</span>
            <span className="text-[24px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
              {PLAN_MENSUAL.precioMes}<span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
            </span>
          </div>
        </button>
      </div>

      <div className="mt-6">
        <CtaFunnel onClick={onCta}>Empezar mis 7 días gratis</CtaFunnel>
        <p className="mt-2 text-center text-[13px] text-[var(--text-secondary)]">
          Hoy no pagas nada · Te avisamos antes del cobro · Cancela en 1 tap
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        <button type="button" onClick={onAhoraNo} className="px-2 py-3 text-[14px] text-[var(--text-tertiary)] [touch-action:manipulation]">
          Ahora no
        </button>
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
        <Lock size={13} aria-hidden="true" />
        Pago seguro
        <span aria-hidden="true">·</span>
        <ShieldCheck size={13} aria-hidden="true" />
        Garantía del Primer Expediente (15 días)
      </div>
    </div>
  );
}
