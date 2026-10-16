// PREPARA LAS 5 CAPTURAS DE LA APP (public/frame-*.png) — 2026-10-15.
// Entradas: (a) las capturas viejas con datos de ejemplo (en git: public/frame-*.png de antes) y
// (b) las capturas nuevas del celular en "Capturas - nuevas/" (800×1600, ya con la barra de 6
// pestañas y el nombre "Especialistas").
//   · Especialistas y Expediente: se usan las capturas nuevas tal cual (recortando la barra de
//     desplazamiento y la línea azul de arriba).
//   · Inicio, Pagos y Calendario: se conserva el contenido viejo (que tiene datos de ejemplo) y se le pone
//     la barra de abajo NUEVA de la captura del mismo nombre (6 pestañas, "Especialistas"). En Inicio también
//     se cambia la etiqueta del acceso rápido "Asistencia" por "Especialistas".
// Todas salen de 800×1616 px (misma proporción que un celular real).
//
//   node docs/piezas/_fuente/preparar-capturas.mjs   (desde la raíz del proyecto)
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';

const W = 800;
const H = 1616;
const NUEVAS = 'Capturas - nuevas';
const salida = (n) => `public/frame-${n}.webp`;

// Contenido viejo desde git (commit 7f0bf41, antes de reemplazar las capturas).
const viejo = (n) => execFileSync('git', ['show', `7f0bf41:public/frame-${n}.png`], { maxBuffer: 20 * 1024 * 1024 });

const NAV_TOP = { inicio: 1404, pagos: 1405, calendario: 1404 }; // fila donde empieza la barra en cada captura nueva
const ARCHIVO = { inicio: 'Inicio.jpeg', pagos: 'Pagos.jpeg', calendario: 'calendario.jpeg', expediente: 'Expediente.jpeg', especialistas: 'Especialistas.jpeg' };
const k = W / 375; // escala del contenido viejo (375 px de ancho → 800)
const ALTO_NAV = 159;
const ALTO_CONTENIDO = H - ALTO_NAV; // 1457

// ── Inicio, Pagos, Calendario: contenido viejo + barra nueva ──
for (const n of ['inicio', 'pagos', 'calendario']) {
  const filasViejas = Math.round(ALTO_CONTENIDO / k); // alto del contenido viejo que entra (≈683 de 738)
  let contenido = await sharp(viejo(n)).extract({ left: 0, top: 0, width: 375, height: filasViejas }).resize(W, ALTO_CONTENIDO, { kernel: 'lanczos3' }).png().toBuffer();

  if (n === 'inicio') {
    // acceso rápido "Asistencia" → "Especialistas": se tapa con el blanco de la tarjeta y se pone la etiqueta nueva
    const etiqueta = await sharp('docs/piezas/_fuente/etiqueta-especialistas.png').resize({ width: 162 }).png().toBuffer();
    const meta = await sharp(etiqueta).metadata();
    const blanco = await sharp({ create: { width: 160, height: 40, channels: 3, background: '#ffffff' } }).png().toBuffer();
    const cx = Math.round(315 * k);
    const cy = Math.round(493 * k);
    contenido = await sharp(contenido)
      .composite([
        { input: blanco, left: cx - 80, top: cy - 20 },
        { input: etiqueta, left: cx - Math.round(meta.width / 2), top: cy - Math.round(meta.height / 2) },
      ])
      .png()
      .toBuffer();
  }

  const nav = await sharp(`${NUEVAS}/${ARCHIVO[n]}`).extract({ left: 0, top: NAV_TOP[n], width: 798, height: ALTO_NAV }).resize(W, ALTO_NAV).png().toBuffer();
  await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite([{ input: contenido, left: 0, top: 0 }, { input: nav, left: 0, top: ALTO_CONTENIDO }])
    .webp({ quality: 90 })
    .toFile(salida(n));
  console.log('listo', salida(n));
}

// ── Expediente y Especialistas: captura nueva completa ──
for (const n of ['expediente', 'especialistas']) {
  await sharp(`${NUEVAS}/${ARCHIVO[n]}`)
    .extract({ left: 0, top: 9, width: 790, height: 1591 })
    .resize(W, H, { kernel: 'lanczos3' })
    .webp({ quality: 90 })
    .toFile(n === 'especialistas' ? 'public/frame-especialistas.webp' : salida(n));
  console.log('listo', n === 'especialistas' ? 'public/frame-especialistas.webp' : salida(n));
}
