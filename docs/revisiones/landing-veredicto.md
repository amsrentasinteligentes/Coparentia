# VEREDICTO revisor-visual — landing
Fecha: 2026-09-10 00:00
Screenshot: docs/revisiones/landing-oferta-cta-375.png
Usabilidad: 37/40
Craft: 17/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

Re-confirmado 2026-09-10 tras el rescate visual de onboarding/paywall: se editaron
components/funnel/ui.tsx (kit del FUNNEL) y app/onboarding/page.tsx, NINGUNO de los cuales usa la
landing — el kit de la landing es components/landing/*, y ni app/page.tsx ni components/landing/*
cambiaron desde este veredicto (último commit que los toca: 8d9f40d, anterior a la ronda LISTA).
El gate de frescura compara el mtime de cualquier .tsx de app/components/src, por eso marcó
"caducado" con ediciones de otra pantalla. El veredicto sigue vigente en sustancia.

Top defectos:
1. Card mensual (sección Oferta) — con solo 3 bullets queda ~40% más corta que la anual; en desktop el grid items-start deja las cards desparejas y "Todo lo que incluye el plan Anual" obliga a saltar a la otra card → sumar 1 bullet concreto o fijar min-height igualada.
2. Card anual (bajo el precio) — "Se cobra US$89 al año" (semibold) + "3 meses gratis" (accent) siguen siendo dos focos que compiten bajo el display; el ojo apurado salta entre ambos → mover "3 meses gratis" al badge superior o bajarlo a peso normal.
3. Hero (H1) — el subrayado tipo marcador sobre "pagada y probada" cubre dos líneas con bloques de ancho distinto y se ve tosco/desalineado → limitar el highlight a una línea o padding uniforme.
4. Página completa — "Garantía del Primer Expediente (15 días)" se repite 5+ veces (2 cards, stack, sección garantía, recap CTA final, PS) → dejarla en card anual + sección garantía; quitar de mensual y del recap.
5. CTA final (recap) — "7 días de prueba gratis · Garantía del Primer Expediente (15 días)" envuelve y deja "(15 días)" huérfano en su línea → acortar a "7 días gratis · Garantía de 15 días".
