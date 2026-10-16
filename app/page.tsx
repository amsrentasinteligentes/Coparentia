'use client';

// Landing de Coparentia — 10 secciones canónicas (19-PAGINA-DE-VENTAS.md), construidas con el
// kit de components/landing/. Copy trazado a FICHA-AVATAR.md, tokens a FICHA-ARTE.md.
// Copy fuente: docs/copy/landing.md.
//
// VARIANTE CLARA "Cuidado en calma" (2026-09-17): SOLO esta página va en claro (decisión del
// usuario tras el A/B/C — FICHA-ARTE.md, "Variante CLARA de la PÁGINA DE VENTAS"). El envoltorio
// `.tema-claro` redefine los tokens del kit (components/landing/tokens-claro.css); el interior de
// la app, el onboarding y el paywall siguen oscuros y no se tocan.

import { Figtree, Nunito_Sans } from 'next/font/google';
import { MessageCircleWarning, ReceiptText, ShieldAlert, AlarmClock, Wallet, FileQuestion, CalendarDays, Home as HomeIcon, ListChecks, Upload, Scale } from 'lucide-react';
import { DIA_PRIMER_COBRO, PRECIOS, TRIAL_DIAS, usd } from '@/lib/precios';
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
import { ENLACES_LEGALES, ENLACE_ESPECIALISTAS } from '@/components/landing/enlaces-legales';
import { StickyCtaMobile } from '@/components/landing/ui';

// Tipografía de la variante clara — se carga SOLO en esta ruta (next/font hace subset + self-host).
const figtree = Figtree({ variable: '--font-figtree', subsets: ['latin'], weight: ['500', '700', '800'] });
const nunitoSans = Nunito_Sans({ variable: '--font-nunito-sans', subsets: ['latin'], weight: ['400', '600', '700'] });

// Modelo 2 (onboarding-first, default B2C de 02C): el CTA lleva a /onboarding,
// nunca al checkout desde el hero.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Crear mi expediente gratis';

// Los precios, la prueba gratis y el día del primer cobro viven en lib/precios.ts (una sola fuente).
// Aquí NO hay ninguna conversión a pesos: la hace Hotmart al pagar (hallazgo 4 de la auditoría).

