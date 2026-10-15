# VEREDICTO revisor-visual — landing (octava pasada, capturas v1-v3)
Fecha: 2026-10-14 23:00
Screenshot: docs/revisiones/landing-375-v1.png
Usabilidad: 35/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Craft/movimiento, toda la landing] Ya hay BarraPrueba (Oferta.tsx:78) y CountUp del precio (ui.tsx:27) con reduced-motion, pero siguen sin dibujarse los anillos (MiniRing sin datos), "Listo en 10 minutos" del hero es estático y no hay ningún momento de celebración/hito; la barra es una línea de 4 px en la tarjeta Anual que casi no se nota. Eje 4 queda en 3 y el craft en 15 (<16). Fix: contar "10" en el hero con CountUp y dar un remate al check del Sello en DemoSello (o engrosar la barra a 8 px con el dato "7 días" como número héroe). 2) [Oferta, v1 final y v2 arriba] Aún se repite la idea de prueba: resumen "Hoy no pagas nada", etiquetas "Hoy: sin cobro / 7 días de prueba" de la barra y la línea "7 días de prueba, sin cobro. El primer cobro entra el día 8" bajo cada plan; además el CTA Anual y el del Mensual dicen cosas distintas ("Crear mi expediente gratis" vs "Empezar mi plan mensual"), lo que compite. Fix: quitar la línea inferior del Mensual y el resumen superior, dejar solo la barra como aviso del Anual. 3) [Pie legal, v3 abajo] Los 6 enlaces siguen leyéndose como una fila corrida con viñetas que se parte en 3 líneas desparejas (no se ven las 2 columnas pedidas) y el logo sigue pequeño con "Coparentia" apenas legible; texto del pie 11-12 px aparente. Fix: grid de 2 columnas sin viñetas, logo h-10 real y revisar que la clase responsive se aplica a 375 px. 4) [Gate cognitivo, v1 "¿Te suena?"] 6 tarjetas de dolor + 3 párrafos legales largos + 4 CTAs + 5 FAQ: el bloque "acuerdos de crianza" (párrafos de 4-5 líneas) enfría la emoción tras el dolor y viola el límite de 3-4 líneas por bloque. Fix: recortar a 2 párrafos de 3 líneas o plegarlo en un acordeón. 5) [Hero y notas, v1/v2] Los chips de beneficios (Gastos al día, Sello de Confianza con fecha, Mente en calma) siguen pareciendo botones pill sin acción; notas bajo CTA y bajo planes en ~12 px de tono tenue. Fix: quitar el borde/sombra de los chips (solo check + texto) y subir las notas a 14 px.

Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquia:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:4 especificidad:3 emocion:3 oferta:3 accion:3

## Gates
Gate cognitivo: fallan ~2-3 ítems (grupos de 6 tarjetas, bloque legal largo, chips que parecen interactivos); no llega a sobrecarga crítica. Usabilidad 35/40 queda bajo 36 (h8 por repetición residual en Oferta y densidad del bloque de dolor). Craft 15/20 queda bajo 16 (movimiento: sin celebración ni anillos, barra poco visible). Copy 16/20 pasa sin margen, ningún eje <=2. Gate doble no cumplido: NO LISTA.
Mejoras reconocidas vs 7.ª: aviso de prueba reducido de 3 a una línea por plan en las tarjetas, BarraPrueba con dato real y reduced-motion, CountUp en el precio, PS del cierre legible sin cursiva, sin desborde (scrollWidth 375).
Sin verificar a fondo: heurísticas 3/7 (StickyCtaMobile no visible en estático; existe en ui.tsx con whileTap y reduced-motion, no auditada línea a línea). CTA héroe: whileTap 0.97 en CtaButton verificado en código.
FICHA-ARTE (variante clara Figtree + Nunito Sans, azul #2F6FDC, radios 22px/999px, blobs orgánicos): sin desvío evidente; no coincide con los ejemplos vetados.
