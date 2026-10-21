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
import { OpinionProfesionales } from '@/components/landing/OpinionProfesionales';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { LogoPlaca } from '@/components/landing/LogoPlaca';
import { SelloMarca } from '@/components/landing/SelloMarca';
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
        logo={<LogoPlaca compacto />}
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
          <span className="block text-balance">
            {TRIAL_DIAS} días gratis · Garantía de 15 días
            {/* Decisión #8 (2026-10-20): por ahora la app es solo para Colombia. */}
            <span className="mt-1 block text-[13px] font-semibold text-[var(--text-secondary)] lg:text-[14px]">
              Disponible para Colombia
            </span>
          </span>
        }
        visual={<img src="/frame-inicio.webp" alt="Pantalla de inicio de Coparentia: tu expediente con el avance del mes, el total registrado y los últimos movimientos" className="w-full" />}
        // Fotos de Unsplash (licencia Unsplash: uso comercial libre) elegidas por el usuario el 2026-09-18
        // (opciones A y E de docs/referencias-diseno/fotos-propuesta.html), optimizadas a 1200px en public/fotos/.
        foto={<img src="/fotos/hero-mama-hijo-celular.jpg" alt="Mamá e hijo sonriendo mientras miran el celular en el sofá" className="h-full w-full object-cover object-[60%_35%]" width={1200} height={675} />}
        // "10 minutos" es el tiempo medido del onboarding + primer comprobante — no una cifra de marketing inventada.
        burbuja={{ titulo: 'Tu primer expediente', dato: 'Listo en 10 minutos' }}
        sello={<SelloMarca />}
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
        titulo="Te reclaman un pago o una visita. [acento]¿Dónde quedó lo acordado?[/acento]"
        frases={[
          'Con COPARENTIA cada pago, visita y acuerdo queda registrado, con fecha y en un solo lugar.',
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

      {/* 7B. OPINIÓN DE PROFESIONALES DE FAMILIA (2026-10-15) — prueba de terceros, justo antes de las preguntas.
          Las citas están PALABRA POR PALABRA como las entregó el dueño, cada una con autorización escrita de quien
          la dijo (solo se corrigió ortografía). Ivonne Reyes es familiar del fundador: el dueño decidió (2026-10-20) NO declararlo en la página
          y quitar de la nota la frase "no implican que trabajen para Coparentia", que no podía asegurarse para todas. */}
      <OpinionProfesionales
        titulo="Lo que dicen profesionales de familia"
        citas={[
          {
            texto:
              'Como abogada conciliadora y litigante en derecho de familia, sé lo importante que es tener tus documentos organizados cuando más los necesitas. Con COPARENTIA puedes construir un expediente digital con acuerdos, pagos y comunicaciones que facilite una conciliación o la preparación de una demanda y su contestación. Organiza hoy la información que puede ayudarte a proteger tus derechos y los de tus hijos.',
            extracto: 'Como abogada conciliadora y litigante en derecho de familia, sé lo importante que es tener tus documentos organizados cuando más los necesitas.',
            nombre: 'Ivonne Reyes',
            especialidad: 'Abogada Especialista Conciliadora y Litigante en Derecho de Familia',
            ciudad: 'Bogotá',
          },
          {
            texto:
              'En los procesos de familia, contar con evidencias claras y oportunamente disponibles puede marcar una diferencia importante. Desde mi experiencia como abogada, sé que reconstruir el historial de cumplimiento de las obligaciones económicas se vuelve complejo cuando la documentación se encuentra dispersa, y esto puede dificultar la preparación de una estrategia jurídica dentro de los plazos legales. COPARENTIA ofrece una alternativa práctica para conservar la trazabilidad de los compromisos familiares y disponer de un registro organizado que facilite la consulta y el seguimiento de cada situación.',
            extracto: 'En los procesos de familia, contar con evidencias claras y oportunamente disponibles puede marcar una diferencia importante.',
            nombre: 'Liliana Peñuela',
            especialidad: 'Abogada Litigante Especialista en Derecho de Familia',
            ciudad: 'Bogotá',
          },
          {
            texto:
              'Como psicóloga que acompaña a adultos durante y después de un divorcio emocionalmente difícil, reconozco que reorganizar la vida y asumir una nueva dinámica familiar puede resultar abrumador. El acompañamiento psicológico ayuda a elaborar la pérdida, fortalecer los recursos personales y establecer límites saludables. En este camino, COPARENTIA puede apoyar la organización de acuerdos y responsabilidades relacionados con los hijos, aportando claridad para que cada persona pueda concentrarse también en su recuperación y bienestar emocional.',
            extracto: 'Como psicóloga que acompaña a adultos durante y después de un divorcio emocionalmente difícil, reconozco que reorganizar la vida y asumir una nueva dinámica familiar puede resultar abrumador.',
            nombre: 'Sandra Pineda',
            especialidad: 'Magíster en Psicología Clínica',
            ciudad: 'Bogotá',
          },
        ]}
        // Página 1 del PDF que genera la app (lib/exportar-expediente.ts), con datos FICTICIOS: ninguna persona ni
        // menor real. Se generó llamando a la función real con respuestas de red inventadas.
        imagen={{
          src: '/ejemplo-expediente-pagina.webp',
          alt: 'Página de ejemplo del expediente en PDF: partes, resumen, título de la obligación e historial de pagos, con datos ficticios',
          pie: 'Una página del expediente en PDF, foliada y con fecha. Página de ejemplo con datos ficticios.',
          ancho: 1224,
          alto: 1584,
        }}
        nota="Opiniones personales de cada profesional. No constituyen asesoría legal ni psicológica."
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
              'Un juez valora cada prueba según el caso. Coparentia [b]ordena y fecha tus comprobantes[/b] para que tu abogado decida cómo usarlos.',
          },
          {
            pregunta: '¿Por qué no me sirve un Excel gratis?',
            respuestaMarked:
              'Un Excel se pierde y se cuestiona; tu expediente queda con fecha, soporte y [b]sin ediciones silenciosas[/b].',
          },
          {
            pregunta: '¿Es muy cara la suscripción?',
            respuestaMarked:
              'Menos de US$0.25 al día con el plan anual. Un abogado puede cobrar US$100 por una asesoría: [b]se paga solo[/b].',
          },
          {
            pregunta: '¿Mis datos financieros están seguros?',
            respuestaMarked:
              'Tus datos viajan y se guardan con cifrado. [b]Nunca se comparten[/b] sin tu autorización.',
          },
          {
            pregunta: '¿Funciona fuera de Colombia?',
            respuestaMarked: 'Pronto disponible para otros países.',
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
        psMarked={`PS: Entras con ${TRIAL_DIAS} días gratis (registras tu medio de pago, pero no se te cobra nada hasta el día ${DIA_PRIMER_COBRO}). Si en 15 días no armas tu primer expediente, te devolvemos todo.`}
      />

      {/* El bloque "Directorio de especialistas" (con "Contactar", artículos y "Quiero anunciarme") vivía
          aquí, justo después del cierre de venta. Se movió a /especialistas (2026-10-14): la página
          principal termina en el cierre de venta, el PS y el pie. */}

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="Coparentia"
        logo={<LogoPlaca />}
        marcaSoloLogo
        soporteEmail="soporte@coparentia.co"
        enlaces={[...ENLACES_LEGALES, ENLACE_ESPECIALISTAS]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
