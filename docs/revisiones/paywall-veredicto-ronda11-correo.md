# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 11
Fecha: 2026-10-09 23:30
Screenshot: docs/revisiones/paywall-correo-ronda11-2-final-375.jpg
Usabilidad: 36/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Tramo "Ya pagué con otro correo" - hairline - garantía, zona media/baja] El ritmo 24/24 no se logró: en la captura final hay ~35px entre el enlace y la hairline (py-2 del enlace + pt-6) y luego ~28px de la hairline al texto de garantía, y la hairline al 38% casi no se ve, así que el tramo se lee como un hueco de ~70px sin separador. Fix: quitar py-2 visual del enlace con -my-2, usar pt-4 en el contenedor, o subir la hairline a 55% de acento; medir 24/24 en píxeles reales.
2. [Primer pliegue, entre pastillas y botón fijo] El bloque fijo (~230px de 812) sigue cortando a media altura la 2.ª fila de beneficios ("Funciona aunque la otra persona no la use"), visible en ronda10-1-arriba. No se tocó. Fix: mover "Te sale a US$0.24 al día" dentro de la pastilla del plan activo y dejar 2 filas debajo.
3. [Titular, mancha detrás de "queda fechado"] El cambio a -inset-x-1 NO está verificado: no se entregó captura de arriba posterior al cambio; la única vigente (ronda10-1-arriba) aún muestra la elipse desbordando el margen derecho. Fix: recapturar la parte superior a 375px tras el cambio.
4. [Identidad, logo] Isotipo gris metálico apagado sobre fondo claro, sigue pendiente en FICHA-ARTE; con un solo dispositivo tenue (mancha) la identidad no pasa de 3. Fix: versión azul del isotipo.
5. [Copy, "Menos que un correo de tu abogado (≈US$100)"] Cifra de fuente única extranjera presentada como hecho a un avatar colombiano que desconfía de las cuentas. Fix: "Menos que lo que algunos abogados cobran por un correo" o fuente local.

Corregido desde la r10 (verificado en captura y código): "Ahora no" y "¿Dudas? Escríbenos" a 13px text-secondary, ya no compiten con garantía ni CTA; contenedor del pie pt-6, hairline mb-0 y fila de garantía -my-1.5 aplicados en código. Esto mejora la jerarquía del pie, pero no basta para subir encaje por lo anotado en el defecto 1.

Notas del revisor:
- Usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:3 h7:3 h8:3 h9:4 h10:4 (suma 36, justo en el umbral). h8 en 3 por la carga de formulario + casilla + enlace + pie + dos salidas. h3/h7 verificados en código: X de cerrar, flecha atrás, "Ahora no", flechas del teclado en el radiogroup, correo recordado en localStorage, plan recordado.
- Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3 (15/20). Encaje no sube a 4: ritmo vertical del pie aún fuera de escala, radios mezclados (22 tarjeta / 12 pastilla / 999 botón e input / 6 casilla). Movimiento 3: stagger, conteo del precio, tap scale 0.97, reduced-motion en código; sin celebración ni anillo.
- Para llegar a 16/20: el defecto 1 resuelto de verdad (medido 24/24 en píxeles) más la recaptura que confirme la mancha (defecto 3). Ahora quedan 15 y el gate exige >=16.
- Copy (FICHA-AVATAR leída): idea 3, especificidad 3, emoción 3, oferta 4, acción 4 = 17/20, sin eje <=2. Sin cambios de copy desde la r10; mismas trazas y mismos topes (mecanismo Sello de Confianza ausente en esta pantalla, no agita el dolor #1, dato US$100 de fuente única).
- Sub-checks: garantía con plazo junto al CTA: pasa. Message-match: no verificable sin dato de anuncio.
- Gate de carga cognitiva: 0 fallas.
- CTA héroe vivo: cumple los 4 (whileTap, no disabled por defecto con validación al tocar y role="alert", alto >=48px ancho completo, contraste blanco sobre #2F6FDC).
- Fichas: paleta azul #2F6FDC, Figtree/Nunito Sans y radios coherentes con la variante clara de FICHA-ARTE; sin desvío. No coincide con los kits vetados.
- Respetados por decisión del dueño: enlace "Ya pagué con otro correo" y casilla obligatoria no premarcada.
