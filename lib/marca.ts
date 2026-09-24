// COLORES DE MARCA PARA CONTEXTOS QUE NO SON CSS (2026-09-24) — el manifiesto de instalación
// (app/manifest.ts) y las etiquetas <meta> del layout raíz (app/layout.tsx) no son CSS: son texto
// que el navegador lee ANTES de que exista ninguna hoja de estilos, así que no pueden usar
// `var(--accent)`. Los tokens siguen viviendo en globals.css / tokens-*.css (fuente real para todo
// lo que SÍ es CSS) — este archivo solo evita que el mismo hex quede pegado dos veces por el
// código, para las dos piezas que de verdad lo necesitan como texto plano.
// Fuente: FICHA-ARTE.md — --accent #2F6FDC · --bg del interior (tokens-app-claro.css) #edf0f7.
export const ACCENT_HEX = '#2F6FDC';
export const BG_INTERIOR_HEX = '#edf0f7';
