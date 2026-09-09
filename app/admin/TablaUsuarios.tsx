'use client';

// Lista de cuentas con buscador — encontrado por el revisor-visual: la regla 14 del SO pide
// filtro desde 8-10 ítems, y esta sección está pensada para crecer con cada venta futura. Busca
// por nombre o correo, en el navegador (la lista ya llegó completa del servidor, no hace falta
// otra consulta a la base de datos por cada letra).

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { SinDatos } from '@/components/admin/ui';
import { AccionesFila } from './AccionesFila';

interface PerfilAdmin {
  id: string;
  email: string;
  nombre: string | null;
  source: string | null;
  creadoManualmente: boolean;
  createdAt: string;
}

export function TablaUsuarios({ usuarios }: { usuarios: PerfilAdmin[] }) {
  const [busqueda, setBusqueda] = useState('');

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter((u) => u.email.toLowerCase().includes(q) || (u.nombre ?? '').toLowerCase().includes(q));
  }, [usuarios, busqueda]);

  if (usuarios.length === 0) {
    return <SinDatos motivo="Todavía no hay ninguna cuenta creada." activaCon="alguien se registre, o la agregues tú arriba." />;
  }

  return (
    <div>
      {usuarios.length > 5 && (
        <div className="relative mb-3">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" aria-hidden="true" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o correo…"
            className="h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] pl-9 pr-3 text-[13.5px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
          />
        </div>
      )}

      {visibles.length === 0 ? (
        <p className="py-4 text-center text-[13px] text-[var(--text-tertiary)]">Ninguna cuenta coincide con &quot;{busqueda}&quot;.</p>
      ) : (
        <>
          {/* MOBILE (< sm): cada cuenta en su propia tarjeta, NADA cortado — la tabla de 5
              columnas no cabe entera a 375px sin recortar texto pese al scroll horizontal y el
              degradé de aviso (defecto real, ronda 7: "SE U…"/"20 d…" cercenados). */}
          <div className="flex flex-col gap-3 sm:hidden">
            {visibles.map((u) => (
              <div
                key={u.id}
                className="rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] bg-[var(--surface-2)] p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">
                    {u.nombre ?? <span className="font-normal text-[var(--text-tertiary)]">Sin nombre</span>}
                  </p>
                  {u.creadoManualmente && <AccionesFila userId={u.id} />}
                </div>
                <p className="mt-1 break-all text-[12.5px] leading-[1.4] text-[var(--text-secondary)]">{u.email}</p>
                <p className="mt-1.5 text-[12px] text-[var(--text-tertiary)]">
                  {new Date(u.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' · '}
                  {u.creadoManualmente ? 'Agregado a mano' : (u.source ?? 'Directo')}
                </p>
              </div>
            ))}
          </div>

          {/* DESKTOP/TABLET (≥ sm): la tabla real, con todo el espacio para 5 columnas. */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]">
                  <th scope="col" className="pb-2 text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                    Nombre
                  </th>
                  <th scope="col" className="pb-2 text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                    Correo
                  </th>
                  <th scope="col" className="pb-2 text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                    Se unió
                  </th>
                  <th scope="col" className="pb-2 text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                    Origen
                  </th>
                  <th scope="col" className="pb-2 text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((u) => (
                  <tr key={u.id} className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)] last:border-0">
                    <td className="py-2.5 pr-3 text-[13.5px] text-[var(--text-primary)]">
                      {u.nombre ?? <span className="text-[var(--text-tertiary)]">Sin nombre</span>}
                    </td>
                    <td className="max-w-[220px] whitespace-normal break-all py-2.5 pr-3 text-[13.5px] leading-[1.4] text-[var(--text-secondary)]">
                      {u.email}
                    </td>
                    <td className="py-2.5 pr-3 text-[13px] tabular-nums text-[var(--text-tertiary)]">
                      {new Date(u.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-2.5 pr-3 text-[13px] text-[var(--text-tertiary)]">
                      {u.creadoManualmente ? 'Agregado a mano' : (u.source ?? 'Directo')}
                    </td>
                    <td className="py-2.5 text-[13px]">{u.creadoManualmente && <AccionesFila userId={u.id} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
