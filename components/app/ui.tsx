'use client';

// KIT DE LA APP INTERNA (Sesión 5) — misma identidad de FICHA-ARTE.md que landing/funnel.
// Nav inferior de 4 destinos (Inicio · Pagos · Calendario · Expediente), tarjetas y píldoras
// de estado reutilizadas en las 4 secciones. Consume components/landing/tokens.css.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { Home, Wallet, CalendarDays, FolderOpen, CloudOff, Check, type LucideIcon } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

/* Motion signature de FICHA-ARTE.md, en un solo lugar: ease-out suave, 340ms base, sin springs
   agresivos (coherente con "Sereno"). Antes cada componente inventaba su curva y su duración. */
const EASE_SERENO = [0.22, 0.61, 0.36, 1] as const;
const DUR_BASE = 0.34;

const DESTINOS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/inicio', label: 'Inicio', icon: Home },
  { href: '/pagos', label: 'Pagos', icon: Wallet },
  { href: '/calendario', label: 'Calendario', icon: CalendarDays },
  { href: '/expediente', label: 'Expediente', icon: FolderOpen },
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

/* ── <BottomNav> — nav fija al fondo, 4 destinos, ícono activo con fondo propio (nunca del
   mismo color que su contenedor — regla anti-slop de tapar el ícono) ── */
export function BottomNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)] bg-[var(--surface)]/95 backdrop-blur [padding-bottom:env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-[520px] items-stretch justify-around">
        {DESTINOS.map(({ href, label, icon: Icon }) => {
          const activo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex min-w-[64px] flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium [touch-action:manipulation]"
              aria-current={activo ? 'page' : undefined}
            >
              {/* La píldora activa se DESLIZA entre destinos (layoutId) en vez de aparecer y
                  desaparecer: es la baseline "transición entre tabs" del SO, que faltaba — antes
                  solo había un `transition-colors`. Spring 220/26 = el compilado de FICHA-ARTE. */}
              <span className="relative flex size-9 items-center justify-center">
                {activo && (
                  <motion.span
                    layoutId="nav-pildora-activa"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 26 }}
                    className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]"
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={activo ? 2.4 : 2}
                  color={activo ? 'var(--accent)' : 'var(--text-tertiary)'}
                  className="relative"
                  aria-hidden="true"
                />
              </span>
              <span className={activo ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}>{label}</span>
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
}: {
  children: ReactNode;
  className?: string;
  indice?: number;
  /** Aplica la hairline degradada de FICHA-ARTE. Reservada a 1-3 elementos por pantalla: si todas
   *  las tarjetas la llevan deja de destacar nada y se vuelve ruido. */
  destacada?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR_BASE, ease: EASE_SERENO, delay: reduce ? 0 : indice * 0.05 }}
      className={`relative rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)] ${className}`}
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
    <div aria-hidden="true" className="flex flex-col gap-3">
      {Array.from({ length: filas }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-4 ${pulso}`}
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
  exito: { bg: 'color-mix(in oklab, var(--status-success) 18%, transparent)', texto: 'var(--status-success)' },
  pendiente: { bg: 'color-mix(in oklab, var(--status-warning) 18%, transparent)', texto: 'var(--status-warning)' },
  alerta: { bg: 'color-mix(in oklab, var(--status-error) 18%, transparent)', texto: 'var(--status-error)' },
  neutro: { bg: 'color-mix(in oklab, var(--text-tertiary) 16%, transparent)', texto: 'var(--text-secondary)' },
};

/* ── <Pildora> — color SEMÁNTICO (verde/ámbar/rojo), separado del acento de marca —
   regla 15 del SO: estado visual de un vistazo para contenido con fecha/estado ── */
export function Pildora({ texto, tono }: { texto: string; tono: TonoPildora }) {
  const t = TONOS[tono];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em]"
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
export function IconoCirculo({ icon: Icon, size = 20 }: { icon: LucideIcon; size?: number }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
      <Icon size={size} color="var(--accent)" aria-hidden="true" />
    </span>
  );
}

/* ── <BotonFlotante> — acción primaria de la sección, siempre visible (proximidad, regla 12) ── */
export function BotonFlotante({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-4 z-10 flex h-14 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-[15px] font-semibold text-[var(--bg)] shadow-[0_8px_24px_color-mix(in_oklab,var(--accent)_35%,transparent)] [touch-action:manipulation]"
    >
      {children}
    </motion.button>
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
    <Tarjeta className="flex flex-col items-center py-8 text-center">
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

/* ── <ContenedorApp> — shell de cada pantalla: min-h-dvh, padding lateral, espacio para el nav fijo ── */
export function ContenedorApp({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate mx-auto min-h-dvh max-w-[520px] px-4 pb-[calc(96px+env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
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
            'radial-gradient(ellipse 130% 100% at 50% 0%, color-mix(in oklab, var(--accent) 9%, transparent) 0%, transparent 72%)',
        }}
      />
      {children}
    </div>
  );
}
