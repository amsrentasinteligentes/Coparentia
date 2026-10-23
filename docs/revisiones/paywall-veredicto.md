# VEREDICTO revisor-visual — paywall (pantalla de planes, 2 pasos) — ronda 3
Fecha: 2026-10-22 16:30
Screenshot: docs/revisiones/r34-planes-1.png (paso 1) · r34-planes-1-final.png · r34-planes-2.png (paso 2) · r34-planes-2-error-blur.png · r34-planes-2-error.png · r34-planes-2-final.png · r34-planes-vuelve-de-pagar.png
Usabilidad: 38/40 (h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4)
Craft: 16/20 (jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3)
Copy (si vende): 16/20 (idea:3 especificidad:3 emoción:3 oferta:3 acción:4)
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Paso 1 y paso 2, línea de garantía sobre el botón, r34-planes-1.png y r34-planes-2.png] El escudo queda pegado al borde izquierdo (x 17-33) y el texto empieza en x 75-141: el ícono flota a 40-110 px de lo que acompaña. Causa: el enlace ocupa todo el ancho y el texto va centrado dentro. Fix: page.tsx 606-607 y 1051-1052, partir el texto en dos renglones fijos dentro de un solo span (`Garantía del Primer Expediente<span className="block">15 días: te devolvemos tu pago</span>`) para que el enlace se ajuste a su contenido y el escudo lo abrace.
2. [Paso 2, barra fija, línea de renovación, r34-planes-2.png] Queda un "·" huérfano al final del primer renglón ("...US$89 al año ·"). Y la casilla de autorización, que es obligatoria, queda tapada por la barra en el primer pliegue 375x812. Fix: page.tsx 1072-1075, dos bloques: "Hoy no pagas nada · Cancelas cuando quieras" y debajo "Primer cobro el día 8: US$89 al año" (mismo alto, sin punto huérfano); y recortar ~50 px sobre la casilla (ver detalle en h8 abajo).
3. [Paso 2, titular, r34-planes-2.png] "fechado" queda solo en el 4º renglón y separado de "queda", la frase que vende. Fix: page.tsx 679, `<Marcador>queda{' '}fechado</Marcador>` (el renglón 4 pasa a "queda fechado" y el titular se equilibra).
4. [Paso 2, línea bajo el correo, r34-planes-2.png] El enlace "¿Ya pagaste? Entra aquí" se parte entre dos renglones ("¿Ya" / "pagaste? Entra aquí") y su área táctil es de ~16 px. Fix: page.tsx 845-846, poner el enlace en su propio renglón (`className="mt-1 block w-fit py-1 whitespace-nowrap ..."`); mismo número de renglones que hoy.
5. [Paso 2, quien vuelve de pagar, código] El destello del contenido ya no existe, pero el encabezado sí: BarraAtras (page.tsx 371-376) vive fuera de `listo` y pinta "Paso 1 de 2" al 50 % hasta que corre el efecto, y luego la barra crece a "Paso 2 de 2". Fix: envolver 371-376 en `<div className={listo ? undefined : 'invisible'}>`; no toca ui.tsx.

## Estado de los defectos de la ronda 2, verificados uno por uno
- #1 garantía cortada en el paso 2: CORREGIDO. Mismo bloque centrado que el paso 1 (page.tsx 599-608 = 1044-1053), 2 renglones, entre x=16 y x=359. Queda la separación escudo-texto (defecto 1 de arriba).
- #2 barra fija cortada: CORREGIDO. Termina en el borde inferior, se lee completa ("Hoy no pagas nada · Primer cobro el día 8: US$89 al año · Cancelas cuando quieras") y ya no dice "Plan anual ·". Queda el "·" huérfano (defecto 2).
- #3 casilla roja antes de tiempo y un solo error: CORREGIDO en código (errorCorreo y errorAutoriza separados, 159-160; onAutoriza limpia solo el de la autorización, 412-415; irAlPago 228-238; la casilla roja solo con `errorAutoriza`, 874) y en r34-planes-2-error.png (campo rojo con su mensaje, casilla roja con el suyo). En r34-planes-2-error-blur.png la casilla no se ve (queda bajo la barra): que no se pinta se confirma por código, no por imagen.
- #4 escala y radios: CORREGIDO. Precio no elegido 24/600 (731, 770), "/mes" 13 px, cajitas `rounded-full` (739, 776), casilla `rounded-[6px]` (871). La zona de planes usa 32/24/16/13.
- #5 destello del paso 1 al volver de pagar: CORREGIDO para el contenido (`listo`, 152 y 206, render 382); r34-planes-vuelve-de-pagar.png abre en "Paso 2 de 2". Queda el encabezado (defecto 5 de arriba).
- Sugerencias no bloqueantes de la ronda 2 que siguen sin aplicarse: halo del titular invisible (`--halo-alpha` 12 %), degradé de 16 px que lava "Pago seguro con Hotmart" en el primer pliegue del paso 1 (page.tsx 597 y margen 585), pie del paso 2 sin entrada escalonada, el mecanismo "Sello de Confianza" sin nombrar en el paso 2, y la condición de la fila "Meses por organizar" del panel de computador (page.tsx 288 vs onboarding 247).

