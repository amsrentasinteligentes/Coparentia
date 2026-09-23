# VEREDICTO revisor-visual — landing (variante CLARA "Cuidado en calma", RONDA 10.1)
Histórico: oscura r-antigua 37·17·18 · r4 34·15·17 · r5 32·15·15 · r6 33·16·16 · clara r1 33·14·17 · r2 33·15·17 · r3 33·16·17 · r4 31·16·16 · r5 35·16·16 · r6 35·17·16 · r7 37·17·17 · r8 36·16·18 · r9 38·16·18 · r10 38·16·18 · **r10.1 38·16·18**
Fecha: 2026-09-23 19:20
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 38/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

Detalle usabilidad: h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:4 especificidad:3 emoción:4 oferta:4 acción:3

Gate doble: 38/40 ≥ 36 ✓ · 16/20 ≥ 16 ✓ · copy 18/20 ≥ 16 y ningún eje ≤2 ✓ → LISTA.
Fidelidad: sin imagen de referencia-contrato del usuario para la variante clara (FICHA-ARTE
§"Variante CLARA" registra referencia PARCIAL de estilo, no una captura a replicar) → N-A. Los
valores VISIBLES sí se cotejaron con la ficha (azul #2F6FDC, radios 22/999, Figtree display +
Nunito Sans body, blobs orgánicos): coinciden, cero desvío.

## r10.1 — los dos defectos aplicados, verificados uno por uno
- **Defecto 2 de la r10 (dos mandos de play): CERRADO.** DemoSello.tsx:40 declara `yaArranco`,
  DemoSello.tsx:112 lo pone en `true` dentro de `onPlaying`, y DemoSello.tsx:122 condiciona el
  overlay a `!reproduciendo && !yaArranco && !reduce`. Tras la primera reproducción el botón grande
  no vuelve — ni al pausar con los controles nativos ni al salir y reentrar en pantalla (el
  observer solo toca `reproduciendo`, nunca `yaArranco`). En docs/revisiones/demo-sello-375.png, con
  el video corriendo, hay 0 overlays sobre el cuadro. Queda 1 sola affordance de play por estado.
- **Defecto 3 de la r10 (borde duro del velo): CERRADO en su mitad de "borde".** DemoSello.tsx:127
  cambia el fill plano por `bg-gradient-to-b` 12% → 10% → transparent: el velo se desvanece hacia el
  pie y ya no corta el cuadro con una línea horizontal.
- **Mitad que sigue VIVA (respondiendo a la pregunta explícita): sí, el círculo queda descentrado.**
  El botón conserva `inset-x-2 top-2 bottom-12` con `items-center`, así que su centro cae ~20px por
  encima del centro óptico del video. Severidad BAJA: ese estado solo existe antes de la primera
  reproducción y con `prefers-reduced-motion` ni se pinta. Sigue en la lista (defecto 4), no basta
  para mover el eje de encaje.

## Lo demás de la r10, re-verificado (sin cambios de nota)
- Alternancia de superficies: Problema(elevada, flush) → Agitación(elevada, flush: UN movimiento
  visual) → Solución(base) → App por dentro(elevada) → Oferta(base) → Garantía(elevada) →
  Demo(base) → FAQ(elevada) → CTA final(banda acento) → Abogados(elevada). 0 pares adyacentes con
  la misma elevación fuera del par flush intencional ✓.
- Velo al 10-12% y póster legible ✓ · CTA propio de la sección (DemoSello.tsx:88-92, mismo par
  label/href del hero) ✓ · `controls` nativos siempre presentes y alcanzables ✓.
- h3 control y libertad: controles del video + "x" del sticky (ui.tsx:410-417) + acordeón que cierra
  (Faq.tsx:73) + cero acciones destructivas → 4.
- h7 flexibilidad: nav de anclas · sticky en dos estados (ui.tsx:405-408) · plan por querystring
  (`/onboarding?plan=anual|mensual`) · acordeón con button real, aria-expanded/aria-controls y
  teclado → 4.
- Movimiento (7 baseline): stagger `useReveal` ✓ · `CountUp` en los precios ✓ · `MiniRing` que se
  dibuja ✓ · `whileTap 0.97` + duration-150 ✓ · `AnimatePresence` del sticky y carrusel ✓ ·
  acordeón/modales 280ms ✓ · celebración N/A en landing · `useReducedMotion` en useReveal, MiniRing,
  CountUp, sticky y DemoSello ✓ → eje 4.
