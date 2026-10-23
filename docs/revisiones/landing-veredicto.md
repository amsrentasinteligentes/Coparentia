# VEREDICTO revisor-visual — landing
Fecha: 2026-10-22 19:10
Screenshot: docs/revisiones/r31-landing-g1.png (serie r31-landing-g1 a g12, 375px, 9.138px de alto; mas r31-landing-barra-fija.png, r31-landing-final.png y r31-landing-formulario-con-errores.png)
Usabilidad: 38/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) g11/final CtaFinal (page.tsx linea 305 `recap` + linea 307 `psMarked`): la linea "7 dias gratis · Garantia de 15 dias" y el PS justo debajo dicen lo mismo (prueba de 7 dias, dia 8, garantia de 15 dias) -> quitar `recap` o reducir el PS a una sola idea nueva. (2) g12/final FooterLegal.tsx linea 56: el texto de los enlaces legales (px-1) arranca en x=24 mientras logo, copyright y "Volver arriba" arrancan en x=20 -> `-mx-1` en el `ul` (o quitar el px-1 del primer enlace de cada columna) para alinear a 20 px. (3) ListaEsperaPais.tsx linea 26 / tokens-claro.css linea 52: el texto de error 14px en #c9463d mide ~4.4:1 sobre --bg (#F3F7FC), bajo AA 4.5 -> oscurecer --status-error a ~#b93a32 (~5.3:1). (4) g8-g9 Garantia.tsx linea 58: el h2 "Garantia del Primer Expediente" va en 20px, mas chico que cualquier otro titulo de seccion (28/40) y casi igual que la escena de Agitacion -> `text-[28px] md:text-[40px]` como los demas h2 (sube jerarquia a 4). (5) page.tsx linea 301 CtaFinal `h2Marked`: "Todo lo importante, bajo control. Tu mente, en calma." abre un segundo marco distinto al h1 ("comprobante y fecha") -> "Que la proxima vez, [tu prueba ya este lista]" (sube idea a 4). Nota de evidencia: r31-landing-g12.png termina bajo el copyright y no contiene la fila "Volver arriba" que si aparece en r31-landing-final.png y en el codigo; el corte final de la serie esta truncado (~50-70px) -> recapturar g12 con la altura real del documento.
Detalle usabilidad: h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:4 h10:3
Detalle craft: jerarquia:3 profundidad:4 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emocion:4 oferta:3 accion:4 (17/20, ningun eje <=2)

## Verificacion del "camino mas corto" de la ronda 3
- (1) Opiniones, `items-start` (OpinionProfesionales.tsx linea 127): CONFIRMADO en codigo y en g9; el extracto de Ivonne ahora son 4 lineas, "Leer cita completa" y el nombre sin aire muerto. Residuo: la tercera tarjeta es ~20px mas baja que las otras dos (354 vs 374), solo visible al deslizar.
- (2) Hero sin `pilares`: CONFIRMADO (g1: h1, subtitulo, boton, dos lineas de microcopy). Agitacion: h2 "Te reclaman. ¿Donde quedo lo acordado?" y escena en 20px font-medium: CONFIRMADO en g3; los niveles 28 / 20 / 16 se leen en orden.
- (3) Mensual con sus viñetas propias: CONFIRMADO (g8, 5 viñetas, incluye "Autorizaciones y desacuerdos, por escrito" y "Sin compromiso de 12 meses"). El ancla de US$100 sigue solo en el FAQ (decision del dueño: no se penaliza).
- (4) Garantia: fondo `hundida` + tarjeta en shadow-2 + "Respaldada por la garantia de Hotmart" en una linea: CONFIRMADO en g8-g9 (la franja azulada se separa claramente de la Oferta; "dias" ya no queda huerfano).
- (5) Formulario: borde rojo en campo y casilla, mensaje bajo cada campo, validacion `onBlur` en pais y correo: CONFIRMADO en codigo (ListaEsperaPais.tsx lineas 18-21, 121, 173-177, 198-204) y en r31-landing-formulario-con-errores.png (pais, correo y casilla en rojo, tres mensajes con instruccion). Nota: el campo que recibe el foco muestra su borde de acento (azul), no el rojo, mientras esta enfocado; el mensaje rojo lo compensa.
- Barra fija (barra-fija.png): 52px, X a la derecha, no tapa el contenido clave. FAQ de datos financieros con la frase de Hotmart: CONFIRMADO (g11 / codigo page.tsx linea 289).

