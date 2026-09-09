'use client';

// AJUSTES — la pantalla "Cómo cancelar" + eliminar cuenta que exige 47-LEGAL-FISCAL-Y-
// PRIVACIDAD.md (capa legal de suscripción, punto 1: obligatoria, accesible sin buscar) y el
// derecho de eliminación real (no solo una promesa por correo). No vive en el nav inferior fijo
// (4 destinos ya establecidos) — se llega desde el ícono de engranaje en Expediente.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, ExternalLink, Trash2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { ContenedorApp, Tarjeta, IconoCirculo } from '@/components/app/ui';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { eliminarMiCuenta } from './acciones';

export default function Ajustes() {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cerrarSesion = async (): Promise<void> => {
    if (saliendo) return;
    setSaliendo(true);
    const supabase = crearClienteSupabase();
    await supabase.auth.signOut();
    router.push('/entrar');
  };

  const eliminarCuenta = async (): Promise<void> => {
    if (borrando) return;
    setBorrando(true);
    setError(null);
    const r = await eliminarMiCuenta();
    if (!r.ok) {
      setError(r.mensaje);
      setBorrando(false);
      return;
    }
    router.push('/');
  };

  return (
    <ContenedorApp>
      <div className="flex items-center gap-3 pb-6 pt-2">
        <Link href="/expediente" aria-label="Volver al expediente" className="flex size-9 items-center justify-center [touch-action:manipulation]">
          <ArrowLeft size={20} color="var(--text-primary)" aria-hidden="true" />
        </Link>
        <h1 className="text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Ajustes</h1>
      </div>

      <h2 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Tu suscripción</h2>
      <Tarjeta className="mt-3">
        <p className="text-[14px] font-medium text-[var(--text-primary)]">Cómo cancelar</p>
        <p className="mt-1.5 text-[13.5px] leading-[1.5] text-[var(--text-secondary)]">
          Tu suscripción se compra y se administra desde Hotmart. Para cancelarla (deja de cobrarte
          desde el siguiente ciclo, no borra tu cuenta ni tus datos), entra al portal de compras de
          Hotmart con el correo con el que pagaste:
        </p>
        <a
          href="https://sac.hotmart.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex h-11 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[14px] font-medium text-[var(--text-primary)] [touch-action:manipulation]"
        >
          Ir al portal de compras de Hotmart
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </Tarjeta>

      <h2 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Tu cuenta</h2>
      <Tarjeta className="mt-3 flex items-center gap-3">
        <IconoCirculo icon={LogOut} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium text-[var(--text-primary)]">Cerrar sesión</p>
          <p className="text-[12.5px] text-[var(--text-tertiary)]">Puedes volver a entrar cuando quieras con tu correo.</p>
        </div>
        <button
          type="button"
          onClick={cerrarSesion}
          disabled={saliendo}
          className="flex h-11 shrink-0 items-center rounded-[var(--radius-button)] px-3 text-[13.5px] font-medium text-[var(--accent)] transition-opacity disabled:opacity-50 [touch-action:manipulation]"
        >
          {saliendo ? 'Saliendo…' : 'Salir'}
        </button>
      </Tarjeta>

      <Tarjeta className="mt-3 border-[color-mix(in_oklab,var(--status-error)_30%,transparent)]">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--status-error)_14%,transparent)]">
            <AlertTriangle size={20} color="var(--status-error)" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-[var(--text-primary)]">Eliminar mi cuenta</p>
            <p className="text-[12.5px] text-[var(--text-tertiary)]">
              Borra tu cuenta y TODOS tus datos (comprobantes, eventos, expediente) para siempre. No se puede deshacer.
            </p>
          </div>
        </div>

        {error && <p className="mt-3 text-[12.5px] text-[var(--status-error)]">{error}</p>}

        {!confirmandoBorrado ? (
          <button
            type="button"
            onClick={() => setConfirmandoBorrado(true)}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--status-error)_35%,transparent)] text-[13.5px] font-semibold text-[var(--status-error)] [touch-action:manipulation]"
          >
            <Trash2 size={15} aria-hidden="true" />
            Eliminar mi cuenta
          </button>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-[12.5px] font-medium text-[var(--text-primary)]">¿Seguro? Esto no se puede deshacer.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmandoBorrado(false)}
                disabled={borrando}
                className="flex h-11 flex-1 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[13.5px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
              >
                No, cancelar
              </button>
              <button
                type="button"
                onClick={eliminarCuenta}
                disabled={borrando}
                className="flex h-11 flex-1 items-center justify-center rounded-[var(--radius-button)] bg-[var(--status-error)] text-[13.5px] font-semibold text-white transition-opacity disabled:opacity-60 [touch-action:manipulation]"
              >
                {borrando ? 'Eliminando…' : 'Sí, eliminar todo'}
              </button>
            </div>
          </div>
        )}
      </Tarjeta>

      <p className="mt-6 text-[12.5px] leading-[1.5] text-[var(--text-tertiary)]">
        Más detalles en nuestra{' '}
        <Link href="/privacidad" className="text-[var(--accent)] underline">
          Política de Privacidad
        </Link>
        . ¿Dudas? Escríbenos a{' '}
        <a href="mailto:soporte@coparentia.app" className="text-[var(--accent)] underline">
          soporte@coparentia.app
        </a>
        .
      </p>
    </ContenedorApp>
  );
}
