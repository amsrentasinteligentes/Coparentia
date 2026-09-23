# VEREDICTO revisor-visual — landing (variante CLARA "Cuidado en calma", ronda 8)
Histórico: oscura r-antigua 37·17·18 · r4 34·15·17 · r5 32·15·15 · r6 33·16·16 · clara r1 33·14·17 · r2 33·15·17 · r3 33·16·17 · r4 31·16·16 · r5 35·16·16 · r6 35·17·16 · r7 37·17·17 · r8 36·16·18
Fecha: 2026-09-23 11:20
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA

Detalle usabilidad: h1:3 h2:4 h3:3 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:4 especificidad:3 emoción:4 oferta:4 acción:3

## Veredicto sobre la sección nueva (DemoSello)
AYUDA más de lo que estorba, y se queda — pero con regresiones medibles.
- **Copy especificidad 2 → 3.** La rúbrica acepta la demo como prueba: la página ya no solo CUENTA
  el mecanismo, lo enseña funcionando con datos concretos (Andrés, Sofía/Martín, montos).
  No llega a 4 porque los claims numéricos duros siguen sin respaldo al lado ("10 minutos",
  "cientos de dólares en honorarios", "los US$100 que cobra un abogado por correo") y no hay
  testimonios. Con esto YA NO hay ningún eje de copy ≤2 → se cierra el sub-umbral abierto en r7.
- **Ubicación correcta.** Entre garantía y FAQ no interrumpe el camino oferta→CTA, y el sticky
  de celular mantiene el botón a la vista mientras se ve el video.
- **Póster: NO parece pantalla en blanco.** Verificado el archivo real
  (public/demo/demo-sello-poster.jpg): es la pantalla de Inicio con datos semilla ricos
  (cuota al día, $449.934, 3 de 9 meses, próximo evento). PERO es la MISMA imagen que ya
  aparece dos veces arriba y NO muestra ningún Sello → en reposo, con reduced-motion o si el
  autoplay falla, el titular promete "el Sello en acción" y entrega la portada de la app por
  tercera vez. Comunica, pero no prueba (defecto 2).
- **Regresiones que costaron 1 punto cada una:** el video no tiene controles (h3 4→3) y la
  sección rompe la alternancia base↔elevada con la FAQ (profundidad 4→3).

## Verificaciones de código (no inventadas)
- reduced-motion: `useReducedMotion` corta el IntersectionObserver y activa `controls`
  (DemoSello.tsx:31,38,96) ✓. useReveal/CountUp/MiniRing/Sticky siguen resueltos ✓.
- Movimiento (7 baseline): stagger `useReveal` en la sección nueva ✓ · CountUp precios ✓ ·
  MiniRing se dibuja ✓ · tap 0.97 (ui.tsx:306-311) ✓ · AnimatePresence sticky ✓.
- CTA héroe (4 anclas): acento #2F6FDC 4.5:1 ✓ · whileTap + aria-busy ✓ · nunca disabled ✓ ·
  56px y ancho completo a 375 ✓.
- Gate de conversión: titular con énfasis ✓ · hairlines degradé en presupuesto (2 `emphasis`:
  plan anual Oferta.tsx:150 y marco del video DemoSello.tsx:87 — dentro del máx 3) ✓ ·
  chips SVG sin emojis, incluidos los 3 pasos numerados de la demo ✓.
- Fidelidad FICHA-ARTE §"Variante CLARA": hex, radios 22/999/28 y Figtree+Nunito Sans coinciden
  en 375 y 1440, incluido el marco nuevo → FIEL.
- Gate de carga cognitiva: 0 fallas nuevas (la demo son 3 pasos, 1 video, 0 decisiones).

## No corregible hoy (decisión del usuario — no ocupa slot, sigue pesando en la nota)
- Sin testimonios → copy especificidad tope en 3 y copy acción en 3.
- "Para abogados" después del cierre emocional → h8 = 3 (dos audiencias, dos acciones).
- Logo/isotipo gris apagado sobre fondo claro → identidad = 3.

Top defectos:
1. [components/landing/DemoSello.tsx:88-102 y 42-46] El video de 24 s no tiene controles salvo con
   reduced-motion (`controls={reduce}`, línea 96) y el botón de play desaparece para siempre tras
   el primer arranque: al pausarse al salir de pantalla (línea 45) nunca vuelve
   `setReproduciendo(false)`, así que el visitante no puede pausar, rebobinar ni repetir el cuadro
   del Sello → poner `controls` siempre (o un par pausa/repetir de 44px) y añadir
   `setReproduciendo(false)` en la rama `else` de la línea 45.
2. [public/demo/demo-sello-poster.jpg, referenciado en DemoSello.tsx:91] El póster es la pantalla
   "Inicio", idéntica al visual del hero (app/page.tsx:82) y al primer frame de AppPorDentro
   (app/page.tsx:149), y no contiene ningún Sello → exportar como póster el cuadro del video con el
   comprobante YA sellado (badge del Sello + fecha legible a 300px de ancho); es el único estado que
   ven quienes tienen reduced-motion o autoplay bloqueado.
3. [components/landing/DemoSello.tsx:58 vs components/landing/Faq.tsx:42] Dos secciones seguidas con
   `elevacion="base"`: la demo y la FAQ se funden en un mismo plano, separadas solo por el hairline
   de 1px (visible en docs/revisiones/landing-1440.png) → cambiar la demo a `elevacion="elevada"`
   para recuperar la alternancia base↔elevada de toda la página.
4. [app/page.tsx:219-223 vs app/page.tsx:132-136] Los 3 pasos de la demo repiten casi palabra por
   palabra los 3 pasos de la sección Solución ("subes el comprobante · el Sello lo fecha · queda en
   tu expediente") → sustituirlos por 3 marcas de tiempo del video ("0:04 registras · 0:11 el Sello
   fecha · 0:19 PDF exportado") o eliminarlos: −3 líneas repetidas, la demo pasa a aportar dato nuevo.
5. [components/landing/DemoSello.tsx:93-95 y 105-116] Con `preload="none"` y sin indicador de carga,
   al tocar play en conexión lenta el botón desaparece y no pasa nada visible hasta que el video
   bufferea (acción >100ms sin feedback) → mostrar un spinner inline en el evento `waiting`/`loadstart`
   y ocultar el overlay solo en `playing`.
