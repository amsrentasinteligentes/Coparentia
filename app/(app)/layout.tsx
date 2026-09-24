import type { ReactNode } from 'react';
import { Figtree, Nunito_Sans } from 'next/font/google';
import { redirect } from 'next/navigation';
import { BottomNav } from '@/components/app/ui';
import { AvisoSinConexion } from '@/components/app/AvisoSinConexion';
import { RegistradorEventos } from '@/components/app/RegistradorEventos';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { tieneAccesoCompleto, type Status } from '@/lib/membership-fsm';
import { tieneConsentimientoVigente } from '@/lib/consentimiento';

// Tipografía del interior claro (la misma de la página de ventas): next/font la sirve desde el
// propio dominio con subset latino; las variables las consume components/landing/tokens-app-claro.css.
const figtree = Figtree({ variable: '--font-figtree', subsets: ['latin'], weight: ['500', '600', '700', '800'] });
const nunitoSans = Nunito_Sans({ variable: '--font-nunito-sans', subsets: ['latin'], weight: ['400', '600', '700', '800'] });

// SHELL de la app interna: altura dinámica de viewport + nav al fondo (regla 43 §13).
// Sesión 6: gate de sesión REAL con Supabase Auth — sin sesión válida, no se entra.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/entrar');
  }

  // CANDADO DE SUSCRIPCIÓN (2026-09-11) — antes de esto, CUALQUIERA con sesión iniciada entraba
  // completo a la app para siempre, sin haber pagado nunca: no existía ni una sola verificación
  // de prueba/plan en todo el código (hallazgo crítico de la auditoría). Ahora, con el webhook de
  // Hotmart ya conectado, esta es la única puerta real: si la persona no tiene una suscripción
  // viva, se la manda a la pantalla de planes en vez de dejarla pasar.
  const { data: perfil } = await supabase
    .from('profiles')
    .select('role, creado_manualmente')
    .eq('id', user.id)
    .maybeSingle();

  // El dueño y las cuentas dadas de alta a mano desde el panel (soporte, pruebas) nunca pasan por
  // Hotmart — se saltan el candado a propósito, igual que ya se saltaban el resto de la app.
  const exento = perfil?.role === 'admin' || perfil?.creado_manualmente === true;

  if (!exento) {
    const { data: suscripcion } = await supabase
      .from('suscripciones')
      .select('status, access_until, grace_ends_at')
      .eq('email', user.email ?? '')
      .maybeSingle();

    const tieneAcceso = suscripcion
      ? tieneAccesoCompleto(
          suscripcion.status as Status,
          new Date(),
          suscripcion.access_until ? new Date(suscripcion.access_until) : null,
          suscripcion.grace_ends_at ? new Date(suscripcion.grace_ends_at) : null
        )
      : false; // sin fila en `suscripciones` = nunca pagó ni empezó una prueba

    if (!tieneAcceso) {
      redirect('/paywall');
    }
  }

  // CONSENTIMIENTO EXPRESO (2026-09-21, equipo jurídico del usuario): la primera vez que entra tras
  // comprar —y cada vez que cambie la versión de los textos legales— la persona debe aceptar
  // Términos, Política de Datos y renovación automática en /consentimiento antes de ver la app.
  // El dueño (admin) queda exento; las cuentas manuales (clientes de prueba) NO: también son
  // personas cuyos datos tratamos.
  if (perfil?.role !== 'admin' && !(await tieneConsentimientoVigente(supabase, user.id))) {
    redirect('/consentimiento');
  }

  return (
    // SHELL DE ALTURA FIJA (2026-09-17, corrige de raíz el menú tapado en Android): antes el menú
    // era `position: fixed` sobre TODA la pantalla, y en Inicio —la única con un salto de alto
    // marcado entre su esqueleto de carga y su contenido real— Android a veces no repartía igual
    // el espacio entre su propia barra y la página, dejando las etiquetas tapadas (3 intentos de
    // compensarlo con CSS/JS no bastaron). Ahora el menú YA NO flota sobre nada: es un hermano fijo
    // dentro de una columna de exactamente `100dvh`, y solo el contenido de en medio hace scroll.
    // Ese tipo de bug deja de ser posible, en vez de seguir corrigiéndose después de que pasa.
    // `id` para los modales que van por portal (ej. FilaInstalar en Ajustes, 2026-09-24): portar a
    // `document.body` a secas saca al modal de esta clase y pierde TODOS los tokens de color del
    // interior (cae al tema oscuro por defecto de la landing) — portar aquí adentro los conserva.
    <div id="app-shell" className={`tema-app-claro ${figtree.variable} ${nunitoSans.variable} flex h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]`}>
      <AvisoSinConexion />
      <RegistradorEventos />
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
