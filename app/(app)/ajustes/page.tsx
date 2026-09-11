'use client';

// AJUSTES — la pantalla "Cómo cancelar" + eliminar cuenta que exige 47-LEGAL-FISCAL-Y-
// PRIVACIDAD.md (capa legal de suscripción, punto 1: obligatoria, accesible sin buscar) y el
// derecho de eliminación real (no solo una promesa por correo). No vive en el nav inferior fijo
// (4 destinos ya establecidos) — se llega desde el ícono de engranaje en Expediente.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, LogOut, ExternalLink, Trash2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { ContenedorApp, Tarjeta, IconoCirculo, TarjetaSkeleton, ErrorDeCarga } from '@/components/app/ui';
import { type Titulo, obtenerTitulo, guardarTitulo } from '@/lib/datos';
import { hoyEnColombia } from '@/lib/fecha';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { eliminarMiCuenta } from './acciones';

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
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-40 [touch-action:manipulation]"
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

export default function Ajustes() {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);
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
    <ContenedorApp>
      <div className="flex items-center gap-3 pb-6 pt-2">
        <Link href="/expediente" aria-label="Volver al expediente" className="flex size-9 items-center justify-center [touch-action:manipulation]">
          <ArrowLeft size={20} color="var(--text-primary)" aria-hidden="true" />
        </Link>
        <h1 className="text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Ajustes</h1>
      </div>

      {/* EDICIÓN DE LA CUOTA. Primeros pasos promete "puedes ajustarlo cuando quieras", pero hasta
          ahora `guardarTitulo` solo se llamaba una vez, durante el alta: la cuota quedaba
          congelada y la promesa era falsa en la interfaz. Va de PRIMERA en Ajustes porque es el
          dato del producto (la suscripción y la cuenta son administración). */}
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Tu cuota alimentaria</h2>
      <EditorCuota />

      <h2 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Tu suscripción</h2>
      <Tarjeta className="mt-3">
        <p className="text-[14px] font-medium text-[var(--text-primary)]">Cómo cancelar</p>
        <p className="mt-1.5 text-[13.5px] leading-[1.5] text-[var(--text-secondary)]">
          Tu suscripción se compra y se administra desde Hotmart. Para cancelarla (deja de cobrarte
          desde el siguiente ciclo, no borra tu cuenta ni tus datos), entra al portal de compras de
          Hotmart con el correo con el que pagaste:
        </p>
        <a
          href="https://sac.hotmart.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex h-11 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[14px] font-medium text-[var(--text-primary)] [touch-action:manipulation]"
        >
          Ir al portal de compras de Hotmart
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </Tarjeta>

      <h2 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Tu cuenta</h2>
      <Tarjeta className="mt-3 flex items-center gap-3">
        <IconoCirculo icon={LogOut} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium text-[var(--text-primary)]">Cerrar sesión</p>
          <p className="text-[12.5px] text-[var(--text-tertiary)]">Puedes volver a entrar cuando quieras con tu correo.</p>
        </div>
        <button
          type="button"
          onClick={cerrarSesion}
          disabled={saliendo}
          className="flex h-11 shrink-0 items-center rounded-[var(--radius-button)] px-3 text-[13.5px] font-medium text-[var(--accent)] transition-opacity disabled:opacity-50 [touch-action:manipulation]"
        >
          {saliendo ? 'Saliendo…' : 'Salir'}
        </button>
      </Tarjeta>

      <Tarjeta className="mt-3 border-[color-mix(in_oklab,var(--status-error)_30%,transparent)]">
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
        <a href="mailto:soporte@coparentia.app" className="text-[var(--accent)] underline">
          soporte@coparentia.app
        </a>
        .
      </p>
    </ContenedorApp>
  );
}
