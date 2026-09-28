// ARTÍCULO PÚBLICO (2026-09-28) — misma fuente que app/(app)/asistencia/[slug]/page.tsx
// (lib/articulos.ts), pero fuera del grupo (app): cualquier visitante de la página de ventas
// puede leerlo, sin cuenta ni sesión. El pedido del usuario fue que la landing "no se quede
// solamente en nombrar" — los artículos reales tienen que poder leerse desde ahí.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { obtenerArticulo } from '@/lib/articulos';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articulo = obtenerArticulo(slug);
  return { title: articulo ? `${articulo.titulo} — Coparentia` : 'Artículo — Coparentia' };
}

export default async function ArticuloPublico({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articulo = obtenerArticulo(slug);
  if (!articulo) notFound();

  return (
    <main className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)] px-6 py-16">
      <div className="mx-auto max-w-[70ch]">
        <Link href="/#asistencia" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
          ← Volver a Coparentia
        </Link>
        <h1 className="mt-6 text-3xl font-bold leading-tight [font-family:var(--font-display)]">{articulo.titulo}</h1>

        <div className="mt-8 space-y-4 text-[var(--text-secondary)] leading-relaxed">
          {articulo.cuerpo.map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </div>

        <Link
          href="/#asistencia"
          className="mt-12 inline-flex h-12 items-center rounded-[var(--radius-button)] bg-[var(--accent)] px-6 text-[14px] font-semibold text-[var(--on-accent,var(--bg))]"
        >
          Conocer Coparentia
        </Link>
      </div>
    </main>
  );
}
