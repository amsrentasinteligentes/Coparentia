# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 16:40
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 31/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Screenshots evaluados: docs/revisiones/onboarding-375.png (paso 1) · docs/revisiones/onboarding-mid-375.png (paso 2) · docs/revisiones/onboarding-1440.png (computador)

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Correcciones declaradas — verificadas en código:
- CERRADO: filas pendientes usan --text-tertiary pleno (#7f93b3 sobre --surface #13233a = 5.1:1, declarado en tokens.css:33). PanelExpediente.tsx:122.
- CERRADO: lista acotada a 3-5 filas + "y N preguntas más" (PanelExpediente.tsx:47-56). Confirmado en el screenshot: 3 filas + "y 4 preguntas más".
- CERRADO: Halo acotado a `inset-x-0` (ui.tsx:124). Sin desborde lateral en el código; no se observa scroll horizontal en los renders.
- CERRADO: panel de computador a 21px semibold sin Marcador (page.tsx:237). En el render de 1440 la pregunta de la derecha es el único héroe.
- PARCIAL: el contador numérico propio de la tarjeta se eliminó, pero quedó DENTRO de la tarjeta una barra de avance de 3px en acento — el mismo lenguaje visual que la barra superior y con otro porcentaje. La contradicción volvió en forma de barra.
- CERRADO: paso persistido (page.tsx:197-212) y aria-hidden retirado del panel + aria-live en la lista (MarcoFunnel ui.tsx:252, PanelExpediente.tsx:92). Falta avisar al usuario que se retomó.

Baseline de movimiento (7, verificadas en código): stagger de chips (ui.tsx:163) ✓ · conteo de número héroe en la meta (page.tsx:614-628) ✓ · anillo de carga y barras que se dibujan (page.tsx:823-836, ui.tsx:39-45) ✓ · whileTap 0.97 (<150ms) ✓ · transición entre pasos (usePasoVariants) ✓ · modales: no existen en esta pantalla (N/A) · celebración spring en los dos reconocimientos ✓ · useReducedMotion en todos los componentes ✓.

CTA héroe vivo (paso "Otra cosa" y reconocimientos): contraste acento #5b93e8 sobre #0b1524 ✓ · whileTap definido ✓ · nunca disabled por defecto, valida al click con role="alert" ✓ · h-14 (56px) ancho completo ✓. Los 4 anclajes pasan.

Anclas de conversión: titular con énfasis ✓ (bold + palabra clave subrayada en acento) · chips SVG sin emojis ✓ · secciones distinguibles y texto AA ✓ · hairline degradé: SOLO en la tarjeta de computador (PanelExpediente.tsx:66-71); en celular la tarjeta usa borde plano → la vista móvil se queda sin ningún hairline degradé.

Top defectos:
1. [Celular, pasos de opciones — bajo la tarjeta "Tu expediente"] ~115px de fondo muerto al fondo del paso 1: PASOS_CON_RESUMEN_MOVIL fuerza `flex-none` (page.tsx:264-267) y nada absorbe el sobrante → fix: dejar `flex-1` en esos pasos y anclar la tarjeta con `mt-auto` (o `justify-between`) para que el aire se reparta y no quede hueco abajo.
2. [Tarjeta "Tu expediente" vs barra del encabezado] dos barras de 3px en acento con porcentajes distintos en la misma vista (PanelExpediente.tsx:81-88 vs ui.tsx:28-47) — es el defecto de "dos contadores" en otra forma → fix: quitar la barra interna de la tarjeta o cambiarla a un lenguaje distinto (segmentos por fila), dejando UNA sola señal de avance.
3. [Tarjeta "Tu expediente" — filas pendientes] los círculos punteados leen como casillas marcables y no responden al tap (regla UX 11); además la etiqueta "Cómo está fijada" queda incompleta fuera de contexto → fix: sustituir el círculo punteado por un guion/línea tenue y renombrar la fila a "Cómo está fijada tu cuota" (page.tsx:166).
4. [Arranque tras retomar] se restauran respuestas y paso desde sessionStorage (page.tsx:197-206) sin decírselo a nadie: quien vuelve aparece en el paso 5 de 10 con el expediente medio lleno y sin explicación → fix: banda de una línea al retomar ("Retomamos donde lo dejaste") con opción de empezar de nuevo.
5. [Chip de opción — components/funnel/ui.tsx:164] `h-14` es alto FIJO y ya hay opciones que envuelven a 2 líneas ("Tengo disputas frecuentes por la cuota" a 375px): a 320px o con una tercera línea el texto desborda la caja → fix: `min-h-14 py-3` en vez de `h-14`.
