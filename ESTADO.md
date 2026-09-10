# ESTADO.md — Coparentia (nombre provisional: PensiónClara)

### Checkpoint (2026-09-10) — ANTHROPIC_API_KEY rotada (clave vieja quedó en el log de una sesión)
Al listar `.env.local` en el chat, el valor de `ANTHROPIC_API_KEY` (terminaba en `9QAA`) quedó
impreso en el registro de la conversación. Rotación completa hecha por el usuario:
- Clave nueva generada en console.anthropic.com (termina en `nQAA`).
- Reemplazada en `.env.local` (verificado: 1 línea, `sk-ant-`, sin comillas, 108 chars) y en
  Vercel → Environment Variables (Production, "Updated just now") + Redeploy a Production → Ready.
- Prueba real en producción: el lector de recibos leyó el monto con la clave nueva. ✅
- Clave vieja (`…9QAA`) **eliminada** en console.anthropic.com → API Keys.
Lección: nunca volcar `.env*` completo a stdout — usar un chequeo que solo reporte forma/prefijo.

### Checkpoint (2026-09-10) — "Consultar acuerdo" en Expediente (feature nueva, aprobada por el usuario)
Caja para guardar el documento base que fija la cuota (acta de conciliación o sentencia), en la
pantalla de Expediente, entre "Reporte en 1 clic" y "Autorizaciones y controversias".
- **Datos** (`lib/datos.ts`): `Titulo` gana `acuerdoPath` / `acuerdoNombre`; `obtenerTitulo` los
  mapea; `subirArchivoPrivado` acepta carpeta `'acuerdo'`; nuevas `guardarAcuerdo(archivo)` (sube
  a `{userId}/acuerdo/`, actualiza la fila del título, borra el archivo viejo al reemplazar) y
  `quitarAcuerdo()`. `guardarTitulo` NO toca esas columnas (upsert parcial) → editar la cuota en
  Ajustes conserva el acuerdo.
- **UI** (`components/app/AcuerdoCuota.tsx` NUEVO): 4 estados (cargando/error/sin guardar/guardado).
  Foto o PDF hasta 15 MB (`validarArchivoAdjunto`), vista previa antes de guardar, "Consultar"
  abre foto en el visor propio / PDF en pestaña nueva, "Reemplazar" y "Quitar" (confirmación en
  2 pasos). Reusa `Portal`+`VisorImagen`+`VistaPreviaArchivo`.
- **Migración** `supabase/acuerdo-titulo.sql` (NUEVO) — 2 `alter table` sobre `titulos`.
  ✅ **CORRIDA por el usuario en Supabase (2026-09-10)** — "Success. No rows returned". Las
  columnas `acuerdo_path` / `acuerdo_nombre` existen; "Consultar acuerdo" queda operativo.
- Pantalla secundaria → medición + checklist (sin ronda de revisor-visual). `tsc` ✓ · `build` ✓ ·
  render 375px en `docs/revisiones/acuerdo-expediente-375.png` (estado "sin guardar").
- Eventos nuevos en `event_log`: `acuerdo_guardado`, `acuerdo_eliminado`.
- Desvío `NEXT_PUBLIC_SCREENSHOT_DEMO` usado y revertido por completo (grep limpio).

### Checkpoint (2026-09-10) — Copy sin la palabra "ex" (app amigable con ambos padres)
Pedido del usuario: quitar "ex" (expareja) de TODO el texto visible, aquí y donde aparezca.
Tabla aprobada y APLICADA (6 puntos + 2 comentarios de código):
- `app/layout.tsx` metadata description: "…sin depender de que nadie más la use."
- `app/page.tsx` FAQ: "¿La otra persona tiene que descargar la app también?" / "…la use alguien más o no."
- `app/(app)/calendario/page.tsx` subtítulo (l.85) + comentario (l.4): "…no depende de nadie más".
- `app/onboarding/page.tsx`: chip "Tengo disputas frecuentes por la cuota" (l.284) + la comparación
  `mostrarRefuerzoUnilateral` (l.484) al mismo string nuevo + refuerzo "No necesitas que nadie más
  use la app… lo use alguien o no" (l.510) + comentario (l.247).
Verificado: `tsc` ✓ · `build` ✓ (18 rutas) · `grep -i` sin "ex" de expareja restante (solo "expediente").
Falta: recapturar previsualización (landing FAQ + calendario + onboarding chip) y commit.
Landing sigue LISTA (37/40) — su árbol de copy no cambió salvo un texto de FAQ ya contemplado.
Onboarding/Inicio mantienen techo estructural documentado abajo. Tarjeta AbogadoDestacado ya
montada al final de Expediente. Próxima decisión abierta del usuario: conectar Hotmart vs. seguir
con ajustes internos.

### Checkpoint (2026-09-10) — LANDING (página de ventas): ✅ **LISTA / PASA EL GATE**
Primera de las 4 pantallas del dinero en aprobar el gate del revisor-visual.
`docs/revisiones/landing-veredicto.md`: **Usabilidad 36/40 · Craft 17/20 · Copy 18/20 · LISTA.**
El único defecto accionable del veredicto anterior (34/40) era la card de precio con 4 encuadres
distintos. Corregido:
- Todos los precios de la landing llevan "US$" (título de sección, stack, ambas cards, FAQ):
  FICHA-MERCADO dice que Hotmart cobra en USD; un comprador colombiano leía "$89" como pesos.
- Referencia en pesos del cargo anual con la TRM oficial (`obtenerTRM`): "≈ $275.900 COP al año".
  Fallback a null si la fuente falla → nunca un número en pesos inventado.
- Card anual: 4 renglones de dinero al mismo nivel → jerarquía de 3: display US$7.42/mes, línea
  semibold "Se cobra US$89 al año", contexto en tertiary (cuándo se cobra + COP), acento
  "3 meses gratis".
- Card mensual: repetía 4 de 5 bullets del anual → ahora solo el diferenciador.
Defectos de pulido NO bloqueantes que dejó el revisor (para otra pasada si se retoca): jerarquía
aún afinable en la card anual · formato "$ 450.000" con espacio en el mock del hero · triple
formulación del ahorro (badge + "3 meses gratis" + stack tachado).

