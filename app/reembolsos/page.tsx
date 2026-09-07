import Link from 'next/link';

export const metadata = { title: 'Política de Reembolsos — Coparentia' };

export default function Reembolsos() {
  return (
    <main className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)] px-6 py-16">
      <div className="mx-auto max-w-[65ch]">
        <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
          ← Volver a Coparentia
        </Link>
        <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
          Política de Reembolsos
        </h1>
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">Última actualización: septiembre de 2026</p>

        <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            La Garantía del Primer Expediente
          </h2>
          <p>
            Si dentro de tus primeros 7 días de suscripción no logras tener tu primer comprobante
            organizado y listo para exportar, escríbenos a{' '}
            <a href="mailto:soporte@coparentia.app" className="text-[var(--accent)] underline">
              soporte@coparentia.app
            </a>{' '}
            y te devolvemos el 100% de tu pago. Sin preguntas, sin formularios.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Piso legal</h2>
          <p>
            Esta garantía está respaldada por la política de reembolso de 7 días configurada en
            Hotmart, nuestra plataforma de pagos. El reembolso se procesa por el mismo medio de pago
            utilizado en la compra, dentro de los tiempos que administra Hotmart.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Después de los 7 días</h2>
          <p>
            Pasado el período de garantía, puedes cancelar tu suscripción en cualquier momento — la
            cancelación detiene los cobros futuros pero no genera reembolso de los períodos ya
            facturados.
          </p>

          <p className="text-sm text-[var(--text-tertiary)] pt-4 border-t border-[var(--surface-2)]">
            Este documento está en revisión legal final antes del lanzamiento público.
          </p>
        </div>
      </div>
    </main>
  );
}
