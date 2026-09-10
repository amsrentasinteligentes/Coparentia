# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-10 00:00
Screenshot: docs/revisiones/onboarding-rol-v2-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Todas las pantallas de chips + fondo — la sombra de CADA chip (seleccionado o no) lleva glow azul de acento (shadow ...accent 22%). Contradice FICHA-ARTE ("acento SOLO en CTA/dato/anillo/halo/botón activo") y la restricción anti-IA "sin glow regado" → fix: sombra neutra tintada (rgb 6 12 24) en chips no seleccionados; reservar el realce azul solo para el estado seleccionado.
2. Pantalla "Otra cosa" (texto libre) — banda vacía de ~300px entre la caja de contexto y el CTA anclado al fondo; se lee "aquí falta algo" → fix: subir el CTA justo bajo el helper/caja de contexto (o bajar la caja con mt-auto pegada al CTA) para cerrar el hueco central.
3. Tercio inferior de las pantallas de 2-4 chips (sobre todo Rol) — ~31% de la pantalla en vacío bajo la última caja; se percibe sin terminar → mitigar: no estirar el contenido sin CTA a min-h-dvh, o añadir pie sutil "Elige una opción para continuar".
4. Paso Rol — dos cajas de texto apiladas (contexto + blindaje) tras solo 2 opciones: ruido de lectura en el paso más simple → fix: fusionar en una sola caja o mover el blindaje al reconocimiento posterior.
5. Motion (código) — springs con bounce 0.35-0.4 en los checks de Chip y Reconocimiento contradicen la Motion signature de FICHA-ARTE ("sin springs agresivos, bounce ~0.08") → fix: bajar bounce a ~0.1 y usar --ease-sereno/--dur-base ya definidos en tokens.css.
