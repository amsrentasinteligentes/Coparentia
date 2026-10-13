# VEREDICTO revisor-visual — landing (ronda: frase del monto en pesos separada en su propia línea)
Fecha: 2026-10-10 13:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) Sin prueba social real en toda la página (techo de conversión; en pausa por decisión del dueño). 2) Tarjeta Anual: la jerarquía de las dos líneas pequeñas quedó invertida, "Se cobra al terminar la prueba." (dato que decide la compra) está en 12px terciario y la frase de Hotmart (aclaración secundaria) en 13px secundario, más visible; además "Se cobra" sigue repetido justo bajo "Se cobra US$89 al año" → fusionar la primera con el total ("US$89 al año, se cobra al terminar la prueba") o igualar ambas en 13px secundario. 3) Tamaños de texto en la tarjeta de plan: ahora 36/18/15/14/13/12/11 más el 13 nuevo con otro color, muy sobre el tope de 3 → reducir a 4 usando el mismo tamaño para las líneas de apoyo. 4) "Hoy no pagas nada. Después: US$89..." del stack y la línea bajo el CTA dicen lo mismo dos veces en la misma sección → quitar una. 5) Pie del video de "Cómo funciona": ícono centrado contra dos líneas → items-start.

Detalle usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:4 especificidad:3 emoción:4 oferta:3 acción:3

Gate doble: usabilidad 36 (sin margen) · craft 16 (sin margen) · copy 17 (ningún eje <=2). LISTA por el mínimo; sin margen.

## Verificación de esta ronda
- Evidencia visual: docs/revisiones/frase-hotmart-landing-escritorio.jpg es captura de ESCRITORIO, recortada; el comportamiento a 375px (2 renglones sin desborde) no está capturado en esta ronda y no lo pude ver; se afirma solo por el código (text-[13px] leading-[1.45], sin ancho fijo). El resto de la página se hereda del veredicto anterior (sin cambios declarados).
- Código verificado en components/landing/Oferta.tsx líneas 160-165: dos párrafos separados, el segundo con FRASE_MONTO_HOTMART en text-secondary, 13px / lg:14px. Redacción del dueño intacta.
- Contraste: la frase pasa de terciario (límite AA) a secundario, mejora real y visible en la captura.

## ¿Mejora o empeora la jerarquía de la tarjeta?
Mixto, neto ligeramente negativo para la jerarquía y positivo para la legibilidad. Mejora: la frase es legible y ya no se parte como párrafo pegado. Empeora: hay un renglón más de dinero/cobro, y el orden de importancia quedó al revés (la línea menos crítica pesa más que "se cobra al terminar la prueba"); el ojo ve tres escalones grises seguidos bajo el total (12, 13) antes de llegar al ahorro en 15px acento. No baja la nota de craft porque el total semibold sigue dominando, pero el defecto 2 queda abierto. Corregirlo lo resolvería.