export default function Home() {
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
          // El directorio salió de esta página (2026-10-14): lleva a su página propia. Mismo nombre que el pie
          // ("Especialistas y artículos") y que la frase de "Así se ve por dentro": un destino, un nombre.
          // En computador grande dice "Directorio de especialistas" (igual que el título de esa página); en pantallas
          // medianas y en celular, "Especialistas". Se muestra también en celular, junto a "Planes" y "Entrar".
          { label: 'Especialistas', labelLargo: 'Directorio de especialistas', href: '/especialistas', visibleEnMovil: true },
        ]}
        // Promesa en dos tiempos (FICHA-AVATAR: dolor = caos de gastos + acusaciones; deseo = paz):
        // primero lo concreto que se resuelve, después lo que la persona quiere sentir.
        h1Marked="Padres separados: cada pago de la cuota alimentaria, con [acento]comprobante y fecha[/acento]"
        subtitleMarked="Todo en un solo lugar, listo para mostrar, [b]sin depender de la otra persona[/b]."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={
          <span className="block">
            {TRIAL_DIAS} días gratis · Garantía de 15 días
            <span className="mt-0.5 block text-[13px] text-[var(--text-tertiary)] lg:text-[14px]">
              Registras tu medio de pago hoy; el primer cobro entra el día {DIA_PRIMER_COBRO}.
            </span>
          </span>
        }
        visual={<img src="/frame-inicio.webp" alt="Pantalla de inicio de Coparentia: tu expediente con el avance del mes, el total registrado y los últimos movimientos" className="w-full" />}
        // Fotos de Unsplash (licencia Unsplash: uso comercial libre) elegidas por el usuario el 2026-09-18
        // (opciones A y E de docs/referencias-diseno/fotos-propuesta.html), optimizadas a 1200px en public/fotos/.
        foto={<img src="/fotos/hero-mama-hijo-celular.jpg" alt="Mamá e hijo sonriendo mientras miran el celular en el sofá" className="h-full w-full object-cover object-[60%_35%]" width={1200} height={675} />}
        // "10 minutos" es el tiempo medido del onboarding + primer comprobante (guía "Tu primer
        // expediente en 10 minutos" del stack de valor) — no una cifra de marketing inventada.
        burbuja={{ titulo: 'Tu primer expediente', dato: 'Listo en 10 minutos' }}
        pilares={['Gastos al día', 'Sello de Confianza con fecha', 'Mente en calma']}
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        // Dos grupos de 3 (hallazgo 3 de la auditoría, decisión del dueño 2026-10-13): primero quien RECIBE
        // la cuota —el dolor más frecuente de los futuros usuarios— y luego quien PAGA. Son las 6
        // preguntas de siempre repartidas, sin preguntas nuevas; "sola" y "no fuiste clara" se
        // reescribieron para no asumir el género de quien lee.
        grupos={[
          {
            encabezado: 'Si recibes la cuota',
            preguntas: [
              { icon: AlarmClock, textoMarked: '¿Te toca [b]perseguir la cuota[/b] cada mes para que llegue completa?' },
              { icon: Wallet, textoMarked: '¿Cubres [b]los gastos extra por tu cuenta[/b] y nadie te lo reconoce?' },
              { icon: FileQuestion, textoMarked: '¿Te da miedo que digan que [b]tus cuentas no estaban claras[/b]?' },
            ],
          },
          {
            encabezado: 'Si pagas la cuota',
            preguntas: [
              { icon: MessageCircleWarning, textoMarked: '¿Por más que pagas te siguen tratando de [b]"mala paga"[/b]?' },
              { icon: ReceiptText, textoMarked: '¿Te piden dinero para gastos "urgentes" sin ningún soporte?' },
              { icon: ShieldAlert, textoMarked: '¿Vives con miedo a una demanda que no sabrías cómo responder?' },
            ],
          },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        titulo="Que los acuerdos de crianza [acento]no se pierdan entre mensajes[/acento]"
        frases={[
          'Los pagos, las visitas y las decisiones sobre tus hijos necesitan claridad. Con COPARENTIA puedes llevar un registro de lo acordado, organizar los soportes y consultar la información cuando la necesites. Así evitas volver a discutir sobre lo que ya quedó registrado.',
          'Y si surge una reclamación, tendrás la información reunida para preparar una respuesta o sustentar una actuación judicial o extrajudicial.',
          'Empieza hoy a organizar tu crianza compartida con COPARENTIA.',
        ]}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
        id="como-funciona"
        tituloMarked="Tu prueba, [acento]lista antes de que te pidan[/acento]"
        mecanismo="el Sello de Confianza"
        bigIdeaMarked="No es que no pagues — es que no tienes cómo [b]probarlo[/b]. Míralo aquí: un comprobante entra y sale convertido en prueba fechada."
        pasos={[
          { titulo: 'Le tomas la foto al recibo', marca: '0:06', detalle: 'Desde tu teléfono, como cualquier foto.' },
          { titulo: 'El Sello lo confirma', marca: '0:12', detalle: 'Lee el monto solo, lo fecha y lo asocia al gasto.' },
          { titulo: 'Queda en tu expediente', marca: '0:21', detalle: 'Listo para exportar cuando lo necesites.' },
        ]}
        demo={{ video: '/demo/demo-sello', pie: 'Grabado de la app real, con datos de ejemplo. La espera del PDF va acelerada.' }}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 5. LA APP POR DENTRO */}
      <AppPorDentro
        tituloMarked="Tu expediente, [acento]siempre a mano[/acento]"
        frames={[
          { label: 'Tu expediente al día', src: '/frame-inicio.webp', nombrePantalla: 'Inicio', iconoPlaceholder: HomeIcon },
          // Solo pantallas del INTERIOR (la sección se llama 'así se ve por dentro'): el recorrido de
          // inicio y la pantalla de planes siguen en el tema oscuro por decisión del usuario y aquí
          // desentonaban (2026-09-18).
          { label: 'Tu cuota y tus comprobantes', src: '/frame-pagos.webp', nombrePantalla: 'Pagos', iconoPlaceholder: Upload },
          { label: 'Visitas, citas y actividades', src: '/frame-calendario.webp', nombrePantalla: 'Calendario', iconoPlaceholder: CalendarDays },
          { label: 'Tu expediente en PDF, en 1 toque', src: '/frame-expediente.webp', nombrePantalla: 'Expediente', iconoPlaceholder: ListChecks },
          // Misma palabra que el menú, el pie y la frase de abajo (2026-10-14): "Especialistas". La "consulta
          // directa" es real DENTRO de la app (la pantalla Asistencia tiene el formulario de consulta).
          { label: 'Especialistas, artículos y una consulta directa', src: '/frame-especialistas.webp', nombrePantalla: 'Especialistas', iconoPlaceholder: Scale },
        ]}
        nota="Dentro de la app también tienes el calendario de eventos y el directorio de especialistas."
      />

      {/* 6. OFERTA */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]menos de US$0.25/día[/acento]"
        trialDias={TRIAL_DIAS}
        stack={{
          lineas: [
            { resultado: 'Coparentia Pro con el Sello de Confianza — 12 meses, pagando mes a mes', valor: usd(PRECIOS.mensualPorAnoUsd) },
            { resultado: 'Plantilla de autorización de gastos extraordinarios', valor: 'Incluida' },
            { resultado: 'Guía "Tu primer expediente en 10 minutos"', valor: 'Incluida' },
          ],
          totalTachado: usd(PRECIOS.mensualPorAnoUsd),
          etiquetaTotal: 'Pagando mes a mes',
          nota: `Hoy no pagas nada. Después: ${usd(PRECIOS.anual.cobroUsd)} al año con el plan Anual (${usd(PRECIOS.anual.mesUsd)}/mes) — ${usd(PRECIOS.ahorroAnualUsd)} menos que pagando mes a mes`,
        }}
        anual={{
          nombre: 'Anual',
          badge: `AHORRAS ${usd(PRECIOS.ahorroAnualUsd)} AL AÑO`,
          precioMes: usd(PRECIOS.anual.mesUsd),
          totalAnual: `Se cobra ${usd(PRECIOS.anual.cobroUsd)} al año`,
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
          precioMes: usd(PRECIOS.mensual.cobroUsd),
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
        recap={`${TRIAL_DIAS} días gratis · Garantía de 15 días`}
        psMarked={`PS: Coparentia convierte tus comprobantes en un expediente fechado y listo para mostrar con el Sello de Confianza. Hoy entras con ${TRIAL_DIAS} días gratis —registras tu medio de pago, pero no se te cobra nada hasta el día ${DIA_PRIMER_COBRO}— y, si no armas tu primer expediente en 15 días, te devolvemos todo.`}
      />

      {/* El bloque "Directorio de especialistas" (con "Contactar", artículos y "Quiero anunciarme") vivía
          aquí, justo después del cierre de venta. Se movió a /especialistas (2026-10-14): la página
          principal termina en el cierre de venta, el PS y el pie. */}

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="Coparentia"
        logo={<img src="/logo-horizontal.webp" alt="Coparentia" className="h-10 w-auto object-contain" />}
        marcaSoloLogo
        soporteEmail="soporte@coparentia.co"
        enlaces={[...ENLACES_LEGALES, ENLACE_ESPECIALISTAS]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
