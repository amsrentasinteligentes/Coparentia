# VEREDICTO revisor-visual — paywall (2 pasos)
Fecha: 2026-09-09 00:00
Screenshot: docs/revisiones/paywall-valor-prueba-375.png · docs/revisiones/paywall-precio-v7-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:2 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:2
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:3
Gate de carga cognitiva: 0 fallas de 8.
CTA héroe vivo: pasa los 4 (contraste 5.99:1 · whileTap 0.97 · nunca disabled por defecto · 56px ancho completo).
Anclas de conversión: titular con énfasis ✓ · hairline degradé + chips SVG sin emojis ✓ · secciones adyacentes distinguibles: PARCIAL (la hairline sobre la franja de confianza del paso 2 es imperceptible en el render).
Los 5 defectos de la ronda anterior: 4 atacados con efecto real (garantía nombrada + mecánica, retroceso sin fondo, superficie elevada en paso 1, estado de error del CTA); el de moneda queda incompleto (badge sin US$).

Top defectos:
1. [Paso 2 · titular] Se ven TRES segmentos de subrayado (bajo "captura de", bajo "WhatsApp" y bajo "nada —") cuando el <Marcador> solo envuelve "captura de WhatsApp": el énfasis resalta palabras que no le tocan y el tercer trazo se lee como una regla suelta → forzar que la frase marcada no cruce 3 líneas (salto controlado o marcador sobre una sola palabra) y re-capturar; si la captura es de un build previo, re-renderizar y re-verificar antes de reclamar el fix.
2. [Paso 2 · badge de la tarjeta anual] "AHORRAS 3 MESES · $30.88 AL AÑO" es el único precio SIN moneda de toda la pantalla, y está a 40px de "US$7.42" → derivarlo del mismo objeto PLAN_* y escribir "US$30.88 al año" (la ambigüedad de moneda vuelve justo en el claim de ahorro, ante un avatar que desconfía de las cuentas).
3. [Paso 2 · franja de confianza] Al envolver, el separador "·" queda huérfano al final de la primera línea, y la mecánica de garantía (lo que de verdad tranquiliza) es el texto más apagado de la pantalla: 12px en tertiary centrado → franja en dos renglones propios sin separador colgante y mecánica a 13px/text-secondary.
4. [Código · irAlLogin, app/paywall/page.tsx:121] El setTimeout fijo de 2.5s no se cancela: en red lenta muestra "No pudimos abrir el siguiente paso" mientras la navegación SÍ está en curso — un error falso en el último paso de la venta → limpiar el timer al desmontar y disparar el mensaje solo ante fallo real (catch/evento de ruta), subiendo el umbral a ~6s.
5. [Paso 2 · jerarquía de acento] El pill de acento pleno con glow pesa más que el titular y compite con el CTA (acento presente en 8 elementos: titular, badge, borde+fondo de tarjeta, check, 3 chips, iconos de franja, CTA) → badge a fondo acento 12% con texto acento y reservar el acento pleno para el CTA.
