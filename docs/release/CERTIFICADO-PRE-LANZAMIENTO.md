# CERTIFICADO PRE-LANZAMIENTO — Coparentia (2026-10-22)

**Producción auditada:** coparentia.co, commit `6fe327a` (master). **Correcciones preparadas, sin publicar:** rama `certificacion-prelanzamiento`.

## VEREDICTO: ❌ NO APTO para cobrar todavía — 54 / 100

Regla del sistema: un solo bloqueante de dinero, acceso, privacidad o seguridad deja el veredicto en NO APTO sin importar el puntaje. Hay varios (abajo). Menos de 80 puntos también es NO APTO.

| Pilar | Puntos | En simple |
|---|---|---|
| VENTA (página principal) | **16 / 20** | Estructura completa; el revisor la puntúa 30/40 usabilidad, 15/20 diseño, 15/20 texto. |
| FUNNEL (recorrido y planes) | **13 / 20** | Recorrido y planes completos; el revisor da 30/40 y 14/20 en ambos; el puente de la prueba (día 1 a 7) está a medias. |
| PRODUCTO (dentro de la app) | **3 / 20** | **No medido:** no pude entrar a la app interna sin tu cuenta (no se piden claves en el chat). Lo no medido vale 0. |
| CONFIANZA (seguridad, legal, pago) | **10 / 15** | Muy buena base de seguridad y legal; faltan pruebas reales de cancelación y reembolso, prueba de acceso cruzado entre usuarios y un CSP activo. |
| VELOCIDAD | **4 / 10** | Cambio de diseño estable (CLS 0) y poco bloqueo; pero el contenido principal tarda ≈5–6 s en celular lento (debería ser ≤2,5 s). |
| RETENCIÓN | **8 / 15** | Recordatorios, avisos de cobro y recuperación de pagos existen en código; falta medir embudo y comprobar entrega real. |
| **TOTAL** | **54 / 100** | Banda <80 = NO APTO |

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
| 7 | **No se midió la app interna** (inicio, pagos, calendario, expediente, perfil, asistencia) | Iniciar sesión tú con la cuenta demo en el navegador integrado y yo recorro todo | Dueño + yo |
| 8 | **Costo de la IA por usuario sin medir** | Pasarme el total de `ai_calls` de Supabase | Dueño |
| 9 | **Cuenta `demo@coparentia.co` existe en producción** | Decidir si se borra o se deja (tiene datos inventados) | Dueño |

## Pendientes menores (⚠️)
- Revisión de abogado de privacidad/términos y de la sección 6.9.
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
