'use client';

// Landing de Coparentia — 10 secciones canónicas (19-PAGINA-DE-VENTAS.md), construidas con el
// kit de components/landing/. Copy trazado a FICHA-AVATAR.md, tokens a FICHA-ARTE.md.
// Copy fuente: docs/copy/landing.md.
//
// VARIANTE CLARA "Cuidado en calma" (2026-09-17): SOLO esta página va en claro (decisión del
// usuario tras el A/B/C — FICHA-ARTE.md, "Variante CLARA de la PÁGINA DE VENTAS"). El envoltorio
// `.tema-claro` redefine los tokens del kit (components/landing/tokens-claro.css); el interior de
// la app, el onboarding y el paywall siguen oscuros y no se tocan.

import { useEffect, useState } from 'react';
import { Figtree, Nunito_Sans } from 'next/font/google';
import { MessageCircleWarning, ReceiptText, ShieldAlert, CalendarDays, Home as HomeIcon, ListChecks, CreditCard, Upload } from 'lucide-react';
import { obtenerTRM } from '@/lib/trm';
import { aproximadoEnPesos } from '@/lib/formato-cop';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { DemoSello } from '@/components/landing/DemoSello';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { AnuncioAbogados } from '@/components/landing/AnuncioAbogados';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

// Tipografía de la variante clara — se carga SOLO en esta ruta (next/font hace subset + self-host).
const figtree = Figtree({ variable: '--font-figtree', subsets: ['latin'], weight: ['500', '700', '800'] });
const nunitoSans = Nunito_Sans({ variable: '--font-nunito-sans', subsets: ['latin'], weight: ['400', '600', '700'] });

// Modelo 2 (onboarding-first, default B2C de 02C): el CTA lleva a /onboarding,
// nunca al checkout desde el hero.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Crear mi expediente gratis';

// Cobro anual real en USD (FICHA-MERCADO: Hotmart internacional cobra en dólares).
const COBRO_ANUAL_USD = 89;

