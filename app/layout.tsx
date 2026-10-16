import type { Metadata, Viewport } from "next";
import { Spectral, IBM_Plex_Sans } from "next/font/google";
import { ACCENT_HEX } from "@/lib/marca";
import { MetaPixel } from "@/components/MetaPixel";
import { BannerCookies } from "@/components/BannerCookies";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const TITULO = "Coparentia — Cuota alimentaria para padres separados";
const DESCRIPCION =
  "El expediente digital para padres separados: cada pago de la cuota alimentaria con su comprobante y su fecha, organizado en un solo lugar y sin depender de la otra persona.";

export const metadata: Metadata = {
  // Vista previa al compartir el enlace (WhatsApp, redes): título, descripción e imagen propios.
  // `metadataBase` vuelve absolutas las direcciones de imagen, que es lo que esas apps exigen.
  metadataBase: new URL("https://coparentia.co"),
  title: TITULO,
  description: DESCRIPCION,
  openGraph: {
    type: "website",
    siteName: "Coparentia",
    locale: "es_CO",
    // Sin título ni descripción fijos aquí: cada página usa los suyos (artículos, legales, especialistas).
    images: [
      {
        url: "/og-coparentia.png",
        width: 1200,
        height: 630,
        alt: "Coparentia: cada pago de la cuota alimentaria, con comprobante y fecha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-coparentia.png"],
  },
  // iPhone/Safari NO lee app/manifest.ts (esa es la parte de Android/Chrome): sin estas 3 líneas,
  // "Agregar a inicio" en iOS deja un acceso directo que sigue abriendo Safari con su barra completa
  // — con ellas, abre a pantalla completa como cualquier app instalada (2026-09-24, PWA instalable).
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Coparentia",
  },
  // Next.js solo emite la etiqueta genérica moderna (`mobile-web-app-capable`); los iPhones más
  // viejos que todavía circulan en Colombia solo entienden el nombre clásico de Apple — se agrega
  // aparte para no dejarlos fuera.
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

// `viewportFit: 'cover'` es lo que activa `env(safe-area-inset-*)` de verdad — el nav de abajo y
// `<ContenedorApp>` ya lo usaban (barra fija + colchón inferior), pero sin esto el navegador nunca
// entrega esos valores de forma confiable: el cálculo del espacio seguro queda a criterio de cada
// navegador/momento, lo que explica que el menú se viera bien casi siempre y solo a veces (recién
// entrando por primera vez a una pantalla) las etiquetas quedaran tapadas hasta deslizar.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Tiñe la barra de direcciones del navegador (Android/Chrome) con el acento de marca — no cambia
  // nada dentro de la app instalada, esa parte ya la fija manifest.ts (theme_color).
  themeColor: ACCENT_HEX,
  // Sin esto, Chrome/Android con el celular en modo oscuro REPINTA la página por su cuenta (su
  // función "Tema oscuro" / auto-dark) porque nunca le dijimos qué tema tiene la página — así se
  // explica que las tarjetas de "Trabajadores sociales"/"Psicólogos" se vieran oscuras en Android
  // aunque en el código y en el computed style todo estuviera correcto (2026-09-29, 3ª ronda: los
  // dos fixes anteriores de color-mix no cambiaron nada porque el navegador los sobreescribía
  // DESPUÉS). Toda la landing, el funnel y el interior de la app son claros — esto lo declara.
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${spectral.variable} ${ibmPlexSans.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col">
        {/* Skip-to-content: primer elemento focoable — invisible hasta que llega el foco por teclado */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-[var(--radius-button)] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--bg)]"
        >
          Saltar al contenido
        </a>
        {children}
        {/* Medición de anuncios (auditoría 2026-10-02): inertes sin NEXT_PUBLIC_META_PIXEL_ID y el
            Pixel solo se carga si la persona acepta el aviso. Ver lib/meta-pixel.ts. */}
        <MetaPixel />
        <BannerCookies />
      </body>
    </html>
  );
}
