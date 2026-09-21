# FICHA DE DIRECCIÓN DE ARTE — Coparentia

## Referencia del usuario (CONTRATO — ver 16, protocolo obligatorio)
- ¿Hay imagen(es) de referencia del usuario?: NO → el usuario pidió que se propusiera el diseño
  (PASO 0 del 54, ruta 1: "propóngamelo tú").
- Extracción: N/A — sin referencia visual del usuario.
- Prohibiciones anti-IA que la referencia LEVANTA: ninguna (no aplica la excepción).

## Identidad derivada (FUSIÓN de líderes — 16 PASO 0.2bis — + banco del 54 para el dispositivo)
- TABLA DE LÍDERES: Clio (gestión legal — estructura de expediente/caso) · DocuSign (confianza
  documental, trazabilidad) · Notion (organización clara de información) · Mercury/Revolut
  (claridad financiera, cifras tabulares, anillo/progreso de dinero).
- Ronda 1 (sin combinar): Blindaje Directo (Brutalista suave) · Cuenta Clara (Fintech de
  bolsillo) · Expediente Editorial (Papel y tinta).
- Ronda 2: Cuidado Documentado (Clínica humana) · Estudio de Caso (Nocturna de estudio) ·
  Bitácora Familiar (Editorial cálida).
- Ronda 3 (elegida): combinación explícita de "Estudio de Caso" (halo + anillo, banco 54 dir.6)
  y "Bitácora Familiar" (marcador subrayado, banco 54 dir.1), recoloreada en azul de confianza.
- Combinación tipográfica: Spectral (serif, display) + IBM Plex Sans (body) — par de contraste
  por clase, validado en las 3 rondas sin fallback-trampa tras corregir el bug de carga (ver abajo).
- Arquetipo: Sabio/Cuidador (educación + protección) · Mundo del sujeto: expediente judicial,
  comprobante de pago, cuenta corriente familiar, sello/firma de fecha.
- Dirección del banco 54 usada para el DISPOSITIVO OWNABLE: fusión de "halo cálido" (dir.6,
  Nocturna de estudio) recoloreado en azul + "subrayado marcador" (dir.1, Editorial cálida).
  Líder de origen de la paleta: azul de confianza derivado (no de un líder único — paleta
  compuesta específicamente para esta ronda de combinación).

## Personalidad compilada (11-DISENO-EMOCIONAL.md)
- 3 adjetivos de personalidad: **Sereno** (dominante), Sobrio, Cálido.
- Compilación: spring bounce ~0.08 / stiffness ~220 · duración base 340ms ·
  exclamaciones máx 0/pantalla · celebración N1: check suave y banner calmado (sin confetti) ·
  N2: anillo que se completa con luz suave · N3: sello de fecha/firma, sin fanfarria ·
  radio tendencial 14px · color emocional: neutros dominan, acento azul solo en el dato del
  hito y en el halo · arquetipo de voz: **mentor sereno**.

