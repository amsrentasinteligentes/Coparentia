# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 21:10
Screenshot: docs/revisiones/paywall-paso2-precio-375.png
Usabilidad: 32/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:4 h6:3 h7:3 h8:3 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
Detalle copy: idea:4 especificidad:3 emoción:3 oferta:4 acción:4

Capturas puntuadas: paywall-paso1-375.png · paywall-paso2-precio-375.png ·
paywall-paso1-1440.png (INVÁLIDA: stale — no coincide con el código actual) · paywall-paso2-precio-1440.png
Código verificado: app/paywall/page.tsx · components/funnel/ui.tsx · components/funnel/PanelExpediente.tsx
FICHA-ARTE: paleta (#0b1524/#13233a/#5b93e8), Spectral display + IBM Plex Sans body, radios 14/10 — coinciden en el render.

Correcciones de la ronda anterior — verificación independiente:
- Captura paso 1 a 375: CONFIRMADA fresca ("Hecho con tu respuesta", sin scroll horizontal).
- Comentario del webhook: CONFIRMADO corregido (page.tsx:8-12).
- Panel de computador con expediente + pilares + justify-start: CONFIRMADO en código (ui.tsx:259,
  page.tsx:195-235) y en paywall-paso2-precio-1440.png. NO confirmado en paso 1: la captura
  paywall-paso1-1440.png es anterior (panel centrado, sin pilares ni "Corregir").
- Desborde a 1440×900: SIGUE en el paso 2 (scrollbar visible y "Términos · Privacidad" cortado en y≈897).
- Safe-area dentro del div con fondo: CONFIRMADO (page.tsx:610).
- "Corregir alguna respuesta": CONFIRMADO, pero solo existe en el panel lg (invisible en celular).
- role="alert": CONFIRMADO (page.tsx:628). focus-visible en tarjetas de plan: CONFIRMADO (page.tsx:467, 512).

CTA héroe vivo: contraste 5.9:1 ✓ · whileTap 0.97 ✓ · nunca disabled por defecto ✓ · 56px ancho completo ✓.
Gate de carga cognitiva: pasa (0 fallas).

Top defectos:
1. [evidencia · computador paso 1] paywall-paso1-1440.png es una captura ANTERIOR al fix: panel
   izquierdo centrado verticalmente (titular en y≈313 vs. header derecho y≈100), sin pilares ni
   "Corregir alguna respuesta", cuando el código ya renderiza justify-start + pilares siempre →
   recapturar el paso 1 a 1440 con el build actual; hasta entonces el eje compartido del paso 1 queda SIN verificar.
2. [computador · paso 2, columna derecha, 1440×900] desborda: aparece scrollbar y "Términos ·
   Privacidad" queda cortado en el borde inferior (y≈897/900); la medición scrollHeight===clientHeight
   solo se hizo en el paso 1 → en ≥1024px bajar `lg:pt-16` a `lg:pt-10` en las dos columnas de
   MarcoFunnel (ui.tsx:259 y 270) o fundir Términos/Privacidad en la línea de "Ahora no · ¿Dudas?", y medir el paso 2.
3. [375 · paso 2, caja hundida de AMBAS tarjetas de plan] "COP" cae huérfano en una segunda línea
   ("≈ $278.400 / COP", "≈ $375.000 / COP") justo en el elemento de decisión → envolver "≈ … COP" en
   `whitespace-nowrap` (page.tsx:497, 530) o formatear "≈ COP $278.400" para que la unidad no se separe.
4. [paso 1 subtítulo vs. panel de computador] "Hecho con tu respuesta" (singular) mientras el expediente
   muestra 2 respuestas (Tu rol + Meses a documentar): `nRespuestas` no cuenta `r.rol` (page.tsx:118) →
   incluir `r.rol` en el array; ante un avatar que "desconfía de las cuentas que no cuadran" es un dato que no cuadra.
5. [cabecera · ambos anchos] al pasar al paso 2 aparece el chevron y la marca "Coparentia" + la barra
   de progreso saltan 52px a la derecha (x=18→70 a 375; x=810→850 a 1440) → reservar siempre el hueco
   del chevron (`size-11` con `invisible` en paso 1) para que la cabecera no se mueva entre pasos.

Menores: "Corregir alguna respuesta" no existe en celular (el panel es lg-only) — en 375 no hay vuelta
al onboarding salvo la X que abandona el flujo · el radiogroup usa role="radio" sin navegación por
flechas ni tabindex roving (semántica de radio incompleta) · la referencia en COP llega tarde (TRM
asíncrona) y hace saltar de 1 a 2 líneas la caja hundida sin placeholder · "PDF foliado" y "Respaldo
probatorio" son léxico jurídico que la ficha no registra en el vocabulario del avatar · las capturas
llevan solo 2 respuestas de semilla (rol + meses); el expediente de computador se ve escuálido frente
al onboarding completo.
