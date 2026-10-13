# VEREDICTO revisor-visual — landing (2a ronda hallazgo 3: titular "cada pago ... con comprobante y fecha" + subtitulo sin repeticion)
Fecha: 2026-10-13 13:00
Screenshot: docs/revisiones/hallazgo3-v2-hero-375.jpg (+ docs/revisiones/hallazgo3-landing-grupos-375.jpg)
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) [Hero, H1/subtitulo] El hero sigue sin escena de dolor: la emocion (dolor #1 "mala paga", "cajero automatico") solo aparece en "Te suena?", un scroll mas abajo; eje emocion se queda en 3. Fix: opcional, una linea de apoyo sobre el CTA o probar en A/B un H1 que abra con la escena. 2) [Te suena?, orden de grupos] Quien RECIBE va primero, pero en la ficha sus dolores son INFERIDOS (sin VoC); Carlos (avatar con evidencia, dolor #1 star) queda en el segundo grupo. Decision del dueño registrada; fix: medir clics/scroll por grupo antes de consolidar el orden. 3) [Pie, heredado] Sin prueba social real (correcto declararlo, cero testimonios inventados) y tarjeta Anual con lineas pequeñas de jerarquia invertida; sin margen en gates: cualquier regresion en cualquier eje baja a NO LISTA. 4) [Hero, H1] "Padres separados" deja fuera a quien nunca convivio con la otra persona (padres no casados/no convivientes); es micro-riesgo de identificacion, no defecto de ficha (avatar = padre separado). 5) [Hero 1440] Captura recortada por la herramienta: no se puntua escritorio, solo se confirma titular y subtitulo.

Detalle usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquia:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:4 especificidad:3 emocion:3 oferta:3 accion:3

Gate doble: usabilidad 36 (minimo exacto) y craft 16 (minimo exacto): pasan sin margen. Gate de copy RUBRICA 4: 16/20 con ningun eje <=2: pasa, tambien en el minimo.

## Respuestas a lo pedido
- Copy sube a 16/20: SI (de 15). Sube el eje idea (3 a 4): el H1 ahora nombra a quien (padres separados), el tema (cuota alimentaria) y un resultado con objeto concreto (cada pago con comprobante y fecha); el mecanismo bautizado aparece en el hero via el pilar "Sello de Confianza en cada comprobante", y se repite en solucion y oferta. Los demas ejes no se mueven: especificidad 3 (sin cifra ni prueba externa en el hero; "10 minutos" es la unica cifra), emocion 3 (ver defecto 1), oferta 3, accion 3 (CTA unico "Crear mi expediente gratis", repetido; no esta en 1a persona de beneficio estricta pero es consistente).
- Trazabilidad: H1 "cada pago ... comprobante y fecha" = deseo #1 star (reporte con fechas y recibos) + VoC "quedar claro, con fechas y recibos"; palabras del lexico del avatar ("cuota", "comprobante"); subtitulo "sin depender de la otra persona" = objecion #1 y lenguaje obligatorio de la ficha ("sin depender de tu ex", ya neutralizado). "Listo para mostrar" no promete validez legal, coherente con objecion #3.
- Los defectos 1-3 de mi veredicto previo quedan resueltos: sin "unidos" (ya no choca con lo unilateral), titular con resultado, acento en 3 palabras ("comprobante y fecha"; la "y" interna es aceptable, no es articulo de apertura). El subtitulo ya no repite el titular.
- Visible en la captura 375: H1 4 lineas, CTA en el primer pliegue (~y 372 de 812 css), contraste del boton azul sobre fondo claro correcto, pie "7 dias gratis · Garantia de 15 dias" y aclaracion del cobro dia 8 legibles. Los grupos 3+3 con h3 y barra fija inferior se mantienen.
- FICHA-ARTE: tipografia Figtree (display) + Nunito Sans (cuerpo), acento azul unico, fondo claro con tinte: coherente con la variante clara; no se detecta desvio visible. Isotipo gris metalico: decision del dueño, no se puntua.
- Verificacion de codigo: app/page.tsx pasa h1Marked y subtitleMarked tal como se describe; CTA_HREF unico a /onboarding; precios desde lib/precios. Movimiento (eje 4) heredado de la ronda anterior, sin cambios.

Advertencia de honestidad: LISTA con margen cero en los tres gates (36/40, 16/20, 16/20). Una auditoria externa mas estricta en emocion del hero, prueba social o jerarquia de la tarjeta Anual puede bajar cualquiera de ellos.
