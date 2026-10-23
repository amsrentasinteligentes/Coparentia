# CERTIFICADO PRE-LANZAMIENTO — Coparentia (2026-10-22)

**Producción auditada (mañana):** coparentia.co, commit `6fe327a`. **Producción actual (noche):** commit `e0afb60`.

## ACTUALIZACIÓN DEL 23/10/2026 (mañana) — ❌ NO APTO todavía — 69 / 100 (antes 62; el 22/10 por la mañana, 57)

Producción actual: commit `94b4ec3` (rediseño publicado en `7cc1e98`). Sigue en NO APTO: 69 es menor que 80 y falta el bloqueante de dinero
(cobro y reembolso reales). Los puntos de Venta y Recorrido salen de veredictos del revisor visual independiente; los demás son **estimación mía**
con la evidencia citada.

| Pilar | 22/10 noche | Ahora | Evidencia |
|---|---|---|---|
| VENTA (página principal) | 16 | **18** | Revisor, ronda 4: 38/40 usabilidad · 16/20 diseño · 17/20 texto, **LISTA** (antes 30 · 15 · 15). Diseño justo en el mínimo. |
| FUNNEL (recorrido y planes) | 13 | **16** | Onboarding 37/40 · 16/20 · 16/20 **LISTA** y planes 38/40 · 16/20 · 16/20 **LISTA** (antes 30 · 14 · 14 y 30 · 14 · 15). Falta confirmar el puente de la prueba (aviso del día 5 y primer cobro reales). |
| PRODUCTO (dentro de la app) | 7 | 7 | Sin cambios: Inicio 29/40 · 12/20 NO LISTA; Pagos, Calendario, Expediente, Especialistas, Perfil y Ajustes sin puntuar. **Es el pilar más flojo.** |
| CONFIANZA | 13 | 13 | Sin cambios: falta cobro y reembolso reales, CSP activo, Supabase Free (riesgo aceptado). |
| VELOCIDAD | 4 | **6** | Lighthouse móvil sobre coparentia.co (23/10): rendimiento **83** (antes 75), LCP **4,0 s** (antes 6,2 s; meta ≤2,5 s), CLS 0, TBT 100 ms, accesibilidad 98, buenas prácticas 100, SEO 92. |
| RETENCIÓN | 9 | 9 | Sin cambios hasta confirmar los latidos de pre-cobro y pagos fallidos (primer día real: 23/10) y el aviso de cobro (26–27/10). |
| **TOTAL** | **62** | **69** | NO APTO (<80 y con bloqueante de dinero). |

**Qué falta para llegar a 80 o más (en orden de peso):**
1. **PRODUCTO (+6 a +10):** puntuar con el revisor las pantallas internas (Inicio, Pagos, Calendario, Expediente, Especialistas, Perfil, Ajustes) y subir las que queden bajo 36/40.
2. **Cobro y reembolso reales (29/10 al 6/11):** quita el bloqueante de dinero y sube Confianza (+2).
3. **Retención (+2 a +3):** confirmar latidos de las tareas del dinero y el aviso de cobro del 26–27/10.
4. **Velocidad (+2):** bajar el LCP de 4,0 s a ≤2,5 s (aligerar el JavaScript del inicio y la foto del hero).

---

## ACTUALIZACIÓN DE LA NOCHE (2026-10-22) — ❌ NO APTO todavía — 62 / 100 (antes 57)

El veredicto sigue en NO APTO: hay un bloqueante de dinero abierto (reembolso y primer cobro reales sin probar) y 62 es menor que 80. Los puntajes de los pilares sin pantallas son **estimación mía** con la evidencia de abajo; los de VENTA, FUNNEL y PRODUCTO dependen del revisor visual y **no se volvieron a medir** (no lo lanzamos por orden del dueño).

