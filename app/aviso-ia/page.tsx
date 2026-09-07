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
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">Última actualización: septiembre de 2026</p>

        <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Dónde usamos IA</h2>
          <p>
            Coparentia usa inteligencia artificial para tareas de apoyo: lectura automática (OCR) de
            tus comprobantes, sugerencia de categoría de gasto y detección de posibles soportes
            duplicados. Toda extracción automática queda sujeta a tu confirmación antes de
            contabilizarse.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Lo que la IA NO hace</h2>
          <p>
            La IA de Coparentia no interpreta obligaciones jurídicas ambiguas, no decide si un gasto
            es legalmente exigible, no determina que existe incumplimiento y no actúa como juez,
            conciliador ni certificador de deuda. Esas decisiones requieren siempre criterio humano
            y, cuando corresponda, asesoría legal profesional.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Tus datos y la IA</h2>
          <p>
            Los documentos que procesamos con IA se tratan bajo las mismas medidas de cifrado y
            confidencialidad descritas en nuestra Política de Privacidad. No se usan para entrenar
            modelos de terceros sin tu autorización.
          </p>

          <p className="text-sm text-[var(--text-tertiary)] pt-4 border-t border-[var(--surface-2)]">
            Este documento está en revisión legal final antes del lanzamiento público.
          </p>
        </div>
      </div>
    </main>
  );
}
