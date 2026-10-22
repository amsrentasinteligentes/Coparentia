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
| Aviso de pre-cobro (día 5), correo de pago fallido y despedida | `app/api/cron/aviso-pre-cobro`, `app/api/cron/dunning`, `lib/email.ts` | ⚠️ código y crons existen; entrega real no probada ahora |
| Reconciliación semanal Hotmart ↔ base | `app/api/cron/reconciliacion-hotmart` (lunes 16 UTC) | ⚠️ se salta sola sin las 3 credenciales de API |

## Lo que NO está probado (bloquea "APTO")
| Prueba pendiente | Por qué falta | Quién la hace |
|---|---|---|
| Cancelación durante la prueba → no cobra, estado y acceso correctos | Pospuesta desde sept-2026 (ESTADO.md) | Dueño, con una compra real de prueba |
| Cancelación de un plan pagado → acceso hasta fin del periodo | idem | Dueño |
| Reembolso y contracargo reales → acceso y registro correctos | idem (cuesta dinero: se pide autorización) | Dueño |
| Pago rechazado → past_due → gracia → recuperación | Requiere simular fallo de tarjeta en Hotmart | Dueño |
| Primer cobro real del día 8 | Requiere esperar 7 días con una compra real | Dueño |
| Compra con correo distinto al de la cuenta | Flujo "Ya pagué con otro correo" probado solo con sesión simulada (ESTADO.md) | Dueño |
| Ledger económico propio (ingresos por transacción, por moneda) | No existe: el dinero real vive en Hotmart; la app solo guarda estado de acceso | Decisión: aceptable en esta etapa, a documentar |

Veredicto de pagos: **NO VERIFICADO / NO APTO** hasta completar las pruebas de la segunda tabla.