export default function Home() {
  // Referencia en pesos del cargo anual, con la TRM oficial. Si la fuente falla, `refCop` queda
  // vacío y la landing muestra solo dólares — nunca un número en pesos inventado.
  const [refCop, setRefCop] = useState<string | null>(null);
  useEffect(() => {
    obtenerTRM()
      .then((trm) => {
        if (trm) setRefCop(`≈ ${aproximadoEnPesos(COBRO_ANUAL_USD, trm)} COP al año`);
      })
      .catch(() => setRefCop(null));
  }, []);

  return (
    <div id="main" className={`tema-claro ${figtree.variable} ${nunitoSans.variable} min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]`}>
      {/* 1. HERO */}
      <Hero
        appName="Coparentia"
        logo={<img src="/logo-horizontal.webp" alt="Coparentia" className="h-10 w-auto object-contain lg:h-12" />}
        marcaSoloLogo
        loginHref="/entrar"
        navLinks={[
          { label: 'Cómo funciona', href: '#como-funciona' },
          { label: 'Planes', href: '#oferta' },
          { label: 'Para abogados', href: '#abogados' },
        ]}
        // Promesa en dos tiempos (FICHA-AVATAR: dolor = caos de gastos + acusaciones; deseo = paz):
        // primero lo concreto que se resuelve, después lo que la persona quiere sentir.
        h1Marked="Menos discusiones por dinero. [acento]Más calma[/acento] para tus hijos."
        subtitleMarked="Tus comprobantes con fecha, en un solo lugar, [b]sin depender de la otra persona[/b]."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={
          <span className="block">
            7 días gratis · Garantía de 15 días
            <span className="mt-0.5 block text-[12px] text-[var(--text-tertiary)] lg:text-[13px]">
              Registras tu medio de pago hoy; el primer cobro entra el día 8.
            </span>
          </span>
        }
        visual={<img src="/frame-inicio.png" alt="Pantalla de inicio de Coparentia: tu expediente con el avance del mes, el total registrado y los últimos movimientos" className="w-full" />}
        // Fotos de Unsplash (licencia Unsplash: uso comercial libre) elegidas por el usuario el 2026-09-18
        // (opciones A y E de public/dev/fotos-propuesta.html), optimizadas a 1200px en public/fotos/.
        foto={<img src="/fotos/hero-mama-hijo-celular.jpg" alt="Mamá e hijo sonriendo mientras miran el celular en el sofá" className="h-full w-full object-cover object-[60%_35%]" width={1200} height={675} />}
        // "10 minutos" es el tiempo medido del onboarding + primer comprobante (guía "Tu primer
        // expediente en 10 minutos" del stack de valor) — no una cifra de marketing inventada.
        burbuja={{ titulo: 'Tu primer expediente', dato: 'Listo en 10 minutos' }}
        pilares={['Gastos al día', 'Sello de Confianza en cada comprobante', 'Mente en calma']}
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          // Dolor ★ #1 de FICHA-AVATAR, con sus palabras: "por más que pago… me tratan de mala paga".
          { icon: MessageCircleWarning, textoMarked: '¿Por más que pagas te siguen tratando de [b]"mala paga"[/b]?' },
          { icon: ReceiptText, textoMarked: '¿Te reclaman pagos que [b]ya hiciste[/b] y no encuentras el comprobante?' },
          { icon: ReceiptText, textoMarked: '¿Te piden dinero para gastos "urgentes" sin ningún soporte?' },
          { icon: ShieldAlert, textoMarked: '¿Vives con miedo a una demanda que no sabrías cómo responder?' },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Cada mes sin un registro claro es un mes más de discusiones que no terminan.',
          'En un año, eso puede ser [acento]cientos de dólares[/acento] en honorarios de abogado solo para "aclarar cuentas".',
          'Un Excel o una captura de WhatsApp [b]no alcanzan[/b] cuando de verdad los necesitas.',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Capturas de pantalla dispersas y la ansiedad de no poder probar nada.',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo desorden — con 6 meses menos de comprobantes a mano.',
        }}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
        id="como-funciona"
        foto={
          <span className="relative block h-full w-full">
            <img src="/fotos/solucion-papa-hija.jpg" alt="Papá e hija riendo juntos" className="h-full w-full object-cover object-[42%_28%]" width={1200} height={800} loading="lazy" />
            {/* Velo cálido tenue: la foto es más fría que la del hero y sin él parecían dos tratamientos. */}
            <span aria-hidden="true" className="absolute inset-0 bg-[var(--foto-1)] opacity-10 mix-blend-multiply" />
          </span>
        }
        tituloMarked="Tu prueba, [acento]lista antes de que te pidan[/acento]"
        mecanismo="el Sello de Confianza"
        bigIdeaMarked="No es que no pagues — es que no tienes cómo [b]probarlo[/b]. El Sello de Confianza convierte cada comprobante en una prueba fechada y organizada."
        pasos={[
          { titulo: 'Subes tu comprobante', detalle: 'Foto o PDF, directo desde tu teléfono.' },
          { titulo: 'El Sello lo confirma', detalle: 'Lo lee, lo fecha y lo asocia al gasto correcto.' },
          { titulo: 'Queda en tu expediente', detalle: 'Listo para exportar cuando lo necesites.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Capturas perdidas en el chat y ningún orden.',
          labelDespues: 'Después',
          despues: 'Un expediente exportable, con fecha y soporte, listo en segundos.',
        }}
      />

      {/* 5. LA APP POR DENTRO */}
      <AppPorDentro
        tituloMarked="Tu expediente, [acento]siempre a mano[/acento]"
        frames={[
          { label: 'Tu expediente al día', src: '/frame-inicio.png', nombrePantalla: 'Inicio', iconoPlaceholder: HomeIcon },
          // Solo pantallas del INTERIOR (la sección se llama 'así se ve por dentro'): el recorrido de
          // inicio y la pantalla de planes siguen en el tema oscuro por decisión del usuario y aquí
          // desentonaban (2026-09-18).
          { label: 'Tu cuota y tus comprobantes', src: '/frame-pagos.png', nombrePantalla: 'Pagos', iconoPlaceholder: Upload },
          { label: 'Visitas, citas y actividades', src: '/frame-calendario.png', nombrePantalla: 'Calendario', iconoPlaceholder: CalendarDays },
          { label: 'Tu expediente en PDF, en 1 toque', src: '/frame-expediente.png', nombrePantalla: 'Expediente', iconoPlaceholder: ListChecks },
          { label: 'Tu cuenta y tu suscripción', src: '/frame-perfil.png', nombrePantalla: 'Perfil', iconoPlaceholder: CreditCard },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]menos de US$0.25/día[/acento]"
        trialDias={7}
        refCopAnual={refCop ?? undefined}
        stack={{
          lineas: [
            { resultado: 'Coparentia Pro con el Sello de Confianza (12 meses)', valor: 'US$120' },
            { resultado: 'Plantilla de autorización de gastos extraordinarios', valor: 'US$19' },
            { resultado: 'Guía "Tu primer expediente en 10 minutos"', valor: 'US$15' },
          ],
          totalTachado: 'US$154',
          nota: 'Hoy no pagas nada. Después: US$89 al año con el plan Anual (US$7.42/mes)',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'AHORRAS US$30.88 AL AÑO',
          precioMes: 'US$7.42',
          totalAnual: 'Se cobra US$89 al año',
          ctaLabel: 'Crear mi expediente gratis',
          ctaHref: '/onboarding?plan=anual',
          features: [
            'Sello de Confianza en cada comprobante',
            'Expediente en PDF, con cada página numerada',
            'Autorizaciones y desacuerdos, por escrito',
            'Alertas de vencimiento y soporte faltante',
            'Garantía del Primer Expediente (15 días)',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: 'US$9.99',
          ctaLabel: 'Empezar mi plan mensual',
          ctaHref: '/onboarding?plan=mensual',
          // Antes repetía 4 de los 5 bullets del plan anual y el diferenciador real se diluía.
          // Ahora dice solo en qué se diferencia: mismas funciones, sin compromiso de 12 meses.
          features: [
            'Todas las funciones del plan Anual',
            'Sin compromiso de 12 meses',
            'Garantía del Primer Expediente (15 días)',
          ],
        }}
      />

      {/* 7. GARANTÍA — 15 días > 7 días de prueba (regla dura 18, verificada en FICHA-MERCADO.md) */}
      <Garantia
        nombre="Garantía del Primer Expediente"
        condicionMarked="Si en 15 días no tienes tu primer comprobante organizado y listo para exportar, escribes un correo y [b]te devolvemos todo[/b]. Sin preguntas."
        pisoLegal="Respaldada por la garantía Hotmart de 15 días"
      />

      {/* 7B. EL MECANISMO EN ACCIÓN — la página contaba el Sello; ahora lo muestra funcionando
          (grabación real de la app con datos de ejemplo, nunca de un cliente). */}
      <DemoSello
        id="demo"
        tituloMarked="Mira el [acento]Sello de Confianza[/acento] en acción"
        subtitulo="Esto es la app de verdad: un comprobante entra, queda fechado y sale en tu expediente listo para mostrar."
        pasos={[
          'Registras el comprobante: una foto basta y el monto se completa solo.',
          'El Sello lo fecha y lo asocia al gasto correcto.',
          'Exportas tu expediente en PDF, con cada página numerada.',
        ]}
        video="/demo/demo-sello"
      />

      {/* 8. FAQ */}
      <Faq
        items={[
          {
            pregunta: '¿La otra persona tiene que descargar la app también?',
            respuestaMarked:
              'No. [b]Solo la usas tú[/b]: la otra persona no necesita instalar ni aprobar nada.',
          },
          {
            pregunta: '¿Esto tiene validez ante un juez?',
            respuestaMarked:
              'Organiza tu evidencia en un formato claro y fechado para tu abogado o conciliador — no reemplaza la asesoría legal, [b]la potencia[/b].',
          },
          {
            pregunta: '¿Por qué no me sirve un Excel gratis?',
            respuestaMarked:
              'Un Excel se pierde y se cuestiona; tu expediente queda con fecha, soporte y [b]sin ediciones silenciosas[/b].',
          },
          {
            pregunta: '¿Es muy cara la suscripción?',
            respuestaMarked:
              'Menos de US$0.25 al día con el plan anual — comparado con los US$100 que puede cobrar un abogado por cada correo de aclaración, [b]se paga solo[/b].',
          },
          {
            pregunta: '¿Mis datos financieros están seguros?',
            respuestaMarked:
              'Cifrado en tránsito y en reposo. Tus datos [b]nunca se comparten[/b] sin tu autorización.',
          },
        ]}
      />

      {/* 9. CTA FINAL */}
      <CtaFinal
        h2Marked="Todo lo importante, [acento]bajo control[/acento]. Tu mente, [acento]en calma[/acento]."
        futurePacingMarked="La próxima vez que te reclamen por WhatsApp, abres tu expediente y respondes con hechos — no con capturas sueltas."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="7 días gratis · Garantía de 15 días"
        psMarked="PS: Coparentia convierte tus comprobantes en un expediente fechado y listo para mostrar con el Sello de Confianza. Hoy entras con 7 días gratis —registras tu medio de pago, pero no se te cobra nada hasta el día 8— y, si no armas tu primer expediente en 15 días, te devolvemos todo."
      />

      {/* SECCIÓN EXTRA (fuera de la estructura canónica de 19, pedida por el usuario):
          audiencia distinta — abogados de familia que quieren anunciarse en la app. */}
      <AnuncioAbogados id="abogados" contactoEmail="alianzas@coparentia.co" />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="Coparentia"
        logo={<img src="/logo-horizontal.webp" alt="Coparentia" className="h-7 w-auto object-contain" />}
        marcaSoloLogo
        soporteEmail="soporte@coparentia.co"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso-ia' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
