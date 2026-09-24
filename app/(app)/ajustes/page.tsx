'use client';

// AJUSTES — la pantalla "Cómo cancelar" + eliminar cuenta que exige 47-LEGAL-FISCAL-Y-
// PRIVACIDAD.md (capa legal de suscripción, punto 1: obligatoria, accesible sin buscar) y el
// derecho de eliminación real (no solo una promesa por correo). No vive en el nav inferior fijo
// (4 destinos ya establecidos) — se llega desde el ícono de engranaje en Expediente.

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { LogOut, ExternalLink, Trash2, AlertTriangle, UserRound, CreditCard, LifeBuoy, ShieldCheck, FileText, Scale, ChevronRight, CalendarCheck, Crown, Sparkles, Smartphone, Share, SquarePlus, X, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ContenedorApp, Tarjeta, IconoCirculo, TarjetaSkeleton, ErrorDeCarga, CabeceraApp, TituloSeccion } from '@/components/app/ui';
import { type Titulo, obtenerTitulo, guardarTitulo, obtenerPagos, formatoCOP } from '@/lib/datos';
import { hoyEnColombia } from '@/lib/fecha';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { eliminarMiCuenta } from './acciones';
import { obtenerPreferenciaNovedades, cambiarPreferenciaNovedades } from '@/lib/consentimiento';

/* ── <FilaNovedades> — la casilla opcional del consentimiento, editable después (la pantalla de
   autorizaciones promete "puedes cambiarla desde Ajustes"). Cada cambio inserta una fila nueva en
   consentimientos: el registro legal queda completo. ── */
function FilaNovedades() {
  const [valor, setValor] = useState<boolean | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let vigente = true;
    const supabase = crearClienteSupabase();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const v = await obtenerPreferenciaNovedades(supabase, data.user.id);
      if (vigente) setValor(v);
    }).catch(() => {});
    return () => { vigente = false; };
  }, []);
  const cambiar = async (): Promise<void> => {
    if (guardando || valor === null) return;
    const nuevo = !valor;
    setGuardando(true);
    setError(false);
    setValor(nuevo); // optimista: se revierte si falla
    try {
      const supabase = crearClienteSupabase();
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error('sin sesión');
      await cambiarPreferenciaNovedades(supabase, data.user.id, nuevo);
    } catch {
      setValor(!nuevo);
      setError(true);
    } finally {
      setGuardando(false);
    }
  };
  if (valor === null) return null;
  return (
    <>
      <div className="flex w-full items-center gap-3 border-b border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] py-3">
        <IconoCirculo icon={Sparkles} size={18} tono="info" />
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-[14px] font-bold text-[var(--text-primary)]">Novedades y promociones</span>
          <span className="block truncate text-[12px] text-[var(--text-secondary)]">{valor ? 'Te llegan por correo · puedes apagarlo cuando quieras' : 'No te enviamos correos comerciales'}</span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={valor}
          aria-label="Recibir novedades y promociones"
          disabled={guardando}
          onClick={cambiar}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 [touch-action:manipulation] ${valor ? 'bg-[var(--accent)]' : 'bg-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)]'}`}
        >
          <span className={`absolute top-1 size-5 rounded-full bg-white shadow-[var(--shadow-1)] transition-transform duration-200 ${valor ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      {error && <p role="alert" className="py-2 text-[12px] text-[var(--status-error)]">No pudimos guardar el cambio. Revisa tu conexión e inténtalo de nuevo.</p>}
    </>
  );
}

const OPCIONES_REAJUSTE = [
  'IPC (Índice de Precios al Consumidor)',
  'Acordado en el acta o sentencia',
  'Aún no lo sé',
];

/* ── <EditorCuota> — edita el título del expediente (monto, día de pago, reajuste).
   Guarda con `guardarTitulo`, la MISMA función que usa el alta, así que no hay dos caminos que
   puedan desincronizarse. El botón solo se habilita cuando de verdad hay algo distinto que
   guardar: un "Guardar" siempre activo invita a tocarlo sin haber cambiado nada. ── */
