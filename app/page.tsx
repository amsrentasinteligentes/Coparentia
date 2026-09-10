'use client';

// Landing de Coparentia — 10 secciones canónicas (19-PAGINA-DE-VENTAS.md), construidas con el
// kit de components/landing/. Copy trazado a FICHA-AVATAR.md, tokens a FICHA-ARTE.md.
// Copy fuente: docs/copy/landing.md.

import { useEffect, useState } from 'react';
import { MessageCircleWarning, ReceiptText, ShieldAlert, CalendarClock, CalendarDays, Home as HomeIcon, ListChecks, CreditCard, Upload } from 'lucide-react';
import { obtenerTRM } from '@/lib/trm';
import { aproximadoEnPesos } from '@/lib/formato-cop';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { AnuncioAbogados } from '@/components/landing/AnuncioAbogados';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

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
    <div id="main" className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="Coparentia"
        logo={<img src="/logo-isotipo.png" alt="" aria-hidden="true" className="size-6 object-contain" />}
        loginHref="/entrar"
        h1Marked="Tu cuota, [acento]pagada y probada[/acento]"
        subtitleMarked="El Sello de Confianza convierte tus comprobantes en un expediente [b]listo para mostrar[/b]"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>7 días de prueba gratis — cancela cuando quieras</span>}
        visual={<img src="/hero-visual-inicio.png" alt="Tu expediente: anillo de avance, total registrado y próximo evento" className="w-full" />}
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: MessageCircleWarning, textoMarked: '¿Te reclaman pagos que [b]ya hiciste[/b] y no encuentras el comprobante?' },
          { icon: CalendarClock, textoMarked: '¿No tienes clara tu fecha de pago o cuándo aumenta tu cuota?' },
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
          anilloHoy: 0,
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo desorden — con 6 meses menos de comprobantes a mano.',
          anilloFuturo: 0,
        }}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
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
          anilloAntes: 0,
          labelDespues: 'Después',
          despues: 'Un expediente exportable, con fecha y soporte, listo en segundos.',
          anilloDespues: 100,
        }}
      />

      {/* 5. LA APP POR DENTRO */}
      <AppPorDentro
        tituloMarked="Tu expediente, [acento]siempre a mano[/acento]"
        frames={[
          { label: 'Tu expediente al día', src: '/frame-inicio.png', nombrePantalla: 'Inicio', iconoPlaceholder: HomeIcon },
          { label: 'Cuéntanos tu situación', src: '/frame-onboarding.png', nombrePantalla: 'Onboarding', iconoPlaceholder: ListChecks },
          { label: 'Elige tu plan', src: '/frame-paywall.png', nombrePantalla: 'Paywall', iconoPlaceholder: CreditCard },
          { label: 'Sube tu comprobante', src: '/frame-pagos.png', nombrePantalla: 'Registro de pago', iconoPlaceholder: Upload },
          { label: 'Visitas, citas y actividades', src: '/frame-calendario.png', nombrePantalla: 'Calendario', iconoPlaceholder: CalendarDays },
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
          nota: 'Hoy no pagas nada. Después: US$89 al año (US$7.42/mes)',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'AHORRAS 25%',
          precioMes: 'US$7.42',
          totalAnual: 'Se cobra US$89 al año',
          ahorro: '3 meses gratis',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_HREF,
          features: [
            'Sello de Confianza en cada comprobante',
            'Expediente exportable en PDF foliado',
            'Registro de autorizaciones y controversias',
            'Alertas de vencimiento y soporte faltante',
            'Garantía del Primer Expediente (15 días)',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: 'US$9.99',
          ctaLabel: 'Elegir mensual',
          ctaHref: CTA_HREF,
          // Antes repetía 4 de los 5 bullets del plan anual y el diferenciador real se diluía.
          // Ahora dice solo en qué se diferencia: mismas funciones, sin compromiso de 12 meses.
          features: [
            'Todo lo que incluye el plan Anual',
            'Cancelas cuando quieras, sin permanencia',
            'Garantía del Primer Expediente (15 días)',
          ],
        }}
      />

      {/* 7. GARANTÍA — 15 días > 7 días de prueba (regla dura 18, verificada en FICHA-MERCADO.md) */}
      <Garantia
        nombre="la Garantía del Primer Expediente"
        condicionMarked="Si en 15 días no tienes tu primer comprobante organizado y listo para exportar, escribes un correo y [b]te devolvemos todo[/b]. Sin preguntas."
        pisoLegal="Respaldada por la garantía Hotmart de 15 días"
      />

      {/* 8. FAQ */}
      <Faq
        items={[
          {
            pregunta: '¿Mi ex tiene que descargar la app también?',
            respuestaMarked:
              'No: Coparentia funciona 100% de forma [b]unilateral[/b] — es tu expediente, se una tu ex o no.',
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
              'Menos de US$0.25 al día con el plan anual — comparado con lo que cobra un abogado por cada correo de aclaración, [b]se paga solo[/b].',
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
        recap="7 días de prueba gratis · Garantía del Primer Expediente (15 días)"
        psMarked="PS: Coparentia convierte tus comprobantes en un expediente fechado y listo para mostrar con el Sello de Confianza. Hoy entras con 7 días gratis y la Garantía del Primer Expediente de 15 días."
      />

      {/* SECCIÓN EXTRA (fuera de la estructura canónica de 19, pedida por el usuario):
          audiencia distinta — abogados de familia que quieren anunciarse en la app. */}
      <AnuncioAbogados contactoEmail="alianzas@coparentia.app" />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="Coparentia"
        logo={<img src="/logo-isotipo.png" alt="" aria-hidden="true" className="size-5 object-contain" />}
        soporteEmail="soporte@coparentia.app"
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
