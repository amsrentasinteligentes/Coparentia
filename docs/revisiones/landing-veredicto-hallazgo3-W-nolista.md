# VEREDICTO revisor-visual — landing (ronda: hallazgo 3 — titular nuevo + "¿Te suena?" en dos grupos)
Fecha: 2026-10-13 12:00
Screenshot: docs/revisiones/hallazgo3-landing-hero-375.jpg (+ docs/revisiones/hallazgo3-landing-grupos-375.jpg)
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Hero, H1] "Padres separados, unidos por sus hijos" contradice el mecanismo de la propia página: el subtítulo y la ficha prometen uso UNILATERAL ("sin depender de la otra persona") y el titular dice "unidos"; además es un lugar común sin campo de la FICHA-AVATAR (el avatar habla de "mala paga", "cajero automático", "guerra por plata") y sugiere una app de coordinación entre ambos, que es justo la categoría (OurFamilyWizard) de la que el avatar está cansado. Resta -> quitar la primera mitad y abrir con la escena o el mecanismo, p. ej. "Tu cuota alimentaria, [acento]con comprobante y fecha[/acento]" o dejar solo "[acento]Cuota alimentaria clara y documentada[/acento]" precedido por quien-habla. 2) [Hero, H1] Titular nominal, sin verbo ni resultado para el usuario ("clara y documentada" es una cualidad, no un beneficio sentido); la emoción del dolor #1 (que no te traten de mala paga / dejar de discutir) desaparece del hero y solo queda más abajo. Eje emoción baja de 4 a 3, idea única de 4 a 3. 3) [Hero, H1] Énfasis en acento sobre 5 palabras incluyendo "y" ("cuota alimentaria clara y documentada" = media frase): rompe la regla de 1-3 palabras clave y diluye el acento; además son 4 líneas a 375px de display. Resaltar solo "clara y documentada" o "documentada". 4) [¿Te suena?, orden de grupos] Los dolores de quien RECIBE van primero, pero en la ficha solo están INFERIDOS por simetría (sin VoC) y quien paga es el avatar con evidencia (dolor #1 ★ "mala paga" queda 4º, bajo el pliegue del grupo). Decisión del dueño, registrada; riesgo: el avatar con evidencia (Carlos) se identifica en el segundo grupo, no en el primero. Mitigación: medir clics/scroll por grupo antes de consolidar el orden. 5) [Pie] Sigue abierto, heredado: sin prueba social real; tarjeta Anual con jerarquía invertida de líneas pequeñas y 7 tamaños de texto (defectos 2-3 del veredicto previo).

Detalle usabilidad: h1:3 h2:4 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:3

Gate doble: usabilidad 36 (sin margen) · craft 16 (sin margen) · copy 15 (< 16: el gate de copy de la RÚBRICA 4 falla; ningún eje <=2). NO LISTA solo por el copy; el resto se mantiene como en el veredicto previo.

## Respuestas a lo pedido
- ¿El titular se entiende sin leer nada más y dice a quién y qué obtiene? A quién: sí, de inmediato ("Padres separados"). Qué obtiene: a medias; "cuota alimentaria clara y documentada" nombra el tema y dos cualidades, pero no un resultado ni un objeto (expediente, comprobantes). Eso lo completa el subtítulo y el CTA ("Crear mi expediente gratis"), no el titular. Mejora real frente al anterior en claridad de tema y SEO/pestaña; pierde en emoción y en mecanismo. Nota de ficha: dice "documentada" sin prometer validez legal, correcto.
- ¿"Unidos por sus hijos" suma o resta? Resta. No tiene campo de origen en la ficha, es cliché de la categoría, y choca con el diferenciador unilateral ("sin depender de la otra persona") que está dos líneas más abajo; un lector que desconfía de que el otro use la app lee "unidos" como "necesito que ella participe" (objeción #1 de la ficha). Además ocupa dos de las cuatro líneas.
- ¿Los dos grupos mejoran la identificación? Sí, es la mejora neta de esta ronda: el h3 display 20px dice a quién le habla cada tanda, 3+3 respeta la carga cognitiva, y las reescrituras sin género ("por tu cuenta", "tus cuentas no estaban claras") son correctas. Reserva: el h3 de 20px y el h2 "¿Te suena?" conviven con 17px de cuerpo (3 tamaños, ok); el orden pone primero el lado sin evidencia (ver defecto 4); el segundo grupo queda parcialmente tapado por la barra fija inferior en la captura 375 (la última tarjeta se corta, comportamiento normal de scroll, no defecto).

## Verificación
- Visto: hero 375 (CTA "Crear mi expediente gratis" visible en el primer pliegue, H1 en 4 líneas, acento azul en las 2 últimas) y grupos 375. Las capturas 1440 no se abrieron; no se puntúan. Código revisado: Problema.tsx (h3 con variants/useReveal, grupos con warnRango 2-5, warnCopy <=12 palabras) y app/page.tsx / app/layout.tsx (h1Marked, título y descripción nuevos). El resto de la página se hereda del veredicto previo (sin cambios declarados).
- Isotipo gris metálico: decisión del dueño, no se puntúa como defecto.
