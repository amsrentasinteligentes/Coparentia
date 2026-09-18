# VEREDICTO revisor-visual — landing (variante CLARA "Cuidado en calma", ronda 4 — fotos reales, commit 9623d9f)
Histórico: oscura r-antigua 37·17·18 · r4 34·15·17 · r5 32·15·15 · r6 33·16·16 · clara r1 33·14·17 · r2 33·15·17 · r3 33·16·17 · r4 31·16·16
Fecha: 2026-09-17 23:50
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 16/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos:
1. [Oferta → card Anual] Tres "gratis" y dos plazos distintos en la misma card: badge "3 MESES GRATIS" + "Tras los 7 días gratis · ≈ … COP" (Oferta.tsx:163) + CTA "Crear mi expediente gratis" — la confusión "3 meses vs 7 días" señalada en r3 sigue → línea 163: "Se cobra al terminar la prueba · ≈ … COP al año" (sin la palabra gratis).
2. [Evidencia / secciones 5-7] En landing-375.png la sección "Tu expediente, siempre a mano" (AppPorDentro) es un hueco de ~1.250px en blanco; en landing-1440.png faltan AppPorDentro + Oferta + Garantía (~2.600px vacíos): el reveal whileInView (useReveal, opacity 0 inicial) no se dispara en la captura fullPage → recapturar tras recorrer la página con scroll (o fijar `initial={false}` en la captura); sin eso esas secciones no están verificadas.
3. [Kickers 12px, chip "el Sello de Confianza" 15px, label "DESPUÉS" 12px, CTA outline de Abogados 17px] --accent #2F6FDC sobre --bg #F3F7FC mide 4.4:1 (medido; la ficha dice 4.5) — falla AA en texto pequeño de todas las secciones base (Solución, Oferta, FAQ, Abogados) → texto ≤17px en acento sobre --bg usa --accent-deep #2757A8 (6.5:1); mantener #2F6FDC para botones sólidos y palabras del H1/H2 (texto grande, 3:1 OK).
4. [Solución → foto papá-hija] Encuadre corta la frente del papá y deja a la niña descentrada (object-[50%_40%] en un blob de 220px de alto a 375px); además la foto es oscura/fría frente al hero cálido y luminoso: dos tratamientos fotográficos en la misma página → object-[42%_28%] + un velo cálido uniforme (overlay del --foto-1 al 8-10% con mix-blend) o un recorte más abierto.
5. [Oferta → card Mensual] Bullets 2 y 4 dicen lo mismo ("Cancelas cuando quieras, sin permanencia" / "Sin compromiso de 12 meses") y el CTA "Crear mi expediente · mensual" rompe el paralelismo con el Anual → fusionar en un bullet y reemplazar el 4º por un dato real ("Pagas mes a mes, US$9.99"); CTA "Empezar con el plan mensual".