| Pilar | Antes | Ahora | Qué cambió |
|---|---|---|---|
| VENTA | 16 | 16 | Sin cambios; el revisor sigue en 30/40. |
| FUNNEL | 13 | 13 | Sin cambios. |
| PRODUCTO | 6 | 7 | Costo de IA medido en la base real (16 llamadas, US$0,035, tope diario puesto, saldo de Anthropic US$4,97 sin recarga automática). |
| CONFIANZA | 10 | 13 | Next actualizado y publicado (0 vulnerabilidades); Sentry probado; vigilancia de disponibilidad y status page; prueba de aislamiento entre cuentas aprobada en títulos, pagos y archivos; revisión legal cerrada (dueño); correo de soporte de Hotmart. Falta: reembolso/cobro reales, CSP activo, Supabase Free. |
| VELOCIDAD | 4 | 4 | No se volvió a medir en producción. |
| RETENCIÓN | 8 | 9 | Latidos en las 4 tareas del dinero (1 probada en vivo) y alarma de tendencia de correos. Falta comprobar la entrega real del aviso de cobro (26–27/10). |
| **TOTAL** | **57** | **62** | NO APTO (<80 y con bloqueante de dinero). |

### Bloqueantes: estado de la noche
| # | Bloqueante | Estado |
|---|---|---|
| 1 | Producción con Next vulnerable | ✅ CERRADO: publicado y verificado. |
| 2 | Prueba real de cancelación y reembolso | ⚠️ PARCIAL: cancelación en prueba y cierre del acceso verificados; **falta el cobro real (29/10) y el reembolso (antes del 6/11)** con la compra `+prueba2`. |
| 3 | Supabase Free (pausa a los 7 días, sin copias restaurables) | ⚠️ RIESGO ACEPTADO por el dueño, con alerta automática al llegar a 3 clientes que pagan y revisión mensual. Ya hay 1 cliente real que pagó (23/09). |
| 4 | Sin vigilancia de errores ni página de estado | ✅ CERRADO: Sentry (servidor) probado; Better Stack con 3 monitores; status page creada (sin enlazar aún); latidos de las 4 tareas del dinero. |
| 5 | Acceso cruzado entre usuarios (IDOR) | ⚠️ PARCIAL: probado con datos reales en títulos, pagos y archivos (0 filas vistas); en eventos, hijos y constancias solo por lectura de código; sin probar escrituras cruzadas. |
| 6 | Tres pantallas en 30/40 | ❌ ABIERTO: decidir aceptar o rediseño de marca. |
| 7 | App interna medida solo en parte | ❌ ABIERTO (el primer arranque sí se recorrió). |
| 8 | Costo de la IA por usuario sin medir | ✅ CERRADO: medido; sin tope por persona (un abusador agota el tope del día para todos; la app degrada a monto manual). |
| 9 | Cuenta `demo@coparentia.co` en producción | ⚠️ DECIDIDO: se deja por ahora; con `auditoriasrentas` queda por decidir. Se borraron 4 cuentas y una notificación de prueba. |
| 10 | **Nuevo:** tope de 100 correos/día de Resend (plan gratis) | ⚠️ ABIERTO antes de publicidad: pasar Resend a plan pago y subir el límite de Supabase (30/h → ~150/h). La alarma automática avisa con un día de retraso. |

### Gates que cambian
- Gate 1 (superficie y autenticación): ✅ con IDOR parcialmente probado.
- Gate 6 (IA): ✅ el costo por usuario ya está medido.
- Gate 10 (analítica y operación): ✅ Sentry y vigilancia; ❌ sin piloto de 5 a 10 compradores.
- Gates 2 y 9 siguen igual (sin reembolso real; sin pruebas automáticas ni CI).

### Pendientes con fecha
- **23/10, después de las 10 am (Colombia):** confirmar en Better Stack que los latidos de pre-cobro y pagos fallidos están en Up.
- **26–27/10:** aviso de cobro al alias `+prueba2`; revisar si el recibo de Hotmart todavía muestra el correo viejo del vendedor.
- **29/10 → 6/11:** cobro real y reembolso.

---

## Versión de la mañana (histórica) — ❌ NO APTO — 57 / 100

Regla del sistema: un solo bloqueante de dinero, acceso, privacidad o seguridad deja el veredicto en NO APTO sin importar el puntaje. Hay varios (abajo). Menos de 80 puntos también es NO APTO.

