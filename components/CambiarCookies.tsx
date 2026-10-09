'use client';

// Botón de la política de privacidad para cambiar la elección del aviso de cookies: borra la
// elección guardada y el aviso vuelve a aparecer. Ver lib/meta-pixel.ts.

import { guardarEleccion } from '@/lib/meta-pixel';

export function CambiarCookies() {
  return (
    <button
      type="button"
      onClick={() => {
        guardarEleccion(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="mt-2 font-semibold text-[var(--accent-ink)] underline [touch-action:manipulation]"
    >
      Cambiar mi elección sobre cookies
    </button>
  );
}
