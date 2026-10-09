# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 12
Fecha: 2026-10-09 23:59
Screenshot: docs/revisiones/paywall-correo-ronda12-1-arriba-375.jpg (+ docs/revisiones/paywall-correo-ronda12-2-medio-final-375.jpg)
Usabilidad: 36/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Titular, mancha detrás de "queda fechado"] La elipse sigue sobrepasando el margen derecho: en la captura de arriba llega a ~x=725/750 (a 2x) mientras tarjetas y botón terminan en x=718. Son ~4px reales fuera de columna, visibles sin buscarlos. Fix: Blob con -inset-x-0 (o -left-1 right-0) para que no pase del margen de 16px.
2. [Escala tipográfica de toda la pantalla] Se usan 7 tamaños (28/22/16/15/14/13/12) donde la regla es máx 3-4 niveles; el precio héroe (22px) pesa menos que el titular (28px) y compite con él. Fix: llevar los beneficios de 14px a 13px o 15px, "Si no te sirve..." de 12px a 13px, y subir el precio a 24-26px o aceptar el titular como único héroe.
3. [Radios] Persiste la mezcla: tarjeta 22, pastilla interior 12, casilla 6, input y botón 999. Fix: pastilla interior con el radio token de tarjeta menos el padding (~14px) y casilla a 8px, o documentar la escala en FICHA-ARTE.
4. [Identidad] Un solo dispositivo ownable visible (la mancha) más el isotipo gris metálico. Puntuado sabiendo que el gris es decisión del dueño: no penalizo el color, pero la identidad no pasa de 3 mientras la pantalla de precio dependa de una sola mancha. Fix (no de logo): repetir el blob/halo, a baja opacidad, detrás de la tarjeta Anual.
5. [Copy] "Menos que lo que algunos abogados cobran por un correo" quedó sin cifra (bien), pero sigue sin respaldo local ni trazo a un dolor #1 ("siempre me tratan de mala paga"); el mecanismo Sello de Confianza no aparece en esta pantalla. Fix: una línea bajo el titular con el mecanismo, p. ej. "Cada comprobante con su Sello de Confianza".

Corregido desde la r11 (verificado en captura y código): "Te sale a US$0.24/0.33 al día" dentro de la pastilla de cada plan (lista de beneficios con 2 filas, el botón fijo ya no corta ninguna); frase del abogado sin cifra; ritmo del tramo "Ya pagué con otro correo" - línea - garantía ya se ve equilibrado en la captura y la línea al 55% se lee; recaptura de arriba entregada. Las cifras 25/22px no las reproduje con medición propia; las tomo de lo reportado y se ven coherentes en la imagen.

Notas del revisor:
- Usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:3 h7:3 h8:3 h9:4 h10:4 = 36 (justo en el umbral, sin margen). h8 en 3: formulario + casilla + enlace + pie + dos salidas siguen siendo mucho para el último paso. h3/h7 verificados en código (X, atrás, "Ahora no", flechas en radiogroup, correo y plan recordados). h1 3: no hay feedback entre tocar y que el plan cambie más allá del check.
- Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3 = 15. Con todo lo pedido en la r11 resuelto, el techo lo ponen defectos distintos: mancha fuera de margen (encaje) y escala de 7 tamaños (jerarquía). Movimiento 3: stagger, conteo del precio, whileTap 0.97, reduced-motion en código; sin celebración ni anillos (no aplican de forma natural en esta pantalla).
- CAMBIO MÍNIMO PARA 16/20: arreglar el defecto 1 (mancha dentro del margen) y unificar radios (defecto 3) para llevar ENCAJE a 4, y recapturar. Si además se reduce la escala tipográfica (defecto 2), la jerarquía sube a 4 y sobra margen.
- Copy (FICHA-AVATAR leída): idea 3, especificidad 3, emoción 3, oferta 4, acción 4 = 17/20, sin eje <=2. Oferta 4: precio mensualizado, total anual, COP, costo diario, trial y garantía con plazo junto al CTA. Sub-checks: garantía con nombre y plazo junto al CTA: pasa. Message-match: no verificable sin dato de anuncio.
- Gate de carga cognitiva: 0 fallas.
- CTA héroe vivo: cumple los 4 (whileTap, no disabled por defecto con validación al tocar y role="alert", alto >=48px ancho completo, contraste blanco sobre #2F6FDC).
- Fichas: paleta azul #2F6FDC, Figtree/Nunito Sans, radios de la variante clara coherentes con FICHA-ARTE; sin desvío. No coincide con los kits vetados.
- Respetados por decisión del dueño: isotipo gris metálico, enlace "Ya pagué con otro correo" y casilla obligatoria no premarcada.
