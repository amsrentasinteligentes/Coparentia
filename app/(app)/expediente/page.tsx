'use client';

// EXPEDIENTE — autorizaciones/controversias (MVP #3) + generador REAL de PDF foliado (MVP #4).
// El PDF se genera de verdad en el navegador (jsPDF) con los datos guardados — no es una
// promesa vacía: al tocar "Exportar" se descarga un archivo real y utilizable.

import { useEffect, useState } from 'react';
import { Download, FileCheck2, Scale } from 'lucide-react';
import { ContenedorApp, PageHeader, Tarjeta, IconoCirculo, Pildora } from '@/components/app/ui';
import {
  type Autorizacion,
  type EstadoAutorizacion,
  obtenerAutorizaciones,
  obtenerPagos,
  obtenerTitulo,
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
  const [generado, setGenerado] = useState(false);

  useEffect(() => {
    setAutorizaciones(obtenerAutorizaciones());
  }, []);

  const exportarPdf = async (): Promise<void> => {
    setGenerando(true);
    try {
      const { jsPDF } = await import('jspdf');
      const titulo = obtenerTitulo();
      const pagos = [...obtenerPagos()].sort((a, b) => a.fecha.localeCompare(b.fecha));
      const doc = new jsPDF({ unit: 'pt', format: 'letter' });
      const margen = 48;
      let y = margen;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Expediente Coparentia', margen, y);
      y += 22;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(90);
      doc.text(`Generado el ${new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}`, margen, y);
      y += 12;
      doc.text('Documento organizado por el usuario — no reemplaza asesoría legal.', margen, y);
      y += 24;

      if (titulo) {
        doc.setTextColor(20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Título de la obligación', margen, y);
        y += 16;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Cuota mensual: ${formatoCOP(titulo.montoMensual)} · Día de pago: ${titulo.diaPago} · Reajuste: ${titulo.indiceReajuste}`, margen, y);
        y += 26;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Historial de pagos y gastos', margen, y);
      y += 16;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      pagos.forEach((p) => {
        if (y > 740) {
          doc.addPage();
          y = margen;
        }
        doc.text(`${formatoFechaLarga(p.fecha)} — ${p.concepto} — ${formatoCOP(p.monto)} (${p.comprobanteNombre})`, margen, y);
        y += 15;
      });
      y += 12;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Autorizaciones y controversias', margen, y);
      y += 16;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      autorizaciones.forEach((a) => {
        if (y > 740) {
          doc.addPage();
          y = margen;
        }
        doc.text(`${formatoFechaLarga(a.fecha)} — ${a.concepto} — ${formatoCOP(a.monto)} — ${PILDORA[a.estado].texto}`, margen, y);
        y += 15;
      });

      const paginas = doc.getNumberOfPages();
      for (let i = 1; i <= paginas; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Coparentia · Folio ${i} de ${paginas}`, margen, 780);
      }

      doc.save(`expediente-coparentia-${new Date().toISOString().slice(0, 10)}.pdf`);
      setGenerado(true);
    } finally {
      setGenerando(false);
    }
  };

  const pendientes = autorizaciones.filter((a) => a.estado === 'pendiente').length;

  return (
    <ContenedorApp>
      <PageHeader titulo="Expediente" subtitulo={pendientes > 0 ? `${pendientes} autorización(es) pendiente(s)` : 'Todo al día'} />

      <Tarjeta className="items-center text-center">
        <IconoCirculo icon={FileCheck2} size={24} />
        <p className="mt-3 text-[16px] font-semibold text-[var(--text-primary)]">Reporte en 1 clic</p>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          Descarga tu expediente en PDF foliado, listo para tu abogado o conciliador.
        </p>
        <button
          type="button"
          disabled={generando}
          onClick={exportarPdf}
          className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-60 [touch-action:manipulation]"
        >
          <Download size={18} aria-hidden="true" />
          {generando ? 'Generando tu PDF…' : 'Exportar expediente'}
        </button>
        {generado && <p className="mt-2 text-[12px] text-[var(--text-tertiary)]">Descargado — revisa tu carpeta de descargas.</p>}
      </Tarjeta>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Autorizaciones y controversias</h2>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {autorizaciones.map((a) => (
          <Tarjeta key={a.id}>
            <div className="flex items-start gap-3">
              <IconoCirculo icon={Scale} />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">{a.concepto}</p>
                  <Pildora texto={PILDORA[a.estado].texto} tono={PILDORA[a.estado].tono} />
                </div>
                <p className="mt-0.5 text-[12px] text-[var(--text-tertiary)]">{formatoFechaLarga(a.fecha)} · {formatoCOP(a.monto)}</p>
                {a.nota && <p className="mt-1.5 text-[13px] text-[var(--text-secondary)]">{a.nota}</p>}
              </div>
            </div>
          </Tarjeta>
        ))}
      </div>
    </ContenedorApp>
  );
}
