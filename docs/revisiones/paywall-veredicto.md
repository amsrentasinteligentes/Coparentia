# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-10 18:40
Screenshot: docs/revisiones/paywall-precio-v7-375.png
Screenshot paso 1: docs/revisiones/paywall-valor-prueba-375.png
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

## Detalle
Usabilidad — h1:3 h2:3 h3:4 h4:3 h5:4 h6:3 h7:3 h8:3 h9:3 h10:4
Craft — jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Copy — idea:3 especificidad:3 emoción:3 oferta:3 acción:4
Gate de carga cognitiva: 0 fallas de 8 (sin sobrecarga).
CTA héroe vivo: 4/4 (contraste acento sobre base >3:1 · whileTap 0.97 · nunca disabled por
defecto, solo tras el click · h-14 = 56px, ancho completo).
Anclas de conversión: titular con énfasis ✓ · hairline degradé en ambos pasos ✓ · chips SVG sin
emojis ✓ · secciones distinguibles: parcial (el pie del paso 2 vive todo en el mismo plano).
Sub-checks de copy: garantía nombrada con plazo junto al CTA ✓ · message-match: sin dato de
creativo de origen (no penaliza).

## Verificación de los 5 fixes declarados
1. Marcador sobre UNA palabra ("WhatsApp") — VERIFICADO en page.tsx L338 y en el render: trazo
   entero en un renglón. Queda un desvío vertical (ver defecto 3).
2. "US$30.88 al año" en el badge — VERIFICADO (L366-368).
3. Franja de confianza en dos renglones sin "·" colgante, mecánica a 13px/secondary —
   VERIFICADO (L455-467), sin huérfano en el render.
4. setTimeout en useRef, limpiado al desmontar y al reintentar, umbral 6s — VERIFICADO
   (L90-92, L127-131).
5. Badge a fondo acento 14% + texto acento, sin sombra — VERIFICADO (L366); el acento pleno
   queda solo en el CTA.
Los 5 están efectivamente atacados. Lo que baja el puntaje ahora es material nuevo, no lo anterior.

Top defectos:
1. [Paso 2 — tercio inferior, de los 3 beneficios a Términos] Seis bloques seguidos entre 11 y
   14px sin jerarquía: garantía, mecánica, CTA, aviso de renovación, "Ahora no · ¿Dudas?" y la
   fila legal se leen como un muro de letra chica que entierra el CTA → subir la garantía a
   15px/600, dejar la mecánica en UNA línea y fusionar "Ahora no · ¿Dudas?" con la fila legal.
2. [Paso 2 — tarjetas de precio y "Pago seguro"] Precio solo en US$ para un comprador
   colombiano, contra la propia FICHA-MERCADO ("precios comunicados también en referencia COP"),
   y la pasarela no se nombra pese a que la objeción 5 del avatar la pide → añadir "≈ $X COP" bajo
   el total anual y nombrar la pasarela junto al candado.
3. [Paso 2 — subrayado de "WhatsApp" en el titular] El marcador (dispositivo ownable de la
   FICHA-ARTE) queda ~6px por debajo de las letras y se lee como una barra flotante, no como un
   subrayado → anclar el gradiente a la baseline (background-position: 0 calc(100% - 0.14em))
   en vez del borde inferior de la caja inline.
4. [Paso 2 — toda la vista salvo las 2 tarjetas de plan] El stagger de entrada solo anima las
   tarjetas de precio; titular, filas de beneficio, franja de confianza y CTA aparecen de golpe,
   así que la pantalla se ve medio animada (el paso 1 sí escalona todo) → aplicar el mismo helper
   `entrada(i)` del paso 1 a los bloques del paso 2.
5. [Paso 2 — tarjeta Mensual y grupo de planes] La tarjeta Mensual no muestra su total anual
   (US$119.88), así que el ahorro del badge hay que creerlo en vez de compararlo; y el
   `role="radiogroup"` no tiene navegación por flechas ni el aviso de fallo usa `role="alert"` →
   añadir "US$119.88 al año" a la Mensual, onKeyDown con flechas en el radiogroup y subir el
   error a `role="alert"`.
