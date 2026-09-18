# VEREDICTO revisor-visual — landing
Histórico variante OSCURA: r-antigua 37·17·18 (solo 375) · r4 34·15·17 · r5 32·15·15 · r6 33·16·16 — variante CLARA "Cuidado en calma" (opción C del A/B/C): clara r1 33·14·17 · clara r2 33·15·17 · **clara r3 (commit 3e7f5f7) 33·16·17**
Fecha: 2026-09-17 23:59
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA

Evaluado a 375px (landing-375.png página completa + landing-hero-375.png) y 1440px (landing-1440.png, landing-clara-hero-1440.png).
Referencia: opción C de docs/revisiones/direcciones-abc-landing.png.
Código verificado: app/page.tsx · tokens-claro.css · tokens.css · Hero.tsx · ui.tsx · CtaFinal.tsx · Oferta.tsx · Solucion.tsx · Problema.tsx ·
Agitacion.tsx · AppPorDentro.tsx · Garantia.tsx · Faq.tsx · AnuncioAbogados.tsx · MarkedCopy.tsx (grep) · FICHA-ARTE.md §83-106 · FICHA-AVATAR.md.
Detalle: h1:3 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:4 · jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3 ·
copy idea:3 especificidad:3 emoción:4 oferta:3 acción:4.
Gates: usabilidad 33 < 36 ✗ · craft 16 ≥ 16 ✓ · copy 17 ≥ 16 ✓ (ningún eje ≤2) · fidelidad 0/6 fallos ✓ → NO LISTA.

Fixes de r2 verificados: (1) subtítulo con "sin depender de la otra persona" (page.tsx 69) ✓ y dolor ★ literal "mala paga" en Problema
(page.tsx 86) ✓ · (2) --text-tertiary #5b6d88 (tokens-claro.css 28): 4.9:1 sobre #f3f7fc, 4.5:1 sobre #e7eef8 ✓ — pero FICHA-ARTE.md línea 95
sigue diciendo #667891 (ficha desactualizada) · (3) pie del FotoLugar centrado arriba, max-w-[70%] (ui.tsx 474): se lee completo en hero y
Solución a 375 y 1440 ✓ · (4) badge "3 MESES GRATIS" ✓ y Mensual con "Todas las funciones del plan Anual" ✓ — pero Oferta.tsx 175 sigue
pintando `anual.ahorro` = "3 meses gratis" bajo el precio: el ahorro se dice DOS veces (badge + línea), no una · (5) Hairline radio="button"
en el chip del mecanismo (Solucion.tsx 81) ✓ y CtaButton con `yendo` → opacity-80 + aria-busy (ui.tsx 299-311) ✓.
Fidelidad (6/6): claro ✓ · hue azul (#2f6fdc vs #3F7FE6 de la C, misma familia) ✓ · Figtree/Nunito Sans ✓ · 22/999 + blobs ✓ · densidad ✓ ·
sombras tintadas ✓. Escena del hero (blob + foto + teléfono + burbuja + 3 píldoras) coincide con la C.
CTA héroe vivo: #2f6fdc sobre #f3f7fc 4.5:1 ✓ · whileTap 0.97 ✓ · nunca disabled ✓ · 56px ancho completo ✓ · estado pendiente ✓.
Anclas de conversión: titular con énfasis ✓ · hairlines 3 (chip mecanismo, card anual, garantía) ✓ · chips SVG sin emojis ✓ ·
secciones distinguibles ✓ · texto AA sobre su fondo ✗ (defecto 2: burbuja del hero).
Movimiento (código): stagger useReveal ✓ · CountUp en precios ✓ (el "10 minutos" del hero es estático) · MiniRing existe pero NO se usa
(ningún anillo/barra se dibuja en la página) · whileTap ✓ · dots del carrusel transition-colors ✓ · FAQ height/opacity 280ms ✓ ·
celebración N/A · reduced-motion ✓ en todos.
Gate cognitivo: 1 falla (PS del CtaFinal ≈6 líneas a 375px) — no crítico.

Top defectos:
1. [Oferta, card Anual · Oferta.tsx 155-175 + page.tsx 158-161] "3 MESES GRATIS" (badge), "7 DÍAS GRATIS" (TrialBadge, misma fila del título), "3 meses gratis" (línea 175 en acento) y "Tras los 7 días gratis": cuatro "gratis" en una card de 335px — el lector no sabe si le regalan 7 días o 3 meses; además el Mensual lista "Sello de Confianza" justo debajo de "Todas las funciones del plan Anual" (redundante) → borrar el <p> de `anual.ahorro` (línea 175) o hacer `ahorro` opcional y no pasarlo; TrialBadge solo en el Mensual o cambiarlo por texto "Incluye 7 días de prueba" bajo el CTA; en Mensual quitar el bullet del Sello.
2. [Hero, burbuja "Tu primer expediente" · Hero.tsx 185-188] degradé arranca en --accent-2 #5b93e8 con texto blanco 12px al 85% de opacidad: mide ≈2.8:1 (3.1:1 al 100%) — el mismo fallo que ya se corrigió en el CtaFinal (tokens-claro.css 52-54) → `linear-gradient(150deg, var(--accent), var(--accent-deep))` y `opacity-85` → `opacity-100` (blanco sobre #2f6fdc = 4.7:1).
3. [Hero H1 a 375px · Hero.tsx 137] con 38px/800 y text-balance el titular parte en "Menos / discusiones por / dinero. Más calma / para tus hijos.": la primera línea es una sola palabra de 5 letras y el bloque se lee desequilibrado (visible en landing-hero-375.png) → `text-[34px]` en móvil (cabe "Menos discusiones" en 335px) o `[text-wrap:pretty]`, conservando 56/58px en md/xl.
4. [Todos los CTA al mismo destino /onboarding · page.tsx 37, 162, 175 + ui.tsx 330] cuatro etiquetas distintas para la misma acción: "Crear mi expediente gratis" (hero/mid/final), "Empezar mis 7 días gratis" (anual), "Elegir mensual" (mensual), "Ver plan y precios" (sticky) — un mismo componente que cambia de verbo según la sección (h4) → anual: "Crear mi expediente gratis" (mismo verbo del hero, regla 42); mensual: "Crear mi expediente · mensual"; sticky pre-oferta puede quedarse ("Ver plan y precios" es otra acción real).
5. [Radios del kit · Hero.tsx 170 (26px), 185 (26px/8px), AppPorDentro.tsx 148 (30px), ui.tsx 474 (12px) vs --radius-card 22px] cuatro radios distintos en tarjetas de la misma familia visual (marco del teléfono en hero 26px, en carrusel 30px, burbuja 26px, pie de foto 12px, cards 22px) → un token `--radius-phone: 26px` usado en ambos marcos, burbuja a `rounded-[var(--radius-card)]`, pie a `rounded-[var(--radius-button)]`; y actualizar FICHA-ARTE.md línea 95 a `--text-tertiary #5B6D88 (4.9:1 sobre --bg)`.
