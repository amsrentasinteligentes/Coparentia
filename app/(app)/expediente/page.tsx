'use client';

// EXPEDIENTE — autorizaciones/controversias (MVP #3) + generador REAL de PDF foliado (MVP #4).
// El PDF se genera de verdad en el navegador (jsPDF) con los datos guardados — no es una
// promesa vacía: al tocar "Exportar" se descarga un archivo real y utilizable.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Download, FileCheck2, Scale, Settings } from 'lucide-react';
import { ContenedorApp, PageHeader, Tarjeta, IconoCirculo, Pildora, ErrorDeCarga } from '@/components/app/ui';
import { exportarExpedientePdf } from '@/lib/exportar-expediente';
import { AcuerdoCuota } from '@/components/app/AcuerdoCuota';
import { AbogadoDestacado } from '@/components/app/AbogadoDestacado';
import {
  type Autorizacion,
  type EstadoAutorizacion,
  obtenerAutorizaciones,
  formatoCOP,
  formatoFechaLarga,
} from '@/lib/datos';

const PILDORA: Record<EstadoAutorizacion, { texto: string; tono: 'exito' | 'pendiente' | 'alerta' }> = {
  aprobada: { texto: 'Aprobada', tono: 'exito' },
  pendiente: { texto: 'Pendiente', tono: 'pendiente' },
  objetada: { texto: 'Objetada', tono: 'alerta' },
};

export default function Expediente() {
  const [autorizaciones, setAutorizaciones] = useState<Autorizacion[]>([]);
  const [generando, setGenerando] = useState(false);
  const [progreso, setProgreso] = useState<string>('');
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null);
  const [falloCarga, setFalloCarga] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;
    setFalloCarga(false);
    obtenerAutorizaciones()
      .then((r) => {
        if (vigente) setAutorizaciones(r);
      })
      .catch(() => {
        if (vigente) setFalloCarga(true);
      });
    return () => {
      vigente = false;
    };
  }, [intento]);

  const exportarPdf = async (): Promise<void> => {
    if (generando) return;
    setGenerando(true);
    setResultado(null);
    setProgreso('Reuniendo tu expediente…');
    try {
      const r = await exportarExpedientePdf(setProgreso);
      // Se informa exactamente cuántas pruebas quedaron dentro: quien va a llevar esto a un
      // abogado necesita saber si el documento está completo ANTES de enviarlo, no descubrirlo
      // cuando ya lo entregó.
      const base =
        r.anexosIncluidos > 0
          ? `Descargado con ${r.anexosIncluidos} comprobante(s) adjunto(s) dentro del PDF.`
          : 'Descargado. Todavía no hay fotos de comprobantes para anexar.';
      setResultado({
        ok: r.anexosFallidos === 0,
        mensaje:
          r.anexosFallidos > 0
            ? `${base} No pudimos incluir ${r.anexosFallidos} — quedaron señalados dentro del documento y siguen guardados en la app.`
            : base,
      });
    } catch {
      setResultado({
        ok: false,
        mensaje: 'No pudimos generar el expediente. Revisa tu conexión e inténtalo de nuevo.',
      });
    } finally {
      setGenerando(false);
      setProgreso('');
    }
  };

  const pendientes = autorizaciones.filter((a) => a.estado === 'pendiente').length;

  return (
    <ContenedorApp>
      <PageHeader
        titulo="Expediente"
        subtitulo={pendientes > 0 ? `${pendientes} autorización(es) pendiente(s)` : 'Todo al día'}
        accion={
          <Link
            href="/ajustes"
            aria-label="Ajustes"
            className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <Settings size={20} aria-hidden="true" />
          </Link>
        }
      />

      <Tarjeta destacada className="items-center text-center">
        <IconoCirculo icon={FileCheck2} size={24} />
        <p className="mt-3 text-[16px] font-semibold text-[var(--text-primary)]">Reporte en 1 clic</p>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          Tu expediente en PDF foliado, <strong className="text-[var(--text-primary)]">con las fotos de cada
          comprobante adentro</strong> — listo para tu abogado o conciliador.
        </p>
        <motion.button
          type="button"
          disabled={generando}
          onClick={exportarPdf}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-60 [touch-action:manipulation]"
        >
          <Download size={18} aria-hidden="true" />
          {generando ? progreso || 'Preparando…' : 'Exportar expediente'}
        </motion.button>

        {/* Antes solo decía "Generando tu PDF…" sin más. Ahora que se incrusta cada comprobante,
            la exportación puede tardar bastante con un expediente grande: sin decir POR CUÁL va,
            una espera larga se lee como que la app se colgó. */}
        {generando && (
          <p className="mt-2 text-[12px] text-[var(--text-tertiary)]">
            Esto puede tardar un poco: estamos metiendo cada comprobante en el documento.
          </p>
        )}

        {resultado && !generando && (
          <p
            role="status"
            className={`mt-2 text-[12.5px] leading-[1.5] ${resultado.ok ? 'text-[var(--text-tertiary)]' : 'text-[var(--status-error)]'}`}
          >
            {resultado.mensaje}
          </p>
        )}
      </Tarjeta>

      {/* Documento base que fija la cuota (acta de conciliación o sentencia) — se guarda aquí,
          donde el usuario piensa "¿y el papel que dice cuánto me toca?". */}
      <AcuerdoCuota />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Autorizaciones y controversias</h2>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {falloCarga && <ErrorDeCarga onReintentar={() => setIntento((n) => n + 1)} />}

        {/* Sin estado vacío, el título quedaba colgando sobre la nada cuando no hay ninguna. */}
        {!falloCarga && autorizaciones.length === 0 && (
          <Tarjeta className="flex flex-col items-center py-8 text-center">
            <IconoCirculo icon={Scale} size={22} />
            <p className="mt-3 text-[14px] font-medium text-[var(--text-primary)]">Sin autorizaciones registradas</p>
            <p className="mt-1 max-w-[32ch] text-[13px] text-[var(--text-secondary)]">
              Aquí quedan los gastos extraordinarios que pediste autorizar y la respuesta que recibiste.
            </p>
          </Tarjeta>
        )}

        {!falloCarga &&
          autorizaciones.map((a, i) => (
            <Tarjeta key={a.id} indice={i}>
              <div className="flex items-start gap-3">
                <IconoCirculo icon={Scale} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-medium text-[var(--text-primary)]">{a.concepto}</p>
                    <Pildora texto={PILDORA[a.estado].texto} tono={PILDORA[a.estado].tono} />
                  </div>
                  <p className="mt-0.5 text-[12px] text-[var(--text-tertiary)]">{formatoFechaLarga(a.fecha)} · {formatoCOP(a.monto)}</p>
                  {a.nota && <p className="mt-1.5 text-[13px] text-[var(--text-secondary)]">{a.nota}</p>}
                </div>
              </div>
            </Tarjeta>
          ))}
      </div>

      {/* Espacio publicitario para abogados de familia — va al final del Expediente, donde el
          usuario piensa "¿y ahora a quién le muestro esto?". Segundo ingreso de la app; mientras
          nadie pague el cupo, muestra un estado honesto (sin abogado inventado). */}
      <AbogadoDestacado />
    </ContenedorApp>
  );
}
