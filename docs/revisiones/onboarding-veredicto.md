# VEREDICTO revisor-visual — onboarding (paso 1/10, "¿Cuál es tu rol hoy?")
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Zona inferior, desde ~y=465px hasta el fondo del viewport ~y=812px] ~43% de la pantalla queda vacío y plano, sin el Halo ni ninguna textura llegando ahí → centrar verticalmente el bloque título+chips+info en el viewport o darle contenido real a ese espacio (vista previa del expediente/sello); el "techo estructural" de las pantallas de solo-chips reportado en rondas previas sigue vigente hoy.
2. [Título, detrás de "¿Cuál es tu rol hoy?"] El <Halo/> (dispositivo ownable de FICHA-ARTE, 26% de opacidad) es imperceptible en el render real — se pierde la identidad visual que debería sostener el héroe → subir opacidad/radio hasta que sea visible como en la referencia aprobada (vista-previa-app.html).
3. [app/onboarding/page.tsx líneas 169-175] El guardado a sessionStorage solo ocurre al llegar al paso de loading (paso 9) — cerrar la pestaña en cualquier paso intermedio (1-8) borra todas las respuestas sin aviso → persistir incrementalmente en cada `avanzar()`, no solo al final.
4. [Toda la mitad inferior de la pantalla] Al no extender ningún gradiente hacia abajo, el fondo ahí es un fill 100% plano — rompe el sistema de 3 niveles de profundidad que sí existe arriba (chips elevados, info box hundida) → extender el degradé base o recomponer el layout para que la superficie plana no domine la mitad del viewport.
5. [Navegación por teclado, manejarFlechasChips en page.tsx] Solo hay ↑/↓ entre chips; falta atajo numérico (1/2) para seleccionar directo, mejora menor de eficiencia para el usuario avanzado (h7).