## Brand kit final (Opción B ronda 3 — "Revisión en Confianza")
- Fondo: #0B1524 · Superficie: #13233A · Texto 1º/2º: #E6EDF7 / #7F93B3
- Acento: #5B93E8 (SOLO en: CTA, dato destacado, anillo de progreso, halo, botón activo de tab)
- 2ª nota: N/A por ahora — se define si hace falta en pantallas de estado (éxito/controversia)
- Semánticos: éxito #5B93E8 (mismo azul, se usa el ícono de check para distinguir de "info") ·
  error #E85B6B (a confirmar en Sesión 5 con casos reales de controversia) · aviso #E8B95B
  - ⚠️ CONFIRMADO 2026-09-10: durante el rescate visual se descubrió que los 3 semánticos nunca se
    habían tematizado en `tokens.css` — eran los de fábrica de Tailwind (`#4ade80`/`#fbbf24`/
    `#f87171`), o sea la "paleta por default" que el SO marca como huella de diseño genérico, y
    además contradecían esta ficha. Ya usan los hex de arriba.
  - Se propuso un verde sereno (#63b58f) para "éxito", argumentando que el acento de marca debe
    reservarse al CTA y al dato clave (60-30-10). **El usuario decidió MANTENER el contrato**: el
    azul con ícono de check. Queda registrado para no volver a re-abrirlo.
- Display: Spectral (pesos 400/700) · Body: IBM Plex Sans (pesos 400-700) ·
  Escala: display 25-42px / title 19-21px / body 13-15px / label 10-12px
- Radio: card 14px / botón 10px · Profundidad: hairline degradada + sombra tintada suave
  (cero dureza — coherente con "Sereno") · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: halo azul radial detrás del elemento héroe (anillo/dato/masthead) +
  subrayado marcador en la palabra clave del titular (receta: banco 54, dir.1 y dir.6, fusionadas)
- Motion signature: ease-out suave, ~340ms base, sin springs agresivos (coherente con "Sereno")

## Trazabilidad y vetos
- Ruta de diseño (PREGUNTA DE REFERENCIA del 54): propuesta propia (sin referencia del usuario).
- Protocolo A/B/C: 3 rondas ejecutadas.
  - Ronda 1: `docs/revisiones/direcciones-abc.html` — Blindaje Directo / Cuenta Clara / Expediente Editorial.
  - Ronda 2: `docs/revisiones/direcciones-abc-ronda2.html` — Cuidado Documentado / Estudio de Caso / Bitácora Familiar.
  - Ronda 3 (elegida): `docs/revisiones/direcciones-abc-ronda3.html` — Confianza Nocturna / **Revisión en Confianza (elegida)** / Bitácora en Azul.
  - Descartadas: las 8 opciones restantes (definían composición hero+cards / timeline editorial /
    paleta cálida — ver cada archivo para el detalle de cada una).
- Tour de la app: `vista-previa-app.html` (raíz) y `docs/revisiones/vista-previa-app.html` ·
  vistas incluidas: principal/M0 (expediente + anillo), onboarding (pregunta), paywall
  (anual/mensual con trial), mecanismo (subir comprobante) · **aprobado por el usuario: SÍ —
  2026-09-07** ("me encanta sigamos con este estilo").
- Paleta derivada de: composición propia (fusión de dos direcciones del banco 54, recoloreada
  en azul de confianza — no clon de un único líder) · Dispositivo ownable elegido: halo azul + marcador.
- Registro anti-repetición: paleta azul #5B93E8 + par Spectral/IBM Plex Sans + dispositivo
  halo+marcador → VETADOS para el próximo proyecto construido con este SO.
- Modo (claro/oscuro) DERIVADO por: el usuario pidió explícitamente tonos que generen
  "confiabilidad y calma" en un contexto de revisión personal/nocturna — oscuro se deriva del
  momento de uso (Carlos revisa esto a solas, de noche) confirmado en el avatar.
- ⚠️ Bug real corregido durante esta sesión: la sintaxis de rango `wght@400..700` en la URL de
  Google Fonts solo es válida para fuentes VARIABLES — Spectral es estática y esa sintaxis hacía
  que Google Fonts descartara la familia completa en silencio (sin error visible), cayendo al
  fallback-trampa (monospace). Corregido a `wght@400;700`. Aplica también a cualquier fuente
  estática que se use más adelante (ej. EB Garamond, Atkinson Hyperlegible ya se habían escrito
  correctamente con punto y coma).

## Variante CLARA de la PÁGINA DE VENTAS (decisión del usuario, 2026-09-17 noche)
- Alcance inicial: SOLO la landing. ACTUALIZACIÓN 2026-09-18: el usuario aprobó la landing clara y pidió
  llevar el estilo AL INTERIOR DE LA APP con 4 capturas de referencia (docs/referencias/ref-1..4) →
  réplica fiel de Inicio aprobada → el interior (Inicio, Pagos, Calendario, Expediente, Asistencia,
  Ajustes) pasa a CLARO con tokens-app-claro.css (valores MEDIDOS en ref-1: bg #EDF0F7, tarjetas #FFF,
  chips #EBF1FD, azul #1A63DC, marino #0B2A57, verde #157A4F/#DFF5EA, morado #6C4AB6/#E9E2FB, radios
  18/14/999, Figtree + Nunito Sans). ACTUALIZACIÓN 2026-09-18 (tarde): el usuario levantó la orden
  ("me equivoqué, cámbiala toda") → onboarding, paywall y /entrar pasan a CLARO con los tokens de la
  landing (app/(funnel)/layout.tsx envuelve las tres en .tema-claro). Ajustes del kit del funnel para
  claro: <Marcador> = palabra en --accent-ink sin subrayado (--marcador-color), <Halo> al 12%
  (--halo-alpha), blobs detrás del check de los reconocimientos y del H1 del precio. TODA la app es
  clara; el tema oscuro de tokens.css queda solo como fallback de las páginas legales/admin. Pendiente de marca: el isotipo actual es gris metálico (se ve apagado sobre claro);
  la referencia lleva un logo azul — decisión del usuario si se rediseña.
- Referencia PARCIAL del usuario: capturas de 2houses.com/es, niddoapp.com/es y ourfamilywizard.com →
  fondo claro, fotos reales de familias, capturas de la app flotando, azul Coparentia en sectores,
  mensaje "gastos controlados + mente en calma", tono empático.
- Protocolo A/B/C (referencia parcial → 3 interpretaciones fieles): `direcciones-abc.html` (raíz) —
  A Calma editorial (Spectral+Plex, marfil, collage) · B Cercana y directa (Sora+Manrope, blanco +
  bloques marino) · **C Cuidado en calma (ELEGIDA por el usuario: "vamos con la C")**.
  Captura verificada: docs/revisiones/direcciones-abc-landing.png (fuentes clase por clase OK).
- Tokens de la variante C (landing) — FUENTE DE VERDAD: components/landing/tokens-claro.css:
  --bg #F3F7FC · --surface #FFFFFF · --surface-2 #E7EEF8 · --text-primary #14233A ·
  --text-secondary #4B5C78 (6.9:1 sobre blanco) · --text-tertiary #5B6D88 (4.9:1 sobre --bg, 4.5:1 sobre --surface-2) ·
  --accent #2F6FDC (4.7:1 sobre blanco, 4.5:1 sobre --bg) · --accent-2 #5B93E8 (solo degradés/halos:
  mide 2.9:1 sobre blanco, NO sirve para texto ni botones) · --accent-deep #2757A8 ·
  radios 22px tarjetas / 999px botones y píldoras · display Figtree 700-800 · body Nunito Sans 400-700.
  Nota: la comparativa A/B/C usaba #3F7FE6 y #5A6B85; al construir se oscurecieron porque #3F7FE6
  medía 3.9:1 sobre blanco (fallaba AA en botones y palabra clave) — revisor clara r1.
- Dispositivo ownable de la landing: FORMAS ORGÁNICAS (blobs `border-radius: 58% 42% 55% 45% / 48% 60%
  40% 52%`) en degradé azul que enmarcan las fotos; burbuja de dato con cola; todo curvo.
- Fotos: marcadores honestos hasta elegir con el usuario fotos con licencia (Unsplash/Pexels).
  PROHIBIDO reutilizar las fotos de las apps de referencia.
- Continuidad de marca entre landing clara y app oscura: mismo logo, misma familia de azul
  (#2F6FDC es el #5B93E8 de la app oscurecido para pasar AA sobre claro).

## Idioma UI: Español (LATAM, neutro) · Fecha de cierre de la ficha: 2026-09-07 · Aprobada por el usuario: SÍ
