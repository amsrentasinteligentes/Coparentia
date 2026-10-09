# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 3
Fecha: 2026-10-09 16:00
Screenshot: docs/revisiones/paywall-correo-ronda3-375.jpg
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Zona entre el formulario y el botón fijo] Siguen apilados: hairline, "Ver condiciones de la devolución", garantía + pago seguro, botón, microcopy de cobro y 4 enlaces de pie. La garantía se dice dos veces (desplegable y línea de sello) y el desplegable separa las condiciones del nombre. Defecto que YA existía; el formulario lo agravó al empujar este bloque más abajo. Fix: fusionar en una sola línea "Garantía del Primer Expediente · 15 días · Ver condiciones" y bajar "Ahora no / Términos / Privacidad" fuera del primer scroll o a una sola línea.
2. [Panel "Ya pagué con otro correo" abierto] Sigue habiendo 3 bloques de formulario + enlace + panel con 2 acciones antes del botón (carga cognitiva alta, 3 de 8 fallas del gate). El panel afirma como hecho "tu compra quedó a nombre de otro correo" sin saberlo; la confirmación de cierre de sesión es un enlace subrayado que cambia de texto largo (sin botón ni opción de cancelar visible) y el estado de confirmación no se reinicia al cerrar el panel (código: confirmaSalir). Fix: texto condicional ("Si pagaste con otro correo, ...") y confirmación como botón secundario con "Cancelar" al lado; resetear confirmaSalir al cerrar el panel.
3. [Texto de ayuda de "Tu correo"] El porqué ya está, pero ocupa 3 líneas a 13px antes de un campo de una línea y compite con la casilla de 3 líneas: ~6 líneas de texto para 2 controles. Fix: recortar a "Usa el mismo correo para pagar y entrar: tu compra queda a tu nombre." (2 líneas).
4. [Scroll al abrir el panel] La corrección (e) no está verificada por captura: la captura está tomada con la página al final de su scroll, así que no prueba que el panel no quede bajo el botón fijo con la página a media altura. Es del código (setTimeout 80ms + scrollIntoView center), plausible, no demostrado. Fix: capturar a 375x667 con el panel recién abierto y la página a media altura.
5. [Jerarquía de la zona inferior] Casi todo es 13px gris (ayuda, casilla, enlaces, condiciones, garantía, microcopy de cobro): el nivel "label" domina el tramo final y el "qué sigue" depende solo del botón. Fix: subir el microcopy de cobro a 14px/text-primary o ponerlo sobre superficie hundida para separarlo del resto.

Corregido desde la ronda 2 (verificado): correo de sesión gana al guardado salvo que la persona ya haya escrito (código: correoTocado + efecto asíncrono posterior; captura muestra el correo de sesión en el campo); texto de ayuda con el porqué (captura); confirmación en cierre de sesión (código); fade + 8px con reduced-motion en error, aviso y panel (código: AnimatePresence con y=0 si reduce; el desplegable de garantía sigue sin animar, es nativo). No verificado visualmente: el tramo de pie bajo el microcopy (la captura termina antes de los 4 enlaces).

Para llegar a 36/40 y 16/20: faltan +5 en usabilidad y +1 en craft. Usabilidad: h8 (3 a 4) y h6/h10 no suben mientras el bloque 1 y el panel 2 sigan; realistamente +5 exige que bajen a 4 al menos h1, h3, h5, h8 y h10: h3 con confirmación de botón + cancelar, h5 con el campo de correo de sesión bloqueado con "Cambiar" en lugar de editable con aviso, h8 fusionando garantía/condiciones y sacando el pie legal del tramo previo al botón, h10 con las condiciones de la garantía visibles en una línea (plazo y vía: escribir a soporte), h1 con feedback inmediato al abrir/cerrar el panel y a "Cerrar sesión" (hoy tras confirmar no hay estado de espera mientras signOut). Craft: +1 en jerarquía (defecto 5) o en identidad/encaje basta para 16/20; copy ya está en 16/20 y no es el cuello.

Notas del revisor:
- Gate de carga cognitiva: fallas = (a) más de 4-5 elementos antes de pedir acción en la zona del formulario, (b) enlaces/controles secundarios múltiples antes del CTA, (c) texto por bloque > 3 líneas (ayuda y casilla). 3 fallas, no crítica. Una acción primaria.
- CTA héroe vivo: cumple los 4 (contraste, whileTap vía CtaFunnel, habilitado hasta arrancar el request y valida al clic con hint, 48px ancho completo).
- Fichas: azul del kit, Figtree/Nunito Sans, radios coherentes; sin desvío. El panel hundido (superficie-2) y el campo redondeado completo (pill) frente a radio-button de la casilla es leve desajuste de radios: campo pill en captura vs tarjetas de plan con radio-card.
- Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:4 h10:3. Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3. Copy: idea 3 · especificidad 3 · emoción 3 · oferta 3 · acción 4.
- El enlace "Ya pagué con otro correo" se respeta como decisión del dueño; no se penaliza su existencia, sí su carga visual (defecto 2).