- CTA héroe vivo (4 anclas): #2F6FDC 4.7:1 sobre blanco ✓ · whileTap + `aria-busy` ✓ · nunca
  `disabled` ✓ · 52-56px y ancho completo a 375 ✓.
- Anclas de conversión: titular con énfasis ✓ · 2 hairlines `emphasis` (Oferta.tsx:150,
  DemoSello.tsx:102), dentro del máx 3 ✓ · chips SVG Lucide en toda lista, cero emojis ✓ ·
  secciones distinguibles por mesh + hairline + alternancia ✓ (con la reserva del defecto 2).
- Gate de carga cognitiva: 8/8, cero fallas.
- Copy trazado a FICHA-AVATAR: hero ← dolor ★1 + deseo ★5 · Problema ← dolores 1/3/4/5 · Agitación
  ← costo de la inacción ($100 por correo de abogado) · FAQ ← objeciones 1-4 y 6 · garantía nombrada
  ("Garantía del Primer Expediente", 15 días) junto al CTA de compra ✓. Message-match: sin dato de
  creativo de origen, no evaluable (no penaliza).

## Riesgo menor anotado (no es defecto puntuable hoy)
Con `yaArranco` en true, si una reproducción posterior fuera bloqueada por el navegador (p. ej. al
volver por bfcache) ya no hay botón grande de rescate; la salida existe porque `controls` está
siempre puesto. Vigilar si alguna vez se quitan los controles nativos.

## Techos no corregibles hoy (decisión del dueño — pesan en la nota, no ocupan slot)
- Sin testimonios ni cifra de clientes reales → copy especificidad 3 y copy acción 3.
- "Para abogados" después del cierre emocional → h8 = 3.
- Isotipo gris metálico sobre fondo claro → identidad = 3.

## Nota de evidencia (método)
El screenshot de página completa mide 10.102px de alto y solo pude verlo escalado; el juicio fino se
apoyó en docs/revisiones/demo-sello-375.png (que muestra el video EN reproducción, no el estado
pausado ni la sección completa) y en la lectura directa del código. Para la próxima ronda conviene
una captura de la sección `#demo` completa en sus dos estados (pausado y reproduciendo).

Top defectos (vivos, por severidad):
1. [app/page.tsx:215-227 (demo) vs :163-204 (oferta)] ARRASTRE — la única PRUEBA del mecanismo sigue
   después del precio y la garantía: quien abandona en la oferta nunca ve el Sello funcionando →
   subir `<DemoSello>` tras `<Solucion>` o dejar un ancla "Ver el Sello en 24 s" → `#demo` en el
   hero. Medible: la demo entra antes del bloque de precio. (Decisión del dueño, no aplicado.)
2. [components/landing/ui.tsx:236-242, toda la página a 375px] La distinción base↔elevada es de ~4%
   de luminancia (#F3F7FC vs #FFFFFF con mesh 12-16%): varias franjas se leen como un mismo plano
   casi-blanco y el eje de profundidad queda en 3 → subir el mesh de `elevada` a 18-20% o dar a
   `--surface-2` un escalón real. Medible: ΔL ≥ 6% entre secciones adyacentes. (No tocado en r10.1.)
3. [components/landing/AnuncioAbogados.tsx:42, tras CtaFinal] "Para abogados" llega después del
   cierre emocional y del PS: la página termina dos veces y con dos audiencias → moverla al footer o
   a /abogados. Medible: 1 sola acción primaria desde el CTA final hasta el pie. (Decisión del
   dueño, no aplicado.)
4. [components/landing/DemoSello.tsx:127] El overlay sigue en `top-2 bottom-12` con `items-center`:
   el círculo de play cae ~20px sobre el centro óptico del cuadro (solo en el estado previo a la
   primera reproducción) → centrar sobre el alto real del video (`inset-2` + `pb-10` y centrado
   vertical del contenido). Medible: centro del círculo = centro del cuadro ±4px.
5. [docs/revisiones/demo-sello-375.png] La evidencia visual de la sección llega recortada (solo un
   sliver del video en reproducción, sin el titular, los 3 pasos ni el estado pausado) → capturar
   `#demo` completa en sus dos estados antes de la próxima revisión. Medible: la captura contiene
   kicker, H2, los 3 pasos, el CTA y el teléfono entero.