| Pilar | Puntos | En simple |
|---|---|---|
| VENTA (página principal) | **16 / 20** | Estructura completa; el revisor la puntúa 30/40 usabilidad, 15/20 diseño, 15/20 texto. |
| FUNNEL (recorrido y planes) | **13 / 20** | Recorrido y planes completos; el revisor da 30/40 y 14/20 en ambos; el puente de la prueba (día 1 a 7) está a medias. |
| PRODUCTO (dentro de la app) | **6 / 20** | Medí **Inicio** (29/40 · 12/20, NO LISTA) y recorrí el **primer arranque** de una cuenta nueva (estados vacíos de Inicio, Pagos, Calendario, Expediente, Perfil y Ajustes: claros y sin errores); el resto del puntaje con el revisor sigue sin medir. |
| CONFIANZA (seguridad, legal, pago) | **10 / 15** | Muy buena base de seguridad y legal; faltan pruebas reales de cancelación y reembolso, prueba de acceso cruzado entre usuarios y un CSP activo. |
| VELOCIDAD | **4 / 10** | Cambio de diseño estable (CLS 0) y poco bloqueo; pero el contenido principal tarda ≈5–6 s en celular lento (debería ser ≤2,5 s). |
| RETENCIÓN | **8 / 15** | Recordatorios, avisos de cobro y recuperación de pagos existen en código; falta medir embudo y comprobar entrega real. |
| **TOTAL** | **57 / 100** | Banda <80 = NO APTO |

## Lo que encontré y ya corregí en la rama (sin publicar)
1. ✅ **Next.js desactualizado con 7 avisos de seguridad** (uno "crítico" que no afecta a este sitio porque no usa `next/og`, y uno "alto" de optimización de imágenes que sí podía afectar). Actualizado de 16.3.4 a 16.4.2 y limpiadas 3 dependencias más: `npm audit` pasó de 4 vulnerabilidades (1 crítica, 2 altas) a **0**.
2. ✅ **CSP en modo solo-reporte** añadido (no bloquea nada; permite observar antes de activarlo).
3. ✅ **Imagen de 341 KB** (isotipo) reducida a 18 KB; foto del hero a webp (92 KB → 23–51 KB); la foto ya no espera al JavaScript para pintarse; capturas con dimensiones para evitar saltos.
4. ✅ **Lint:** 8 errores corregidos (comillas en textos y un enlace sin `Link`); quedan 22 conocidos (21 de patrón de React con efectos y 1 `any` del aviso de Hotmart).
5. ✅ **`/api/version`**, `README.md`, script `typecheck`, y los documentos de `docs/release/` más `docs/MANUAL-DEL-DUENO.md`.
6. ✅ `tsc` sin errores y `npm run build` correcto con la versión nueva.

## Bloqueantes abiertos (❌) — lo que impide cobrar
| # | Bloqueante | Qué hace falta | Quién |
|---|---|---|---|
| 1 | **Producción sigue con Next 16.3.4 vulnerable** | Publicar esta rama (di "publica") | Dueño |
| 2 | **Prueba real de cancelación y reembolso en Hotmart nunca hecha** (pospuesta desde septiembre) | Compra de prueba, cancelarla y reembolsarla; pasa dinero, requiere tu permiso | Dueño |
| 3 | **Supabase Free** se pausa a los 7 días sin actividad y no restaura copias | Pasar a Supabase Pro (US$25/mes) antes del primer cliente | Dueño |
| 4 | **Sin vigilancia de errores ni página de estado** (no hay Sentry) | Crear cuenta gratis en Sentry y una vigilancia de disponibilidad; yo la conecto | Dueño + yo |
| 5 | **Sin prueba de acceso cruzado entre usuarios (IDOR)** | Dos cuentas de prueba (la demo y otra) para intentar leer los datos del otro, desde la pantalla y desde la API | Dueño + yo |
| 6 | **Tres pantallas por debajo del 36/40** (30, 30, 30) | Decidir: aceptar el 30 para vender, o un rediseño visual de marca | Dueño |
| 7 | **App interna medida solo en parte:** Inicio 29/40 · 12/20; Pagos, Calendario, Expediente, Especialistas, Perfil y Ajustes recorridos a ojo (sin errores de consola) pero sin puntuar; sin probar estados vacío/error/sin conexión ni el primer arranque | Puntuar el resto con el revisor, y una cuenta nueva para ver el primer arranque | Dueño + yo |
| 8 | **Costo de la IA por usuario sin medir** | Pasarme el total de `ai_calls` de Supabase | Dueño |
| 9 | **Cuenta `demo@coparentia.co` existe en producción** | Decidir si se borra o se deja (tiene datos inventados) | Dueño |

