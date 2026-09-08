# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-08 00:00
Screenshot: docs/revisiones/onboarding-momento-v3-375.png (+ docs/revisiones/onboarding-rol-v2-375.png)
Usabilidad: 24/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Paso 2 "Situación" → chip "Otra cosa (escribe la tuya)"] Bug de reglas de hooks: en
   PreguntaSituacion (app/onboarding/page.tsx L239-332) el hook `useSeleccionRetrasada()` se
   llama en la línea 294, DESPUÉS de un `if (otra) return (...)` (línea 267). Cuando `otra` pasa
   de false a true, ese render deja de llamar el hook (3 hooks en vez de 4) → React lanza
   "Rendered fewer hooks than expected" y la pantalla se rompe al tocar esa opción, EL ÚNICO
   escape-hatch de la pregunta. Fix: mover `const { local, elegir } = useSeleccionRetrasada(...)`
   al inicio del componente, ANTES del `if (otra)`, igual que en las otras 5 pantallas de chips.
2. [Paso "Atribución", 5 chips] Es la única pregunta con 5 opciones (el resto tiene 3-4) —
   incumple el límite de ≤4 opciones por decisión del gate de carga cognitiva y, sumado a que
   ahora el bloque se centra con `justify-center` dentro del espacio libre, arriesga que la
   tarjeta InfoContextual quede recortada o pida scroll en pantallas de 375×667 (no capturado en
   los 2 screenshots entregados — verificar con captura real de ese paso). Fix: bajar a 4
   opciones (fusionar "Un amigo o familiar" en "Otro") o quitar la tarjeta InfoContextual en esa
   pantalla puntual.
3. [Paso "Preocupación"] Es la única de las 6 pantallas de chips sin subtítulo de apoyo bajo el
   título (Rol, Situación, Fijación y Momento sí lo tienen) — inconsistencia de patrón (h4).
   Fix: agregar el subtítulo faltante o quitarlo de las demás para unificar.
4. [Pantallas de chips en general, ej. Fijación/Situación con solo 3 chips] El hueco ya no está
   solo abajo (mejora real vs. ronda 7), pero al centrarse verticalmente el bloque título+chips
   dentro del espacio libre, en preguntas con pocas opciones sigue quedando ~100-120px de aire
   vacío arriba Y abajo del bloque — se lee como "poco contenido flotando" más que como
   composición deliberada. Fix: en pantallas con ≤3 chips, anclar el bloque con `justify-start`
   y mt-10/12 fijo en vez de `justify-center`, reservando el centrado solo para 4+ opciones.
5. [Chip "Otra cosa" en Situación] Aunque el defecto #1 es el crítico, conviene además agregar
   un Error Boundary local en esa sub-rama del onboarding para que, si vuelve a fallar un hook o
   un estado, el usuario vea "Algo no cargó bien — volver" en vez de pantalla en blanco o el
   overlay de error de Next.js.

VERIFICACIÓN EXPLÍCITA de los 4 defectos de la ronda anterior (31/40 · 16/20):
1. Hueco de ~140-160px en el paso Momento → RESUELTO. El bloque título+chips ahora vive en un
   contenedor `flex-1 flex-col justify-center` (page.tsx L553-573) que lo centra en el espacio
   libre ARRIBA de InfoContextual, en vez de quedar pegado arriba con todo el vacío abajo. El
   espacio remanente ahora se reparte simétrico arriba/abajo (ver defecto #4 nuevo, menor).
2. Paso 0 (Rol) sin reusar InfoContextual → RESUELTO. Línea 223: `<InfoContextual anclar={false}>`
   con el mismo componente que las otras 5 pantallas, mismo padding/radius/tono.
3. Check-mark no visible antes de avanzar (mismo tick que el cambio de paso) → RESUELTO en 5 de
   6 pantallas vía `useSeleccionRetrasada` (delay de 180ms antes de `avanzar()`); confirmado
   visualmente en docs/revisiones/onboarding-rol-v2-375.png (paso Situación, check azul con
   spring visible sobre la opción elegida). ⚠️ PERO en la propia pantalla de Situación
   (app/onboarding/page.tsx) la implementación del hook introdujo el bug crítico #1 de arriba —
   la intención está resuelta, la ejecución en ese archivo específico rompe la pantalla en un
   sub-flujo real.
4. `<Chip>` sin focus-visible propio → RESUELTO. components/funnel/ui.tsx línea 146:
   `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
   focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]`.

Detalle usabilidad: h1:2 h2:3 h3:2 h4:3 h5:1 h6:3 h7:3 h8:3 h9:1 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
