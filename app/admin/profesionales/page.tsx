import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { ContenedorAdmin } from '@/components/admin/ui';
import { filaAProfesional, type FilaProfesional } from '@/lib/profesionales';
import { FormularioProfesional } from './FormularioProfesional';
import { FilaProfesionalAdmin } from './FilaProfesionalAdmin';
import { BotonOrdenAlfabetico } from './BotonOrdenAlfabetico';

export const dynamic = 'force-dynamic'; // el dueño necesita ver el cambio recién guardado, nunca una copia vieja en caché

// El gate de "¿eres admin?" ya lo resuelve app/admin/layout.tsx (padre de esta ruta) — aquí solo
// se consulta la tabla, con el mismo cliente de servidor de siempre.
export default async function PanelProfesionales() {
  const supabase = await crearClienteSupabaseServidor();
  const [{ data }, { data: clics }] = await Promise.all([
    supabase
      .from('profesionales')
      .select('id, categoria, nombre, especialidad, ciudad, contacto_url, foto_url, activo, orden')
      // Mismo orden que ve el usuario final (ver components/app/DirectorioProfesionales.tsx):
      // el que el dueño fijó a mano primero, y por nombre (A-Z) el resto.
      .order('orden', { ascending: true, nullsFirst: false })
      .order('nombre', { ascending: true }),
    // Cuántas veces se tocó "Contactar" por profesional (pedido del usuario, 2026-09-28) —
    // event_log no tiene una columna propia para esto, así que se cuenta a mano desde
    // `propiedades` (ver el registro en components/app/DirectorioProfesionales.tsx).
    supabase.from('event_log').select('propiedades').eq('nombre', 'contacto_profesional_click'),
  ]);

  const conteoClics = new Map<string, number>();
  for (const fila of clics ?? []) {
    const id = (fila.propiedades as { profesional_id?: string })?.profesional_id;
    if (id) conteoClics.set(id, (conteoClics.get(id) ?? 0) + 1);
  }

  const profesionales = ((data ?? []) as FilaProfesional[]).map((fila) => ({
    ...filaAProfesional(fila),
    activo: fila.activo,
    contactos: conteoClics.get(fila.id) ?? 0,
  }));

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

      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-[13px] text-[var(--text-secondary)]">
          Usa las flechas para fijar el orden — sin tocarlas, se ordena por nombre.
        </p>
        <BotonOrdenAlfabetico />
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {profesionales.length === 0 ? (
          <p className="text-[13px] text-[var(--text-secondary)]">Todavía no has agregado ningún profesional.</p>
        ) : (
          profesionales.map((p, i) => (
            <FilaProfesionalAdmin
              key={p.id}
              profesional={p}
              activo={p.activo}
              contactos={p.contactos}
              esPrimero={i === 0}
              esUltimo={i === profesionales.length - 1}
            />
          ))
        )}
      </div>
    </ContenedorAdmin>
  );
}
