# Revisión mensual de Supabase (5 minutos) — cuándo subir a Pro

Hazla **el día 1 de cada mes** (pon un recordatorio en tu calendario). La alerta automática por correo cubre dos de estas cosas; las demás solo se ven a mano.

## 1. Qué mirar (Supabase → tu proyecto Coparentia)
| Dónde | Qué miras | Cuándo preocuparse | Lo cubre la alerta automática |
|---|---|---|---|
| **Reports → Database** (o Settings → Usage) | Tamaño de la base de datos | Más de **350 MB** (el tope gratuito es ≈500 MB) | ✅ avisa al 70% |
| **Storage** (o Settings → Usage) | Espacio de las fotos de comprobantes | Más de **700 MB** (el tope gratuito es ≈1 GB) | ✅ avisa al 70% |
| **Settings → Usage → Egress** | Descargas del mes | Más de **3,5 GB** (el tope gratuito es ≈5 GB) | ❌ solo a mano |
| **Authentication → Users** | Cuántas cuentas hay y cuántas son de prueba | Borrar cuentas de prueba | ❌ solo a mano |
| **Table Editor → `suscripciones`** | Cuántos clientes pagan (`first_paid_at` lleno, estado `active`) | **3 o más** → pasar a Pro | ✅ avisa |
| **Authentication → Rate Limits** | Correos por hora (hoy 30) | Si esperas un pico (anuncios), súbelo antes | ❌ solo a mano |

Los topes del plan gratuito pueden cambiar: confírmalos en supabase.com/pricing.

## 2. Cuándo subir a Pro (US$25/mes)
Sube **ese mismo día** si pasa cualquiera de estas:
1. Ya hay **3 clientes o más que pagan** (copias de seguridad restaurables y sin pausa por inactividad).
2. La base de datos o las fotos pasan del **70%**.
3. Vas a hacer **publicidad fuerte** (necesitas más correos por hora y más margen).
4. Recibes el correo "Conviene subir a Supabase Pro".

Cómo: Supabase → **Settings → Billing → Upgrade to Pro**. No borra nada ni cambia las claves ni la dirección del proyecto.

## 3. Cómo funciona el aviso automático
- Una tarea diaria de tu app (a las 10:30 de la mañana, hora Colombia) mide la base de datos, las fotos y los clientes que pagan.
- Si algo pasa de su umbral, te escribe a `soporte@coparentia.co` (llega a tu correo). Repite el aviso como máximo cada 7 días.
- Es solo lectura: no modifica ningún dato.
- Si deja de llegar el correo y creías que debía, revisa Vercel → Logs de `alerta-capacidad`.

## 4. Qué no cubre (míralo a mano)
Descargas del mes (egress), usuarios activos del mes, caídas de Supabase (página de estado de Supabase) y vencimiento de claves.
