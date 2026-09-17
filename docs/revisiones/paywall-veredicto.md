# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-paso1-375.png · docs/revisiones/paywall-paso2-precio-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Paso 2 — pie de pantalla] Demasiados bloques de texto secundario apilados sin jerarquía fuerte (hairline + garantía + pago seguro + reembolso + CTA + renovación + "Ahora no"/Dudas + legal) → comprimir garantía+pago seguro en una línea y mover el párrafo de reembolso a un enlace expandible.
2. [Toda la pantalla, heurística 7] Sin atajos ni memoria de preferencia entre visitas (el plan elegido no se relee al volver a entrar) → leer `coparentia_plan_elegido` de sessionStorage al montar y usarlo como estado inicial de `plan`.
3. [Paso 2 — titular, palabra "WhatsApp"] El subrayado-marcador cruza el cuerpo de las letras con descendentes ("pp"), leyéndose como tachado → bajar `backgroundPosition` o reducir `backgroundSize` a ~0.16em.
4. [Craft / profundidad] Solo hay 2 planos (base + superficie elevada de las cards); falta un tratamiento "hundido" que complete el sistema de 3 niveles que declara FICHA-ARTE → aplicar tratamiento hundido sutil al dato de conversión en COP.
5. [Alcance de esta revisión] Solo se auditó paywall; no se confirmó que FunnelHeader/CtaFunnel luzcan idénticos en onboarding y app interna → correr el mismo checklist de consistencia sobre esas pantallas antes de declarar el sistema cerrado.
