import type { NextConfig } from "next";

// Encabezados de seguridad de línea base — no existían (hallazgo de la auditoría de seguridad,
// 27-REVISION-SEGURIDAD.md, A02 Security Misconfiguration). Sin CSP estricto con nonce todavía
// (requeriría reescribir cómo se cargan los estilos/fuentes; se deja para cuando haya IA/terceros
// nuevos que lo justifiquen), pero estos 5 cierran los huecos más comunes y baratos de cerrar:
// clickjacking, MIME-sniffing, fuga de referrer entre sitios, y acceso a cámara/micrófono/ubicación
// que esta app nunca usa.
const nextConfig: NextConfig = {
  devIndicators: false,
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
