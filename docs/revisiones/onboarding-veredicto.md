# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-08 00:00
Screenshot: docs/revisiones/onboarding-otra-cosa-375.png ; docs/revisiones/onboarding-fijacion-v2-375.png ; docs/revisiones/onboarding-preocupacion-v2-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [pantallas "Otra cosa" y "Fijación"] Vacío muerto grande en el centro (~150-380px sin contenido entre los chips/input y la caja inferior) → llenar ese espacio o volver a centrar el bloque de contenido en vez de dejarlo flotando arriba con hueco abajo.
2. [las 6 pantallas de solo-chips] Patrón de layout inconsistente: Rol y Fijación quedaron ancladas arriba+abajo (mt-auto) mientras Situación/Preocupación/Momento/Atribución mantienen el wrapper centrado (justify-center) → definir UNA regla de layout para todas las pantallas de chips, no decidir por pantalla.
3. [captura "Preocupación"] La imagen entregada muestra "Paso 5 de 10" (pantalla de Reconocimiento), no la pantalla de chips con el subtítulo nuevo ("Paso 4 de 10") → no se pudo verificar visualmente ese cambio; se verificó solo en código (línea 398, confirmado presente).
4. [pantalla "Otra cosa", input] El texto de privacidad ("Tus respuestas son privadas...") queda aislado en medio del vacío, sin relación visual con el input de arriba ni el CTA de abajo → acercarlo al input o integrarlo como helper text bajo el campo.

Bug crítico de la ronda anterior (crash "Rendered fewer hooks than expected" al tocar "Otra cosa"): CONFIRMADO CORREGIDO en el código — `useSeleccionRetrasada` (línea 259) ahora se declara ANTES del `if (otra) return (...)` (línea 270). Revisado el archivo completo: ningún otro componente declara hooks después de un return condicional. El screenshot de "Otra cosa" confirma que la pantalla renderiza sin romperse.
