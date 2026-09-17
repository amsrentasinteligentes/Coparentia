# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 18:40
Screenshot: docs/revisiones/paywall-paso2-precio-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:4 h2:4 h3:3 h4:3 h5:2 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:4 especificidad:4 emoción:3 oferta:3 acción:4

Capturas puntuadas: paywall-paso1-375.png (INVÁLIDA: stale) · paywall-paso2-precio-375.png ·
paywall-paso1-1440.png · paywall-paso2-precio-1440.png
Código verificado: app/paywall/page.tsx · components/funnel/ui.tsx · components/funnel/PanelExpediente.tsx

Correcciones de la ronda anterior — verificación independiente:
- CTA sticky a 375px: CONFIRMADO en código (page.tsx:595 `sticky bottom-0 ... lg:static`) y visible
  en paywall-paso2-precio-375.png con garantía + pago seguro dentro del bloque.
- Plural: CONFIRMADO en código (page.tsx:338 `n === 1 ? 'tu respuesta' : ...`) y en el render 1440.
  NO confirmado a 375px: la captura del paso 1 sigue mostrando el texto viejo → captura stale.
- Panel de computador lleno: PARCIAL. Ya no está vacío (expediente real o 3 pilares), pero conserva
  ~60% de aire y sigue sin eje compartido con la columna derecha.
- Halo acotado: CONFIRMADO en código (ui.tsx:124 `inset-x-0`). La barra horizontal que aún se ve en
  paywall-paso1-375.png pertenece a la captura vieja.
- Marcador con text-decoration + skip-ink: CONFIRMADO (ui.tsx:102-105), sin cruce de descendentes en
  "WhatsApp" a 1440.
- --surface-2 en bloques hundidos: CONFIRMADO (page.tsx:489, 522).

Top defectos:
1. [evidencia · paso 1 a 375px] paywall-paso1-375.png es una captura ANTERIOR al fix (muestra "Hecho
   con tus 1 respuestas" y barra de scroll horizontal, ambos ya corregidos en código; el render a
   1440 con los mismos datos dice "tu respuesta") → re-capturar el paso 1 a 375px con el build
   actual; hasta entonces el paso 1 móvil queda SIN verificar.
2. [CTA final · paso 2] el botón lleva a un cobro REAL de Hotmart y el webhook no está conectado
   (page.tsx:8-12): quien paga no recibe cuenta ni acceso automático → conectar el webhook antes de
   publicar, o mostrar bajo el CTA la línea de qué pasa después del pago + alta manual garantizada.
3. [computador · columna izquierda, ambos pasos] el panel conserva ~60% de aire y arranca 125px más
   abajo que el header derecho (titular izq. y≈313 vs. derecho y≈188): las dos columnas no comparten
   eje → alinear el panel al arranque de la columna derecha (justify-start + mismo padding-top) y
   mostrar expediente Y pilares juntos en vez de excluyentes.
4. [computador · paso 2, pie] a 1440×900 la columna derecha desborda: "Términos · Privacidad" queda
   pegado al borde inferior (y≈883/900) y el lg:py-12 se pierde → en ≥1024px pasar de
   `lg:justify-center` a `justify-start` con padding fijo cuando el contenido excede el viewport.
5. [375px · paso 2, bajo el CTA sticky] el `pb-[max(8px,env(safe-area-inset-bottom))]` vive en el
   contenedor sticky, fuera del div con `bg-[var(--bg)]`: queda una franja transparente bajo el botón
   por la que se ve pasar el contenido al scrollear → mover el padding-bottom al div con fondo.
