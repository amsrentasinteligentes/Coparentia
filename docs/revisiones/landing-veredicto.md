# VEREDICTO revisor-visual — Landing Coparentia
Fecha: 2026-09-08 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 34/40
Craft: 17/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [components/landing/ui.tsx L304-399, StickyCtaMobile] El botón "x" reaparece en cada hito de scroll (heurística 3 corregida), pero un usuario que la cierra dentro de una sección larga y luego hace scroll leve DENTRO de esa misma sección la ve reaparecer solo si cruza el borde de #hero/#oferta/#cta-final — comportamiento correcto y ya no es defecto accionable, se deja registrado como validado.
2. [components/landing/Oferta.tsx L189-193] "Elegir mensual" ahora reusa `CtaButton variant="outline"` — consistencia resuelta; validado en código y en screenshot (mismo radius, mismo alto 52px, mismo whileTap que el resto del kit).
3. [app/page.tsx L119-122] Badge "AHORRAS 25%" / "3 meses gratis" ahora es matemáticamente correcto ($9.99×12=$119.88 vs $89/año ≈ 25.76%/~3.09 meses) — resuelto, sube EJE 2 de copy (especificidad y prueba, cero claims falsos).
4. [components/landing/*, todo el kit] Sigue sin atajos de teclado más allá de tab/enter nativo (heurística 7) — aceptable para landing, no crítico, techo estructural de este tipo de pantalla ya documentado.
5. [Oferta.tsx L94-199 / Precio()] El precio anual muestra "$5.08/mes" con "3 meses gratis" y "se cobra $89/año" en tres lugares distintos de la card — funciona pero un usuario apurado puede tardar >3s en confirmar cuál es el número que realmente paga hoy; no es un defecto nuevo de esta ronda, queda anotado para una futura simplificación si se retoca esa card.
