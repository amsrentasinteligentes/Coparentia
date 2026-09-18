'use client';

// KIT DE LA APP INTERNA (Sesión 5) — misma identidad de FICHA-ARTE.md que landing/funnel.
// Nav inferior de 5 destinos (Inicio · Pagos · Calendario · Expediente · Asistencia), tarjetas y
// píldoras de estado reutilizadas en las secciones. Consume components/landing/tokens.css.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { Home, Wallet, CalendarDays, FolderOpen, Scale, CloudOff, Check, Bell, ChevronDown, UserRound, type LucideIcon } from 'lucide-react';
import { obtenerPerfil, urlFoto, nombreCorto } from '@/lib/perfil';
import { crearClienteSupabase } from '@/lib/supabase/client';
import React, { useEffect, useState, type ReactNode } from 'react';

/* Motion signature de FICHA-ARTE.md, en un solo lugar: ease-out suave, 340ms base, sin springs
   agresivos (coherente con "Sereno"). Antes cada componente inventaba su curva y su duración. */
const EASE_SERENO = [0.22, 0.61, 0.36, 1] as const;
const DUR_BASE = 0.34;

const DESTINOS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/inicio', label: 'Inicio', icon: Home },
  { href: '/pagos', label: 'Pagos', icon: Wallet },
  { href: '/calendario', label: 'Calendario', icon: CalendarDays },
  { href: '/expediente', label: 'Expediente', icon: FolderOpen },
  { href: '/asistencia', label: 'Asistencia', icon: Scale },
  // 6ª pestaña por decisión explícita del usuario (2026-09-18): "una pestaña independiente al lado
  // de Asistencia". Se le advirtió que 6 supera el tope de 5 del SO; a 375px cada destino queda en
  // ~62px, con etiquetas de 10px que aún caben ("Calendario", "Expediente", "Asistencia").
  { href: '/perfil', label: 'Perfil', icon: UserRound },
];

/* ── <NumeroContado> — un número héroe cuenta desde 0 hasta su valor al aparecer (baseline 2 de
   las 7 animaciones del SO). La app interna no tenía ninguno: los datos del expediente aparecían
   de golpe, que es justo el momento en que deberían sentirse "logrados". `formato` permite pasar
   el formateador de moneda para que el conteo se vea con separadores de mil desde el primer frame.
   Respeta prefers-reduced-motion: con esa preferencia activa muestra el valor final sin animar. ── */
export function NumeroContado({ valor, formato }: { valor: number; formato?: (n: number) => string }) {
  const reduce = useReducedMotion();
  const [mostrado, setMostrado] = useState(reduce ? valor : 0);

  useEffect(() => {
    if (reduce) {
      setMostrado(valor);
      return;
    }
    const DURACION = 700;
    const inicio = performance.now();
    let frame = 0;
    const paso = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / DURACION);
      const suavizado = 1 - Math.pow(1 - t, 3); // ease-out cúbico, coherente con "Sereno"
      setMostrado(valor * suavizado);
      if (t < 1) frame = requestAnimationFrame(paso);
    };
    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [valor, reduce]);

  return <>{formato ? formato(Math.round(mostrado)) : Math.round(mostrado)}</>;
}

/* ── <Halo> — DISPOSITIVO OWNABLE de FICHA-ARTE.md (mitad 1 de 2): mancha radial azul detrás del
   elemento héroe. Estaba implementado en el funnel pero NO en la app interna, y en el paywall el
   revisor lo declaró "casi imperceptible" al 16% sobre 220×140px → aquí va al 26% sobre 320×200px.
   USO: el contenedor padre necesita `relative isolate` para que el -z-10 quede detrás del
   contenido pero delante del fondo de la pantalla. ── */
