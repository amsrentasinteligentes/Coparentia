# VEREDICTO revisor-visual — landing (ronda hallazgo 4: cifras de precio y día de cobro)
Fecha: 2026-10-10 12:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) Sin prueba social real en toda la página (techo de conversión; en pausa por decisión del dueño). 2) Tarjeta Anual: la línea de 12px "Se cobra al terminar la prueba · El monto final en tu moneda lo calcula Hotmart al pagar." repite "Se cobra" justo bajo "Se cobra US$89 al año", baja a dos renglones en gris terciario (4.5:1, límite AA) y nombra "Hotmart" a una persona que aún no sabe quién es → acortar a "Cobro al terminar la prueba. Hotmart lo convierte a tu moneda al pagar." y subirla a text-secondary. 3) Siete tamaños de texto conviven en la tarjeta de plan (36/18/15/14/13/12/11), sobre el tope de 3 del sistema; mantiene jerarquía en 3. 4) El texto "Hoy no pagas nada. Después: US$89..." del stack y la línea bajo el CTA dicen lo mismo dos veces en la misma sección → quitar una. 5) Pie del video de "Cómo funciona": ícono centrado contra dos líneas → items-start.

Detalle usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:4 especificidad:3 emoción:4 oferta:3 acción:3

Gate doble: usabilidad 36 (>=36, sin margen) · craft 16 (>=16, sin margen) · copy 17 (>=16, ningún eje <=2). LISTA por el mínimo; no es un sobresaliente.

## Verificación de esta ronda
- Fuente única de cifras CONFIRMADA en código: lib/precios.ts alimenta app/page.tsx (hero, stack, tarjetas, PS) y components/landing/Oferta.tsx. Día 8 consistente en hero, ambas tarjetas y PS (TRIAL_DIAS + 1). Solo verificado en el código de la landing y la baldosa de la captura; la coincidencia con el paywall y con el checkout real de Hotmart NO la pude verificar desde aquí.
- Captura de Planes (hallazgo4-landing-oferta-375.jpg, mosaico 2x2, baldosa superior izquierda): sin desborde, badge, precio, línea de cobro, 5 checks custom, CTA de ancho completo y aviso del día 8 legibles.
- Defecto previo 2 (ancla "US$120" sin respaldo): RESUELTO. El tachado ahora es US$119.88 = 12 x 9.99, rotulado "Pagando mes a mes"; es un precio publicado, ya no un valor inventado.
- Eliminar la conversión propia a pesos: acierto de integridad (una cifra distinta de la del checkout justo antes de ingresar la tarjeta es peor que no tenerla).
- Isotipo gris metálico: decisión del dueño, no se puntúa como defecto.
- Defectos previos 1, 3 y 4 siguen vivos (arriba).

## Sobre la frase del monto en pesos
Suma honestidad, resta un poco de claridad. Suma: evita prometer una cifra que cambia a diario. Resta: es la cuarta línea de dinero de la tarjeta, en 12px gris, y el lector con ansiedad por el costo se queda sin la cifra en su moneda justo donde la busca; además repite "Se cobra" y usa un nombre propio (Hotmart) sin presentarlo. Mantenerla, pero acortada y en text-secondary (ver defecto 2).
