# Cómo regenerar las piezas

1. Encender el sitio en local: `npm run dev` (las plantillas piden las imágenes a `http://localhost:3000`).
2. Generar las páginas: `node docs/piezas/_fuente/generar.mjs` (escribe `_fuente/html/` y `manifest.json`).
3. Copiar `_fuente/html/` a `public/_tmp-piezas/` (carpeta temporal; no se sube a git, está en `.git/info/exclude`).
4. Abrir cada página del manifiesto en un navegador con la ventana del tamaño de la pieza y guardar la captura en el `destino` indicado.
5. Borrar `public/_tmp-piezas/` al terminar.

Los datos de las piezas son de ejemplo. No agregar nombres, fotos ni cifras de personas reales o de menores.