## Gate de carga cognitiva: 0 fallas (2 planes, 2 campos, 1 acción primaria, bloques de ≤4 renglones, "qué sigue" obvio, nada tocable que no responda). Borderline: el paso 2 apila titular de 4 renglones, 2 planes, correo, ayuda, casilla, párrafo de Hotmart, garantía, botón, renovación y 4 enlaces.

## CTA héroe vivo: cumple los 4. Contraste blanco sobre #2F6FDC 4,7:1; whileTap 0,97 (ui.tsx 223); deshabilitado solo mientras abre el pago (`yendo`); valida al toque con mensaje y foco; h-14 ancho completo, visible en el primer pliegue de los dos pasos.

## Heurísticas, una por una
- h1 = 4. Spinner inline + bloqueo de doble toque + aviso a los 6 s, conteo del precio, transición entre pasos, barra de progreso.
- h2 = 4. Cero jerga; Hotmart y vendedor se explican en el paso 2.
- h3 = 4. Atrás (paso 1 a /onboarding, paso 2 a paso 1), X, "Ahora no", "Corregir", cierre de sesión con Cancelar. Sin acciones destructivas.
- h4 = 4. Garantía idéntica en los dos pasos, un solo radio por familia (22 tarjetas / 999 píldoras y botones / 6 casilla, estándar de casilla), titulares de 24 px, degradé de salida igual.
- h5 = 4. Validación al salir del campo, borde rojo, sugerencia de dominio, dos errores independientes, casilla roja solo tras tocar el botón, el botón nunca nace muerto.
- h6 = 4. Planes comparables (Anual vs "Serían US$119.88"), resumen de cobro bajo el botón.
- h7 = 3. Falta: (a) encabezado "Paso 1 de 2" que destella al volver de pagar: page.tsx 371-376 dentro de `<div className={listo ? undefined : 'invisible'}>`; (b) "¿Ya pagaste? Entra aquí" partido en dos renglones y con área táctil de ~16 px: page.tsx 845-846, en su propio renglón con `block w-fit py-1`. Ya están: Enter envía, flechas cambian de plan, correo y plan recordados, Anual preseleccionado, enlace a /entrar.
- h8 = 3. Falta: (a) "·" huérfano de la línea de renovación: page.tsx 1072-1075 en dos bloques; (b) la casilla obligatoria queda bajo la barra en el primer pliegue 375x812 (la barra mide ~157 px). Liberar ~50 px sobre ella dentro de page.tsx: titular a 3 renglones (defecto 3 ya lo deja en 4 más ordenados; para 3 renglones acortar el texto, p. ej. "Una captura se pierde — tu expediente queda fechado", decisión de copy del dueño), `-my-1.5` y `mb-2` de la garantía (1044-1049) y reducir `pt-4` de la barra (1041) a `pt-3`; si no alcanza, aceptar que la casilla se ve al desplazar (el botón ya la lleva con su error) y dejar solo (a).
- h9 = 4. Cada error dice qué pasó y qué hacer, pegado a su campo, rojo #C9463D (≈5:1) con texto, `role="alert"`.
- h10 = 4. Línea de ayuda bajo el correo, garantía, renovación, vendedor de Hotmart y salida para quien ya pagó.

