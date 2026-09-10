'use client';

// PAGOS — registro de pagos y gastos extraordinarios (MVP #2 de ESTADO.md §11). Filtros por
// tipo (regla 14 del SO: listas >8-10 ítems necesitan filtro; aquí se agrega desde ya porque
// la lista crece rápido con el uso real). Subir comprobante = 1 acción primaria de la sección.

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, ShieldCheck, FileCheck2, X, ChevronRight, Sparkles } from 'lucide-react';
import { ContenedorApp, PageHeader, Tarjeta, IconoCirculo, BotonFlotante, ErrorDeCarga } from '@/components/app/ui';
import { VisorImagen } from '@/components/app/VisorImagen';
import { SelloConfianza } from '@/components/app/SelloConfianza';
import { VistaPreviaArchivo } from '@/components/app/VistaPreviaArchivo';
import {
  type Pago,
  type Titulo,
  type TipoMovimiento,
  obtenerPagos,
  agregarPago,
  eliminarPago,
  obtenerTitulo,
  obtenerUrlArchivo,
  formatoCOP,
  formatoFechaLarga,
  validarArchivoAdjunto,
} from '@/lib/datos';
import { leerMontoDeRecibo } from '@/lib/ocr-recibo';
import { comprimirParaLectura } from '@/lib/comprimir-imagen';

type Filtro = 'todos' | TipoMovimiento;

