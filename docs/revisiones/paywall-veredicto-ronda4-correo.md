# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 4
Fecha: 2026-10-09 17:00
Screenshot: docs/revisiones/paywall-correo-ronda4-375.jpg
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Bloque entre "Tu correo" y el botón, con panel abierto] Siguen apilados campo fijo, casilla de 3 líneas, enlace, panel de 6 líneas de texto + 2 botones + enlace de soporte, línea de garantía, "Pago seguro", botón y microcopy de 2 líneas. Gate de carga cognitiva: 2 fallas (texto por bloque >3 líneas en casilla y panel; varios controles secundarios antes del CTA). El panel tiene 3 acciones (cerrar sesión, cancelar, soporte) y pesa más que el CTA al abrirse. Fix: recortar el panel a 2 líneas ("Si pagaste con otro correo, entra con ese: ¿cerramos tu sesión?") y mover "Escribir a soporte" a "¿Dudas? Escríbenos" del pie.
2. [Pie: Ahora no / ¿Dudas? Escríbenos / Términos / Privacidad] Cuatro enlaces de 13px en una sola fila, apretados al ancho (casi sin separación entre ellos), justo bajo el microcopy. Compite con el CTA como "salida" y roza el límite de área táctil. Fix: separar "Ahora no" (a la izquierda) de los legales (a la derecha) en dos líneas, con 16px de aire y 44px de alto táctil.
3. [Jerarquía del tramo inferior] El microcopy de cobro ya sube a 14px/tinta primaria y funciona, pero ayuda, casilla, garantía, panel y pie siguen siendo 13-14px grises del mismo peso: no hay 4 niveles nítidos en el tramo previo al botón. Fix: poner "Hoy no pagas nada · Primer cobro día 7: US$89 al año" con "US$89" en semibold y reducir el peso del resto, o sobre superficie hundida.
4. [Línea de garantía] Fusionada bien (escudo + nombre + 15 días + Ver condiciones), pero rompe a dos líneas dejando "Ver condiciones" huérfano con la flecha, centrado bajo el texto. Fix: acortar a "Garantía del Primer Expediente · 15 días" y dejar "Ver condiciones" como segunda línea deliberada, o reducir el gap para que quepa en una.
5. [Ayuda y casilla] Ayuda de 2 líneas (correcto, mejora clara) pero la casilla sigue en 3 líneas con "Política de Privacidad" partida entre líneas. Fix: "Autorizo guardar mi correo para vincular mi compra, según la Política de Privacidad." (2 líneas; el contacto sobre la suscripción puede ir en la política).

Corregido desde la ronda 3 (verificado en captura y código): garantía dicha una sola vez; ayuda recortada con el porqué; correo de sesión fijo con "Cambiar" (captura; el campo editable no se ve en esta imagen); texto condicional del panel; confirmación como botones "Sí, cerrar sesión" / "Cancelar" con estado "Cerrando sesión…" y disabled mientras corre (código: saliendo); pie visible; microcopy de cobro a 14px.
No verificado: el scroll al abrir el panel a media altura (la captura sigue tomada al final del scroll) y el estado "Cambiar" ya activado con aviso de correo distinto.

Para llegar a 36/40 y 16/20 faltan +3 en usabilidad y +1 en craft. Usabilidad: h8 (3 a 4) con los fixes 1 y 2 y h6 (3 a 4) quitando la carga del panel; h10 (3 a 4) con las condiciones de la garantía visibles en una línea (plazo y vía) sin abrir el desplegable. Craft: +1 en jerarquía (fix 3) o encaje (fixes 2, 4 y 5) basta para 16/20. Copy 17/20 ya pasa el umbral de 16 y ningún eje queda en 2.

Notas del revisor:
- Gate de carga cognitiva: 2 fallas, no crítica. Una acción primaria.
- CTA héroe vivo: cumple los 4 (contraste claro, whileTap 0.97, habilitado hasta arrancar el request con validación al clic y hint, 48px+ ancho completo).
- Fichas: azul del kit, Figtree/Nunito Sans, radios coherentes (campo pill y casilla; botones del panel con radio de botón); sin desvío de FICHA-ARTE.
- Usabilidad: h1:3 h2:3 h3:4 h4:3 h5:4 h6:3 h7:3 h8:3 h9:4 h10:3. Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3. Copy: idea 3 · especificidad 4 · emoción 3 · oferta 4 · acción 3.
- Se respetan por decisión del dueño el enlace "Ya pagué con otro correo" y la casilla no premarcada.
