# PAYMENT-CERTIFICATION — matriz de pagos real (2026-10-22)

Regla: una simulación local no certifica el panel real de Hotmart. Lo que no se probó queda **NO VERIFICADO**.

## Lo que sí está probado
| Prueba | Evidencia | Estado |
|---|---|---|
| Firma del aviso (hottok) y falla cerrada si falta `HOTMART_HOTTOK` o `HOTMART_PRODUCT_ID` | `app/api/webhooks/hotmart/route.ts` (pasos 2 y 4b), `lib/hotmart-verify.ts` (comparación en tiempo constante) | ✅ por código |
| Producto ajeno o sin producto no da acceso | `lib/hotmart-catalogo.ts` | ✅ por código |
| Mismo aviso reenviado no duplica el efecto | Función `aplicar_evento_hotmart` (atómica, dedupe por `event_id`) + tabla `hotmart_eventos_procesados` | ✅ por código |
| Estados: trialing / active / cancelled (acceso hasta `access_until`) / past_due (hasta `grace_ends_at`) / refunded / chargeback (terminales) | `lib/membership-fsm.ts`, ESTADO.md 2026-09-11 | ✅ por código |
| Función de Postgres no llamable sin sesión | ESTADO.md 2026-09-14 (hallazgo crítico corregido) | ✅ |
| Compra real con prueba de 7 días: pago → fila `suscripciones` en `trialing` con fecha correcta | ESTADO.md 2026-09-17 | ✅ en un commit anterior (no re-probado con el código actual) |
| **Cancelación durante la prueba (compra real del 13/10/2026, plan mensual)**: estado `cancelled`, `first_paid_at` vacío (nunca se cobró), `access_until` = 20/10 12:00 UTC (fin de la prueba) | Supabase → `suscripciones` (capturas del 2026-10-22); Hotmart → Webhook → Historial (compra aprobada 14:09 y cancelación 14:48, ambas "Procesado") | ✅ con datos reales (detalle: `access_until` queda a las 12:00 UTC porque Hotmart manda solo la fecha, ~7 h antes del fin exacto de la prueba) |
| **Correo de Hotmart al comprador** (22/10/2026): "Has cancelado la renovación de tu suscripción mensual de Coparentia… acceso hasta el 20 oct 2026… no recibirás ningún cargo"; avisa que si la compra se cancela o reembolsa el acceso se desactiva de inmediato | Captura del correo (Gmail del dueño) | ✅ coincide con `access_until` y `first_paid_at` vacío |
| **Acceso cerrado tras vencer**: el 22/10 esa cuenta inicia sesión y la app la lleva a `/paywall` | Captura del 2026-10-22 | ✅ |
| Aviso de Hotmart configurado: 7 eventos (compra completa, compra aprobada, compra atrasada, compra reembolsada, cancelación, chargeback, cambio de plan) para el producto 8501878; URL `coparentia.vercel.app` (no `coparentia.co`) | Hotmart → Webhook (capturas del 2026-10-22) | ✅ (mejora: apuntarlo a coparentia.co) |
| Aviso de pre-cobro (día 5), correo de pago fallido y despedida | `app/api/cron/aviso-pre-cobro`, `app/api/cron/dunning`, `lib/email.ts` | ⚠️ código y crons existen; entrega real no probada ahora |
| Reconciliación semanal Hotmart ↔ base | `app/api/cron/reconciliacion-hotmart` (lunes 16 UTC) | ⚠️ se salta sola sin las 3 credenciales de API |

## Lo que NO está probado (bloquea "APTO")
| Prueba pendiente | Por qué falta | Quién la hace |
|---|---|---|
| Cancelación de un plan pagado → acceso hasta fin del periodo | idem | Dueño |
| Reembolso y contracargo reales → acceso y registro correctos | idem (cuesta dinero: se pide autorización) | Dueño |
| Pago rechazado → past_due → gracia → recuperación | Requiere simular fallo de tarjeta en Hotmart | Dueño |
| Primer cobro real del día 8 | Requiere esperar 7 días con una compra real | Dueño |
| Compra con correo distinto al de la cuenta | Flujo "Ya pagué con otro correo" probado solo con sesión simulada (ESTADO.md) | Dueño |
| Ledger económico propio (ingresos por transacción, por moneda) | No existe: el dinero real vive en Hotmart; la app solo guarda estado de acceso | Decisión: aceptable en esta etapa, a documentar |

Veredicto de pagos: **NO VERIFICADO / NO APTO** hasta completar las pruebas de la segunda tabla.

## Datos de prueba que siguen en producción (a decidir por el dueño)
- `suscripciones`: `test@hotmart.com` (cancelled) y `testeComprador271101postman15@…` (**active**, `first_paid_at` 11/09, `grace_ends_at` 21/09). Son del 16/09/2026 (herramienta de prueba de Hotmart, antes del filtro de producto del 13/10). Pueden inflar métricas del panel de administración.

## Hallazgos nuevos del 2026-10-22
1. **Correo de acceso lento o perdido:** el código/enlace para `alejo.mu100@gmail.com` no llegó de inmediato y apareció después (tiempo y carpeta sin medir). Pendiente: revisar Resend (Emails) y Supabase (Auth Logs) y el límite de correos de Supabase Auth.
2. **Usuario que ya usó su prueba:** la pantalla de planes le sigue diciendo "7 días gratis, sin sorpresas". Falta verificar qué hace Hotmart si el mismo correo vuelve a comprar (¿otra prueba gratis?). Si no la concede, el texto promete algo falso a quien regresa.
