# VEREDICTO revisor-visual — onboarding (paso 1 de 10, "¿Cuál es tu rol hoy?")
Fecha: 2026-09-17 18:40
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 27/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:2 h5:3 h6:3 h7:2 h8:2 h9:3 h10:3
Detalle craft: jerarquía:2 profundidad:3 identidad:3 movimiento:3 encaje:2

Medidas evaluadas: 375px (docs/revisiones/onboarding-375.png) y 1440px
(docs/revisiones/_wip-onboarding-mid-1440.png, paso 2 con 1 respuesta dada).

Estado de los 5 defectos de la ronda anterior:
1. ~43% de viewport vacío abajo (celular) — CERRADO en composición (la tarjeta "Tu expediente"
   ocupa el tercio inferior), pero ABIERTO en calidad: ese relleno falla contraste AA y excede
   el tope de ítems por lista. Ver defecto 1.
2. Halo imperceptible — PARCIAL. Subido a 26% y ya se ve, pero el radial (centro 22%/34%,
   stop 62%) no se apaga dentro de su caja: a 1440 se lee como un rectángulo con borde recto a
   la izquierda del contenido, y su caja absoluta provoca scroll horizontal a 375. Ver defecto 2.
3. Pérdida de respuestas al cerrar la pestaña — CERRADO parcialmente. Verificado en
   app/onboarding/page.tsx: useEffect sobre [r] escribe sessionStorage en cada respuesta y hay
   efecto de rehidratación al montar. PERO `paso` no se persiste: al volver, la persona aterriza
   en "Paso 1 de 10" con el expediente en "7 de 7" y debe re-tocar las 8 pantallas. Ver defecto 5.
4. Mitad inferior sin profundidad — CERRADO. Tres niveles reales y consistentes: base #0B1524,
   elevado (chips y tarjeta con --shadow-1), hundido (caja "¿Por qué lo preguntamos?" con
   inset y fondo bajo el base). En computador se suma el panel con radial y hairline degradé.
5. Sin atajo para elegir chips — PARCIAL. Existe manejarFlechasChips (↑/↓ mueven foco) y
   Tab+Enter nativo; NO hay atajo numérico ni ninguna pista visible de que exista atajo. Las
   flechas mueven foco pero no seleccionan. h7 se queda en 2.

Top defectos:
1. [celular · tarjeta "Tu expediente"] Las 5 filas pendientes usan
   color-mix(text-tertiary 75%, transparent) sobre --surface ≈ #64778F/#13233A = 3.46:1 a 13px
   (AA exige 4.5:1), y la lista muestra 7 ítems de golpe (tope del SO: 4-5). El bloque que llena
   el tercio inferior es a la vez ilegible y ruidoso → subir el pendiente a --text-tertiary pleno
   y mostrar solo las 2-3 filas contiguas (contestadas + la siguiente) con un "y 4 más".
2. [celular · todo el flujo] Scroll horizontal real: <Halo> es absolute -left-8 -right-8 dentro
   del h1, que ya vive en una columna con px-4 → desborda ~16px del viewport de 375 (la barra
   horizontal se ve en el screenshot; nada pone overflow-x:hidden en globals.css ni en MarcoFunnel)
   → acotar el halo con inset-x-0 (o overflow-hidden en el contenedor) y cerrar el radial con
   stop al 100% para que además deje de recortarse como rectángulo.
3. [computador 1440 · dos columnas] El h2 del panel izquierdo y el h1 de la pregunta son ambos
   Spectral 28px bold CON el mismo subrayado de acento: al entrecerrar hay dos héroes empatados y
   el dispositivo ownable se gasta dos veces en la misma vista → bajar el panel a 20-22px sin
   marcador y dejar el subrayado solo en la pregunta.
4. [ambas medidas · cabecera vs tarjeta] Dos contadores que se contradicen a la vista:
   "Paso 1 de 10" arriba y "0 de 7" en el expediente → unificar el conteo (o etiquetar el de la
   tarjeta como "datos de tu expediente", sin número, para que no compita con el progreso).
5. [código · retomar y accesibilidad] Al volver, `paso` no se restaura (se reinicia en 1 con las
   respuestas ya dadas) y el <aside> del panel de computador es aria-hidden="true", así que el
   expediente no existe para lector de pantalla en ninguna medida (en celular la tarjeta tampoco
   anuncia cambios) → persistir `paso` en sessionStorage y quitar el aria-hidden del panel
   (dejarlo solo en los adornos) + aria-live="polite" en la fila recién completada.
