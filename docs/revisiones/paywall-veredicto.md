# VEREDICTO revisor-visual — paywall (pantalla de planes, 2 pasos)
Fecha: 2026-10-20 12:00
Screenshot: docs/revisiones/r27b-planes-1.png (paso 1) · r27b-planes-2.png (paso 2) · r27b-planes-1-fin.png · r27b-planes-2-fin.png
Usabilidad: 30/40 (h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3)
Craft: 14/20 (jerarquía:3 profundidad:3 identidad:2 movimiento:3 encaje:3)
Copy (si vende): 15/20 (idea:3 especificidad:3 emoción:3 oferta:3 acción:3)
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Paso 2, cuerpo completo] Identidad: fuera del escudo del paso 1 y los mini-sellos de 18 px, la pantalla de decisión es azul + blanco + tarjetas redondeadas intercambiable con cualquier SaaS fintech; el halo es casi invisible y el subrayado del marcador (45% de acento, 0.13em) no se ve en el render. Fix: dar al paso 2 un dispositivo propio visible (sello grande del Sello de Confianza o hairline degradé más fuerte en la tarjeta Anual) y subir el subrayado a 70-80% de acento.
2. [Paso 1, fila "Expediente exportable en PDF foliado"] La miniatura real del PDF (44x57 px) es ilegible, no prueba nada, y deja "foliado" huérfano en un 2.º renglón. Fix: ampliarla (~72x94) con toque para ver en grande, o quitarla y dejar la fila en una línea.
3. [Paso 2, titular vs precio] El titular (24 px) y el precio (26 px) compiten: el héroe es ambiguo y los dos niveles casi no se distinguen. Fix: titular a 28 px o precio a 32 px, para que el precio sea el único héroe.
4. [Paso 1, primer pliegue] La barra fija (garantía + botón) tapa la tarjeta de los 7 días: la línea del "aviso del día 5" y las señales de pago seguro/Colombia quedan bajo el pliegue, y el sello de garantía parece tocable pero solo es enlace en el paso 2 (inconsistencia). Fix: compactar el bloque superior para que la tarjeta entre completa, y hacer el sello del paso 1 también enlace a /reembolsos o quitar el subrayado en el paso 2.
5. [Paso 2, pie bajo el botón] Tres capas de confianza más cuatro enlaces (Ahora no / Dudas / Términos / Privacidad) y el nombre del vendedor "amsrentasinteligentes" cerca del cobro: sensación de letra chica y de nombre desconocido justo al pagar. Fix: fusionar "Pago seguro con Hotmart" con la línea bajo el botón y explicar en una frase por qué aparece ese nombre como vendedor.

Cumplimiento de cambios pedidos: botón del paso 1 OK; miniatura del PDF presente (pero ilegible); mini sello en la garantía de ambos pasos OK; nota del día 5 en una sola línea OK; titular del paso 2 en 24 px OK, pero el subrayado no es perceptible en el render. CTA héroe vivo: contraste, whileTap 0.97, nunca deshabilitado por defecto (valida al toque con mensaje) y alto táctil completo. Heurísticas 3/7 verificadas en código: volver/cerrar/Ahora no, plan y correo recordados, Enter envía, flechas en radiogroup, sugerencia de dominio mal escrito. Movimiento (código): entrada escalonada, conteo del precio, línea del timeline que se dibuja, whileTap, transición entre pasos y reduced-motion presentes; sin celebración (no aplica aquí). Gate doble: 30/40 y 14/20 no llegan a 36/16; copy 15/20 no llega a 16.
