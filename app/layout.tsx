import type { Metadata, Viewport } from "next";
import { Spectral, IBM_Plex_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Coparentia — Tu expediente, en confianza",
  description:
    "El expediente digital que convierte tus pagos y comprobantes en pruebas organizadas, sin depender de que nadie más la use.",
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
      </body>
    </html>
  );
}
