# ESTADO.md — Coparentia (nombre provisional: PensiónClara)

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
  Vercel exige sesión iniciada en deployments; normal, no es un bug). Protección de acceso de
  Vercel (pide login) sigue activa a propósito — se desactiva justo antes del lanzamiento
  público, no antes.
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

### veredicto onboarding — NO LISTA, techo estructural identificado (6 rondas de revisión)
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

### veredicto pantalla-principal (Inicio) — NO LISTA, ronda 1 (bug real encontrado y corregido)
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

### veredicto paywall — NO LISTA, techo estructural identificado (3 rondas de revisión)
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
