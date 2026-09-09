import Link from 'next/link';
import {
  BadgeCheck,
  Bot,
  DollarSign,
  Receipt,
  ShieldAlert,
  TrendingUp,
  Users,
  Activity,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import { Marcador } from '@/components/funnel/ui';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { obtenerResumenUsuarios, obtenerUsoUltimos30Dias, obtenerListaUsuarios } from '@/lib/admin-datos';
import { ContenedorAdmin, TarjetaSeccion, DatoHeroe, SinDatos, ListaSinConectar } from '@/components/admin/ui';
import { FormularioAgregarUsuario } from './FormularioAgregarUsuario';
import { CerrarSesion } from './CerrarSesion';
import { AccionesFila } from './AccionesFila';

export const dynamic = 'force-dynamic'; // números del dueño: nunca cacheados entre visitas

// Traduce el nombre técnico del event_log (snake_case, contrato de 36-ANALITICA-Y-EVENTOS.md) a
// una etiqueta humana — encontrado por el revisor-visual (ronda 2): mostrar "sesion_iniciada" tal
// cual en pantalla es jerga de sistema, no lenguaje simple para el dueño no técnico.
const ETIQUETA_EVENTO: Record<string, string> = {
  sesion_iniciada: 'Inicios de sesión',
  pago_agregado: 'Pagos agregados',
  evento_agregado: 'Eventos de calendario agregados',
  usuario_agregado_manualmente: 'Cuentas agregadas a mano',
};

export default async function PanelAdmin() {
  const supabase = await crearClienteSupabaseServidor();
  const [usuarios, uso, listaUsuarios] = await Promise.all([
    obtenerResumenUsuarios(supabase),
    obtenerUsoUltimos30Dias(supabase),
    obtenerListaUsuarios(supabase),
  ]);

  return (
    <ContenedorAdmin>
      <header className="flex items-start justify-between gap-3 pb-6 pt-2">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">Solo tú puedes ver esto</p>
          <h1 className="relative text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            {/* Halo propio del panel — más grande y opaco que el de las pantallas de venta
                (esas quedan tal cual, es "cosa juzgada"): el revisor-visual (ronda 2) encontró el
                halo compartido casi imperceptible sobre un dashboard denso de cards. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10"
              style={{
                background:
                  'radial-gradient(300px 200px at 10% 25%, color-mix(in oklab, var(--accent) 45%, transparent) 0%, transparent 72%)',
              }}
            />
            Panel de <Marcador>administración</Marcador>
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-1">
          <Link
            href="/inicio"
            className="flex h-11 items-center gap-1.5 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] px-3 text-[12.5px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Volver a la app</span>
          </Link>
          <CerrarSesion />
        </div>
      </header>

      {/* AVISOS AUTOMÁTICOS — arriba de todo, lenguaje simple. Hoy no hay ninguna fuente conectada
          (Hotmart, IA, errores) que pueda generar una alerta real, así que decir "todo en orden"
          es lo honesto — no una alerta inventada ni un silencio sospechoso. */}
      {/* Color de "éxito" propio de FICHA-ARTE.md ("éxito #5B93E8, mismo azul del acento, se
          distingue con el ícono de check") — no el verde genérico de --status-success, que es un
          token distinto compartido con el resto de la app (pills de pagos/autorizaciones) y
          cambiarlo ahí tendría efecto sobre pantallas ya aprobadas por el usuario; se deja
          anotado en ESTADO.md para revisar aparte, fuera del alcance de este panel. */}
      <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,var(--surface))] px-5 py-4">
        <BadgeCheck size={22} color="var(--accent)" aria-hidden="true" />
        <div>
          <p className="text-[14.5px] font-semibold text-[var(--text-primary)]">Todo en orden este mes</p>
          <p className="text-[12.5px] text-[var(--text-tertiary)]">
            Todavía no hay ventas ni servicios conectados que puedan generar una alerta real — en cuanto se conecten, esta franja avisa aquí mismo.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* GANANCIA REAL — lo que más le importa al dueño, card ancha */}
        <TarjetaSeccion indice={0} titulo="Ganancia real" subtitulo="Lo que queda limpio tras costos" icon={<DollarSign size={18} color="var(--accent)" aria-hidden="true" />} className="sm:col-span-2">
          <SinDatos
            motivo='Todavía no hay ventas ni costos reales que restar — sin esto no se puede decir "facturaste $X y te quedaron $Y limpios" sin inventarlo.'
            activaCon="conectes el aviso de Hotmart (ventas) — el resto de costos (IA, infraestructura, correo) se suma automáticamente en cuanto exista."
          />
        </TarjetaSeccion>

        {/* USUARIOS — el único bloque con números reales desde hoy */}
        <TarjetaSeccion indice={1} titulo="Usuarios" subtitulo="Cuentas reales en la app" icon={<Users size={18} color="var(--accent)" aria-hidden="true" />}>
          <div className="grid grid-cols-2 gap-4">
            <DatoHeroe valor={String(usuarios.total)} label="Total" />
            <DatoHeroe valor={String(usuarios.activosHoy)} label="Activos hoy" />
            <DatoHeroe valor={String(usuarios.nuevos7d)} label="Nuevos, 7 días" />
            <DatoHeroe valor={String(usuarios.nuevos30d)} label="Nuevos, 30 días" />
          </div>
        </TarjetaSeccion>

        {/* USO */}
        <TarjetaSeccion indice={2} titulo="Uso de la app" subtitulo="Últimos 30 días" icon={<Activity size={18} color="var(--accent)" aria-hidden="true" />}>
          {uso.length === 0 ? (
            <SinDatos
              motivo="Todavía no se registró ninguna acción en el nuevo registro de eventos."
              activaCon="alguien use la app — cada acción real queda anotada aquí desde hoy."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {uso.slice(0, 8).map((fila) => (
                <div key={fila.nombre} className="flex items-center justify-between border-b border-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] py-1.5 last:border-0">
                  <span className="text-[13px] text-[var(--text-secondary)]">{ETIQUETA_EVENTO[fila.nombre] ?? fila.nombre}</span>
                  <span className="text-[13px] font-semibold tabular-nums text-[var(--text-primary)]">{fila.total}</span>
                </div>
              ))}
            </div>
          )}
        </TarjetaSeccion>

        {/* VENTAS + NEGOCIO + IA + ERRORES — una sola card compacta: las 4 comparten el mismo
            estado ("todavía sin conectar"), separarlas en 4 cards completas solo alargaba el
            scroll sin sumar información (revisor-visual, ronda 2). */}
        <TarjetaSeccion
          indice={3}
          titulo="Todavía sin conectar"
          subtitulo="Se activan solas en cuanto conectes cada pieza"
          icon={<Receipt size={18} color="var(--accent)" aria-hidden="true" />}
          className="sm:col-span-2"
        >
          <ListaSinConectar
            filas={[
              {
                titulo: 'Ventas',
                icon: <Receipt size={15} color="var(--accent)" aria-hidden="true" />,
                nota: 'Ingresos, cancelaciones y cuánto entra cada mes — se activa con el aviso automático de Hotmart.',
              },
              {
                titulo: 'Negocio',
                icon: <TrendingUp size={15} color="var(--accent)" aria-hidden="true" />,
                nota: 'Cuánto deja cada cliente y cuánto cuesta conseguirlo, por canal — necesita ventas con canal de origen registrado.',
              },
              {
                titulo: 'Inteligencia artificial',
                icon: <Bot size={15} color="var(--accent)" aria-hidden="true" />,
                nota: 'Tu app no usa inteligencia artificial en ninguna pantalla todavía.',
              },
              {
                titulo: 'Errores',
                icon: <ShieldAlert size={15} color="var(--accent)" aria-hidden="true" />,
                nota: 'Se activa cuando conectes un servicio de monitoreo de errores (te guío cuando lo pidas).',
              },
            ]}
          />
        </TarjetaSeccion>
      </div>

      {/* ALTA MANUAL DE USUARIO */}
      <section className="mt-8">
        <TarjetaSeccion indice={4} titulo="Agregar una persona a mano" subtitulo="Por si no le llegó el acceso, o quieres darlo tú mismo" icon={<UserPlus size={18} color="var(--accent)" aria-hidden="true" />}>
          <FormularioAgregarUsuario />
        </TarjetaSeccion>
      </section>

      {/* TABLA DE USUARIOS — la idea extra que aprobaste */}
      <section className="mt-4">
        <TarjetaSeccion indice={5} titulo="Todas las cuentas" subtitulo={`${listaUsuarios.length} en total`} icon={<Users size={18} color="var(--accent)" aria-hidden="true" />}>
          {listaUsuarios.length === 0 ? (
            <SinDatos motivo="Todavía no hay ninguna cuenta creada." activaCon="alguien se registre, o la agregues tú arriba." />
          ) : (
            <>
              {/* MOBILE (< sm): cada cuenta en su propia tarjeta, NADA cortado — la tabla de 5
                  columnas no cabe entera a 375px sin recortar texto pese al scroll horizontal y
                  el degradé de aviso (defecto real, ronda 7: "SE U…"/"20 d…" cercenados). */}
              <div className="flex flex-col gap-3 sm:hidden">
                {listaUsuarios.map((u) => (
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
                  {listaUsuarios.map((u) => (
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
        </TarjetaSeccion>
      </section>
    </ContenedorAdmin>
  );
}
