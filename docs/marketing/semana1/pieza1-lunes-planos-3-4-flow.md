# Pieza 1 (lunes, pilar 2) — planos 3 y 4 en Google Flow

Herramienta: Flow (Veo 3.1 Fast = 20 créditos; Lite = 10). 50 créditos gratis al día, se renuevan a las 11:59 a. m.
y los sobrantes NO se acumulan. Crear una imagen con Nano Banana también gasta créditos (pocos).
Licencia: revisada el 2026-10-09, ver ESTADO.md (Google no reclama la propiedad; sin permiso ni prohibición
explícita de uso comercial; se publica con etiqueta de IA).
Planos 1 y 2 ya generados en Flow. No usar Hailuo (marca de agua).

## Lecciones del 2026-10-09 (para no repetirlas)
- Los recortes de manos son casi cuadrados. Usados como primer fotograma, Flow los deja como rectángulo dentro del
  lienzo 9:16: inventa luces desenfocadas arriba (parecen una cabeza) y deja una franja negra abajo.
- El chat con el AGENTE de Flow puede ignorar la imagen vertical adjunta y usar otro archivo de la biblioteca: el
  resultado volvió a salir con franjas negras. Usar el MODO MANUAL (apagar el botón "Agente"), elegir
  Video > Fotogramas, y poner la imagen en el recuadro "Iniciar" de forma explícita.
- Primero crear una versión VERTICAL de cada recorte con Nano Banana (extender a 9:16), revisar que no tenga barras,
  luces ni cabeza, y recién entonces generar el video.
- Dejar "Confirmar antes de generar" en "Siempre" y mirar el costo antes de aprobar.
- Imágenes de partida (en `referencias/`): `plano3-manos-carlos.png`, `plano4-manos-laura.webp` y las versiones
  `-9x16.png` hechas a mano (crudas, con costuras; solo plan B). La imagen vertical buena del plano 3 se creó con
  Nano Banana y vive en la biblioteca de Flow (pestaña Imágenes).

## Paso 1 — Crear la imagen vertical (Nano Banana, en el chat del agente: adjuntar el recorte)
Plano 3 (manos de Carlos):
```text
Extend this photo into a vertical 9:16 image. Keep the existing photo exactly as it is and continue the scene naturally: above it, the dark grey knit sweater chest and shoulders of a seated man, cropped at the collarbone, no head and no face visible; below it, the same dark wooden table with a softly blurred surface. Same lighting, same colors, photorealistic, no bokeh lights, no text.
```
Plano 4 (manos de Laura) — ya está hecho para el plano 3; falta el 4:
```text
Extend this photo into a vertical 9:16 image. Keep the existing photo exactly as it is and continue the scene naturally: above it, the beige knit cardigan and white t-shirt of a seated woman, cropped below the chin, no head and no face visible; below it, the same wooden table with a softly blurred surface and warm golden light from a window on the left. Same lighting, same warm amber colors, photorealistic, no text.
```

## Paso 2 — Generar el video en MODO MANUAL (botón "Agente" apagado)
Video > Fotogramas > 9:16 > Veo 3.1 - Fast > x1. Subir la imagen vertical en "Iniciar". Costo esperado: 20 créditos.
Pegar SOLO el prompt (sin frases para el agente).

Plano 3:
```text
Locked-off camera, vertical close-up at table level. A seated man's hands in grey knit sweater sleeves scroll through a very long chat on a phone lying on a wooden table, the screen glowing blue on his fingers, thumb swiping up repeatedly. The upper frame is his dark sweater chest, no head or face visible. Dim apartment kitchen at night, cool dark tones, shallow depth of field, cinematic, realistic skin, no readable text on screen. Ambient sound only, no dialogue.
```
Plano 4:
```text
Locked-off camera, vertical close-up at table level. A seated woman's hands in a beige knit cardigan sleeve sort paper receipts and school bills on a wooden table next to a spiral notebook, then pick up a phone, strong warm golden backlight from a window on the left, amber tones. The upper frame is her cardigan and white t-shirt, no head or face visible. Shallow depth of field, cinematic, tired, realistic skin, no readable text. Ambient sound only, no dialogue.
```

## Revisar cada clip
Llena toda la pantalla vertical (sin franjas), manos sin deformaciones, sin texto legible, color acorde a los planos 1 y 2.

## Después
- Armado en CapCut: 5 planos de ~4 s, textos escritos a mano (la IA deforma las letras), música de uso comercial,
  tarjeta final con logo + «Tu expediente, en confianza» + «Link en la bio». Exportar 1080p.
- Etiquetar como IA y escribir «Escena ilustrativa creada con IA». Nunca presentarla como caso real.
- Texto del post: «La plata no debería ser una guerra. Del lado que paga y del lado que espera, el conflicto es el mismo:
  no poder probar. Link en la bio, botón "Cuando el dinero se vuelve guerra". Escena ilustrativa creada con IA.»
- Hashtags: #CuotaAlimentaria #PadresSeparados #Coparentalidad #PensionAlimenticia #Colombia #Custodia

## Plan B
Si el plano 3 sigue con franjas: usar el clip con franjas como formato "cine" (textos en la franja negra de arriba), o
grabar las manos con el celular.
