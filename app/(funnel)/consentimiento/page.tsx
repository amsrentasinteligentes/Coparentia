'use client';

// CONSENTIMIENTO EXPRESO — primera entrada a la app tras comprar (2026-09-21). Pedido del equipo
// jurídico del usuario para cumplir la normativa colombiana de datos (Ley 1581 de 2012, Decreto
// 1377 de 2013) y de renovación automática: tres autorizaciones obligatorias, cada una con su
// casilla propia y SIN premarcar (una casilla marcada por defecto no es consentimiento), más una
// opcional de novedades. El layout de la app manda aquí a quien no tenga aceptada la versión
// vigente (lib/consentimiento.ts); al aceptar, sigue a Inicio.

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { Check, ShieldCheck, FileText, RefreshCw, Sparkles } from 'lucide-react';
import { CtaFunnel, FunnelHeader, MarcoFunnel } from '@/components/funnel/ui';
import { Blob } from '@/components/landing/ui';
import { guardarConsentimiento } from './acciones';

type Clave = 'terminos' | 'datos' | 'renovacion' | 'marketing';

const CASILLAS: { clave: Clave; icon: typeof FileText; texto: React.ReactNode; obligatoria: boolean }[] = [
  {
    clave: 'terminos',
    icon: FileText,
    obligatoria: true,
    texto: (
      <>
        He leído y acepto los{' '}
        <Link href="/terminos" target="_blank" className="font-bold text-[var(--accent-ink,var(--accent))] underline underline-offset-2">
          Términos y Condiciones
        </Link>{' '}
        de Coparentia.
      </>
    ),
  },
  {
    clave: 'datos',
    icon: ShieldCheck,
    obligatoria: true,
    texto: (
      <>
        He leído la{' '}
        <Link href="/privacidad" target="_blank" className="font-bold text-[var(--accent-ink,var(--accent))] underline underline-offset-2">
          Política de Tratamiento de Datos Personales
        </Link>{' '}
        y autorizo el tratamiento de mis datos para las finalidades allí informadas.
      </>
    ),
  },
  {
    clave: 'renovacion',
    icon: RefreshCw,
    obligatoria: true,
    texto: <>Autorizo la renovación automática y los cobros recurrentes correspondientes al plan seleccionado, hasta que cancele la renovación.</>,
  },
  {
    clave: 'marketing',
    icon: Sparkles,
    obligatoria: false,
    texto: <>Quiero recibir novedades, promociones y contenido de Coparentia. <span className="text-[var(--text-tertiary)]">Opcional.</span></>,
  },
];

export default function Consentimiento() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [marcadas, setMarcadas] = useState<Record<Clave, boolean>>({ terminos: false, datos: false, renovacion: false, marketing: false });
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const faltan = CASILLAS.filter((c) => c.obligatoria && !marcadas[c.clave]).length;

  const continuar = async (): Promise<void> => {
    if (guardando) return;
    if (faltan > 0) {
      setAviso(faltan === 1 ? 'Falta una autorización obligatoria por marcar.' : `Faltan ${faltan} autorizaciones obligatorias por marcar.`);
      return;
    }
    setAviso(null);
    setGuardando(true);
    const r = await guardarConsentimiento(marcadas);
    if (!r.ok) {
      setGuardando(false);
      setAviso(r.mensaje ?? 'No pudimos guardar tu autorización. Inténtalo de nuevo.');
      return;
    }
    router.replace('/inicio');
  };

  return (
    <MarcoFunnel
      panel={
        <>
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent-ink,var(--accent))]">Antes de entrar</p>
          <h2 className="mt-3 text-balance text-[21px] font-semibold leading-[1.25] text-[var(--text-primary)] [font-family:var(--font-display)]">
            Tu expediente guarda información sensible; por eso te pedimos tu autorización expresa
          </h2>
          <p className="mt-3 text-[14px] leading-[1.6] text-[var(--text-secondary)]">
            Es un paso único. Cumple la ley colombiana de protección de datos (Ley 1581 de 2012) y te
            deja claro cómo funcionan los cobros. Puedes leer cada documento antes de marcar.
          </p>
        </>
      }
    >
      <FunnelHeader />
      <div className="relative mt-4 flex flex-1 flex-col lg:flex-none">
        <Blob className="right-2 -top-2 -z-10 h-24 w-40" opacidad={0.14} />
        <h1 className="relative text-balance text-[28px] font-bold leading-[1.12] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Un último paso: <span className="text-[var(--accent-ink,var(--accent))]">tus autorizaciones</span>
        </h1>
        <p className="mt-2 text-[14px] leading-[1.5] text-[var(--text-secondary)]">
          Marca las tres obligatorias para entrar a tu expediente. La cuarta es opcional.
        </p>

        <ul className="mt-6 flex flex-col gap-3">
          {CASILLAS.map(({ clave, icon: Icon, texto, obligatoria }, i) => {
            const activa = marcadas[clave];
            return (
              <motion.li
                key={clave}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border p-4 transition-colors duration-150 [touch-action:manipulation] ${
                    activa
                      ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]'
                      : 'border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={activa}
                    onChange={(e) => {
                      setMarcadas((m) => ({ ...m, [clave]: e.target.checked }));
                      setAviso(null);
                    }}
                    className="sr-only"
                  />
                  {/* Casilla custom (checkmark del kit, nunca el ✓ del sistema) */}
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-[8px] border-2 transition-colors ${
                      activa ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)] bg-[var(--surface)]'
                    }`}
                  >
                    {activa && <Check size={14} strokeWidth={3} color="var(--on-accent, var(--bg))" />}
                  </span>
                  <span className="flex min-w-0 flex-1 items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
                      <Icon size={16} color="var(--accent)" aria-hidden="true" />
                    </span>
                    <span className="text-[14px] leading-[1.55] text-[var(--text-primary)]">
                      {texto}
                      {obligatoria && <span className="sr-only"> (obligatorio)</span>}
                    </span>
                  </span>
                </label>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-auto pt-6">
          <p className="mb-3 text-center text-[12px] leading-[1.5] text-[var(--text-tertiary)]">
            Guardamos la fecha y la versión de lo que aceptas, como exige la ley. Puedes cambiar la
            opción de novedades cuando quieras desde Ajustes.
          </p>
          {aviso && (
            <p role="alert" className="mb-3 text-center text-[13px] text-[var(--status-error)]">
              {aviso}
            </p>
          )}
          <CtaFunnel onClick={continuar} disabled={guardando}>
            {guardando ? 'Guardando…' : 'Aceptar y entrar a mi expediente'}
          </CtaFunnel>
        </div>
      </div>
    </MarcoFunnel>
  );
}
