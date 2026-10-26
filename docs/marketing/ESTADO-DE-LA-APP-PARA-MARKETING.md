# Estado de la app para el chat de marketing (traspaso del chat de la app — 26/10/2026)

> Reparto acordado con el dueño: el chat de la APP (este proyecto, código, base de datos, Hotmart, Pixel, legal) y el chat de MARKETING (plan, piezas, contenido, anuncios). Este archivo es lo que el chat de marketing necesita saber de la app. Para cambios de la app, pedirlos en el chat de la app. **No contiene claves ni datos personales.**

## 1. Qué es y en qué punto está
- Coparentia: app web para padres separados en **Colombia** que registran cada pago de la cuota alimentaria con comprobante y fecha ("Sello de Confianza"), para mostrarlos a un abogado o conciliador. Mecanismo bautizado: **Sello de Confianza**.
- Publicada en `coparentia.co`. Versión en producción: la última de `master` (consultable en `coparentia.co/api/version`).
- Oferta vigente: **7 días gratis, se registra el medio de pago y no se cobra hasta el día 8; garantía de 15 días; solo Colombia.** Precios y enlaces de Hotmart: **no se tocan desde marketing** (viven en `lib/precios.ts` y Hotmart).
- Camino del cliente: página principal → "Crear mi expediente gratis" → recorrido de preguntas (`/onboarding`) → planes (`/paywall`) → pago en Hotmart → acceso por correo → la app.
- Estado real: **0 clientes de pago propios medidos hoy, 0 audiencia, $0 en anuncios** (ver `docs/marketing/PLAN-DE-MARKETING.md`). Certificado de pre-lanzamiento: **80/100, "No apto"** porque falta probar un **cobro y reembolso reales** (cobro de la compra de prueba el 29/10; reembolso antes del 6/11).

## 2. Recomendación de calendario para anuncios pagos
No gastar en anuncios hasta (a) cerrar la prueba de cobro/reembolso reales (29/10–6/11), (b) pasar Resend (correo) a plan de pago y subir el límite de correos de acceso de Supabase (~150/hora) — hoy un pico de visitas podría dejar a la gente sin su correo de acceso. El contenido orgánico puede salir ya.

## 3. Pixel de Meta (medición) — ya configurado
- Pixel de la cuenta: **29032956989677482** (público). Dominio `coparentia.co` verificado en Meta.
- La web envía **solo si la persona pulsa "Aceptar" en el aviso de cookies**: `PageView` (/, /onboarding, /paywall), `Lead` (botones que llevan al recorrido; Meta lo muestra como "Cliente potencial"), `OnboardingPregunta` (1–6), `VerPlan`, `InitiateCheckout` (con el plan), `StartTrial` (inicio de la prueba). Nunca se envía correo, nombre, respuestas ni montos desde la web.
- La **compra** la envía Hotmart (Herramientas → Píxel de seguimiento, solo "Ventas realizadas", vía web), no la web. Falta ver que Meta la registre con la compra del 29/10. Hotmart corre el Pixel en su propia página de pago; la política ya lo dice (frase aprobada por la abogada).
- Desactivado a propósito en Meta: eventos automáticos y coincidencias automáticas del sitio web. Activadas: cookies de origen; "información más detallada de páginas" y "medir conversiones en el dispositivo del cliente" (cubiertas por la política).
- **Pendiente de captura:** el parámetro de origen (`?src=...` de cada pieza) todavía NO se guarda; para medir qué publicación trae gente hay que usar enlaces con `?src=` y pedir al chat de la app que lo capture, o medir por las visitas de Meta.

## 4. Reglas que marketing no debe romper
- **Texto legal:** la política de privacidad y el aviso de cookies fueron revisados por la abogada del dueño. No cambiar promesas (p. ej. "no enviamos tu correo, nombre ni respuestas") ni cómo se describe el Pixel sin pasar por ella.
- **Claims:** solo lo que la app hace hoy: registrar pagos con comprobante y fecha (Sello de Confianza), calendario de visitas/citas/llamadas, expediente en PDF foliado y con fotos, constancia por correo a la otra parte, recordatorios, especialistas (directorio). No prometer valor legal garantizado ni resultados judiciales.
- **Marca:** el logo plateado es decisión de marca del dueño (no se rediseña). Menores: no usar fotos ni datos de niños reales sin autorización; la cuenta de demostración tiene datos inventados.
- **Sin secretos:** nunca pegar claves, tokens ni contraseñas en un chat. Cualquier clave expuesta se rota.

## 5. Fechas que afectan a marketing
- **27/10:** el chat de la app revisa si salió el aviso de cobro (correo) de la compra de prueba.
- **29/10:** cobro real de la compra de prueba (no cancelar antes). Ese día mirar en Meta si aparece el evento de compra.
- **Antes del 6/11:** reembolso en refund.hotmart.com y comprobar que corta el acceso.
- **2/11:** el chat de la app confirma que la revisión semanal de Hotmart corre sola.

## 6. Cómo trabajar juntos
- Idea/pieza/plan de contenido/anuncio → chat de marketing (`docs/marketing/`, `docs/piezas/`).
- Cualquier cosa que toque código, base de datos, Hotmart, Pixel, publicar o legal → chat de la app.
- El estado técnico completo está en `ESTADO.md` (raíz) y el certificado en `docs/release/CERTIFICADO-PRE-LANZAMIENTO.md`.