## Heuristica por heuristica (ronda 3 -> ronda 4)
- h1 Estado del sistema: 4 (se mantiene). "Abriendo…" en los 5 CTAs, "Guardando…" en el formulario. Residuo: la captura de telefono del hero y la imagen de EjemploPdf sin esqueleto.
- h2 Lenguaje del usuario: 4 (se mantiene). Hotmart glosado, SIC con nombre completo. Residuo: "Mente en calma" es promesa vaga.
- h3 Control y libertad: 4 (se mantiene; verificado en codigo: "Volver arriba", "Usar otro correo", X de la barra, "Leer menos", pausa/reinicio de la demo).
- h4 Consistencia: 4 (se mantiene). Un patron de puntos, una altura de boton (52), radios 22/999. Residuo de lupa: titulos alternan izquierda/centro y el h2 de Garantia (20px) rompe la escala de h2.
- h5 Prevencion de errores: 3 -> 4. Cumplido lo que pedi: borde de error por campo y casilla, validacion al salir del campo, captura con el error renderizado. Residuo de contraste del rojo (defecto 3).
- h6 Reconocer mejor que recordar: 3 -> 4. Cada plan se lee solo (Mensual con 5 viñetas). El resto de la cita tras "Leer cita completa" es decision del dueño.
- h7 Flexibilidad: 4 (se mantiene; flechas en carruseles, `?plan=` onboarding -> paywall, Anual por defecto, marcas de tiempo que saltan en la demo).
- h8 Estetico y minimalista: 3 (sigue). Hecho: sin pildoras en el hero, h2 de Agitacion corto. FALTA EXACTAMENTE: en el cierre (g11) el `recap` y el PS repiten la misma informacion, y la prueba de 7 dias / dia 8 se enuncia en hero, Oferta (barra + nota de Mensual), recap, PS y FAQ -> defecto 1.
- h9 Errores con solucion: 4 (se mantiene; ahora verificado en captura: cada mensaje dice que paso y que hacer).
- h10 Ayuda contextual: 3 (sigue). La objecion 5 ya esta completa (cancelar + pago por Hotmart). FALTA: el FAQ conserva 7 preguntas visibles (el kit avisa a >6): fusionar "¿Esto tiene validez ante un juez?" con "¿Por que no me sirve un Excel gratis?" en page.tsx lineas 264-273, o mover "¿Funciona fuera de Colombia?" fuera de la lista (queda a 6).

## Craft: 16/20
- Jerarquia 3: 4 niveles nitidos y la Agitacion ya se lee 28/20/16. Para 4: Garantia.tsx linea 58, h2 a 28/40px (hoy 20px, menor que cualquier otro titulo de seccion); y en Oferta bajar de 5 tamaños a 4 (nombre del plan 20, precio 36, bullets 16, labels 13-14).
- Profundidad 4 (era 3): base #F3F7FC, elevada blanca con shadow, hundida (AppPorDentro y Garantia), marino (Opiniones) y azul de cierre; la Garantia hundida con la tarjeta blanca en shadow-2 se ve a simple vista en g8 y cierra el defecto de la ronda 3.
- Identidad 3: hero (blob, foto virada a azul, sello FECHADO, burbuja), blob b en Solucion y cierre son propios; entre g2 y g10 el grueso son tarjetas de kit. Anti-clon: NO coincide con Capitulo ni con Umbral; azul #2F6FDC + Figtree/Nunito Sans + marino #0B2A57 + radios 22/999 coinciden con la variante clara de FICHA-ARTE.md. Para 4: un detalle firma propio en Problema/Oferta (por ejemplo el sello FECHADO como marca de agua en la tarjeta Anual).
- Movimiento 3 (codigo): stagger useReveal, CountUp, barra de prueba y linea de pasos que se dibujan, resorte del sello de Garantia, barra fija con AnimatePresence, tap 150ms + whileTap 0.97, acordeon, giro de "Abriendo…", todo con reduced-motion. `MiniRing` sigue sin usarse. Para 4: un anillo o barra con dato real en Problema/Agitacion.
- Encaje 3: arreglados el aire muerto de la tarjeta de Ivonne, el "dias" huerfano y el extracto de 6 lineas. Quedan: enlaces legales a x=24 contra logo/copyright a x=20 (g12, defecto 2) y tarjeta 3 del carrusel 20px mas baja. Con el footer alineado = 4.
- Camino a 17-18: Garantia h2 a 28px (jerarquia 4) + footer alineado (encaje 4).

