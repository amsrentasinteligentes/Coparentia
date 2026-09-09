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
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">Última actualización: 9 de septiembre de 2026 · versión 2</p>

        <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Quién opera Coparentia</h2>
          <p>
            Coparentia es operada por Alejandro Muñoz, desde Colombia. Estos términos se rigen por
            la ley colombiana, y cualquier disputa se resuelve ante las autoridades competentes de
            Colombia.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Qué es Coparentia (y qué NO es)</h2>
          <p>
            Coparentia es una herramienta de organización y documentación de pagos y gastos
            relacionados con obligaciones alimentarias. Presenta información calculada a partir de
            los títulos y registros que tú suministras — <strong>no es un juez, conciliador ni
            certificador oficial de deuda</strong>, no reporta automáticamente a nadie ante REDAM ni
            ninguna autoridad, y no sustituye la asesoría de un abogado.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Edad mínima</h2>
          <p>
            Debes ser mayor de 18 años para crear una cuenta y usar Coparentia.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Tu cuenta</h2>
          <p>
            Eres responsable de la veracidad de la información que registras. Coparentia no verifica
            de forma independiente cada comprobante — organiza y documenta lo que tú aportas, con
            marca de tiempo e integridad técnica. Podemos suspender o cerrar una cuenta que use la
            plataforma para acosar, difamar o presionar indebidamente a otra persona, o que viole
            estos términos.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Inteligencia artificial</h2>
          <p>
            Coparentia usa inteligencia artificial (un proveedor externo, ver nuestra{' '}
            <Link href="/aviso-ia" className="text-[var(--accent)] underline">Política de IA</Link>)
            para leer automáticamente el monto de tus comprobantes. Esta lectura es orientativa y
            puede equivocarse — el monto detectado siempre queda sujeto a tu revisión antes de
            guardarse, y tú eres el único responsable de confirmar que sea correcto.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Suscripción y cobros</h2>
          <p>
            El acceso a Coparentia se vende a través de Hotmart y se usa dentro de esta aplicación.
            La suscripción se cobra de forma mensual o anual según el plan elegido, con 7 días de
            prueba gratuita, y <strong>se renueva automáticamente</strong> al terminar cada periodo
            hasta que la canceles. Puedes cancelar en cualquier momento desde{' '}
            <strong>Expediente → Ajustes → Cómo cancelar</strong> dentro de la app, o directamente
            en el portal de compras de Hotmart; la cancelación detiene los cobros futuros y aplica
            desde el siguiente ciclo de facturación — no interrumpe el periodo ya pagado.
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
            caso concreto y debe evaluarse con asesoría legal profesional. En la máxima medida que
            permite la ley, no somos responsables por decisiones que tomes con base en la
            información organizada o en la lectura automática de un comprobante.
          </p>

          <p className="text-sm text-[var(--text-tertiary)] pt-4 border-t border-[var(--surface-2)]">
            ¿Preguntas? Escríbenos a{' '}
            <a href="mailto:soporte@coparentia.app" className="underline">soporte@coparentia.app</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
