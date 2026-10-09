# VEREDICTO revisor-visual — paywall (paso 2 de 2: precio, con campo de correo + autorización) — RONDA 9
Fecha: 2026-10-09 22:00
Screenshot: docs/revisiones/paywall-correo-ronda9-1-arriba-375.jpg
Usabilidad: 36/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Titular, mancha azul tras "WhatsApp se pierde — tu"] Sigue sin tocarse desde la r8: la elipse cae detrás de "se pierde — tu", no de la palabra acentuada "queda fechado"; se ve como manchón desalineado, no como dispositivo ownable. Es lo que mantiene identidad en 3. Fix: quitar el Blob del paywall, o anclarlo detrás de "queda fechado" (right-0, bottom del h1) con la misma opacidad.
2. [Primer pliegue, dos pastillas de precio] Alto igual ahora, pero la de Anual (surface-2 sobre tinte azul) casi desaparece y se lee como un contorno, mientras la de Mensual se lee rellena; además el radio de pastilla completa con dos líneas de texto queda apretado contra los extremos. Fix: radio de 12px en ambas pastillas y fondo con el mismo contraste visible en las dos (en la activa, bg-[var(--surface)] en vez de surface-2).
3. [Primer pliegue: beneficios cortados por el botón fijo] El bloque fijo ocupa ~230px de 812 y deja la 2.ª fila de beneficios a medio ver. Es el sticky aprobado, pero la captura inicial se ve cortada. Fix: reducir a 2 beneficios en la vista fija o mover "Te sale a US$0.24 al día" dentro de la tarjeta Anual y dejar solo 2 filas debajo.
4. [Tramo correo - divisor - garantía] Mejoró (enlace pegado a la casilla), pero siguen ~35px antes de la hairline y ~40px después hasta "Garantía de 15 días" (por min-h-11), sin escalón de escala 16/24/32 claro. Fix: mt-6 antes del divisor, y la fila de garantía a mb-2 con min-h-11 solo en la zona táctil (padding negativo) para igualar ambos huecos a 24px.
5. [Zona inferior] Los escalones de texto mejoraron (12px en garantía-subtexto y legales, monto del cobro en semibold), pero "Ahora no" y "¿Dudas? Escríbenos" (14px, tinta primaria, 500) pesan casi como la garantía y compiten con el CTA como salidas. Fix: bajarlos a 13px en text-secondary para que la acción primaria sea la única de tinta fuerte.

Corregido desde la r8 (verificado en captura y código): enlace "Ya pagué con otro correo" a 16px de la casilla; hairline con mb-2 y fila "Pago seguro Hotmart" sin forzar 44px; "Si no te sirve..." y "Términos · Privacidad" a 12px; en el panel el cierre de sesión (14px, 600, tinta primaria) pesa claramente más que el soporte (13px, gris).

Para llegar a 16/20 falta +1 en craft. Cambio mínimo: defecto 1 (quitar o anclar la mancha) lleva identidad de 3 a 4 solo si queda un dispositivo claro; más seguro: defectos 1 + 2 juntos (mancha resuelta y pastillas iguales) para subir encaje a 4. Una sola corrección pequeña no garantiza el punto. No se acepta el argumento de "diseño anterior aprobado": las pastillas y la mancha se puntúan por lo que se ve hoy.

Notas del revisor:
- Usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:3 h7:3 h8:3 h9:4 h10:4 (suma 36, justo en el umbral). h8 baja a 3 respecto a la r8: el formulario de correo, la casilla, el enlace, el panel, el pie y dos salidas suman peso en una pantalla de decisión; h4 y h5 se mantienen en 4. Cualquier regresión la baja de 36.
- Craft: jerarquía 3, profundidad 3, identidad 3, movimiento 3, encaje 3. Los cambios de la r9 son reales pero pequeños y no cruzan el umbral de ningún eje; el encaje sigue en 3 por pastillas desiguales y ritmo vertical aún irregular.
- Copy: idea 3, especificidad 4, emoción 3, oferta 4, acción 4 (18/20, sin cambios). Sin ficha de avatar adjunta en esta ronda; se mantiene la puntuación de la r8 con trazabilidad ya verificada entonces.
- Gate de carga cognitiva: 0 fallas.
- CTA héroe vivo: cumple los 4 (whileTap, no disabled por defecto, valida al toque con role="alert" y scroll al campo, 48px+ ancho completo, contraste azul/blanco).
- Código verificado: role="alert" en errores de correo y pago; botones del panel disabled mientras sale la sesión; useReducedMotion en conteo, stagger y paneles; confirmación + Cancelar antes de cerrar sesión. Sin atajos de teclado salvo flechas del radiogroup; sin celebración (no aplica).
- Fichas: azul del kit, Figtree/Nunito Sans, radios coherentes; sin desvío de FICHA-ARTE. No coincide con los kits vetados.
- Garantía con plazo (15 días) junto al CTA: pasa el sub-check de garantía nombrada.
- Se respetan por decisión del dueño el enlace "Ya pagué con otro correo" y la casilla obligatoria no premarcada (obligación legal).
