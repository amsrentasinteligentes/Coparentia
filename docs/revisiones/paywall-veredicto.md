# VEREDICTO revisor-visual — paywall

Fecha: 2026-09-09 18:40
Screenshot: docs/revisiones/paywall-precio-v7-375.png (+ docs/revisiones/paywall-recap-v3-375.png · docs/revisiones/paywall-timeline-v3-375.png)
Usabilidad: 28/40
Craft: 13/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:4 h3:4 h4:2 h5:3 h6:2 h7:3 h8:2 h9:2 h10:3
Detalle craft: jerarquía:3 profundidad:2 identidad:3 movimiento:3 encaje:2
Detalle copy: idea:3 especificidad:3 emoción:2 oferta:4 acción:4
⚠️ Eje "emoción/dolor" del copy = 2 (≤2): se corrige aunque el total llegue a 16.

## Arreglos de la ronda anterior — verificados en código
1. Personalización falsa → PARCIAL. `nRespuestas` cae a 0 (page.tsx:62-64) y el subtítulo alterna
   honestamente (156-162). Pero la tarjeta 3 sigue diciendo "Alertas en el momento que elegiste"
   sin leer nunca `r.momento` → la afirmación falsa se movió de renglón, no desapareció.
2. Halo recortado → CORREGIDO. `radial-gradient(ellipse at …)` sin radios en px en los 3 pasos
   (141-153, 209-217, 285-297); en las 3 capturas se desvanece sin borde duro. Nuevo problema:
   quedó copiado inline 3 veces con valores (26%) distintos del `<Halo>` del kit (ui.tsx:110-121,
   `220px 140px … 16%`), que conserva el bug de radios fijos que aquí se arregló.
3. "MÁS POPULAR" → CORREGIDO. Badge = "AHORRAS 3 MESES · $30.88 AL AÑO" (321-323), dentro del
   flujo (sin `-top-3`), y la cuenta cuadra ($9.99×12=$119.88 − $89 = $30.88 ≈ 3.09 meses).
4. Paso 2 plano → CORREGIDO. Halo (210-217), stagger 50ms (230), línea con `scaleY`/`origin-top`
   (240-245), cobro derivado del plan (200), pregunta reescrita como afirmación (258-260).
5. CTA sin foco ni bloqueo → CORREGIDO. `focus-visible:outline-[var(--text-primary)]`
   (ui.tsx:190) y estado `yendo` que deshabilita + "Abriendo…" (page.tsx:77-84, 400-402).

## Sigue pesando (lo declarado como no hecho)
Conteo animado del precio héroe (baseline de movimiento #2), ancla "$0.33/día vs $100 del
abogado" (objeción 4 de FICHA-AVATAR), hairlines degradé de FICHA-ARTE, bordes 25%/35%
desiguales entre las dos tarjetas de plan.

Top defectos:
1. [pasos 1 y 2, cuerpo] ~39% del alto (≈330px de 840 a 375px) es fondo vacío en dos huecos de
   ~165px; `justify-center` centra pero no llena: cada paso del dinero carga 3 líneas de
   contenido → fusionar recap+timeline en una vista o llenar con valor real (mini-demo del Sello,
   la respuesta del onboarding, el ancla de costo).
2. [paso 1, tarjeta 3] "Alertas en el momento que elegiste" afirma una elección que el código
   nunca lee (`r.momento` sin usar), y el `useEffect` hace que el subtítulo pinte primero la
   versión genérica y salte a "Hecho con tus N respuestas" → renderizar el valor real de
   `r.momento` y resolver el storage antes del primer paint.
3. [las 3 vistas, superficies] FICHA-ARTE exige "hairline degradada" y no hay ninguno (todos los
   bordes son `color-mix` plano); además el halo vive inline con parámetros distintos al `<Halo>`
   del kit → subir el halo corregido al kit y aplicar hairline degradé en la tarjeta del plan.
4. [paso 3, tarjetas de plan] radio 10px (`--radius-button`) contra 14px (`--radius-card`) del
   paso 1, bordes inactivos 25% vs 35%, y el `<Marcador>` parte "captura de WhatsApp" en dos
   barras grises desconectadas que compiten con el acento → un solo radio de tarjeta, un solo
   borde inactivo, marcador en una línea o eliminado.
5. [paso 3, precio y microcopy] $7.42 estático (falta el conteo del número héroe) y sin el ancla
   "$0.33/día vs $100 por cada email del abogado" que la ficha marca para la objeción de precio →
   animar el número al montar + una línea de ancla bajo "Se cobra $89/año".
