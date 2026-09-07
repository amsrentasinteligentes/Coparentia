'use client';

// Landing de Coparentia — 10 secciones canónicas (19-PAGINA-DE-VENTAS.md), construidas con el
// kit de components/landing/. Copy trazado a FICHA-AVATAR.md, tokens a FICHA-ARTE.md.
// Copy fuente: docs/copy/landing.md.

import { MessageCircleWarning, FileSearch, ReceiptText, ShieldAlert } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

// Modelo 2 (onboarding-first, default B2C de 02C): el CTA lleva a /onboarding,
// nunca al checkout desde el hero.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Crear mi expediente gratis';

export default function Home() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="Coparentia"
        loginHref="/entrar"
        h1Marked="Tu cuota, [acento]pagada y probada[/acento]"
        subtitleMarked="El Sello de Confianza convierte tus comprobantes en un expediente [b]listo para mostrar[/b]"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Garantía Hotmart de 7 días — sin preguntas</span>}
        visualPlaceholderSugerencia="captura de la pantalla principal: expediente con el anillo de avance"
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: MessageCircleWarning, textoMarked: '¿Te reclaman por WhatsApp pagos que [b]ya hiciste[/b]?' },
          { icon: FileSearch, textoMarked: '¿Terminas la noche buscando un comprobante de hace 6 meses?' },
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
          { label: 'Tu expediente al día', nombrePantalla: 'Inicio' },
          { label: 'Cuéntanos tu situación', nombrePantalla: 'Onboarding' },
          { label: 'Elige tu plan', nombrePantalla: 'Paywall' },
          { label: 'Sube tu comprobante', nombrePantalla: 'Registro de pago' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]menos de $0.33/día[/acento]"
        trialDias={7}
        stack={{
          lineas: [
            { resultado: 'Coparentia Pro con el Sello de Confianza (12 meses)', valor: '$120' },
            { resultado: 'Plantilla de autorización de gastos extraordinarios', valor: '$19' },
            { resultado: 'Guía "Tu primer expediente en 10 minutos"', valor: '$15' },
          ],
          totalTachado: '$154',
          nota: 'Hoy: $7.42/mes (se cobra $89/año)',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'AHORRAS 33%',
          precioMes: '$7.42',
          totalAnual: 'Se cobra $89/año',
          ahorro: '4 meses gratis',
          descomposicionDia: 'menos de $0.25 al día',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_HREF,
          features: [
            'Sello de Confianza en cada comprobante',
            'Expediente exportable en PDF foliado',
            'Registro de autorizaciones y controversias',
            'Alertas de vencimiento y soporte faltante',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$9.99',
          ctaLabel: 'Elegir mensual',
          ctaHref: CTA_HREF,
          features: [
            'Sello de Confianza en cada comprobante',
            'Expediente exportable en PDF foliado',
            'Registro de autorizaciones y controversias',
            'Cancelas cuando quieras',
          ],
        }}
      />

      {/* 7. GARANTÍA */}
      <Garantia
        nombre="la Garantía del Primer Expediente"
        condicionMarked="Si en 7 días no tienes tu primer comprobante organizado y listo para exportar, escribes un correo y [b]te devolvemos todo[/b]. Sin preguntas."
        pisoLegal="Respaldada por la garantía Hotmart de 7 días"
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
              'Menos de $0.33 al día — comparado con los $100 que cobra un abogado por cada correo de aclaración, [b]se paga solo[/b].',
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
        h2Marked="Imagina [acento]dormir en paz[/acento]"
        futurePacingMarked="La próxima vez que te reclamen por WhatsApp, abres tu expediente y respondes con hechos — no con capturas sueltas."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Garantía del Primer Expediente · 7 días gratis"
        psMarked="PS: Coparentia convierte tus comprobantes en un expediente fechado y listo para mostrar con el Sello de Confianza. Hoy entras con 7 días gratis y la Garantía del Primer Expediente."
      />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="Coparentia"
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
