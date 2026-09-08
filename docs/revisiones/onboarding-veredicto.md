# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-07 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 27/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [pasos 2/3/4 — situación, fijación, preocupación] Vacío muerto de ~300-400px entre los chips y el disclaimer inferior en TODAS estas pantallas (screenshots onb-paga/recibe-01/02/03) → sin corregir pese a estar reportado en la ronda anterior; agregar una tarjeta de contexto (ícono+texto, mismo patrón del paso 0) o reubicar/agrandar el disclaimer a media altura.
2. [paso 0 "rol"] Persiste un vacío de ~250px entre la tarjeta "¿Por qué lo preguntamos?" y la tarjeta de ventaja unilateral, pese a haber agregado ambas tarjetas → falta un tercer elemento entre las dos, o acercarlas, para no dejar el tercio medio de la pantalla vacío.
3. [craft, eje profundidad] Las 4 tarjetas informativas nuevas (rol×2, reconocimiento-preocupación, reconocimiento-final) usan EXACTAMENTE el mismo tratamiento (borde + fondo tintado 8-12% + ícono a la izquierda) → se percibe como un único componente copiado 4 veces, no como 3 niveles de profundidad (base/elevado/hundido); variar el tratamiento de al menos una (fondo sólido sin borde, o superficie hundida) para diferenciar jerarquía de mensajes.
4. [paso 10, LoadingPlan en app/onboarding/page.tsx] En onb-final-loading-375.png el ítem 2 ("Activando el Sello de Confianza") aparece SIN marcar mientras el ítem 3 ("Ajustando a tu meta") ya tiene check — secuencia fuera de orden visible en la pantalla que vende justamente "registro confiable y sin alterar en silencio" → revisar la lógica de completadas/activa por posible doble-ejecución del efecto (p. ej. React Strict Mode) generando dos temporizadores en carrera.
5. [input "otra cosa", PreguntaSituacion] Si el usuario deja el campo vacío o en blanco, el CTA solo se deshabilita sin ningún mensaje — no cumple heurística de errores con solución; agregar un texto de ayuda bajo el input ("Escribe tu situación para continuar").
