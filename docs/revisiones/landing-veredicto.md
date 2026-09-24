# VEREDICTO revisor-visual — landing (ronda 16)
Fecha: 2026-09-24 22:00
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
→ LISTA. El cambio de video no altera ningún puntaje: la sección mejora en claridad de la
demostración y no introduce ningún defecto visible.

Screenshot de la sección revisada: docs/revisiones/landing-como-funciona-375.png

## Revalidación de "Cómo funciona" tras el video nuevo
- La captura muestra un momento REAL y legible del mecanismo: la foto del recibo ("Transferencia
  exitosa · $138.500 · Uniformes del colegio · No. 8842-1190") encuadrada sobre el formulario, con
  el puntero visible. Se entiende qué está pasando sin leer nada. Es mejor demostración que la
  anterior: antes se veía un formulario quieto, ahora se ve la ACCIÓN que el paso 01 promete.
- Marcas remapeadas y copy sincronizado con lo que se ve: 0:06 / 0:12 / 0:21 en app\page.tsx,
  coherentes con un montaje de 24 s. Los tres pasos siguen ARRIBA y el video debajo como prueba.
- Burbuja del hero con `useReducedMotion` — defecto 3 de la r15: VERIFICADO y cerrado.
- Sin cambios en el resto de la página: lo verificado en la r15 sigue vigente.

Defectos vivos (ninguno bloquea el gate; ordenados por impacto):
1. [Hero y Oferta — PRUEBA] Cero prueba social real en toda la página: ni un testimonio, ni un
   número de clientes. Es el techo de conversión de esta landing → franja de testimonios bajo el
   hero y uno junto al precio en cuanto haya 2-3 clientes reales. En pausa por decisión del dueño.
2. [Oferta — stack] El ancla "US$120" no corresponde a ningún precio publicado de Coparentia:
   claim sin respaldo para el gate de integridad (61) → sustituirlo por el costo evitado ya
   documentado ("US$100 por cada correo de aclaración del abogado") o publicar el precio que lo
   sostenga.
3. [Cómo funciona — arranque del video] `Solucion.tsx` sigue con `const INICIO = 2.4` y el comentario
   "los primeros segundos son la app cargando", escritos para la grabación ANTERIOR. Con el montaje
   nuevo (24 s, marcas corridas de 0:03→0:06) ese número no se revalidó: si el tramo inicial cambió,
   el video arranca en un punto arbitrario y `onEnded` reinicia ahí → medir el nuevo punto de
   entrada y, mejor, pasarlo como prop del `demo` en vez de dejarlo fijo en el componente.
4. [Cómo funciona — pie del video] El montaje acelera la espera del expediente a 6x y el resto a
   1.2x, pero el pie solo dice "Grabado de la app real, con datos de ejemplo" → añadir "la espera va
   acelerada": es la diferencia entre una demo honesta y una que promete una velocidad que el
   producto no tiene (61).
5. [Cómo funciona — paso 01] "Le tomas la foto" deja el referente ("al recibo") para la línea
   siguiente → "Le tomas la foto al recibo" o "Tomas la foto del recibo".
6. [Oferta — card del plan] Seis tamaños de texto conviven en la tarjeta (36/18/15/13/12/11), por
   encima de los 3 por pantalla del sistema; es lo que mantiene el eje de jerarquía en 3.

Verificado OK en esta ronda: demostración legible del mecanismo desde el primer cuadro, sin chrome
nativo, con mando del kit de 44px fuera de la grabación; marcas de tiempo interactivas (44px de área
táctil, `aria-label`, scroll al video) sincronizadas con el montaje nuevo; lectura pasos → prueba →
CTA; barra fija con label correcto antes de la oferta, que se esconde ante cualquier CTA y compensa
su alto solo en celular; precios estáticos y correctos (US$7.42 / US$9.99); ningún número animado
que sea promesa o precio; celebración única de la garantía y burbuja del hero, ambas con
reduced-motion; alternancia de superficies en las 10 secciones; copy trazado a FICHA-AVATAR con
garantía NOMBRADA y plazo junto al CTA; tokens fieles a FICHA-ARTE (Figtree/Nunito Sans, #2F6FDC,
radios 22/999, blobs orgánicos, cero emojis como íconos).
