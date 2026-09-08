# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-08 00:00
Screenshot: docs/revisiones/onboarding-momento-375.png
Usabilidad: 29/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Paso 7 (Momento) — debajo de "¿Cuándo revisas tus gastos familiares?" aparece un rectángulo azul oscuro flotante, desconectado del texto y de bordes duros (el dispositivo <Marcador> mal calculado en un título de 2 líneas) → fix: revisar el linear-gradient de Marcador con leading-[1.1] en títulos que envuelven, forzar line-height consistente o pasar a un <mark> real con padding controlado, y testear en TODOS los títulos de 2 líneas del onboarding.
2. Paso 7 (Momento) — tras los 4 chips queda un vacío de ~170px sin ningún elemento hasta la nota de pie ("Puedes cambiar el horario...", sin CTA visible) → fix: centrar verticalmente el bloque pregunta+chips o anclar el pie con un elemento visual, en vez de dejar aire muerto con mt-auto puro.
3. Consistencia de layout entre pasos — "Reconocimiento" (paso 5) ancla el CTA al fondo llenando el espacio; "Momento" (paso 7, sin CTA) deja la mitad inferior vacía: dos patrones de balance vertical compiten dentro del mismo flujo y se sienten inconsistentes.
4. h7 Flexibilidad (código) — ui.tsx/page.tsx no implementan navegación por teclado entre opciones de un mismo paso (flechas arriba/abajo); solo Tab+Enter nativo del button. Aceptable pero no da atajos al usuario experto.
5. Identidad ownable — el glitch del punto 1 ocurre justo en el dispositivo diferenciador de la marca (Marcador+Halo), lo que en este screenshot se lee más como bug de plantilla que como diseño intencional; corregirlo antes de cualquier otra pulida visual.
