# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 10
Fecha: 2026-10-09 23:00
Screenshot: docs/revisiones/paywall-correo-ronda10-1-arriba-375.jpg
Usabilidad: 36/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Tramo correo - hairline - garantía, zona media/baja] Ritmo vertical sin tocar desde la r9: ~35px entre "Ya pagué con otro correo" y la hairline y ~40px hasta "Garantía de 15 días" (por min-h-11); ninguno cae en la escala 16/24/32. Es lo que mantiene encaje en 3. Fix: contenedor del pie con pt-6 (24px), hairline con mb-0, y la fila de garantía con -my-1.5 para que la zona táctil de 44px no genere hueco visible; ambos huecos quedan en 24px.
2. [Primer pliegue, entre pastillas y botón fijo] El bloque fijo (~230px de 812) corta la 2.ª fila de beneficios ("Funciona aunque la otra persona no la use") a media altura. Fix: mover "Te sale a US$0.24 al día" dentro de la pastilla del plan activo y dejar 2 filas debajo.
3. [Zona inferior, "Ahora no" / "¿Dudas? Escríbenos"] 14px, tinta primaria, peso 500: pesan casi como la garantía y compiten con el CTA. Fix: 13px, text-secondary.
4. [Identidad, logo y mancha] La mancha ya nace detrás de "queda fechado" (corregido), pero es una elipse plana al 14% que desborda ~8px el margen derecho del titular, y el isotipo sigue gris metálico apagado (pendiente declarado en FICHA-ARTE). Con solo un dispositivo tenue la identidad no pasa de 3. Fix: contener el Blob en el margen (-inset-x-1) y resolver el logo azul que la ficha deja pendiente.
5. [Copy, fila "Menos que un correo de tu abogado (≈US$100)"] El dato sale de una sola cita de foro estadounidense (FICHA-AVATAR, VoC) y se presenta como hecho para un avatar colombiano que desconfía de cuentas que no cuadran. Fix: "Menos que lo que algunos abogados cobran por un correo" o respaldarlo con fuente local.

Corregido desde la r9 (verificado en captura y código): mancha anclada detrás de "queda fechado"; ambas pastillas con radio 12px y contraste simétrico respecto a su tarjeta (activa en --surface, inactiva en --surface-2). Los dos defectos de la r9 pasan a resueltos; no suben el total porque el ritmo vertical y el pliegue siguen igual.

Notas del revisor:
- Usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:3 h7:3 h8:3 h9:4 h10:4 (suma 36, justo en el umbral; sin cambios respecto a la r9). h8 sigue en 3 por la carga de formulario + casilla + enlace + pie + dos salidas en una pantalla de decisión.
- Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3 (15/20). Encaje no sube a 4: las pastillas ya cuadran, pero el ritmo vertical y los radios mezclados (22 tarjeta / 12 pastilla / 999 botón e input / 6 casilla) se notan al recorrer. Movimiento 3: stagger, conteo del precio, tap scale 0.97 y reduced-motion verificados en código; sin celebración ni anillo.
- Camino a 16/20 con cambio mínimo: defecto 1 (ritmo 24/24) + defecto 3 (salidas a 13px secundarias) juntos suben encaje a 4. Defecto 2 es opcional.
- Copy (FICHA-AVATAR leída): idea 3, especificidad 3, emoción 3, oferta 4, acción 4 = 17/20, sin eje <=2. Trazabilidad: titular -> dolor "capturas se pierden/no dan contexto" y deseo de expediente fechado; "aunque la otra persona no la use" -> objeción 1; costo por día y comparación con abogado -> objeción 4 y VoC "$100 por cada correo"; garantía + Hotmart -> objeción 5. Idea baja a 3 porque el mecanismo bautizado (Sello de Confianza) no aparece en esta pantalla; emoción 3 porque no agita el dolor #1 ("mala paga"). Especificidad baja de 4 a 3 por el dato de US$100 de fuente única externa y la ausencia de prueba propia (honesto: cero testimonios inventados).
- Sub-checks: garantía con plazo junto al CTA: pasa. Message-match: sin dato de anuncio, no verificable.
- Gate de carga cognitiva: 0 fallas.
- CTA héroe vivo: cumple los 4 (whileTap, no disabled por defecto con validación al tocar y role="alert", alto >=48px ancho completo, contraste blanco sobre #2F6FDC).
- Fichas: paleta azul #2F6FDC, Figtree/Nunito Sans y radios coherentes con la variante clara de FICHA-ARTE; sin desvío. No coincide con los kits vetados.
- Se respetan por decisión del dueño el enlace "Ya pagué con otro correo" y la casilla obligatoria no premarcada (obligación legal).
