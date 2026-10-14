# VEREDICTO revisor-visual — landing (tercera pasada, capturas por tramos t1-t7)
Fecha: 2026-10-14 16:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Craft, movimiento; anterior al cambio, no resuelto] De las 7 animaciones base, queda sin aplicar el dibujado de anillos/barras: MiniRing existe en ui.tsx y Agitacion.tsx lo importa, pero app/page.tsx no le pasa `contraste`, asi que no se dibuja ningun anillo (no hay anillo ni barra que se dibuje en toda la pagina). CountUp ya esta aplicado en los dos precios (Oferta.tsx linea 65; verificado en ui.tsx: el HTML inicial trae el precio real, termina exacto, reduced-motion fijo), pero solo recorre el ultimo 30% (por ejemplo 6.20 a 7.42): es un efecto apenas perceptible, no un conteo heroe. Fix: un dato real dibujable (p. ej. el progreso 1-2-3 del Sello o el expediente de ejemplo) con barra/anillo whileInView, o el conteo desde un valor menor. Con eso movimiento sube a 4 y craft a 16. 2) [Craft, encaje/jerarquia; anterior al cambio] Letra de 10-12 px sigue en tarjetas de planes (t2/t3: "Se cobra al terminar la prueba", "Registras tu medio de pago hoy...", stack con tachado en 3 grises) y en el pie legal (t7: enlaces 11-12 px con puntos de separador de color alterno ambar/azul y "SIC" apretado). Lo nota cualquier usuario sin buscarlo, justo donde se decide la compra. Fix: notas a 13 px, un solo separador neutro en el pie, un dato heroe por tarjeta. 3) [Seccion "Que los acuerdos de crianza no se pierdan entre mensajes", t1; anterior al cambio] Tres parrafos de 4-6 lineas, tono legal generico ("actuacion judicial o extrajudicial") justo despues de las 6 preguntas que si agitan la escena. Falla el gate de texto por bloque (3-4 lineas) y frena la emocion (eje 3 de copy en 3). Fix: dos frases de 3 lineas max con la escena exacta de FICHA-AVATAR (el WhatsApp, "mala paga"). 4) [Gate cognitivo, menor; anterior al cambio] Carrusel con 6 puntos, 5 marcos, y "Asi se ve por dentro" con el mismo CTA repetido 5 veces en la pagina (hero, demo, carrusel, plan anual, cierre): no compite (mismo texto y accion) pero es mucha repeticion en 8276 px. Fix: opcional, quitar el CTA tras el carrusel.

Detalle usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquia:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:4 especificidad:3 emocion:3 oferta:3 accion:3

## Verificacion de los cambios A, B, C
A) Marco 5 del carrusel: RESUELTO. app/page.tsx linea 146: etiqueta "Especialistas, artículos y una consulta directa", nombrePantalla "Especialistas"; menu (linea 54), pie (enlaces-legales.ts, "Especialistas y artículos") y frase bajo el carrusel (t4) coinciden. La "consulta directa" se declara real dentro de la app (pantalla Asistencia con formulario); no pude verificarlo en la imagen, se acepta como declarado. Usabilidad h4 sube de 3 a 4.
B) CountUp en precios: RESUELTO en lo funcional y verificado en codigo (dependencia estable `tieneNumero`, estado inicial con precio real, onComplete fija el valor exacto, reduced-motion sin animar). Mejora de movimiento reconocida pero parcial (ver defecto 1).
C) Fuera de alcance por decision del dueno: MiniRing, agitacion, tamanos de letra. Los tres siguen vivos y son ANTERIORES al cambio (no los introdujo mover el directorio a /especialistas). Ninguno es regresion; pero los dos primeros son lo que impide los 16 puntos de craft.

## Gate
Usabilidad 36/40 pasa (justo en umbral). Copy 16/20 pasa sin margen, ningun eje <=2. Craft 15/20 NO pasa (umbral 16): falta un punto, que el eje movimiento recupera con un solo dato visual dibujado. Gate doble no cumplido: NO LISTA.
Nota de captura: barra fija sobre el cierre y tramo t6 vacio son artefactos de la captura, no se penalizan (en codigo StickyCtaMobile se oculta frente a #cta-final y ante cualquier CTA en pantalla). FICHA-ARTE: variante clara (Figtree + Nunito Sans, azul), sin desvio visible; no coincide con "Capitulo" ni "Umbral".
