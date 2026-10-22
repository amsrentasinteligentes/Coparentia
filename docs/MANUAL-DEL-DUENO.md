# Manual del dueño — Coparentia (en lenguaje simple)

Actualizado: 2026-10-22. Léelo cuando algo falle o cuando quieras saber dónde vive cada cosa.

## 1. Dónde vive cada cosa (tus cuentas)
| Qué es | Para qué sirve | Dónde entras |
|---|---|---|
| **GitHub** (`amsrentasinteligentes/Coparentia`) | Guarda todo el código. Cada cambio queda con su fecha. | github.com |
| **Vercel** (proyecto `coparentia`) | Publica la página en internet. Cada vez que se sube algo a la rama `master`, se publica solo. | vercel.com → Deployments |
| **Supabase** (proyecto `Coparentia`) | La base de datos y las cuentas de los usuarios. | supabase.com → Table Editor / SQL Editor |
| **Hotmart** | Cobra la suscripción y avisa a la app cuando alguien paga, cancela o pide reembolso. | hotmart.com |
| **Resend** | Envía los correos de la app (bienvenida, aviso de cobro, constancias). | resend.com |
| **ImprovMX** | Reenvía lo que llegue a `soporte@coparentia.co` a tu correo. | improvmx.com |
| **Namecheap** | Es donde compraste el dominio `coparentia.co`. Se renueva cada año. | namecheap.com |
| **Meta (Facebook)** | Anuncios y medición. | business.facebook.com |

## 2. Las claves
Las claves (contraseñas de las herramientas) **solo viven en Vercel → Settings → Environment Variables** (y en Supabase). Nunca van en el chat, ni en el código, ni en capturas. La lista de nombres está en `.env.example`. Si una clave se llega a mostrar por error: se **regenera** en el panel de esa herramienta, se pega la nueva en Vercel y se vuelve a publicar.

## 3. Publicar un cambio
1. Los cambios se preparan en una rama aparte (no se tocan los usuarios).
2. Subida la rama a GitHub, Vercel construye una copia de prueba (Deployments → fila de esa rama → Visit).
3. Si todo se ve bien, se une a `master` y Vercel publica en coparentia.co en 1 o 2 minutos.

## 4. Volver atrás si algo sale mal (rollback)
Vercel → Deployments → busca el despliegue anterior que funcionaba (el que dice Production y tiene la fecha de ayer) → los tres puntos → **Promote to Production**. Tarda unos segundos y no borra datos. (Esto aún no se ha probado en vivo: probarlo una vez con calma.)

## 5. Tareas comunes
- **Ver quién pagó o canceló:** Hotmart → Ventas. En la base: Supabase → tabla `suscripciones`.
- **Ver quién se inscribió a la lista de espera por país:** Supabase → tabla `lista_espera_paises`.
- **Ver errores del servidor:** Vercel → Logs.
- **Correr un cambio de la base:** Supabase → SQL Editor → pegar el archivo de `supabase/` → Run.
- **Borrar una cuenta de prueba:** Supabase → Authentication → Users. Antes pregunta siempre si es de un cliente real.

## 6. Si algo se rompe (mini-guía de incidentes)
| Síntoma | Qué mirar primero |
|---|---|
| La página no abre | Vercel → Deployments: ¿el último dice Error? → Promote del anterior. |
| Alguien pagó y no tiene acceso | Supabase → `hotmart_webhook_log` (¿llegó el aviso?) y `suscripciones`. Hotmart → Webhooks (¿está activo?). |
| No llegan los correos | Resend → Logs (¿Delivered?). Revisa que `RESEND_API_KEY` esté en Vercel. |
| "Sesión pausada" o la app deja de responder tras días sin uso | El plan gratuito de Supabase se pausa a los 7 días sin actividad: entra a Supabase y toca "Restore". **Esto es un riesgo real con clientes: pasa al plan Pro antes de vender.** |
| La IA que lee recibos falla | Es normal: la app pasa a registro manual. Revisa la tabla `ai_calls` y el panel de Anthropic. |

## 6B. Cuándo subir Supabase a Pro
Tu app te escribe sola a `soporte@coparentia.co` cuando la base de datos o las fotos pasan del 70% del plan gratuito, o cuando ya hay 3 clientes que pagan. Además, una vez al mes haz la revisión de 5 minutos de `docs/release/REVISION-MENSUAL-SUPABASE.md` (descargas del mes, cuentas de prueba, correos por hora).

## 6C. Avisos de errores (Sentry)
Sentry te escribe por correo cuando falla algo en el servidor (aviso de pago de Hotmart, tareas diarias). Solo vigila el servidor y no recibe datos de personas (ver `sentry.server.config.ts`). Para encenderlo: crea el proyecto en sentry.io, copia su clave DSN y pégala **solo en Vercel** → Settings → Environment Variables → `SENTRY_DSN` (entorno Production); nunca en el chat ni en el código. Prueba: agrega también `SENTRY_PRUEBA` = `1`, publica de nuevo, mira que llegue el mensaje "Prueba de Sentry" y **borra** `SENTRY_PRUEBA`. Sin `SENTRY_DSN`, Sentry queda apagado.

## 7. Lo que cuesta (resumen)
Supabase Pro US$25/mes · Vercel Pro US$20/mes · Resend gratis hasta ~3.000 correos/mes · Hotmart ≈10% + tarifa por venta · dominio ≈US$25-35/año. Detalle y fuentes en `ESTADO.md` (24/09/2026) y `docs/release/ECONOMICS-CERTIFICATION.md`.

## 8. Lo que todavía no existe (anotado para no olvidarlo)
Alertas automáticas de errores (Sentry), página de estado pública, copias de seguridad con restauración, prueba real de cancelación y reembolso en Hotmart, y revisión de abogado del texto de privacidad. Ver `docs/release/CERTIFICADO-PRE-LANZAMIENTO.md`.
