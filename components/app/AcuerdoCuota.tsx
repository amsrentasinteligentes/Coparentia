'use client';

// CONSULTAR ACUERDO — la caja donde el usuario guarda el documento base que fija la cuota: el
// acta del centro de conciliación o la sentencia del juzgado. Vive en la pantalla de Expediente,
// justo donde piensa "¿y el papel que dice cuánto me toca?".
//
// Un solo componente, cuatro estados: cargando · error · sin guardar (subir) · guardado (consultar
// / reemplazar / quitar). El archivo real se guarda cifrado en la carpeta privada del usuario;
// aquí solo se maneja su referencia. Las fotos se ven en el visor propio de la app; un PDF abre
// en pestaña nueva (el navegador ya trae su visor con zoom), igual que en Pagos y Calendario.

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Gavel, Eye, RefreshCw, Trash2, FileText } from 'lucide-react';
import { Tarjeta, IconoCirculo, ErrorDeCarga } from '@/components/app/ui';
import { Portal } from '@/components/app/Portal';
import { VisorImagen } from '@/components/app/VisorImagen';
import { VistaPreviaArchivo } from '@/components/app/VistaPreviaArchivo';
import { obtenerTitulo, obtenerUrlArchivo, guardarAcuerdo, quitarAcuerdo, validarArchivoAdjunto } from '@/lib/datos';

type Estado =
  | { fase: 'cargando' }
  | { fase: 'error' }
  | { fase: 'vacio' }
  | { fase: 'guardado'; nombre: string; ruta: string };

