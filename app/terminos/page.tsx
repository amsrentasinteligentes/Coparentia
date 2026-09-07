import Link from 'next/link';

export const metadata = { title: 'Términos y Condiciones — Coparentia' };

export default function Terminos() {
  return (
    <main className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)] px-6 py-16">
      <div className="mx-auto max-w-[65ch]">
        <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
          ← Volver a Coparentia
        </Link>
        <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
          Términos y Condiciones
        </h1>
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">Última actualización: septiembre de 2026</p>

        <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Qué es Coparentia</h2>
          <p>
            Coparentia es una herramienta de organización y documentación de pagos y gastos
            relacionados con obligaciones alimentarias. Coparentia presenta información calculada a
            partir de los títulos y registros que tú suministras — <strong>no es un juez, conciliador
            ni certificador oficial de deuda</strong>, y no sustituye la asesoría de un abogado.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Tu cuenta</h2>
          <p>
            Eres responsable de la veracidad de la información que registras. Coparentia no verifica
            de forma independiente cada comprobante — organiza y documenta lo que tú aportas, con
            marca de tiempo e integridad técnica.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Suscripción y cobros</h2>
          <p>
            La suscripción se cobra de forma mensual o anual según el plan elegido, con 7 días de
            prueba gratuita. Puedes cancelar en cualquier momento desde tu cuenta; la cancelación
            aplica al siguiente ciclo de facturación.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Uso permitido</h2>
          <p>
            No está permitido usar Coparentia para acosar, difamar o presionar indebidamente a otra
            persona. El lenguaje de la plataforma es neutral y no acusatorio por diseño; el mal uso
            del servicio puede resultar en la suspensión de la cuenta.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Límites de responsabilidad</h2>
          <p>
            Coparentia no garantiza que un documento generado por la plataforma sea aceptado como
            título ejecutivo o prueba definitiva ante una autoridad — su validez depende de cada
            caso concreto y debe evaluarse con asesoría legal profesional.
          </p>

          <p className="text-sm text-[var(--text-tertiary)] pt-4 border-t border-[var(--surface-2)]">
            Este documento está en revisión legal final antes del lanzamiento público.
          </p>
        </div>
      </div>
    </main>
  );
}
