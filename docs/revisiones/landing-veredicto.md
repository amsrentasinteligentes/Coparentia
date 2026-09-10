# VEREDICTO revisor-visual — landing
Fecha: 2026-09-10 00:00
Screenshot: docs/revisiones/landing-hero-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

Top defectos:
1. Card Anual (sección de oferta) — el precio sigue apareciendo en 4 renglones de dinero apilados (US$7.42/mes · "Se cobra US$89 al año, tras los 7 días gratis" · ≈ $275.900 COP al año · "3 meses gratis"); el ojo apurado aún recorre 4 líneas. Fix: jerarquizar — dejar "Se cobra US$89 al año tras los 7 días gratis" como la única línea en peso semibold y demoter las otras a tertiary.
2. Cards Anual vs Mensual (sección de oferta) — 4 de 5 bullets son idénticos entre planes; el diferenciador real (compromiso/precio) queda diluido. Fix: en la card Mensual mostrar solo "Cancelas cuando quieras" + "Todo lo del plan Anual".
3. Mock "Tu expediente" (hero) — montos en pesos con espacio tras el símbolo y sin etiqueta ("$ 450.000", "$ 2.075.000") chocan visualmente al lado del pricing en "US$". Fix: formatear "$450.000 COP" sin espacio, o rotular la moneda una vez en el mock.
4. Coherencia de encuadre entre título de sección ("menos de US$0.25/día") y card Anual (ya no repite /día) — quien escanea solo la card nunca ve el gancho de $0.25/día. Fix: añadir "≈ US$0.25/día" en tertiary bajo el precio, o alinear el título a /mes.
5. Sección de oferta — tres formulaciones de ahorro conviven (badge "AHORRAS 25%" + "3 meses gratis" + "Valor total US$154 → US$89"). Fix: elegir una afirmación de ahorro dominante y bajar el ruido de las otras dos.
