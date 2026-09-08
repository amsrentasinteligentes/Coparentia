'use client';

// KIT DE LA APP INTERNA (Sesión 5) — misma identidad de FICHA-ARTE.md que landing/funnel.
// Nav inferior de 4 destinos (Inicio · Pagos · Calendario · Expediente), tarjetas y píldoras
// de estado reutilizadas en las 4 secciones. Consume components/landing/tokens.css.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Home, Wallet, CalendarDays, FolderOpen, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

const DESTINOS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/inicio', label: 'Inicio', icon: Home },
  { href: '/pagos', label: 'Pagos', icon: Wallet },
  { href: '/calendario', label: 'Calendario', icon: CalendarDays },
  { href: '/expediente', label: 'Expediente', icon: FolderOpen },
];

/* ── <BottomNav> — nav fija al fondo, 4 destinos, ícono activo con fondo propio (nunca del
   mismo color que su contenedor — regla anti-slop de tapar el ícono) ── */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)] bg-[var(--surface)]/95 backdrop-blur [padding-bottom:env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-[520px] items-stretch justify-around">
        {DESTINOS.map(({ href, label, icon: Icon }) => {
          const activo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex min-w-[64px] flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium [touch-action:manipulation]"
              aria-current={activo ? 'page' : undefined}
            >
              <span
                className={`flex size-9 items-center justify-center rounded-full transition-colors ${
                  activo ? 'bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]' : ''
                }`}
              >
                <Icon size={20} strokeWidth={activo ? 2.4 : 2} color={activo ? 'var(--accent)' : 'var(--text-tertiary)'} aria-hidden="true" />
              </span>
              <span className={activo ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ── <PageHeader> — título de sección, mismo patrón en las 4 secciones (consistencia h4) ── */
export function PageHeader({ titulo, subtitulo, accion }: { titulo: string; subtitulo?: string; accion?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 pb-6 pt-2">
      <div>
        <h1 className="text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{subtitulo}</p>}
      </div>
      {accion}
    </div>
  );
}

/* ── <Tarjeta> — superficie elevada base, usada por listas e info-cards en toda la app ── */
export function Tarjeta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)] ${className}`}>
      {children}
    </div>
  );
}

type TonoPildora = 'exito' | 'pendiente' | 'alerta' | 'neutro';
const TONOS: Record<TonoPildora, { bg: string; texto: string }> = {
  exito: { bg: 'color-mix(in oklab, var(--status-success) 18%, transparent)', texto: 'var(--status-success)' },
  pendiente: { bg: 'color-mix(in oklab, var(--status-warning) 18%, transparent)', texto: 'var(--status-warning)' },
  alerta: { bg: 'color-mix(in oklab, var(--status-error) 18%, transparent)', texto: 'var(--status-error)' },
  neutro: { bg: 'color-mix(in oklab, var(--text-tertiary) 16%, transparent)', texto: 'var(--text-secondary)' },
};

/* ── <Pildora> — color SEMÁNTICO (verde/ámbar/rojo), separado del acento de marca —
   regla 15 del SO: estado visual de un vistazo para contenido con fecha/estado ── */
export function Pildora({ texto, tono }: { texto: string; tono: TonoPildora }) {
  const t = TONOS[tono];
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em]"
      style={{ backgroundColor: t.bg, color: t.texto }}
    >
      {texto}
    </span>
  );
}

/* ── <IconoCirculo> — chip de ícono premium (fondo acento 10-14%), nunca emoji ── */
export function IconoCirculo({ icon: Icon, size = 20 }: { icon: LucideIcon; size?: number }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
      <Icon size={size} color="var(--accent)" aria-hidden="true" />
    </span>
  );
}

/* ── <BotonFlotante> — acción primaria de la sección, siempre visible (proximidad, regla 12) ── */
export function BotonFlotante({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-4 z-10 flex h-14 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-[15px] font-semibold text-[var(--bg)] shadow-[0_8px_24px_color-mix(in_oklab,var(--accent)_35%,transparent)] [touch-action:manipulation]"
    >
      {children}
    </motion.button>
  );
}

/* ── <ContenedorApp> — shell de cada pantalla: min-h-dvh, padding lateral, espacio para el nav fijo ── */
export function ContenedorApp({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-[520px] px-4 pb-[calc(96px+env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
      {children}
    </div>
  );
}
