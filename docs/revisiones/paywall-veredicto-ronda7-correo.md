# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 7
Fecha: 2026-10-09 20:00
Screenshot: docs/revisiones/paywall-correo-ronda7-375.jpg
Usabilidad: 35/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Fila de chips "Garantía de 15 días" / "Pago seguro Hotmart"] Dos chips idénticos (mismo fondo, 44px, mismo peso), pero solo el primero es tocable: el segundo parece botón y no hace nada (elemento que aparenta interactivo, regla UX 11). Fix: diferenciar el chip no tocable (sin fondo de pastilla, solo ícono + texto) o hacerlo informativo con enlace a la política de Hotmart.
2. [Bloque inferior: microcopy "Hoy no pagas nada..." + fila "Ahora no / ¿Dudas?" + "Términos · Privacidad"] Tres filas centradas seguidas con tinta casi idéntica (14px primaria, 14px primaria, 13px gris): la subida de "Ahora no" lo aplana contra el aviso de cobro en vez de separarlo. Fix: aviso de cobro 13px secundario o en negrita corta, y salidas con aire propio (24px) o estilo enlace distinto.
3. [Panel "Ya pagué con otro correo" abierto] Sigue siendo el tramo más denso (frase + botón + Cancelar + enlace de soporte, dentro de un bloque hundido grande) y empuja chips y CTA hacia abajo. Fix: dejar solo "Cerrar mi sesión" + "Cancelar" y mover el soporte a una línea de 13px bajo la frase.
4. [Enlace "Ya pagué con otro correo", 13px] Es el único acceso a un flujo de pago crítico y pesa lo mismo que la ayuda de la casilla. Fix: 14px y separarlo 8px más de la casilla.
5. [Captura] Solo muestra el tramo inferior con panel abierto; el estado cerrado y la parte superior (titular, planes, beneficios) no se re-puntuaron en imagen. Fix: entregar captura completa con scroll al inicio y panel cerrado.

Corregido desde la r6 (verificado en captura y código): una sola acción primaria azul (Cerrar mi sesión ahora secundario con borde, Cancelar como texto); fila de confianza única con dos chips de 44px y condición en una línea; 16px de aire antes del botón; Ahora no y Dudas a 14px en tinta primaria.

Para llegar a 36/40 y 16/20 faltan +1 en usabilidad y +1 en craft. Usabilidad: h4 (3 a 4) resolviendo el defecto 1 (chip que parece tocable sin serlo) o h6 (3 a 4) con el defecto 4. Craft: +1 en jerarquía con el defecto 2 (niveles aviso de cobro / salidas / legales con peso distinto) o +1 en encaje con el defecto 1.

Notas del revisor:
- Usabilidad: h1:3 h2:3 h3:4 h4:3 h5:4 h6:3 h7:3 h8:4 h9:4 h10:4 (suma 35; la r6 declaraba 35 con una suma real de 34). Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3. Copy: idea 3 · especificidad 4 · emoción 3 · oferta 4 · acción 4.
- h8 sube a 4: un solo botón azul por vista; la densidad residual solo aparece con el panel abierto (decisión del dueño).
- Gate de carga cognitiva: 1 falla (chip no tocable con apariencia interactiva); no crítica.
- CTA héroe vivo: cumple los 4 (whileTap, habilitado salvo durante el envío, 48px+ ancho completo, contraste azul/blanco; validación al toque con mensaje y foco en el campo).
- Código verificado: role="alert" en errores de correo y de pago, botones del panel disabled mientras sale la sesión, useReducedMotion en componentes con motion, conteo animado del precio, stagger en planes. Sin atajos de teclado salvo flechas del radiogroup; sin celebración de hito (no aplica en este paso).
- Fichas: azul del kit, Figtree/Nunito Sans, radios coherentes; sin desvío de FICHA-ARTE. No coincide con los kits vetados.
- Garantía con plazo (15 días) junto al CTA: pasa el sub-check de garantía nombrada.
- Se respetan por decisión del dueño el enlace "Ya pagué con otro correo" y la casilla de autorización no premarcada.
