# VEREDICTO revisor-visual — landing (variante CLARA "Cuidado en calma", ronda 9)
Histórico: oscura r-antigua 37·17·18 · r4 34·15·17 · r5 32·15·15 · r6 33·16·16 · clara r1 33·14·17 · r2 33·15·17 · r3 33·16·17 · r4 31·16·16 · r5 35·16·16 · r6 35·17·16 · r7 37·17·17 · r8 36·16·18 · r9 38·16·18
Fecha: 2026-09-23 13:05
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 38/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA

Detalle usabilidad: h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:4 especificidad:3 emoción:4 oferta:4 acción:3

## Las 5 correcciones de la r8 — verificadas una por una
1. `controls` SIEMPRE en el video (DemoSello.tsx:102) y `setReproduciendo(false)` en la rama `else`
   del observer (DemoSello.tsx:47) ✓ → h3 3→4 (el visitante puede pausar, rebobinar y repetir el
   cuadro del Sello; el overlay de play vuelve al salir de pantalla).
2. Póster nuevo verificado en el archivo real (public/demo/demo-sello-poster.jpg): es el cuadro
   "Sello de Confianza aplicado · Queda fechado el 23 de septiembre de 2026", con escudo acento y
   fecha legible a 300px ✓. Ya NO repite la pantalla de Inicio del hero (defecto 2 de r8, cerrado).
3. `elevacion="elevada"` en la demo (DemoSello.tsx:62) ✓ — pero el choque de planos se MOVIÓ, no se
   resolvió: ahora Garantía (elevada, Garantia.tsx:33) y la demo quedan en el mismo plano (defecto 1).
4. Los 3 pasos son marcas de tiempo con dato nuevo (app/page.tsx:220-222: monto que se llena solo,
   fecha literal, PDF con partes y totales) ✓ — cero repetición de Solución.
5. Indicador de carga: onWaiting/onPlaying + `Loader2` dentro del botón (DemoSello.tsx:100-101,
   119-123) ✓ → h1 3→4.

## Verificaciones de código (no inventadas)
- reduced-motion: `useReducedMotion` corta el observer (DemoSello.tsx:32,40) y el overlay no se
  pinta (línea 111) — con los controles nativos siempre presentes, el usuario dispara el video ✓.
- Movimiento (7 baseline): stagger `useReveal` ✓ · CountUp de precios ✓ · MiniRing dibujado ✓ ·
  whileTap 0.97 (ui.tsx:306-311) ✓ · AnimatePresence del sticky ✓ · modales/acordeón suaves ✓ ·
  celebración: N/A en landing.
- CTA héroe (4 anclas): acento #2F6FDC ≥4.5:1 ✓ · whileTap + aria-busy ✓ · nunca disabled ✓ ·
  56px de alto, ancho completo a 375 ✓.
- Gate de conversión: titular con énfasis ✓ · hairlines degradé (2 `emphasis`: Oferta.tsx:150 y
  DemoSello.tsx:91, dentro del máx 3) ✓ · chips SVG sin emojis en toda lista, incluidos los 3 pasos
  de la demo ✓ · secciones con mesh + hairline de 1px ✓ salvo el par Garantía/demo (defecto 1).
- Fidelidad FICHA-ARTE §"Variante CLARA": hex, radios 22/999/28 y Figtree+Nunito Sans coinciden en
  375 y 1440 → FIEL.
- Gate de carga cognitiva: 0 fallas nuevas.

## No corregible hoy (decisión del usuario — no ocupa slot, sigue pesando en la nota)
- Sin testimonios → copy especificidad 3 y copy acción 3 (techo mientras no haya clientes).
- "Para abogados" después del cierre emocional → h8 = 3 (dos audiencias, dos acciones).
- Logo/isotipo gris apagado sobre fondo claro → identidad = 3.

Top defectos:
1. [components/landing/Garantia.tsx:33 + components/landing/DemoSello.tsx:62] Dos secciones
   seguidas en `elevacion="elevada"`: garantía y demo se leen como un solo plano en
   docs/revisiones/landing-1440.png (el choque de r8 se movió hacia arriba) → dejar la demo en
   `base` y pasar Faq.tsx:42 a `elevada`, con lo que la cadena vuelve a alternar
   elevada→base→elevada→acento (CtaFinal). Medible: 0 pares adyacentes con la misma elevación.
2. [components/landing/DemoSello.tsx:111-126] El overlay de play ocupa `inset-2`, es decir tapa la
   barra de controles nativa recién habilitada: mientras el video está pausado (estado inicial, o
   tras salir y volver a entrar en pantalla) no se puede usar la línea de tiempo ni el volumen →
   acotar el overlay a la zona superior (`absolute inset-2 bottom-12`) o dejar de pintarlo una vez
   que el video se reprodujo al menos una vez. Medible: barra de controles clicable en todo estado.
3. [app/page.tsx:215-225 (demo) vs app/page.tsx:143 (fin de Solución)] La única PRUEBA del mecanismo
   llega en la posición 7B, después de precio y garantía: quien abandona en la oferta nunca la ve →
   subir `<DemoSello>` justo después de `<Solucion>` (o dejar en Solución un ancla "Ver el Sello en
   24 s" a `#demo`). Medible: la demo entra antes del bloque de precio.
4. [components/landing/DemoSello.tsx:62-131] La sección de prueba no tiene CTA propio y en desktop
   el sticky no existe (ui.tsx:322, solo mobile): tras el pico de convicción, a 1440px el botón más
   cercano queda ~1.400px abajo → añadir el `PrimaryCta` de `CTA_LABEL` bajo los 3 pasos (mismo par
   label/href del hero). Medible: 0 scroll entre el final del video y un botón visible.
5. [components/landing/DemoSello.tsx:116 + public/demo/demo-sello-poster.jpg] El velo del overlay
   (18% de `--text-primary`) sobre un póster ya lavado deja el marco en gris plano hasta que arranca
   el video, justo el estado que ven autoplay bloqueado y reduced-motion → bajar el velo a ~10% o
   aplicarlo solo en degradé desde el centro, para que "Sello de Confianza aplicado · 23 de
   septiembre de 2026" se lea sin tocar nada. Medible: contraste del texto del póster ≥4.5:1 con el
   velo puesto.
