# VEREDICTO revisor-visual — Landing Coparentia
Fecha: 2026-09-07 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [components/landing/Oferta.tsx L189-195] El CTA "Elegir mensual" es un `<motion.a>` construido a mano en vez de reusar `<CtaButton>` (que sí tienen el CTA anual, el del hero y el mid-page) → riesgo de que un cambio futuro de estilo/tap-feedback quede desincronizado entre botones (heurística 4, consistencia). Fix: agregar variante `outline` a `CtaButton` y usarla ahí.
2. [components/landing/ui.tsx L349-369, StickyCtaMobile] La barra sticky mobile no tiene control de cierre manual: una vez aparece, el usuario no puede descartarla salvo scrolleando hasta #oferta o #cta-final (heurística 3, control y libertad, verificado en código). Fix: botón "x" que la oculte con estado local hasta el próximo hito de scroll.
3. [components/landing/*, todo el kit] Sin atajos más allá de tab/enter nativo — verificado en código, no hay accesskeys ni navegación rápida entre secciones aparte del skip-to-content (heurística 7). Aceptable para una landing, pero dejó el eje en el mínimo funcional. Fix opcional: no crítico para este tipo de pantalla.
4. [PENDIENTE CONOCIDO] Hero (`Camera` placeholder) y carrusel de AppPorDentro (frames con ícono) siguen sin screenshots reales de la app — correcto y esperado hasta Sesión 5, no cuenta como defecto accionable.
5. [ESTRUCTURA CANÓNICA] Los 4 CTAs repiten el mismo copy "Crear mi expediente gratis" — regla dura de 19-PAGINA-DE-VENTAS.md (mismo verbo repetido), no cuenta como defecto.