export function AcuerdoCuota() {
  const [estado, setEstado] = useState<Estado>({ fase: 'cargando' });
  const [intento, setIntento] = useState(0);

  // Flujo de subida
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [elegido, setElegido] = useState<File | null>(null);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Ver / quitar
  const [abriendo, setAbriendo] = useState(false);
  const [urlVisor, setUrlVisor] = useState<string | null>(null);
  const [confirmandoQuitar, setConfirmandoQuitar] = useState(false);
  const [quitando, setQuitando] = useState(false);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    setEstado({ fase: 'cargando' });
    obtenerTitulo()
      .then((t) => {
        if (!vigente) return;
        if (t?.acuerdoPath && t.acuerdoNombre) {
          setEstado({ fase: 'guardado', nombre: t.acuerdoNombre, ruta: t.acuerdoPath });
        } else {
          setEstado({ fase: 'vacio' });
        }
      })
      .catch(() => {
        if (vigente) setEstado({ fase: 'error' });
      });
    return () => {
      vigente = false;
    };
  }, [intento]);

  const elegirArchivo = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const archivo = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo si se cancela
    if (!archivo) return;
    const problema = validarArchivoAdjunto(archivo);
    if (problema) {
      setErrorArchivo(problema);
      setElegido(null);
      return;
    }
    setErrorArchivo(null);
    setElegido(archivo);
  };

  const guardar = async (): Promise<void> => {
    if (!elegido || guardando) return;
    setGuardando(true);
    setErrorArchivo(null);
    try {
      const { acuerdoPath, acuerdoNombre } = await guardarAcuerdo(elegido);
      setElegido(null);
      setEstado({ fase: 'guardado', nombre: acuerdoNombre ?? elegido.name, ruta: acuerdoPath ?? '' });
    } catch (err) {
      setErrorArchivo(
        err instanceof Error && err.message.includes('Ajustes')
          ? err.message
          : 'No pudimos guardar el acuerdo. Revisa tu conexión e inténtalo de nuevo.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const consultar = async (ruta: string, nombre: string): Promise<void> => {
    if (abriendo) return;
    setAbriendo(true);
    setErrorAccion(null);
    const url = await obtenerUrlArchivo(ruta);
    setAbriendo(false);
    if (!url) {
      setErrorAccion('No pudimos abrir el acuerdo. Revisa tu conexión e inténtalo de nuevo.');
      return;
    }
    if (nombre.toLowerCase().endsWith('.pdf')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setUrlVisor(url);
    }
  };

  const quitar = async (): Promise<void> => {
    if (quitando) return;
    setQuitando(true);
    setErrorAccion(null);
    try {
      await quitarAcuerdo();
      setConfirmandoQuitar(false);
      setEstado({ fase: 'vacio' });
    } catch {
      setErrorAccion('No pudimos quitar el acuerdo. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setQuitando(false);
    }
  };

  return (
    <Tarjeta className="mt-6">
      <div className="flex items-start gap-3">
        <IconoCirculo icon={Gavel} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium text-[var(--text-primary)]">Consultar acuerdo</p>
          <p className="mt-1 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
            {estado.fase === 'guardado'
              ? 'El acta de conciliación o la sentencia que fija tu cuota, guardada y lista para consultar.'
              : 'Guarda aquí el acta de conciliación o la sentencia que fija la cuota — así la tienes a mano cuando la necesites.'}
          </p>
        </div>
      </div>

      {estado.fase === 'cargando' && (
        <div
          aria-busy="true"
          className="mt-3 h-11 w-full animate-pulse rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] [animation-duration:1.6s]"
        />
      )}

      {estado.fase === 'error' && (
        <div className="mt-3">
          <ErrorDeCarga onReintentar={() => setIntento((n) => n + 1)} />
        </div>
      )}

      {/* SIN GUARDAR — subir */}
      {estado.fase === 'vacio' && (
        <div className="mt-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={elegirArchivo}
            className="hidden"
          />

          {elegido && (
            <div className="mb-3">
              <VistaPreviaArchivo archivo={elegido} />
            </div>
          )}

          {elegido ? (
            <div className="flex gap-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={guardar}
                disabled={guardando}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[13.5px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-60 [touch-action:manipulation]"
              >
                {guardando ? 'Guardando…' : 'Guardar acuerdo'}
              </motion.button>
              <button
                type="button"
                onClick={() => {
                  setElegido(null);
                  setErrorArchivo(null);
                }}
                disabled={guardando}
                className="h-11 shrink-0 px-3 text-[13px] text-[var(--text-tertiary)] disabled:opacity-60 [touch-action:manipulation]"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => inputRef.current?.click()}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] text-[13.5px] font-semibold text-[var(--accent)] [touch-action:manipulation]"
            >
              <FileText size={16} aria-hidden="true" />
              Guardar acuerdo
            </motion.button>
          )}

          {errorArchivo && (
            <p role="alert" className="mt-2 text-[12.5px] leading-[1.5] text-[var(--status-error)]">
              {errorArchivo}
            </p>
          )}
        </div>
      )}

      {/* GUARDADO — consultar / reemplazar / quitar */}
      {estado.fase === 'guardado' && (
        <div className="mt-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={elegirArchivo}
            className="hidden"
          />

          {elegido ? (
            <>
              <div className="mb-3">
                <VistaPreviaArchivo archivo={elegido} />
              </div>
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={guardar}
                  disabled={guardando}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[13.5px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-60 [touch-action:manipulation]"
                >
                  {guardando ? 'Guardando…' : 'Reemplazar acuerdo'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setElegido(null);
                    setErrorArchivo(null);
                  }}
                  disabled={guardando}
                  className="h-11 shrink-0 px-3 text-[13px] text-[var(--text-tertiary)] disabled:opacity-60 [touch-action:manipulation]"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
                  <FileText size={20} color="var(--accent)" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-[var(--text-primary)]">{estado.nombre}</p>
                  <p className="text-[12px] text-[var(--text-tertiary)]">Guardado</p>
                </div>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => consultar(estado.ruta, estado.nombre)}
                disabled={abriendo}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] text-[13.5px] font-semibold text-[var(--accent)] transition-opacity disabled:opacity-60 [touch-action:manipulation]"
              >
                <Eye size={16} aria-hidden="true" />
                {abriendo ? 'Abriendo…' : 'Consultar acuerdo'}
              </motion.button>

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-1.5 text-[12px] text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]"
                >
                  <RefreshCw size={13} aria-hidden="true" />
                  Reemplazar
                </button>
                {confirmandoQuitar ? (
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={quitar}
                      disabled={quitando}
                      className="text-[12px] font-semibold text-[var(--status-error)] disabled:opacity-60 [touch-action:manipulation]"
                    >
                      {quitando ? 'Quitando…' : 'Sí, quitar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmandoQuitar(false)}
                      disabled={quitando}
                      className="text-[12px] text-[var(--text-tertiary)] disabled:opacity-60 [touch-action:manipulation]"
                    >
                      Cancelar
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmandoQuitar(true);
                      setErrorAccion(null);
                    }}
                    className="flex items-center gap-1.5 text-[12px] text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]"
                  >
                    <Trash2 size={13} aria-hidden="true" />
                    Quitar
                  </button>
                )}
              </div>
            </>
          )}

          {errorArchivo && (
            <p role="alert" className="mt-2 text-[12.5px] leading-[1.5] text-[var(--status-error)]">
              {errorArchivo}
            </p>
          )}
          {errorAccion && (
            <p role="alert" className="mt-2 text-[12.5px] leading-[1.5] text-[var(--status-error)]">
              {errorAccion}
            </p>
          )}
        </div>
      )}

      {urlVisor && (
        <Portal>
          <VisorImagen url={urlVisor} onCerrar={() => setUrlVisor(null)} />
        </Portal>
      )}
    </Tarjeta>
  );
}
