# VEREDICTO revisor-visual — paywall (2 pasos)
Fecha: 2026-09-17 18:40
Screenshot: docs/revisiones/paywall-paso1-375.png
Usabilidad: 27/40
Craft: 14/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Paso 2 a 375px: el CTA "Empezar mis 7 días gratis" queda bajo el pliegue (solo se ve un borde azul) — hacerlo sticky con degradé de máscara o recortar el pie. 2) Paso 1 a 375px, subtítulo: "Hecho con tus 1 respuestas" (plural roto en la línea que sostiene la personalización) — pluralizar respuesta/respuestas. 3) Computador 1440: el panel de marca izquierdo flota con ~60-80% de vacío muerto y su contenido no comparte eje vertical con la columna derecha; además `_wip-paywall-precio-1440.png` muestra un panel (párrafo) que el código actual ya no renderiza — evidencia desactualizada. 4) A 375px aparece barra de scroll horizontal: `<Halo>` se extiende -left-8/-right-8 fuera del contenedor px-4 sin overflow-hidden (≈16px de desborde); y el `<Marcador>` (0.16em a 0.04em del borde de caja) todavía roza las descendentes de "WhatsApp". 5) Consistencia del kit: `/entrar` sigue con `ContenedorFunnel` (columna angosta en 1440 justo después del paywall de dos columnas) y los bloques hundidos del paso 2 usan `color-mix(--bg 55%, black)` en vez del token `--surface-2` de FICHA-ARTE.

Detalle usabilidad: h1:3 h2:2 h3:3 h4:2 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
Detalle copy: idea:4 especificidad:3 emoción:3 oferta:4 acción:3
Screenshots puntuados: docs/revisiones/paywall-paso1-375.png · docs/revisiones/paywall-paso2-precio-375.png · docs/revisiones/_wip-paywall-p1-1440.png · docs/revisiones/_wip-paywall-precio-1440.png
Defectos de la ronda anterior: (1) pie apilado → PARCIAL (garantía en 1 línea + <details>, pero siguen 3 filas de texto y 6 tocables tras el CTA) · (2) plan recordado → CERRADO (sessionStorage `coparentia_plan_elegido` leído al montar) · (3) Marcador tachado → PARCIAL (más fino y bajo, aún toca descendentes) · (4) tercer plano hundido → CERRADO en el paso 2, ausente en el paso 1 y con color ad-hoc en vez de `--surface-2` · (5) consistencia del kit → ABIERTO (`/entrar` sin MarcoFunnel).
Sub-checks de venta: garantía nombrada cerca del CTA → PARCIAL (la línea dice "Garantía de 15 días"; el nombre "Garantía del Primer Expediente" vive dentro del <details> colapsado). Message-match: NO VERIFICABLE (sin dato del creativo de origen).
