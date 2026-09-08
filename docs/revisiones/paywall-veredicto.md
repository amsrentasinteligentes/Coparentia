# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-07 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 26/40
Craft: 12/20
Copy (si vende): 16/20 (eje emoción/dolor real = 2, viola "ningún eje ≤2")
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Precio, entre cards de plan y bloque garantía/CTA] Vacío muerto de ~250-300px en el centro de la pantalla (mismo problema reportado en ronda 2, solo desplazado del borde al centro por el `mt-auto`) → llenar ese espacio con contenido de valor (recordatorio de features, trust bar) o resolver el layout sin dejar un hueco muerto entre bloques.
2. [Header de las 3 pantallas del paywall] No existe indicador de progreso ("paso 2 de 3") pese a que `BarraProgreso` ya existe en el kit compartido y se usa en el onboarding — el usuario no sabe cuántas pantallas le faltan → agregar `BarraProgreso`/segmentos de 3 pasos junto al `FunnelHeader`.
3. [Precio, pantalla final] Las 3 features del expediente (Sello de Confianza, PDF foliado, alertas) se muestran solo en Recap y no se repiten en la pantalla de compra — viola heurística "reconocer mejor que recordar" → repetir 1-2 líneas de "qué recibes" cerca del CTA final.
4. [Precio, botones Anual/Mensual] Sin animación de entrada escalonada (`initial`/`animate`+delay por índice) que sí tiene `<Chip>` del mismo kit — inconsistencia de movimiento entre paywall y onboarding, y falta una de las 7 baseline (entrada escalonada) → replicar el patrón de `Chip`.
5. [Precio, titular "Blinda tu expediente desde hoy"] Copy genérico en la pantalla donde se decide comprar, sin conectar con la escena de dolor específica del avatar (reclamo por WhatsApp, "mala paga") ni con el mecanismo "Sello de Confianza" ya presentado en Recap → sumar una línea de contexto emocional/mecanismo específico cerca del titular o del CTA.
