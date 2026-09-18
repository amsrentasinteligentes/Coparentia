# VEREDICTO revisor-visual — landing
Histórico variante OSCURA: r-antigua 37·17·18 (solo 375) · r4 34·15·17 · r5 32·15·15 · r6 33·16·16 — variante CLARA "Cuidado en calma" (opción C del A/B/C): clara r1 33·14·17 · **clara r2 (commit ecb6e6b) 33·15·17**
Fecha: 2026-09-17 23:55
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA

Evaluado a 375px (landing-375.png página completa + landing-hero-375.png), 1440px (landing-1440.png, landing-clara-hero-1440.png,
landing-solucion-1440.png). Referencia: opción C de docs/revisiones/direcciones-abc-landing.png.
Código verificado: app/page.tsx · tokens-claro.css · tokens.css · Hero.tsx · ui.tsx · CtaFinal.tsx · Oferta.tsx · Solucion.tsx ·
AppPorDentro.tsx · AnuncioAbogados.tsx · Agitacion.tsx · Faq.tsx · Garantia.tsx · FooterLegal.tsx (grep) · FICHA-ARTE.md §83-106 · FICHA-AVATAR.md.
Detalle: h1:3 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:4 · jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 ·
copy idea:3 especificidad:3 emoción:3 oferta:4 acción:4.
Gates: usabilidad 33 < 36 ✗ · craft 15 < 16 ✗ · copy 17 ≥ 16 ✓ (ningún eje ≤2) · fidelidad 0/6 fallos ✓ → NO LISTA.

Fixes de r1 verificados: #1 escena (foto h-66%/w-74%, teléfono w-38% left-0, burbuja bottom-2 right-0 w-48%, pie arriba) ✓ — pero el pie
sigue cortado por la máscara del blob (ver defecto 3) · #2 píldoras bajo el hero ✓ + FotoLugar en blob-b en Solución ✓ + Blob 0.10 en
CtaFinal ✓ (a la vista es imperceptible: azul 10% sobre azul) · #3 degradé desde #2f6fdc, blanco/92% (4.7:1 / ≥4.3:1) ✓ · #4 ficha con
hex reales ✓ · #5 CtaButton outline en abogados ✓ · dots size-11 ✓. CtaButton sigue sin estado pendiente (ui.tsx 294) ✗.
Fidelidad (6/6): claro ✓ · hue azul ✓ · Figtree ✓ · 22/999 + blob ✓ · densidad ✓ · sombras tintadas ✓. Desvío de COPY respecto a la C
(no cuenta en los 6): la C decía "Sin depender de la otra persona." en el subtítulo; la construcción lo eliminó.
CTA héroe vivo: 4.5:1 sobre #f3f7fc ✓ · whileTap 0.97 ✓ · nunca disabled ✓ · 56px ancho completo ✓.
Anclas de conversión: titular con énfasis ✓ · hairlines 3 (chip mecanismo, card anual, garantía) ✓ · chips SVG sin emojis ✓ ·
secciones distinguibles ✓ · texto AA sobre su fondo ✗ (defecto 2).
Gate cognitivo: 1 falla (PS del CtaFinal ≈6 líneas a 375px) — no crítico.

Top defectos:
1. [Hero H1/subtítulo · page.tsx 68-69] la FICHA-AVATAR fija el ángulo del hero como "mecanismo al frente + uso UNILATERAL" y exige las palabras "sin depender de tu ex" y "blindar" (grep en page.tsx: 0 apariciones; el dolor ★ "mala paga"/"cajero automático" tampoco aparece en ninguna sección) → subtítulo: "Cada comprobante de tus hijos, con fecha, en un solo lugar — [b]sin depender de la otra persona[/b]." (13 palabras, cabe en el tope de 14) y una frase de Agitación o Problema con el dolor ★ literal.
2. [Todo texto en --text-tertiary sobre --bg/--surface-2 · tokens-claro.css 28] #667891 sobre #f3f7fc mide 4.2:1 (no 4.3 como dice la ficha) y sobre #e7eef8 3.9:1: fallan AA "Entrar" 14px en el header móvil, "Te respondemos en menos de 48 horas" 12px, labels "HOY / EN 6 MESES / ANTES" 12px y los enlaces legales del footer 13px → --text-tertiary: #5b6d88 (≈4.9:1 sobre --bg, 4.5:1 sobre --surface-2) o subir esos textos a --text-secondary.
3. [Hero y Solución, pie de los marcadores de foto · ui.tsx 452-460] el pie va a la esquina superior derecha (items-start justify-end) justo donde la máscara orgánica recorta: se lee "Foto: mamá e hijo sonriendo c…" a 375 y a 1440, y "papá guardando un recibo…" en Solución → alinear el pie al centro-superior (`justify-center`) o bajarlo al centro del blob bajo el ícono de cámara, con `max-w-[70%]`.
4. [Oferta, card Anual vs Mensual · page.tsx 157-183 y Oferta.tsx 155] el mismo ahorro se dice dos veces en unidades distintas ("AHORRAS 25%" y "3 meses gratis") y la card Mensual omite "Registro de autorizaciones" y "Alertas" aunque el comentario del código afirma "mismas funciones": el lector concluye que el mensual no tiene alertas → badge "3 MESES GRATIS" (una sola unidad) y en Mensual sustituir un bullet por "Todas las funciones del plan anual".
5. [Chip "el Sello de Confianza" en Solución · Solucion.tsx 81 + ui.tsx 132] el Hairline usa --radius-card 22px y el chip queda como rectángulo redondeado junto a números 01/02/03, píldoras y botones a 999px (única forma de chip por página, según el propio kit) → Hairline con prop `radius="button"` para chips o `rounded-[var(--radius-button)]` en ese uso; además dar a CtaButton un estado pendiente de 150ms (opacidad/spinner inline) al hacer clic, ya que la navegación a /onboarding hoy no da feedback (ui.tsx 294).