export function Halo({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute -left-8 -right-8 -top-16 -bottom-24 -z-10 ${className}`}
      style={{
        // Sin radios en px y dimensionado por su propia caja: así el degradado SIEMPRE termina de
        // desvanecerse dentro y nunca deja el borde recto que el revisor detectó en el paywall.
        background: 'radial-gradient(ellipse at 22% 34%, color-mix(in oklab, var(--accent) 26%, transparent) 0%, transparent 62%)',
      }}
    />
  );
}

/* ── <Marcador> — DISPOSITIVO OWNABLE (mitad 2 de 2): subrayado tipo resaltador sobre la palabra
   clave del titular. El corte al 62% y el 34% de acento son los valores que quedaron tras las
   rondas previas de revisión (28%→38%→30% fueron rechazados por pálidos o por pesados). ── */
export function Marcador({ children }: { children: ReactNode }) {
  return (
    <span
      className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{
        // MISMO bug que ya se corrigió en el kit del funnel, que aquí había quedado sin arreglar:
        // con un gradiente por PORCENTAJE del alto de la caja (62%), el trazo crecía junto con la
        // caja de línea — y con Spectral el bloque de tinta es más alto que el interlineado, así
        // que en el titular de 26px se veía como un rectángulo grueso tapando media palabra en vez
        // de un subrayado. En unidades `em` el grosor no depende de cuánto se infle la caja.
        backgroundImage:
          'linear-gradient(color-mix(in oklab, var(--accent) 30%, transparent), color-mix(in oklab, var(--accent) 30%, transparent))',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 calc(100% - 0.14em)',
        backgroundSize: '100% 0.22em',
        padding: '0 0.05em',
      }}
    >
      {children}
    </span>
  );
}

/* Envuelve `palabra` dentro de `titulo` con el <Marcador>. Si no se pasa palabra (o no aparece
   en el título), devuelve el texto tal cual — así ninguna pantalla existente cambia sola. */
function conMarcador(titulo: string, palabra?: string): ReactNode {
  if (!palabra) return titulo;
  const i = titulo.indexOf(palabra);
  if (i === -1) return titulo;
  return (
    <>
      {titulo.slice(0, i)}
      <Marcador>{palabra}</Marcador>
      {titulo.slice(i + palabra.length)}
    </>
  );
}

/* ── <BottomNav> — hermano de altura fija en el shell (`app/(app)/layout.tsx`), NO `position:
   fixed`: tres intentos de compensar el menú "flotante" con CSS/JS (safe-area, viewport-fit,
   scroll-nudge, medir con `visualViewport`) no bastaron para un bug real de Android en Inicio
   (2026-09-17) — el menú dejó de flotar sobre la pantalla, así que ese tipo de bug ya no puede
   pasar: nunca depende de que el navegador reparta bien el espacio con su propia barra. ── */
export function BottomNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  return (
    <nav
      aria-label="Navegación principal"
      className="shrink-0 border-t border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] [padding-bottom:max(8px,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-[520px] items-stretch justify-around">
        {DESTINOS.map(({ href, label, icon: Icon }) => {
          const activo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex min-w-0 flex-1 flex-col items-center gap-1 pb-1 pt-2.5 text-[10px] font-semibold transition-transform duration-100 active:scale-95 [touch-action:manipulation] sm:text-[11px]"
              aria-current={activo ? 'page' : undefined}
            >
              {/* Referencia del usuario (2026-09-18): el destino activo va en azul con el ícono
                  RELLENO y un punto debajo de la etiqueta; el punto se desliza entre destinos
                  (layoutId) — la baseline "transición entre tabs" del SO. */}
              <span className="relative flex size-7 items-center justify-center">
                <Icon
                  size={22}
                  strokeWidth={activo ? 2 : 1.9}
                  color={activo ? 'var(--accent)' : 'var(--text-tertiary)'}
                  fill={activo ? 'color-mix(in oklab, var(--accent) 22%, transparent)' : 'none'}
                  className="relative"
                  aria-hidden="true"
                />
              </span>
              <span className={activo ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}>{label}</span>
              <span className="relative flex h-2 w-2 items-center justify-center">
                {activo && (
                  <motion.span
                    layoutId="nav-punto-activo"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 26 }}
                    className="absolute size-1.5 rounded-full bg-[var(--accent)]"
                  />
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ── <PageHeader> — título de sección, mismo patrón en las 4 secciones (consistencia h4).
   `palabraClave` aplica el <Marcador> de marca sobre esa palabra del título; `halo` enciende la
   mancha radial detrás. Ambos OPCIONALES: sin ellos el header se comporta igual que antes. ── */
export function PageHeader({
  titulo,
  subtitulo,
  accion,
  palabraClave,
  halo = false,
}: {
  titulo: string;
  // ReactNode y no `string`: el subtítulo a veces es un enlace al lugar donde se edita ese dato
  // (ej. la cuota en Inicio lleva a Ajustes), no solo texto suelto.
  subtitulo?: ReactNode;
  accion?: ReactNode;
  palabraClave?: string;
  halo?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-3 pb-6 pt-2 ${halo ? 'relative isolate' : ''}`}>
      {halo && <Halo />}
      <div>
        <h1 className="text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {conMarcador(titulo, palabraClave)}
        </h1>
        {subtitulo && <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{subtitulo}</p>}
      </div>
      {accion}
    </div>
  );
}

