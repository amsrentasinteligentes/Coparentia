// GENERADOR DE LAS PIEZAS VISUALES (vista previa 1200×630 + 20 piezas para redes).
// Escribe una página HTML por pieza en docs/piezas/_fuente/html/ y un manifest.json con el tamaño y
// el destino de cada PNG. Luego se abren y se capturan con un navegador (ver LEEME.md).
// Solo usa material del proyecto: capturas de la app, logo, colores y letras de la marca
// (tokens de components/landing/tokens-claro.css · Figtree + Nunito Sans). Datos de EJEMPLO.
//
//   node docs/piezas/_fuente/generar.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const SALIDA = join(AQUI, 'html');
mkdirSync(SALIDA, { recursive: true });
// Las imágenes se piden al servidor local (npm run dev), que sirve /public.
const BASE = 'http://localhost:3000';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700;800&family=Nunito+Sans:wght@400;600;700&display=swap');
:root{--bg:#f3f7fc;--surface:#fff;--surface-2:#e7eef8;--ink:#14233a;--ink2:#4b5c78;--accent:#2f6fdc;--accent2:#5b93e8;--deep:#2757a8}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%}
body{font-family:'Nunito Sans','Segoe UI',sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.d{font-family:'Figtree','Segoe UI',sans-serif}
.canvas{position:relative;overflow:hidden;background:var(--bg)}
.canvas.oscuro{background:linear-gradient(150deg,var(--accent),var(--deep));color:#fff}
.blob{position:absolute;border-radius:62% 38% 55% 45% / 48% 58% 42% 52%;background:linear-gradient(150deg,var(--accent),var(--deep))}
.halo{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(91,147,232,.32),transparent)}
.phone{position:absolute;background:#fff;overflow:hidden;box-shadow:0 46px 90px -34px rgba(20,40,80,.55),0 0 0 1px rgba(20,40,80,.08)}
.phone img{display:block;width:100%}
.logo{display:block;height:var(--lh,64px);width:auto}
.pill-logo{display:inline-flex;align-items:center;background:#fff;border-radius:999px;padding:12px 28px}
em{font-style:normal;color:var(--accent)}
.oscuro em{color:#fff;box-shadow:inset 0 -.2em 0 rgba(255,255,255,.34)}
.abs{position:absolute}
.chip{display:inline-block;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:.55em 1.1em;background:rgba(47,111,220,.12);color:var(--deep)}
.oscuro .chip{background:rgba(255,255,255,.18);color:#fff}
`;

const pagina = (w, h, cuerpo, extraClase = '') =>
  `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>pieza</title><style>${CSS}body{width:${w}px;height:${h}px}</style></head><body><div class="canvas ${extraClase}" style="width:${w}px;height:${h}px">${cuerpo}</div></body></html>`;

const marcar = (t) => t.replace(/\[b\]/g, '<em>').replace(/\[\/b\]/g, '</em>');
const logoImg = (alto, oscuro) =>
  oscuro
    ? `<span class="pill-logo"><img class="logo" style="--lh:${alto}px" src="${BASE}/logo-horizontal.webp" alt="Coparentia"></span>`
    : `<img class="logo" style="--lh:${alto}px" src="${BASE}/logo-horizontal.webp" alt="Coparentia">`;

const manifiesto = [];
const guardar = (archivo, w, h, html, destino) => {
  writeFileSync(join(SALIDA, archivo), html);
  manifiesto.push({ archivo, w, h, destino });
};

// Marco de teléfono con una captura. `w` = ancho total en px.
const telefono = (src, w, x, y, extra = '', encima = '') => {
  const borde = Math.round(w * 0.03);
  const radio = Math.round(w * 0.14);
  return `<div class="phone" style="width:${w}px;left:${x}px;top:${y}px;border:${borde}px solid #14233a;border-radius:${radio}px;${extra}"><img src="${BASE}${src}" alt="">${encima}</div>`;
};

// ───────────────────────────── 1. VISTA PREVIA AL COMPARTIR (1200×630) ─────────────────────────────
{
  const cuerpo = `
    <div class="blob" style="width:640px;height:640px;right:-200px;top:70px"></div>
    <div class="halo" style="width:760px;height:760px;right:-130px;top:10px"></div>
    ${telefono('/frame-inicio.webp', 290, 812, 92, '', '<div style="position:absolute;left:60%;top:6.8%;width:40%;height:11.1%;background:#fff"></div>')}
    <div class="abs" style="left:64px;top:52px">${logoImg(60, false)}</div>
    <h1 class="d abs" style="left:64px;top:156px;width:690px;font-size:64px;line-height:1.05;font-weight:800;letter-spacing:-.01em">
      Padres separados: cada pago de la cuota alimentaria, con <em>comprobante y fecha</em>
    </h1>
    <p class="abs" style="left:64px;top:520px;font-size:30px;font-weight:700;color:var(--ink2)">coparentia.co</p>`;
  guardar('og.html', 1200, 630, pagina(1200, 630, cuerpo), 'public/og-coparentia.png');
}

// ───────────────────────────── 2. UNA PIEZA POR PREGUNTA DE "¿TE SUENA?" ─────────────────────────────
const PREGUNTAS = [
  { slug: '01-perseguir-la-cuota', grupo: 'Si recibes la cuota', oscuro: false, texto: '¿Te toca [b]perseguir la cuota[/b] cada mes para que llegue completa?' },
  { slug: '02-gastos-extra', grupo: 'Si recibes la cuota', oscuro: false, texto: '¿Cubres [b]los gastos extra por tu cuenta[/b] y nadie te lo reconoce?' },
  { slug: '03-cuentas-claras', grupo: 'Si recibes la cuota', oscuro: false, texto: '¿Te da miedo que digan que [b]tus cuentas no estaban claras[/b]?' },
  { slug: '04-mala-paga', grupo: 'Si pagas la cuota', oscuro: true, texto: '¿Por más que pagas te siguen tratando de [b]"mala paga"[/b]?' },
  { slug: '05-gastos-urgentes', grupo: 'Si pagas la cuota', oscuro: true, texto: '¿Te piden dinero para gastos "urgentes" [b]sin ningún soporte[/b]?' },
  { slug: '06-demanda', grupo: 'Si pagas la cuota', oscuro: true, texto: '¿Vives con miedo a una demanda [b]que no sabrías cómo responder[/b]?' },
];

for (const p of PREGUNTAS) {
  const clase = p.oscuro ? 'oscuro' : '';
  // Vertical 1080×1920 — márgenes de 200 arriba y 260 abajo para que las historias no tapen texto.
  {
    const cuerpo = `
      <div class="d abs" style="right:-120px;top:360px;font-size:1700px;line-height:1;font-weight:800;color:${p.oscuro ? '#fff' : 'var(--accent)'};opacity:${p.oscuro ? '.09' : '.07'}">¿</div>
      <div class="abs" style="left:96px;top:200px">${logoImg(80, p.oscuro)}</div>
      <div class="abs" style="left:96px;top:520px;width:888px">
        <span class="chip d" style="font-size:30px">¿Te suena? · ${p.grupo}</span>
        <h1 class="d" style="margin-top:44px;font-size:118px;line-height:1.05;font-weight:800;letter-spacing:-.015em">${marcar(p.texto)}</h1>
      </div>
      <div class="abs" style="left:96px;bottom:260px;width:888px">
        <p style="font-size:46px;line-height:1.25;font-weight:600;opacity:.92;text-wrap:balance;max-width:760px">Cada pago de la cuota, con comprobante y fecha.</p>
        <p class="d" style="margin-top:22px;font-size:44px;font-weight:800;color:${p.oscuro ? '#fff' : 'var(--accent)'}">coparentia.co</p>
      </div>`;
    guardar(`${p.slug}-vertical.html`, 1080, 1920, pagina(1080, 1920, cuerpo, clase), `docs/piezas/vertical/${p.slug}.png`);
  }
  // Cuadrado 1080×1080.
  {
    const cuerpo = `
      <div class="d abs" style="right:-70px;top:70px;font-size:1000px;line-height:1;font-weight:800;color:${p.oscuro ? '#fff' : 'var(--accent)'};opacity:${p.oscuro ? '.09' : '.07'}">¿</div>
      <div class="abs" style="left:84px;top:78px">${logoImg(62, p.oscuro)}</div>
      <div class="abs" style="left:84px;top:230px;width:912px">
        <span class="chip d" style="font-size:25px">¿Te suena? · ${p.grupo}</span>
        <h1 class="d" style="margin-top:32px;font-size:92px;line-height:1.05;font-weight:800;letter-spacing:-.015em">${marcar(p.texto)}</h1>
      </div>
      <div class="abs" style="left:84px;bottom:76px;width:912px;display:flex;justify-content:space-between;align-items:flex-end;gap:24px">
        <p style="font-size:34px;line-height:1.25;font-weight:600;opacity:.92;max-width:600px">Cada pago de la cuota, con comprobante y fecha.</p>
        <p class="d" style="font-size:36px;font-weight:800;color:${p.oscuro ? '#fff' : 'var(--accent)'}">coparentia.co</p>
      </div>`;
    guardar(`${p.slug}-cuadrado.html`, 1080, 1080, pagina(1080, 1080, cuerpo, clase), `docs/piezas/cuadrado/${p.slug}.png`);
  }
}

// ───────────────────────────── 3. LOS TRES PASOS DEL PRODUCTO ─────────────────────────────
const PASOS = [
  { slug: 'paso-1-foto-al-recibo', n: 1, titulo: 'Le tomas la foto al recibo', detalle: 'Desde tu teléfono, como cualquier foto.', img: '/frame-pagos.webp' },
  { slug: 'paso-2-el-sello-lo-confirma', n: 2, titulo: 'El Sello lo confirma', detalle: 'Lee el monto solo, lo fecha y lo asocia al gasto.', img: '/frame-pagos.webp', sello: true },
  { slug: 'paso-3-queda-en-tu-expediente', n: 3, titulo: 'Queda en tu expediente', detalle: 'Listo para exportar cuando lo necesites.', img: '/frame-expediente.webp' },
];
const SELLO = `
  <div style="position:absolute;inset:0;background:rgba(237,240,247,.9);backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3.2cqw;padding-bottom:14cqw;text-align:center">
    <div style="width:27cqw;height:27cqw;border-radius:50%;background:rgba(47,111,220,.14);display:flex;align-items:center;justify-content:center">
      <svg style="width:14cqw;height:14cqw" viewBox="0 0 24 24" fill="none" stroke="#2f6fdc" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/><path d="M8.7 12.2l2.3 2.3 4.4-4.6"/></svg>
    </div>
    <div class="d" style="font-size:5.8cqw;font-weight:700;color:#14233a;line-height:1.1">Sello de Confianza aplicado</div>
    <div style="font-size:3.9cqw;color:#4b5c78;line-height:1.25;padding:0 6cqw">Queda fechado el 24 de septiembre de 2026</div>
  </div>`;
const puntos = (n, tam) =>
  [1, 2, 3].map((i) => `<span style="display:inline-block;width:${tam}px;height:${tam}px;border-radius:50%;background:${i === n ? 'var(--accent)' : 'rgba(47,111,220,.22)'}"></span>`).join('');

for (const p of PASOS) {
  // Vertical: título arriba, teléfono grande que sale por abajo.
  {
    const anchoTel = 600;
    const cuerpo = `
      <div class="blob" style="width:980px;height:980px;left:50px;bottom:-330px"></div>
      <div class="halo" style="width:1100px;height:1100px;left:-10px;bottom:-420px"></div>
      <div class="abs" style="left:96px;top:200px">${logoImg(80, false)}</div>
      <p class="d abs" style="right:96px;top:222px;font-size:36px;font-weight:800;color:var(--accent)">coparentia.co</p>
      <div class="abs" style="left:96px;top:420px;width:888px">
        <div style="display:flex;align-items:center;gap:22px">
          <span class="chip d" style="font-size:30px">Paso ${p.n} de 3</span>
          <span style="display:flex;gap:12px">${puntos(p.n, 18)}</span>
        </div>
        <h1 class="d" style="margin-top:36px;font-size:112px;line-height:1.04;font-weight:800;letter-spacing:-.015em">${p.titulo}</h1>
        <p style="margin-top:28px;font-size:44px;line-height:1.28;font-weight:600;color:var(--ink2);max-width:760px">${p.detalle}</p>
      </div>
      ${telefono(p.img, anchoTel, (1080 - anchoTel) / 2, 1090, p.sello ? 'container-type:inline-size;' : '', p.sello ? SELLO : '')}`;
    guardar(`${p.slug}-vertical.html`, 1080, 1920, pagina(1080, 1920, cuerpo), `docs/piezas/vertical/${p.slug}.png`);
  }
  // Cuadrado: texto a la izquierda, teléfono a la derecha.
  {
    const anchoTel = 400;
    const cuerpo = `
      <div class="blob" style="width:700px;height:700px;right:-200px;top:230px"></div>
      <div class="halo" style="width:820px;height:820px;right:-240px;top:170px"></div>
      <div class="abs" style="left:78px;top:72px">${logoImg(58, false)}</div>
      <div class="abs" style="left:78px;top:216px;width:500px">
        <div style="display:flex;align-items:center;gap:18px">
          <span class="chip d" style="font-size:24px">Paso ${p.n} de 3</span>
          <span style="display:flex;gap:10px">${puntos(p.n, 15)}</span>
        </div>
        <h1 class="d" style="margin-top:28px;font-size:76px;line-height:1.05;font-weight:800;letter-spacing:-.015em">${p.titulo}</h1>
        <p style="margin-top:22px;font-size:32px;line-height:1.28;font-weight:600;color:var(--ink2)">${p.detalle}</p>
      </div>
      ${telefono(p.img, anchoTel, 640, 300, p.sello ? 'container-type:inline-size;' : '', p.sello ? SELLO : '')}
      <p class="d abs" style="left:78px;bottom:64px;font-size:32px;font-weight:800;color:var(--accent)">coparentia.co</p>`;
    guardar(`${p.slug}-cuadrado.html`, 1080, 1080, pagina(1080, 1080, cuerpo), `docs/piezas/cuadrado/${p.slug}.png`);
  }
}

// ───────────────────────────── 4. COMPARACIÓN: CAPTURA SUELTA VS PÁGINA FOLIADA ─────────────────────────────
// Ambos lados son MAQUETAS con datos de ejemplo inventados: sin personas, sin menores, sin cifras reales.
const chat = (escala) => `
  <div style="width:520px;zoom:${escala};background:#e9edf3;border-radius:28px;padding:24px 24px 28px;font-size:27px;line-height:1.28;box-shadow:0 24px 50px -26px rgba(20,40,80,.4)">
    <div style="display:flex;align-items:center;gap:12px;padding-bottom:16px;border-bottom:2px solid #d3dae5;margin-bottom:18px;color:#4b5c78;font-weight:700;font-size:25px"><span style="width:38px;height:38px;border-radius:50%;background:#b8c3d4;display:inline-block"></span>Chat con la otra persona</div>
    <div style="font-size:21px;color:#6b7a92;text-align:center;margin-bottom:10px">12 mar</div>
    <div style="background:#fff;border-radius:20px 20px 20px 4px;padding:14px 20px;max-width:400px;color:#14233a">Ya te pasé la cuota</div>
    <div style="background:#d8e6fb;border-radius:20px 20px 4px 20px;padding:14px 20px;max-width:400px;margin:12px 0 0 auto;color:#14233a">¿Cuál fecha? No me aparece</div>
    <div style="font-size:21px;color:#6b7a92;text-align:center;margin:16px 0 10px">3 abr</div>
    <div style="background:#fff;border-radius:20px 20px 20px 4px;padding:10px;max-width:300px"><div style="height:120px;border-radius:12px;background:repeating-linear-gradient(135deg,#d3dae5,#d3dae5 12px,#c5cedc 12px,#c5cedc 24px);display:flex;align-items:center;justify-content:center;color:#6b7a92;font-size:23px;font-weight:700">foto torcida del recibo</div></div>
  </div>`;

const fila = (fecha, concepto, monto) => `
  <tr style="border-top:1px solid #e0e6ef"><td style="padding:12px 0;font-weight:700;white-space:nowrap;width:128px">${fecha}</td><td style="padding:12px 8px"><div>${concepto}</div><div style="display:flex;align-items:center;gap:6px;color:#157a4f;font-size:18px;font-weight:700;margin-top:2px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#157a4f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Comprobante adjunto</div></td><td style="text-align:right;white-space:nowrap;font-weight:800">${monto}</td></tr>`;

const hoja = (escala) => `
  <div style="width:520px;zoom:${escala};background:#fff;border-radius:12px;padding:30px 30px 24px;box-shadow:0 24px 50px -22px rgba(20,40,80,.5),0 0 0 1px rgba(20,40,80,.08);font-size:22px;color:#14233a">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2f6fdc;padding-bottom:14px">
      <div><div class="d" style="font-size:31px;font-weight:800;line-height:1.1">Expediente de cumplimiento</div><div style="font-size:19px;color:#4b5c78;margin-top:6px">Datos de ejemplo</div></div>
      <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#2f6fdc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex:none;margin-left:10px"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" fill="rgba(47,111,220,.12)"/><path d="M8.7 12.2l2.3 2.3 4.4-4.6"/></svg>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-top:10px;font-size:22px">
      ${fila('5 mar 2026', 'Cuota de marzo', '$ 800.000')}
      ${fila('5 abr 2026', 'Cuota de abril', '$ 800.000')}
      ${fila('22 abr 2026', 'Útiles escolares', '$ 120.000')}
    </table>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:12px;border-top:1px solid #e0e6ef;font-size:19px;color:#4b5c78"><span>Con Sello de Confianza</span><span style="font-weight:800;color:#14233a">Folio 3 de 12</span></div>
  </div>`;

{
  // Vertical: dos paneles apilados en una sola columna (flujo normal: nada se pisa).
  const k = 1.1;
  const ancho = Math.round(520 * k);
  const x = Math.round((1080 - ancho) / 2);
  const cuerpo = `
    <div class="halo" style="width:1200px;height:1200px;left:-60px;top:640px"></div>
    <div class="abs" style="left:96px;top:190px">${logoImg(70, false)}</div>
    <p class="d abs" style="right:96px;top:208px;font-size:34px;font-weight:800;color:var(--accent)">coparentia.co</p>
    <h1 class="d abs" style="left:96px;top:320px;width:888px;font-size:84px;line-height:1.04;font-weight:800;letter-spacing:-.015em">Una captura suelta, o una <em>página foliada</em></h1>
    <div class="abs" style="left:${x}px;top:560px;width:${ancho}px;display:flex;flex-direction:column;gap:14px">
      <div>${chat(k)}</div>
      <p class="d" style="font-size:34px;line-height:1.2;font-weight:700;color:var(--ink2);margin-bottom:22px">Mensajes sueltos, sin orden ni fecha clara.</p>
      <div>${hoja(k)}</div>
      <p class="d" style="font-size:34px;line-height:1.2;font-weight:700;color:var(--ink)">Cada pago con su fecha y su comprobante.</p>
    </div>`;
  guardar('comparacion-whatsapp-vs-pdf-vertical.html', 1080, 1920, pagina(1080, 1920, cuerpo), 'docs/piezas/vertical/comparacion-chat-vs-pagina-foliada.png');
}
{
  // Cuadrado: dos paneles lado a lado a escala 0,87.
  const k = 0.87;
  const cuerpo = `
    <div class="halo" style="width:900px;height:900px;left:90px;top:200px"></div>
    <div class="abs" style="left:64px;top:52px">${logoImg(50, false)}</div>
    <h1 class="d abs" style="left:64px;top:128px;width:952px;font-size:58px;line-height:1.04;font-weight:800;letter-spacing:-.015em">Una captura suelta, o una <em>página foliada</em></h1>
    <div class="abs" style="left:64px;top:312px;width:452px">${chat(k)}</div>
    <div class="abs" style="left:564px;top:312px;width:452px">${hoja(k)}</div>
    <p class="d abs" style="left:64px;top:770px;width:452px;font-size:30px;line-height:1.2;font-weight:700;color:var(--ink2)">Mensajes sueltos, sin orden ni fecha clara.</p>
    <p class="d abs" style="left:564px;top:770px;width:452px;font-size:30px;line-height:1.2;font-weight:700;color:var(--ink)">Cada pago con su fecha y su comprobante.</p>
    <p class="d abs" style="left:64px;bottom:50px;font-size:28px;font-weight:800;color:var(--accent)">coparentia.co <span style="color:var(--ink2);font-weight:600">· Datos de ejemplo</span></p>`;
  guardar('comparacion-whatsapp-vs-pdf-cuadrado.html', 1080, 1080, pagina(1080, 1080, cuerpo), 'docs/piezas/cuadrado/comparacion-chat-vs-pagina-foliada.png');
}

writeFileSync(join(SALIDA, 'manifest.json'), JSON.stringify(manifiesto, null, 2));
console.log(`${manifiesto.length} páginas generadas en ${SALIDA}`);
