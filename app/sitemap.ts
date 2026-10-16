import type { MetadataRoute } from 'next';
import { ARTICULOS } from '@/lib/articulos';

// Solo páginas públicas: principal, especialistas, artículos y legales. Las pantallas internas y
// /admin no aparecen (ver también app/robots.ts). Los artículos salen de lib/articulos.ts: uno nuevo
// entra aquí solo, sin tocar este archivo.
const BASE = 'https://coparentia.co';

export default function sitemap(): MetadataRoute.Sitemap {
  const publicas = ['/', '/especialistas', '/privacidad', '/terminos', '/reembolsos', '/aviso-ia'];
  return [
    ...publicas.map((ruta) => ({
      url: `${BASE}${ruta === '/' ? '' : ruta}`,
      changeFrequency: ruta === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: ruta === '/' ? 1 : 0.5,
    })),
    ...ARTICULOS.map((a) => ({
      url: `${BASE}/articulos/${a.slug}`,
      lastModified: a.publicadoEn,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
