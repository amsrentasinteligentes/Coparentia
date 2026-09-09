'use client';

// LOGIN (E de 50-DISENO-ONBOARDING-PAYWALL.md): magic link por email, sin contraseña
// (decisión Hotmart-first de 26-AUTH-MODERNO.md). Sesión 6: conectado a Supabase Auth
// de verdad — signInWithOtp crea al usuario si no existe (registro passwordless) y
// envía el enlace real. El webhook de Hotmart (más adelante) hará lo mismo desde el
// servidor cuando exista el cobro real; este camino ya es honesto sin él.

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Lock, Mail } from 'lucide-react';
import { ContenedorFunnel, CtaFunnel, FunnelHeader } from '@/components/funnel/ui';
import { crearClienteSupabase } from '@/lib/supabase/client';

type Estado = 'idle' | 'enviando' | 'enviado' | 'error';

export default function Entrar() {
  return (
    <Suspense fallback={null}>
      <EntrarInterno />
    </Suspense>
  );
}

function EntrarInterno() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const [countdown, setCountdown] = useState(0);
  // Autorización previa expresa (Ley 1581 de 2012, Colombia): checkbox NUNCA premarcado, en el
  // mismo punto donde se recoge el correo — este login también crea la cuenta la primera vez.
  const [acepta, setAcepta] = useState(false);

  useEffect(() => {
    if (params.get('error') === 'enlace_invalido') setEstado('error');
  }, [params]);

  const enviar = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email.includes('@') || !acepta || estado === 'enviando') return;
    setEstado('enviando');
    const supabase = crearClienteSupabase();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setEstado('error');
      return;
    }
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
              <label className="flex items-start gap-2.5 py-1 [touch-action:manipulation]">
                <input
                  type="checkbox"
                  checked={acepta}
                  onChange={(e) => setAcepta(e.target.checked)}
                  className="mt-0.5 size-5 shrink-0 rounded border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)] accent-[var(--accent)]"
                />
                <span className="text-[13px] leading-[1.5] text-[var(--text-secondary)]">
                  Autorizo el tratamiento de mis datos y acepto los{' '}
                  <Link href="/terminos" target="_blank" className="text-[var(--accent)] underline">Términos</Link>{' '}
                  y la{' '}
                  <Link href="/privacidad" target="_blank" className="text-[var(--accent)] underline">Política de Privacidad</Link>.
                </span>
              </label>
              <CtaFunnel type="submit" disabled={!email.includes('@') || !acepta || estado === 'enviando'}>
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
              disabled
              title="Próximamente"
              className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[15px] font-medium text-[var(--text-tertiary)] opacity-60 [touch-action:manipulation]"
            >
              <span aria-hidden="true" className="text-[15px] font-bold">G</span>
              Continuar con Google — próximamente
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