## Craft, eje por eje
- Jerarquía = 4. Paso 2: héroe 32 (precio), título 24, cuerpo 16, label 13; paso 1: 24/20/16/13. Cuatro niveles nítidos al entrecerrar los ojos, mismo estándar que el onboarding aprobado. Cuidar: "fechado" huérfano (defecto 3).
- Profundidad = 3. Base con tinte, tarjeta elevada con sombra tintada, cajitas hundidas con sombra interna, degradé de salida: consistente en los dos pasos. Para 4: halo del titular visible (`style={{'--halo-alpha':'22%'}}` en los h1, page.tsx 481 y 670; hoy 12 % no se ve) y que el degradé del paso 1 no lave las señales de pago (597: `h-4` a `h-3`; 585: `mt-4` a `mt-6`). La base sigue siendo un fondo plano sin gradiente propio.
- Identidad = 3. Visibles: Sello de Confianza de 56 px sobre el blob, borde degradé del plan elegido, hairlines; no coincide con las paletas vetadas (Capítulo/Umbral). Para 4: un dispositivo propio más allá del kit compartido (la paleta azul pálido + tarjetas blancas + Figtree se parece a 2houses/Niddo). Opción dentro de page.tsx: una fecha real de hoy junto al sello ("Sello · 22 oct 2026") y "Día 8" convertido en fecha real, que es el mecanismo "fechado" hecho visible.
- Movimiento = 3. Verificado en código: entrada escalonada del paso 1 (452-456), conteo del precio (29-51), línea del timeline que se dibuja (564-569), barra de progreso (ui.tsx 33-52), whileTap 0,97 en planes y botón, transición entre pasos (ui.tsx 235-245), reduced-motion en conteo, check, entradas y variantes. Sin celebración (no aplica antes del pago). Para 4: (a) correo (796) y párrafo de Hotmart (995) entran de golpe junto con el paso: envolverlos en `motion.div` con las mismas props de entrada y delay 0,12 y 0,18 s; (b) los `scrollIntoView({behavior:'smooth'})` (235 y 923) ignoran reduced-motion: `behavior: reduce ? 'auto' : 'smooth'`.
- Encaje = 3. Bien: cifras y etiquetas del precio, chips, paddings, garantía dentro de x 16-359, barra al borde. Falla a simple vista: escudo de la garantía flotando lejos de su texto (defecto 1), "·" huérfano (defecto 2), enlace "¿Ya pagaste?" partido (defecto 4), "fechado" huérfano (defecto 3). Con esos cuatro, 4.

## Copy (rúbrica 4), con traza a FICHA-AVATAR
- Idea única 3: expediente fechado y Sello de Confianza; en el paso 2 el mecanismo solo aparece como ícono. Para 4: nombrarlo una vez en el paso 2 (p. ej. en la píldora del plan Anual o junto al sello).
- Especificidad 3: 7 días, día 5, día 8, US$89, US$30.88, 15 días; cero testimonios inventados. El absoluto "que nadie puede alterar" es decisión del dueño (no se penaliza).
- Emoción 3: "Una captura de WhatsApp se pierde" es la escena del avatar; casi no agita el dolor #1 (mala paga injusta). Para 4: una frase de dolor antes de la solución en el paso 1.
- Oferta 3: precio anclado, prueba, garantía nombrada con plazo y se lee entera en los dos pasos. En el paso 2 no se repite qué incluye junto al plan. Para 4: una línea "Incluye: Sello de Confianza, PDF foliado, sin que la otra parte la use" bajo el titular o dentro de la tarjeta Anual.
- Acción 4: un solo tipo de acción en primera persona y con beneficio, siempre visible.
- Sub-checks: garantía nombrada con plazo cerca del botón: SÍ. Message-match con el anuncio: sin dato de origen (no verificable).

## Gate: usabilidad 38/40 (≥36), craft 16/20 (≥16, justo en el umbral: jerarquía 4 lo sostiene), copy 16/20 (≥16, ningún eje ≤2). No toca components/funnel/ui.tsx ni PanelExpediente.tsx ni tokens-claro.css: todos los arreglos listados viven en app/(funnel)/paywall/page.tsx.
