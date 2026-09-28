import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { ContenedorAdmin } from '@/components/admin/ui';
import { filaAProfesional, type FilaProfesional } from '@/lib/profesionales';
import { FormularioProfesional } from './FormularioProfesional';
import { FilaProfesionalAdmin } from './FilaProfesionalAdmin';

export const dynamic = 'force-dynamic'; // el dueño necesita ver el cambio recién guardado, nunca una copia vieja en caché

// El gate de "¿eres admin?" ya lo resuelve app/admin/layout.tsx (padre de esta ruta) — aquí solo
// se consulta la tabla, con el mismo cliente de servidor de siempre.
export default async function PanelProfesionales() {
  const supabase = await crearClienteSupabaseServidor();
  const { data } = await supabase
    .from('profesionales')
    .select('id, categoria, nombre, especialidad, ciudad, contacto_url, foto_url, activo')
    .order('created_at', { ascending: false });

  const profesionales = ((data ?? []) as FilaProfesional[]).map((fila) => ({ ...filaAProfesional(fila), activo: fila.activo }));

  return (
    <ContenedorAdmin>
      <header className="flex items-center gap-3 pb-6 pt-2">
        <Link
          href="/admin"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">Solo tú puedes ver esto</p>
          <h1 className="text-[22px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">Directorio de profesionales</h1>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            Lo que agregues, edites o pauses aquí se ve al instante en la pestaña Asistencia de la app y en tu página de ventas.
          </p>
        </div>
      </header>

      <section className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_24%,transparent)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Agregar profesional</h2>
        <div className="mt-4">
          <FormularioProfesional />
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3">
        {profesionales.length === 0 ? (
          <p className="text-[13px] text-[var(--text-secondary)]">Todavía no has agregado ningún profesional.</p>
        ) : (
          profesionales.map((p) => (
            <FilaProfesionalAdmin key={p.id} profesional={p} activo={p.activo} />
          ))
        )}
      </div>
    </ContenedorAdmin>
  );
}
