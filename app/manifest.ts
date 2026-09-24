import type { MetadataRoute } from 'next';
import { ACCENT_HEX, BG_INTERIOR_HEX } from '@/lib/marca';

// MANIFIESTO DE INSTALACIÓN (PWA, 2026-09-24, pedido del dueño) — lo que le dice al teléfono cómo
// mostrar Coparentia una vez instalada: nombre, colores, y sobre todo `display: 'standalone'`, que
// es lo que hace que se abra SIN la barra de direcciones del navegador — la diferencia real entre
// "una página que guardaste" y "una app". Next.js sirve esto solo en /manifest.webmanifest y lo
// enlaza en el <head> automáticamente — no hay que tocar el layout para esto.
//
// `start_url` apunta a /inicio (nunca a la página de ventas): a quien la instala ya la compró. Si
// a alguien se le venció el acceso, el candado de app/(app)/layout.tsx lo manda a /entrar igual que
// hoy — el manifiesto no cambia esa regla, solo dónde aterriza primero.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Coparentia — Tu expediente, en confianza',
    short_name: 'Coparentia',
    description:
      'El expediente digital que convierte tus pagos y comprobantes en pruebas organizadas, con el Sello de Confianza.',
    start_url: '/inicio',
    display: 'standalone',
    background_color: BG_INTERIOR_HEX, // --bg del interior (tokens-app-claro.css) — color de la pantalla de carga al abrir
    theme_color: ACCENT_HEX, // --accent de FICHA-ARTE.md
    orientation: 'portrait',
    lang: 'es-CO',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
