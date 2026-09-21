# VEREDICTO revisor-visual — contacto con los hijos (Calendario + sheet "Registrar llamada", ronda 6)
Fecha: 2026-09-21 22:40
Screenshot: docs/revisiones/contacto-375.png
Screenshot secundario: docs/revisiones/contacto-modal-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Sheet — cabecera sticky] app/(app)/calendario/page.tsx:550 — la cabecera pegada no tiene borde inferior: en contacto-modal-375.png las etiquetas "Fecha"/"Hora" quedan cortadas a la mitad justo debajo de "Registrar llamada" y parece un error de render → añadir `border-b border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]` (o `shadow-[0_1px_0_...]`) al div de :550; medible: línea de 1 px visible entre la cabecera y el contenido desplazado.
2. [Sheet — fila "Eventos"] page.tsx:560 `grid-cols-4` con 5 tipos deja "Salida del país" huérfano en una segunda fila de 1/4 de ancho (3 celdas vacías al lado) → mover `salida_pais` a la fila "Contacto con tus hijos" renombrada, o usar `grid-cols-3` (3+2) para que ninguna fila quede con una sola celda; medible: 0 filas con una sola casilla.
3. [Calendario — lista "Hoy y próximos"] page.tsx:297-299 — separadores inconsistentes: fila 1 "5:06 p. m. 15 min · WhatsApp" (sin punto entre hora y duración) y fila 2 "5:12 p. m. · WhatsApp" (punto pegado tras espacio doble) → poner el "·" como separador uniforme entre TODOS los pares (hora · min · medio), no dentro del span del medio; medible: mismo patrón "a · b · c" en toda fila de contacto.
4. [Calendario — filas de eventos] page.tsx:286-293 — la fila "Cita médica / Odontologo" usa etiqueta 12 px gris arriba + título 14 px abajo, mientras las de contacto usan título 14 px arriba + meta 12 px abajo: dos anatomías de fila en la misma lista → unificar: primera línea siempre 14 px medium (tipo · hijo o título), segunda 12 px secundaria; medible: 1 sola anatomía de fila en la lista.
5. [Calendario — rejilla] page.tsx:401 números de día en 13 px: la vista sigue con 5 tamaños (28/15/14/13/12) → subir los días a 14 px; medible: ≤4 tamaños en la vista (28/15/14/12).

Defectos secundarios (no bloquean): hairline de `Tarjeta destacada` (components/app/ui.tsx:247-250, 1 px al 55 %) sigue imperceptible sobre blanco en contacto-375.png — subir a 70 % o 1.5 px; duración "0" tecleada solo avisa al tocar el CTA (:669 no valida en línea); 7 colores de categoría + éxito + aviso conviven en la vista (no crecer más).

Corregido respecto a r5 (verificado en código y screenshot): cabecera del sheet `sticky -top-5 z-10` con la X visible en contacto-modal-375.png a mitad del scroll (:550-555) ✓; resumen de confirmación en 3 líneas fijas — "Llamada con Isa" (bold) / "21 de septiembre de 2026 · 5:28 p. m. · 12 min" / "llamada normal · Contestó · sin captura" (:738-742), sin cortes dentro de la hora ✓; `Loader2` con `motion-safe:animate-spin` + `aria-busy` + `disabled:opacity-70` (:751-761) ✓; tamaños normalizados — días de la semana 12 px (:387), radios 12 px (:575/:649), aviso Sello 12 px (:591), resumen 13 px (:737-738), vacío 13 px (:179) ✓; fila "Eventos" en `grid-cols-4` con etiquetas 12 px (:560, :575) ✓.

Gate de carga cognitiva: 0 fallas (Eventos ≤4 por fila; resumen ≤3 datos por línea; 1 acción primaria por vista).
CTA héroe vivo (sheet): #1A63DC sobre blanco ≈5.9:1 ✓ · whileTap 0.97 (:753) ✓ · habilitado hasta que arranca el request (:751 solo `guardando`) ✓ · 56 px alto, ancho completo (:755) ✓.
Movimiento (código): stagger 50 ms (ui.tsx:237) ✓ · conteo NumeroContado (page.tsx:204) ✓ · anillos N/A · tap <150 ms en FAB/CTA/fila/radios/chips/días ✓ · transición de tabs layoutId (ui.tsx:161-165) ✓ · sheet 280 ms ease-out (:539-543) ✓ · celebración SelloConfianza (:236, :245) ✓ · reduced-motion (:463, :540-543, ui.tsx:235, :759 motion-safe) ✓.
Ficha (tokens claro): bg #EDF0F7 ✓ · superficie #FFF ✓ · acento #1A63DC ✓ · Figtree display / Nunito Sans body ✓ · radios 18/999 ✓.
Detalle usabilidad: h1:4 h2:4 h3:4 h4:3 h5:3 h6:4 h7:3 h8:3 h9:4 h10:4 · craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
