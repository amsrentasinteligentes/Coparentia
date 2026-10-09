'use client';

// Aviso de cookies de las páginas PÚBLICAS (principal, embudo, legales, artículos). Solo aparece
// si hay Pixel configurado y la persona todavía no eligió. "Aceptar" y "Rechazar" tienen
// exactamente el mismo peso visual (sin patrón oscuro: rechazar no es un enlace chiquito).
// Nada se carga hasta que acepta. Ver lib/meta-pixel.ts.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EVENTO_CAMBIO, META_PIXEL_ID, guardarEleccion, leerEleccion } from '@/lib/meta-pixel';

const RUTAS_PUBLICAS = ['/onboarding', '/paywall', '/entrar', '/terminos', '/privacidad', '/reembolsos', '/aviso-ia', '/articulos'];

function esRutaPublica(pathname: string): boolean {
  return pathname === '/' || RUTAS_PUBLICAS.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

export function BannerCookies() {
  const pathname = usePathname();
  const [sinElegir, setSinElegir] = useState(false);

  useEffect(() => {
    const revisar = (): void => setSinElegir(Boolean(META_PIXEL_ID) && leerEleccion() === null);
    revisar();
    window.addEventListener(EVENTO_CAMBIO, revisar);
    return () => window.removeEventListener(EVENTO_CAMBIO, revisar);
  }, []);

  if (!sinElegir || !esRutaPublica(pathname)) return null;

  const claseBoton =
    'h-11 flex-1 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)] bg-[var(--surface)] text-[14px] font-semibold text-[var(--text-primary)] [touch-action:manipulation]';

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="tema-claro fixed inset-x-0 bottom-0 z-[60] border-t border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[var(--shadow-2)]"
      style={{ background: 'var(--surface)' }}
    >
      <div className="mx-auto max-w-[720px]">
        <p className="text-[13px] leading-[1.5] text-[var(--text-secondary)]">
          Usamos cookies del Pixel de Meta para medir qué pasos del proceso funcionan y mejorar nuestros anuncios. No enviamos tu correo,
          tu nombre ni lo que respondes. Tú decides.{' '}
          <Link href="/privacidad" className="font-semibold text-[var(--accent-ink)] underline">
            Más información
          </Link>
        </p>
        <div className="mt-3 flex gap-3">
          <button type="button" onClick={() => guardarEleccion('aceptado')} className={claseBoton}>
            Aceptar
          </button>
          <button type="button" onClick={() => guardarEleccion('rechazado')} className={claseBoton}>
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
