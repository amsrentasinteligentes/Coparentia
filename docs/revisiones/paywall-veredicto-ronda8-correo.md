# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 8
Fecha: 2026-10-09 21:00
Screenshot: docs/revisiones/paywall-correo-ronda8-1-arriba-375.jpg
Usabilidad: 36/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Tramo medio: entre "Ya pagué con otro correo" y la línea divisoria, aprox. 60px de aire muerto] El ritmo vertical es irregular: la casilla, el enlace y la fila de confianza van sueltos con huecos distintos (16, 24, 56px) y no se leen como grupos. Fix: pasar a la escala 16/24/32; enlace a 16px de la casilla, y quitar o acortar el hueco previo al divisor para que "correo + casilla + enlace" sea un solo bloque.
2. [Primer pliegue: lista de beneficios cortada por el botón fijo, 3 filas a medio ver; sub-pastillas de precio] La primera captura corta el beneficio "Funciona aunque la otra persona no la use" a la mitad, y las dos pastillas de precio (anual con borde, mensual rellena) tienen alto y padding distintos. Fix: unificar la pastilla "Se cobra / Serían" (mismo alto, fondo y padding) y compactar los beneficios a 2 filas visibles sobre el botón.
3. [Titular, mancha azul tras "tu expediente"] La elipse tras el titular se ve como un manchón desalineado, no como dispositivo ownable. Fix: anclarla a un borde o a la palabra acentuada, o quitarla; la identidad queda sostenida solo por el azul del kit.
4. [Jerarquía de la zona inferior] Siguen compitiendo 5 textos de 13-14px en gris/primaria (ayuda del correo, casilla, garantía, microcopy de cobro, legales) sin un escalón claro entre ellos. Fix: subir un nivel solo el monto del cobro y bajar a 12px los legales; fusionar "Si no te sirve, te devolvemos todo." con la fila de garantía.
5. [Panel "Ya pagué con otro correo" abierto] Los dos enlaces del panel (soporte 13px gris; cerrar sesión subrayada) parecen iguales; la acción reversible y la que cierra sesión no se distinguen. Fix: dar al cierre de sesión peso 600 y mantener soporte como enlace gris secundario.

Corregido desde la r7 (verificado en captura y código): fila de confianza sin pastillas, solo "Garantía de 15 días" subrayada; aviso de cobro a 13px con monto en semibold; "Ahora no" y "¿Dudas?" con aire propio; panel más corto con soporte y cierre de sesión; enlace de pago a 14px; capturas completas de los cuatro estados.

Para llegar a 16/20 falta +1 en craft (usabilidad ya cumple 36). Opciones concretas: encaje 3 a 4 resolviendo los defectos 1 y 2 (ritmo vertical y pastillas de precio iguales), o jerarquía 3 a 4 con los defectos 3 y 4.

Notas del revisor:
- Usabilidad: h1:3 h2:3 h3:4 h4:4 h5:4 h6:3 h7:3 h8:4 h9:4 h10:4 (suma 36; h4 sube a 4 porque el elemento que parecía botón sin serlo ya no existe). Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3. Copy: idea 3, especificidad 4, emoción 3, oferta 4, acción 4.
- 36/40 queda justo en el umbral; cualquier regresión lo baja. El gate doble falla por craft (15 de 16).
- Gate de carga cognitiva: 0 fallas.
- CTA héroe vivo: cumple los 4 (whileTap 0.97, no disabled por defecto, 48px+ ancho completo, contraste azul/blanco; valida al toque con role="alert").
- Código verificado: role="alert" en errores de correo y pago, botones del panel disabled mientras sale la sesión, useReducedMotion en conteo del precio, stagger de planes y entradas. Sin atajos de teclado salvo flechas del radiogroup; sin celebración (no aplica).
- Fichas: azul del kit, Figtree/Nunito Sans, radios coherentes; sin desvío de FICHA-ARTE. No coincide con los kits vetados.
- Garantía con plazo (15 días) junto al CTA: pasa el sub-check de garantía nombrada.
- Se respetan por decisión del dueño el enlace "Ya pagué con otro correo" y la casilla obligatoria no premarcada.
