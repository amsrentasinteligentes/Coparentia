# VEREDICTO revisor-visual — landing
Histórico variante OSCURA: r-antigua 37·17·18 (solo 375) · r4 34·15·17 · r5 32·15·15 · r6 33·16·16 — desde aquí empieza la variante CLARA "Cuidado en calma" (opción C del A/B/C, commit c0f4a4c): **clara r1 33·14·17**
Fecha: 2026-09-17 22:40
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 33/40
Craft: 14/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA

Evaluado a 375px (docs/revisiones/landing-375.png + landing-hero-375.png), 1440px página completa (landing-1440.png),
primer viewport 1440 (landing-clara-hero-1440.png, anterior al ajuste de posición) y cierre azul (landing-ctafinal-1440.png).
Referencia: opción C de docs/revisiones/direcciones-abc-landing.png (tercera columna + tercer bloque de computador).
Código verificado: app/page.tsx · components/landing/tokens-claro.css · tokens.css · Hero.tsx · ui.tsx · CtaFinal.tsx · Problema.tsx ·
Oferta.tsx · Solucion.tsx · AppPorDentro.tsx · AnuncioAbogados.tsx · Faq.tsx (grep aria-expanded) · FICHA-ARTE.md §83-101 · FICHA-AVATAR.md.
Detalle: h1:3 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:4 · jerarquía:3 profundidad:4 identidad:2 movimiento:3 encaje:2 ·
copy idea:4 especificidad:3 emoción:3 oferta:4 acción:3.
Gates: usabilidad 33 < 36 ✗ · craft 14 < 16 ✗ · copy 17 ≥ 16 ✓ (ningún eje ≤2) · fidelidad 0/6 fallos ✓ → NO LISTA.

Fidelidad (6/6): modo claro ✓ · hue azul ✓ · display Figtree (redondeada) ✓ · radios 22/999 + blob ✓ · densidad ✓ · sombras suaves tintadas ✓.
Desvío NO contado en los 6 pero visible: la C mostraba bajo el hero la fila de 3 píldoras "Gastos al día · Comprobantes con fecha · Mente en calma"
(el mensaje literal de la referencia); la construcción la eliminó.
CTA héroe vivo: #2f6fdc sobre #f3f7fc = 4.5:1 ✓ · whileTap 0.97 (ui.tsx 295) ✓ · nunca disabled ✓ · 56px ancho completo ✓.
Anclas de conversión: titular con énfasis ✓ · hairlines 2 (chip mecanismo, card anual) ✓ · chips SVG, cero emojis ✓ · secciones distinguibles ✓.
Fixes de r6 verificados: #1 PNG del hero ahora envuelto en <a href=/onboarding> ✓ · #3 kickers "CÓMO FUNCIONA"/"PLANES Y PRECIOS" ✓ ·
#4 items-stretch + Mensual con 4 bullets y garantía ✓ · #2 AnuncioAbogados sigue entre CTA final y footer ✗ · #5 CtaButton sigue sin estado pendiente ✗.

Top defectos:
1. [Hero, escena foto+teléfono, 375 y 1440] el teléfono (left 6%, w 44%, Hero.tsx 166) y la burbuja (right 0, w 52%, Hero.tsx 181) tapan ~45% de la mitad inferior de la foto; el pie del marcador queda cortado ("amá e hijo sonriendo con el celular" a 375, "…lular" a 1440) y con una foto real taparían el cuerpo del sujeto → foto a `h-[64%] w-[74%]`, teléfono a `w-[38%] left-0`, burbuja a `bottom-2 right-0 w-[48%]`, y el pie de FotoLugar arriba (`items-start`) para que nunca choque con la captura.
2. [Toda la página bajo el hero] el dispositivo ownable (Blob + foto en forma orgánica) aparece UNA vez (grep: Blob/FotoLugar solo en Hero.tsx); de §2 a §9 es el kit oscuro recoloreado — ni una foto de familia ni una forma orgánica más, cuando las 3 referencias y la FICHA-ARTE ("blobs que enmarcan las fotos") las usan en varios sectores → añadir un FotoLugar en blob-b en Solución ("Después") o Garantía, un Blob a opacidad 0.10 detrás del H2 del CtaFinal, y recuperar la fila de 3 píldoras de la C bajo el hero.
3. [CtaFinal, recap "7 días gratis · Garantía de 15 días" y PS] blanco al 70% (13px) y 84% (15px itálica) sobre el degradé #5b93e8→#2757a8: en el centro (~#4175c8) miden 3.1:1 y 3.7:1; en la esquina clara 2.3:1 — bajo AA (tokens-claro.css 54-55) → `--cta-final-text-2: #ffffff` y `--cta-final-text-3: rgb(255 255 255 / 0.92)`, o el degradé desde `var(--accent)` en vez de `--accent-2` (blanco sobre #2f6fdc = 4.7:1).
4. [FICHA-ARTE §Variante clara vs tokens-claro.css] la ficha fija --accent #3F7FE6 ("4.6:1 sobre #F3F7FC") y --text-2 #5A6B85; el código renderiza #2f6fdc y #4b5c78. #3F7FE6 mide 3.9:1 sobre blanco y 3.6:1 sobre #F3F7FC — la cifra de la ficha es falsa y la ficha ya no describe lo que se ve → actualizar la ficha a los hex del código (y anotar por qué se oscureció), cosa juzgada = lo renderizado.
5. [Entre el CTA final y el footer, "Para abogados de familia"] un segundo CTA a otra audiencia después del cierre emocional (defecto r6 #2 sin resolver) y botón a mano h-12/15px frente al kit 52px/17px (AnuncioAbogados.tsx 77); además CtaButton es un <a> plano sin estado pendiente (ui.tsx 294) y los dots del carrusel tienen 24px de área táctil (AppPorDentro.tsx 196) → mover el bloque a /abogados enlazado desde FooterLegal (o franja de 1 línea bajo el footer), `<CtaButton variant="outline">`, next/link con estado "yendo" 150ms, dots `size-11`.
