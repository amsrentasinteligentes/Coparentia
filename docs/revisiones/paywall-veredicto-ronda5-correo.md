# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 5
Fecha: 2026-10-09 18:00
Screenshot: docs/revisiones/paywall-correo-ronda5-375.jpg
Usabilidad: 34/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Estado "Cambiar" activado, entre casilla y "Ya pagué con otro correo"] El aviso "Entraste con otro.correo@... Si pagas con otro correo, después tendrás que entrar con ese" y el panel abierto repiten "Entraste con otro.correo@..." casi literal, a ~100px de distancia. Fix: con el panel abierto ocultar el aviso en línea (o fusionarlos en uno).
2. [Panel "Ya pagué con otro correo" abierto] Sigue siendo la zona más pesada: 2 líneas + pregunta + 2 botones de 44px + enlace de soporte subrayado en tinta oscura. Pesa más que el CTA al abrirse. Fix: quitar "¿Cerramos tu sesión?" (el botón ya lo dice) y bajar el soporte a gris 13px sin subrayado fuerte.
3. [Tramo entre "Tu correo" y el botón] Ayuda, casilla, enlace, garantía, "Pago seguro" y pie son 13-14px gris del mismo peso; no se leen 4 niveles hasta el CTA. Fix: garantía + "Pago seguro" en una sola fila de confianza y superficie hundida o más separación para el microcopy de cobro.
4. [Garantía "Garantía de 15 días · Ver condiciones"] Cabe en una línea, pero plazo y vía de devolución siguen tras el desplegable. Fix: "Garantía de 15 días · devolución por Hotmart" visible; "Ver condiciones" solo para el detalle.
5. [Pie de dos filas] "Términos · Privacidad" queda como segunda fila gris casi invisible, con ~100px de hueco bajo el microcopy. Fix: hueco entre filas de 16px y misma jerarquía en ambas.

Corregido desde la ronda 4 (verificado en captura): panel recortado, pie en dos filas, casilla en 2 líneas con enlace entero, garantía en una línea, "US$89 al año" en semibold.
No verificado visualmente: scroll al abrir el panel (código: scrollIntoView con delay) y el estado con panel cerrado a media altura.

Para llegar a 36/40 y 16/20 faltan +2 en usabilidad y +1 en craft. Usabilidad: h8 (3 a 4) con los fixes 1 y 2 y h10 (3 a 4) con plazo y vía de la garantía visibles. Craft: +1 en jerarquía (fix 3) o encaje (fix 5). Copy 17/20 pasa el umbral y ningún eje queda en 2.

Notas del revisor:
- Gate de carga cognitiva: 1-2 fallas (texto repetido, controles secundarios antes del CTA); no crítica. Una acción primaria.
- CTA héroe vivo: cumple los 4 (contraste, whileTap 0.97 en código, habilitado hasta iniciar request con hint al clic, 48px+ ancho completo).
- Código: role="alert" en errores, botones del panel disabled mientras sale la sesión, useReducedMotion presente, scrollIntoView presente. Sin atajos de teclado verificados (h7).
- Fichas: azul del kit, Figtree/Nunito Sans, radios coherentes; sin desvío de FICHA-ARTE.
- Usabilidad: h1:3 h2:3 h3:4 h4:3 h5:4 h6:3 h7:3 h8:3 h9:4 h10:3. Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3. Copy: idea 3 · especificidad 4 · emoción 3 · oferta 4 · acción 3.
- Se respetan por decisión del dueño el enlace "Ya pagué con otro correo" y la casilla no premarcada.
