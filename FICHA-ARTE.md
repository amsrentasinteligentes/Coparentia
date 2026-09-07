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

## Idioma UI: Español (LATAM, neutro) · Fecha de cierre de la ficha: 2026-09-07 · Aprobada por el usuario: SÍ
