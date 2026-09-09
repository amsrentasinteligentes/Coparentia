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
  Repeat,
  Signpost,
} from 'lucide-react';
import { Marcador } from '@/components/funnel/ui';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { obtenerResumenUsuarios, obtenerUsoUltimos30Dias, obtenerListaUsuarios, obtenerResumenIA } from '@/lib/admin-datos';
import { ContenedorAdmin, TarjetaSeccion, EncabezadoGrupo, DatoHeroe, DatoPendiente, SinDatos, NotaActivacion } from '@/components/admin/ui';
import { MetricasFuturas } from '@/components/admin/MetricasFuturas';
import { FormularioAgregarUsuario } from './FormularioAgregarUsuario';
import { CerrarSesion } from './CerrarSesion';
import { TablaUsuarios } from './TablaUsuarios';

export const dynamic = 'force-dynamic'; // números del dueño: nunca cacheados entre visitas

// Traduce el nombre técnico del event_log (snake_case, contrato de 36-ANALITICA-Y-EVENTOS.md) a
// una etiqueta humana — encontrado por el revisor-visual (ronda 2): mostrar "sesion_iniciada" tal
// cual en pantalla es jerga de sistema, no lenguaje simple para el dueño no técnico.
const ETIQUETA_EVENTO: Record<string, string> = {
  sesion_iniciada: 'Inicios de sesión',
  pago_agregado: 'Pagos agregados',
  evento_agregado: 'Eventos de calendario agregados',
  autorizacion_agregada: 'Autorizaciones registradas',
  titulo_guardado: 'Cuotas configuradas',
  usuario_agregado_manualmente: 'Cuentas agregadas a mano',
};

