import type { NextConfig } from "next";

// Encabezados de seguridad de línea base — no existían (hallazgo de la auditoría de seguridad,
// 27-REVISION-SEGURIDAD.md, A02 Security Misconfiguration). Sin CSP estricto con nonce todavía
// (requeriría reescribir cómo se cargan los estilos/fuentes; se deja para cuando haya IA/terceros
// nuevos que lo justifiquen), pero estos 5 cierran los huecos más comunes y baratos de cerrar:
// clickjacking, MIME-sniffing, fuga de referrer entre sitios, y acceso a cámara/micrófono/ubicación
// que esta app nunca usa.
const nextConfig: NextConfig = {
  devIndicators: false,
  // El límite por defecto de una Server Action es 1 MB — una foto de celular sin comprimir lo
  // supera fácil y la subida se rechaza ANTES de que corra el código del formulario (nunca llega
  // a mostrar un mensaje de error legible: revienta la página completa). Hallazgo real,
  // 2026-09-29 — el usuario probó subir la foto de un psicólogo y le volvió a salir el error 500.
  // 6mb da margen sobre el tope de 5 MB que ya valida app/admin/profesionales/acciones.ts.
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  // Fotos de profesionales subidas desde /admin/profesionales (2026-09-28) viven en el bucket
  // público "profesionales" de Supabase Storage — next/image rechaza cualquier dominio externo
  // que no esté en esta lista (por diseño, para no optimizar imágenes de orígenes arbitrarios).
  // Sin esto: "Invalid src prop... hostname is not configured" en cuanto alguien sube una foto
  // nueva (las que ya vivían en /public, como la de Ivonne, nunca lo necesitaron).
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chxhyzyzpipbopskomuv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          // CSP en modo SOLO-REPORTE (2026-10-22, certificación pre-lanzamiento): el navegador anota en su consola lo que
          // bloquearía, pero NO bloquea nada todavía. Primero se observa con tráfico real (Meta Pixel, Supabase, Hotmart,
          // fuentes, video) y recién después se pasa a `Content-Security-Policy` real. Sin nonce todavía: usa 'unsafe-inline'
          // para scripts y estilos (Next los inyecta), y aun así cierra frame-ancestors, object-src, base-uri y form-action.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.supabase.co https://www.facebook.com",
              "font-src 'self' data:",
              "media-src 'self' blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.facebook.com https://connect.facebook.net",
              "frame-src 'none'",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://pay.hotmart.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
