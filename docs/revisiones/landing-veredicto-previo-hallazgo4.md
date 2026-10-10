# VEREDICTO revisor-visual — landing (ronda 16.1)
Fecha: 2026-09-24 23:30
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

Detalle usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:4 especificidad:3 emoción:4 oferta:3 acción:3

Gate doble: usabilidad 36 ✓ (≥36) · craft 16 ✓ (≥16) · copy 17 ✓ (≥16, ningún eje ≤2).
→ LISTA. Cierre de la tanda: la página puede publicarse. Es un aprobado justo, no un
sobresaliente; lo que la subiría de nivel está en los defectos 1 y 2, que son decisión del dueño.

Screenshot de la sección revisada: docs/revisiones/landing-como-funciona-375.png

## Verificación de los 3 cierres de esta ronda
3. `INICIO` heredado — CERRADO: `demo?.inicioSeg ?? 0` con la prop declarada en el tipo de `demo`,
   comentario reescrito para el montaje v2 y `alEmpezar`/`alTerminar`/`irA` usando el mismo valor.
   Ya no hay número mágico atado a una grabación que no existe.
4. Pie honesto — CERRADO y visible en la captura: "Grabado de la app real, con datos de ejemplo. La
   espera del PDF va acelerada." La demo ya declara lo que acelera.
5. Paso 01 — CERRADO: "Le tomas la foto al recibo" · 0:06 · "Desde tu teléfono, como cualquier
   foto." El referente está en el título y el detalle aporta información nueva en vez de repetirlo.

Defectos vivos (ninguno bloquea el gate; ordenados por impacto):
1. [Hero y Oferta — PRUEBA] Cero prueba social real en toda la página: ni un testimonio, ni un
   número de clientes. Es el techo de conversión de esta landing → franja bajo el hero y uno junto
   al precio en cuanto haya 2-3 clientes reales. En pausa por decisión del dueño (correcto:
   inventarlos sería peor que no tenerlos).
2. [Oferta — stack] El ancla "US$120" no corresponde a ningún precio publicado de Coparentia:
   claim sin respaldo para el gate de integridad (61) → sustituirlo por el costo evitado ya
   documentado ("US$100 por cada correo de aclaración del abogado") o publicar el precio que lo
   sostenga. Decisión del dueño, pero conviene resolverlo ANTES de pautar.
3. [Oferta — card del plan] Seis tamaños de texto conviven en la tarjeta (36/18/15/13/12/11), por
   encima de los 3 por pantalla del sistema; es lo único que mantiene el eje de jerarquía en 3.
   Queda para la pasada de jerarquía aparte.
4. [Cómo funciona — pie del video] Ahora ocupa dos líneas y el ícono va centrado contra el bloque
   completo, así que queda a media altura entre ambas → `items-start` + 2px de margen superior en
   el ícono.
5. [Cómo funciona — demo] El marco de 220px mide ~430px de alto; va debajo de los 3 pasos y no
   estorba. Sin severidad.

Verificado OK en esta ronda: demostración legible del mecanismo (foto del recibo encuadrada, monto
que se llena solo) sin chrome nativo, con mando del kit de 44px fuera de la grabación; marcas
0:06/0:12/0:21 interactivas, con 44px de área táctil, `aria-label` y scroll al video, sincronizadas
con el montaje v2; punto de entrada parametrizado; lectura pasos → prueba → CTA; barra fija con
label correcto antes de la oferta, que se esconde ante cualquier CTA y compensa su alto solo en
celular; precios estáticos y correctos (US$7.42 / US$9.99); ningún número animado que sea promesa o
precio; celebración de la garantía y burbuja del hero con reduced-motion; alternancia de superficies
en las 10 secciones, todas pintadas en la captura completa; copy trazado a FICHA-AVATAR con garantía
NOMBRADA y plazo junto al CTA y el cobro del día 8 declarado; tokens fieles a FICHA-ARTE (Figtree/
Nunito Sans, #2F6FDC, radios 22/999, blobs orgánicos, cero emojis como íconos).
