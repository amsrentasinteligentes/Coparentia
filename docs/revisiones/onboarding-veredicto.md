# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-20 23:30
Screenshot: docs/revisiones/r27b-onb-1.png (serie r27b-onb-1 a r27b-onb-9, 375px DPR 1)
Usabilidad: 30/40 (h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3)
Craft: 14/20 (jerarquia:3 profundidad:3 identidad:2 movimiento:3 encaje:3)
Copy (si vende): 14/20 (idea:3 especificidad:3 emocion:3 oferta:2 accion:3)
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Craft identidad, preguntas 1-3, 5-6] Cinco de nueve pantallas son pildoras blancas + azul generico + mancha azul suelta arriba a la derecha. La mancha cae sobre el final del titular (pregunta 2, "hoy?") y bajo el primer chip (pregunta 1): parece un manchon accidental, no un dispositivo de marca. Solo el sello FECHADO del cierre es ownable. Fix: anclar el sello/escudo como dispositivo recurrente (p. ej. marca de agua o sello pequeno que se "fecha" al responder) y mover la mancha a una posicion fija que no toque titular ni chips.
2. [Pregunta 1, entre la tarjeta "Esto es lo que vas a armar" y los 5 enlaces legales] ~110px de vacio y 5 enlaces subrayados de 13px compiten con la pregunta; la miniatura de 56x72 px del PDF es ilegible y parece un boton sin accion. Fix: mover los enlaces legales a una sola linea compacta o al pie de la tarjeta, y hacer la miniatura tocable (ampliar a una hoja) o agrandarla a >=96px de ancho.
3. [Sello final, tarjeta "Cada comprobante..."] La miniatura de 48x62 px dice "Asi se ve una pagina de tu expediente en PDF" pero no se lee ni un dato: la prueba concreta no prueba nada a ese tamano. Fix: ampliar la hoja (>=96px, recortada a la franja del sello con fecha) y sacar el texto de 14px a 2 lineas.
4. [Sello final, bajo el boton] "Garantia de 15 dias" en 13px sin nombre: la politica ya se llama "La Garantia del Primer Expediente" (app/reembolsos/page.tsx) y aqui no aparece. Sub-check de garantia nombrada falla y la oferta queda en 2. Fix: "Garantia del Primer Expediente: 15 dias, si no armas el tuyo te devolvemos todo", con icono de escudo.
5. [Preguntas 2, 3, 5, 6, tarjeta "Tu expediente" inferior] Repite lo que ya hay en la barra y en la caja de contexto: fila "Tu situacion —" vacia, "y 4 preguntas mas", "1 respuesta anterior guardada · faltan 3": ruido de contador que contradice el "Pregunta n de 6" de arriba y empuja el titulo y la ayuda. Fix: dejar solo las 2 ultimas respuestas con check, sin filas vacias ni contadores, y fundir la caja de contexto con la tarjeta.

Notas de verificacion:
- Gate de carga cognitiva: 1-2 fallas (miniatura de pregunta 1 y escudo del header parecen interactivos y no hacen nada; en preguntas 1-3 elegir avanza sin CTA, "que sigue" no se anuncia). No critico.
- Ficha-arte: Figtree + Nunito Sans, azul #2F6FDC, radios 999/22 coinciden con la variante clara. No es clon de Capitulo ni de Umbral. Logo plateado sin placa: decision del dueno, no puntuado.
- CTA heroe: h-14, acento pleno, whileTap 0.97, nunca disabled: cumple los 4. Ausente en preguntas 1-3, 5 y 6 por diseno (tap-para-avanzar).
- Codigo: h3 ok (Atras en cada paso, deshacer reinicio 6 s, "Volver a mis respuestas" en carga); h7 ok (flechas arriba/abajo, estado guardado en sessionStorage, meta con default 3). Movimiento: stagger de chips, whileTap, transicion entre pasos, anillo que se dibuja, conteo del slider, spring del check, reduced-motion en todo. Falta celebracion de hito real en el sello final (aparece estatico).
- Copy: no hay precio ni oferta explicita en esta pantalla; el eco del dolor "que no me crean que ya pague" y el reconocimiento "No es que no pagues" trazan al dolor 1 de FICHA-AVATAR. Puntaje <16 por oferta y especificidad.
