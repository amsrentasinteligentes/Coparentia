'use client';

// GENERADOR DEL EXPEDIENTE EN PDF.
//
// Este archivo es, literalmente, el producto: es lo ÚNICO de la app que sale al mundo. Es lo que
// la persona le manda a su abogado, lo que muestra en una audiencia y lo que le enseña a un amigo
// que está pasando por lo mismo.
//
// QUÉ ESTABA MAL ANTES: el PDF listaba los pagos con el NOMBRE del archivo entre paréntesis
// —"$850.000 (transferencia-sep.jpg)"— pero no incluía los comprobantes. O sea: un documento que
// le pide a quien lo recibe que confíe en que existe una foto llamada así. Las pruebas no estaban
// en la prueba. Tampoco traía un resumen arriba, que es lo primero que mira un abogado.
//
// QUÉ HACE AHORA:
//   1. Portada con el resumen que se lee primero: total registrado, período cubierto, cuántos
//      comprobantes y cuántos van anexos.
//   2. El título de la obligación (cuota, día de pago, reajuste, desde cuándo).
//   3. Historial de pagos con columnas alineadas, cada uno indicando en qué anexo está su prueba.
//   4. Autorizaciones y controversias.
//   5. ANEXOS: una página por comprobante, con la imagen real incrustada.
//
// Resistencia a fallos: si un comprobante no se puede traer o incrustar, se anota en el documento
// y se sigue. Un expediente con 11 de 12 anexos y una nota clara es infinitamente más útil que una
// exportación que se cae entera por una foto.

import {
  type Autorizacion,
  type EstadoAutorizacion,
  obtenerAutorizaciones,
  obtenerEventos,
  esContacto,
  type Evento,
  obtenerPagos,
  obtenerTitulo,
  obtenerUrlArchivo,
  formatoCOP,
  formatoFechaLarga,
  formatoFechaCorta,
} from '@/lib/datos';
import { hoyEnColombia } from '@/lib/fecha';
import { obtenerPerfil, obtenerHijos, edadTexto, type Perfil, type Hijo } from '@/lib/perfil';

const ETIQUETA_ESTADO: Record<EstadoAutorizacion, string> = {
  aprobada: 'Aprobada',
  pendiente: 'Pendiente',
  objetada: 'Objetada',
};

// Carta en puntos (jsPDF con unit 'pt').
const ANCHO = 612;
const ALTO = 792;
const MARGEN = 48;
const ANCHO_UTIL = ANCHO - MARGEN * 2;
const LIMITE_Y = ALTO - 60; // deja aire para el folio del pie

// Lado máximo de la foto incrustada. La franja útil de una página carta a ~150 ppp ronda los
// 1075 px, así que 1400 sobra para que se lea un recibo sin inflar el archivo a decenas de MB.
const LADO_MAXIMO_ANEXO = 1400;
const CALIDAD_ANEXO = 0.72;

export interface ResultadoExportacion {
  ok: boolean;
  anexosIncluidos: number;
  anexosFallidos: number;
  mensaje?: string;
}

/** Trae la imagen de una URL firmada y la reduce a un data URL liviano para incrustar. */
async function imagenParaAnexo(url: string): Promise<{ datos: string; ancho: number; alto: number } | null> {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) return null;
    const blob = await respuesta.blob();
    const bitmap = await createImageBitmap(blob);

    let { width, height } = bitmap;
    if (width > LADO_MAXIMO_ANEXO || height > LADO_MAXIMO_ANEXO) {
      const escala = Math.min(LADO_MAXIMO_ANEXO / width, LADO_MAXIMO_ANEXO / height);
      width = Math.round(width * escala);
      height = Math.round(height * escala);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    // Fondo blanco: un PNG con transparencia se vería negro dentro del PDF.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);

    return { datos: canvas.toDataURL('image/jpeg', CALIDAD_ANEXO), ancho: width, alto: height };
  } catch {
    return null;
  }
}

