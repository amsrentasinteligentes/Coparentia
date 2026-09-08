# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-08 00:00
Screenshot: docs/revisiones/paywall-precio-v6-375.png
Usabilidad: 28/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1. [Pie de pantalla, debajo del CTA] 4 líneas apiladas ("Hoy no pagas nada...", "Ahora no · ¿Dudas?", "Pago seguro · Términos · Privacidad") con separaciones de solo 4px (mt-1, mt-3 en Precio()) crean un bloque de texto legal denso y percibido como clutter → agrupar en menos líneas o llevar Términos/Privacidad a un pie global de la app, separación mínima 8px entre bloques.
2. [Card "Anual", esquina superior izquierda] el badge "MÁS POPULAR · AHORRA 3 MESES" (absolute -top-2.5) queda montado justo sobre el borde de la tarjeta, ni claramente dentro ni fuera → subir el badge o dar más padding-top a la tarjeta para que flote limpio sobre el borde.
3. [Detrás del titular "Una captura de WhatsApp..."] el halo radial (dispositivo ownable de FICHA-ARTE) es casi imperceptible en el screenshot, no cumple su función de dar profundidad/identidad → subir opacidad/tamaño del gradiente o quitarlo.
4. [Heurística 7 — código] sin evidencia de atajos/defaults adicionales más allá del plan anual preseleccionado; no crítico en mobile pero sigue sin resolverse desde la ronda anterior.
5. [Mitad inferior de la pantalla] conviven 5 elementos interactivos (CTA + Ahora no + Escríbenos + Términos + Privacidad) en un espacio reducido — dentro del límite pero al borde de la sobrecarga cognitiva del gate; considerar sacar Términos/Privacidad del paso final del funnel.
