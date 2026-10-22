# ECONOMICS-CERTIFICATION — margen por plan (2026-10-22)

Todo supuesto está rotulado. Lo que no se midió con datos reales queda **NO MEDIDO**.

| Concepto | Plan anual (US$89/año) | Plan mensual (US$9,99/mes) | Fuente |
|---|---|---|---|
| Ingreso efectivo mensual | US$7,42 | US$9,99 | `lib/precios.ts` |
| Comisión de Hotmart | ≈10% + tarifa fija por venta (supuesto) | igual | ESTADO.md 2026-09-24 (sin URL oficial ni fecha: **verificar**) |
| IA (lectura de recibos con Claude Haiku, máx. 256 tokens de salida) | **NO MEDIDO** | **NO MEDIDO** | Se registra en `ai_calls`; falta consultar la tabla en Supabase para el costo real por usuario (mediana y p95) |
| Infraestructura variable (Supabase, Resend, Vercel) | Supabase Pro US$25/mes + Vercel Pro US$20/mes fijos (supuesto de ESTADO.md); Resend gratis hasta ≈3.000 correos/mes | igual | ESTADO.md 2026-09-24 |
| Margen de contribución | **NO CALCULABLE sin el costo de IA real** | idem | — |

Punto de equilibrio de infraestructura (supuesto de ESTADO.md): menos de 7 clientes del plan anual cubren ≈US$45/mes de infraestructura fija.

Freno de gasto de IA: existe (`supabase/freno-gasto-ia.sql`, función que corre con permisos propios) y degrada a registro manual (`lib/ocr-recibo.ts`). **NO verificado**: tope global y por usuario en dinero, alerta de gasto y kill-switch documentados.

Pendiente del dueño: consultar en Supabase la tabla `ai_calls` (cantidad de llamadas y costo total) y pasarme el resultado, para medir el costo de IA por usuario contra el 20% del precio.