## Pendientes menores (⚠️)
- ~~Revisión de abogado de privacidad/términos y de la sección 6.9~~ — CERRADA: el dueño confirmó (22/10/2026) que la revisión legal quedó ok.
- Verificar en el panel de Hotmart que el producto tenga prueba de 7 días y garantía de 15.
- CSP: observarlo con tráfico real y luego pasarlo a modo activo.
- Velocidad: LCP todavía ≈5 s en celular lento; requiere aligerar el JavaScript del inicio.
- El nombre del vendedor en Hotmart (`amsrentasinteligentes`) aparece al pagar.
- Terms de Vercel: el plan Hobby es de uso personal; para vender conviene Vercel Pro (verificar en sus términos).
- Piloto con 5 a 10 compradores reales antes de abrir tráfico.

## Gates binarios (docs/sistema/61)
| Gate | Resultado |
|---|---|
| 1 Superficie y autenticación | ✅ sin rutas demo/debug/bypass; contraseña solo para cuentas creadas a mano, con captcha; ⚠️ IDOR sin probar |
| 2 Pagos | ⚠️ código sólido (firma, catálogo, idempotencia, estados); ❌ sin prueba real de cancelación/reembolso |
| 3 Promesas vs capacidad | ⚠️ ver `CLAIMS-LEDGER.md` (ninguna promesa sin capacidad; varias a re-verificar) |
| 4 Consentimiento y archivos | ✅ comprobantes en bucket privado con RLS por carpeta; ⚠️ borrado E2E sin probar |
| 5 RPC y estado confiable | ✅ 19 tablas con RLS declarada; las 14 migraciones con funciones `security definer` fijan `search_path` (revisión por búsqueda, no por llamadas reales desde un usuario sin sesión) |
| 6 IA | ✅ clave en servidor, modelo en variable, freno de gasto y degradación; ❌ costo por usuario sin medir |
| 7 Dinero y monedas | ⚠️ cobro en USD por Hotmart; la app no suma monedas |
| 8 UX honesta | ✅ precio, renovación y primer cobro visibles antes del pago; X cierra |
| 9 Repositorio y release | ❌ sin pruebas automáticas ni CI; ✅ build, tipos y auditoría de dependencias limpios en la rama |
| 10 Analítica, operación y piloto | ❌ sin Sentry/estado; sin piloto |

## Test de estreno (encarnando al avatar)
Recorrí la página principal, el recorrido y los planes como una persona que paga la cuota y teme que la llamen "mala paga". Tres fugas detectadas: (1) el aviso de "7 días gratis" no dice arriba que se pide medio de pago; (2) la sección de agitación usa lenguaje legal ("actuación judicial o extrajudicial") donde el avatar esperaba su escena de WhatsApp; (3) en el paso 2 de planes hay mucha letra chica junto al botón de pago. No las corregí porque tocan texto de venta que decides tú.

## Evidencia
- Auditoría de dependencias, lint y build: salida de `npm audit`, `npm run lint`, `npm run build` (22 de octubre de 2026).
- Lighthouse móvil sobre coparentia.co: rendimiento 75, accesibilidad 99, SEO 92, buenas prácticas 100, LCP 6,2 s, CLS 0, TBT 180 ms. Misma medición sobre la compilación local corregida: 79–82, LCP ≈5 s, CLS 0.
- Revisor visual (ronda r27): `docs/revisiones/landing-veredicto.md`, `onboarding-veredicto.md`, `paywall-veredicto.md` (30/15/15, 30/14/14, 30/14/15) y sus capturas `r27*`.
- Cabeceras de producción verificadas con `curl -I`.

