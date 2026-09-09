import type { ReactNode, CSSProperties } from 'react';
import { redirect } from 'next/navigation';
import { usuarioAdminActual } from '@/lib/admin-datos';

// Fondo HUNDIDO (--surface-2, el tercer nivel de profundidad de DESIGN-CORE) con un tinte azul
// muy sutil que se repite en toda la altura del scroll (`background-repeat`, no solo detrás del
// título) — sin esto, las cards se sentían contra un plano sólido sin textura (defecto real,
// revisor-visual ronda 6: "profundidad" bajo en un panel de ~2200px de scroll donde el halo del
// header solo cubre los primeros 200px).
const FONDO_PANEL: CSSProperties = {
  backgroundColor: 'var(--surface-2)',
  // Banda diagonal continua (linear-gradient, no un blob puntual dentro de un tile grande) —
  // el radial de la ronda 6 solo cubría una esquina de cada 900px y quedaba imperceptible en el
  // resto del scroll (defecto real, ronda 7). Un gradiente lineal fijo cubre TODO el alto de una
  // sola vez, sin depender de repetición ni de dónde caiga cada card.
  backgroundImage: 'linear-gradient(165deg, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 70%)',
  backgroundAttachment: 'fixed',
};

// GATE DEL PANEL DE ADMINISTRACIÓN — verificado EN EL SERVIDOR, en cada carga (nunca solo
// "ocultar el link"; eso es IDOR — 09-SEGURIDAD.md/26-AUTH-MODERNO.md). Sin sesión → a /entrar.
// Con sesión pero sin el permiso de dueño marcado en `profiles.role` → de vuelta a /inicio, sin
// dar ninguna pista de que /admin existe (anti-enumeración, mismo principio que el login).
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { esAdmin, email } = await usuarioAdminActual();

  if (email === null) {
    redirect('/entrar');
  }
  if (!esAdmin) {
    redirect('/inicio');
  }

  return (
    <div className="min-h-dvh text-[var(--text-primary)] [font-family:var(--font-body)]" style={FONDO_PANEL}>
      {children}
    </div>
  );
}
