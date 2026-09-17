# VEREDICTO revisor-visual — landing
Histórico: r-antigua 37·17·18 (solo 375) · r4 34·15·17 (primera medición a 1440) · r5 32·15·15 (375 + 1440 + hero 1440×900)
Fecha: 2026-09-17 12:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Evaluado a 375px (docs/revisiones/landing-375.png), 1440px página completa (docs/revisiones/landing-1440.png)
y primer viewport 1440×900 (docs/revisiones/landing-hero-1440.png). Código verificado: app/page.tsx +
components/landing/*.tsx + tokens.css.
Detalle: h1:3 h2:3 h3:4 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:4 · jerarquía:4 profundidad:2 identidad:3
movimiento:3 encaje:3 · copy idea:4 especificidad:2 emoción:3 oferta:3 acción:3.
Falla el gate doble (32 < 36 · 15 < 16) y el gate de copy (15 < 16, con un eje en 2).

Cambios de r4 verificados: subrayado <Accent> continuo (skip-ink none, 0.10em — ui.tsx 77-79) ✓ ·
Problema/Agitación a 760px en lg ✓ · Mensual con bullets concretos ✓ · garantía nombrada 2 veces ✓ ·
FAQ "US$100 por cada correo" ✓ · tarjeta del hero con pb-6 y fondo --bg ✓ (queda una franja inferior de
tono apenas distinto al PNG en 1440, y≈492-517 — verificar que el asset use exactamente #0B1524).

Top defectos:
1. [CTA final, bloque invertido] acento #5B93E8 sobre #E6EDF7 mide 2.6:1 — fallan el 3:1 las palabras "bajo control"/"en calma" del H2 (texto grande) Y el relleno del botón de 56px contra su fondo inmediato (ancla del CTA vivo); el "bloque de máximo contraste" es el de menor contraste de la página → en CtaFinal.tsx definir `--accent-on-light: color-mix(in oklab, var(--accent) 70%, var(--bg))` (≈5:1) para Accent y CtaButton dentro de esa sección, o volver al fondo oscuro con halo.
2. [Oferta, CTAs de ambas cards] "Elegir mensual" y "Empezar mis 7 días gratis" apuntan los dos a '/onboarding' sin parámetro (page.tsx 142 y 154): la elección de plan se descarta y el usuario debe recordarla y repetirla en el paywall; "Elegir mensual" no elige nada → `ctaHref: '/onboarding?plan=anual' | '?plan=mensual'` y preselección en el paywall.
3. [Agitación "Hoy"/"En 6 meses" · Solución "Antes"/"Después"] anillos "0%", "0%", "0%", "100%" sin unidad ni referente: datos decorativos inventados (ui.tsx 158-160 exige valor y etiqueta reales) → quitar anilloHoy/anilloFuturo/anilloAntes/anilloDespues (page.tsx 80, 83, 100, 103) o sustituir por un dato real etiquetado ("6 de 6 meses con comprobante").
4. [Sección "Para abogados de familia", entre el PS y el footer] claims sin prueba en día 1 — "conecta a diario con padres separados", "nuestros usuarios ya están buscando", "Cupos limitados por ciudad" (AnuncioAbogados.tsx 53, 56-58, 81) — y un segundo CTA a otra audiencia después del cierre → reescribir en futuro honesto sin "cupos limitados" y mover el bloque a /abogados enlazado desde el footer.
5. [Garantía, H2 · Carrusel a 1440] "la Garantía del Primer Expediente" arranca en minúscula (page.tsx 168 mete el artículo en el nombre); y en computador la pista del carrusel centra el primer frame y deja vacía la mitad izquierda (AppPorDentro.tsx 140, px-[max(20px,calc(50%-125px))]) → nombre="Garantía del Primer Expediente" y en lg iniciar el padding en calc(50% - 395px) para centrar los 3 frames (790px).
