# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 18:40
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 31/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) app/onboarding/page.tsx:93-100 useSeleccionRetrasada sin guard — doble tap en una opción (o dos opciones en <180ms) llama avanzar() dos veces y salta una pregunta completa; fix: useRef `disparado` que ignora el segundo clic + clearTimeout al desmontar. (2) 375 paso 1: ~130px de fondo plano entre la caja "¿Por qué lo preguntamos?" (y≈480) y la tarjeta "Tu expediente" (y≈610) — el vacío se movió del fondo al medio; fix: en la variante compacta mostrar también el pie del Sello de Confianza y subir MIN_VISIBLES a 4 cuando hay ≤3 opciones, y repartir el aire restante con `my-auto` en vez de `mt-auto`. (3) page.tsx:276 banda "Retomamos donde lo dejaste" queda fija en todos los pasos siguientes aunque el usuario ya avanzó; fix: setRetomado(false) dentro de avanzar(). (4) components/funnel/ui.tsx:175-178 el spring del check del Chip ignora useReducedMotion, y la caja "¿Por qué…" del paso 2 llega a 5 líneas a 375px; fix: `duration: reduce ? 0 : 0.24` y recortar el copy a 4 líneas. (5) 1440: el eyebrow "TU EXPEDIENTE SE ESTÁ ARMANDO" arranca 16px por encima del logo "Coparentia" (py-3 del Link) y no hay hairline degradé en la vista móvil; fix: `lg:mt-3` en el eyebrow y dar a la tarjeta compacta el mismo borde degradado del kit.
