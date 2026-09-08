# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-08 00:00
Screenshot: docs/revisiones/paywall-precio-v3-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1. [Badge "MÁS POPULAR · AHORRA 4 MESES"] Ahorro matemáticamente incorrecto: $89/año vs $9.99×12=$119.88 son ~3.1 meses de ahorro, no 4 → corregir el número o el precio para que cuadre. 2. [motion.button Anual/Mensual en app/paywall/page.tsx] No usan useReducedMotion() a diferencia de <Chip>/<BarraProgreso> del mismo kit → envolver con el hook `reduce`. 3. [Footer pantalla Precio] Demasiados bloques secundarios apilados bajo el CTA empujan contenido fuera del viewport 375×812 → condensar líneas de microcopy. 4. [Header] Chevron "volver" y "X" en text-secondary sobre fondo muy oscuro, poco perceptibles como tappables. 5. [CheckPlan vs Chip] Tarjetas de plan usan radius-card (14px) mientras <Chip> de onboarding usa radius-button (10px) para el mismo patrón de selección → unificar token.
