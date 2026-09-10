# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-10 00:00
Screenshot: docs/revisiones/onboarding-rol-v2-375.png
Usabilidad: 30/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Tercio inferior vacío estructural (~35-40% del viewport) bajo la caja de contexto en todas las pantallas de chips; peor en "Rol" (2 chips + 1 caja y nada mas) — techo del tipo de pantalla; documentar o rellenar con contenido de apoyo (mini-timeline del expediente / resumen de respuestas / ilustracion de serie).
2. Pantalla "Otra cosa": el fix anclo el CTA al bloque pero dejo ~600px muertos DEBAJO del boton — se cambio el hueco central por un vacio inferior igual de grande; anclar el CTA con mt-auto en este paso concreto o subir la caja de contexto con contenido.
3. Pantalla "Otra cosa": el boton "Continuar" va disabled por defecto (pildora gris muerta) — contradice el ancla "CTA nunca disabled por defecto"; habilitar siempre y validar al click con hint inline.
4. Paso Meta: la linea de feedback usa el emoji ⚡ como icono (app/onboarding/page.tsx L552) — contradice FICHA-ARTE (emojis como iconos prohibidos) y baja identidad; reemplazar por icono SVG Lucide en chip de acento 12%.
5. Paso Rol: la caja "¿Por que lo preguntamos?" quedo en ~6 lineas (la fusion del texto de la 2a caja la engroso) — supera la guia de 3-4 lineas por bloque; recortar.
