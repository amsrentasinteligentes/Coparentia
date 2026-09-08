# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-08 00:00
Screenshot: docs/revisiones/paywall-precio-v5-375.png
Usabilidad: 27/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Footer inferior sigue cortado dentro del viewport 375x812 (fila "Pago seguro · Términos · Privacidad" invisible sin scroll, fila "Ahora no · ¿Dudas?" con texto cercenado) → recortar espaciados verticales previos o compactar a una fila. 2) Card "Mensual" sin sombra de elevación frente a la sombra tintada de "Anual" → agregar sombra sutil consistente. 3) Sin manejo de error visible en el CTA si router.push falla → agregar estado de error qué-pasó+qué-hacer. 4) 5 enlaces secundarios apilados justo debajo del CTA generan ruido de cierre de pantalla → evitar que compitan visualmente con el CTA. 5) Heurística de flexibilidad (7) queda en piso: sin atajos más allá del tap, aceptable pero no ejemplar.
