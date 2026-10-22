# PRIVACY-DATA-MAP — datos, finalidad y borrado (2026-10-22)

Marco: Ley 1581 de 2012 (Colombia). Domicilio y responsable: Coparentia, Colombia. Política vigente en `/privacidad` (incluye 6.9, lista de espera).

| Tabla (Supabase) | Datos | Finalidad | Base / consentimiento | Acceso |
|---|---|---|---|---|
| `profiles` | nombre, rol, correo | cuenta y personalización | autorización al registrarse (`consentimientos`) | la propia persona (RLS) |
| `hijos` | nombres e info básica de hijos | gastos y eventos por hijo | consentimiento expreso (21/09/2026) | la propia persona (RLS) |
| `pagos` | monto, fecha, concepto, foto del comprobante (Storage) | expediente y Sello de Confianza | servicio contratado | la propia persona (RLS); bucket de comprobantes privado |
| `eventos`, `autorizaciones`, `titulos` | citas, visitas, acuerdos | expediente | servicio | la propia persona (RLS) |
| `constancias` | resumen mensual enviado por correo | constancia a la otra parte | consentimiento de la persona | la propia persona |
| `consentimientos` | versión del texto, fecha, origen | registro de la autorización | — | solo servidor |
| `suscripciones`, `hotmart_*` | estado de acceso, eventos del pago | cobrar y dar acceso | contrato | solo servidor (service_role) |
| `push_subscriptions`, `notificaciones_app` | token del navegador, avisos | recordatorios | permiso del navegador | la propia persona |
| `contactos_interesados` | correo, plan | ayudar a completar la compra | autorización expresa | solo servidor |
| `lista_espera_paises` | correo, país | avisar cuando llegue a su país | autorización expresa (casilla) | solo servidor |
| `ai_calls` | modelo, tokens, costo | control de gasto de IA | servicio | solo administrador |
| `profesionales` | perfil público del directorio (foto en bucket público `profesionales`) | directorio | autorización escrita de cada profesional | público (solo lectura) |
| `event_log` | trazas de eventos (cada persona inserta los suyos) | auditoría | interés legítimo | lectura solo administrador |

- Borrado: la persona puede eliminar su cuenta desde Ajustes (`admin.auth.admin.deleteUser`). Queda por probar que también elimine los archivos de Storage y los registros vinculados (**NO VERIFICADO E2E**).
- Exportación: PDF del expediente desde la app.
- IA: solo se envía a Anthropic la imagen del comprobante para leer el monto; se informa en `/aviso-ia`.
- Menores: la app guarda datos de hijos menores aportados por el adulto; hay age-gate de 18+ para la persona (ESTADO.md 2026-09-25). **Revisión jurídica profesional pendiente** (incluida la sección 6.9).
