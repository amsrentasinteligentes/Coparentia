# VEREDICTO revisor-visual — onboarding (variante clara, ronda 3)
Fecha: 2026-09-18 23:40
Screenshot: docs/revisiones/onboarding-claro-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Cabecera, todas las capturas] El logo (components/funnel/ui.tsx:18, /logo-horizontal.webp) es gris metálico sobre #F3F7FC: se lee apagado, como placeholder, y es lo primero que ve la persona. FICHA-ARTE.md:94 ya lo anota como pendiente del usuario → fix: exportar logo-horizontal-claro.webp con isotipo y wordmark en --accent-deep (#2757A8) y usarlo bajo .tema-claro; medible: contraste del wordmark vs fondo ≥3:1 (hoy ~2.2:1 estimado por el gris).
2. [Pregunta 1, 375px] Con cero respuestas la tarjeta "Tu expediente" (page.tsx:412 `my-auto pt-4`) flota con ~125px de aire arriba y ~130px abajo (onboarding-claro-p0-375.png, y≈425-545 y y≈680-812) → fix: cuando `contestadas.length === 0` anclar la tarjeta con `mt-6` bajo la caja de contexto y dejar el sobrante abajo; medible: hueco entre InfoContextual y la tarjeta ≤48px a 375×812.
3. [Titulares entre pasos] Los reconocimientos usan h1 26px (page.tsx:685 y :842) y las preguntas 28px (page.tsx:157, :493, :732); además en celular conviven 5 tamaños (28/16/14/13/12: PanelExpediente.tsx:72 y page.tsx:106 en 13px) → fix: h1 28px en los 9 pasos y subir los 13px a 14px; medible: ≤4 tamaños distintos por pantalla.
4. [Banda "Retomamos donde lo dejaste"] "Empezar de nuevo" (page.tsx:243-256) ya confirma con segundo toque, pero sigue sin deshacer: tras confirmar se pierden las 7 respuestas → fix: guardar snapshot de `r`/`paso` antes de limpiar y mostrar toast 5 s con "Deshacer" que lo restaure; medible: tras "Deshacer" el panel vuelve a mostrar las mismas filas contestadas.
5. [Captura de la pregunta 1] onboarding-claro-p0-375.png muestra "rol" SUBRAYADO, contradiciendo tokens-claro.css:38 (`--accent-underline: transparent`) y la captura fresca de la pregunta 3 (sin subrayado): es una captura vieja → fix: recapturar el paso 0 con el build actual; medible: `getComputedStyle(marcador).textDecorationColor` = transparente en la captura nueva.
