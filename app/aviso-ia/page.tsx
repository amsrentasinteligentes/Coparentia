import Link from 'next/link';

export const metadata = { title: 'Aviso de IA — Coparentia' };

export default function AvisoIA() {
  return (
    <main className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)] px-6 py-16">
      <div className="mx-auto max-w-[65ch]">
        <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
          ← Volver a Coparentia
        </Link>
        <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">Aviso de IA</h1>
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">Última actualización: 9 de septiembre de 2026 · versión 2</p>

        <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Dónde usamos IA</h2>
          <p>
            Coparentia usa inteligencia artificial de <strong>Anthropic</strong> (con sede en
            Estados Unidos) para UNA sola tarea: leer automáticamente el monto que aparece en la
            foto de un comprobante de pago, cuando lo subes al registrar un pago o gasto. Esa
            lectura se hace para ahorrarte tener que escribir el número a mano.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Esto es orientación, no un hecho confirmado</h2>
          <p>
            La lectura automática puede ser incorrecta o incompleta — una foto borrosa, un recibo
            manuscrito o un formato inusual pueden confundir a la IA. El monto detectado{' '}
            <strong>siempre aparece marcado como "Detectado automáticamente" y queda sujeto a tu
            revisión</strong> antes de guardarse: tú decides si lo confirmas o lo corriges. Nada se
            registra en tu expediente sin que tú lo veas primero.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Lo que la IA NO hace</h2>
          <p>
            La IA de Coparentia no interpreta obligaciones jurídicas, no decide si un gasto es
            legalmente exigible, no determina que existe incumplimiento, y no actúa como juez,
            conciliador ni certificador de deuda. Tampoco categoriza tus gastos ni detecta
            comprobantes duplicados — hoy solo lee el monto de la foto. Cualquier decisión legal
            requiere criterio humano y, cuando corresponda, asesoría de un abogado.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Tus datos y la IA</h2>
          <p>
            La foto que subes se envía a Anthropic únicamente para esta lectura — es una
            transferencia internacional de datos (ver nuestra{' '}
            <Link href="/privacidad" className="text-[var(--accent)] underline">Política de Privacidad</Link>).
            Anthropic no usa esa imagen para entrenar sus modelos.
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