## Evidencia añadida el 2026-10-22 (tarde)
- **Login por enlace:** falló en la ventana integrada del asistente (la verificación anti-robot de Cloudflare, Turnstile, no entregó permiso a ese navegador; sin ella Supabase responde `captcha_failed`) y **funcionó en un Chrome normal**. Sin confirmar un fallo real de producción.
- **CSP en solo-reporte ya sirvió:** marcó que Turnstile (`challenges.cloudflare.com`) falta en la lista. **Antes de activar el CSP hay que agregar ese dominio a `script-src`, `frame-src` y `connect-src`.**
- **Seguridad comprobada con llamadas reales a producción (sin sesión):** `/inicio`, `/pagos`, `/expediente`, `/admin` redirigen al login; los 5 `cron` responden 401; el webhook de Hotmart sin firma responde 401; las 19 tablas no devuelven datos privados con la clave pública (solo `profesionales`, que es público por diseño); `/pagina-inexistente` da 404.
- **Pendiente de seguridad:** acceso cruzado entre dos usuarios con sesión (IDOR) sigue sin probar.
- **Hallazgos de la app interna (cuenta real del dueño, solo lectura):**
  1. El botón flotante "Registrar" tapa el atajo "Especialistas" en Inicio.
  2. Inicio no tiene un dato héroe: cifras de 17 px y textos de 11,5 px (bajo el mínimo de 12 px); siete bloques apilados; banner "expediente listo" duplica el acceso Expediente.
  3. Una notificación de prueba ("Prueba del historial") quedó guardada en la cuenta y se ve en Inicio (es un dato, no un componente fijo).
  4. En Ajustes, una cuenta sin rol elegido ve en rojo "Elige tu rol…" apenas abre la pantalla (el aviso debería aparecer solo al intentar guardar).
  5. En Calendario, una tarjeta con solo un ícono y el número "1" no dice qué cuenta.
  6. "Meses con registro" mezcla conteo, barra y un total en pesos en la misma línea.
- Revisor visual de Inicio: `docs/revisiones/inicio-veredicto.md` (29/40 · 12/20 · NO LISTA). Limitación: recortes de ~420 px, no 375 px exactos.

## Primer arranque de una cuenta nueva (2026-10-22, noche; cuenta de prueba `+prueba2`, solo lectura)
- **Camino de entrada:** compra en Hotmart → correo de bienvenida de la app (menos de 1 minuto, bandeja principal) → enlace de confirmación → `/consentimiento` (3 casillas obligatorias y 1 opcional, todas sin marcar; consentimiento tras verificar el correo) → `/inicio`.
- **Inicio de una cuenta nueva** muestra "Primeros pasos · Paso 1 de 2 · Configura tu cuota alimentaria" (monto, día de pago, rol, reajuste) con un aviso de qué falta para guardar.
- **Estados vacíos con explicación y acción:** Pagos ("Todavía no hay comprobantes · Toca Registrar…"), Calendario ("Sin eventos este mes · Toca un día…"), Expediente ("Sin autorizaciones registradas…"), Perfil ("Agrega a tus hijos…"). Sin errores de consola.
- **Ajustes:** el aviso del rol sale en gris (corrección publicada hoy). Explica con claridad que cancelar se hace en Hotmart y que borrar la cuenta NO cancela el cobro.
- **Hallazgo grave de correo:** cuando la persona pide un enlace en `/entrar` antes de haber confirmado su cuenta, Supabase manda la plantilla **"Confirm your email address", en inglés, sin marca y sin el código de 8 dígitos** que la pantalla promete. Pendiente: traducir y personalizar las plantillas en Supabase → Authentication → Email Templates.
- **Observaciones menores:** en Pagos la pestaña por defecto de una cuenta nueva es "Historial" y no "Cuotas"; Inicio no muestra valor hasta completar la configuración.

## Vigilancia de disponibilidad (2026-10-22, noche)
- **Better Stack (plan gratuito)**: 3 monitores HTTP con revisión cada 3 minutos — `https://coparentia.co/`, `https://coparentia.co/api/version` y `https://coparentia.co/entrar` — con aviso por correo al dueño. Cuenta creada sin tarjeta.
- **Alerta verificada de punta a punta (por accidente):** un monitor con la dirección mal escrita (`/api/versio`) generó un incidente real y el correo "New incident started" llegó a Recibidos en ~1 minuto; al corregir la dirección el monitor pasó a "Up" y el incidente se cerró.
- Limitaciones del plan gratuito: la verificación por palabra clave es de pago ("Billable"), así que solo se vigila que la dirección responda; llamadas/SMS no activados.
- Pendiente: página de estado pública (opcional, sin dominio propio por ahora), *heartbeats* de las tareas diarias (requiere cambio de código) y vigilancia de errores (Sentry o equivalente).