/* ── <Tarjeta> — superficie elevada base, usada por listas e info-cards en toda la app.
   Ahora entra con la baseline de movimiento del SO (opacidad + 8px de subida, 340ms, ease sereno)
   y admite `indice` para el escalonado de 50ms en listas. Sin `indice` el retraso es 0, así que
   ninguna pantalla existente cambia su comportamiento. Respeta prefers-reduced-motion. ── */
export function Tarjeta({
  children,
  className = '',
  indice = 0,
  destacada = false,
  role,
  style,
}: {
  children: ReactNode;
  className?: string;
  indice?: number;
  style?: React.CSSProperties;
  /** Aplica la hairline degradada de FICHA-ARTE. Reservada a 1-3 elementos por pantalla: si todas
   *  las tarjetas la llevan deja de destacar nada y se vuelve ruido. */
  destacada?: boolean;
  /** Para superficies que deben anunciarse a un lector de pantalla (ej. un error). */
  role?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      role={role}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR_BASE, ease: EASE_SERENO, delay: reduce ? 0 : indice * 0.05 }}
      className={`relative rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)] ${className}`}
    >
      {/* HAIRLINE DEGRADADA — FICHA-ARTE.md la declara parte del kit de profundidad ("hairline
          degradada + sombra tintada suave") y no existía en ninguna pantalla; el revisor lo marcó
          como desvío del contrato. Va arriba, del ancho de la tarjeta, desvaneciéndose a los lados:
          es el filo de luz que separa una superficie elevada del fondo. */}
      {destacada && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, color-mix(in oklab, var(--accent) 55%, transparent), transparent)',
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

/* ── <TarjetaSkeleton> — esqueleto con la FORMA de la tarjeta real mientras cargan los datos.
   La app interna no tenía ninguno (solo dos puntitos pulsando): al abrir Pagos o Calendario se
   veía el vacío y de golpe aparecía todo. Regla del SO: spinner genérico prohibido, skeleton con
   la silueta del contenido — baja la espera percibida y deja el layout quieto (CLS 0). ── */