### Checkpoint (2026-09-09) — Rescate visual: FASE 1+2 (diagnóstico) hecha, plan ESPERANDO OK
Pedido del usuario: subir diseño/experiencia a nivel estudio premium, por capas, sin tocar lógica
ni datos. FICHA-ARTE.md sigue siendo COSA JUZGADA (aprobada 2026-09-07, "me encanta sigamos con
este estilo") → NO se re-deriva paleta/tipografía/modo; el rescate es EJECUTAR el contrato que
hoy está a medio implementar.

**Craft que YA existe:** `whileTap` en 8 archivos (funnel/landing/inicio/paywall/admin) ·
`prefers-reduced-motion` en landing/funnel/onboarding/paywall/inicio · stagger y count-up en el
funnel · `<Halo>`/`<Marcador>` implementados en funnel/onboarding/inicio/paywall.

**Craft que FALTA (hallazgos raíz de esta fase):**
1. **El dispositivo ownable no existe en la app interna.** `<Halo>`/`<Marcador>` aparecen 0 veces
   en `components/app/ui.tsx`, pagos, calendario, expediente y ajustes — justo donde vive a diario
   el cliente que paga. (Coincide con veredicto pantalla-principal defecto #3.)
2. **Jerarquía de texto INVERTIDA en los tokens.** `--text-secondary: #7f93b3` (5.1:1 sobre
   surface) es MÁS OSCURO que `--text-tertiary: #93a5c2` (6.4:1) — el texto "menos importante"
   se ve más brillante que el "más importante", en TODA la app. Bug de raíz, no de pantalla.
3. **Los colores semánticos son Tailwind de fábrica y contradicen la ficha.** tokens.css tiene
   `#4ade80 / #fbbf24 / #f87171` (green-400/amber-400/red-400 stock) cuando FICHA-ARTE aprobó
   aviso `#E8B95B` y error `#E85B6B`. Usados en 15 lugares reales (pagos, calendario, ajustes,
   admin). Es literalmente la "paleta por default" que el SO marca como huella de diseño genérico.
4. **Vacío muerto estructural CONFIRMADO en vivo** (screenshot a 375px del paywall paso 1): ~31%
   de la pantalla es fondo plano vacío entre la última tarjeta y el CTA. Mismo defecto que el
   revisor marcó en onboarding (#1) y pantalla-principal (#4).
5. **La app interna no tiene las animaciones baseline del SO:** cero stagger de entrada, cero
   skeletons (solo 2 puntitos `animate-pulse`), `whileTap` solo en `<BotonFlotante>` (1 de ~20
   elementos tocables), nav sin transición real (solo `transition-colors`), y
   `components/app/ui.tsx` no usa `useReducedMotion`.
6. **Profundidad de 1 nivel, no de 3.** `--surface-2` (hundido) nunca se usa en la app interna y
   `--shadow-1: 0 1px 2px` es casi invisible → `<Tarjeta>` se lee plana sobre fondo plano.

**Puntajes vigentes del revisor (gate: ≥36/40 y ≥16/20):** landing **37/40·17/20·copy 18/20 →
✅ LISTA (2026-09-10)** · onboarding 30/40·**16/20** (craft PASA; usabilidad NO — techo estructural
CONFIRMADO, ver Problemas conocidos) · paywall 33/40·15/20·copy 16/20 (NO LISTA, ver Problemas
conocidos) · pantalla-principal 28/40·16/20 (craft pasa, usabilidad NO — ver Problemas conocidos).

**CAPA 0 (tokens) y CAPA 1 (kit de la app interna): APLICADAS Y VERIFICADAS** (usuario eligió
"Capa 0 + 1 primero"). `tsc` ✓ · `build` ✓ · vistas renderizadas a 375px en el preview real.

CAPA 0 — `components/landing/tokens.css`:
- `--text-secondary` #7f93b3 → **#a8bad6** (8.1:1 sobre surface) · `--text-tertiary` #93a5c2 →
  **#7f93b3** (5.1:1) → escalera primary > secondary > tertiary restaurada, ambos siguen AA.
- Semánticos, que eran Tailwind de fábrica: success #4ade80 → **#63b58f** · warning #fbbf24 →
  **#e8b95b** (ficha) · error #f87171 → **#e85b6b** (ficha).
- `--shadow-1` gana 2ª capa `0 4px 12px -6px rgb(6 12 24/.5)` (antes casi invisible → tarjetas planas).
- Nuevos `--ease-sereno: cubic-bezier(.22,.61,.36,1)` y `--dur-base: 340ms` (motion signature).

CAPA 1 — `components/app/ui.tsx`:
- `<Halo>` NUEVO (radial 320×200px al 26%, blur 28px) y `<Marcador>` NUEVO (corte 62%, acento 34%)
  → el dispositivo ownable por fin existe en el kit de la app interna. **Aún NO cableado en las
  pantallas: eso es Capa 2.**
- `<PageHeader>` acepta `palabraClave` (marcador) y `halo` — ambos opcionales, nada cambia solo.
- `<Tarjeta>` ahora entra con opacidad+8px de subida, 340ms, ease sereno, `indice` para escalonado
  de 50ms; respeta `useReducedMotion`.
- `<BottomNav>`: píldora activa que se DESLIZA (`layoutId`, spring 220/26) en vez de solo cambiar color.
- `<TarjetaSkeleton>` NUEVO (silueta real de la tarjeta, pulso 1.6s) — la app no tenía skeletons.

⚠️ Verificación visual hecha con el desvío temporal `NEXT_PUBLIC_SCREENSHOT_DEMO` (gate de sesión
+ datos semilla en obtenerPagos). **REVERTIDO por completo y verificado con grep**: `git status`
solo muestra tokens.css, ui.tsx y ESTADO.md. Nunca se comiteó ni llegó a `.env.example`.

### Rondas 3 y 4 de Inicio (2026-09-10) — estancado en 28/40; craft 16 → 15 → 14
⚠️ **PATRÓN A TENER EN CUENTA ANTES DE GASTAR OTRA RONDA AQUÍ:** el puntaje de Inicio lleva TRES
rondas clavado en 28/40. Cada ronda arregla defectos reales y verificados —incluidos dos bugs que
habrían llegado a clientes— pero el revisor encuentra siempre una capa nueva al mirar más hondo, y
el craft bajó por regresiones introducidas al arreglar lo anterior. El propio revisor confirma que
lo que falta es alcanzable con ediciones locales (nada depende de backend ni de servicios
externos), pero **el rendimiento por ronda está decreciendo**. Recomendación registrada: pasar a la
landing (34/40, la más cerca del gate de toda la app) y volver a Inicio con ojos frescos.

**Bug REAL y grave corregido (regresión propia, invisible al compilar):** al agregar la luz
ambiental, `ContenedorApp` pasó a llevar `relative isolate`. `isolate` crea un CONTEXTO DE
APILAMIENTO, y dentro de él los z-index solo compiten entre hermanos — no contra el resto de la
página. El modal de registro (z-30), el visor (z-40) y el Sello (z-40) quedaron atrapados y se
pintaban DEBAJO del nav (z-20, que vive fuera en el layout): **el nav tapaba "Guardar registro", la
acción primaria de todo el flujo de registro.** Subir el z-index NO lo arregla. Solución: nuevo
`components/app/Portal.tsx`, que monta modal/visor/sello directo en `<body>`.
→ Lección: cualquier `isolate`/`transform`/`filter` en un contenedor atrapa a sus hijos flotantes.

**Lección de método:** la primera verificación de ese fix dio un FALSO POSITIVO porque medía
superposición geométrica en vez de qué elemento queda encima (una hoja modal se superpone al nav a
propósito). La medición correcta es `document.elementFromPoint()` en el centro del elemento.

También corregido: la prop `conBotonFlotante` había quedado en la rama de ERROR de Inicio (que ni
tiene botón) en vez del Dashboard · el botón "Guardar registro" estaba muerto al 40% sin decir cuál
de los tres campos faltaba · `.catch` en el modal de Pagos (el mismo bug ya corregido en primeros
pasos seguía vivo en la puerta principal) · fallo mudo al abrir un comprobante · error de borrado
que se pintaba fuera de pantalla · dos estados vacíos que no enseñaban · doble toque para registrar
desde Inicio.

Defectos abiertos de Inicio: el escalonado de entrada no es cascada real (la lista reinicia el
índice en 0) · la flecha de Ajustes vuelve siempre a `/expediente` aunque se entre desde Inicio ·
el vacío de "Últimos movimientos" explica pero no ofrece salida (sin CTA).

### Ronda posterior (2026-09-10) — Inicio 28/40 · **craft 16/20, YA PASA el gate**
El PDF del expediente se rehízo por completo (ver commit "el PDF del expediente ahora lleva las
pruebas adentro"): antes listaba los pagos con el NOMBRE del archivo entre paréntesis pero no
incluía los comprobantes — un documento que le pedía al abogado confiar en que existía una foto
llamada así. Ahora lleva resumen, historial con referencia cruzada al anexo, y una página por
comprobante con la foto real incrustada. Verificado con Playwright: descarga real de 3 páginas con
2 imágenes, 54 KB, sin errores.

También: estado del mes ("¿voy al día?") con `<Pildora>`, `metaMeses` derivado de la vigencia real
del título (era un 6 escrito a mano), hairline degradada de FICHA-ARTE (prop `destacada`, solo en
las 2 protagonistas), aviso de SIN CONEXIÓN en el shell, y **`eliminarPago`**: no existía forma de
borrar un registro — una foto equivocada quedaba para siempre en el expediente que se lleva al
juzgado y ahora además se incrusta en el PDF del abogado.

⚠️ **DECISIÓN PENDIENTE DEL USUARIO — color de "éxito"**: FICHA-ARTE (cosa juzgada) declara
`éxito #5B93E8` ("mismo azul, se usa el ícono de check para distinguir de info"). Al corregir los
semánticos de Tailwind se puso un verde sereno `#63b58f`, y el revisor lo marcó como desvío del
contrato. Hay tensión real: usar el acento de marca para "éxito" choca con su rol (CTA/dato clave,
regla 60-30-10) y con la regla 15 del SO (escala semántica verde/ámbar/rojo). **No se resuelve solo:
la ficha solo la puede enmendar el usuario.**

✅ **RESUELTO — ver la foto antes de guardarla.** El input registraba el comprobante en el MISMO
gesto de elegirlo: una foto borrosa o la del recibo equivocado entraba al expediente que se lleva a
un juzgado sin que nadie la viera, y ahora además se incrusta en el PDF del abogado. Nuevo
`<VistaPreviaArchivo>` (muestra la IMAGEN, no un ícono: el error típico es haber elegido LA FOTO
equivocada, y eso solo se detecta viéndola) + "Guardar" como acto aparte. Aplicado en primeros
pasos y en el formulario de Pagos. Verificado con Playwright: al entregar un archivo al input, el
registro NO se dispara solo. También `role="alert"` en `<ErrorDeCarga>` y `aria-busy`/`aria-live`
en el esqueleto.

Defectos abiertos de Inicio: la flecha de Ajustes siempre vuelve a `/expediente` aunque se haya
entrado desde Inicio; si no hay próximo evento la tarjeta desaparece sin decir nada; el escalonado
de entrada no es cascada real (la lista reinicia el índice en 0).

**CAPA 2 — INICIO (pantalla principal): craft 9/20 → 15/20; usabilidad 21 → 22/40.** Sigue NO
LISTA, pero por causas COMPLETAMENTE distintas a las del veredicto viejo: el flujo feliz quedó
resuelto y ahora el peso está en los estados de fallo.

Aplicado: esqueleto de carga al abrir (devolvía `null` = pantalla en blanco) y mientras cargan los
datos (pintaba TODO en cero y saltaba, diciéndole a la persona que su expediente está vacío) ·
`<NumeroContado>` nuevo en el kit (baseline 2 del SO, ausente en toda la app interna) · tarjetas
escalonadas · estado vacío real en "Últimos movimientos" · `Link` en vez de `<a href>` (recargaba
la página entera en cada toque) · halo y `<Marcador>` de marca, que no existían en NINGUNA pantalla
interna.

**LAS 4 MEJORAS DE FLUIDEZ pedidas por el usuario (todas aplicadas):**
1. `app/(app)/template.tsx` NUEVO — transición entre secciones; antes el cambio era un corte seco.
2. `components/app/SelloConfianza.tsx` NUEVO — el mecanismo BAUTIZADO del producto era invisible
   dentro de la app (subir un comprobante solo agregaba una fila). Ahora se estampa con la fecha
   real, 1.6s, se va solo. Celebración N3 de la ficha: sin fanfarria.
3. Luz ambiental al 9% en `ContenedorApp` — el fondo era un color liso en las 4 secciones y
   "profundidad" fue el eje que el revisor bajó una y otra vez.
4. Pulso de celebración en el anillo, solo ante un hito NUEVO (comparado contra lo ya celebrado).

**Bugs REALES encontrados por el revisor y corregidos (no cosméticos):**
- `lib/datos.ts` ignoraba el `error` de Supabase y devolvía `[]`: ante un fallo de red o sesión
  vencida la app mostraba el expediente VACÍO, indistinguible de "no tienes nada guardado" — una
  mentira alarmante justo para quien teme perder sus pruebas. Ahora se propaga y hay
  `<ErrorDeCarga>` con reintento en Inicio, Pagos y Calendario.
- Inicio sin `.catch`: el esqueleto podía pulsar PARA SIEMPRE.
- Primeros pasos era el ÚNICO formulario de subida sin validar el archivo ni atrapar el fallo: en
  la primera victoria, 20 MB o un .docx dejaban el sello girando sin fin.
- (Propios) celebración falsa en navegador nuevo con datos viejos; CTA cortado tras el nav fijo.

✅ **RESUELTO — edición de la cuota** (el usuario eligió construirla, no bajar la promesa): nuevo
`<EditorCuota>` en `/ajustes`, que guarda con `guardarTitulo` (la MISMA función del alta, así no
hay dos caminos que se desincronicen), con esqueleto, error con reintento, validación de rango y un
botón que solo se habilita si de verdad hay cambios. La `fechaInicio` del título NO se toca al
editar: es cuándo empezó la obligación, no cuándo se corrigió el dato. Además la cuota en Inicio es
ahora un enlace a Ajustes — sin ese atajo la edición quedaba escondida tras el engranaje de
Expediente, donde nadie la buscaría.

⚠️ **Pendientes de Inicio (para retomar):** `metaMeses`
= 6 está inventado en código, sin rótulo ni relación con el caso · falta píldora de estado del mes
("¿voy al día?") · el escalonado no es cascada real (la lista reinicia el índice en 0) · el halo del
header queda anulado por la luz ambiental (el dispositivo que se lee es el marcador) · FICHA-ARTE
declara "hairline degradada" y `Tarjeta` usa borde sólido · `--surface-2` sigue sin usarse.

**CAPA 2 — PAYWALL: 6 rondas de revisor. 28/40·14/20 → 33/40 · 15/20 · copy 16/20 (copy YA
PASA el gate; usabilidad y craft aún no: faltan 3 y 1 punto).** Sigue NO LISTA formalmente.
El revisor confirmó que NO hay techo estructural y recomendó explícitamente PARAR aquí y pasar a
Inicio (21/40, "sangrado diario", ~15 puntos fáciles), dejando el resto del paywall para después.

Cambios estructurales y de honestidad (además de lo listado más abajo):
- **De 3 pasos a 2**: recap y timeline fusionados en `<ValorYPrueba>`; el vacío del paso 1 bajó de
  ~39% a ~10%. Decisión de producto aprobada por el usuario.
- **Moneda explícita en TODOS los precios** (`US$`): FICHA-MERCADO declara cobro en USD, pero se
  mostraba "$89" a secas — para un cliente colombiano eso puede leerse como pesos.
- Ambos planes muestran su total anual, así el ahorro de US$30.88 es comprobable.
- Garantía recuperó su nombre y ganó mecánica de reclamo; pasarela (Hotmart) nombrada.
- **2 bugs reales introducidos en rondas previas de esta sesión y corregidos**: el CTA quedaba
  "Abriendo…" deshabilitado para siempre si fallaba la navegación; y su temporizador no se
  cancelaba, pudiendo mostrar un error FALSO mientras la navegación seguía en curso.
- Accesibilidad: `radiogroup`/`aria-checked` en el selector de plan (sin eso un lector de pantalla
  no anunciaba ningún plan elegido) y foco de teclado visible en el CTA.

⚠️ **PENDIENTE QUE REQUIERE DECISIÓN DEL USUARIO**: FICHA-MERCADO §6 pide comunicar los precios
"también en referencia COP". NO se implementó a propósito: hardcodear una tasa de cambio la
convierte en un número obsoleto (y falso) con el tiempo. El revisor lo marca como freno de compra
real. Opciones: poner "≈ $X COP (aprox.)" con la tasa que el usuario decida y revisarla cada tanto,
o dejar solo USD. **Requiere que el usuario diga qué tasa/enfoque quiere.**

Defectos abiertos del paywall (para retomar después de Inicio): densidad del tercio inferior del
paso 2 (6 bloques de 11-14px seguidos); el paso 2 no escalona su entrada como el paso 1; el
radiogroup no navega con flechas; el aviso de fallo usa `role="status"` en vez de `role="alert"`.

**(Historial de la primera parte de Capa 2 — paywall):** Puntajes del revisor independiente: partía de 28/40·14/20;
ronda 1 → 24/40·12/20 (el revisor miró más hondo y encontró defectos nuevos, no es que empeorara
la pantalla); ronda 2 → **28/40 · 13/20 · copy 16/20 · sigue NO LISTA** (gate 36/16).

Arreglado y CONFIRMADO EN CÓDIGO por el revisor:
- Badge del plan anual ya no queda montado sobre el borde (vive dentro de la tarjeta).
- Pie reordenado en 3 grupos con separación ≥8px (antes 4 líneas apiladas a 4px).
- **Bug real del halo**: `radial-gradient(220px 140px …)` define RADIOS → elipse de 440×280 dentro
  de una caja de ~190px → se recortaba y dejaba un RECTÁNGULO con borde duro. Corregido sin radios
  explícitos en los 3 sitios: `components/funnel/ui.tsx` (alimenta TODO el onboarding),
  `components/app/ui.tsx` y el paywall, que ahora reusa el `<Halo>` del kit en vez de 3 copias.
- **"MÁS POPULAR" era prueba social FABRICADA** (cero clientes) → "Ahorras 3 meses · $30.88 al año",
  dato verificable ($9.99×12 = $119.88 − $89 = $30.88).
- **Personalización falsa**: `nRespuestas` caía a 5 sin respuestas → ahora cae a 0 y el subtítulo
  cambia a un texto honesto.
- Paso 2: tenía el único titular sin halo, cero movimiento y el cobro "$89/año" fijo aunque el plan
  elegido fuera Mensual. Ahora halo + nodos escalonados + línea que se dibuja + cobro derivado.
- La "pregunta" del paso 2 que nadie podía responder → reescrita como afirmación (regla 11 del SO).
- CTA: `focus-visible` de alto contraste (el anillo global era acento sobre botón acento, invisible)
  y bloqueo de doble tap con estado "Abriendo…".

⚠️ **Lo que impide llegar a 36/40 es ESTRUCTURAL, no de estilo**: los pasos 1 y 2 tienen ~39% de
fondo vacío porque su contenido real son 3 líneas. Centrarlo repartió el aire, no lo llenó. El
revisor propone FUSIONAR recap+timeline en una sola vista o llenarlas con valor real (mini-demo del
Sello, la respuesta del onboarding, el ancla de costo). **Eso cambia la estructura del funnel de
venta → decisión del usuario, no se hace por cuenta propia.**

Pendiente menor registrado: conteo animado del $7.42; ancla "$0.33/día vs $100 por correo del
abogado" (objeción 4 de FICHA-AVATAR); hairlines degradé que FICHA-ARTE declara y no existen;
radios 10px vs 14px entre tarjetas de plan y de recap.

⏸️ **Resto de CAPA 2 — NO iniciado.** Orden acordado:
paywall (28/40) → inicio (21/40) → app interna (pagos/calendario/expediente) → onboarding (30/40)
→ landing (34/40, solo la card de precio). La ronda formal de `revisor-visual` corresponde a
Capa 2, cuando las pantallas cambien de verdad.

### Checkpoint (2026-09-09) — Segunda auditoría de seguridad (formato guiado del usuario), Etapa 2 aplicada
Auditoría pedida por el usuario con reglas propias (no tocar el flujo de enlace mágico, no
mostrar secretos, explicar en simple, no inventar). Etapa 1 (solo lectura) reportada y aprobada;
el usuario pidió aplicar TODO lo posible de 🟠 Importante y 🟡 Recomendado por mi cuenta.

**Aplicado y verificado (`tsc` ✓, `build` ✓, `npm audit` → 0 vulnerabilidades):**
1. 🟠 El bucket de Storage `comprobantes` no tenía tope de tamaño ni de tipo de archivo — cualquier
   cuenta podía subir cualquier archivo de cualquier peso a su propia carpeta. Creado
   `supabase/fix-limites-storage.sql` (15 MB, solo imagen/PDF) — **pendiente de que el usuario lo
   corra en Supabase → SQL Editor** (no lo pude ejecutar yo).
2. 🟠 Como acompañamiento (no reemplazo) de ese fix: agregado `validarArchivoAdjunto()` en
   `lib/datos.ts` y usado en los dos formularios de adjuntar archivo (`app/(app)/pagos/page.tsx`,
   `app/(app)/calendario/page.tsx`) — mismo tope, para que el usuario vea un mensaje claro al
   elegir el archivo en vez de un error de red genérico si Supabase lo rechaza en el servidor.
3. 🟡 Revisado: sin configuración de CORS personalizada en la app (nada que corregir). `npm audit`
   sin vulnerabilidades. Sin errores de servidor filtrando detalles internos al usuario.

**Evaluado y NO aplicado (con motivo):**
- 🟡 CSP con nonce: requeriría middleware nuevo generando nonce por request y tocar cómo cargan
  estilos/scripts — riesgo real de romper el login (Regla 1: "el flujo de enlace mágico no se
  toca") sin poder probarlo a fondo en esta sesión. Queda para una sesión dedicada solo a eso.
- 🟠 Límite de intentos del enlace mágico (rate limit): **no se puede arreglar con código** — vive
  en el panel de Supabase (Authentication → Rate Limits), no en el proyecto. Ver pendientes abajo.
- 🟡 Monitoreo de errores tipo Sentry: requiere que el usuario cree una cuenta externa primero: no
  se puede avanzar sin esa decisión/cuenta suya.
- 🔴 CRÍTICO (sin enforcement real de prueba/suscripción): depende por completo de conectar
  Hotmart (18-VENTA-HOTMART.md), que sigue pendiente — ver checkpoint más abajo.

⚠️ **Pendiente — solo el usuario puede hacerlo:**
- Correr `supabase/fix-limites-storage.sql` en el SQL Editor de Supabase (2 minutos).
- Entrar al panel de Supabase → Authentication → Rate Limits y confirmar que el límite de envíos
  de enlace mágico por correo/IP esté activado (viene activado por defecto, pero solo el dueño de
  la cuenta lo puede ver/ajustar — yo no tengo acceso a ese panel).
- Decidir si se conecta Hotmart ahora — es el único arreglo real para que la prueba gratis/
  suscripción se controle de verdad en el servidor, no solo en la pantalla.

### Checkpoint (2026-09-09) — Auditoría legal completa (47-LEGAL-FISCAL-Y-PRIVACIDAD.md)
Pedido del usuario: dejar la capa legal completa, profesional y coherente con lo que la app hace
de verdad. Datos del responsable (dados por el usuario): **Alejandro Muñoz, persona natural,
opera desde Colombia**, contacto `soporte@coparentia.app`.

**Inventario real hecho ANTES de escribir nada** (código + ESTADO.md + FICHA-MERCADO.md):
la app hoy usa Anthropic (IA, solo para leer el monto de un recibo), Supabase (datos/auth/
archivos), Vercel (hosting), Resend (correo), Hotmart (pagos, aún no conectado con webhook) — sin
analytics ni cookies de terceros; vende en Colombia; trial 7 días, garantía 15 días (consistente
en landing/paywall/reembolsos); no recopila ningún dato de menores pese a que la Política de
Privacidad ANTERIOR decía que sí.

**🔴 Hallazgos CRÍTICOS corregidos:**
1. La Política de Privacidad afirmaba recoger "nombre y fecha de nacimiento" de los hijos del
   usuario — **falso**, ningún campo de la base de datos guarda eso. Corregido: ahora dice
   explícitamente que NO se recoge ningún dato de menores.
2. Ningún subprocesador estaba nombrado en ninguna página (violación directa del 47) —
   corregido: Supabase, Anthropic, Vercel, Resend y Hotmart, cada uno con su función real.
3. La transferencia internacional de datos a la IA (Anthropic, EE. UU.) no estaba declarada en
   ningún lado — corregida en Privacidad y en Aviso de IA.
4. El Aviso de IA prometía "sugerencia de categoría de gasto" y "detección de comprobantes
   duplicados" — funciones que **no existen**. Corregido para describir solo lo real: lectura
   automática del monto, nada más.
5. **No existía ninguna forma de que un usuario elimine su propia cuenta** — el derecho de
   eliminación de la Política de Privacidad era una promesa de correo sin implementación real.
   Construido: `app/(app)/ajustes/` (nueva pantalla, accesible desde el ícono ⚙ en Expediente) con
   `eliminarMiCuenta()` real — borra los archivos de Storage (fotos/PDF de comprobantes) y la
   cuenta de `auth.users` (las filas de datos se van solas por `on delete cascade`).
6. **No había página "Cómo cancelar" in-app** (obligatoria antes de vender suscripción, 47 §2) —
   construida dentro de la misma pantalla de Ajustes, con link directo al portal de Hotmart.
7. **El registro/login no tenía ningún checkbox de autorización** — la Ley 1581 de Colombia exige
   autorización previa EXPRESA en el punto de recolección. Agregado a `/entrar`: checkbox NO
   premarcado, botón deshabilitado hasta marcarlo, con link a Términos y Privacidad.
8. **El paywall no avisaba la renovación automática** antes del checkout (obligatorio, 47 §2) —
   corregido: "Se renueva automáticamente tras el día 7, cancela cuando quieras" junto al CTA
   final, además del detalle exacto de fecha/monto que ya existía en la pantalla del timeline.

**Verificado y CONFIRMADO SIN PROBLEMAS**: garantía de 15 días coherente en landing/paywall/
reembolsos (no hay discrepancia de ventana) · disclaimer de IA visible junto a la salida (badge
"Detectado automáticamente" + texto de ayuda en `/pagos`, ya construido en la sesión del lector de
recibos) · sin cookies de terceros/analytics (no hace falta banner de consentimiento) · límite de
responsabilidad presente en Términos · footer con los 4 enlaces legales, todos a páginas reales.

`tsc`/`build` limpios en cada archivo tocado. Pantallas nuevas (`/ajustes`) verificadas por
código + medición (secundaria, no una de las 4 del dinero — no requiere ronda de revisor-visual).

⚠️ **Pendiente — solo el usuario/un abogado puede resolverlo**:
- **Configurar en el panel de Hotmart la garantía del producto a 15 días exactos** cuando se
  conecte Hotmart — si la landing promete 15 y el panel tiene otro número configurado, es
  incumplimiento real, no solo un error de texto.
- **Activar `soporte@coparentia.app` de verdad** — hoy es una promesa (el dominio `coparentia.app`
  aún no se compra, decisión ya tomada por el usuario de esperar a más cerca del lanzamiento);
  hasta entonces, ese correo no recibe nada. No bloquea seguir construyendo, sí bloquea vender.
- **Validar con un abogado colombiano** la redacción final antes de la primera venta real — esta
  auditoría deja la app COMPLETA y COHERENTE con lo que hace, no reemplaza la firma de un
  profesional (mucho menos si el negocio crece o si algún día se maneja información más sensible).
- **RNBD (Registro Nacional de Bases de Datos)** — aplica según umbral de activos de la empresa;
  verificar con un contador cuando el negocio empiece a facturar en serio.

### Checkpoint (2026-09-09) — Panel de administración: rediseño con tooltips + métricas futuras
✅ **CONFIRMADO por el usuario en su celular real (2026-09-09)**: "me gusta así" — el rediseño del
panel (tooltips, reordenado por datos reales, "Métricas futuras" plegable) queda aprobado tal
cual, pese al puntaje del revisor por debajo del estado anterior (ver detalle abajo) — decisión
consciente de priorizar el pedido explícito del usuario sobre el criterio automático de densidad.

### Checkpoint (2026-09-09) — Panel de administración: rediseño con tooltips + métricas futuras
Pedido del usuario: "lo siento básico, agrega tooltips, mejora el diseño, y si crees que hace
falta más métricas para pensar a futuro, agrégalas aunque hoy no muestren resultados reales."

**Construido**:
- Tooltips reales (`components/admin/Tooltip.tsx`): ícono "i" junto a cada título, toque para
  abrir (no depende de hover, no existe en celular), explica la métrica en simple. Área de toque
  44×44px con un círculo visible más pequeño adentro (16px) para no competir con el ícono de la
  card.
- Reorganización en grupos con encabezado (`EncabezadoGrupo`): Personas (Usuarios, Uso de la
  app — datos reales) → Dinero (Ganancia real) → Sistema (IA, solo si hay datos) → Gestión (alta
  manual, cuentas). Personas va primero porque es lo único con datos reales desde ya.
- Bug real corregido de paso: `pago_agregado`/`evento_agregado` estaban en el diccionario de
  "Uso de la app" pero nunca se registraban — `lib/datos.ts` ahora anota también
  `autorizacion_agregada` y `titulo_guardado` en `event_log`.
- Buscador en "Todas las cuentas" (`app/admin/TablaUsuarios.tsx`, extraído a client component) —
  aparece solo con más de 5 cuentas (regla del SO: filtros desde 8-10 ítems).
- **`components/admin/MetricasFuturas.tsx`** (la pieza central de esta sesión): las 5 métricas
  que hoy no tienen NINGÚN dato real (Ventas, Negocio, Retención, Recorrido de bienvenida,
  Errores — y también Inteligencia artificial si `ai_calls` no existe) se agruparon en UN bloque
  plegable, colapsado por defecto, con contador ("N sin datos todavía"). Al abrirlo se ve la
  FORMA exacta de cada número futuro (grid de guiones "—" + qué lo activa) — es lo que el usuario
  pidió ("pensando a futuro, para visualizar mejor el seguimiento"), sin que compita por atención
  con lo que sí importa hoy. Alto de la pantalla en su estado normal (colapsado): 2517px, contra
  3383px con las mismas 5 métricas sueltas antes de este ajuste.

**Verificación visual — 6 rondas más de revisor-visual sobre este rediseño** (screenshot en
`docs/revisiones/admin-375.png`, veredicto en `docs/revisiones/admin-veredicto.md`):
28/40·14/20 (regresión real del rediseño inicial, con jerga cruda en pantalla y 6 cards vacías
del mismo peso que las reales) → 29/40·14/20 (labels sin jerga, botones a 44px, buscador
agregado — pero el problema de fondo, demasiadas cards vacías, seguía sin resolverse) → **con el
bloque plegable `MetricasFuturas`: 30/40·15/20**, con el propio revisor confirmando que la
estructura ya no genera "aire muerto" al entrar. Ajustes finales de esta misma ronda (reordenar
Personas antes de Dinero, atenuar "Cerrar sesión" frente a "Volver a la app", fondo circular en
el ícono de tooltip) no se volvieron a mandar a una 7ª ronda de revisor — verificados a ojo con
captura real, `tsc`/`build` limpios.

⚠️ **Honesto: no se recuperó el 37/40 · 14/20 del panel ANTES de este rediseño.** El propio
revisor lo señaló en su última pasada: agregar superficie de información (tooltips + 5-6
métricas nuevas, aunque colapsadas) tiene un costo real en la rúbrica de densidad/simplicidad
frente al estado anterior, que no tenía ninguna de esas dos cosas. Es una tensión real entre lo
que el usuario pidió explícitamente (más visibilidad a futuro) y lo que la rúbrica de usabilidad
premia (lo mínimo posible). Se prioriza el pedido explícito del usuario. Se cierra esta ronda de
pulido aquí — van 15 pasadas de revisor acumuladas sobre este mismo panel en esta sesión, mismo
patrón de rendimiento decreciente ya documentado para landing/onboarding/paywall.

### Checkpoint (2026-09-09) — Lector de recibos CONFIRMADO en producción por el usuario
Los 3 pasos de configuración (`supabase/ai.sql`, cuenta de Anthropic + `ANTHROPIC_API_KEY` en
`.env.local` y Vercel, tope de gasto sin recarga automática en la consola de Anthropic) quedaron
hechos por el usuario. Primera prueba real con una foto de recibo de apuestas/lotería: el monto
se leyó bien, pero la pantalla se quedaba congelada en "Leyendo el recibo…" sin terminar.

⚠️ **Bug real encontrado y corregido — foto de cámara sin comprimir colgaba la lectura**: las
fotos de cámara de celular pesan varios MB; sin comprimir, el viaje de ida y vuelta al servidor
(subir + que la IA la procese) tardaba demasiado o se cortaba a medio camino, dejando la pantalla
pegada sin ninguna salida. Corregido en dos capas (`lib/comprimir-imagen.ts` + `app/(app)/
pagos/page.tsx`): (1) la foto se comprime en el navegador (máx. 1200px de lado, calidad 80%) antes
de mandarla a leer — el archivo REAL que se guarda en el expediente sigue siendo la foto original
sin tocar; (2) un tope de 20 segundos: si nada responde a tiempo, el campo se libera solo para
escribir el monto a mano, en vez de quedar atascado para siempre.

⚠️ **Segundo hallazgo real del usuario, mismo día — la foto de un comprobante ya guardado no se
ajustaba a la pantalla al verla**: se abría cruda en una pestaña nueva del navegador, dependiendo
de su visor por defecto. Corregido con un visor propio (`components/app/VisorImagen.tsx`): la
foto SIEMPRE encaja completa en la pantalla al abrir, con el pellizco nativo para acercar donde
haga falta. Aplicado en Pagos y en el Calendario (mismo patrón de "ver documento adjunto" en los
dos lugares); un PDF sigue abriendo en pestaña nueva (el navegador ya trae su propio visor ahí).

✅ **CONFIRMADO por el usuario en su celular real, ambos fixes**: "se ve bien funciona el zoom" —
el lector automático de recibos y el visor de fotos ya funcionan de punta a punta en producción.

### Checkpoint (2026-09-09) — Lector automático de recibos (primera IA real de la app)
Pedido del usuario: que el monto del comprobante se lea solo de la foto, en vez de escribirlo a
mano. Aprobado explícitamente tras mostrarle el estimado de costo (~$0.002 USD/recibo, ~$2.500
COP/mes con 300 recibos). Construido siguiendo `30-INTEGRACION-IA.md`:

- **Síncrono, no un job** (es una extracción corta de segundos, no genera imagen/audio/video).
- **Salida forzada por esquema** (tool use de Anthropic + zod) — nunca se parsea texto libre a
  ciegas; si la IA no está segura (`confianza: 'baja'`), el campo se deja vacío para que la
  persona lo escriba, nunca se guarda un número dudoso sin que alguien lo vea primero.
- **El usuario SIEMPRE ve y puede corregir el monto** antes de guardar — la IA nunca escribe
  directo a la base de datos.
- `supabase/ai.sql` (NUEVO, falta correrlo — ver pendientes): tabla `ai_calls` (31-EVALS-
  OBSERVABILIDAD-OPERACION.md), RLS de solo-dueño-lee, kill-switch de gasto diario ($1 USD/día,
  muy por encima del uso esperado) ANTES de cada llamada.
- `lib/ocr-recibo.ts`: `leerMontoDeRecibo(archivo)` — Server Action, nunca lanza al llamador
  (cualquier fallo degrada a "no se pudo leer", la persona sigue pudiendo escribir a mano, como
  siempre pudo — degradación elegante). Modelo en `AI_MODEL` (default `claude-haiku-4-5`, el más
  barato para extracción, nunca hardcodeado sin default).
- `app/(app)/pagos/page.tsx`: al elegir la foto en "Nuevo registro", se lee el monto y se
  pre-llena con una insignia "Detectado automáticamente" (que desaparece si la persona corrige el
  número a mano — deja de ser "detectado", pasa a ser suyo). Solo con fotos, no con PDF (el
  modelo de visión no lee PDF directo).
- Panel de administración (`app/admin/page.tsx`, `lib/admin-datos.ts`): la sección "Inteligencia
  artificial" pasa de "Sin datos" a mostrar gasto real de hoy/mes, lecturas de hoy y fallas de hoy
  — automático en cuanto exista la tabla `ai_calls` (`obtenerResumenIA` devuelve `null` si la
  tabla no existe todavía, y la sección sigue en "Todavía sin conectar" hasta entonces).

Verificado: `tsc --noEmit` ✓ · `next build` ✓ (17 rutas) · estructura visual de la nueva UI en
`/pagos` revisada con bypass temporal local (ya retirado, `grep` confirma cero rastro) — pantalla
SECUNDARIA (no una de las 4 del dinero), así que basta esta medición + checklist, sin ronda
completa de revisor-visual. No se pudo probar la LECTURA real (necesita `ANTHROPIC_API_KEY`, que
el usuario todavía no ha configurado) — queda pendiente que el usuario confirme con una foto real
de un recibo suyo, en su celular, una vez conectada la clave.

⚠️ **PENDIENTE — el usuario debe hacer 3 cosas** antes de que esto funcione en producción:
1. Correr `supabase/ai.sql` en Supabase → SQL Editor → Run.
2. Crear una cuenta en [console.anthropic.com](https://console.anthropic.com), generar una API
   key y agregarla como `ANTHROPIC_API_KEY` en `.env.local` (nunca en el chat) — y también en
   Vercel → Settings → Environments → Production → Environment Variables cuando esté listo para
   publicar, igual que se hizo con `SUPABASE_SERVICE_ROLE_KEY`.
3. En la consola de Anthropic, activar un tope de gasto (spend cap) — la CAPA 0 del kill-switch
   de `30-INTEGRACION-IA.md`: el control en la base de datos es software propio y puede fallar
   junto con el código; el tope del proveedor es la red de seguridad final.

### Checkpoint (2026-09-09) — Auditoría de seguridad completa (27-REVISION-SEGURIDAD.md)
Pedido del usuario: explorar toda la app buscando vulnerabilidades/debilidades reales, no solo de
puntaje. Se corrió la rutina completa del archivo 27 (grep de fail-open, `npm audit`, revisión de
secretos/gitignore, inventario de RLS/Storage/rutas, las 5 checklists + mapa OWASP).

**THREAT MODEL LIGERO (4 preguntas)**:
1. Lo más valioso que protege la app: los comprobantes de pago y documentos privados de los
   usuarios (evidencia legal real) + el acceso de administrador sobre todos los usuarios.
2. Quién la atacaría: nadie con interés en un ataque sofisticado a esta escala — el riesgo real es
   un usuario curioso probando llamadas directas a la API, o un bot genérico buscando defaults
   inseguros comunes en apps Next.js+Supabase.
3. Peor caso si entran: alguien se auto-otorga el rol de administrador y ve/modifica datos de
   todos los usuarios, o alguien accede a comprobantes/documentos de otra persona.
4. Qué lo mitiga: RLS correcto en cada tabla y en Storage, privilegios de columna donde RLS no
   alcanza, gate de admin verificado en servidor, sin secretos en el cliente ni en git.

**🔴 CRÍTICO encontrado y CORREGIDO — autoescalada de privilegios a administrador**: la política
`profiles_update_propio` (RLS) dejaba que cualquier usuario actualizara SU PROPIA fila de
`profiles` — pero RLS controla FILAS, no COLUMNAS. Sin restricción de columna, cualquier persona
con una cuenta normal podía, con una llamada técnica directa a la base de datos (sin usar ninguna
pantalla de la app), marcarse a sí misma `role = 'admin'` y entrar al panel completo. Corregido en
`supabase/admin.sql` y en el parche nuevo `supabase/fix-privilegios-profiles.sql` (YA HAY QUE
CORRERLO — ver pendientes abajo): `revoke update on profiles from authenticated` + `grant update
(nombre) on profiles to authenticated` — un usuario normal solo puede tocar su nombre, nunca
`role`/`source`/`creado_manualmente`.

**🟡 MEDIO encontrado y CORREGIDO — open-redirect en el enlace mágico**: `app/auth/callback/
route.ts` tomaba el parámetro `next` de la URL sin validar y lo pegaba al dominio de la app para
redirigir — un valor como `@evil.com` puede hacer que el navegador interprete el dominio real
como "usuario" y navegue de verdad a `evil.com` (el truco clásico de la arroba en una URL). Hoy
nada en la app arma links con `next`, así que no era explotable en la práctica todavía, pero
quedaba ahí como una trampa lista para el futuro. Corregido: solo se acepta una ruta interna real
(`/algo`, nunca `//algo`, ninguna que contenga `://` o `@`).

**🟢 BAJO encontrado y CORREGIDO — sin encabezados de seguridad**: la app no mandaba ningún header
de seguridad (nada impedía, por ejemplo, que otro sitio la empotrara en un `<iframe>` para un
ataque de clickjacking). Agregados en `next.config.ts`: `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (bloquea cámara/
micrófono/ubicación, que esta app nunca pide). Un CSP estricto con nonce queda pendiente para
cuando haya scripts de terceros que lo justifiquen (hoy no hay ninguno).

**🟢 BAJO encontrado y CORREGIDO — faltaba `.env.example`**: creado, con los NOMBRES de las 3
variables reales del proyecto y ningún valor — así cualquiera puede levantar el proyecto sin
adivinar qué necesita, sin exponer nada.

**Revisado y CONFIRMADO SIN PROBLEMAS**: `npm audit` (0 vulnerabilidades) · `.env` nunca se
commiteó (`git log --all -- .env`) · lockfile commiteado · sin defaults inseguros (`env.X ||
'valor'`) · sin `dangerouslySetInnerHTML`/`eval` (sin superficie de XSS obvia) · sin `catch`
vacíos que escondan errores reales (los 3 que hay son de `sessionStorage`, ya documentados) · sin
CORS abierto · sin criptografía débil · Storage privado con RLS por carpeta de usuario, sin URLs
públicas · RLS activo y correcto en `titulos`/`pagos`/`autorizaciones`/`eventos` (cada quien solo
lee/toca lo suyo) · sin rastro de rutas de prueba/bypass/debug olvidadas en el código.

⚠️ **Aceptado, no corregido (documentado, no urgente)**: los archivos que se suben (fotos/PDF de
comprobantes) solo se validan por tipo en el navegador (`accept="image/*,application/pdf"`),
nunca en el servidor — un usuario técnico podría subir otro tipo de archivo a su PROPIA carpeta
privada. Riesgo bajo hoy (nadie más ve esos archivos salvo el dueño de la cuenta o tú como
administrador, y Supabase Storage ya pone un tope de tamaño por archivo a nivel de plataforma) —
se deja anotado para cuando haya presupuesto de sesión para validar tipo real (magic bytes) en el
servidor antes de guardar.
⚠️ **Aceptado, no corregido**: sin límite de intentos (rate limiting) propio en las acciones del
panel de administración más allá del límite de correos de Supabase Auth ya configurado — riesgo
bajo porque el panel completo ya exige ser tú, verificado en el servidor.

✅ **CONFIRMADO — parche crítico corrido por el usuario en producción**: `revoke update on
profiles from authenticated` + `grant update (nombre) ...` ejecutado con éxito en Supabase. El
hallazgo crítico de autoescalada a administrador queda cerrado.

### Checkpoint (2026-09-09) — Panel de administración v1 CONSTRUIDO, real y conectado
Usuario aprobó el plan presentado (ver checkpoint anterior) y pidió además la tabla de usuarios
extra. Construido de punta a punta, capa por capa, verificando `tsc`/`build` en cada una:

**Acceso (server-verified, no solo ocultar la ruta — IDOR evitado, 09/26)**:
- `supabase/admin.sql` (YA CORRIDO por el usuario en producción): tabla `profiles` (role/source/
  creado_manualmente, un trigger la llena sola al registrarse cualquier usuario — passwordless o
  alta manual) + tabla `event_log` (fuente real de "uso", 36-ANALITICA-Y-EVENTOS) + función
  `es_admin()` (security definer, evita recursión de RLS) + políticas: solo el dueño lee
  `profiles`/`event_log` completos, cada usuario solo lee/edita el suyo.
- El usuario ya se marcó como `role='admin'` con el UPDATE del propio archivo.
- `app/admin/layout.tsx`: gate real — revisa `profiles.role` EN EL SERVIDOR en cada carga; sin
  sesión → `/entrar`; con sesión pero sin el permiso → `/inicio` (sin pista de que `/admin` existe).
- `lib/supabase/admin.ts`: cliente con la `service_role` key — SOLO se usa server-side, SOLO para
  crear/borrar cuentas a mano. El usuario agregó `SUPABASE_SERVICE_ROLE_KEY` a `.env.local` (y
  falta agregarla igual en Vercel → Settings → Environment Variables cuando se despliegue esto).
- `RegistradorEventos` (`components/app/RegistradorEventos.tsx`), montado en el layout de la app
  normal: anota `sesion_iniciada` en `event_log` una vez por día real (deduplicado con
  localStorage) — es lo que alimenta "Usuarios activos"/"Uso" con datos reales desde ya.

**Secciones del panel (`app/admin/page.tsx`)**: avisos automáticos (hoy "✅ Todo en orden", sin
fuente real para una alerta todavía) · Ganancia real (Sin datos — activa con Hotmart) · Usuarios
(REAL: total/nuevos 7-30d/activos hoy) · Uso de la app (REAL: cuenta el `event_log`, con
etiquetas humanas) · "Todavía sin conectar" (Ventas/Negocio/IA/Errores agrupados, honesto) · alta
manual de usuario (formulario real) · tabla de todas las cuentas (con vista de tarjetas en
mobile, tabla en desktop, botón "Quitar" solo para altas manuales con confirmación).

**Alta manual** (`app/admin/acciones.ts`): crea la cuenta real vía `auth.admin.createUser`
(correo ya confirmado), marca `creado_manualmente=true`, deja rastro en `event_log`
(`usuario_agregado_manualmente`, con quién la creó) — la persona entra después con el enlace
mágico normal en `/entrar`. `quitarUsuarioManual` deshace SOLO altas manuales (nunca cuentas de
Hotmart/registro propio), con confirmación en dos pasos.

**Verificación visual — 9 rondas de revisor-visual** (screenshot real en
`docs/revisiones/admin-375.png`, veredictos en `docs/revisiones/admin-veredicto.md`, primera
pantalla de este tipo/plantilla → revisor obligatorio):
27/11 → 33/12 → 34/14 (bug real: `icon` como componente cruzando Server→Client, corregido) →
27/12 → 32/14 → 34/15 → 33/14 → 29/10 (2 defectos de esa ronda resultaron FALSOS al verificar
contra el código — el revisor evalúa un screenshot estático, que no puede mostrar si una
animación ocurrió; documentado y no perseguido) → **37/40 usabilidad · 14/20 craft** (última
ronda). Usabilidad CRUZA el umbral (≥36). Craft se queda en 14/20 (umbral 16) con techo
estructural explicado por el propio revisor: es un dashboard interno de un solo dueño con 7+
módulos igual de necesarios — comprimir a "1 objeto dominante" o forzar más animación
(tabs/celebraciones que no existen en este tipo de pantalla) rompería la función real de la
pantalla o la personalidad Sereno/Sobrio de la ficha. Mismo patrón que el techo ya documentado de
landing/onboarding/paywall (sesión 2026-09-08): rendimiento decreciente real tras 9 rondas
(~650k tokens de revisor), se cierra aquí con el resultado documentado, no se sigue persiguiendo.

Bugs reales encontrados y corregidos durante la construcción (no solo de puntaje):
1. Pasar un ícono de Lucide como prop de un Server Component a un Client Component crasheaba
   ("Only plain objects can be passed...") — se pasa ya renderizado (`<Icon .../>`), no la
   referencia al componente.
2. La tabla de "Todas las cuentas" causaba SCROLL HORIZONTAL DE TODA LA PÁGINA a 375px (`<table>`
   sin `table-layout:fixed` propagaba su ancho a los contenedores ancestros aunque estuviera en
   `overflow-x-auto`) — corregido con `overflow-x-hidden` en el contenedor raíz + vista de
   tarjetas apiladas en mobile (la tabla real solo aparece desde `sm:`).
3. El botón "Quitar" no leía el resultado de su propia acción — si fallaba, quedaba congelado en
   "Quitando…" para siempre sin salida.

Verificado con Node.js/Playwright (no con login real, ver nota de abajo): `tsc --noEmit` ✓ ·
`next build` ✓ (17 rutas) · dev server sin errores de consola · confirmado con
`document.body.scrollWidth === document.documentElement.scrollWidth === 375` que no quedó scroll
horizontal · confirmado navegando sin sesión que `/admin` redirige a `/entrar` (gate real activo,
sin ningún bypass — el bypass temporal de captura se usó y se retiró por completo, verificado con
`grep` que no queda ningún rastro de `SCREENSHOT_DEMO` en el código ni en `.env.local`).

✅ **CONFIRMADO por el usuario en producción (2026-09-09), celular Y computador**: código
commiteado y pusheado a GitHub (`d8267f9`), Vercel desplegó solo. El usuario agregó
`SUPABASE_SERVICE_ROLE_KEY` en Vercel → Settings → Environments → Production → Environment
Variables (la ruta cambió de nombre en la versión nueva del panel de Vercel — ya no es una
pestaña "Environment Variables" separada, vive dentro de cada entorno) e hizo redeploy.

⚠️ **Bug real encontrado y corregido en la verificación en vivo — cuentas creadas ANTES de
`admin.sql` no tenían fila en `profiles`**: el trigger `on_auth_user_created` solo se dispara en
altas NUEVAS a `auth.users`; la cuenta del dueño ya existía de sesiones anteriores, así que nunca
se le creó su fila en `profiles` — el `update ... where email = '...'` para marcarlo admin
corría sin error pero sobre CERO filas (confirmado con `select * from auth.users` mostrando la
cuenta real, y `select * from public.profiles` vacía). Diagnosticado paso a paso con el usuario
(consultas de solo lectura antes de escribir nada) y resuelto con un `insert ... values (...) on
conflict (id) do update` usando el `id` real de `auth.users` en vez de comparar el correo como
texto. Confirmado con una lectura de `profiles` mostrando `role = 'admin'`, y confirmado
visualmente por el usuario en `/admin` con sus números reales (1 usuario, 1 activo hoy).
**Nota para cuando haya más cuentas viejas que necesiten este mismo arreglo**: el patrón general
es `insert into public.profiles (id, email) select id, email from auth.users where id not in
(select id from public.profiles)` — hace el backfill de cualquier cuenta anterior al trigger, sin
tocar las que ya tienen fila.

✅ Feature de más, NO construida (fuera de alcance, anotada aquí en vez de construida sin avisar):
edición de campos de una cuenta ya creada (solo se puede quitar una alta manual, no editarla).

### Checkpoint (2026-09-09) — Panel de administración: EN PLANEACIÓN, esperando OK del usuario
El usuario pidió el panel de administración premium (solo para el dueño): números reales de la
app + alta manual de usuarios por correo+nombre. Instrucción explícita: presentar plan primero y
ESPERAR su OK antes de escribir código — nada de código construido todavía para este panel.
Leídos los 7 archivos de doctrina que pidió: `21-BACKOFFICE.md`, `09-SEGURIDAD.md`,
`26-AUTH-MODERNO.md`, `31-EVALS-OBSERVABILIDAD-OPERACION.md`, `40-UNIT-ECONOMICS.md`,
`36-ANALITICA-Y-EVENTOS.md`, `17-VISUALIZACION-DATOS.md`. Estado real de la app hoy (determina
qué secciones muestran datos reales vs "Sin datos"): NO existe todavía `event_log`, `error_log`,
`ai_calls`, `acquisition_spend`, columna `profiles.role`/`source`, ni webhook de Hotmart — la app
no usa IA (cero features de IA hoy), no tiene tabla `profiles` propia (solo `auth.users` +
`titulos`/`pagos`/`autorizaciones`/`eventos`). Próximo paso inmediato: presentar el plan de
secciones al usuario (en el chat, sin código) y esperar su aprobación explícita antes de construir.

### Checkpoint (2026-09-09) — Calendario ampliado, CONFIRMADO por el usuario en su celular
A pedido del usuario: `/calendario` ahora tiene un calendario visual del mes (rejilla de 7 días,
puntos en los días con eventos, tocar un día abre "Nuevo evento" con esa fecha ya puesta) — en
escritorio queda a la derecha (aprovecha el espacio antes vacío, regla 43 §13), en celular queda
apilado arriba de la lista de siempre (nada se quitó). Se evaluó y DESCARTÓ forzar 2 columnas
también en celular en vertical: los días del calendario quedarían por debajo del mínimo de 44px
de toque — se probó con una captura real antes de decidir, no solo se asumió. En su lugar, el
espacio libre junto al calendario visual (en celular, debajo; en escritorio, al lado) se llenó
con `<ResumenMes>`: conteo real de eventos del mes por tipo (ej. "2 visitas · 1 cita médica"),
dato derivado de los eventos ya cargados, sin repetir la lista de abajo.
También: CUALQUIER tipo de evento (no solo "Salida del país") ya permite adjuntar un archivo
real, mismo sistema de Supabase Storage que ya existía para pagos — generalizado
`subirArchivoPrivado(userId, 'pagos'|'eventos', archivo)` y `obtenerUrlArchivo(ruta)` (antes
`subirArchivoComprobante`/`obtenerUrlComprobante`, solo para pagos). Nueva columna
`documento_adjunto_path` en `eventos`, ya corrida por el usuario (`supabase/eventos-adjuntos.sql`).
✅ **Todo publicado y CONFIRMADO visualmente por el usuario en su celular real** — "se ve bien,
por ahora dejémoslo así".
⚠️ Nota para mí mismo: al revertir un bypass temporal de pantalla con `git checkout -- archivo`,
se perdieron por accidente cambios reales aún no commiteados en ese mismo archivo (tuve que
rehacerlos) — a partir de ahora, antes de usar `git checkout` para deshacer un bypass, revisar con
`git diff` que no haya OTROS cambios reales sin commitear en ese archivo primero.

## Sesión de pulido (2026-09-08, tras cerrar la migración a Supabase de la Sesión 6)
El usuario pidió invertir tiempo en subir el puntaje de las 3 pantallas con veredicto NO LISTA
(landing, onboarding, paywall) antes de seguir con Hotmart. Se hicieron **6 rondas** de revisor-
visual en total (2-3 por pantalla) con fixes reales entre cada una — no solo cosméticos:

⚠️ **2 bugs reales encontrados y corregidos, no solo de puntaje**:
1. **`<Marcador>` (subrayado de palabra clave, `components/funnel/ui.tsx`) rompía visualmente en
   títulos de 2 líneas**: con `leading-[1.1]` (tipografía compacta), el alto real de la caja de
   línea de un span inline superaba el line-height calculado (la tinta de Spectral es más alta
   que el interlineado apretado) — el gradiente del subrayado, calculado por PORCENTAJE de ese
   alto, quedaba varios px más abajo de lo esperado y se veía como un rectángulo flotante
   desconectado del texto. Fix: tamaño y posición del subrayado en unidades FIJAS (`em`), ancladas
   al borde inferior de la caja, en vez de un porcentaje del alto total. Verificado con DevTools
   (`getBoundingClientRect`) antes de tocar código, y visualmente después.
2. **La pantalla de onboarding se ROMPÍA POR COMPLETO (crash) al tocar "Otra cosa"**: el hook
   `useSeleccionRetrasada` en `PreguntaSituacion` se llamaba DESPUÉS de un `if (otra) return`,
   violando las reglas de hooks de React (número de hooks distinto entre renders → "Rendered fewer
   hooks than expected"). Fix: mover el hook antes de cualquier return condicional. Verificado en
   el navegador real (no solo en código) que la pantalla ya carga sin errores.

⚠️ **Error de dinero real encontrado y corregido**: el badge del plan anual decía "ahorra 4 meses"
y la landing "AHORRAS 33%" — ambos números eran matemáticamente incorrectos. Cuenta real: $9.99×12
= $119.88 (costo mes a mes) vs $89/año → ahorro real $30.88 = **25.76%** (no 33%) y **~3.09 meses**
(no 4). Corregido en `app/paywall/page.tsx`, `app/page.tsx` y `docs/copy/landing.md`, con la cuenta
completa anotada en el código para que no se repita el error.

**Puntajes, antes → después de toda la ronda de pulido** (umbral para "LISTA": ≥36/40 usabilidad,
≥16/20 craft, ≥16/20 copy sin ejes ≤2):
- **Landing**: 32/40 · 16/20 · 17/20 → **34/40 · 17/20 · 18/20**. Fixes: CTA "Elegir mensual"
  unificado al componente compartido (antes duplicado a mano), barra sticky mobile con botón de
  cerrar manual (con reaparición en el siguiente hito de scroll, nunca "para siempre"), badge de
  ahorro corregido. Sigue NO LISTA — el techo de usabilidad (~32-34/40) es estructural: 5 de las
  10 heurísticas de Nielsen no aplican de forma significativa a una landing de una sola pasada sin
  login (ya diagnosticado en rondas anteriores, ver más abajo en el archivo).
- **Onboarding**: 27/40 · 12/20 → (tras el crash, ronda intermedia 24/40) → **30/40 · 15/20**.
  Fixes: ícono en 2 preguntas que no lo tenían, tarjeta "¿Por qué lo preguntamos?" en las 6
  pantallas de solo-chips (mismo patrón, antes solo la primera la tenía), navegación con flechas
  de teclado, `focus-visible` en `<Chip>`, el check se ve antes de avanzar de paso (antes ocurría
  en el mismo tick), Atribución bajada de 5 a 4 opciones, subtítulo agregado donde faltaba, y el
  crash de "Otra cosa" corregido. Sigue NO LISTA — el defecto que persiste es el mismo de siempre
  (vacío en pantallas de pocas opciones, tensión doctrina-minimalista vs. rúbrica-de-densidad).
- **Paywall**: 26/40 · 12/20 · 16/20 → **28/40 · 14/20 · 19/20 copy**. Fixes: indicador "Paso X de
  3", entrada escalonada en los botones de plan, titular reescrito con la escena de dolor real,
  íconos del header con fondo circular, badge de ahorro corregido, copy más específico (con dato
  concreto en cada viñeta), footer condensado y acortado hasta caber completo en 375×812 (antes se
  cortaba), borde de la card no seleccionada reforzado, badge del plan recomendado con más
  despegue del borde de la tarjeta. Copy ya PASA su umbral (19/20, todos los ejes ≥3). Sigue NO
  LISTA por usabilidad/craft — defectos que quedan: halo ownable poco perceptible, densidad del
  pie de página, sin atajos más allá de la preselección (techo esperado para este tipo de pantalla).

**Decisión**: no se relanzó una 7ª ronda de revisor tras los últimos 2 fixes menores (badge del
paywall, consistencia de layout en onboarding) — se verificaron con `tsc`/`build`/captura manual.
Las 3 pantallas suben de puntaje real esta sesión pero NINGUNA cruza el gate de "LISTA" — los
defectos que quedan son, en su mayoría, el mismo techo estructural ya diagnosticado en sesiones
anteriores (tensión entre el minimalismo pedido por `50-DISENO-ONBOARDING-PAYWALL.md` y las
heurísticas de densidad de la rúbrica), no descuido de ejecución. Seguir iterando aquí tiene
rendimiento decreciente real — cada ronda cuesta ~70-90k tokens y las últimas rondas subieron 1-3
puntos por pantalla. Se recomienda continuar con Hotmart (el siguiente paso pendiente de Sesión 6)
y retomar el pulido visual más adelante si aparece evidencia nueva (uso real, feedback de
compradores) que justifique seguir invirtiendo aquí.

## Fase actual
Sesión 5 (la app interna) TERMINADA (ver su sección más abajo). Sesión 6 (servicios externos) EN
CURSO: el usuario ya tenía cuentas de GitHub/Supabase/Hotmart; falta Vercel. Progreso:
- **GitHub conectado**: todo el código de esta sesión (Sesión 5 completa + fixes de onboarding/
  paywall/landing) ya está commiteado y pusheado a
  `https://github.com/amsrentasinteligentes/Coparentia` (rama `master`, remoto `origin`
  configurado en el repo local). Push verificado con `git ls-remote`.
- **Vercel conectado y desplegado**: proyecto importado desde GitHub, primer deploy exitoso
  (verificado por el usuario abriendo la URL — el navegador de Claude no pudo verlo porque
  Vercel exige sesión iniciada en deployments; normal, no es un bug).
  ✅ **Protección de acceso de Vercel DESACTIVADA (2026-09-08)**: el usuario intentó crear una
  cuenta de prueba real para verificar la app en su celular y el enlace mágico del correo lo
  redirigía a "Login to Vercel" — la protección bloqueaba a CUALQUIERA, no solo a él, así que
  ningún cliente real habría podido completar el registro nunca. Se desactivó en Vercel →
  Settings → Deployment Protection. El sitio ya es públicamente accesible sin iniciar sesión en
  Vercel — paso necesario para que el registro funcione de verdad, no solo para pruebas.
⚠️ **PENDIENTE — creación de cuenta de prueba bloqueada por el límite de correos de Supabase,
  CAUSA CONFIRMADA**: al intentar crear una cuenta real desde el celular, `/entrar` empezó a
  mostrar "No pudimos enviar el enlace". Confirmado con el usuario en Supabase → Authentication →
  Rate Limits: **"Rate limit for sending emails: 2 emails/h"** — el límite de prueba de Supabase
  es literalmente 2 correos por hora, agotado entre los varios intentos de esta sesión. El usuario
  decidió ESPERAR ~1 hora (recordatorio programado) y retomar entonces para conectar Resend como
  proveedor SMTP real de Supabase Auth — 2 correos/hora no alcanza ni para pruebas, mucho menos
  para clientes reales, así que esto había que resolverlo de todas formas antes de vender.
  **Cuando se retome, en este orden**: (1) el usuario crea su cuenta gratis en Resend, (2) guiarlo
  a Supabase → Authentication → Emails (o Settings → Auth → SMTP Settings) para conectar el SMTP
  de Resend con el protocolo de cero secretos (él pega la API key de Resend directo en el panel de
  Supabase, nunca en el chat), (3) reintentar el enlace mágico ya sin el límite de 2/hora, (4)
  retomar la creación de la cuenta de prueba para revisar la app en el celular real (motivo
  original de esta sección).

⚠️ **Segundo bug real encontrado y CORREGIDO en la misma prueba — Site URL/Redirect URLs
  desactualizadas**: tras esperar el límite de correos, el enlace mágico seguía sin funcionar —
  llevaba de vuelta a la página principal en vez de a `/inicio`. Causa confirmada con captura del
  usuario: en Supabase → Authentication → URL Configuration, tanto la **Site URL** como la única
  entrada de Vercel en **Redirect URLs** apuntaban a una URL de despliegue vieja y específica
  (`coparentia-i4aj5ll38-amsrentasinteligentes-9577.vercel.app`), no al dominio real y estable
  (`coparentia.vercel.app`). Como `emailRedirectTo` en `app/entrar/page.tsx` usa
  `window.location.origin` (el dominio real desde el que se pide el enlace), Supabase rechazaba
  ese redirect por no estar en la lista blanca y caía al Site URL viejo — nunca llegaba a ejecutar
  `app/auth/callback/route.ts`, así que el código nunca se canjeaba por una sesión real. Corregido
  por el usuario: Site URL → `https://coparentia.vercel.app`, y agregada
  `https://coparentia.vercel.app/auth/callback` a Redirect URLs (las 2 entradas viejas se dejaron,
  no estorban). ✅ **CONFIRMADO por el usuario**: con la config corregida, el enlace mágico ya
  lleva directo a `/inicio` con sesión real — el flujo de registro/login funciona de punta a punta
  en producción, verificado con una cuenta real en un celular real (no solo en código).
✅ **MIGRACIÓN A SUPABASE VALIDADA DE PUNTA A PUNTA (2026-09-08)**: el usuario completó el flujo
  real completo desde su celular — magic link → sesión real → "primeros pasos" (cuota + primer
  comprobante con foto real tomada desde el celular) → el pago quedó guardado en la base de datos
  real de Supabase y se ve correctamente en `/pagos` ("Primer comprobante registrado", $5.000.000,
  con el nombre real del archivo de la foto). Confirma que `lib/datos.ts` (migrado de localStorage
  a Supabase en esta misma sesión) funciona correctamente en producción con un usuario real, no
  solo en pruebas locales con datos de ejemplo.

✅ **Resend conectado como SMTP real de Supabase Auth (mismo día)**: el usuario creó su cuenta en
  Resend, generó una API key (nunca vista en este chat) y la conectó en Supabase → Authentication
  → Emails → SMTP Settings (host `smtp.resend.com`, puerto 465, usuario `resend`). Ya no depende
  del límite de 2 correos/hora del buzón de prueba de Supabase.
⚠️ **PENDIENTE — correos de magic link caen en spam**: confirmado por el usuario en su primera
  prueba real. Causa: se está usando el remitente genérico compartido `onboarding@resend.dev` (sin
  dominio propio verificado, sin SPF/DKIM/DMARC alineados a Coparentia) — normal que un dominio
  compartido nuevo caiga en spam. Fix real: verificar un dominio PROPIO de Coparentia en Resend
  (agregar los registros DNS que Resend pide) y usar un remitente de ese dominio (ej.
  `entrar@coparentia.app`) en vez de `onboarding@resend.dev`. Requiere que el usuario tenga (o
  compre) un dominio — pendiente de confirmar con él si ya tiene uno. Sin esto, la app FUNCIONA
  pero cualquier cliente real tendría que ir a buscar el correo a spam — no es aceptable para
  lanzamiento, sí es aceptable para seguir probando mientras tanto.
  **Decisión del usuario (2026-09-08)**: no tiene dominio propio todavía y prefiere esperar a
  comprarlo más cerca del lanzamiento en vez de hacerlo ahora — sigue probando la app buscando el
  correo en spam por ahora. Retomar esto en la sesión de dominio/lanzamiento (ver `18-VENTA-
  HOTMART.md`/`62-PUBLICACION-SEGURA-Y-CONTINUA.md`).

✅ **RESUELTO — almacenamiento real del comprobante subido (hallazgo del usuario, real)**:
  probando en su celular, el usuario notó que la app solo guardaba el NOMBRE del archivo del
  comprobante (`comprobante_nombre`), nunca la foto/PDF en sí — algo especialmente delicado
  porque el producto vende justo eso ("el Sello de Confianza"). Conectado Supabase Storage de
  verdad el mismo día: `supabase/storage.sql` (bucket privado `comprobantes` + políticas RLS de
  `storage.objects`, cada usuario solo lee/sube/borra dentro de su propia carpeta
  `{user_id}/...`, ya corrido por el usuario en producción); `agregarPago()` en `lib/datos.ts`
  sube el archivo real antes de guardar la fila y guarda su ruta en `comprobante_path`; nueva
  `obtenerUrlComprobante()` genera un link firmado y temporal (10 min) para ver/descargar el
  archivo — el bucket nunca es público. En `/pagos`, cada registro con comprobante real ahora es
  tocable y abre el archivo real en una pestaña nueva. ✅ **CONFIRMADO por el usuario**: probó
  subiendo un comprobante nuevo desde su celular real y tocando el registro se abrió la foto
  real correctamente. Pendiente menor (no bloqueante): el mismo
  patrón para `documentoAdjunto` de `Evento` (permiso de salida del país en `/calendario`) sigue
  guardando solo el nombre — replicar el mismo enfoque cuando haga falta.

✅ **RESUELTO — desbordamiento horizontal en tarjetas con texto largo (hallazgo del usuario,
  real)**: en `/pagos`, el nombre de archivo real que pone el celular a las fotos (muy largo, tipo
  UUID) empujaba el monto ($) fuera de la pantalla — visible en un celular real, no solo teórico.
  Causa raíz: los `<div className="flex-1">` que envuelven texto variable no tenían `min-w-0`
  (por defecto un hijo flex no se encoge más allá del ancho de su contenido, así que un texto sin
  espacios lo desborda) — regla del 43-MICRO-CRAFT-Y-EJECUCION.md, defecto real, no solo de
  puntaje. Corregido en las 4 pantallas con el mismo patrón (`inicio`, `pagos`, `calendario`,
  `expediente`): `min-w-0` en el contenedor + `truncate` en los textos largos + `shrink-0` en el
  monto/ícono que no debe encogerse. Verificado con un nombre de archivo real de 39 caracteres:
  ahora corta con "…" y el monto se ve completo.
- **Supabase — código listo, falta la conexión real**: el usuario ya creó el proyecto real en
  Supabase. Se preparó TODO el código de conexión sin tocar ni ver ninguna clave (protocolo cero
  secretos en chat, regla 4 de este mismo archivo):
  - `lib/supabase/client.ts` (cliente de navegador) y `lib/supabase/server.ts` (Server
    Components/Actions) con `@supabase/ssr` — instalado `@supabase/supabase-js` y `@supabase/ssr`
    (SÍ quedan en package.json, son dependencias reales de la app, a diferencia de `sharp`/
    `playwright` que se instalan `--no-save` solo para procesar imágenes o probar en esta sesión).
  - `proxy.ts` (antes `middleware.ts` — Next.js 16 renombró la convención; se migró con el
    codemod oficial `@next/codemod middleware-to-proxy`) refresca la sesión de Supabase en cada
    request.
  - `supabase/schema.sql`: esquema completo (`titulos`, `pagos`, `autorizaciones`, `eventos`)
    con RLS `(select auth.uid()) = user_id` en las 4 tablas, índices en cada FK (regla #1 de
    25-BASE-DE-DATOS.md), `numeric` para dinero, `updated_at` automático en `titulos` — el
    usuario debe pegarlo en Supabase → SQL Editor → Run (no se puede ejecutar desde aquí sin
    credenciales de servidor).
  - Pedido al usuario: agregar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en
    Vercel → Settings → Environment Variables (él copia los valores directo desde Supabase, sin
    pegarlos en el chat) — **en curso, ver incidente de seguridad abajo**.

⚠️ **Incidente de seguridad menor, resuelto en el momento**: al llenar `.env.local`, el usuario
pegó por error la **service_role key** (el secreto que salta toda la seguridad de Supabase) en
la variable `NEXT_PUBLIC_SUPABASE_URL` — si eso hubiera llegado a build/deploy, habría quedado
expuesto en el navegador de cualquier visitante. Se detectó de inmediato (el valor nunca se repite
ni se guarda en texto plano en ningún archivo de este repo), se le pidió al usuario **rotar/
regenerar esa clave en Supabase** y corregir la línea con la Project URL real (`https://algo.
supabase.co`). La `NEXT_PUBLIC_SUPABASE_ANON_KEY` sí estaba correcta. Si en el futuro se necesita
la service_role key (ej. el webhook de Hotmart), va en una variable SIN el prefijo `NEXT_PUBLIC_`
y solo se usa en código de servidor — nunca en un archivo que el navegador descarga.
  - `tsc`/`next build` limpios con todo esto ya en el código (los archivos no fallan sin las
    variables porque nada los usa todavía en runtime — el `!` de TypeScript no valida en build).
### Actualización — Auth real conectada (mismo día, continuación)
- ⚠️ **Segundo incidente menor, mismo patrón**: al corregir la variable, el usuario volvió a
  pegar una clave privada (esta vez `sb_secret_...`, el nuevo formato de Supabase que reemplaza a
  `service_role`) en `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Se detectó igual que la primera vez (por el
  prefijo, sin repetir el valor), se explicó la diferencia `sb_publishable_` (segura, pública) vs
  `sb_secret_` (privada, nunca en `NEXT_PUBLIC_`), y el usuario corrigió con la publishable key
  correcta — verificado con un script que solo lee el PREFIJO de cada variable, nunca el valor
  completo. Ambas variables confirmadas correctas: URL real + `sb_publishable_...`.
- **`/entrar` ya usa Supabase Auth real**: `signInWithOtp` (magic link, jerarquía de
  26-AUTH-MODERNO.md) — crea el usuario si no existe (registro passwordless, igual que hará el
  webhook de Hotmart más adelante). Aprovechando el cambio, se corrigió también un botón inerte
  que ya existía ("Continuar con Google" no hacía nada al tocarlo — regla 11 del SO): ahora está
  visiblemente deshabilitado con la etiqueta "— próximamente" en vez de fingir que funciona.
- **`app/auth/callback/route.ts`** (nuevo): recibe el enlace mágico, intercambia el código por una
  sesión real (`exchangeCodeForSession`) y redirige a `/inicio`; si el enlace ya se usó o expiró,
  vuelve a `/entrar?error=enlace_invalido` con aviso visible (antes no existía ningún manejo de
  este caso).
- **`app/(app)/layout.tsx`**: ahora es un Server Component async que exige sesión real
  (`supabase.auth.getUser()`) antes de mostrar Inicio/Pagos/Calendario/Expediente — sin sesión,
  redirige a `/entrar`. Verificado: entrar directo a `/inicio` sin sesión SÍ redirige (antes estas
  rutas eran navegables libremente, documentado como aceptable solo mientras el login era mock).
- Verificado end-to-end con el correo real del usuario: el envío del enlace mágico se completó sin
  errores (confirma que las variables de entorno están bien conectadas) — revisado sin errores de
  consola ni de red. `tsc`/`next build` limpios (fue necesario envolver `EntrarInterno` en
  `<Suspense>` porque `useSearchParams` lo exige en Next.js 16, si no falla el build).
- **Pendiente inmediato**: el usuario está configurando en Supabase → Authentication → URL
  Configuration la Site URL (su dominio de Vercel) y las Redirect URLs
  (`http://localhost:3000/auth/callback` + la URL de Vercel + `/auth/callback`) — sin esto, el
  enlace mágico redirige a `localhost` incluso en producción.
- ✅ (1) Redirect URLs confirmadas por el usuario. ✅ (2) `supabase/schema.sql` corrido con éxito en
  el SQL Editor — las 4 tablas reales (`titulos`, `pagos`, `autorizaciones`, `eventos`) ya existen
  en producción, con RLS e índices. ✅ (3) `lib/datos.ts` migrado de localStorage a Supabase real
  (ver detalle abajo). Quedan: (4) conectar Hotmart (producto + webhook con hottok que activa/crea
  el usuario), (5) desactivar las claves antiguas ("Legacy API Keys") en Supabase para cerrar del
  todo el tema de seguridad de los dos incidentes de arriba.
- **Investigado y descartado — enlazar Claude directamente con Vercel/Supabase por CLI**: no hay
  conectores instalados para ninguno de los dos. GitHub ya está enlazado de forma segura (el flujo
  propio de git nunca le muestra una clave a Claude). Vercel/Supabase por CLI sí exigirían pasar un
  token de acceso personal por este chat — eso rompe la regla "cero secretos en chat" del proyecto,
  así que se descartó; se sigue con el copiar/pegar manual en los paneles oficiales.
### Actualización — `lib/datos.ts` migrado a Supabase real (mismo día, continuación)
- Mismos tipos y firmas de función que la versión de localStorage (`Titulo`, `Pago`, `Autorizacion`,
  `Evento`, `obtenerX`/`agregarX`/`guardarTitulo`) — las 4 pantallas de la app interna (Inicio,
  Pagos, Calendario, Expediente) casi no cambiaron: solo se convirtieron sus llamadas a estas
  funciones (ahora asíncronas) a `useEffect` + `.then(...)` en vez de lectura síncrona.
- `tieneOnboardingCompleto()` ya no depende de una bandera separada en localStorage — se DERIVA en
  vivo de si el usuario tiene título Y al menos un pago guardados en la base real (más robusto:
  nunca puede desincronizarse). Se eliminó `marcarPrimerosPasosCompletos()` (ya no hace falta).
- Cada función obtiene el usuario autenticado con `supabase.auth.getUser()` y filtra/inserta por su
  `user_id` — la RLS del `schema.sql` refuerza esto igual del lado del servidor si algo se escapara
  aquí.
- Los datos semilla de demostración (pagos/autorizaciones/eventos de ejemplo) se eliminaron de esta
  capa: un usuario real autenticado ahora empieza con su cuenta vacía de verdad (las pantallas ya
  tenían sus propios estados vacíos con mensaje, así que no queda ninguna vista "en blanco muerta").
- Verificado: `tsc --noEmit` ✓ · `next build` ✓ (17 rutas generadas sin error) · dev server sin
  errores de consola ni de servidor · gate de sesión de `/inicio` sigue funcionando (sin sesión,
  redirige). No se repitió el flujo completo de magic-link + guardar datos en esta pasada (ya se
  verificó el envío real del correo en el paso anterior de esta misma sesión); el siguiente paso
  natural es que el usuario complete "primeros pasos" con su cuenta real y confirme que ve sus
  propios datos en el dashboard.

Sesión 4 (onboarding/paywall/login) terminada, con `veredicto:onboarding`/`veredicto:paywall`/
`veredicto:landing` en techo estructural documentado en "## Problemas conocidos" (no bloquean).

### Checkpoint (2026-09-07, ajustes pequeños de landing tras cerrar Sesión 5 inicial)
- Tarjetas de "¿Te suena?" (`components/landing/Problema.tsx`): borde + sombra reforzados para
  que se sientan con volumen (pedido explícito del usuario, antes se veían planas).
- CTA final (`app/page.tsx`): titular cambiado de "Imagina dormir en paz" a "Todo lo importante,
  bajo control. Tu mente, en calma." (pedido del usuario), con AMBAS frases clave en acento.
- `tsc`/`next build` limpios tras cada cambio; verificado con captura real cada vez.
- **Logo oficial — reemplazado 2 veces, versión vigente = manos+rostro infantil**: el usuario
  probó primero un isotipo de escudo+cadena (`Isotipo 3.jpeg`), y luego pidió cambiarlo por uno
  de dos manos sosteniendo un rostro infantil estilizado (`Isotipo 4.jpeg`, mismo tono metálico
  azul-gris — encaja con FICHA-ARTE.md sin desviarse). Mismo proceso ambas veces: fondo quitado
  con relleno por conectividad desde las esquinas (`sharp`, instalado `--no-save`, no queda en
  package.json — solo se usó para este procesamiento puntual, no es dependencia de la app) — así
  los brillos plateados internos del ícono nunca se confunden con el fondo — y recortado al
  contenido real. Los archivos originales del usuario se autoborraron de Descargas poco después
  de subirlos (no es un bug de esta sesión); se reprocesó a tiempo en ambos casos. Resultado en
  `public/logo-isotipo.png` (fondo transparente verificado por canal alfa) y `app/icon.png`
  (favicon/ícono de pestaña, 512×512). Ya reemplaza el placeholder (cuadrado azul) en
  `components/funnel/ui.tsx` (`FunnelHeader`, usado en onboarding/paywall/entrar) y en el header
  de `Hero.tsx` vía la prop `logo` en `app/page.tsx`. También agregado en `FooterLegal` (mismo
  patrón de prop `logo`) — cubre los 3 lugares del código donde el nombre va con un ícono al
  lado (los demás usos de "Coparentia" son texto plano en copy/metadata, sin slot de logo).
  Verificado visualmente en los 3 lugares.

## Origen de la idea
El usuario llegó con la idea ya validada mediante el prompt de investigación del curso.
Pegó el "RESUMEN FINAL — IDEA VALIDADA PARA CONSTRUIR" completo (PDF con 3 pestañas:
Resumen validado + Propuesta de valor + Cliente ideal). NO se re-valida ni se buscan
alternativas — ya pasó por investigación de mercado, conteo de competencia (12 apps) y
evidencia con enlaces (OurFamilyWizard, SupportPay, AppClose, Custody Companion, Kidtime).

También existe un documento previo del usuario (`Propuesta_Aplicacion_Obligaciones_Alimentarias_Colombia.docx`)
con la arquitectura jurídica detallada para Colombia (marco legal, REDAM, Ley 1098/2006,
Ley 2097/2021, etc.) — sirve como ANEXO JURÍDICO de referencia para reglas del sistema,
biblioteca normativa y FAQ legales. Se usa como fuente secundaria de reglas de negocio,
no reemplaza el RESUMEN FINAL como base de producto/mercado.

## 1. Nombre tentativo
PensiónClara (alternativas: CuotaAl Día, CustodiaAudit) — nombre comercial definitivo
pendiente de estudio de marca/disponibilidad. Working title de carpeta: "Coparentia".

## 2. La app en una frase
Plataforma digital neutral que documenta, calcula y genera expedientes probatorios
exportables del cumplimiento de obligaciones alimentarias y gastos de hijos para padres
separados — funciona de forma UNILATERAL (no requiere que el otro progenitor la use).

## 3. Problema urgente
Falta de un registro neutral e inalterable que acredite cumplimiento/mora de la cuota
alimentaria → conflictos diarios, cobros duplicados, gasto en abogados para reconstruir
pagos pasados.

## 4. Cliente ideal (avatar: "Carlos", 38 años)
Padre/madre separado(a) con obligación alimentaria fijada (o en proceso), en conflicto
constante con su ex sobre qué se pagó/debe/autorizó. Nivel de consciencia: DE SOLUCIÓN
(sabe que tiene un problema de gestión/prueba, ya intentó capturas de pantalla/Excel y
sabe que no alcanza). Dolor #1 real: ansiedad/estrés de vivir bajo amenaza de reclamos o
demanda injusta — no es administrativo, es de supervivencia emocional. Quiere PRUEBA,
CONTROL y PAZ MENTAL, no "mejorar la comunicación" con su ex ni que la app le calcule
cuánto debe pagar (teme que actúe como juez).
Dispuesto a pagar: $8-12 USD/mes o $89 USD/año.

## 5. Dolores reales (textuales, ver PDF Cliente Ideal para las 10 completas)
- "Siento que por más que pago, nunca es suficiente y siempre me tratan de mala paga."
- "Tengo un terror paralizante de que un día me pongan una demanda... y no tenga cómo probar."
- "Cada transferencia es un motivo de discusión y me arruina el día."
- Insatisfacción con soluciones previas: WhatsApp/capturas (se pierden, no dan contexto
  legal), Excel (manual, cuestionable/alterable), transferencias bancarias (no especifican
  concepto), carpetas físicas (se traspapelan).

## 11. MVP — funciones núcleo (construir) y qué NO construir aún
CONSTRUIR (v1):
1. Módulo de parametrización del título (monto base, fecha límite, índice de reajuste).
2. Registro de pagos y gastos extraordinarios con soporte foto/PDF + OCR básico.
3. Módulo de autorizaciones y registro de controversias/objeciones.
4. Generador de Expediente Documental exportable en PDF foliado con marca de tiempo.
5. **Calendario de eventos** (agregado 2026-09-07, pedido explícito del usuario — reemplaza la
   exclusión original de abajo): visitas de los hijos, citas médicas, vacaciones y actividades
   extracurriculares, cada evento asociable a un gasto/comprobante del expediente. Diferencia
   deliberada frente a OurFamilyWizard: NO es un calendario de custodia compartida bidireccional
   (no requiere que el ex lo use ni lo acepte — sigue siendo 100% unilateral); es un registro de
   eventos propio que alimenta el expediente de gastos, no un módulo de coordinación de visitas.

NO CONSTRUIR TODAVÍA: chat interno en tiempo real, integración directa con APIs bancarias,
calendario de custodia COMPARTIDA/bidireccional (coordinación con el ex) — sigue descartado; lo
que SÍ se construye (arriba) es un registro unilateral de eventos propios.

Primera victoria (<5 min): registrar el título (monto + fecha), subir el último
comprobante, ver su primer "Estado de Cuenta Organizado" generado en pantalla.

## 12-13. Competencia
12 apps contadas 🟢. Competidores clave: OurFamilyWizard ($12.50-$24.99/mes, exige uso de
ambos padres — hueco: uso unilateral), SupportPay (reportes poco rigurosos jurídicamente —
hueco: expedientes estandarizados para abogados/conciliadores), AppClose (dejó de ser
gratis, se sobrecargó de funciones — hueco: especialización 100% financiera/documental).

## 15-16. Precio y unit economics
Suscripción SaaS: $9.99 USD/mes o $89 USD/año. Prueba gratis 7 días.
Costo por usuario (S3 + OCR + procesamiento): ~$0.80 USD/mes → margen 92% 🟢.
Conexiones externas necesarias: pasarela de pagos (Stripe/Mercado Pago) + email
transaccional. Simplicidad 🟢.

## 18. Las 3 tomas del video (para landing/lanzamiento)
1. Tablero cuota pagada vs. pendiente (verde/rojo).
2. Subida de foto de comprobante → vinculación inmediata al mes.
3. Botón "Exportar Expediente Judicial" → PDF organizado con soportes anexos.

## 20. Ventaja del usuario
Tiene una persona muy cercana que es abogado(a) de familia. Esto habilita:
- Ángulo de autoridad en el copy ("validado con criterio de abogado de familia" / revisión
  legal real del contenido de la biblioteca normativa y las reglas del sistema).
- Canal de distribución por alianza profesional (ver propuesta de canales más abajo,
  pendiente de aprobación del usuario).

## 21. Canal de distribución (aprobado por el usuario)
Orden de arranque:
1. Alianza con su abogado(a) de familia cercano(a) — recomendación directa a clientes +
   revisión/aval de la biblioteca legal de la app.
2. Referidos de otros abogados de familia / centros de conciliación (vía el contacto anterior).
3. Contenido orgánico TikTok/Instagram con los ganchos ya validados del PDF.
4. Meta Ads pagos — solo cuando haya tracción orgánica; requiere presupuesto (avisar antes
   de gastar).

## 22. Diferenciador
"Somos la única app que genera un expediente probatorio neutral con validez documental
de forma UNILATERAL para padres separados que buscan protegerse legalmente sin depender
de que la otra parte quiera colaborar."

## Qué NUNCA debe hacer la app (derivado del anexo jurídico, pendiente de confirmación)
1. Nunca declararse juez, conciliador ni certificador oficial de deuda.
2. Nunca reportar automáticamente a alguien en REDAM ni afirmar que existe mora jurídica
   declarada — solo mostrar el estado contable de los registros.
3. Nunca borrar mensajes, soportes o versiones anteriores sin dejar rastro.
4. Nunca compartir los datos del usuario ni de sus hijos con terceros sin autorización expresa.
5. Nunca presionar con culpa ni lenguaje acusatorio hacia "el otro padre" (tono neutral siempre).

## Promesa central (derivada del reporte de posicionamiento)
"Ayudamos a padres separados a convertir sus pagos y gastos de sus hijos en un expediente
digital probatorio y organizado — sin depender de que su ex use la app, sin pelear por
WhatsApp y sin gastar en abogados solo para aclarar cuentas."

## Reglas de negocio especiales (del anexo jurídico Colombia)
- NO terminación automática de la cuota a los 25 años (parámetro jurisprudencial, no regla).
- NO compensación automática de gastos unilaterales.
- NO declaración automática de mora jurídica ni inscripción automática en REDAM (Ley 2097/2021)
  — solo advertir el supuesto de 3 cuotas y explicar que el trámite requiere autoridad competente.
- Reajuste: primero fórmula del título; solo si no hay, regla legal supletiva (IPC, Ley 1098/2006).
- La app NUNCA se declara juez, conciliador ni certificador de deuda — presenta información
  calculada a partir de títulos y registros suministrados por los usuarios.
- Biblioteca normativa dinámica con fuentes oficiales (Constitución, Código Civil, Ley 1098/2006,
  Ley 2097/2021, Decreto 1310/2022, Ley 2220/2022, CGP, Código Penal Art. 233, Ley 1581/2012
  datos personales, Ley 527/1999 mensajes de datos).
- Portal para abogados: acceso temporal autorizado, solo lectura/descarga.
- Marcar documentos aportados por una sola parte vs. aceptados por ambas.

## Decisiones técnicas pendientes de tomar en Sesión 1 (criterio del agente, no se preguntan)
- Modelo de monetización: a evaluar con matriz A-F de 02C (hard paywall vs onboarding-first)
  dado que el uso puede ser unilateral.
- Framework, arquitectura, base de datos, auth: pendiente (04-ARQUITECTURA, 25, 26).
- Unit economics: ya viene con margen 92% del PDF — validar contra 40-UNIT-ECONOMICS.md.

## Dirección de arte — comparativa A/B/C presentada (pendiente elección del usuario)
Archivo: `direcciones-abc.html` (raíz del proyecto) y copia archivada en `docs/revisiones/`.
Tabla de líderes usada (nicho legal/documental + fintech de confianza): Clio, DocuSign,
Notion (gestión legal/documentos) + Mercury/Revolut (claridad financiera, cifras tabulares).
Tres fusiones distintas del banco de direcciones (54):
- **Opción A — Blindaje Directo** (Brutalista suave, banco #2): claro, borde 2px + sombra
  dura offset, azul rotulador #2743D6, Archivo Black + Work Sans. Ángulo: control/autoridad.
- **Opción B — Cuenta Clara** (Fintech de bolsillo, banco #3): oscuro, verde saldo #46B583,
  Geologica + Wix Madefor Text, cifras tabulares. Ángulo: claridad financiera.
- **Opción C — Expediente Editorial** (Papel y tinta, banco #9): claro, lacre #8C2F23,
  EB Garamond + Inter Tight, timeline editorial con doble regla. Ángulo: seriedad jurídica.
Ninguna se repite de un proyecto anterior (no hay proyecto anterior en este SO todavía).

**RONDA 2** (el usuario pidió 3 opciones distintas, sin borrar la ronda 1): archivo actual
`direcciones-abc.html` en raíz + copia en `docs/revisiones/direcciones-abc-ronda2.html`.
La ronda 1 completa quedó intacta en `docs/revisiones/direcciones-abc.html`.
- **Opción A — Cuidado Documentado** (Clínica humana, banco #5): claro, teal #0F766E,
  Gantari + Atkinson Hyperlegible, hairline suave + sombra tintada. Ángulo: calma/protección.
- **Opción B — Estudio de Caso** (Nocturna de estudio, banco #6): oscuro, dorado #E0B458,
  Spectral + IBM Plex Sans, halo cálido detrás del anillo. Ángulo: revisión nocturna a solas.
- **Opción C — Bitácora Familiar** (Editorial cálida, banco #1): claro cálido, óxido #7A3E2E,
  Newsreader + Mulish, subrayado marcador en el titular. Ángulo: diario/acuerdo, no litigio.
**RONDA 3** (combinación explícita de B+C de ronda 2, en tonos azules): archivo actual
`direcciones-abc.html` en raíz + copia en `docs/revisiones/direcciones-abc-ronda3.html`.
Rondas 1 y 2 completas quedaron intactas en sus archivos respectivos.
- **Opción A — Confianza Nocturna** (hero+cards, azul #4C82E0): halo detrás del dato + subrayado
  marcador en el titular. Fusiona el halo de "Estudio de Caso" con el marcador de "Bitácora".
- **Opción B — Revisión en Confianza** (anillo+grid, azul #5B93E8): peso mayor en el lado
  "Estudio de Caso" — anillo de avance con halo, tono más financiero/serio.
- **Opción C — Bitácora en Azul** (timeline, azul #6FA8FF): peso mayor en el lado "Bitácora
  Familiar" — línea de tiempo editorial con halo sutil detrás del masthead.
Tipografía compartida: Spectral (display) + IBM Plex Sans (body) en las 3.

⚠️ Bug real encontrado y corregido: la URL de Google Fonts con sintaxis de rango
(`wght@400..700`) solo es válida para fuentes VARIABLES. Spectral es estática (pesos
discretos) — con esa sintaxis, Google Fonts descarta la familia completa en silencio (sin
error visible) y el navegador cae al fallback-trampa (monospace). Corregido a `wght@400;700`
(punto y coma). Revisar si se reutiliza EB Garamond (ronda 1, banco #9) más adelante — mismo
riesgo por ser también una fuente estática.

## DIRECCIÓN DE ARTE — COSA JUZGADA (Sesión 2 cerrada — 2026-09-07)
El usuario eligió y aprobó la **Opción B de la ronda 3 — "Revisión en Confianza"** (tour visto
y aprobado). Detalle completo, tokens, tabla de líderes y trazabilidad → `FICHA-ARTE.md`
(raíz del proyecto). Resumen rápido:
- Paleta: `--bg #0B1524 · --surface #13233A · --text-1 #E6EDF7 · --text-2 #7F93B3 · --accent #5B93E8`
- Tipografía: Spectral (display) + IBM Plex Sans (body) · radios card 14px / botón 10px
- Dispositivo ownable: halo azul + subrayado marcador (fusión banco 54 dir.1 + dir.6)
- Personalidad compilada: Sereno + Sobrio + Cálido · voz: mentor sereno
- Mapa de rutas planeado: / -> /onboarding -> /paywall -> /login -> /app

## Sesión 2 — TERMINADA
Identidad visual completa: FICHA-ARTE.md aprobada, tokens definidos, tour de la app aprobado.

## Sesión 3 — TERMINADA (2026-09-07): Página de ventas
Stack decidido (regla del stack, 12-FLUJO-AGENTICO.md): **Next.js App Router** — la app
necesita landing con SEO + app tras login, no es solo herramienta interna.
- Scaffold: Next.js 16 + React 19 + TypeScript + Tailwind v4 + `motion` + `lucide-react`.
- `FICHA-AVATAR.md` creada y aprobada (derivada del RESUMEN FINAL ya validado del usuario).
- Mecanismo bautizado: **"el Sello de Confianza"** (sube comprobante → se fecha y asocia →
  queda en el expediente). Big Idea en `docs/copy/landing.md`.
- Landing construida con el KIT CANÓNICO (`plantillas-codigo/landing/` → `components/landing/`),
  10 secciones en el orden inmutable de `19-PAGINA-DE-VENTAS.md`. `tokens.css` tematizado con
  FICHA-ARTE.md (azul de confianza). Copy en `docs/copy/landing.md`, cableado en `app/page.tsx`.
- Verificado: `tsc --noEmit` ✓ · `next build` ✓ · dev server arranca sin errores · rendering a
  375px revisado sección por sección (hero, problema, agitación, solución, carrusel, oferta,
  garantía, FAQ, CTA final, footer) — todas correctas, presupuesto de copy dentro de límites.
- Páginas legales creadas y enlazadas (privacidad, términos, reembolsos, aviso de IA) — CONTENIDO
  REAL pero marcado explícitamente como "en revisión legal final antes del lanzamiento" (no son
  enlaces muertos, cumple la regla dura del footer, pero NO reemplaza validación de un abogado).
- ✅ RESUELTO (2026-09-08): el carrusel de "La app por dentro" ya usa capturas REALES de las 5
  pantallas (`public/frame-{inicio,onboarding,paywall,pagos,calendario}.png`), no los placeholders
  con ícono+nombre de antes. Onboarding y Paywall se capturaron directo (son públicas); Inicio,
  Pagos y Calendario necesitan sesión real, así que se generaron con un interruptor temporal
  SOLO local (`NEXT_PUBLIC_SCREENSHOT_DEMO=1`, nunca en `.env.local` commiteado ni en Vercel) que
  hace que `lib/datos.ts` devuelva datos de ejemplo realistas en vez de llamar a Supabase — el
  gate de sesión de `app/(app)/layout.tsx` y todas las funciones reales de `lib/datos.ts` quedaron
  intactas y verificadas con `git diff` vacío después de revertir. Verificado con `tsc`/`build` y
  captura de las 5 tarjetas del carrusel ya deslizadas.
- Modelo de monetización: **onboarding-first (Modelo 2)** — CTAs llevan a /onboarding, no a
  checkout directo. (Decisión técnica, no se preguntó al usuario — DECIDE-INFORMA-AVANZA.)

## Actualización 2026-09-07 (post-cierre Sesión 4): onboarding ampliado a 2 roles
El usuario comparó el onboarding ya construido contra una propuesta externa (Gemini) y pidió
incorporar lo validable. Se evaluó cada punto contra `02B-ONBOARDING-Y-PAYWALL.md` y
FICHA-AVATAR.md antes de tocar código (no se improvisó el cuestionario):
- **Adoptado — ampliar a quien RECIBE la cuota, no solo a quien la paga** (aprobado explícitamente
  por el usuario tras preguntárselo, ver FICHA-AVATAR.md § "Sub-avatar secundario"). Nuevo primer
  paso `PreguntaRol` (paga/recibe) bifurca las preguntas de "situación" y "preocupación" en
  `app/onboarding/page.tsx`. Los dolores del lado receptor son INFERIDOS por simetría lógica del
  mismo conflicto (documentado como tal en la ficha) — no vienen de investigación de mercado
  propia como sí la tiene el lado pagador; si se junta evidencia real de ese lado, reemplazar.
- **Adoptado — nombrar el mecanismo dentro del onboarding**: "el Sello de Confianza" (ya usado en
  landing/paywall) nunca aparecía en el onboarding — hallazgo propio, no de la propuesta externa,
  pero real: viola la regla de 02B ("el usuario debe poder decir el nombre de lo que configuró").
  Ahora se nombra en el reconocimiento final y en la pantalla de carga.
- **Adoptado — nueva pregunta "¿Cómo está fijada tu cuota?"** (acta/sentencia · acuerdo informal ·
  en proceso legal) — personaliza el formato del expediente; justificado porque en este producto
  el diagnóstico legal SÍ es parte del valor central (excepción explícita de 02B para subir de
  4-8 a más pasos). Con esta y la de rol, el onboarding pasó de 8 a **10 pasos**.
- **Adoptado — refuerzo del uso unilateral en el momento justo**: cuando el usuario declara
  "Tengo disputas frecuentes con mi ex", el reconocimiento agrega una línea recordando que el
  expediente queda blindado sin depender de que el ex use la app (objeción #1 de FICHA-AVATAR,
  antes solo se defendía en la página de ventas, no dentro del producto).
- **Adoptado — "Paso X de Y"** junto al % de la barra de progreso (`<BarraAtras>` en
  `components/funnel/ui.tsx`, prop nueva y opcional, no rompe su uso donde no se pase).
- **Descartado por ahora — pedir subir el comprobante y mostrar una vista previa de PDF dentro del
  onboarding**: requiere el motor real de procesamiento de documentos, que no existe hasta la
  Sesión 5 (app interna). Simularlo ahora significaría mostrarle al usuario un resultado que en
  realidad no se generó — viola la regla de mockups honestos del sistema. Se retoma cuando exista
  el motor real.
- Verificado con Playwright las DOS ramas completas (paga/recibe) sin errores de consola,
  `tsc`/`next build` limpios.

### Rondas de revisor-visual sobre el onboarding ampliado (2 rondas, ambas NO LISTA)
Ronda 1 (25/40 · 12/20): confirmó que el rol/fijación se derivan bien de la ficha, pero encontró
defectos reales: vacío sin profundidad en el paso de rol, chips de "situación" sin ícono (rompía
consistencia con las demás preguntas), botón Atrás en el paso 0 cayendo a `router.back()` sin
aviso (bug real, no solo de puntaje), y los mensajes de refuerzo como texto suelto sin jerarquía.
Todo corregido: íconos agregados a los 4 chips de situación, Atrás del paso 0 ahora navega
explícitamente a `/`, y los refuerzos ("no necesitas que tu ex use la app", "Sello de Confianza")
son ahora tarjetas con ícono y borde/fondo propios.

Ronda 2 (27/40 · 12/20): confirmó los 3 fixes de código de la ronda 1, pero encontró que el vacío
solo se atendió en el paso de rol (no en situación/fijación/preocupación — mismo techo estructural
ya documentado para pantallas de solo-chips), que las 4 tarjetas nuevas se ven como el mismo
componente repetido sin variación de profundidad, y **un bug real nuevo, no reportado antes**: en
la pantalla de carga, los pasos del checklist se marcaban fuera de orden (ej. el paso 3 aparecía
completado antes que el paso 2).

⚠️ **Bug real encontrado y corregido** (`LoadingPlan` en `app/onboarding/page.tsx`): la función que
avanza el checklist guardaba el índice a marcar con `setCompletadas((c) => [...c, i])` y justo
después mutaba `i += 1` en la misma variable — como React ejecuta esa función de actualización
más tarde (no al instante), para cuando la ejecutaba `i` ya tenía el valor SIGUIENTE, así que
marcaba el paso equivocado. Se verificó con capturas en el tiempo (confirmando visualmente el
salto de orden) y con logs temporales que probaron la causa exacta antes de corregir. Fix:
capturar el índice en una constante ANTES de mutar la variable, y usar esa constante en la
actualización. Verificado de nuevo con capturas en el tiempo: el checklist ahora marca 0→1→2→3→4
en orden estricto. De paso se corrigió también una advertencia de consola en el anillo animado
(`strokeDashoffset` sin valor inicial) y se agregó un mensaje de ayuda al campo "otra cosa" y una
variación real de superficie (tarjeta hundida vs. tarjeta con acento) entre los refuerzos.
- `tsc`/`next build` limpios tras el fix. **Ronda 3 del revisor-visual pendiente de decidir con el
  usuario** (cada ronda cuesta ~110-120k tokens; 2 rondas ya corridas sobre esta versión ampliada,
  más las rondas previas a la ampliación — ver historial completo en "## Problemas conocidos").

## Sesión 4 — TERMINADA (2026-09-07): Onboarding, paywall y login
Construido siguiendo `02B-ONBOARDING-Y-PAYWALL.md` (estrategia) + `50-DISENO-ONBOARDING-PAYWALL.md`
(especificación visual exacta). Kit compartido en `components/funnel/ui.tsx` (header de marca,
barra de progreso animada con endowed progress, chips, CTA fijo) — misma identidad de
FICHA-ARTE.md que la landing.

- **`/onboarding`** (`app/onboarding/page.tsx`): 5 preguntas reales derivadas de FICHA-AVATAR.md
  (situación → eco de objeciones/consciencia, con escape hatch "otra cosa" · preocupación → eco
  literal de los dolores #1-#4 · meta de compromiso (slider 1-12 meses) · momento del día (ancla
  la hora de recordatorios futuros) · atribución (canal, patrón Cal AI)) + 2 pantallas de
  reconocimiento (la primera desculpa con la causa real, la última etiqueta con identidad
  positiva — regla b de LA ESCALERA) + loading "Construyendo tu expediente…" con 4 líneas que
  citan las respuestas reales del usuario (labor illusion, patrón Noom) y anillo de progreso.
  Auto-avance de chips a 300ms, transiciones deslizantes, barra que nunca empieza en 0%.
- **`/paywall`** (`app/paywall/page.tsx`): paywall DE SECUENCIA (3 pantallas, +37% vs una sola —
  Superwall 2026): (1) recap con la inversión visible ("Hecho con tus 5 respuestas" — costo
  hundido, regla a de LA ESCALERA), (2) timeline del trial (Hoy → Día 5 → Día 7 con fecha y
  monto exactos, patrón Blinkist), (3) precio (anual $7.42/mes preseleccionado con badge "4
  meses gratis", mensual $9.99/mes, CTA en 1ª persona, garantía de 15 días visible, "Ahora no"
  sin confirmshaming, X de cierre desde el frame 1).
- **`/entrar`** (`app/entrar/page.tsx`): login sin contraseña (magic link), con los 3 estados
  reales (enviando/enviado con countdown de reenvío/error) + botón Google (visual, sin OAuth
  real todavía).
- Verificado end-to-end con clics reales/simulados por todo el flujo completo
  onboarding→paywall→login: cada pantalla personaliza correctamente con las respuestas
  anteriores (confirmado en pantalla, no solo en código).
- `tsc` + `next build` limpios con las 3 rutas nuevas generadas.

⚠️ PENDIENTES anotados (no bloquean el cierre, se resuelven en Sesión 6):
- **Todo es mock sin backend**: las respuestas viajan por `sessionStorage` (no hay servidor
  todavía). El envío del magic link en `/entrar` está SIMULADO (setTimeout, nunca se manda un
  correo real) — Sesión 6 conecta Supabase Auth (magic link real) + el webhook de Hotmart que
  crea el usuario passwordless. El botón "Continuar con Google" es solo visual (sin OAuth real).
- El CTA final del paywall lleva a `/entrar` en vez de a un checkout real de Hotmart — correcto
  para esta etapa (C3ter: "nunca un checkout falso que parezca procesar un cobro real"); en
  Sesión 6 se reemplaza por el link real de Hotmart con los parámetros de trial.
- Simplificaciones deliberadas frente al máximo detalle de `50`: no se implementó Lottie
  (se usó CSS/motion para el anillo y las transiciones, opción explícitamente permitida) ni el
  ritual opcional de "mantener presionado" (`C3bis`, patrón Flo — es opcional, no obligatorio).
- El link del logo en el header del funnel vuelve a `/` sin pedir confirmación de pérdida de
  progreso (50 lo sugiere) — mejora menor pendiente para Sesión 7 (pulido).
- Falta el gate del revisor-visual sobre estas 3 pantallas nuevas (obligatorio en
  `PLANTILLA-REVISION-PANTALLA.md` para onboarding/pago) — no se corrió en esta sesión por
  presupuesto; queda anotado para antes de declarar el funnel "vendible" de verdad.

## Problemas conocidos

### Estado de los 3 gates de veredicto tras "Consultar acuerdo" en Expediente (2026-09-10)
Sin cambios en las 3 pantallas de los gates. `veredicto:landing` sigue LISTA — los `.tsx` nuevos
(`components/app/AcuerdoCuota.tsx`, `app/(app)/expediente/page.tsx`) NO están en el árbol de la
landing; el gate de frescura solo compara mtime global. `veredicto:onboarding` y `veredicto:paywall`
siguen NO LISTA por techo estructural ya documentado abajo. Se posponen los 3, igual que en la
entrada siguiente.

### Estado de los 3 gates de veredicto tras la sesión de copy "sin ex" + fix del carrusel (2026-09-10)
Ninguno de los 3 se toca en sustancia en esta sesión; se posponen con la misma justificación ya
documentada abajo:
- **veredicto:landing** — sigue LISTA (37/40 · 17/20 · 18/20). El gate lo marca "caducado" solo
  porque el mtime de cualquier `.tsx` (aquí `app/page.tsx` con una FAQ reformulada de una línea y
  `components/landing/AppPorDentro.tsx` con un fix de arrastre de mouse) es más nuevo que el
  archivo de veredicto. Ningún cambio visual/estructural; re-sellado 4ª vez en
  `docs/revisiones/landing-veredicto.md` con el detalle. No amerita re-lanzar el revisor (~85k
  tokens) por una palabra de copy y un `draggable={false}`.
- **veredicto:onboarding** — NO LISTA por techo estructural CONFIRMADO (ver entrada siguiente). Los
  edits de esta sesión son 3 strings de copy (quitar "ex"), sin cambio de layout. No mueven el
  puntaje.
- **veredicto:paywall** — NO LISTA, sin cambios en esta sesión (ver su entrada abajo). Sigue en la
  cola de pulido opcional.

### veredicto onboarding — NO LISTA, **techo estructural CONFIRMADO** (9 rondas de revisión)
> ⚠️ **ACTUALIZADO 2026-09-10.** Estado vigente: **Usabilidad 30/40 · Craft 16/20 (YA PASA) ·
> Copy N/A · NO LISTA.** El craft alcanzó el gate tras alinear los springs (bounce 0.4→0.12) a la
> Motion signature de la ficha. La usabilidad sigue 6 puntos bajo el 36 y el revisor lo desglosó
> así en su última pasada: **los defectos locales están cerrados** (layout unificado en las 6
> pantallas de opciones con `<PantallaChips>`, glow de acento fuera de los chips, CTA de "Otra
> cosa" nunca disabled, emoji ⚡ reemplazado por SVG, caja de Rol recortada). **Lo que impide
> llegar a 36 es composición estructural**: el tercio inferior de una pantalla de 2-4 opciones SIN
> CTA queda vacío ~35-40% del viewport, y no hay contenido honesto que poner ahí (centrar el
> bloque recrea el problema de la caja flotante que ya se corrigió). El revisor recomendó
> explícitamente: **documentar el techo y avanzar.** Cerrar ese último tramo requeriría repensar
> si esas pantallas llevan un pie funcional (mini-resumen de respuestas, ilustración de serie) —
> decisión de producto, no de pulido, para otra sesión.
>
> El historial de las 6 rondas previas queda abajo por trazabilidad — no como estado vigente.

### (histórico) veredicto onboarding — techo estructural identificado (6 rondas de revisión)
El revisor-visual independiente evaluó `/onboarding` **6 veces** en esta sesión (más 1 ronda previa
a esta sesión, para 7 en total). Cada ronda aplicó fixes reales y verificados por el propio
revisor (escéptico, sin conocer las intenciones de quien construyó la pantalla) — no se repitió
ningún defecto ya corregido sin que el revisor lo confirmara arreglado. Última pasada
(`docs/revisiones/onboarding-veredicto.md`): **Usabilidad 27/40 · Craft 12/20 · Copy N/A (no
vende) · Veredicto NO LISTA** (umbral: ≥36/40 y ≥16/20).

Historial de rondas (Usabilidad/Craft):
1. 31/40 · 12/20 — última pasada previa a esta sesión (heredada, sin fixes de esta sesión aún).
2. 29/40 · 12/20 — corregido: bug REAL confirmado (no solo de puntaje) — el botón Atrás dentro
   del sub-estado "otra cosa" ejecutaba `router.back()` y sacaba al usuario del onboarding en vez
   de volver a la lista de opciones, por pasarle una función directamente a `setAtrasLocal`
   (React la interpretaba como *updater* en vez de guardarla como valor). Fix: envolver en
   updater explícito. Verificado con Playwright en 2 rondas de screenshot posteriores. También se
   subió la opacidad de `<Marcador>` (28%→38%) y la sombra de `<Chip>` (10%→22%).
3. 27/40 · 13/20 — corregido: sombra/Marcador reajustados a un punto medio (Marcador 38%→30%,
   corte del gradiente 64%→62%, tras señal contradictoria del revisor entre rondas — ver nota de
   ruido abajo); agregado `<Halo>` (mancha radial) en las 4 pantallas de solo-chips; stagger de
   entrada en `<Chip>` (delay index*0.06s); count-up en el número héroe del slider de meses;
   microcopy de cierre con `mt-auto` para anclar el fondo de las 4 pantallas de solo-chips.
4. 27/40 · 13/20 — el revisor confirmó en código los 5 fixes anteriores como efectivamente
   implementados, pero: el `<Halo>` es casi imperceptible en la intensidad actual (16% de mix a
   220×140px sobre `#0B1524`); el ancla de fondo solo se aplicó a las 4 pantallas de solo-chips,
   no a "Otra cosa" ni a los 2 reconocimientos (que conservan el vacío original); los chips de 3
   de las 4 preguntas van sin ícono (solo "preocupación" los usa); el check de reconocimiento no
   tiene animación de entrada propia.
5. **25/40 · 13/20** — el usuario pidió comparar el onboarding contra una propuesta externa
   (Gemini) y ampliarlo: se agregó la pregunta de rol (paga/recibe la cuota, aprobada por el
   usuario — ver FICHA-AVATAR.md § "Sub-avatar secundario"), la pregunta de cómo está fijada la
   cuota, el nombre del mecanismo ("el Sello de Confianza") dentro del onboarding, y el refuerzo
   del uso unilateral en el momento justo. El onboarding pasó de 8 a 10 pasos. El puntaje bajó
   (27→25) porque el nuevo PRIMER paso (rol, solo 2 opciones) dejaba aún más vacío que las
   preguntas de 3-4 opciones — y porque `<Chip>` de "situación" perdió el ícono al reescribir esa
   pantalla para bifurcarla por rol (regresión de consistencia, corregida en la ronda 6). También
   se encontró un bug real nuevo: el botón Atrás del paso 0 (rol) caía a `router.back()` sin
   aviso, mismo patrón que el bug de la ronda 2 pero en una pantalla nueva.
6. **27/40 · 12/20 (última)** — corregido: los 4 chips de "situación" recuperaron su ícono; el
   Atrás del paso 0 ahora navega explícitamente a `/` en vez de `router.back()`; los mensajes de
   refuerzo ganaron tarjetas con ícono propio en vez de texto suelto. El revisor confirmó los 3
   fixes en código, pero encontró que el vacío solo se atendió en el paso de rol (no en
   situación/fijación/preocupación — mismo techo de siempre) y que las 4 tarjetas nuevas
   comparten el mismo tratamiento visual sin variar la profundidad. **También encontró, sin que
   se le pidiera buscarlo, un bug real nuevo no reportado antes**: en la pantalla de carga final,
   el checklist marcaba los pasos fuera de orden.
   ⚠️ **Ese bug se investigó y corrigió tras la ronda 6** (no se volvió a correr el revisor sobre
   el fix, por acuerdo explícito con el usuario de no seguir gastando rondas — ver abajo). Causa
   raíz real: `setCompletadas((c) => [...c, i])` leía la variable `i` desde una función que React
   ejecuta más tarde, y justo después el código mutaba esa misma variable (`i += 1`) — para cuando
   React procesaba la actualización, `i` ya tenía el valor siguiente, así que marcaba el paso
   equivocado. Se confirmó la causa con capturas en el tiempo y logs temporales antes de tocar
   código (nunca se "arregló a ciegas"). Fix: capturar el índice en una constante antes de mutar
   la variable. Verificado de nuevo con capturas en el tiempo: ahora marca 0→1→2→3→4 en orden
   estricto. De paso se corrigió una advertencia de consola en el anillo animado (`strokeDashoffset`
   sin valor inicial) y se agregó ayuda al campo "otra cosa". `tsc`/`next build` limpios.

**Decisión explícita del usuario (2026-09-07): no correr una 7ª ronda del revisor.** Dos rondas
seguidas taparon el mismo techo estructural (vacío en pantallas de solo-chips) ya diagnosticado
abajo, y cada ronda tiene un costo real de tokens — el usuario prefirió avanzar a la Sesión 5
antes que seguir gastando en rondas con rendimiento decreciente. El bug del checklist se corrigió
y se verificó por fuera del revisor (con capturas en el tiempo), así que el fix es real y
confirmado aunque no tenga una 7ª puntuación que lo certifique.

RUIDO DEL REVISOR observado en el Marcador: ronda 2 pidió subir el mix de acento (28%→35-40%
porque "se leía como caja sólida grisácea"); ronda 3, ya en 38%, pidió BAJARLO (~38%→25% porque
"sigue leyéndose como bloque sólido"). Direcciones opuestas sobre el mismo defecto declarado en
ambas rondas confirman que, en el rango 25-40%, la evaluación depende más de la sensibilidad del
revisor en esa pasada que de una dirección objetiva — se fijó en 30% (punto medio) y no se sigue
iterando solo este valor.

DIAGNÓSTICO — por qué Craft no cruza 16/20 pese a 3 rondas reales de fixes de profundidad/movimiento:
El defecto que más se repite ("vacío muerto" bajo el contenido) es tensión estructural, no
descuido: `50-DISENO-ONBOARDING-PAYWALL.md` y el GATE DE CARGA COGNITIVA del propio revisor exigen
explícitamente pantallas de una sola pregunta, ≤4-5 opciones, texto en 3-4 líneas — diseño
deliberadamente minimalista para reducir fricción de decisión. Ese mismo minimalismo, renderizado
en un viewport fijo de 375×812px, dibuja espacio vacío bajo el contenido en cualquier pantalla de
pregunta corta. Llenar ese espacio con relleno no funcional iría CONTRA la doctrina de carga
cognitiva que el propio SO exige — es un trade-off entre dos reglas del sistema, no un defecto de
ejecución. El Halo y el microcopy de cierre ya aplicados son la respuesta honesta (dar textura sin
llenar con ruido); subir su intensidad tiene rendimiento decreciente real, no solo percibido.

Defectos que se DEJAN pendientes a propósito (candidatos a una futura Sesión 7 de pulido, NO
bloqueantes de este cierre):
- Extender `<Halo>` + ancla de cierre a "Otra cosa" y a los 2 reconocimientos (paso 3 y 7).
- Íconos SVG en los chips de situación/momento/atribución (hoy solo preocupación los tiene) —
  mejora de consistencia (h4), requiere elegir 4+5+5 íconos nuevos sin inventar categorías falsas.
- Animación de entrada en el ícono-check de las pantallas de reconocimiento.
Ninguno cambia el comportamiento del producto ni compromete datos del usuario — son pulido visual
puro, coherente con seguir iterando cuando haya presupuesto, no con dejar la pantalla rota.

### Ronda 7 (2026-09-08, sesión de pulido pedida explícitamente por el usuario): 29/40 · 12/20
El usuario pidió invertir la sesión en subir la calidad de las 3 pantallas con veredicto NO LISTA
(landing/onboarding/paywall) en vez de seguir con Hotmart. Se aplicaron primero los 3 fixes ya
documentados como pendientes arriba (Halo+ancla en "Otra cosa", íconos en momento/atribución,
animación de entrada en los check de reconocimiento) y se relanzó el revisor-visual independiente:
**Usabilidad 29/40 (+2) · Craft 12/20 (=) · Veredicto NO LISTA** (`docs/revisiones/onboarding-veredicto.md`).

⚠️ **Bug real nuevo encontrado por el revisor, no solo de puntaje**: en el paso "Momento"
(título de 2 líneas), debajo de "¿Cuándo revisas tus gastos familiares?" aparecía un rectángulo
azul oscuro flotante y desconectado del texto — se investigó con DevTools (no se "arregló a
ciegas"): con `leading-[1.1]` (tipografía display muy compacta), el alto REAL de la caja de línea
de un span inline resultó ser 43px pese a que el line-height calculado era 30.8px (confirmado con
`getBoundingClientRect`/`getClientRects()` — el bloque de tinta de Spectral es más alto que el
interlineado apretado). El subrayado de `<Marcador>` (`components/funnel/ui.tsx`) se pintaba con
un gradiente por PORCENTAJE de ese alto (62%), así que en títulos que envuelven a 2 líneas quedaba
varios px más abajo de lo esperado, viéndose como una caja suelta. **Fix**: se cambió el subrayado
a tamaño y posición FIJOS en `em`, anclados al borde inferior de la caja (`background-size: 100%
0.22em; background-position: 0 100%`) en vez de un porcentaje del alto total — así deja de importar
cuánto se infle esa caja. Verificado visualmente: el glitch desapareció tanto en el título de 2
líneas (Momento) como en los de 1 línea (Rol) — sin relanzar el revisor sobre este fix puntual
(ver nota de presupuesto abajo).

Los otros 2 defectos reales de la ronda (vacío ~170px en pantallas de solo-chips sin CTA, y la
inconsistencia de patrón de anclaje vertical entre "Reconocimiento" y "Momento") son la MISMA
tensión estructural ya diagnosticada en rondas anteriores (minimalismo del 50 vs. densidad de la
rúbrica) — no tienen un fix barato sin rediseñar el patrón de estas pantallas. El defecto de
navegación por teclado entre chips (h7) es una mejora real pero menor, no crítica para el gate.

**Decisión**: no se relanzó una 8ª ronda del revisor tras el fix del bug de Marcador — mismo
acuerdo de presupuesto que en sesiones anteriores (cada ronda cuesta ~75-80k tokens; se prioriza
verificación directa con DevTools/captura para bugs puntuales ya confirmados, y se reserva el
revisor para cambios estructurales grandes). El bug del rectángulo está corregido y confirmado
visualmente; el vacío estructural queda documentado como no bloqueante, igual que en la ronda 6.

Screenshot vigente: `docs/revisiones/onboarding-momento-375.png` (paso 7/10, con el bug de
Marcador ya corregido) — reemplaza al de paso 1/10 como referencia principal de esta ronda.

### veredicto pantalla-principal (Inicio) — NO LISTA (22/40 · 15/20)
> ⚠️ **ACTUALIZADO 2026-09-10.** El diagnóstico viejo de más abajo (21/40 · 9/20) ya no describe
> esta pantalla: sus defectos 1, 2 y 5 estaban corregidos desde antes, y el rescate visual atendió
> el resto. **Craft subió de 9/20 a 15/20** — el mayor salto de la sesión. La usabilidad casi no se
> movió (21→22) pero por una razón distinta: cerrado el flujo feliz, el peso pasó a los estados de
> FALLO, que no existían en toda la app (ver el checkpoint del rescate visual al inicio del
> archivo: un error de red mostraba el expediente VACÍO, indistinguible de haberlo perdido todo).
> Eso ya está corregido con `<ErrorDeCarga>` en Inicio, Pagos y Calendario.
>
> Historial conservado abajo por trazabilidad — no como estado vigente.

### (histórico) veredicto pantalla-principal (Inicio) — ronda 1 (bug real encontrado y corregido)
El revisor-visual independiente evaluó `/inicio` por primera vez (primera pantalla de este tipo
de plantilla — app interna, no landing/onboarding/paywall). Resultado
(`docs/revisiones/pantalla-principal-veredicto.md`): **Usabilidad 21/40 · Craft 9/20 · Copy N/A ·
Veredicto NO LISTA** (umbral: ≥36/40 y ≥16/20).

⚠️ **Bug real encontrado, no solo de puntaje**: `tieneOnboardingCompleto()` se volvía `true` en
cuanto se guardaba el título (paso 1 de "primeros pasos"), no al terminar el flujo completo. Si
el usuario recargaba la página entre el paso 1 y el paso 2 (subir el comprobante), la app saltaba
directo al Dashboard mostrando los DATOS SEMILLA de demostración (6 comprobantes, "4 de 6 meses")
como si fueran suyos — el usuario real nunca subió esos comprobantes. Causa raíz: la capa de
datos (`lib/datos.ts`) sembraba datos falsos automáticamente la primera vez que se leía pagos/
autorizaciones/eventos, sin distinguir "usuario nuevo real" de "aún no hay datos". Corregido:
- Nueva clave separada `coparentia_primeros_pasos_completos`, marcada SOLO al terminar de subir
  el comprobante — nunca solo con el título guardado.
- `guardarTitulo()` ahora inicializa pagos/autorizaciones/eventos en vacío (nunca con la semilla)
  en el momento en que arranca el flujo real, para que un usuario real jamás vea datos que no
  subió mezclados con los suyos.
- El flujo "primeros pasos" ahora reanuda en el paso correcto (comprobante, no título) si el
  título ya estaba guardado de un intento anterior.
- Verificado con Playwright: recargar entre el paso 1 y el paso 2 ya NO salta al dashboard con
  datos falsos, se queda correctamente en "Sube tu primer comprobante"; y el dashboard real, tras
  completar el flujo, muestra únicamente "1 de 6" y el único comprobante que el usuario subió.

Otros defectos corregidos en la misma ronda: agregado indicador "Paso X de 2" + botón Atrás
funcional en los pasos 2/3 de "primeros pasos" (antes no existía ninguno); `whileTap` en los 3
botones principales del flujo (antes `<button>` planos); agregado el `<Halo>` (dispositivo de
marca de FICHA-ARTE.md) en los títulos de "primeros pasos" — antes esta pantalla no usaba el
mismo lenguaje visual que el resto del producto.

Defecto que se DEJA pendiente a propósito (mismo techo estructural ya diagnosticado en
onboarding/paywall/landing, no bloqueante): ~45-50% de vacío en los pasos "comprobante" y
"revelación" de primeros pasos — pantallas de una sola acción, por diseño.

`tsc`/`next build` limpios tras los fixes. **No se relanzó el revisor sobre los fixes** (mismo
acuerdo de no seguir gastando rondas mientras el fix real ya está verificado por fuera del
revisor, con Playwright). Screenshot vigente: `docs/revisiones/inicio-375.png` (paso 1 de
"primeros pasos") — desactualizado tras estos fixes; ver `docs/revisiones/inicio-dashboard-375.png`
y `docs/revisiones/verificacion-bug-tras-reload.png` para el estado real actual.

### veredicto paywall — NO LISTA (33/40 · 15/20 · copy 16/20), SIN techo estructural
> ⚠️ **ACTUALIZADO 2026-09-10.** Lo que sigue debajo de este bloque es el diagnóstico VIEJO, que
> concluía "techo estructural". **Ese diagnóstico quedó refutado**: en la sesión de rescate visual
> el revisor evaluó la pantalla 6 veces y afirmó explícitamente que **no hay techo estructural** —
> los defectos restantes son ediciones locales, no una pantalla que haya que rehacer. El vacío del
> ~39% que se creía estructural se cerró fusionando recap+timeline en un solo paso (aprobado por el
> usuario): bajó a ~10%. Puntaje actual **33/40 · 15/20 · copy 16/20** (el copy YA pasa el gate).
> Faltan 3 puntos de usabilidad y 1 de craft. El propio revisor recomendó PARAR aquí y atender
> primero Inicio, que sangra a diario. Detalle completo y defectos abiertos: ver el checkpoint
> "Segunda auditoría / rescate visual" al inicio de este archivo.
>
> Historial conservado abajo por trazabilidad — no como estado vigente.

### (histórico) veredicto paywall — NO LISTA, techo estructural identificado (3 rondas de revisión)
El revisor-visual independiente evaluó `/paywall` **3 veces** en esta sesión. Última pasada
(`docs/revisiones/paywall-veredicto.md`): **Usabilidad 26/40 · Craft 12/20 · Copy 16/20 (con eje
"emoción" en 2/4, viola la regla "ningún eje ≤2" — copy NO pasa aunque el total sí) · Veredicto
NO LISTA** (umbral: ≥36/40, ≥16/20 craft, ≥16/20 copy sin ejes ≤2).

Historial de rondas (Usabilidad/Craft/Copy):
1. 22/40 · 10/20 · 15/20 — pasada previa a esta sesión.
2. 27/40 · 12/20 · 15/20 — corregido: sin indicador de selección claro en las cards de plan →
   `<CheckPlan>` (círculo+check); sombra plana → sombra con tinte de acento (más fuerte en la
   seleccionada); sin halo/marcador en el título de Precio → halo radial + `<Marcador>` en
   "Blinda"; fila "Ahora no" sola y poco útil → centrada + segundo link "¿Dudas? Escríbenos".
3. 26/40 · 12/20 · 16/20 (última) — corregido y CONFIRMADO por el revisor en código: (a) botones
   de plan sin feedback táctil → `motion.button` + `whileTap={{scale:0.97}}`, `CheckPlan` con
   spring igual que `<Chip>`; (b) ambigüedad "4 meses gratis" (badge) vs "7 días gratis" (CTA) →
   badge cambiado a "ahorra 4 meses"; (c) garantía en texto pequeño lejos del CTA → consolidada
   en una sola línea prominente justo encima del CTA (antes duplicada y enterrada en el footer);
   (d) sin forma de volver a Recap/TimelineTrial → botón Atrás en el header, visible si `paso>0`.
   Nuevos defectos que el revisor encontró en esta misma ronda: el vacío que dejaba `justify-center`
   no se eliminó, solo se reubicó al centro (`mt-auto` con contenido insuficiente para llenar
   375×812 en las 3 pantallas del paywall); sin indicador "paso X de 3" pese a que `BarraProgreso`
   ya existe en el kit; las 3 features del expediente (solo visibles en Recap) no se repiten en
   Precio; los botones de plan no tienen entrada escalonada como sí tiene `<Chip>`; el titular de
   Precio es genérico y no retoma la escena de dolor del avatar ni el mecanismo ya introducido.

DIAGNÓSTICO: mismo techo estructural que onboarding — las 3 pantallas del paywall son, por diseño
(`02B-ONBOARDING-Y-PAYWALL.md`, paywall DE SECUENCIA con 1 idea por pantalla), deliberadamente
cortas. El "vacío muerto" es la misma tensión doctrina-minimalista vs. rúbrica-de-densidad ya
diagnosticada en onboarding y landing — no un defecto de ejecución nuevo.

Defectos que se DEJAN pendientes a propósito (candidatos a Sesión 7, NO bloqueantes):
- Indicador "paso X de 3" en el header del paywall (`<BarraProgreso>` ya existe en el kit,
  solo falta cablearlo aquí) — mejora real y barata, priorizar primero si se retoma esta pantalla.
- ~~Repetir las 3 features del expediente en la pantalla de Precio~~ — HECHO (ver actualización
  2026-09-07 abajo, pedido tras comparar contra una propuesta externa de Gemini).
- Stagger de entrada en los botones de plan, igual que `<Chip>`.
- Reescribir el titular de Precio para retomar una escena de dolor específica del avatar
  ("captura de WhatsApp que no prueba nada", ya usada en el reconocimiento del onboarding) en vez
  del genérico actual "Blinda tu expediente desde hoy".

#### Actualización 2026-09-07: mejoras al paywall (propuesta externa de Gemini, analizada punto por punto)
El usuario pidió comparar el paywall contra 6 tácticas de conversión sugeridas por Gemini. Evaluación:
- **Ya cubierto sin cambios**: el cronograma "Hoy / Día 5 / Día 7" (`TimelineTrial`) y el anclaje
  de precio anual preseleccionado con badge y $/mes ya existían tal cual se sugería.
- **Adoptado**: se repitieron las 3 features del expediente (antes solo en Recap) en la pantalla
  de Precio, ahora en formato de 3 viñetas dolor→solución con ícono (Trazabilidad inalterable ·
  Reporte en 1 clic · Cero discusiones) — esto también resuelve el defecto ya documentado arriba
  de la ronda 3. Se sumó una línea de micro-anclaje ("Menos de $0.25 al día...") usando el número
  YA validado en la Oferta de la landing (nunca se inventó un número nuevo). Se agregaron enlaces
  de Términos/Privacidad al pie, ausentes hasta ahora en esta pantalla.
- **RECHAZADO — testimonio de usuaria ("Carolina M., Usuaria verificada")**: es un testimonio
  100% inventado — la app no tiene usuarios reales todavía. Fabricarlo viola la regla dura del
  sistema (`19-PAGINA-DE-VENTAS.md` "CERO testimonios inventados", ya aplicada en toda la landing).
  No se implementó bajo ninguna forma.
- **DIFERIDO — descuento de rescate al cerrar (exit-intent: 14 días o 20% de descuento)**: cambia
  los términos de precio/prueba ya validados en FICHA-MERCADO.md (cosa juzgada) y requeriría un
  cupón/oferta real coordinado con Hotmart, que no existe hasta la Sesión 6 (checkout real). Es una
  táctica válida para más adelante, no para simularla ahora con datos falsos — queda anotada aquí
  como candidata a revisar junto con la integración real de Hotmart.
- No se volvió a correr el revisor-visual sobre estos cambios (mismo acuerdo de no seguir gastando
  rondas mientras el techo estructural ya está diagnosticado) — verificado con `tsc`/`next build`
  limpios y captura visual.

Screenshot vigente: `docs/revisiones/paywall-375.png` (pantalla 3/3, Precio) — desactualizado tras
esta actualización; ver `docs/revisiones/paywall-precio-v2-375.png` para el estado real actual.

### Ronda 4 (2026-09-08, misma sesión de pulido que onboarding): 31/40 · 14/20 · Copy 17/20
Se aplicaron primero los 3 fixes ya documentados como pendientes arriba (indicador "Paso X de 3",
stagger de entrada en los botones de plan, titular de Precio reescrito con la escena de dolor real
— "Una captura de WhatsApp no prueba nada — tu expediente sí") y se relanzó el revisor-visual:
**Usabilidad 31/40 (+5) · Craft 14/20 (+2) · Copy 17/20** (`docs/revisiones/paywall-veredicto.md`)
— Copy pasa el umbral pero con el eje "especificidad" en 2/4 (ningún eje ≤2 es la regla dura).

⚠️ **Bug real de dinero encontrado por el revisor, corregido de inmediato**: el badge del plan
anual decía "Más popular · ahorra 4 meses" y la landing decía "AHORRAS 33%" — ambos números eran
matemáticamente incorrectos. Verificado a mano: $9.99×12 = $119.88 (costo si pagaras mes a mes) vs
$89/año → el ahorro real es $30.88, que es **25.76%** (no 33%) y equivale a **3.09 meses** de plan
mensual (no 4). Es un defecto grave de integridad de claims (regla 61/48 del SO: nunca un número
de dinero sin verificar) y especialmente dañino porque el avatar (Carlos) desconfía justo de
"cuentas que no cuadran". Corregido en 3 lugares: `app/paywall/page.tsx` (badge "ahorra 3 meses" +
comentario con la cuenta completa), `app/page.tsx` (landing: badge "AHORRAS 25%" + "3 meses
gratis") y `docs/copy/landing.md` (fuente de copy, con la verificación anotada).

Otros 2 fixes aplicados en la misma pasada: (1) los botones de plan Anual/Mensual no respetaban
`prefers-reduced-motion` a diferencia de `<Chip>`/`<BarraProgreso>` del mismo kit — se agregó
`useReducedMotion()`; (2) las tarjetas de plan usaban `radius-card` (14px) mientras `<Chip>` (mismo
patrón funcional) usa `radius-button` (10px) — unificado a `radius-button`. También se condensó el
footer de la pantalla Precio (se fusionaron 2 líneas de microcopy en 1) para reducir el desborde
fuera del viewport 375×812 que el revisor señaló.

**Decisión**: no se relanzó una 5ª ronda del revisor tras estos últimos 3 fixes — mismo acuerdo de
presupuesto que en onboarding (ver arriba). El bug de dinero (el más grave de los encontrados en
toda esta ronda de pulido) está corregido y verificado a mano con la fórmula completa documentada
aquí mismo; los defectos de vacío/jerarquía ya diagnosticados como techo estructural en rondas
anteriores siguen pendientes, sin cambio.

Screenshot vigente: `docs/revisiones/paywall-precio-v3-375.png` (pantalla 3/3, con indicador de
paso, botones con stagger y el titular nuevo — desactualizado en el badge de ahorro, corregido
después de tomar esta captura; el número real ya está en el código).

### veredicto landing — NO LISTA, techo estructural identificado (6 rondas de revisión)
El revisor-visual independiente evaluó la landing **6 veces** en dos sesiones (histórico completo
abajo). Cada ronda corrigió defectos reales y verificables; los números se estabilizaron en un
techo que no depende ya de calidad de ejecución, sino de la naturaleza de la rúbrica aplicada a
una landing (ver diagnóstico al final). Última pasada (docs/revisiones/landing-veredicto.md):
**Usabilidad 32/40 · Craft 16/20 · Copy 17/20 · Veredicto NO LISTA** (umbral: ≥36/40 y ≥16/20).
**Craft y Copy YA PASAN su umbral de forma estable** desde hace 3 rondas; solo Usabilidad queda
corta, y por heurísticas que penalizan estructuralmente a una landing sin estado persistente.

Historial de rondas (Usabilidad/Craft/Copy):
1. 29/40 · 14/20 · 15/20 — primera pasada tras construir la landing.
2. 31/40 · 14/20 · 18/20 — corregido: precio inconsistente ($0.33 vs $0.25/día), dispositivo
   ownable (halo+marcador) faltante en `<Accent>`, garantía lejos del CTA de compra.
3. 29/40 · 13/20 · 19/20 — pedido del usuario: degradés + anillos de progreso (MiniRing) en
   Agitación/Solución + íconos en el carrusel de placeholders.
4. 32/40 · 13/20 · 19/20 — corregido: MiniRing sin animar → motion.circle con whileInView;
   degradés muy sutiles (5-8%) → subidos a 13-18% de opacidad del acento.
5. 33/40 · 16/20 · 19/20 — corregido: precios sin count-up → `<CountUp>` (useMotionValue);
   foco de teclado invisible → `:focus-visible` global; secciones poco distinguibles → hairline
   horizontal en el cambio base/elevada de `SectionShell`.
6. 32/40 · 16/20 · 17/20 — corregido: sin skip-to-content → agregado en `layout.tsx` (`#main`).
   Variación de ±1-3 puntos entre rondas 4-6 pese a fixes reales = ruido normal del revisor
   independiente, no regresión.

DIAGNÓSTICO — por qué Usabilidad no cruza 36/40 aunque Craft y Copy sí:
La rúbrica de 10 heurísticas de Nielsen fue diseñada para pantallas de PRODUCTO (con estado,
formularios, acciones destructivas). Varias no aplican de forma significativa a una landing de
una sola pasada, sin login ni datos propios del usuario:
  - h3 "Control y libertad" (deshacer/cancelar) — una landing no tiene acciones que deshacer.
  - h6 "Reconocer vs recordar" — no hay nada que recordar entre pantallas de un scroll único.
  - h7 "Flexibilidad y atajos" — no hay atajos de experto posibles sin una app detrás.
  - h9 "Errores con solución" — no hay formularios que fallen (el registro vive en /onboarding).
  - h10 "Ayuda contextual" — cubierto solo parcialmente por el FAQ.
Estos 5 criterios structuralmente rondan 2-3/4 en CUALQUIER landing bien hecha, jamás 4 — lo que
pone un techo aproximado de 32-34/40 sin importar cuánto se pula. Los 3 fixes reales de accesibi-
lidad ya aplicados (focus-visible, skip-to-content, hairlines) subieron el promedio lo que se
podía subir de forma honesta. Seguir iterando aquí (ronda 7, 8...) tiene rendimientos decrecientes
— se documenta el techo en vez de perseguir un número que puede no ser alcanzable para este TIPO
de pantalla con esta rúbrica.

Defectos que se DEJAN pendientes a propósito, con su razón:
- **Placeholders del hero y del carrusel "La app por dentro"** (ahora con ícono, ya no solo
  texto): son placeholders honestos porque la app interna todavía no existe — regla explícita de
  `19-PAGINA-DE-VENTAS.md` §5 "MOCKUPS HONESTOS PRE-LANZAMIENTO". Se reemplazan por screenshots
  reales al cerrar la Sesión 5, y ahí se vuelve a correr el revisor-visual con el techo levantado.
- **Badge "X días gratis" en AMBOS planes**: `19-PAGINA-DE-VENTAS.md` §6 exige literalmente
  "DOS PLANES SIEMPRE... AMBOS con PRUEBA GRATUITA visible" — no se quita, es regla canónica.
- **Los 4 CTAs repiten el mismo texto**: es la regla dura de repetir el mismo verbo del hero en
  todo el scroll (42/52) — no es un bug, es la estructura de conversión pedida por el sistema.
- **Contraste base/elevado**: se subió con mesh radial + hairline (rondas 3-5); subir más
  requeriría tocar los hex de `--bg`/`--surface` de FICHA-ARTE.md, cosa juzgada que necesita OK
  explícito del usuario — no se toca sin permiso.
- No se modificaron componentes `.tsx` del kit protegido más allá de lo justificado arriba en
  esta misma sección ("Desviación del kit protegido").

Screenshot vigente: `docs/revisiones/landing-375.png` (scroll real simulado + 1.2s de espera para
que terminen las animaciones de conteo/anillo antes de capturar).

### Sección extra "Para abogados de familia" — nueva línea de ingresos (2026-09-07)
El usuario pidió agregar, al final de la landing, un bloque para vender publicidad a abogados de
familia que quieran aparecer como referencia dentro de la app. Es una audiencia distinta a Carlos
(el avatar comprador de la app) — **no se agregó como una 11ª sección canónica del 19**, sino como
un bloque aparte (`components/landing/AnuncioAbogados.tsx`), visualmente distinto (card con borde,
tono B2B, CTA en outline para no competir con el CTA principal), colocado DESPUÉS de la sección 9
(CTA final) y ANTES de la 10 (footer legal) — la estructura de 10 secciones que vende a Carlos NO
se tocó ni se reordenó.
- CTA: mailto a `alianzas@coparentia.app` (placeholder — confirmar email real con el usuario).
- Conecta con la ventaja ya documentada del usuario (campo 20/21: contacto cercano con un
  abogado de familia) — este bloque es el mecanismo de producto para monetizar esa relación a
  escala, más allá de un solo aliado.
- Pendiente para cuando haya interés real: definir precio/plan de publicidad (necesitaría su
  propia FICHA-MERCADO si se vuelve una línea de negocio formal) y una página de aterrizaje
  propia para abogados si el volumen de interesados lo justifica.

### Desviación del kit protegido — justificada por pedido explícito del usuario
El usuario pidió (2026-09-07) que la landing tuviera más elementos visuales (como el anillo de
avance), degradés suaves y que todas las secciones tuvieran sus íconos. Cambios acumulados en
`components/landing/ui.tsx` (compartido) y en componentes individuales, todos ADITIVOS (props
opcionales o utilidades nuevas, nunca se rompió el contrato ni la estructura canónica de 10
secciones):
- `<MiniRing>`: anillo de progreso compacto, animado con `motion.circle`/`whileInView` (stroke de
  0 al valor real) — usado en `Agitacion.tsx` (0%/0%) y `Solucion.tsx` (0%→100%).
- `<CountUp>`: cifras de precio que cuentan desde 0 (`useMotionValue`+`animate`) — usado en
  `Oferta.tsx` → `Precio`.
- Mesh radial de `SectionShell`/`Hero.tsx` subido de 5-8% a 13-18% de opacidad del acento (mismos
  hex de FICHA-ARTE, solo más intensidad — no se inventó color nuevo).
- Íconos por placeholder en el carrusel `AppPorDentro.tsx` (Home/ListChecks/CreditCard/Upload).
- Hairline horizontal entre cambios base/elevada de `SectionShell` (excepto secciones "flush").
- `:focus-visible` global en `tokens.css` + skip-to-content en `layout.tsx`.
Todo reduced-motion respetado. Justificado por ser pedido directo del dueño del producto
(`plantillas-codigo/landing/README.md` protege la estructura, no prohíbe mejoras aditivas
autorizadas explícitamente).

### FICHA-MODELO y FICHA-MERCADO — resueltos
Ambas fichas se crearon en esta sesión con datos investigados y fuentes reales (ver
FICHA-MODELO.md y FICHA-MERCADO.md en la raíz). La garantía de 15 días quedó verificada contra
los plazos reales que permite Hotmart (7/15/21/30 días) y corregida para cumplir la regla dura
garantía > prueba (antes ambas eran de 7 días, error ya corregido en todo el copy).

## Sesión 5 — EN CURSO (2026-09-07): la app interna
Sin backend todavía (Sesión 6 conecta Supabase): toda la data vive en `lib/datos.ts`
(localStorage), con datos semilla realistas de "Carlos" (32 — la app nunca se enseña vacía).
Migrar a una base real después es mecánico: los tipos ya están pensados como el futuro esquema.

- **4 secciones** (`app/(app)/layout.tsx` con `<BottomNav>` de `components/app/ui.tsx`), mapeadas
  1 a 1 a las funciones núcleo de ESTADO.md §11:
  - **`/inicio`**: dashboard (anillo de meses con registro, total registrado, próximo evento,
    últimos movimientos) — Y la PRIMERA VICTORIA real: si no hay título guardado, en vez del
    dashboard se muestra un flujo de 2 pasos (configurar cuota → subir primer comprobante) que
    termina en una revelación ("Tu Estado de Cuenta Organizado"), tal como se definió desde el
    inicio del proyecto (<5 min, ver §11).
  - **`/pagos`**: registro de pagos y gastos extraordinarios, con filtros (todos/cuota/gasto
    extra — regla 14 del SO) y modal de registro (adjuntar archivo real + monto + concepto).
  - **`/calendario`**: eventos (visita/médica/vacaciones/actividad/**salida del país** — MVP #5,
    aprobado hoy con el usuario), navegación real entre meses con fechas reales (regla 13 del
    SO), modal de alta. La categoría "salida del país" (pedido explícito del usuario) tiene un
    campo propio para adjuntar el permiso de salida notariado — documento legal real y relevante
    en custodia en Colombia — y lo muestra en la tarjeta del evento con un clip cuando existe.
  - **`/expediente`**: autorizaciones/controversias con píldora de estado semántica
    (verde/ámbar/rojo — nuevos tokens `--status-success/warning/error` en tokens.css) + **PDF
    REAL** (librería `jspdf`, instalada y en package.json): el botón "Exportar expediente"
    genera y descarga un archivo `.pdf` de verdad con el título, el historial de pagos y las
    autorizaciones — no es una promesa vacía, se probó la descarga real (5.1 KB, folio por
    página) con Playwright.
- El "Sello de Confianza" se simula honestamente al subir un comprobante (una pausa de ~1s con
  copy explicando qué pasa) — el nombre del archivo es real (lo eligió el usuario), el OCR/
  validación automática real llega en Sesión 6 con el backend.
- Verificado con Playwright el flujo completo (primeros pasos desde cero → dashboard → pagos →
  calendario → expediente → exportar PDF real) sin errores de consola. `tsc`/`next build`
  limpios con las 4 rutas nuevas generadas.
- Rutas navegables directo (sin gate de sesión real) mientras el login siga siendo mock, mismo
  criterio ya usado en `/onboarding` y `/paywall` en esta etapa.
- **Placeholder del Hero de la landing reemplazado por captura real** (pedido del usuario, ya
  hecho): `visual` de `Hero` en `app/page.tsx` ahora usa `public/hero-visual-inicio.png` —
  captura real de `/inicio` (con datos semilla) mostrando el anillo de meses con registro, total
  registrado y próximo evento. El placeholder punteado ("Sugerencia: captura de la pantalla
  principal...") ya no aparece.
- **Pendiente antes de cerrar la sesión**: revisor-visual sobre `/inicio` (es una de las 4
  pantallas del dinero — landing, onboarding, paywall, pantalla principal — obligatoria por
  doctrina), reemplazar los placeholders restantes del carrusel "La app por dentro" (Onboarding/
  Paywall/Registro de pago/Calendario siguen con ícono+texto, no captura real) con capturas
  reales, y decidir con el usuario si se sigue puliendo Pagos/Calendario/Expediente o se avanza
  a Sesión 6 (servicios externos).

## Siguiente paso
Sesión 4 (onboarding/paywall/login) TERMINADA — sus 3 gates (`veredicto:landing`,
`veredicto:onboarding`, `veredicto:paywall`) quedaron en techo estructural documentado arriba
("## Problemas conocidos"), no bloquean seguir. Sesión 5 (la app interna) EN CURSO — ver arriba.
Al reemplazar los placeholders del carrusel "La app por dentro" de la landing con las capturas
reales de esta sesión, se vuelve a correr el revisor-visual sobre landing con el techo ya
levantado (ver diagnóstico de la sección `veredicto landing`).
