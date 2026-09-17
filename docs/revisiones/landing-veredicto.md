# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 34/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Evaluado a 375px (docs/revisiones/landing-375.png) Y por primera vez a 1440px
(docs/revisiones/landing-1440.png). Detalle: h1:3 h2:4 h3:4 h4:3 h5:4 h6:3 h7:3 h8:3 h9:3 h10:4 ·
jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:2 · copy idea:4 especificidad:3
emoción:4 oferta:3 acción:3. Falla el gate doble por craft (15 < 16) y por usabilidad (34 < 36).

Top defectos:
1. Hero H1, subrayado <Accent> ("pagada" / "y probada") en AMBOS viewports — el skip-ink nativo abre huecos bajo g/p/y y con 0.13em de grosor (7.5px a 58px) el "marcador" se lee como una barra a trozos/guiones, no como un subrayado; el dispositivo ownable de la ficha queda roto en el elemento más grande de la página → en components/landing/ui.tsx <Accent> añadir `textDecorationSkipInk: 'none'` (el 40% de opacidad ya deja pasar las descendentes) y bajar el grosor a 0.10em.
2. Hero 1440, tarjeta del producto (derecha) — la captura /hero-visual-inicio.png termina 5px después de la fila "Próximo · Visita" mientras arriba tiene ~30px de aire: padding asimétrico evidente en el borde inferior de la card → recortar el asset con 24px de padding inferior o dar `pb-6 bg-[var(--surface)]` al contenedor del visual en Hero.tsx.
3. 1440, salto hero → "¿Te suena?" — el hero ocupa 1140px alineado a la izquierda (x=163) y la sección siguiente es una columna de 620px centrada (x=405): el ojo percibe dos plantillas distintas al hacer scroll → subir max-w de Problema/Agitación a 760px o alinear el kicker/título de §2 al mismo margen izquierdo del grid del hero.
4. Oferta, card Mensual — "Todo lo que incluye el plan Anual" obliga a recordar la otra card (reconocer > recordar) y deja la card ~40% más corta en desktop (items-start) → reemplazar por 2 bullets concretos (Sello de Confianza + expediente PDF) y quitar la repetición de la garantía.
5. Página completa — "Garantía del Primer Expediente (15 días)" aparece 5 veces (features anual, features mensual, sección Garantía, recap del CTA final, PS) → dejarla en card anual + sección Garantía; el recap pasa a "7 días gratis · Garantía de 15 días".