export default async function PanelAdmin() {
  const supabase = await crearClienteSupabaseServidor();
  const [usuarios, uso, listaUsuarios, ia] = await Promise.all([
    obtenerResumenUsuarios(supabase),
    obtenerUsoUltimos30Dias(supabase),
    obtenerListaUsuarios(supabase),
    obtenerResumenIA(supabase),
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
            aria-label="Volver a la app"
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

      {/* ── PERSONAS primero: tiene datos REALES desde hoy. Dinero (abajo) todavía no tiene
          ninguno — encontrado por el revisor-visual (ronda final): dos cajas "Sin datos" seguidas
          antes de llegar al primer dato real alargaban el scroll sin necesidad; mientras Ganancia
          real siga vacía, lo real va primero. ─────────────────────────────────────────────────── */}
      <EncabezadoGrupo titulo="Personas" subtitulo="Quiénes son y qué hacen adentro" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TarjetaSeccion
          indice={0}
          titulo="Usuarios"
          subtitulo="Cuentas reales en la app"
          icon={<Users size={18} color="var(--accent)" aria-hidden="true" />}
          tooltip="Cuántas personas tienen cuenta, cuántas usaron la app hoy, y cuántas se unieron esta semana y este mes."
        >
          <div className="grid grid-cols-2 gap-4">
            <DatoHeroe valor={String(usuarios.total)} label="Total" />
            <DatoHeroe valor={String(usuarios.activosHoy)} label="Activos hoy" />
            <DatoHeroe valor={String(usuarios.nuevos7d)} label="Nuevos, 7 días" />
            <DatoHeroe valor={String(usuarios.nuevos30d)} label="Nuevos, 30 días" />
          </div>
        </TarjetaSeccion>

        <TarjetaSeccion
          indice={2}
          titulo="Uso de la app"
          subtitulo="Últimos 30 días"
          icon={<Activity size={18} color="var(--accent)" aria-hidden="true" />}
          tooltip="Qué está haciendo la gente adentro — cada pago registrado, evento agregado o inicio de sesión queda anotado aquí."
        >
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
      </div>

      {/* ── DINERO — Ganancia real, el dato que más le importa al dueño (pedido explícito, nunca
          se diluye) aunque hoy no tenga número. Ventas/Negocio (sin datos) viven en el bloque
          plegable de abajo junto con el resto de métricas futuras. ─────────────────────────────── */}
      <EncabezadoGrupo titulo="Dinero" subtitulo="Lo que queda limpio tras costos" />
      <TarjetaSeccion
        indice={1}
        titulo="Ganancia real"
        subtitulo="Lo que queda limpio tras costos"
        icon={<DollarSign size={18} color="var(--accent)" aria-hidden="true" />}
        tooltip="Lo que te queda después de restar todos los costos de operar la app (la plataforma de pago, afiliados, impuestos, IA, servidor y correo). No es cuánto vendiste — es cuánto te quedó de verdad."
      >
        <SinDatos
          motivo='Todavía no hay ventas ni costos reales que restar — sin esto no se puede decir "facturaste $X y te quedaron $Y limpios" sin inventarlo.'
          activaCon="conectes el aviso de Hotmart (ventas) — el resto de costos (IA, infraestructura, correo) se suma automáticamente en cuanto exista."
        />
      </TarjetaSeccion>

      {/* ── SISTEMA — solo aparece si ya hay costo real de IA que mostrar. ─────────────────── */}
      {ia && (
        <>
          <EncabezadoGrupo titulo="Sistema" subtitulo="Costo real de la inteligencia artificial" />
          <TarjetaSeccion
            indice={3}
            titulo="Inteligencia artificial"
            subtitulo="Costo real del lector de recibos"
            icon={<Bot size={18} color="var(--accent)" aria-hidden="true" />}
            tooltip="Cuánto te cuesta de verdad que la IA lea tus recibos automáticamente — para que nunca te sorprenda una factura."
          >
            <div className="grid grid-cols-2 gap-4">
              <DatoHeroe valor={`$${ia.gastoHoyUsd.toFixed(3)}`} label="Gasto de hoy (USD)" />
              <DatoHeroe valor={`$${ia.gastoMesUsd.toFixed(2)}`} label="Gasto del mes (USD)" />
              <DatoHeroe valor={String(ia.llamadasHoy)} label="Lecturas hoy" />
              <DatoHeroe valor={String(ia.fallasHoy)} label="Fallas hoy" tono={ia.fallasHoy > 0 ? 'warning' : undefined} />
            </div>
          </TarjetaSeccion>
        </>
      )}

      {/* ── MÉTRICAS FUTURAS — TODO lo que hoy no tiene ningún dato real, en un solo bloque
          plegable (colapsado por defecto): existen y se pueden ver, pero no compiten por
          atención con lo que sí importa ahora mismo (pedido explícito del revisor-visual tras
          el rediseño: 5-6 cards vacías del mismo peso que las reales quedaban como "aire
          muerto"). Sigue siendo lo que el usuario pidió — "pensando a futuro, para visualizar
          mejor el seguimiento" — solo que agrupado, no repartido en cards sueltas. ──────────── */}
      <div className="mt-8">
        <MetricasFuturas
          metricas={[
            {
              titulo: 'Ventas',
              icon: <Receipt size={14} color="var(--accent)" aria-hidden="true" />,
              contenido: (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <DatoPendiente label="Ingresos del mes" />
                    <DatoPendiente label="Cancelaciones" />
                    <DatoPendiente label="Ingreso mensual fijo" />
                  </div>
                  <NotaActivacion>Se activa con el aviso automático de Hotmart.</NotaActivacion>
                </>
              ),
            },
            {
              titulo: 'Negocio',
              icon: <TrendingUp size={14} color="var(--accent)" aria-hidden="true" />,
              contenido: (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <DatoPendiente label="Gana por cliente" />
                    <DatoPendiente label="Cuesta conseguir uno" />
                    <DatoPendiente label="Veces que se recupera" />
                    <DatoPendiente label="Meses para recuperar" />
                  </div>
                  <NotaActivacion>Necesita ventas con canal de origen registrado.</NotaActivacion>
                </>
              ),
            },
            {
              titulo: 'Retención',
              icon: <Repeat size={14} color="var(--accent)" aria-hidden="true" />,
              contenido: (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <DatoPendiente label="Día 1" />
                    <DatoPendiente label="Día 7" />
                    <DatoPendiente label="Día 30" />
                  </div>
                  <NotaActivacion>Se calcula cuando haya suficientes cuentas con un mes o más de antigüedad.</NotaActivacion>
                </>
              ),
            },
            {
              titulo: 'Recorrido de bienvenida',
              icon: <Signpost size={14} color="var(--accent)" aria-hidden="true" />,
              contenido: (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <DatoPendiente label="Lo empiezan" />
                    <DatoPendiente label="Lo terminan" />
                    <DatoPendiente label="% que termina" />
                  </div>
                  <NotaActivacion>Se activa cuando el recorrido de bienvenida anote sus propios pasos.</NotaActivacion>
                </>
              ),
            },
            ...(ia
              ? []
              : [
                  {
                    titulo: 'Inteligencia artificial',
                    icon: <Bot size={14} color="var(--accent)" aria-hidden="true" />,
                    contenido: (
                      <SinDatos motivo="Tu app no usa inteligencia artificial en ninguna pantalla todavía." activaCon="agregues una función con IA a la app." />
                    ),
                  },
                ]),
            {
              titulo: 'Errores',
              icon: <ShieldAlert size={14} color="var(--accent)" aria-hidden="true" />,
              contenido: (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <DatoPendiente label="Errores hoy" />
                    <DatoPendiente label="Alertas abiertas" />
                  </div>
                  <NotaActivacion>Se activa cuando conectes un servicio de monitoreo de errores (te guío cuando lo pidas).</NotaActivacion>
                </>
              ),
            },
          ]}
        />
      </div>

      {/* ── GESTIÓN — acciones sobre cuentas ────────────────────────────────────────────────── */}
      <EncabezadoGrupo titulo="Gestión" subtitulo="Altas manuales y todas las cuentas" />

      <TarjetaSeccion indice={9} titulo="Agregar una persona a mano" subtitulo="Por si no le llegó el acceso, o quieres darlo tú mismo" icon={<UserPlus size={18} color="var(--accent)" aria-hidden="true" />}>
        <FormularioAgregarUsuario />
      </TarjetaSeccion>

      <div className="mt-4">
        <TarjetaSeccion indice={10} titulo="Todas las cuentas" subtitulo={`${listaUsuarios.length} en total`} icon={<Users size={18} color="var(--accent)" aria-hidden="true" />}>
          <TablaUsuarios usuarios={listaUsuarios} />
        </TarjetaSeccion>
      </div>
    </ContenedorAdmin>
  );
}