export function TarjetaSkeleton({ filas = 3 }: { filas?: number }) {
  const reduce = useReducedMotion();
  const pulso = reduce ? '' : 'animate-pulse [animation-duration:1.6s]';
  return (
    <div aria-busy="true" aria-live="polite" aria-label="Cargando tu expediente" className="flex flex-col gap-3">
      {Array.from({ length: filas }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 ${pulso}`}
        >
          <div className="size-10 shrink-0 rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-1/3 rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]" />
            <div className="mt-2 h-4 w-2/3 rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

type TonoPildora = 'exito' | 'pendiente' | 'alerta' | 'neutro';
const TONOS: Record<TonoPildora, { bg: string; texto: string }> = {
  exito: { bg: 'var(--status-success-bg, color-mix(in oklab, var(--status-success) 18%, transparent))', texto: 'var(--status-success)' },
  pendiente: { bg: 'var(--status-warning-bg, color-mix(in oklab, var(--status-warning) 18%, transparent))', texto: 'var(--status-warning)' },
  alerta: { bg: 'var(--status-error-bg, color-mix(in oklab, var(--status-error) 18%, transparent))', texto: 'var(--status-error)' },
  neutro: { bg: 'color-mix(in oklab, var(--text-tertiary) 16%, transparent)', texto: 'var(--text-secondary)' },
};

/* ── <Pildora> — color SEMÁNTICO (verde/ámbar/rojo), separado del acento de marca —
   regla 15 del SO: estado visual de un vistazo para contenido con fecha/estado ── */
export function Pildora({ texto, tono }: { texto: string; tono: TonoPildora }) {
  const t = TONOS[tono];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ backgroundColor: t.bg, color: t.texto }}
    >
      {/* FICHA-ARTE fija "éxito" en el MISMO azul de marca y resuelve la ambigüedad con el ícono,
          no con el color: sin este check, una píldora de éxito y una informativa serían idénticas
          y el estado dejaría de leerse de un vistazo (que es toda la función de este componente). */}
      {tono === 'exito' && <Check size={11} strokeWidth={3} aria-hidden="true" />}
      {texto}
    </span>
  );
}

/* ── <IconoCirculo> — chip de ícono premium (fondo acento 10-14%), nunca emoji ── */
type TonoChip = 'accent' | 'exito' | 'info' | 'pendiente';
const TONOS_CHIP: Record<TonoChip, { bg: string; color: string }> = {
  accent: { bg: 'var(--chip-bg)', color: 'var(--accent)' },
  exito: { bg: 'var(--status-success-bg, color-mix(in oklab, var(--status-success) 16%, transparent))', color: 'var(--status-success)' },
  info: { bg: 'var(--status-info-bg, color-mix(in oklab, var(--accent) 12%, transparent))', color: 'var(--status-info, var(--accent))' },
  pendiente: { bg: 'var(--status-warning-bg, color-mix(in oklab, var(--status-warning) 16%, transparent))', color: 'var(--status-warning)' },
};
export function IconoCirculo({ icon: Icon, size = 20, tono = 'accent', grande = false }: { icon: LucideIcon; size?: number; tono?: TonoChip; grande?: boolean }) {
  const t = TONOS_CHIP[tono];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[var(--radius-chip,999px)] ${grande ? 'size-12' : 'size-10'}`}
      style={{ background: t.bg, color: t.color }}
    >
      <Icon size={size} color="currentColor" aria-hidden="true" />
    </span>
  );
}

/* ── <BotonFlotante> — acción primaria de la sección, siempre visible (proximidad, regla 12).
   `position: sticky` dentro del área que hace scroll (ya NO `fixed` sobre toda la pantalla): se
   queda pegado a 16px del fondo de lo visible mientras se hace scroll, sin necesitar saber nada
   del menú de abajo ni del espacio que reserve el navegador — mismo espíritu del arreglo de
   `<BottomNav>` (2026-09-17). El envoltorio no bloquea clics fuera del botón (`pointer-events-none`
   + `pointer-events-auto` solo en el botón), porque ocupa todo el ancho para poder alinearlo a la
   derecha con `justify-end`. ── */
export function BotonFlotante({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <div className="pointer-events-none sticky bottom-4 z-10 flex justify-end">
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.96 }}
        className="pointer-events-auto flex h-14 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-[15px] font-semibold text-[var(--on-accent,var(--bg))] shadow-[0_8px_24px_color-mix(in_oklab,var(--accent)_35%,transparent)] [touch-action:manipulation]"
      >
        {children}
      </motion.button>
    </div>
  );
}

/* ── <ErrorDeCarga> — qué se muestra cuando los datos NO se pudieron traer.
   La app no tenía ninguno: ante un fallo de red o una sesión vencida, o el esqueleto pulsaba para
   siempre, o el expediente se pintaba vacío ($0 · 0 comprobantes) — indistinguible de "no tienes
   nada guardado". En una app cuya promesa es "tus pruebas están a salvo", ese vacío es una mentira
   alarmante. Dice qué pasó, qué hacer, y deja reintentar sin recargar (regla del SO: errores con
   qué-pasó + qué-hacer, nunca un código). ── */
export function ErrorDeCarga({ onReintentar }: { onReintentar: () => void }) {
  return (
    // `role="alert"`: con lector de pantalla, un fallo de carga tiene que ANUNCIARSE. Sin esto,
    // alguien ciego se quedaba esperando un contenido que nunca iba a llegar, sin enterarse.
    <Tarjeta role="alert" className="flex flex-col items-center py-8 text-center">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--status-warning)_16%,transparent)]">
        <CloudOff size={20} color="var(--status-warning)" aria-hidden="true" />
      </span>
      <p className="mt-3 text-[14px] font-medium text-[var(--text-primary)]">No pudimos cargar tu expediente</p>
      <p className="mt-1 max-w-[32ch] text-[13px] text-[var(--text-secondary)]">
        Tus datos están guardados y a salvo — es la conexión la que falló. Revísala e inténtalo otra vez.
      </p>
      <motion.button
        type="button"
        onClick={onReintentar}
        whileTap={{ scale: 0.97 }}
        className="mt-4 flex h-11 items-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] px-5 text-[13.5px] font-semibold text-[var(--accent)] [touch-action:manipulation]"
      >
        Reintentar
      </motion.button>
    </Tarjeta>
  );
}

