# VEREDICTO revisor-visual — paywall (variante CLARA, paso 2 de 2 = precio) — ronda 3
Fecha: 2026-09-18 19:10
Screenshot: docs/revisiones/paywall-claro-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [H1 · blob · 1440px] A computador el titular cae en 2 renglones y la forma orgánica (app/(funnel)/paywall/page.tsx:469 `-top-1 h-28 w-44`) baja hasta cruzar el borde superior de la tarjeta Anual (se ve el óvalo montado sobre la esquina de la card en paywall-claro-1440.png). → añadir `lg:h-20 lg:top-0` (o `lg:-top-2 lg:h-24`) de modo que la caja del blob termine ≥8px por encima del `radiogroup` (page.tsx:481) a 1440×900. A 375px ya está bien ubicado.
2. [Pie · redundancia] "Cómo funciona la garantía ⌄" (page.tsx:618-627) y, 12px debajo, "Garantía del Primer Expediente · 15 días" (page.tsx:654-658): la palabra "garantía" aparece dos veces seguidas en dos líneas contiguas sin que ninguna aporte el dato de la otra. → renombrar el summary a "Ver condiciones de la devolución" o mover el <details> debajo del CTA (tras page.tsx:683) para que las dos señales de confianza queden solas sobre el botón.
3. [Tipografía · escala] Siguen 6 tamaños en la vista (28/22/15/14/13/12); la meta de la r2 era ≤5. → page.tsx:513 badge 12→13 (queda 28/22/15/14/13). Medible: contar `text-[Npx]` distintos en el paso 2 = 5.
4. [Tarjetas de plan · TRM · h1] La línea "≈ $280.500 COP" (page.tsx:531 y 564) se inserta cuando llega la TRM y desplaza el contenido de abajo (salto de ~18px en cada tarjeta, dos veces). → reservar el alto con `min-h-[2.6em]` en el <p> hundido (page.tsx:529/562) o un skeleton de 1 línea mientras `trm === null`.
5. [Tarjetas de plan · h7 teclado] Las flechas ↑/↓ ya cambian de plan, pero ambos `role="radio"` siguen en el orden de Tab (page.tsx:492-567): el patrón radiogroup exige un solo tabstop (roving tabindex). → `tabIndex={plan === 'anual' ? 0 : -1}` / `tabIndex={plan === 'mensual' ? 0 : -1}` y `.focus()` en el botón activo tras onCambiarPlan.
Corregido desde la r2 (verificado en captura y código): texto bajo el CTA derivado del plan con "Primer cobro el día 7: US$89 al año" (page.tsx:681-683) · blob reubicado sin cruzar la BarraAtras a 375px (page.tsx:469) · un solo énfasis en el H1, "queda fechado" (page.tsx:475) · badge 12px, Términos/Privacidad y "Paso N de N" a 13px (page.tsx:513,698-700; ui.tsx:72) · flechas ↑/↓ en el radiogroup (page.tsx:486-490). CTA héroe vivo: 56px, ancho completo, blanco sobre #2F6FDC 4.7:1, whileTap 0.97, nunca disabled hasta el click. Garantía nombrada con plazo junto al CTA. Isotipo azul: pendiente del archivo del usuario, no se cuenta.
