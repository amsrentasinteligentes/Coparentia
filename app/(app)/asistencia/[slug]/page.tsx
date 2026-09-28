// ARTÍCULO COMPLETO (2026-09-28) — contenido estático de lib/articulos.ts. `notFound()` si el
// slug no existe (nunca una pantalla en blanco silenciosa).

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { ContenedorApp, CabeceraApp } from '@/components/app/ui';
import { obtenerArticulo } from '@/lib/articulos';

export default async function ArticuloAsistencia({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articulo = obtenerArticulo(slug);
  if (!articulo) notFound();

  return (
    <>
      <CabeceraApp />
      <ContenedorApp sinTope>
        <Link
          href="/asistencia"
          className="inline-flex items-center gap-1 text-[13px] font-bold text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Asistencia
        </Link>

        <h1 className="mt-3 text-[22px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">{articulo.titulo}</h1>

        <div className="mt-5 flex flex-col gap-4">
          {articulo.cuerpo.map((parrafo, i) => (
            <p key={i} className="text-[15px] leading-[1.7] text-[var(--text-secondary)]">
              {parrafo}
            </p>
          ))}
        </div>
      </ContenedorApp>
    </>
  );
}
