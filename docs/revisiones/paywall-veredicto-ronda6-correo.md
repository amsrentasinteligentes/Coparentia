# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 6
Fecha: 2026-10-09 19:00
Screenshot: docs/revisiones/paywall-correo-ronda6-375.jpg
Usabilidad: 35/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Panel "Ya pagué con otro correo" abierto, botón "Cerrar mi sesión"] Es un botón relleno azul del mismo color y casi el mismo tamaño que el CTA "Empezar mis 7 días gratis" a ~150px: dos primarias azules compiten en la misma vista. Fix: volverlo secundario (borde/tinta, sin relleno) o dar el relleno solo al CTA; "Cancelar" como texto.
2. [Línea "Garantía de 15 días: si no te sirve, te devolvemos todo"] Es tocable (enlaza a /reembolsos) pero se ve como texto gris plano: sin subrayado ni flecha, nadie sabe que hay condiciones. Además la vía de devolución no se nombra. Fix: subrayado suave o chevron + "por Hotmart".
3. [Tramo casilla -> enlace -> panel -> garantía -> pago seguro -> CTA] Garantía y "Pago seguro" siguen en dos filas centradas de distinto ancho y peso gris idéntico al microcopy; los niveles texto-ayuda / confianza / cobro casi no se separan. Fix: una sola fila de confianza (dos chips iguales) y 16px más de aire antes del botón.
4. [Panel abierto] Sigue siendo el bloque más denso de la pantalla (2 frases + 2 botones + enlace) aunque ya sin repetición. Fix: acortar a una frase ("Entraste con X. Para pagar con otro correo, cierra sesión y entra con ese.").
5. [Pie] Dos filas bien resueltas, pero "Ahora no" y "¿Dudas? Escríbenos" tienen el mismo peso que Términos/Privacidad. Fix: "Ahora no" un nivel más legible que los legales.

Corregido desde la r5 (verificado en captura): aviso duplicado oculto con el panel abierto, "¿Cerramos tu sesión?" eliminado, soporte en gris 13px, desplegable de condiciones eliminado (garantía en una línea visible), pie sin hueco entre filas.

Para llegar a 36/40 y 16/20 faltan +1 en usabilidad y +1 en craft. Usabilidad: h8 (3 a 4) con el fix 1 (una sola primaria azul). Craft: +1 en jerarquía (fix 1 y 3) o en encaje (fix 3).

Notas del revisor:
- Usabilidad: h1:3 h2:3 h3:4 h4:3 h5:4 h6:3 h7:3 h8:3 h9:4 h10:4. Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3. Copy: idea 3 · especificidad 4 · emoción 3 · oferta 4 · acción 4.
- Gate de carga cognitiva: 1 falla (controles secundarios antes del CTA); no crítica.
- CTA héroe vivo: cumple los 4 (whileTap 0.97, habilitado, 48px+ ancho completo, contraste azul/blanco).
- Código verificado: role="alert" en errores de pago, botones del panel disabled mientras sale la sesión, useReducedMotion en el componente, whileTap en CTA. h7 sin atajos de teclado.
- Fichas: azul del kit, Figtree/Nunito Sans, radios coherentes; sin desvío de FICHA-ARTE.
- Garantía con plazo (15 días) ya junto al CTA: pasa el sub-check de garantía nombrada.
- No verificado: la captura solo muestra el tramo inferior (estado con panel abierto); el estado con panel cerrado y la parte superior del precio no se re-puntuaron en imagen.
- Se respetan por decisión del dueño el enlace "Ya pagué con otro correo" y la casilla no premarcada.
