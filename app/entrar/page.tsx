'use client';

// LOGIN (E de 50-DISENO-ONBOARDING-PAYWALL.md): magic link por email, sin contraseña
// (decisión Hotmart-first de 26-AUTH-MODERNO.md). Sin Supabase/Hotmart conectados
// todavía (Sesión 6): el envío es SIMULADO con estado local — nunca se promete un
// correo real que no se manda. Se documenta en ESTADO.md como mock pendiente.

import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail } from 'lucide-react';
import { ContenedorFunnel, CtaFunnel, FunnelHeader } from '@/components/funnel/ui';

type Estado = 'idle' | 'enviando' | 'enviado' | 'error';

export default function Entrar() {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const [countdown, setCountdown] = useState(0);

  const enviar = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!email.includes('@') || estado === 'enviando') return;
    setEstado('enviando');
    // MOCK — Sesión 6 conecta Supabase Auth (magic link real) + webhook de Hotmart.
    setTimeout(() => {
      setEstado('enviado');
      setCountdown(60);
      const tick = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(tick);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }, 900);
  };

  return (
    <ContenedorFunnel>
      <FunnelHeader />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 flex flex-1 flex-col"
      >
        {estado !== 'enviado' ? (
          <>
            <h1 className="text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
              Entra a tu expediente
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              Para guardarlo y verlo en cualquier dispositivo — sin contraseñas que recordar.
            </p>

            <form onSubmit={enviar} className="mt-8 flex flex-col gap-3">
              <input
                autoFocus
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
              />
              <CtaFunnel type="submit" disabled={!email.includes('@') || estado === 'enviando'}>
                {estado === 'enviando' ? 'Enviando…' : 'Enviarme mi enlace de acceso'}
              </CtaFunnel>
              {estado === 'error' && (
                <p className="text-[13px] text-[var(--text-secondary)]">
                  No pudimos enviar el enlace. Revisa el correo e intenta de nuevo.
                </p>
              )}
            </form>

            <button
              type="button"
              className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[15px] font-medium text-[var(--text-primary)] [touch-action:manipulation]"
            >
              <span aria-hidden="true" className="text-[15px] font-bold">G</span>
              Continuar con Google
            </button>

            <p className="mt-4 flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)]">
              <Lock size={13} aria-hidden="true" />
              Sin contraseñas: te llegará un enlace de un solo uso
            </p>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center pt-6 text-center">
            <span
              aria-hidden="true"
              className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
            >
              <Mail size={28} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
            </span>
            <h1 className="mt-6 text-balance text-[24px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
              Revisa tu correo
            </h1>
            <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Te enviamos el enlace a <span className="font-semibold text-[var(--text-primary)]">{email}</span>
            </p>
            <button
              type="button"
              disabled={countdown > 0}
              onClick={() => {
                setEstado('idle');
              }}
              className="mt-6 text-[14px] font-medium text-[var(--accent)] disabled:text-[var(--text-tertiary)] [touch-action:manipulation]"
            >
              {countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar enlace'}
            </button>
          </div>
        )}
      </motion.div>
    </ContenedorFunnel>
  );
}
