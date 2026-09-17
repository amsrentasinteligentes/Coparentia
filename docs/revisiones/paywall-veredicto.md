# VEREDICTO revisor-visual — paywall
Histórico: r1 31·15·18 · r2 27·14·17 · r3 33·16·18 · r4 32·14·18 · r5 30·14·16
Fecha: 2026-09-17 18:30
Screenshot: docs/revisiones/paywall-paso1-375.png
Screenshots adicionales: docs/revisiones/paywall-paso2-precio-375.png · docs/revisiones/paywall-paso1-1440.png · docs/revisiones/paywall-paso2-precio-1440.png
Código revisado: app/paywall/page.tsx · components/funnel/ui.tsx · components/funnel/PanelExpediente.tsx · components/landing/tokens.css
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Paso 2 · 375 · y≈630-642] Franja transparente de 12px en el bloque sticky: `sticky bottom-0 z-10 -mx-4 px-4 pt-3` lleva el padding superior SIN fondo (el `bg-[var(--bg)]` vive en el div interior, page.tsx L615-621). El texto "Funciona aunque la otra persona no la use" y su ícono se ven pasar a plena opacidad entre el degradé y el fondo sólido, como tachados bajo el CTA al abrir la pantalla → mover `pt-3` al div interior que tiene el fondo.
2. [Halo del titular · ambos pasos · 375 y 1440] Sigue con bordes rectos: rectángulo más claro que coincide con la caja del `<Halo>` (375: x 15→360 desde y≈72, la fila del chevron; 1440: x 810→1290 desde y≈88). El cambio (7) NO se cumple → recortar el span en elipse (`rounded-[50%]`) o pintar el halo como elipse sólida al 26% con `filter: blur(40px)`; ningún residuo del gradiente puede tener esquina.
3. [CTA "Abriendo…" · ui.tsx L216] `disabled:opacity-40` apaga el botón entero, texto incluido: #0B1524 sobre acento al 40% sobre #0B1524 ≈ 1.97:1. El único feedback de la acción de pago queda ilegible hasta 6 s → quitar la opacidad; relleno al 100% (o 70%) + spinner inline + texto a contraste pleno.
4. [Paso 2 · 375 · bloque sticky 182px = 22% del viewport + cabecera 118px] Solo 1 de 3 beneficios visible al abrir; el aviso de renovación parte en 2 líneas con "cuando quieras" huérfano (y≈775-795) → sticky solo con CTA + 1 línea corta ("Hoy no pagas nada · Cancela cuando quieras"); garantía + Hotmart en una fila de 12px sobre los planes o dentro del `details`.
5. [Titular paso 2] "Una captura de WhatsApp no prueba nada" es un claim jurídico absoluto que FICHA-AVATAR (objeción 3: "organiza tu evidencia… no reemplaza asesoría legal") no respalda; una captura sí puede valorarse ante un juez → "Una captura de WhatsApp se pierde en el chat — tu expediente queda fechado y ordenado".
Menores (no bloquean): (a) tres variantes de contenedor de ícono en la misma vista a 1440 (panel: cuadrado 40px con borde · paso 2: círculo 32px · paso 1: círculo 24px); (b) pie mezcla 13px y 11px y falta el "·" entre Términos y Privacidad (L652-663); (c) la línea "≈ $ COP" aparece tras el fetch de TRM y empuja las tarjetas ~20px (CLS) — reservar la altura; (d) en Chromium estrecho la X y "Paso N de 2" se corren ~15px entre pasos por la barra de scroll que solo aparece en el paso 2 — `scrollbar-gutter: stable`; (e) CheckPlan queda ~6px por encima del centro de "Anual"/"Mensual" (`items-start` + `mt-0.5`); (f) "Hecho con tus 6 respuestas" vs panel del expediente con 5 filas (atribución no se muestra) — un avatar que cuenta lo nota; (g) `CheckPlan` anima sin respetar reduced-motion (page.tsx L61-64).
Cambios r4→r5: (1) encabezado unificado ✓ · (2) CTA sticky dentro del viewport ✓ pero con franja transparente (defecto 1) · (3) paso 2 cabe en 1440×900 ✓ (pie en y=826) · (4) "Corregir" visible en 375 ✓ (área táctil ~29px, bajo 44) · (5) cuenta el rol ✓ · (6) COP en línea propia ✓ · (7) halo sin bordes rectos ✗ (defecto 2) · (8) pie en una fila ✓ a 1440.
