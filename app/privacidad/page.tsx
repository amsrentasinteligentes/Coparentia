import Link from 'next/link';

export const metadata = { title: 'Política de Privacidad — Coparentia' };

export default function Privacidad() {
  return (
    <main className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)] px-6 py-16">
      <div className="mx-auto max-w-[65ch]">
        <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
          ← Volver a Coparentia
        </Link>
        <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">Última actualización: 9 de septiembre de 2026 · versión 2</p>

        <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <p>
            Coparentia es operada por Alejandro Muñoz, desde Colombia. Este documento explica qué
            datos recogemos, para qué los usamos, con quién los compartimos y qué derechos tienes,
            conforme a la Ley 1581 de 2012 (protección de datos personales en Colombia) y buenas
            prácticas internacionales de privacidad.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Qué datos recogemos</h2>
          <p>
            Datos de tu cuenta (nombre, correo electrónico), los registros que tú decides guardar
            en tu expediente (monto, fecha y concepto de cada pago o gasto; el título/cuota
            alimentaria que configuras; eventos de calendario; autorizaciones y controversias), las
            fotos o PDF de comprobantes y documentos que subes, y datos de uso de la aplicación
            (qué acciones realizas, cuándo entras) con fines de mejora del servicio y soporte.
            <br />
            <strong>No recogemos, hoy, ningún dato de tus hijos</strong> (nombre, fecha de
            nacimiento u otro identificador de un menor) — el expediente registra tus pagos y
            gastos, no una ficha de la persona a tu cargo.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Para qué los usamos</h2>
          <p>
            Para generar tu expediente, calcular estados de cuenta a partir de los registros que tú
            suministras, leer automáticamente el monto de la foto de un comprobante para ahorrarte
            escribirlo (tú siempre confirmas o corriges ese número antes de guardarlo), enviarte
            comunicaciones del servicio, y procesar tu suscripción. Nunca vendemos tus datos a
            terceros ni los usamos con fines publicitarios.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Con quién compartimos tus datos</h2>
          <p>
            No vendemos tus datos. Los compartimos únicamente con los proveedores que hacen posible
            el servicio, cada uno con su propia función:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong>Supabase</strong> (EE. UU./UE) — base de datos, autenticación y almacenamiento de tus archivos. Aquí vive todo lo que registras.</li>
            <li><strong>Anthropic</strong> (EE. UU.) — lee la foto de tus comprobantes para extraer el monto automáticamente. Ver el detalle de esta transferencia más abajo.</li>
            <li><strong>Vercel</strong> (EE. UU.) — aloja y publica la aplicación que usas.</li>
            <li><strong>Resend</strong> (EE. UU.) — envía los correos del servicio (tu enlace de acceso, avisos de cuenta).</li>
            <li><strong>Hotmart</strong> (Brasil) — procesa el pago de tu suscripción; nunca vemos ni guardamos los datos de tu tarjeta.</li>
          </ul>
          <p>Solo compartimos lo estrictamente necesario para que cada uno cumpla su función, nunca información adicional.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">La IA y la transferencia internacional de tus datos</h2>
          <p>
            Cuando subes la foto de un comprobante, esa imagen se envía a Anthropic (proveedor de
            inteligencia artificial con sede en Estados Unidos) únicamente para leer el monto — es
            una transferencia internacional de datos, regulada por la Ley 1581. Anthropic procesa
            esa imagen bajo sus propios términos y no la usa para entrenar sus modelos. El monto que
            detecta siempre queda sujeto a tu revisión: tú decides si lo guardas o lo corriges antes
            de que se registre en tu expediente.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cookies</h2>
          <p>
            Coparentia no usa cookies de publicidad ni de analítica de terceros. Usamos únicamente
            una cookie de sesión (de nuestro proveedor de autenticación, Supabase) estrictamente
            necesaria para mantenerte con la sesión iniciada — sin ella no podrías usar la app. No
            requiere un banner de consentimiento porque no es una cookie de seguimiento.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cifrado y seguridad</h2>
          <p>
            Tus datos viajan cifrados en tránsito y se almacenan cifrados en reposo. El acceso está
            limitado por reglas de seguridad a nivel de base de datos: solo tú puedes ver tu
            expediente — ni otros usuarios ni, en el uso normal del servicio, nosotros mismos.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Tus derechos</h2>
          <p>
            Puedes acceder, corregir o eliminar tus datos en cualquier momento. La forma más rápida
            es entrar a <strong>Expediente → Ajustes → Eliminar mi cuenta</strong> dentro de la app:
            borra tu cuenta, tus registros y tus archivos de inmediato, sin necesidad de escribirnos.
            También puedes escribir a{' '}
            <a href="mailto:soporte@coparentia.app" className="text-[var(--accent)] underline">
              soporte@coparentia.app
            </a>{' '}
            para ejercer estos derechos o resolver cualquier duda.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cambios a esta política</h2>
          <p>
            Si hacemos un cambio material a esta política, te lo avisamos por correo antes de que
            entre en vigencia — nunca la cambiamos en silencio. La fecha de arriba siempre refleja
            la versión vigente.
          </p>

          <p className="text-sm text-[var(--text-tertiary)] pt-4 border-t border-[var(--surface-2)]">
            ¿Preguntas sobre tus datos? Escríbenos a{' '}
            <a href="mailto:soporte@coparentia.app" className="underline">soporte@coparentia.app</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
