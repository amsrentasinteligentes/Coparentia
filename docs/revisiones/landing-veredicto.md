# VEREDICTO revisor-visual — landing (variante CLARA "Cuidado en calma", ronda 7)
Histórico: oscura r-antigua 37·17·18 · r4 34·15·17 · r5 32·15·15 · r6 33·16·16 · clara r1 33·14·17 · r2 33·15·17 · r3 33·16·17 · r4 31·16·16 · r5 35·16·16 · r6 35·17·16 · r7 37·17·17
Fecha: 2026-09-22 18:40
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 17/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA

Detalle usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:4 especificidad:2 emoción:4 oferta:4 acción:3

Verificado de la r6 (las 4 correcciones, una por una):
1. Mecanismo en el hero ✓ — 3er pilar "Sello de Confianza en cada comprobante" (app/page.tsx:81),
   visible en el screenshot a 375px bajo la escena. Con solución (page.tsx:122-123) y oferta
   (page.tsx:176) la Big Idea ya se formula en 1 frase en los tres puntos → copy eje idea 3→4.
2. Salto de layout de la referencia en pesos ✓ — `min-h-[18px] lg:min-h-[20px]` en la línea que
   recibe el fetch de TRM (Oferta.tsx:162-164). La línea existe pintada desde el primer frame
   ("Se cobra al terminar la prueba") y la TRM solo la alarga; salto de alto 0 en el bloque que
   decide la compra → h5 3→4.
3. Confusión de plazos/precios en el stack ✓ — "Hoy no pagas nada. Después: US$89 al año con el
   plan Anual (US$7.42/mes)" (app/page.tsx:166) y CTA mensual en 1ª persona "Empezar mi plan
   mensual" (app/page.tsx:186). Ya no hay un precio que contradiga la tarjeta de al lado.
4. "Planes" a 375px ✓ — Hero.tsx:86 + 114-116: el enlace que hace match con /plan/i sale del
   `hidden` y pasa a `inline-flex h-11` (44px reales) junto a "Entrar"; el resto sigue md+.

CTA héroe (4 anclas): --accent #2F6FDC = 4.5:1 sobre --bg ✓ · whileTap 0.97 + aria-busy
(ui.tsx:306-311) ✓ · nunca disabled ✓ · 56px de alto, ancho completo en celular (Hero.tsx:155) ✓.
Gate de conversión: titular con énfasis ✓ · hairlines degradé (plan anual, garantía, chip del
mecanismo = 3) ✓ · chips SVG sin emojis ✓ · secciones alternadas base/elevada con borderTop ✓.
Movimiento: stagger (useReveal 0.07 en hero y todas las secciones) · CountUp en los precios ·
MiniRing que se dibuja · tap 0.97 · AnimatePresence en la barra pegajosa · reduced-motion resuelto
en useReveal/CountUp/MiniRing/Sticky → eje 4.
Fidelidad FICHA-ARTE §"Variante CLARA": hex (#F3F7FC/#FFF/#14233A/#2F6FDC), radios 22/999/28,
Figtree+Nunito Sans y los blobs orgánicos coinciden con lo renderizado a 375 y a 1440 → FIEL.

Lo que NO se corrige hoy (decisión explícita del usuario — no ocupa slot de defecto, pero sí pesa
en la nota y queda anotado como riesgo abierto):
- Sin testimonios ni demo del mecanismo → COPY EJE ESPECIFICIDAD = 2 (el único sub-umbral de la
  rúbrica 4 que no se cumple: "ningún eje ≤2"). Los claims grandes —"10 minutos", "cientos de
  dólares en honorarios", "los US$100 que puede cobrar un abogado por correo"— no tienen hoy
  ninguna prueba al lado. El veredicto sale LISTA porque las tres notas superan su gate
  (37≥36 · 17≥16 · 17≥16), pero este eje SE REABRE en cuanto haya el primer cliente real o el
  material para la mini-demo del flujo subir→sellar→exportar.
- Bloque "Para abogados" con su propio CTA después del cierre emocional → h8 = 3 y copy acción = 3
  (dos audiencias y dos acciones distintas en la misma página).
- Logo/isotipo gris metálico sobre fondo claro (se ve apagado en el header y en el footer del
  screenshot) → pesa en identidad = 3; prohibido tocarlo.

Top defectos:
1. [FAQ pregunta 1 — app/page.tsx:212] "Coparentia funciona 100% de forma **unilateral**" es la
   única jerga legal cruda que queda en toda la página, y está en la respuesta que más se lee →
   reemplazar por "Solo la usas tú: la otra persona no necesita instalar ni aprobar nada" (≤16
   palabras, 0 términos técnicos).
2. [Hero → franja bajo el CTA, app/page.tsx:73] tres datos encadenados en una sola línea de 13px
   ("7 días gratis · Registras tu medio de pago hoy, el primer cobro entra el día 8 · Garantía de
   15 días") que a 375px envuelve en 3 renglones apretados bajo el botón → dejar en 1ª línea
   "7 días gratis · Garantía de 15 días" (14px, --text-secondary) y bajar el detalle del cobro a
   una 2ª línea de 12px --text-tertiary. Máx 2 renglones medidos a 375px.
3. [Plazos del trial repetidos 4 veces — app/page.tsx:73 · Oferta.tsx:175 y 202 · app/page.tsx:243
   y 244] la misma frase "registras tu medio de pago hoy; el primer cobro entra el día 8" aparece
   en hero, ambas tarjetas, el recap y el PS → conservarla completa SOLO en las tarjetas de la
   oferta y en el PS; en hero y recap dejar "7 días gratis · Garantía de 15 días" (−2 apariciones,
   h8 3→4).
4. [Oferta → tarjeta Mensual, app/page.tsx:190-195] la feature "Pagas mes a mes, US$9.99" repite
   la cifra que está 3 renglones arriba en 36px: de 4 bullets, 1 no aporta información nueva →
   cambiarla por el diferenciador real ("Sin compromiso de 12 meses") y quedar en 3 bullets.
5. [1440px — Garantia.tsx:33 y 39] la tarjeta va a `max-w-[560px]` dentro de un contenedor de
   1280px con 64px de padding arriba y abajo: en computador queda como una isla pequeña en una
   franja casi vacía (visible en docs/revisiones/landing-1440.png) → subir a `lg:max-w-[760px]`
   con el ícono y el texto en fila (chip a la izquierda, texto a la derecha) para que la franja
   deje de leerse hueca.


## Retoques aplicados DESPUÉS del veredicto r7 (2026-09-22, medidos)
- FAQ 1 sin la palabra "unilateral": "Solo la usas tú: la otra persona no necesita instalar ni aprobar nada".
- Franja del hero en 2 renglones (39px medidos a 375px): promesa arriba, detalle del cobro en 12px tertiary.
- El detalle del día 8 sale del recap del cierre (queda en hero, ambas tarjetas y el PS).
- Tarjeta Mensual: 3 bullets, sin repetir el precio que ya está en 36px.
- Garantía a 760px en computador (antes 560px dentro de 1280 dejaba la franja hueca).
Ninguno toca logo ni isotipo (orden del usuario).
