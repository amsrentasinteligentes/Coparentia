// ARTÍCULOS Y CONSEJOS (2026-09-28, pedido del usuario) — banco estático en lib/articulos.ts.
// Sin fotos de stock a propósito: no hay fotos reales de personas para esto, y una foto genérica
// de banco de imágenes es justo el "look de relleno" que el SO pide evitar — en su lugar, un
// bloque de color con el ícono de la categoría (mismo criterio que ya usa el resto del kit).

import Link from 'next/link';
import { ChevronRight, BookOpen, Scale, MessageCircleHeart } from 'lucide-react';
import { ARTICULOS } from '@/lib/articulos';

const ICONO_POR_COLOR = { accent: BookOpen, pendiente: Scale, info: MessageCircleHeart, exito: BookOpen } as const;
const FONDO_POR_COLOR = {
  accent: 'var(--accent)',
  pendiente: 'var(--status-warning)',
  info: 'var(--status-info, var(--accent))',
  exito: 'var(--status-success)',
} as const;

export function ArticulosAsistencia({ basePath = '/asistencia' }: { basePath?: string }) {
  // Los 3 más recientes — cuando haya más en el banco, estos rotan solos por fecha.
  const destacados = [...ARTICULOS].sort((a, b) => b.publicadoEn.localeCompare(a.publicadoEn)).slice(0, 3);

  return (
    <div className="mt-6">
      <p className="text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">Artículos y consejos</p>
      <div className="mt-3 flex flex-col gap-3">
        {destacados.map((articulo) => {
          const Icono = ICONO_POR_COLOR[articulo.color];
          return (
            <Link
              key={articulo.slug}
              href={`${basePath}/${articulo.slug}`}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-3 transition-transform duration-100 active:scale-[0.99] [touch-action:manipulation]"
            >
              <span
                className="flex size-14 shrink-0 items-center justify-center rounded-[var(--radius-card)]"
                style={{ background: `color-mix(in oklab, ${FONDO_POR_COLOR[articulo.color]} 14%, var(--surface))` }}
              >
                <Icono size={24} style={{ color: FONDO_POR_COLOR[articulo.color] }} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-bold leading-[1.3] text-[var(--text-primary)]">{articulo.titulo}</p>
                <p className="mt-1 line-clamp-2 text-[12px] leading-[1.4] text-[var(--text-secondary)]">{articulo.resumen}</p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