export default function Pagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [abriendo, setAbriendo] = useState<string | null>(null);
  const [urlVisor, setUrlVisor] = useState<string | null>(null);
  const [selloDe, setSelloDe] = useState<string | null>(null);
  const [falloCarga, setFalloCarga] = useState(false);
  const [intento, setIntento] = useState(0);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState<string | null>(null);
  const [borrando, setBorrando] = useState<string | null>(null);
  const [errorBorrado, setErrorBorrado] = useState<string | null>(null);

  const borrarPago = async (p: Pago): Promise<void> => {
    if (borrando) return;
    setBorrando(p.id);
    setErrorBorrado(null);
    try {
      await eliminarPago(p);
      // Se quita de la lista SOLO después de que el borrado real terminó bien: adelantarse
      // mostraría como eliminado algo que sigue en el expediente.
      setPagos((prev) => prev.filter((x) => x.id !== p.id));
      setConfirmandoBorrado(null);
    } catch {
      setErrorBorrado('No pudimos borrar el registro. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setBorrando(null);
    }
  };

  // Un fallo de red mostraba la lista VACIA, indistinguible de "no tienes comprobantes".
  useEffect(() => {
    let vigente = true;
    setFalloCarga(false);
    obtenerPagos()
      .then((r) => { if (vigente) setPagos(r); })
      .catch(() => { if (vigente) setFalloCarga(true); });
    return () => { vigente = false; };
  }, [intento]);

  // Abre el archivo REAL del comprobante (URL firmada, temporal — el bucket es privado). Las
  // fotos se ven en el visor propio de la app (encaja a pantalla + pellizco para acercar — antes
  // se abrían crudas en una pestaña nueva y no siempre ajustaban al tamaño de la pantalla,
  // hallazgo real del usuario); un PDF sigue abriendo en una pestaña nueva, el navegador ya trae
  // su propio visor con zoom.
  const verComprobante = async (p: Pago): Promise<void> => {
    if (!p.comprobantePath || abriendo) return;
    setAbriendo(p.id);
    const url = await obtenerUrlArchivo(p.comprobantePath);
    setAbriendo(null);
    if (!url) return;
    if (p.comprobanteNombre.toLowerCase().endsWith('.pdf')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setUrlVisor(url);
    }
  };

  const visibles = pagos
    .filter((p) => filtro === 'todos' || p.tipo === filtro)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const totalVisible = visibles.reduce((acc, p) => acc + p.monto, 0);

  return (
    <ContenedorApp>
      <PageHeader titulo="Pagos y gastos" subtitulo={`${pagos.length} comprobantes en tu expediente`} />

      <div className="flex gap-2">
        {([
          { valor: 'todos' as const, label: 'Todos' },
          { valor: 'cuota' as const, label: 'Cuota' },
          { valor: 'gasto_extra' as const, label: 'Gastos extra' },
        ]).map(({ valor, label }) => (
          <button
            key={valor}
            type="button"
            onClick={() => setFiltro(valor)}
            className={`rounded-full border px-3.5 py-2 text-[13px] font-medium [touch-action:manipulation] ${
              filtro === valor
                ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)]'
                : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[var(--text-secondary)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-[13px] text-[var(--text-secondary)]">
        {visibles.length} {visibles.length === 1 ? 'registro' : 'registros'} · {formatoCOP(totalVisible)}
      </p>

      <div className="mt-3 flex flex-col gap-3">
        {falloCarga && <ErrorDeCarga onReintentar={() => setIntento((n) => n + 1)} />}
        {!falloCarga && visibles.length === 0 && (
          <Tarjeta className="items-center py-10 text-center">
            <p className="text-[14px] text-[var(--text-secondary)]">Todavía no tienes registros en esta categoría.</p>
          </Tarjeta>
        )}
        {visibles.map((p, i) => {
          const contenido = (
            <>
              <IconoCirculo icon={p.tipo === 'cuota' ? ShieldCheck : FileCheck2} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-[var(--text-primary)]">{p.concepto}</p>
                <p className="truncate text-[12px] text-[var(--text-tertiary)]">{formatoFechaLarga(p.fecha)} · {p.comprobanteNombre}</p>
              </div>
              <p className="shrink-0 text-[14px] font-semibold tabular-nums text-[var(--text-primary)]">{formatoCOP(p.monto)}</p>
              {p.comprobantePath && (
                <ChevronRight size={16} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
              )}
            </>
          );

          return (
            <Tarjeta key={p.id} indice={i} className="flex flex-col gap-2">
              {p.comprobantePath ? (
                <button
                  type="button"
                  onClick={() => verComprobante(p)}
                  disabled={abriendo === p.id}
                  className="flex items-center gap-3 text-left [touch-action:manipulation]"
                >
                  {contenido}
                </button>
              ) : (
                <div className="flex items-center gap-3">{contenido}</div>
              )}

              {/* BORRAR — no existía ninguna forma de corregir un registro. Una foto equivocada
                  quedaba para siempre en el expediente que se lleva a un juzgado, y ahora además
                  se incrusta en el PDF que recibe el abogado. Confirmación en dos pasos porque es
                  irreversible (regla 8 del SO: confirmar solo lo que no se puede deshacer). */}
              {confirmandoBorrado === p.id ? (
                <div className="flex items-center gap-2 border-t border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] pt-2">
                  <p className="flex-1 text-[12.5px] text-[var(--text-secondary)]">
                    ¿Borrar este registro y su comprobante?
                  </p>
                  <button
                    type="button"
                    onClick={() => setConfirmandoBorrado(null)}
                    disabled={borrando === p.id}
                    className="h-9 rounded-[var(--radius-button)] px-3 text-[12.5px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => borrarPago(p)}
                    disabled={borrando === p.id}
                    className="h-9 rounded-[var(--radius-button)] bg-[var(--status-error)] px-3 text-[12.5px] font-semibold text-white transition-opacity disabled:opacity-60 [touch-action:manipulation]"
                  >
                    {borrando === p.id ? 'Borrando…' : 'Sí, borrar'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmandoBorrado(p.id)}
                  aria-label={`Borrar ${p.concepto}`}
                  className="self-end text-[12px] text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]"
                >
                  Borrar
                </button>
              )}
            </Tarjeta>
          );
        })}
      </div>

      {errorBorrado && (
        <p role="alert" className="mt-3 text-[12.5px] text-[var(--status-error)]">{errorBorrado}</p>
      )}

      <BotonFlotante onClick={() => setModalAbierto(true)}>
        <Upload size={18} aria-hidden="true" />
        Registrar
      </BotonFlotante>

      <AnimatePresence>
        {modalAbierto && (
          <ModalRegistro
            onCerrar={() => setModalAbierto(false)}
            onGuardado={(nuevo) => {
              setPagos((prev) => [nuevo, ...prev]);
              setModalAbierto(false);
              // El comprobante queda guardado ANTES de mostrar el sello: la celebración refleja
              // algo que ya pasó de verdad, nunca la promesa de algo que todavía puede fallar.
              setSelloDe(nuevo.fecha);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selloDe && <SelloConfianza fecha={formatoFechaLarga(selloDe)} onTerminar={() => setSelloDe(null)} />}
      </AnimatePresence>

      <VisorImagen url={urlVisor} onCerrar={() => setUrlVisor(null)} />
    </ContenedorApp>
  );
}

function ModalRegistro({ onCerrar, onGuardado }: { onCerrar: () => void; onGuardado: (p: Pago) => void }) {
  const [tipo, setTipo] = useState<TipoMovimiento>('cuota');
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [leyendoRecibo, setLeyendoRecibo] = useState(false);
  const [montoDetectado, setMontoDetectado] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    obtenerTitulo().then((t: Titulo | null) => {
      if (t) setMonto(String(t.montoMensual));
    });
  }, []);

  // Lector automático de recibos: al elegir la foto, se le pide a la IA que lea el monto y se
  // pre-llena el campo — el usuario SIEMPRE ve el número y puede corregirlo antes de guardar
  // (nunca se confía a ciegas en la lectura). Solo funciona con fotos, no con PDF.
  const elegirArchivo = async (f: File): Promise<void> => {
    const error = validarArchivoAdjunto(f);
    if (error) {
      setErrorArchivo(error);
      return;
    }
    setErrorArchivo(null);
    setArchivo(f);
    setMontoDetectado(false);
    if (!f.type.startsWith('image/')) return;
    setLeyendoRecibo(true);
    // Se manda una copia comprimida SOLO para la lectura — el archivo real que se guarda en el
    // expediente (arriba, `setArchivo(f)`) sigue siendo la foto original sin tocar.
    // Tope de 20s en el cliente: si la red va lenta y nada responde, se libera el campo para
    // escribir a mano en vez de dejar a la persona mirando "Leyendo el recibo…" para siempre.
    const resultado = await Promise.race([
      comprimirParaLectura(f).then(leerMontoDeRecibo),
      new Promise<{ monto: null; confianza: null }>((resolve) => setTimeout(() => resolve({ monto: null, confianza: null }), 20_000)),
    ]);
    setLeyendoRecibo(false);
    if (resultado.monto && resultado.confianza !== 'baja') {
      setMonto(String(Math.round(resultado.monto)));
      setMontoDetectado(true);
    }
  };

  const guardar = (): void => {
    if (!archivo || !monto || !concepto.trim()) return;
    setProcesando(true);
    agregarPago(
      {
        fecha: new Date().toISOString().slice(0, 10),
        monto: Number(monto),
        concepto: concepto.trim(),
        tipo,
        comprobanteNombre: archivo.name,
      },
      archivo
    ).then((nuevo) => {
      setProcesando(false);
      onGuardado(nuevo);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex items-end bg-[color-mix(in_oklab,black_55%,transparent)]"
      onClick={onCerrar}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-[520px] rounded-t-[var(--radius-card)] bg-[var(--surface)] p-5 pb-[max(24px,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Nuevo registro</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="flex size-9 items-center justify-center text-[var(--text-secondary)]">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {([{ v: 'cuota' as const, l: 'Cuota' }, { v: 'gasto_extra' as const, l: 'Gasto extra' }]).map(({ v, l }) => (
            <button
              key={v}
              type="button"
              onClick={() => setTipo(v)}
              className={`flex-1 rounded-[var(--radius-button)] border py-2.5 text-[14px] font-medium [touch-action:manipulation] ${
                tipo === v ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[var(--text-secondary)]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">Concepto</label>
        <input
          type="text"
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          placeholder="Ej. Cuota de octubre"
          className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />

        <div className="mt-4 flex items-center justify-between">
          <label className="text-[13px] font-medium text-[var(--text-secondary)]">Monto (COP)</label>
          {leyendoRecibo && (
            <span className="flex items-center gap-1 text-[12px] text-[var(--accent)]">
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
              Leyendo el recibo…
            </span>
          )}
          {montoDetectado && !leyendoRecibo && (
            <span className="flex items-center gap-1 text-[12px] font-medium text-[var(--accent)]">
              <Sparkles size={12} aria-hidden="true" />
              Detectado automáticamente
            </span>
          )}
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={monto}
          onChange={(e) => {
            setMonto(e.target.value);
            setMontoDetectado(false); // el usuario corrigió a mano: ya no es "detectado", es suyo
          }}
          className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] tabular-nums text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />

        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) elegirArchivo(f);
          }}
        />
        {/* Con archivo elegido se muestra la FOTO, no solo su nombre: el error típico no es haber
            elegido "un archivo que no era", es haber elegido LA FOTO que no era — y eso solo se
            detecta viéndola antes de que entre al expediente. */}
        {archivo ? (
          <div className="mt-4">
            <VistaPreviaArchivo archivo={archivo} />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-2 text-[12.5px] text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]"
            >
              Elegir otro archivo
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] text-[14px] text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <Upload size={16} aria-hidden="true" />
            Adjuntar comprobante
          </button>
        )}
        {errorArchivo ? (
          <p className="mt-1.5 text-[12px] text-[var(--status-error)]">{errorArchivo}</p>
        ) : (
          <p className="mt-1.5 text-[12px] text-[var(--text-tertiary)]">Con una foto, el monto se completa solo — revísalo antes de guardar.</p>
        )}

        <button
          type="button"
          disabled={!archivo || !monto || !concepto.trim() || procesando}
          onClick={guardar}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-40 [touch-action:manipulation]"
        >
          {procesando ? 'Aplicando el Sello de Confianza…' : 'Guardar registro'}
        </button>
      </motion.div>
    </motion.div>
  );
}
