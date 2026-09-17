# VEREDICTO revisor-visual — landing
Histórico: r-antigua 37·17·18 (solo 375) · r4 34·15·17 · r5 32·15·15 · r6 33·16·16 (375 + 1440 completa + hero 1440×900 + cierre 1440)
Fecha: 2026-09-17 15:30
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Evaluado a 375px (docs/revisiones/landing-375.png), 1440px página completa (docs/revisiones/landing-1440.png),
primer viewport 1440×900 (docs/revisiones/landing-hero-1440.png) y bloque de cierre (docs/revisiones/landing-ctafinal-1440.png).
Código verificado: app/page.tsx + components/landing/*.tsx + tokens.css + app/onboarding/page.tsx 220-225 + app/paywall/page.tsx 135.
Detalle: h1:3 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:4 · jerarquía:4 profundidad:3 identidad:3
movimiento:3 encaje:3 · copy idea:4 especificidad:3 emoción:3 oferta:3 acción:3.
Craft pasa el gate (16 ≥ 16) y copy pasa justo (16 ≥ 16, ningún eje ≤2). Falla usabilidad (33 < 36) → NO LISTA.

Cambios de r5 verificados: (1) CtaFinal sobre --surface con halo, H2 en --text-primary ✓ — medido: acento #5B93E8 sobre #13233A = 5.1:1 (el 5.9:1 es el texto --bg sobre el botón); ambos pasan ·
(2) ctaHref '/onboarding?plan=anual|mensual' (page.tsx 138/151) → sessionStorage 'coparentia_plan_elegido' (onboarding 222-225) → leído en paywall 135 ✓ ·
(3) anillos 0%/0%/0%/100% fuera de page.tsx (los props anillo* ya no se pasan) ✓ · (4) AnuncioAbogados sin "cupos limitados"/"ya están buscando" ✓, pero la sección sigue entre el CTA final y el footer (la mitad del fix de r5 #4 no se hizo) ·
(5) nombre="Garantía del Primer Expediente" sin artículo ✓ · carrusel lg:px-[calc(50%-395px)] centrado a 1440 ✓.
FICHA-ARTE: fondo #0B1524 / superficie #13233A / acento #5B93E8 / Spectral display + IBM Plex Sans body / radio 14-10 — coinciden con lo visible. Sin desvío.

Top defectos:
1. [Hero, tarjeta visual /hero-visual-inicio.png, fila "Próximo · Visita … 10 de sept ›"] la fila con chevron parece un botón y es un PNG: elemento que parece interactivo y no hace nada (falla ítem del gate de carga cognitiva; además el anillo "4 de 6" y "$ 2.075.000" son estáticos — se pierde el conteo/dibujado héroe) → reemplazar el PNG por el componente real (MiniRing + CountUp + fila de evento) envuelto en <a href="/onboarding" aria-label="Crear mi expediente gratis"> con whileTap; mínimo viable: recortar el PNG sin el chevron y envolverlo en ese mismo <a>.
2. [Entre el CTA final y el footer, "Para abogados de familia"] un segundo CTA ("Quiero anunciarme como abogado") a otra audiencia DESPUÉS del cierre emocional rompe "nada se interpone entre el PS y el footer" (CtaFinal.tsx 11-12) y compite con la única acción de la página → mover el bloque a /abogados y enlazarlo desde FooterLegal ("Para abogados"); si se mantiene, bajarlo bajo el footer legal como franja de 1 línea con enlace de texto.
3. [Kickers de Solución y Oferta] "EL MECANISMO" y "LA OFERTA" son jerga de copywriting del sistema, no lenguaje de Carlos (h2) → 'CÓMO FUNCIONA' y 'PLANES Y PRECIOS' (page.tsx no los pasa: cambiar defaults en Solucion.tsx 46 y Oferta.tsx 99).
4. [Oferta a 1440, dos tarjetas] Anual con md:-translate-y-2 + grid items-start deja la Mensual 8px más baja y ~40% más corta (bordes superiores e inferiores desalineados a simple vista); Mensual trae 3 bullets (warnRango exige 4-6) y omite la línea de garantía; el stack ancla US$19/US$15 en plantilla y guía que el comprador no puede verificar el día 1 → quitar translate y usar items-stretch; añadir "Garantía del Primer Expediente (15 días)" a Mensual; listar en el stack solo entregables que existen como archivo descargable en la app.
5. [Todos los CTAs] CtaButton es un motion.a plano (ui.tsx 294): navegación completa a /onboarding sin prefetch ni estado pendiente (>100ms sin feedback, h1); y el CTA de abogados es una variante a mano (h-12 / 15px vs kit 52px / 17px — AnuncioAbogados.tsx 77) → CtaButton con next/link (o router.push + estado "yendo" con spinner inline 150ms) y el botón de abogados como <CtaButton variant="outline">.