/* ── <ContenedorApp> — shell de cada pantalla: padding lateral + colchón inferior de respiro.
   Ya NO reserva espacio para el nav ni para <BotonFlotante> (2026-09-17): el nav es un hermano de
   altura fija fuera del área que hace scroll (`app/(app)/layout.tsx`) y el FAB usa `position:
   sticky` en vez de `fixed` — ninguno de los dos se monta ya sobre el contenido, así que no hace
   falta calcular cuánto colchón dejarles. */
export function ContenedorApp({ children, conFab = false, sinTope = false }: { children: ReactNode; conFab?: boolean; sinTope?: boolean }) {
  return (
    <div className={`relative isolate mx-auto max-w-[520px] px-4 ${conFab ? 'pb-24' : 'pb-6'} ${sinTope ? 'pt-3' : 'pt-[max(20px,env(safe-area-inset-top))]'}`}>
      {/* LUZ AMBIENTAL — el fondo de la app interna era un color liso en las cuatro secciones, y
          "profundidad" fue el eje que el revisor bajó una y otra vez. Esto no es decoración: es el
          3er nivel de profundidad que FICHA-ARTE declara (base / elevado / hundido) y que aquí
          nunca existió. Al 9% es un velo que se percibe sin que nadie sepa señalarlo — si se nota
          como una mancha, está mal puesto. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px]"
        style={{
          background:
            'radial-gradient(ellipse 130% 100% at 50% 0%, color-mix(in oklab, var(--accent) 5%, transparent) 0%, transparent 72%)',
        }}
      />
      {children}
    </div>
  );
}

/* ── <CabeceraApp> — la cabecera de la referencia del usuario (2026-09-18): logo + nombre con
   lema, campana con punto y avatar con iniciales. Vive fuera del padding del contenedor para que
   su fondo blanco toque los bordes, como en la captura. Las iniciales salen del correo de la
   sesión (no hay nombre en el perfil); si no hay sesión aún, muestra un círculo neutro. ── */
export function CabeceraApp({ aviso = false }: { aviso?: boolean }) {
  const [iniciales, setIniciales] = useState<string>('');
  const [foto, setFoto] = useState<string | null>(null);
  useEffect(() => {
    let vigente = true;
    obtenerPerfil()
      .then(async (p) => {
        if (!vigente) return;
        const base = p.nombre ? p.nombre.trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join('') : p.email.slice(0, 2);
        setIniciales(base.toUpperCase());
        const u = await urlFoto(p.avatarPath);
        if (vigente) setFoto(u);
      })
      // Si el perfil aún no se puede leer (p. ej. la base de datos sin la migración de Perfil), las
      // iniciales salen del correo de la sesión: la cabecera nunca queda con un punto vacío.
      .catch(async () => {
        try {
          const { data } = await crearClienteSupabase().auth.getUser();
          if (vigente && data.user?.email) setIniciales(data.user.email.slice(0, 2).toUpperCase());
        } catch {}
      });
    return () => {
      vigente = false;
    };
  }, []);
  return (
    <header className="flex items-center justify-between bg-[var(--surface)] px-4 pb-2 pt-[max(10px,env(safe-area-inset-top))]">
      <Link href="/inicio" className="flex items-center gap-2 [touch-action:manipulation]">
        <img src="/logo-isotipo.png" alt="" aria-hidden="true" className="size-8 object-contain" />
        <span>
          <span className="block text-[18px] font-extrabold leading-none tracking-[-0.01em] text-[var(--text-primary)] [font-family:var(--font-display)]">Coparentia</span>
          <span className="mt-0.5 block text-[10px] text-[var(--text-secondary)]">Tu expediente, en confianza.</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/calendario" aria-label="Próximos eventos" className="relative flex size-10 items-center justify-center rounded-full text-[var(--text-primary)] [touch-action:manipulation]">
          <Bell size={20} aria-hidden="true" />
          {aviso && <span aria-hidden="true" className="absolute right-2 top-2 size-2 rounded-full bg-[var(--accent)] ring-2 ring-[var(--surface)]" />}
        </Link>
        <Link href="/perfil" aria-label="Tu perfil" className="flex items-center gap-1 rounded-full bg-[var(--surface-2)] py-1 pl-1 pr-2 [touch-action:manipulation]">
          {foto ? (
            <img src={foto} alt="" className="size-7 rounded-full object-cover" />
          ) : (
            <span className="flex size-7 items-center justify-center rounded-full bg-[var(--accent)] text-[11px] font-bold text-[var(--on-accent)]">{iniciales || '·'}</span>
          )}
          <ChevronDown size={14} className="text-[var(--accent-ink,var(--accent))]" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}

/* ── <SaludoApp> — saludo grande en azul con la foto del usuario (su referencia) en forma orgánica.
   El saludo cambia por hora del día (no hay nombre en el perfil; "Hola, {correo}" sonaba a spam). ── */
export function SaludoApp({ linea }: { linea: string }) {
  const h = Number(new Intl.DateTimeFormat('es-CO', { hour: 'numeric', hour12: false, timeZone: 'America/Bogota' }).format(new Date()));
  const [nombre, setNombre] = useState('');
  useEffect(() => {
    let vigente = true;
    obtenerPerfil().then((p) => { if (vigente) setNombre(nombreCorto(p.nombre)); }).catch(() => {});
    return () => { vigente = false; };
  }, []);
  // Con nombre (puesto en Perfil) el saludo es personal, como en la referencia; sin él, por hora.
  const saludo = nombre ? `Hola, ${nombre}` : h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
  return (
    <section className="relative overflow-hidden rounded-b-[24px] bg-[var(--surface)] px-4 pb-4 pt-1">
      <div className="pointer-events-none absolute right-0 top-0 h-[112px] w-[164px] overflow-hidden blob" aria-hidden="true">
        <img src="/fotos/app-familia-abrazo.jpg" alt="" className="h-full w-full object-cover object-[55%_40%]" />
        <span className="absolute inset-0" style={{ background: 'linear-gradient(90deg, var(--surface) 0%, transparent 40%)' }} />
      </div>
      <h1 className="relative text-[26px] font-extrabold leading-tight tracking-[-0.01em] text-[var(--accent)] [font-family:var(--font-display)]">{saludo}</h1>
      <p className="relative mt-1 max-w-[52%] text-[13px] leading-snug text-[var(--text-secondary)]">{linea}</p>
    </section>
  );
}

/* ── <AccesosRapidos> — la fila de 4 accesos de la referencia: chip grande + etiqueta. ── */
export function AccesosRapidos({ items }: { items: { href: string; label: string; icon: LucideIcon }[] }) {
  return (
    <nav aria-label="Accesos rápidos" className="mt-3 grid grid-cols-4 gap-2 rounded-[var(--radius-card)] bg-[var(--surface)] px-2 py-3 shadow-[var(--shadow-1)]">
      {items.slice(0, 4).map(({ href, label, icon }) => (
        <Link key={href} href={href} className="flex flex-col items-center gap-1.5 py-1 text-[11px] font-bold text-[var(--text-primary)] transition-transform duration-100 active:scale-95 [touch-action:manipulation]">
          <IconoCirculo icon={icon} size={22} grande />
          {label}
        </Link>
      ))}
    </nav>
  );
}

/* ── <TituloSeccion> — título de sección de la referencia del usuario: grande en marino, subtítulo
   gris y un chip de ícono a la derecha (donde la referencia pone su garabato). ── */
export function TituloSeccion({ titulo, subtitulo, icon: Icon, accion }: { titulo: string; subtitulo?: string; icon?: LucideIcon; accion?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 pt-2">
      <div className="min-w-0">
        <h1 className="text-[24px] font-extrabold leading-tight tracking-[-0.01em] text-[var(--text-primary)] [font-family:var(--font-display)]">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{subtitulo}</p>}
      </div>
      {accion ?? (Icon && <IconoCirculo icon={Icon} size={22} grande />)}
    </div>
  );
}
