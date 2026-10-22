# CLAIMS-LEDGER — cada promesa pública y su respaldo (2026-10-22)

Estado: ✅ real (existe y está probado o verificado por código) · ⚠️ real pero con condición · ❌ sin respaldo.

| Promesa (texto público) | Dónde | Capacidad / evidencia | Estado |
|---|---|---|---|
| "7 días gratis · Garantía de 15 días" | Página principal, planes, términos | `lib/precios.ts` (TRIAL_DIAS=7); el plazo de 15 días lo da Hotmart (Productos → Coparentia). **Pendiente comprobar en el panel de Hotmart que el producto tenga garantía de 15 días y prueba de 7** | ⚠️ NO VERIFICADO en Hotmart |
| "US$7,42/mes (anual US$89) · US$9,99 mensual" | Página principal, planes | `lib/precios.ts`; el checkout de Hotmart es el que cobra (verificado en una compra real el 2026-09-17, antes de los cambios de precios del 2026-10-10) | ⚠️ re-verificar el checkout vigente |
| "Primer cobro el día 8" | Planes, página principal | Regla de Hotmart para pruebas de 7 días (`DIA_PRIMER_COBRO`) | ⚠️ no comprobado con una compra real nueva |
| "Te avisamos por correo el día 5 antes de cualquier cobro" | Planes | `app/api/cron/aviso-pre-cobro` + `vercel.json` (13–16 UTC); correo con Resend | ⚠️ código y cron existen; entrega real no probada en esta auditoría |
| "Cancelas cuando quieras / antes sin costo" | Planes | Pantalla Ajustes "Cómo cancelar" (la cancelación es en Hotmart) | ⚠️ la cancelación real nunca se probó de punta a punta (ESTADO.md: pospuesta) |
| "Sello de Confianza en cada comprobante" | Todas | Registro de pagos con fecha de servidor y `event_log` (ver `pagos`, triggers) | ✅ por código |
| "Expediente en PDF, cada página numerada" | Planes, página principal | `lib/exportar-expediente.ts` (jsPDF), página de ejemplo real en `/ejemplo-expediente-pagina.webp` | ✅ |
| "Funciona aunque la otra persona no la use" | Planes, FAQ | Diseño de uso unilateral | ✅ |
| "Alertas de vencimiento y soporte faltante" | Plan anual | Cron `recordatorio-cuota` (push) avisa hasta 4 días antes del día de pago y pide subir el comprobante; requiere que la persona haya instalado la app y aceptado notificaciones | ⚠️ real, con condición de instalación |
| "Autorizaciones y desacuerdos, por escrito" | Plan anual | Tabla `autorizaciones` y su pantalla | ✅ por código |
| "Un juez valora cada prueba según el caso" | FAQ | Redacción prudente validada por el dueño | ✅ (no promete validez) |
| "Tus datos viajan y se guardan con cifrado. Nunca se comparten sin tu autorización" | FAQ | Supabase cifra en tránsito y reposo; política de privacidad | ⚠️ revisión legal pendiente |
| "Disponible para Colombia · Por ahora solo en Colombia" | Hero, planes, FAQ | Decisión #8 | ✅ |
| "Listo en 10 minutos" | Burbuja del hero | Tiempo medido del recorrido + primer comprobante (ESTADO.md) | ⚠️ no re-medido |
| "Menos de US$0,25 al día" | Planes, FAQ | 89/365 = 0,244 | ✅ |
| "Un abogado puede cobrar US$100 por una asesoría" | FAQ | Cifra aprobada por el dueño, sin fuente publicada | ⚠️ sin fuente |
| Opiniones de 3 profesionales | Página principal | Autorización escrita de cada una (ESTADO.md); sin declarar vínculo de Ivonne Reyes (decisión del dueño) | ⚠️ decisión del dueño |