export async function exportarExpedientePdf(
  onProgreso?: (mensaje: string) => void
): Promise<ResultadoExportacion> {
  onProgreso?.('Reuniendo tu expediente…');

  // Perfil e hijos son opcionales en el PDF: si no cargan (perfil sin llenar, red), el expediente
  // sale igual — solo sin los nombres. Nunca se cae la exportación por un dato de cortesía.
  const [{ jsPDF }, titulo, pagos, autorizaciones, perfil, hijos, eventos] = await Promise.all([
    import('jspdf'),
    obtenerTitulo(),
    obtenerPagos(),
    obtenerAutorizaciones(),
    obtenerPerfil().catch((): Perfil | null => null),
    obtenerHijos().catch((): Hijo[] => []),
    obtenerEventos().catch((): Evento[] => []),
  ]);
  // Registros de CONTACTO (llamadas / videollamadas): prueba de presencia, no de dinero.
  const contactos = eventos
    .filter((e) => esContacto(e.tipo))
    .sort((a, b) => `${a.fecha} ${a.hora ?? ''}`.localeCompare(`${b.fecha} ${b.hora ?? ''}`));
  const contactosConFoto = contactos.filter((c) => c.documentoAdjuntoPath && !c.documentoAdjunto?.toLowerCase().endsWith('.pdf'));
  const MEDIO_TXT: Record<string, string> = { llamada: 'llamada normal', whatsapp: 'WhatsApp', videollamada: 'videollamada', otro: 'otro medio' };
  const RESULTADO_TXT: Record<string, string> = { contestada: 'Contestó', no_contestada: 'No contestó', no_posible: 'No fue posible' };

  const ordenados = [...pagos].sort((a, b) => a.fecha.localeCompare(b.fecha));
  // Solo las fotos se pueden incrustar. Un comprobante en PDF no se puede pegar como imagen con
  // esta herramienta, así que se declara explícitamente en el documento en vez de omitirlo en
  // silencio: quien lo reciba debe saber que ese archivo existe y se entrega aparte.
  const conFoto = ordenados.filter((p) => p.comprobantePath && !p.comprobanteNombre.toLowerCase().endsWith('.pdf'));
  const enPdfAparte = ordenados.filter((p) => p.comprobantePath && p.comprobanteNombre.toLowerCase().endsWith('.pdf'));

  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  let y = MARGEN;

  const salto = (alto: number): void => {
    if (y + alto > LIMITE_Y) {
      doc.addPage();
      y = MARGEN;
    }
  };
  const titular = (texto: string): void => {
    salto(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text(texto, MARGEN, y);
    y += 6;
    doc.setDrawColor(210);
    doc.setLineWidth(0.5);
    doc.line(MARGEN, y, ANCHO - MARGEN, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(40);
  };

  /* ── PORTADA ────────────────────────────────────────────────────────────── */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(20);
  doc.text('Expediente de cumplimiento', MARGEN, y);
  y += 24;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(
    `Generado el ${new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })} · Coparentia`,
    MARGEN,
    y
  );
  y += 28;

  /* ── RESUMEN — lo primero que mira quien lo recibe ───────────────────────── */
  const total = ordenados.reduce((acc, p) => acc + p.monto, 0);
  const meses = new Set(ordenados.filter((p) => p.tipo === 'cuota').map((p) => p.fecha.slice(0, 7))).size;
  const periodo =
    ordenados.length > 0
      ? `${formatoFechaLarga(ordenados[0].fecha)} — ${formatoFechaLarga(ordenados[ordenados.length - 1].fecha)}`
      : 'Sin registros todavía';

  /* ── QUIÉNES — el titular, sus hijos y la otra parte (nombres que la persona puso en Perfil).
     Es lo primero que un abogado o un juez necesita ubicar: de quién es este expediente y a
     favor de qué menores. Solo se imprime lo que existe. */
  const filasQuienes: [string, string][] = [];
  if (perfil?.nombre) {
    const rol = perfil.rolFamiliar === 'papa' ? ' (padre)' : perfil.rolFamiliar === 'mama' ? ' (madre)' : '';
    filasQuienes.push(['Titular del expediente', `${perfil.nombre}${rol}`]);
  }
  if (hijos.length > 0) {
    const lista = hijos
      .map((h) => {
        const edad = edadTexto(h.fechaNacimiento);
        return edad ? `${h.nombre} (${edad})` : h.nombre;
      })
      .join(', ');
    filasQuienes.push([hijos.length === 1 ? 'Hijo/a' : 'Hijos', lista]);
  }
  if (perfil?.otroProgenitorNombre) filasQuienes.push(['Otra parte', perfil.otroProgenitorNombre]);
  if (filasQuienes.length > 0) {
    titular('Partes');
    filasQuienes.forEach(([etiqueta, valor]) => {
      const lineas: string[] = doc.splitTextToSize(valor, ANCHO_UTIL - 260);
      salto(16 * lineas.length);
      doc.setTextColor(110);
      doc.text(etiqueta, MARGEN, y);
      doc.setTextColor(20);
      doc.setFont('helvetica', 'bold');
      doc.text(lineas, MARGEN + 260, y);
      doc.setFont('helvetica', 'normal');
      y += 16 * lineas.length;
    });
    y += 12;
  }

  titular('Resumen');
  const filasResumen: [string, string][] = [
    ['Total registrado', formatoCOP(total)],
    ['Comprobantes registrados', String(ordenados.length)],
    ['Meses con cuota registrada', String(meses)],
    ['Período cubierto', periodo],
    ['Comprobantes anexos en este documento', String(conFoto.length)],
    ...(contactos.length > 0 ? [['Contactos con los hijos registrados', String(contactos.length)] as [string, string]] : []),
  ];
  filasResumen.forEach(([etiqueta, valor]) => {
    salto(16);
    doc.setTextColor(110);
    doc.text(etiqueta, MARGEN, y);
    doc.setTextColor(20);
    doc.setFont('helvetica', 'bold');
    doc.text(valor, MARGEN + 260, y);
    doc.setFont('helvetica', 'normal');
    y += 16;
  });
  y += 12;

  /* ── TÍTULO DE LA OBLIGACIÓN ────────────────────────────────────────────── */
  if (titulo) {
    titular('Título de la obligación');
    const filas: [string, string][] = [
      ['Cuota mensual', formatoCOP(titulo.montoMensual)],
      ['Día de pago', `${titulo.diaPago} de cada mes`],
      ['Reajuste anual', titulo.indiceReajuste],
      ['Vigente desde', formatoFechaLarga(titulo.fechaInicio)],
      // El acta de conciliación o la sentencia es el documento que DA ORIGEN a todo lo demás:
      // quien recibe el expediente necesita saber de entrada si está o no (auditoría 2026-09-11).
      [
        'Documento que la fija',
        titulo.acuerdoNombre ? `${titulo.acuerdoNombre} (ver Anexo A)` : 'No cargado en la aplicación',
      ],
    ];
    filas.forEach(([etiqueta, valor]) => {
      salto(16);
      doc.setTextColor(110);
      doc.text(etiqueta, MARGEN, y);
      doc.setTextColor(20);
      doc.text(valor, MARGEN + 260, y);
      y += 16;
    });
    y += 12;
  }

  /* ── HISTORIAL DE PAGOS ─────────────────────────────────────────────────── */
  titular('Historial de pagos y gastos');
  if (ordenados.length === 0) {
    doc.setTextColor(110);
    doc.text('Sin movimientos registrados.', MARGEN, y);
    y += 16;
  } else {
    doc.setTextColor(110);
    doc.setFontSize(9);
    doc.text('Fecha', MARGEN, y);
    doc.text('Concepto', MARGEN + 110, y);
    doc.text('Monto', MARGEN + 330, y);
    doc.text('Prueba', MARGEN + 430, y);
    y += 14;
    doc.setFontSize(10);

    let numeroAnexo = 0;
    ordenados.forEach((p) => {
      salto(16);
      const esFoto = p.comprobantePath && !p.comprobanteNombre.toLowerCase().endsWith('.pdf');
      if (esFoto) numeroAnexo += 1;
      doc.setTextColor(40);
      doc.text(formatoFechaLarga(p.fecha), MARGEN, y);
      // El concepto (con el hijo, si lo tiene) se recorta para no invadir la columna del monto.
      const conceptoConHijo = p.hijoNombre ? `${p.concepto} — ${p.hijoNombre}` : p.concepto;
      doc.text(doc.splitTextToSize(conceptoConHijo, 200)[0], MARGEN + 110, y);
      doc.text(formatoCOP(p.monto), MARGEN + 330, y);
      doc.setTextColor(110);
      doc.text(
        esFoto ? `Anexo ${numeroAnexo}` : p.comprobantePath ? 'PDF aparte' : '—',
        MARGEN + 430,
        y
      );
      y += 16;
    });
  }
  y += 12;

  /* ── GASTOS EXTRA POR HIJO — con hijos cargados, la cuenta de cada uno por separado (pedido
     del usuario 2026-09-18: "que las cuentas puedan quedar claras"). La cuota alimentaria es de
     todos y no se reparte aquí. */
  const extras = ordenados.filter((p) => p.tipo === 'gasto_extra');
  if (hijos.length > 0 && extras.length > 0) {
    titular('Gastos extra por hijo');
    doc.setTextColor(110);
    doc.setFontSize(9);
    doc.text('Hijo/a', MARGEN, y);
    doc.text('Gastos', MARGEN + 260, y);
    doc.text('Total', MARGEN + 330, y);
    y += 14;
    doc.setFontSize(10);
    const filasHijos: [string, number, number][] = hijos.map((h) => {
      const suyos = extras.filter((p) => p.hijoId === h.id);
      return [h.nombre, suyos.length, suyos.reduce((acc, p) => acc + p.monto, 0)];
    });
    const sinHijo = extras.filter((p) => !p.hijoId);
    if (sinHijo.length > 0) filasHijos.push(['Sin hijo asignado (comunes)', sinHijo.length, sinHijo.reduce((acc, p) => acc + p.monto, 0)]);
    filasHijos.forEach(([nombre, cantidad, total]) => {
      salto(16);
      doc.setTextColor(40);
      doc.text(doc.splitTextToSize(nombre, 240)[0], MARGEN, y);
      doc.text(String(cantidad), MARGEN + 260, y);
      doc.setFont('helvetica', 'bold');
      doc.text(formatoCOP(total), MARGEN + 330, y);
      doc.setFont('helvetica', 'normal');
      y += 16;
    });
    y += 12;
  }

  /* ── CONTACTO CON LOS HIJOS (2026-09-21) — llamadas y videollamadas registradas con Sello:
     fecha, hora, medio, duración y si contestaron. Se registra el HECHO, nunca el contenido. ── */
  if (contactos.length > 0) {
    titular('Contacto con los hijos (llamadas y videollamadas)');
    // Resumen por hijo primero: es lo que se lee de un vistazo ("38 llamadas, 92 % contestadas").
    const grupos: { nombre: string; lista: Evento[] }[] = hijos
      .map((h) => ({ nombre: h.nombre, lista: contactos.filter((c) => c.hijoId === h.id) }))
      .filter((g) => g.lista.length > 0);
    const sinHijo = contactos.filter((c) => !c.hijoId);
    if (sinHijo.length > 0) grupos.push({ nombre: hijos.length > 0 ? 'Sin hijo asignado' : 'Total', lista: sinHijo });
    doc.setTextColor(110);
    doc.setFontSize(9);
    doc.text('Hijo/a', MARGEN, y);
    doc.text('Contactos', MARGEN + 200, y);
    doc.text('Contestados', MARGEN + 270, y);
    doc.text('Minutos', MARGEN + 350, y);
    doc.text('Período', MARGEN + 420, y);
    y += 14;
    doc.setFontSize(10);
    grupos.forEach((g) => {
      salto(16);
      const contestados = g.lista.filter((c) => c.resultado === 'contestada').length;
      const minutos = g.lista.reduce((acc, c) => acc + (c.duracionMin ?? 0), 0);
      const pct = Math.round((contestados / g.lista.length) * 100);
      doc.setTextColor(40);
      doc.text(doc.splitTextToSize(g.nombre, 180)[0], MARGEN, y);
      doc.text(String(g.lista.length), MARGEN + 200, y);
      doc.setFont('helvetica', 'bold');
      doc.text(`${contestados} (${pct} %)`, MARGEN + 270, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(minutos), MARGEN + 350, y);
      doc.setTextColor(110);
      doc.text(`${formatoFechaCorta(g.lista[0].fecha)} — ${formatoFechaCorta(g.lista[g.lista.length - 1].fecha)}`, MARGEN + 420, y);
      y += 16;
    });
    y += 10;

    // Detalle cronológico.
    salto(30);
    doc.setTextColor(110);
    doc.setFontSize(9);
    doc.text('Fecha y hora', MARGEN, y);
    doc.text('Tipo · medio', MARGEN + 120, y);
    doc.text('Hijo/a', MARGEN + 250, y);
    doc.text('Duración', MARGEN + 340, y);
    doc.text('Resultado', MARGEN + 400, y);
    doc.text('Prueba', MARGEN + 470, y);
    y += 14;
    doc.setFontSize(10);
    let numeroAnexoC = 0;
    contactos.forEach((c) => {
      salto(16);
      const esFoto = c.documentoAdjuntoPath && !c.documentoAdjunto?.toLowerCase().endsWith('.pdf');
      if (esFoto) numeroAnexoC += 1;
      doc.setTextColor(40);
      doc.text(`${formatoFechaCorta(c.fecha)}${c.hora ? ` · ${c.hora}` : ''}`, MARGEN, y);
      const tipoTxt = c.tipo === 'videollamada' ? 'Videollamada' : 'Llamada';
      doc.text(doc.splitTextToSize(`${tipoTxt}${c.medio ? ` · ${MEDIO_TXT[c.medio] ?? c.medio}` : ''}`, 125)[0], MARGEN + 120, y);
      doc.text(doc.splitTextToSize(c.hijoNombre ?? '—', 85)[0], MARGEN + 250, y);
      doc.text(c.resultado === 'contestada' && c.duracionMin ? `${c.duracionMin} min` : '—', MARGEN + 340, y);
      doc.text(c.resultado ? RESULTADO_TXT[c.resultado] ?? c.resultado : '—', MARGEN + 400, y);
      doc.setTextColor(110);
      doc.text(esFoto ? `Anexo C${numeroAnexoC}` : c.documentoAdjuntoPath ? 'PDF aparte' : '—', MARGEN + 470, y);
      y += 16;
    });
    salto(30);
    doc.setTextColor(110);
    doc.setFontSize(9);
    doc.text('Cada registro se creó con el Sello de Confianza (fecha del sistema) y no admite edición ni borrado.', MARGEN, y);
    y += 12;
    doc.text('Se registra el hecho del contacto; nunca se graba audio ni video.', MARGEN, y);
    y += 22;
    doc.setFontSize(10);
  }

  /* ── AUTORIZACIONES ─────────────────────────────────────────────────────── */
  titular('Autorizaciones y controversias');
  if (autorizaciones.length === 0) {
    doc.setTextColor(110);
    doc.text('Sin autorizaciones registradas.', MARGEN, y);
    y += 16;
  } else {
    autorizaciones.forEach((a: Autorizacion) => {
      salto(16);
      doc.setTextColor(40);
      doc.text(formatoFechaLarga(a.fecha), MARGEN, y);
      doc.text(doc.splitTextToSize(a.concepto, 200)[0], MARGEN + 110, y);
      doc.text(formatoCOP(a.monto), MARGEN + 330, y);
      doc.setTextColor(110);
      doc.text(ETIQUETA_ESTADO[a.estado], MARGEN + 430, y);
      y += 16;
    });
  }
  y += 12;

  if (enPdfAparte.length > 0) {
    salto(40);
    doc.setTextColor(110);
    doc.setFontSize(9);
    doc.text(
      `Nota: ${enPdfAparte.length} comprobante(s) fueron adjuntados en formato PDF y se entregan como archivo separado.`,
      MARGEN,
      y
    );
    y += 14;
    doc.setFontSize(10);
  }

  /* ── ANEXOS: los comprobantes de verdad, uno por página ──────────────────── */
  let incluidos = 0;
  let fallidos = 0;

  /* ANEXO A — el acuerdo (acta de conciliación o sentencia). Va PRIMERO y con letra en vez de
     número: es el documento que fija la obligación, no una prueba de pago más. Se numera aparte
     para que agregar o quitar comprobantes no le cambie el nombre al acuerdo dentro del PDF. */
  if (titulo?.acuerdoPath && titulo.acuerdoNombre) {
    onProgreso?.('Anexando el acuerdo…');
    doc.addPage();
    y = MARGEN;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text('Anexo A — Acuerdo que fija la cuota', MARGEN, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(140);
    doc.text(`Archivo original: ${titulo.acuerdoNombre}`, MARGEN, y);
    y += 18;
    doc.setFontSize(10);

    const esPdf = titulo.acuerdoNombre.toLowerCase().endsWith('.pdf');
    const urlAcuerdo = await obtenerUrlArchivo(titulo.acuerdoPath);
    const imagenAcuerdo = !esPdf && urlAcuerdo ? await imagenParaAnexo(urlAcuerdo) : null;

    if (imagenAcuerdo) {
      const disponible = LIMITE_Y - y;
      const escalaAcuerdo = Math.min(ANCHO_UTIL / imagenAcuerdo.ancho, disponible / imagenAcuerdo.alto);
      doc.addImage(
        imagenAcuerdo.datos,
        'JPEG',
        MARGEN,
        y,
        imagenAcuerdo.ancho * escalaAcuerdo,
        imagenAcuerdo.alto * escalaAcuerdo
      );
      incluidos += 1;
    } else {
      // Un PDF no se puede incrustar en otro PDF con esta librería. Se DECLARA, igual que los
      // comprobantes en PDF: mejor decir "va aparte" que dar a entender que está adentro.
      doc.setTextColor(150);
      doc.text(
        esPdf
          ? 'El acuerdo está en PDF y se entrega como archivo aparte, no incrustado aquí.'
          : 'No se pudo incluir la imagen del acuerdo en la exportación.',
        MARGEN,
        y
      );
      doc.text('El archivo original sigue guardado en la aplicación.', MARGEN, y + 14);
      if (!esPdf) fallidos += 1;
    }
  }

  for (let i = 0; i < conFoto.length; i++) {
    const p = conFoto[i];
    onProgreso?.(`Anexando comprobante ${i + 1} de ${conFoto.length}…`);

    doc.addPage();
    y = MARGEN;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text(`Anexo ${i + 1}`, MARGEN, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`${formatoFechaLarga(p.fecha)} · ${p.concepto}${p.hijoNombre ? ` · ${p.hijoNombre}` : ''} · ${formatoCOP(p.monto)}`, MARGEN, y);
    y += 14;
    doc.setTextColor(140);
    doc.setFontSize(9);
    doc.text(`Archivo original: ${p.comprobanteNombre}`, MARGEN, y);
    y += 18;
    doc.setFontSize(10);

    const url = p.comprobantePath ? await obtenerUrlArchivo(p.comprobantePath) : null;
    const imagen = url ? await imagenParaAnexo(url) : null;

    if (!imagen) {
      fallidos += 1;
      doc.setTextColor(150);
      doc.text('No se pudo incluir la imagen de este comprobante en la exportación.', MARGEN, y);
      doc.text('El archivo original sigue guardado en la aplicación.', MARGEN, y + 14);
      continue;
    }

    // Encaja la foto dentro del área disponible SIN deformarla.
    const disponibleAlto = LIMITE_Y - y;
    const escala = Math.min(ANCHO_UTIL / imagen.ancho, disponibleAlto / imagen.alto);
    const w = imagen.ancho * escala;
    const h = imagen.alto * escala;
    doc.addImage(imagen.datos, 'JPEG', MARGEN, y, w, h);
    incluidos += 1;
  }

  /* ANEXOS C — capturas de los registros de contacto (registro de llamadas del celular, pantalla
     de la videollamada). Numeración propia (C1, C2…) para no mover la de los comprobantes. */
  for (let i = 0; i < contactosConFoto.length; i++) {
    const c = contactosConFoto[i];
    onProgreso?.(`Anexando contacto ${i + 1} de ${contactosConFoto.length}…`);
    doc.addPage();
    y = MARGEN;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text(`Anexo C${i + 1} — Contacto con los hijos`, MARGEN, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60);
    const resultadoTxt = c.resultado ? ` · ${RESULTADO_TXT[c.resultado] ?? c.resultado}` : '';
    doc.text(`${formatoFechaLarga(c.fecha)}${c.hora ? ` · ${c.hora}` : ''} · ${c.titulo}${resultadoTxt}`, MARGEN, y);
    y += 14;
    doc.setTextColor(140);
    doc.setFontSize(9);
    doc.text(`Archivo original: ${c.documentoAdjunto ?? ''}`, MARGEN, y);
    y += 18;
    doc.setFontSize(10);
    const url = c.documentoAdjuntoPath ? await obtenerUrlArchivo(c.documentoAdjuntoPath) : null;
    const imagen = url ? await imagenParaAnexo(url) : null;
    if (!imagen) {
      fallidos += 1;
      doc.setTextColor(150);
      doc.text('No se pudo incluir la imagen de este registro en la exportación.', MARGEN, y);
      doc.text('El archivo original sigue guardado en la aplicación.', MARGEN, y + 14);
      continue;
    }
    const disponibleAlto = LIMITE_Y - y;
    const escala = Math.min(ANCHO_UTIL / imagen.ancho, disponibleAlto / imagen.alto);
    doc.addImage(imagen.datos, 'JPEG', MARGEN, y, imagen.ancho * escala, imagen.alto * escala);
    incluidos += 1;
  }

  /* ── FOLIADO — se numera al final, cuando ya existen todas las páginas ───── */
  const paginas = doc.getNumberOfPages();
  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Coparentia · Folio ${i} de ${paginas}`, MARGEN, ALTO - 30);
    doc.text('Documento organizado por el usuario — no reemplaza asesoría legal.', MARGEN + 180, ALTO - 30);
  }

  onProgreso?.('Preparando la descarga…');
  doc.save(`expediente-coparentia-${hoyEnColombia()}.pdf`);

  return { ok: true, anexosIncluidos: incluidos, anexosFallidos: fallidos };
}
