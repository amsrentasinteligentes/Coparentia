import type { MetadataRoute } from 'next';

// Qué pueden leer los buscadores. Fuera quedan el panel del dueño, las rutas internas del servidor y
// las pantallas de la app (todas exigen sesión: no tienen nada que indexar). El resto del sitio —
// página principal, especialistas, artículos y legales— queda abierto y listado en /sitemap.xml.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/auth/',
          '/inicio',
          '/pagos',
          '/calendario',
          '/expediente',
          '/perfil',
          '/asistencia',
        ],
      },
    ],
    sitemap: 'https://coparentia.co/sitemap.xml',
    host: 'https://coparentia.co',
  };
}
