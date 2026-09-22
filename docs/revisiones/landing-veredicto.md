# VEREDICTO revisor-visual — landing (variante CLARA "Cuidado en calma", ronda 5 — capturas con reveal disparado)
Histórico: oscura r-antigua 37·17·18 · r4 34·15·17 · r5 32·15·15 · r6 33·16·16 · clara r1 33·14·17 · r2 33·15·17 · r3 33·16·17 · r4 31·16·16 · r5 35·16·16
Fecha: 2026-09-22 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:4 h4:4 h5:3 h6:4 h7:4 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:4 acción:3

Verificado de la r4: (1) badge "AHORRAS US$30.88 AL AÑO" — aritmética correcta (12×9.99−89) y una sola
mención de "gratis" por tarjeta ✓ (app/page.tsx:170 · Oferta.tsx:161-165). (2) --accent-ink #2757A8
(6.5:1) en kickers, ahorro anual y números de paso ✓ (tokens-claro.css:37 · Solucion.tsx:107 ·
ui.tsx:90,313). (3) foto de Solución reencuadrada + velo cálido ✓ (app/page.tsx:114-118). (4) bullets
y CTA del plan mensual sin repeticiones ✓ (app/page.tsx:190-195). (5) CERO secciones en opacity 0 en
ambos anchos ✓. CTA héroe: los 4 anclas pasan (4.4:1 sobre --bg, whileTap 0.97 + aria-busy, nunca
disabled, 56px ancho completo). Gate de conversión: titular con énfasis ✓ · 3 hairlines degradé ✓ ·
chips SVG sin emojis ✓ · secciones alternadas con borde ✓.

Top defectos:
1. [Hero + Oferta + CTA final] "7 días gratis" nunca dice si piden tarjeta para empezar: es la
   sorpresa #1 del checkout Hotmart y no está prevenida (app/page.tsx:73 y 243 · Oferta.tsx:173
   "Incluye 7 días de prueba, sin cobro") → añadir el dato exacto en las 3 apariciones
   ("Sin tarjeta para empezar" o "Pides la tarjeta hoy; el cobro entra el día 8").
2. [Toda la página — copy eje 2] Cero prueba social en 10 secciones: ningún testimonio, ninguna
   cifra de uso; el socialProof del hero (app/page.tsx:73) solo repite la garantía → agregar 2-3
   testimonios reales con nombre+ciudad entre Garantía y FAQ, o declarar el vacío y compensar con
   una demo en video del Sello de Confianza.
3. [Oferta → features del plan Anual] Jerga que Carlos no usa: "PDF foliado" (app/page.tsx:177) y
   "Registro de autorizaciones y controversias" (app/page.tsx:179) → "PDF con cada página numerada"
   y "Autorizaciones y desacuerdos, por escrito".
4. [Hero — eje movimiento] El bloque héroe entra con un único fade de 300ms de TODO el contenido
   (Hero.tsx:132-136) mientras el resto de la página sí escalona: falta la baseline #1 en la
   pantalla que más se ve → variants de useReveal (stagger 0.07) sobre h1 / subtítulo / CTA /
   pilares, con reduced-motion ya resuelto en el hook.
5. [Sección "Para abogados" tras el CTA final] Audiencia B2B (app/page.tsx:249) con su propio CTA
   después del cierre emocional: rompe "una sola acción primaria" y es lo último que lee un padre
   antes del footer → moverla a /para-abogados y dejar en el footer un enlace de una línea, o
   comprimirla a 2 líneas + enlace de texto (sin CtaButton).