function EditorCuota() {
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState(false);
  const [intento, setIntento] = useState(0);
  const [original, setOriginal] = useState<Titulo | null>(null);
  const [monto, setMonto] = useState('');
  const [dia, setDia] = useState('');
  const [reajuste, setReajuste] = useState(OPCIONES_REAJUSTE[0]);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setFallo(false);
    obtenerTitulo()
      .then((t) => {
        if (!vigente) return;
        if (t) {
          setOriginal(t);
          setMonto(String(t.montoMensual));
          setDia(String(t.diaPago));
          // Si el valor guardado no está entre las opciones (viene de una versión anterior), se
          // conserva el que hay en vez de sobrescribirlo en silencio con el primero de la lista.
          setReajuste(OPCIONES_REAJUSTE.includes(t.indiceReajuste) ? t.indiceReajuste : OPCIONES_REAJUSTE[0]);
        }
        setCargando(false);
      })
      .catch(() => {
        if (!vigente) return;
        setFallo(true);
        setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, [intento]);

  const diaNumero = Number(dia);
  const montoNumero = Number(monto);
  const valido = montoNumero > 0 && diaNumero >= 1 && diaNumero <= 31;
  const hayCambios =
    !original ||
    montoNumero !== original.montoMensual ||
    diaNumero !== original.diaPago ||
    reajuste !== original.indiceReajuste;

  const guardar = async (): Promise<void> => {
    if (guardando || !valido || !hayCambios) return;
    setGuardando(true);
    setErrorGuardar(null);
    setGuardado(false);
    const t: Titulo = {
      montoMensual: montoNumero,
      diaPago: diaNumero,
      indiceReajuste: reajuste,
      // La fecha de inicio del título NO se toca al editar: es cuándo empezó la obligación, no
      // cuándo se corrigió el dato. Si no había título previo, se usa hoy.
      fechaInicio: original?.fechaInicio ?? hoyEnColombia(),
    };
    try {
      await guardarTitulo(t);
      setOriginal(t);
      setGuardado(true);
    } catch {
      setErrorGuardar('No pudimos guardar el cambio. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  if (fallo) {
    return (
      <div className="mt-3">
        <ErrorDeCarga onReintentar={() => setIntento((n) => n + 1)} />
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="mt-3">
        <TarjetaSkeleton filas={1} />
      </div>
    );
  }

  const claseCampo =
    'mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]';

  return (
    <Tarjeta className="mt-3">
      <label htmlFor="cuota-monto" className="text-[13px] font-medium text-[var(--text-secondary)]">
        Monto mensual (COP)
      </label>
      <input
        id="cuota-monto"
        type="number"
        inputMode="numeric"
        value={monto}
        onChange={(e) => {
          setMonto(e.target.value);
          setGuardado(false);
        }}
        className={`${claseCampo} tabular-nums`}
      />

      <label htmlFor="cuota-dia" className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">
        Día de pago de cada mes
      </label>
      <input
        id="cuota-dia"
        type="number"
        inputMode="numeric"
        min={1}
        max={31}
        value={dia}
        onChange={(e) => {
          setDia(e.target.value);
          setGuardado(false);
        }}
        className={`${claseCampo} tabular-nums`}
      />

      <label htmlFor="cuota-reajuste" className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">
        Reajuste anual
      </label>
      <select
        id="cuota-reajuste"
        value={reajuste}
        onChange={(e) => {
          setReajuste(e.target.value);
          setGuardado(false);
        }}
        className={claseCampo}
      >
        {OPCIONES_REAJUSTE.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>

      {!valido && (
        <p className="mt-3 text-[12.5px] text-[var(--status-error)]">
          Revisa los datos: el monto debe ser mayor que cero y el día, entre 1 y 31.
        </p>
      )}
      {errorGuardar && (
        <p role="alert" className="mt-3 text-[12.5px] leading-[1.5] text-[var(--status-error)]">
          {errorGuardar}
        </p>
      )}

      <motion.button
        type="button"
        onClick={guardar}
        disabled={guardando || !valido || !hayCambios}
        whileTap={{ scale: 0.98 }}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--on-accent,var(--bg))] transition-opacity disabled:opacity-40 [touch-action:manipulation]"
      >
        {guardando ? 'Guardando…' : guardado && !hayCambios ? 'Guardado' : 'Guardar cambios'}
      </motion.button>

      <p className="mt-3 text-[12.5px] leading-[1.5] text-[var(--text-tertiary)]">
        Cambiar esto no altera los comprobantes que ya registraste: solo actualiza el título de tu
        expediente de aquí en adelante.
      </p>
    </Tarjeta>
  );
}

/* ── <FilaAjuste> — fila de la lista "Ajustes y cuenta" de la referencia: chip + título +
   subtítulo + flecha. Enlace interno, externo o acción. ── */
function FilaAjuste({ icon, tono = 'accent', titulo, detalle, href, externo = false, onClick, ultima = false }: {
  icon: LucideIcon; tono?: 'accent' | 'exito' | 'info' | 'pendiente'; titulo: string; detalle: string;
  href?: string; externo?: boolean; onClick?: () => void; ultima?: boolean;
}) {
  const contenido = (
    <>
      <IconoCirculo icon={icon} size={18} tono={tono} />
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[14px] font-bold text-[var(--text-primary)]">{titulo}</span>
        <span className="block truncate text-[12px] text-[var(--text-secondary)]">{detalle}</span>
      </span>
      {externo ? <ExternalLink size={16} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" /> : <ChevronRight size={18} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />}
    </>
  );
  const clase = `flex w-full items-center gap-3 py-3 transition-transform duration-100 active:scale-[0.99] [touch-action:manipulation] ${ultima ? '' : 'border-b border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]'}`;
  if (onClick) return <button type="button" onClick={onClick} className={clase}>{contenido}</button>;
  if (externo) return <a href={href} target="_blank" rel="noopener noreferrer" className={clase}>{contenido}</a>;
  return <Link href={href ?? '#'} className={clase}>{contenido}</Link>;
}

/* ── Instalar en el teléfono (PWA, 2026-09-24) ─────────────────────────────────────────────
   Android/Chrome dispara `beforeinstallprompt`: se captura el evento y se muestra un botón que,
   al tocarlo, abre el instalador NATIVO del propio navegador (`prompt()` de ese evento) — un solo
   toque, sin salir de la app. iPhone/Safari NUNCA dispara ese evento (restricción de Apple, no
   nuestra): ahí se detecta la plataforma y se abre una hoja con el paso a paso exacto de "Compartir
   → Agregar a inicio". Si la persona ya la tiene instalada (`display-mode: standalone`), la fila
   no se muestra — instalarla dos veces no tiene sentido. */
function useEventoInstalacion(): { disponible: boolean; instalar: () => Promise<void> } {
  const [evento, setEvento] = useState<{ prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null);
  useEffect(() => {
    const capturar = (e: Event) => {
      e.preventDefault();
      setEvento(e as unknown as { prompt: () => void; userChoice: Promise<{ outcome: string }> });
    };
    window.addEventListener('beforeinstallprompt', capturar);
    return () => window.removeEventListener('beforeinstallprompt', capturar);
  }, []);
  return {
    disponible: evento !== null,
    instalar: async () => {
      if (!evento) return;
      evento.prompt();
      await evento.userChoice;
      setEvento(null); // el navegador no vuelve a ofrecer el mismo evento
    },
  };
}

function leerInstalada(): boolean {
  // `standalone` es el nombre que Safari le da a este mismo modo — dos formas de preguntar lo mismo.
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as { standalone?: boolean }).standalone === true;
}
function suscribirseAInstalada(avisar: () => void): () => void {
  const mq = window.matchMedia('(display-mode: standalone)');
  mq.addEventListener('change', avisar);
  return () => mq.removeEventListener('change', avisar);
}
function useInstalada(): boolean {
  return useSyncExternalStore(suscribirseAInstalada, leerInstalada, () => false);
}

/** El navegador no cambia de plataforma a mitad de sesión: sin suscripción real, solo el snapshot. */
function useEsIOS(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => /iphone|ipad|ipod/i.test(window.navigator.userAgent),
    () => false
  );
}

function FilaInstalar() {
  const { disponible, instalar } = useEventoInstalacion();
  const instalada = useInstalada();
  const ios = useEsIOS();
  const [mostrarPasos, setMostrarPasos] = useState(false);
  const reduceMovimiento = useReducedMotion() ?? false;

  if (instalada) return null; // ya la tiene en su pantalla de inicio — nada que ofrecer
  if (!ios && !disponible) return null; // Android/Chrome sin el evento todavía (raro, pero posible): no mostrar un botón que no hace nada

  return (
    <>
      <FilaAjuste
        icon={Smartphone}
        tono="accent"
        titulo="Instalar en tu teléfono"
        detalle="Ábrela como una app, sin pasar por el navegador"
        onClick={ios ? () => setMostrarPasos(true) : instalar}
      />

      {/* La hoja de pasos SOLO existe para iPhone: es la única plataforma sin instalación de un toque.
          Va por PORTAL a <body> (2026-09-24): `app/(app)/template.tsx` anima cada pantalla con un
          `motion.div` — un ancestro con `transform` activo convierte cualquier `position: fixed`
          descendiente en algo fijo respecto a ESE ancestro, no al viewport real (regla de CSS, no bug
          de Framer Motion). Sin el portal, la hoja se quedaba corta y el menú de abajo se veía a
          través de ella. Con el portal, la hoja cuelga directo de `<body>`, fuera de ese contenedor. */}
      {typeof document !== 'undefined' &&
        // Portar DENTRO de #app-shell (nunca a document.body a secas): así conserva los tokens de
        // color del tema del interior — ver el comentario en app/(app)/layout.tsx.
        createPortal(
          <AnimatePresence>
            {mostrarPasos && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMovimiento ? 0.12 : 0.2 }}
                className="fixed inset-0 z-30 flex items-end bg-[color-mix(in_oklab,black_55%,transparent)]"
                onClick={() => setMostrarPasos(false)}
              >
                <motion.div
                  initial={reduceMovimiento ? { opacity: 0 } : { y: '100%' }}
                  animate={reduceMovimiento ? { opacity: 1 } : { y: 0 }}
                  exit={reduceMovimiento ? { opacity: 0 } : { y: '100%' }}
                  transition={{ duration: reduceMovimiento ? 0.12 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Cómo instalar Coparentia en tu iPhone"
                  className="mx-auto max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[var(--radius-card)] bg-[var(--surface)] p-5 pb-[max(24px,env(safe-area-inset-bottom))]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky -top-5 z-10 -mx-5 -mt-5 flex items-center justify-between bg-[var(--surface)] px-5 pt-5 pb-3">
                    <h2 className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Instalar en tu iPhone</h2>
                    <button type="button" onClick={() => setMostrarPasos(false)} aria-label="Cerrar" className="flex size-9 items-center justify-center text-[var(--text-secondary)]">
                      <X size={20} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
                    Apple no deja que ninguna página lo haga con un solo toque — son 3 pasos, una sola vez.
                  </p>
                  <ol className="mt-5 flex flex-col gap-4">
                    {[
                      { icon: Share, texto: <>Toca el botón <b>Compartir</b> (el cuadrado con la flecha hacia arriba) en la barra de Safari.</> },
                      { icon: SquarePlus, texto: <>Baja hasta encontrar <b>&quot;Agregar a inicio&quot;</b> y tócalo.</> },
                      { icon: Smartphone, texto: <>Toca <b>&quot;Agregar&quot;</b> arriba a la derecha. Listo: el ícono ya está en tu pantalla.</> },
                    ].map((paso, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[13px] font-bold text-[var(--accent-ink,var(--accent))]">
                          {i + 1}
                        </span>
                        <span className="pt-1.5 text-[14px] leading-[1.5] text-[var(--text-primary)]">{paso.texto}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.getElementById('app-shell') ?? document.body
        )}
    </>
  );
}

export default function Ajustes() {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);
  // Datos del perfil (referencia Ref 3): correo, iniciales, desde cuándo, cuota y comprobantes.
  const [correo, setCorreo] = useState('');
  const [desde, setDesde] = useState('');
  const [nComprobantes, setNComprobantes] = useState<number | null>(null);
  const [cuota, setCuota] = useState<Titulo | null>(null);
  useEffect(() => {
    let vigente = true;
    crearClienteSupabase().auth.getUser().then(({ data }) => {
      if (!vigente || !data.user) return;
      setCorreo(data.user.email ?? '');
      if (data.user.created_at) {
        setDesde(new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric', timeZone: 'America/Bogota' }).format(new Date(data.user.created_at)));
      }
    }).catch(() => {});
    Promise.all([obtenerPagos(), obtenerTitulo()]).then(([p, t]) => { if (vigente) { setNComprobantes(p.length); setCuota(t); } }).catch(() => {});
    return () => { vigente = false; };
  }, []);
  const iniciales = correo ? correo.slice(0, 2).toUpperCase() : '·';
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cerrarSesion = async (): Promise<void> => {
    if (saliendo) return;
    setSaliendo(true);
    const supabase = crearClienteSupabase();
    await supabase.auth.signOut();
    router.push('/entrar');
  };

  const eliminarCuenta = async (): Promise<void> => {
    if (borrando) return;
    setBorrando(true);
    setError(null);
    const r = await eliminarMiCuenta();
    if (!r.ok) {
      setError(r.mensaje);
      setBorrando(false);
      return;
    }
    router.push('/');
  };

  return (
    <>
      <CabeceraApp />
      <ContenedorApp sinTope>
        <TituloSeccion titulo="Cuota y cuenta" subtitulo="Tu cuota alimentaria, tu suscripción y el control de tu cuenta." icon={UserRound} />

        {/* EDICIÓN DE LA CUOTA — el dato del producto va primero (misma lógica de siempre). */}
        <h2 className="mt-6 text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">Tu cuota alimentaria</h2>
        <EditorCuota />

        <h2 className="mt-6 text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">Tu suscripción</h2>
        <Tarjeta className="mt-3 py-1">
          <FilaInstalar />
          <FilaNovedades />
          <FilaAjuste icon={CreditCard} titulo="Suscripción y pagos" detalle="Se administra en Hotmart: cancelar, cambiar de plan, facturas" href="https://sac.hotmart.com/" externo ultima />
        </Tarjeta>
        {/* Cómo cancelar: texto legal obligatorio (47), ahora bajo la lista */}
        <p className="mt-3 text-[12px] leading-[1.5] text-[var(--text-secondary)]">
          Para cancelar tu suscripción (deja de cobrarte desde el siguiente ciclo, no borra tu cuenta ni tus datos) entra al portal de compras de Hotmart con el correo con el que pagaste.
        </p>

        {/* CERRAR SESIÓN — fila roja suave de la referencia */}
        <button
          type="button"
          onClick={cerrarSesion}
          disabled={saliendo}
          className="mt-4 flex w-full items-center gap-3 rounded-[var(--radius-card)] bg-[var(--status-error-bg,color-mix(in_oklab,var(--status-error)_12%,transparent))] px-4 py-3.5 text-left transition-opacity disabled:opacity-60 [touch-action:manipulation]"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-chip,999px)] bg-[var(--surface)] text-[var(--status-error)]"><LogOut size={18} aria-hidden="true" /></span>
          <span className="flex-1 text-[14px] font-bold text-[var(--status-error)]">{saliendo ? 'Saliendo…' : 'Cerrar sesión'}</span>
          <ChevronRight size={18} className="text-[var(--status-error)]" aria-hidden="true" />
        </button>

      <Tarjeta className="mt-6 border border-[color-mix(in_oklab,var(--status-error)_30%,transparent)]">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--status-error)_14%,transparent)]">
            <AlertTriangle size={20} color="var(--status-error)" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-[var(--text-primary)]">Eliminar mi cuenta</p>
            <p className="text-[12.5px] text-[var(--text-tertiary)]">
              Borra tu cuenta y TODOS tus datos (comprobantes, eventos, expediente) para siempre. No se puede deshacer.
            </p>
          </div>
        </div>

        {/* Advertencia real: borrar la cuenta y cancelar la suscripción son DOS cosas distintas
            — Coparentia y Hotmart son sistemas separados. Sin este aviso, alguien podría borrar
            su cuenta pensando que con eso ya dejó de pagar, y Hotmart le seguiría cobrando. */}
        <div className="mt-3 rounded-[var(--radius-button)] border border-dashed border-[color-mix(in_oklab,var(--status-warning)_35%,transparent)] px-3.5 py-3">
          <p className="text-[12.5px] leading-[1.5] text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">Esto NO cancela tu suscripción de Hotmart.</strong>{' '}
            Si tienes un plan activo, Hotmart te seguirá cobrando aunque borres tu cuenta aquí — cancela
            primero desde el portal de Hotmart (arriba) si no quieres que te sigan cobrando.
          </p>
        </div>

        {error && <p className="mt-3 text-[12.5px] text-[var(--status-error)]">{error}</p>}

        {!confirmandoBorrado ? (
          <button
            type="button"
            onClick={() => setConfirmandoBorrado(true)}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--status-error)_35%,transparent)] text-[13.5px] font-semibold text-[var(--status-error)] [touch-action:manipulation]"
          >
            <Trash2 size={15} aria-hidden="true" />
            Eliminar mi cuenta
          </button>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-[12.5px] font-medium text-[var(--text-primary)]">¿Seguro? Esto no se puede deshacer.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmandoBorrado(false)}
                disabled={borrando}
                className="flex h-11 flex-1 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[13.5px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
              >
                No, cancelar
              </button>
              <button
                type="button"
                onClick={eliminarCuenta}
                disabled={borrando}
                className="flex h-11 flex-1 items-center justify-center rounded-[var(--radius-button)] bg-[var(--status-error)] text-[13.5px] font-semibold text-white transition-opacity disabled:opacity-60 [touch-action:manipulation]"
              >
                {borrando ? 'Eliminando…' : 'Sí, eliminar todo'}
              </button>
            </div>
          </div>
        )}
      </Tarjeta>

      <p className="mt-6 text-[12.5px] leading-[1.5] text-[var(--text-tertiary)]">
        Más detalles en nuestra{' '}
        <Link href="/privacidad" className="text-[var(--accent)] underline">
          Política de Privacidad
        </Link>
        . ¿Dudas? Escríbenos a{' '}
        <a href="mailto:soporte@coparentia.co" className="text-[var(--accent)] underline">
          soporte@coparentia.co
        </a>
        .{' '}
        {/* Exigido por la normativa colombiana de proteccion al consumidor (2026-09-24) — enlace
            visible a la autoridad, abre en pestaña nueva. */}
        <a
          href="https://www.sic.gov.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] underline"
        >
          SIC
        </a>
      </p>
      </ContenedorApp>
    </>
  );
}
