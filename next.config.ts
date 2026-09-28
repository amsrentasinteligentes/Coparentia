import type { NextConfig } from "next";

// Encabezados de seguridad de línea base — no existían (hallazgo de la auditoría de seguridad,
// 27-REVISION-SEGURIDAD.md, A02 Security Misconfiguration). Sin CSP estricto con nonce todavía
// (requeriría reescribir cómo se cargan los estilos/fuentes; se deja para cuando haya IA/terceros
// nuevos que lo justifiquen), pero estos 5 cierran los huecos más comunes y baratos de cerrar:
// clickjacking, MIME-sniffing, fuga de referrer entre sitios, y acceso a cámara/micrófono/ubicación
// que esta app nunca usa.
const nextConfig: NextConfig = {
  devIndicators: false,
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
        ],
      },
    ];
  },
};

export default nextConfig;
