# Cómo regenerar las piezas

1. Encender el sitio en local: `npm run dev` (las plantillas piden las imágenes a `http://localhost:3000`).
2. Generar las páginas: `node docs/piezas/_fuente/generar.mjs` (escribe `_fuente/html/` y `manifest.json`).
3. Copiar `_fuente/html/` a `public/_tmp-piezas/` (carpeta temporal; no se sube a git, está en `.git/info/exclude`).
4. Abrir cada página del manifiesto en un navegador con la ventana del tamaño de la pieza y guardar la captura en el `destino` indicado.
5. Borrar `public/_tmp-piezas/` al terminar.

Los datos de las piezas son de ejemplo. No agregar nombres, fotos ni cifras de personas reales o de menores.

## Capturas de la app (public/frame-*.webp)

`node docs/piezas/_fuente/preparar-capturas.mjs` arma las 5 capturas (800×1616) a partir de las capturas del celular en `Capturas - nuevas/` (esa carpeta NO se sube a git: trae datos personales) y del contenido viejo con datos de ejemplo (commit `7f0bf41`). Inicio, Pagos y Calendario conservan los datos de ejemplo y reciben la barra de abajo nueva; Expediente y Especialistas salen de las capturas nuevas.

## Imagen de vista previa (para compartir el enlace)

`generar.mjs` deja la versión PNG en `docs/piezas/og-coparentia-1200x630.png`. La que se publica es `public/og-coparentia.jpg` (JPEG, ~100 KB: WhatsApp descarta imágenes de vista previa muy pesadas). Se obtiene con `sharp(...).jpeg({ quality: 84, mozjpeg: true })`. Cada vez que cambie el nombre del archivo, WhatsApp la vuelve a leer; si no, puede quedarse con la anterior en caché.
