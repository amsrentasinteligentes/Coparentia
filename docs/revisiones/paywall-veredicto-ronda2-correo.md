# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 2
Fecha: 2026-10-09 15:00
Screenshot: docs/revisiones/paywall-correo-error-casilla-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Bloque entre formulario y botón fijo, aún vivo] Siguen apilados: hairline, "Ver condiciones de la devolución", garantía + pago seguro, botón, microcopy y 4 enlaces de pie. Garantía aparece dos veces (resumen y desplegable separados). Fix: fusionar "condiciones" con la línea de garantía y bajar el pie legal fuera del primer scroll.
2. [Enlace "Ya pagué con otro correo" + aviso "Entraste con X"] Decisión del dueño, se respeta el enlace. Pero en el screenshot el aviso y el enlace conviven y duplican el mismo mensaje; "Cerrar sesión y entrar con el correo de la compra" sigue sin confirmación (código, onCerrarSesion) y el panel se abre sin animación. Fix: confirmar el cierre de sesión o pedir un toque extra; animar la apertura con motion.
3. [Campo "Tu correo" con sesión] El campo sigue editable: ahora avisa pero no previene el desajuste (h5 sube a 3, no a 4). Además el correo de sesión se precarga con un efecto y el efecto de localStorage puede pisarlo (carrera). Fix: priorizar el correo de sesión sobre el guardado, o mostrarlo como línea fija con "Cambiar".
4. [Aviso, error y panel nuevos] Entran sin animación (código: sin motion en errorCorreo, aviso ni details). Fix: AnimatePresence con fade+y 8px y reduced-motion.
5. [Copy del formulario] Sigue sin decir POR QUÉ se pide el correo antes de pagar (solo "usa el mismo correo"), y las condiciones reales de la garantía siguen ocultas en un desplegable. Fix: "Así tu compra queda a tu nombre y entras sin pasos extra".

Corregido desde la ronda 1: casilla propia con acento del kit, borde rojo en error y foco a la casilla (verificado en captura); aviso en línea de correo distinto (verificado en captura); pie sin puntos huérfanos (verificado solo por código: la captura termina antes del pie, no hay captura de ese tramo).

Notas del revisor:
- Gate de carga cognitiva: 1 falla (ruido previo al CTA), no crítica. Una acción primaria.
- CTA héroe vivo: cumple los 4 (contraste, whileTap, nunca disabled salvo durante la salida, 48px ancho completo).
- Fichas: azul #2F6FDC, Figtree/Nunito Sans, coherente con FICHA-ARTE; sin desvío.
- No hay captura del teclado abierto ni del botón fijo con el formulario a media pantalla.
- Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3. Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3. Copy: idea 3 · especificidad 3 · emoción 3 · oferta 3 · acción 4.
