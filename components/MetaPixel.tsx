'use client';

// Carga el Pixel de Meta SOLO si la persona aceptó, y registra la vista de las 3 páginas del
// embudo (principal, onboarding, paywall). No renderiza nada. Ver lib/meta-pixel.ts.

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { EVENTO_CAMBIO, META_PIXEL_ID, cargarPixel, esPaginaMedida, leerEleccion, trackMeta } from '@/lib/meta-pixel';

export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!META_PIXEL_ID || !esPaginaMedida(pathname)) return;
    // También corre cuando la persona acaba de pulsar "Aceptar" en esta misma página: así la vista
    // de la página donde aceptó no se pierde.
    const medirVista = (): void => {
      if (leerEleccion() !== 'aceptado') return;
      if (cargarPixel()) trackMeta('PageView');
    };
    medirVista();
    window.addEventListener(EVENTO_CAMBIO, medirVista);
    return () => window.removeEventListener(EVENTO_CAMBIO, medirVista);
  }, [pathname]);

  return null;
}
