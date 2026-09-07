# VEREDICTO revisor-visual — landing
Fecha: 2026-09-07 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Sección OFERTA, cards Anual/Mensual, botones CTA] La garantía de 15 días no aparece junto al CTA de compra — vive sola en la sección #7 (Garantía), separada de Oferta.tsx → agregar una línea "Respaldada por la Garantía del Primer Expediente (15 días)" debajo de cada botón CTA en Oferta.tsx.
2. [Transiciones entre secciones, todo el scroll] La alternancia base/elevada (--bg #0B1524 vs --surface #13233A) es casi imperceptible a simple vista en 375px, dificultando reconocer dónde empieza cada sección → aumentar el delta de luminosidad entre los dos tokens o añadir un hairline visible en cada cambio de sección.
3. [Hero → placeholder de captura; sección "La app por dentro" → frames del carrusel] Los visuales del producto siguen siendo placeholders rotulados (cámara + texto de sugerencia / frames vacíos con nombre de pantalla) [PENDIENTE CONOCIDO — no accionable hoy, previsto para Sesión 5 según regla "MOCKUPS HONESTOS PRE-LANZAMIENTO"].
4. [Kit global, heurística 7 — verificado en ui.tsx/StickyCtaMobile] Fuera del cambio inteligente de la barra sticky (ver oferta antes de mostrar el CTA comercial), no hay otros atajos/defaults de eficiencia → agregar un enlace "Ver precios" en el header fijo del Hero, no solo en la sticky bar mobile.
5. [Sección OFERTA, card Mensual vs Anual] Ambas cards muestran el mismo TrialBadge "7 días gratis" con igual peso, diluyendo cuál es la acción primaria recomendada → quitar el badge de trial duplicado en la card Mensual para reforzar que la Anual es la única acción dominante.
