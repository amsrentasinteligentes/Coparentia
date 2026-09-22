// PDF DE LA CONSTANCIA (2026-09-22) — el adjunto que va con el correo a la otra parte.
//
// Es un documento CORTO y autosuficiente: quién informa, a quién, de qué hijo, qué período, los
// totales y la lista de movimientos. NO lleva las fotos de los comprobantes: son datos sensibles,
// pesan mucho en un correo y no hacen falta para informar (quien los necesite, los pide por el
// canal legal). Ese detalle completo sigue en el expediente que exporta el propio usuario.
//
// Se genera en el SERVIDOR (Node) con jsPDF, sin canvas ni imágenes — por eso funciona igual en la
// acción manual y en el envío mensual automático.

import { jsPDF } from 'jspdf';
import type { ResumenConstancia } from '@/lib/constancias';

const ANCHO = 612;
const ALTO = 792;
const MARGEN = 48;
const LIMITE_Y = ALTO - 60;

function pesos(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

function fechaLarga(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' });
}

/** Fecha corta para las filas de la tabla ("18 sept"): la larga no cabe en su columna. */
function fechaFila(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'America/Bogota' }).replace('.', '');
}

/** Devuelve el PDF en base64, listo para adjuntarlo al correo. */
export function pdfConstancia(
  resumen: ResumenConstancia,
  remitenteNombre: string,
  destinatarioNombre: string,
  enviadoEl: Date = new Date()
): { base64: string; nombreArchivo: string } {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  let y = MARGEN;

  const salto = (alto: number): void => {
    if (y + alto > LIMITE_Y) {
      doc.addPage();
      y = MARGEN;
    }
  };

  /* Encabezado */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20);
  doc.text('Constancia de gastos y aportes', MARGEN, y);
  y += 22;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.text(
    resumen.hijoNombre ? `${resumen.hijoNombre} · ${resumen.periodoTexto}` : resumen.periodoTexto,
    MARGEN,
    y
  );
  y += 26;

  /* Quién informa a quién */
  doc.setFontSize(10);
  doc.setTextColor(110);
  const filasCabecera: [string, string][] = [
    ['Registrado por', remitenteNombre || '—'],
    ['Informado a', destinatarioNombre || '—'],
    ['Período', resumen.periodoTexto],
    ['Fecha de envío', enviadoEl.toLocaleString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Bogota' })],
  ];
  filasCabecera.forEach(([etiqueta, valor]) => {
    salto(16);
    doc.setTextColor(110);
    doc.text(etiqueta, MARGEN, y);
    doc.setTextColor(20);
    doc.text(doc.splitTextToSize(valor, 320)[0], MARGEN + 150, y);
    y += 16;
  });
  y += 10;

  /* Totales */
  doc.setDrawColor(210);
  doc.setLineWidth(0.5);
  doc.line(MARGEN, y, ANCHO - MARGEN, y);
  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text(resumen.hijoNombre ? `Total registrado para ${resumen.hijoNombre}` : 'Total registrado en el período', MARGEN, y);
  doc.text(pesos(resumen.totalRegistrado), ANCHO - MARGEN, y, { align: 'right' });
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(110);
  const piezas: string[] = [];
  if (resumen.cuotas > 0) piezas.push(`${resumen.cuotas} ${resumen.cuotas === 1 ? 'cuota' : 'cuotas'}`);
  if (resumen.gastosExtra > 0) piezas.push(`${resumen.gastosExtra} ${resumen.gastosExtra === 1 ? 'gasto extra' : 'gastos extra'}`);
  if (resumen.contactos > 0) {
    piezas.push(
      `${resumen.contactos} ${resumen.contactos === 1 ? 'contacto' : 'contactos'} (${resumen.contactosContestados} ${resumen.contactosContestados === 1 ? 'contestado' : 'contestados'})`
    );
  }
  if (piezas.length === 0) piezas.push('Sin movimientos propios en el período');
  doc.text(piezas.join(' · '), MARGEN, y);
  y += 22;

  /* Movimientos */
  if (resumen.movimientos.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20);
    salto(20);
    doc.text('Movimientos del período', MARGEN, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110);
    doc.text('Fecha', MARGEN, y);
    doc.text('Concepto', MARGEN + 80, y);
    doc.text('Tipo', MARGEN + 330, y);
    doc.text('Monto', ANCHO - MARGEN, y, { align: 'right' });
    y += 14;
    doc.setFontSize(10);
    resumen.movimientos.forEach((m) => {
      salto(16);
      doc.setTextColor(40);
      doc.text(fechaFila(m.fecha), MARGEN, y);
      doc.text(doc.splitTextToSize(m.concepto, 230)[0], MARGEN + 80, y);
      doc.setTextColor(110);
      doc.text(m.tipo === 'cuota' ? 'Cuota' : 'Gasto extra', MARGEN + 330, y);
      doc.setTextColor(20);
      doc.text(pesos(m.monto), ANCHO - MARGEN, y, { align: 'right' });
      y += 16;
    });
    y += 8;
  }

  /* Comunes (no suman al total del hijo) */
  if (resumen.comunesCantidad > 0) {
    salto(40);
    doc.setTextColor(110);
    doc.setFontSize(9);
    const texto = `Además, en el período se registraron ${resumen.comunesCantidad} ${resumen.comunesCantidad === 1 ? 'movimiento común' : 'movimientos comunes'} por ${pesos(resumen.comunesTotal)} (cuota alimentaria y gastos que no corresponden a un hijo en particular). No están sumados arriba para no contarlos dos veces.`;
    const lineas: string[] = doc.splitTextToSize(texto, ANCHO - MARGEN * 2);
    doc.text(lineas, MARGEN, y);
    y += 12 * lineas.length + 10;
  }

  /* Pie legal, en todas las páginas */
  const paginas = doc.getNumberOfPages();
  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Coparentia · Constancia informativa · Página ${i} de ${paginas}`, MARGEN, ALTO - 34);
    doc.text('Cada registro quedó guardado con su fecha y su soporte. Documento informativo, no reemplaza asesoría legal.', MARGEN, ALTO - 22);
  }

  const base64 = doc.output('datauristring').split(',')[1];
  const sufijo = resumen.hijoNombre ? `-${resumen.hijoNombre.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '')}` : '';
  return { base64, nombreArchivo: `constancia-${resumen.periodo}${sufijo}.pdf` };
}