## Gate de carga cognitiva
1 falla: FAQ con 7 preguntas visibles (sobre 4-5; acordeon de una abierta a la vez). El extracto de cita ya cabe en 4 lineas. 0 en las demas (grupos de 3, planes de 2, una accion primaria, formulario de 3 campos, nada interactivo que no responda). Sin sobrecarga critica.

## Verificaciones en codigo
CTA vivo cumple los 4: 52px, whileTap 0.97, nunca disabled (solo el envio del formulario mientras guarda), blanco sobre #2F6FDC 4.7:1. Anclas de conversion: titular bold con "comprobante y fecha" en acento, hairlines degradados, chips SVG sin emojis, secciones adyacentes distinguibles (Oferta/Garantia ahora si). Heuristicas 3 y 7 verificadas en codigo (ui.tsx, Faq.tsx, Solucion.tsx, AppPorDentro.tsx, OpinionProfesionales.tsx, ListaEsperaPais.tsx, FooterLegal.tsx, flujo `?plan=`). Garantia nombrada con plazo (Garantia del Primer Expediente, 15 dias) justo tras los planes, en hero, recap y PS. Message-match N/A (sin dato de anuncio). Aritmetica coherente (89/365 = 0.24; 9.99x12-89 = 30.88). Decisiones del dueño no penalizadas: 3 citas literales con extracto, sin testimonios de clientes, vinculo de Ivonne Reyes no declarado, US$100 y validez, precios y enlaces de Hotmart, logo plateado, texto interno de las capturas, solo Colombia, nombres de los enlaces legales.

## Copy 17/20 (ficha: FICHA-AVATAR.md)
idea 3: "prueba fechada con el Sello de Confianza" domina h1, Solucion y garantia, pero el h2 final ("Todo lo importante, bajo control. Tu mente, en calma.") abre otro marco -> defecto 5 para 4. especificidad 3: 0:06/0:12/0:21, 10 minutos, 15 dias, US$0.25/dia, citas que nombran el producto; sin cifras de uso (decision del dueño). emocion 4: escena exacta (WhatsApp reclamando un pago) + costo de la ficha (noche buscando en chats) + promesa. oferta 3: apilado, precio anclado (US$7.42 vs US$9.99, ahorro US$30.88), garantia con nombre, salida de cancelacion, Hotmart glosado, y ahora la objecion de pago seguro cubierta en el FAQ; el ancla de US$100 vive solo en el FAQ. accion 4: un solo tipo de accion en primera persona repetida. Trazabilidad: dolor 1 en Problema/Agitacion, deseo 1 en h1/Solucion, objeciones 1-6 en FAQ y Oferta. Umbral: >=16 y ningun eje <=2: CUMPLE.

## Gate doble
Usabilidad 38/40 (>=36) Y craft 16/20 (>=16) Y copy 17/20 (>=16, ningun eje <=2): LISTA. Craft queda en el limite exacto: cualquier regresion en profundidad (Garantia hundida) la devuelve a NO LISTA.
