'use client';

// PAGOS — registro de pagos y gastos extraordinarios (MVP #2 de ESTADO.md §11). Filtros por
// tipo (regla 14 del SO: listas >8-10 ítems necesitan filtro; aquí se agrega desde ya porque
// la lista crece rápido con el uso real). Subir comprobante = 1 acción primaria de la sección.

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, ShieldCheck, FileCheck2, X } from 'lucide-react';
import { ContenedorApp, PageHeader, Tarjeta, IconoCirculo, BotonFlotante } from '@/components/app/ui';
import { type Pago, type Titulo, type TipoMovimiento, obtenerPagos, agregarPago, obtenerTitulo, formatoCOP, formatoFechaLarga } from '@/lib/datos';

type Filtro = 'todos' | TipoMovimiento;

export default function Pagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    obtenerPagos().then(setPagos);
  }, []);

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
        {visibles.length === 0 && (
          <Tarjeta className="items-center py-10 text-center">
            <p className="text-[14px] text-[var(--text-secondary)]">Todavía no tienes registros en esta categoría.</p>
          </Tarjeta>
        )}
        {visibles.map((p) => (
          <Tarjeta key={p.id} className="flex items-center gap-3">
            <IconoCirculo icon={p.tipo === 'cuota' ? ShieldCheck : FileCheck2} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-[var(--text-primary)]">{p.concepto}</p>
              <p className="truncate text-[12px] text-[var(--text-tertiary)]">{formatoFechaLarga(p.fecha)} · {p.comprobanteNombre}</p>
            </div>
            <p className="shrink-0 text-[14px] font-semibold tabular-nums text-[var(--text-primary)]">{formatoCOP(p.monto)}</p>
          </Tarjeta>
        ))}
      </div>

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
            }}
          />
        )}
      </AnimatePresence>
    </ContenedorApp>
  );
}

function ModalRegistro({ onCerrar, onGuardado }: { onCerrar: () => void; onGuardado: (p: Pago) => void }) {
  const [tipo, setTipo] = useState<TipoMovimiento>('cuota');
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [procesando, setProcesando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    obtenerTitulo().then((t: Titulo | null) => {
      if (t) setMonto(String(t.montoMensual));
    });
  }, []);

  const guardar = (): void => {
    if (!archivo || !monto || !concepto.trim()) return;
    setProcesando(true);
    agregarPago({
      fecha: new Date().toISOString().slice(0, 10),
      monto: Number(monto),
      concepto: concepto.trim(),
      tipo,
      comprobanteNombre: archivo.name,
    }).then((nuevo) => {
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

        <label className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">Monto (COP)</label>
        <input
          type="number"
          inputMode="numeric"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] tabular-nums text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />

        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] text-[14px] text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <Upload size={16} aria-hidden="true" />
          {archivo ? archivo.name : 'Adjuntar comprobante'}
        </button>

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
