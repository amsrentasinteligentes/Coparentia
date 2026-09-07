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
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">Última actualización: septiembre de 2026</p>

        <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <p>
            En Coparentia tratamos datos financieros, familiares y, en algunos casos, de menores de
            edad. Este documento explica qué datos recogemos, para qué los usamos y qué derechos
            tienes sobre ellos, conforme a la Ley 1581 de 2012 (protección de datos personales en
            Colombia) y buenas prácticas internacionales de privacidad.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Qué datos recogemos</h2>
          <p>
            Datos de tu cuenta (nombre, correo), datos de tus hijos estrictamente necesarios para
            gestionar la obligación alimentaria (nombre, fecha de nacimiento), comprobantes de pago
            y documentos que subas (facturas, transferencias, títulos jurídicos), y datos de uso de
            la aplicación con fines de mejora del servicio.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Para qué los usamos</h2>
          <p>
            Para generar tu expediente, calcular estados de cuenta a partir de los registros que tú
            suministras, enviarte alertas de vencimiento, y procesar tu suscripción. Nunca vendemos
            tus datos a terceros ni los compartimos sin tu autorización expresa, salvo obligación
            legal.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cifrado y seguridad</h2>
          <p>
            Tus datos viajan cifrados en tránsito y se almacenan cifrados en reposo. El acceso está
            limitado por roles: solo tú (y quien autorices explícitamente, como tu abogado) puede
            ver tu expediente.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Datos de menores</h2>
          <p>
            Solo recogemos los datos de tus hijos estrictamente necesarios para el servicio, bajo
            medidas reforzadas de protección, respetando su interés superior conforme a la Ley 1098
            de 2006.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Tus derechos</h2>
          <p>
            Puedes acceder, corregir o solicitar la eliminación de tus datos escribiendo a{' '}
            <a href="mailto:soporte@coparentia.app" className="text-[var(--accent)] underline">
              soporte@coparentia.app
            </a>
            . La eliminación de tu cuenta preserva la trazabilidad legalmente exigible cuando
            corresponda, informándotelo antes de proceder.
          </p>

          <p className="text-sm text-[var(--text-tertiary)] pt-4 border-t border-[var(--surface-2)]">
            Este documento está en revisión legal final antes del lanzamiento público, conforme a
            la nota de actualización de la propuesta jurídica base del producto.
          </p>
        </div>
      </div>
    </main>
  );
}
