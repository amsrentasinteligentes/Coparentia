'use client';

// ALTURA REAL DEL SHELL EN MODO INSTALADO (2026-09-25) — el usuario instaló la app en Android
// (confirmado: "en android salió muy bien") y al navegar el menú de abajo apareció aplastado
// contra la barra propia del sistema (los 3 botones o el gesto). Causa raíz: `100dvh` funciona
// bien en un navegador normal, pero varias versiones de Chrome/WebView en Android, cuando la app
// corre INSTALADA (`display-mode: standalone`), no restan de ese valor el alto real de la barra
// del sistema — el shell de la app (`h-dvh`, ver app/(app)/layout.tsx) cree que tiene más espacio
// del que en verdad se ve, y el menú de abajo queda empujado detrás de esa barra.
//
// `window.visualViewport` SÍ reporta el alto real y visible del sistema, aun en ese mismo caso —
// por eso se usa aquí para pisar la variable `--app-altura` (definida en globals.css con
// `100dvh` por defecto) SOLO cuando la app corre instalada. En un navegador normal (donde `dvh` ya
// funciona bien, comprobado desde el arreglo de 2026-09-17) este componente no toca nada.
//
// Sin salida visual — un solo efecto que ajusta una variable CSS global.
import { useEffect } from 'react';

export function AlturaEstandalone() {
  useEffect(() => {
    const instalada = window.matchMedia('(display-mode: standalone)').matches;
    if (!instalada) return; // en navegador normal, `--app-altura` se queda en 100dvh — nada cambia

    const raiz = document.documentElement;
    const ajustar = (): void => {
      const alto = window.visualViewport?.height ?? window.innerHeight;
      raiz.style.setProperty('--app-altura', `${alto}px`);
    };

    ajustar();
    // Se re-mide en cada cambio: rotar el teléfono, que el sistema muestre/oculte su barra de
    // gestos, o que aparezca el teclado (el mismo comportamiento que ya tenía `dvh`, conservado).
    window.visualViewport?.addEventListener('resize', ajustar);
    window.addEventListener('orientationchange', ajustar);
    return () => {
      window.visualViewport?.removeEventListener('resize', ajustar);
      window.removeEventListener('orientationchange', ajustar);
    };
  }, []);

  return null;
}
