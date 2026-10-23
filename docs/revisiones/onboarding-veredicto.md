# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-22 14:00
Screenshot: docs/revisiones/r33-onb-1-rol.png (serie r33-onb-1 a r33-onb-9, 375px DPR 1, commit 28aa602)
Usabilidad: 37/40 (h1:3 h2:4 h3:4 h4:4 h5:3 h6:4 h7:4 h8:3 h9:4 h10:4)
Craft: 16/20 (jerarquia:3 profundidad:4 identidad:3 movimiento:3 encaje:3)
Copy (si vende): 16/20 (idea:3 especificidad:3 emocion:3 oferta:3 accion:4)
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Pantalla de carga, boton "Ver mi plan ahora"] El atajo nuevo hace router.push('/paywall') sin ningun feedback (la pantalla queda quieta lo que tarde la red) y el temporizador de la animacion sigue vivo: puede navegar dos veces. Tambien falta scroll arriba al cambiar de paso (no hay scrollTo en el onboarding; en 360x640 el paso siguiente aparece a mitad de pagina). Fix: page.tsx:1124-1130 estado yendo (clearTimeout, setYendo(true), boton "Abriendo tu plan...", ignorar toques) y router.prefetch('/paywall') al llegar al paso 8; page.tsx:467 onExitComplete={() => window.scrollTo({ top: 0 })} en el AnimatePresence.
2. [Pregunta 2 "Otra cosa", validacion] Solo se valida "vacio": una letra pasa y termina en la carga como "Registrando tu situacion: a", mientras el mensaje pide "unas palabras". Fix: page.tsx:636, 655-659, 666: usar una sola constante invalido = texto.trim().length < 8 (en vez de !texto.trim()) para el envio, el aria-invalid, el borde rojo y el mensaje.
3. [Todas las preguntas, tipografia] Siguen 4 tamanos (28/16/14/13) y en la tarjeta "Tu expediente" el titulo (13) es mas chico que sus filas (14). Fix: pasar todo 13 a 14 (ui.tsx:81 contador; page.tsx:423, 430, 446, 539, 644, 667, 671, 865; PanelExpediente.tsx:77, 83, 145, 157) y poner "Tu expediente" en 16 semibold: quedan 28/16/14 (+48 heroe de la meta). Comprobar que la fila legal de la pregunta 1 (3 enlaces) sigue cabiendo en 343 px.
4. [Reconocimiento final, encabezado y pie] El escudo del encabezado repite el sello grande 200 px mas abajo (mismo dibujo dos veces) y la linea de garantia deja el icono pegado al borde izquierdo (x=25) con el texto centrado lejos de el. Fix: page.tsx:411 envolver el sello del encabezado en un div con 'invisible' cuando paso === 8 (conserva la altura); page.tsx:1004 a mx-auto max-w-[36ch] text-left para que el icono abrace su texto.
5. [Identidad y movimiento fuera del sello final] En las 6 preguntas el unico rasgo propio visible es un escudo de 40 px y un halo al 12%; la carga y los reconocimientos entran como un solo bloque. Fix: PanelExpediente.tsx:107-111 que el visto de cada respuesta se "estampe" (scale 1.35 a 1, rotate -8 a 0, spring corto, igual gesto que SelloEstampado); stagger 60 ms por bloque en page.tsx:795-815, 848-876, 973-1010; en la carga, check con spring al completarse una linea (page.tsx:1107) y conteo del % (page.tsx:1093); retraso de 150 ms al estampado (page.tsx:958) para que no compita con el deslizamiento del paso; avisos de page.tsx:427 y 443 con la misma entrada animada de page.tsx:423.

## Verificacion de la ronda 1 (33/40, 15/20)
- D1 placeholder cortado, error lejos del campo, helper contradictorio: CORREGIDO (2b: placeholder completo, borde rojo, error pegado y en lugar del helper; foco devuelto, page.tsx:638).
- D2 pie legal: CORREGIDO a 3+2 ordenado; sigue habiendo 5 enlaces pero ya no compiten.
- D3 slider 24 px y sin ayuda: CORREGIDO por codigo (h-11 con pulgar centrado, -mt-2.5 sobre pista de 4 px) y en captura (caja "no es un compromiso").
- D4 panel: CORREGIDO. Sin fila pendiente en celular, etiquetas iguales a las preguntas, contador "Pregunta n de 6" tambien en los reconocimientos (3 de 6 y 6 de 6).
- D5 craft: MITAD. Superficie hundida (--surface-2) presente y visible; lineas de la carga con transicion de 300 ms. Siguen 4 tamanos y los avisos de 430/446 entran de golpe.
- Estados sin captura (verificados solo en codigo): aviso "No pudimos guardar", "Retomamos...", "Borraste...".

## Que esta en 4 y por que
- h2: etiquetas = preguntas; sin jerga ("rol" es aceptable, los chips lo explican). h3: Atras en todo paso, deshacer 6 s, confirmar reinicio, "Volver a mis respuestas". h4: un solo CTA/chip/caja en todo el flujo; el CTA a media pantalla en "Otra cosa" es correcto (queda sobre el teclado). h5 no; h6: opciones y resumen visibles. h7: flechas en chips, Enter envia, meta por defecto 3, guardado incremental, atajo de la carga. h9: error por campo con que-paso + que-hacer. h10: caja "por que lo preguntamos" en las 6 + ejemplo en el campo.
- profundidad 4: base #F3F7FC con halo, elevada blanca con --shadow-1 y hairline degradada, hundida #E7EEF8; consistente en las 6 preguntas y los reconocimientos. Unica pantalla plana: la carga (opcional: lista dentro de tarjeta blanca elevada).

## Notas
- Ficha-arte (variante clara): Figtree + Nunito Sans, #F3F7FC, #2F6FDC, radios 999/22: coinciden. No es clon de Capitulo ni de Umbral. Logo plateado: decision del dueno, no penalizado.
- Gate de carga cognitiva: 0 fallas. CTA heroe: cumple los 4 (blanco/#2F6FDC 4.7:1, whileTap 0.97, nunca disabled, h-14 ancho completo).
- Sello final: capturas a (650 ms) y b (760 ms) muestran el sello mas grande y translucido asentandose; c (900 ms) y asentado ya iguales: la animacion se ve y termina en ~1 s.
- Movimiento por codigo: stagger solo en chips; conteo del numero de la meta; barra y anillo que se dibujan; tap en chips/CTA; transicion de paso; sello y check con spring; reduced-motion en todo; modales N/A.
- Copy trazado a FICHA-AVATAR (dolor "mala paga", "captura de WhatsApp", lexico expediente/Sello de Confianza); garantia nombrada con plazo junto al CTA final (pasa). Sin precio en esta pantalla. Message-match N/A.
- Margen: 16/20 en craft es el minimo del gate; cualquier regresion en profundidad lo rompe.
- Ningun arreglo exige tocar components/landing ni tokens-claro.css.
