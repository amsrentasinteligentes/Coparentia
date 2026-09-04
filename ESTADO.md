# ESTADO.md — Coparentia (nombre provisional: PensiónClara)

## Fase actual
Sesión 1 en curso — Validación + Constitución del Producto (B3 de INICIO.md).

## Origen de la idea
El usuario llegó con la idea ya validada mediante el prompt de investigación del curso.
Pegó el "RESUMEN FINAL — IDEA VALIDADA PARA CONSTRUIR" completo (PDF con 3 pestañas:
Resumen validado + Propuesta de valor + Cliente ideal). NO se re-valida ni se buscan
alternativas — ya pasó por investigación de mercado, conteo de competencia (12 apps) y
evidencia con enlaces (OurFamilyWizard, SupportPay, AppClose, Custody Companion, Kidtime).

También existe un documento previo del usuario (`Propuesta_Aplicacion_Obligaciones_Alimentarias_Colombia.docx`)
con la arquitectura jurídica detallada para Colombia (marco legal, REDAM, Ley 1098/2006,
Ley 2097/2021, etc.) — sirve como ANEXO JURÍDICO de referencia para reglas del sistema,
biblioteca normativa y FAQ legales. Se usa como fuente secundaria de reglas de negocio,
no reemplaza el RESUMEN FINAL como base de producto/mercado.

## 1. Nombre tentativo
PensiónClara (alternativas: CuotaAl Día, CustodiaAudit) — nombre comercial definitivo
pendiente de estudio de marca/disponibilidad. Working title de carpeta: "Coparentia".

## 2. La app en una frase
Plataforma digital neutral que documenta, calcula y genera expedientes probatorios
exportables del cumplimiento de obligaciones alimentarias y gastos de hijos para padres
separados — funciona de forma UNILATERAL (no requiere que el otro progenitor la use).

## 3. Problema urgente
Falta de un registro neutral e inalterable que acredite cumplimiento/mora de la cuota
alimentaria → conflictos diarios, cobros duplicados, gasto en abogados para reconstruir
pagos pasados.

## 4. Cliente ideal (avatar: "Carlos", 38 años)
Padre/madre separado(a) con obligación alimentaria fijada (o en proceso), en conflicto
constante con su ex sobre qué se pagó/debe/autorizó. Nivel de consciencia: DE SOLUCIÓN
(sabe que tiene un problema de gestión/prueba, ya intentó capturas de pantalla/Excel y
sabe que no alcanza). Dolor #1 real: ansiedad/estrés de vivir bajo amenaza de reclamos o
demanda injusta — no es administrativo, es de supervivencia emocional. Quiere PRUEBA,
CONTROL y PAZ MENTAL, no "mejorar la comunicación" con su ex ni que la app le calcule
cuánto debe pagar (teme que actúe como juez).
Dispuesto a pagar: $8-12 USD/mes o $89 USD/año.

## 5. Dolores reales (textuales, ver PDF Cliente Ideal para las 10 completas)
- "Siento que por más que pago, nunca es suficiente y siempre me tratan de mala paga."
- "Tengo un terror paralizante de que un día me pongan una demanda... y no tenga cómo probar."
- "Cada transferencia es un motivo de discusión y me arruina el día."
- Insatisfacción con soluciones previas: WhatsApp/capturas (se pierden, no dan contexto
  legal), Excel (manual, cuestionable/alterable), transferencias bancarias (no especifican
  concepto), carpetas físicas (se traspapelan).

## 11. MVP — funciones núcleo (construir) y qué NO construir aún
CONSTRUIR (v1):
1. Módulo de parametrización del título (monto base, fecha límite, índice de reajuste).
2. Registro de pagos y gastos extraordinarios con soporte foto/PDF + OCR básico.
3. Módulo de autorizaciones y registro de controversias/objeciones.
4. Generador de Expediente Documental exportable en PDF foliado con marca de tiempo.

NO CONSTRUIR TODAVÍA: chat interno en tiempo real, integración directa con APIs bancarias,
calendario de visitas/custodia compartida.

Primera victoria (<5 min): registrar el título (monto + fecha), subir el último
comprobante, ver su primer "Estado de Cuenta Organizado" generado en pantalla.

## 12-13. Competencia
12 apps contadas 🟢. Competidores clave: OurFamilyWizard ($12.50-$24.99/mes, exige uso de
ambos padres — hueco: uso unilateral), SupportPay (reportes poco rigurosos jurídicamente —
hueco: expedientes estandarizados para abogados/conciliadores), AppClose (dejó de ser
gratis, se sobrecargó de funciones — hueco: especialización 100% financiera/documental).

## 15-16. Precio y unit economics
Suscripción SaaS: $9.99 USD/mes o $89 USD/año. Prueba gratis 7 días.
Costo por usuario (S3 + OCR + procesamiento): ~$0.80 USD/mes → margen 92% 🟢.
Conexiones externas necesarias: pasarela de pagos (Stripe/Mercado Pago) + email
transaccional. Simplicidad 🟢.

## 18. Las 3 tomas del video (para landing/lanzamiento)
1. Tablero cuota pagada vs. pendiente (verde/rojo).
2. Subida de foto de comprobante → vinculación inmediata al mes.
3. Botón "Exportar Expediente Judicial" → PDF organizado con soportes anexos.

## 20. Ventaja del usuario
Tiene una persona muy cercana que es abogado(a) de familia. Esto habilita:
- Ángulo de autoridad en el copy ("validado con criterio de abogado de familia" / revisión
  legal real del contenido de la biblioteca normativa y las reglas del sistema).
- Canal de distribución por alianza profesional (ver propuesta de canales más abajo,
  pendiente de aprobación del usuario).

## 21. Canal de distribución (aprobado por el usuario)
Orden de arranque:
1. Alianza con su abogado(a) de familia cercano(a) — recomendación directa a clientes +
   revisión/aval de la biblioteca legal de la app.
2. Referidos de otros abogados de familia / centros de conciliación (vía el contacto anterior).
3. Contenido orgánico TikTok/Instagram con los ganchos ya validados del PDF.
4. Meta Ads pagos — solo cuando haya tracción orgánica; requiere presupuesto (avisar antes
   de gastar).

## 22. Diferenciador
"Somos la única app que genera un expediente probatorio neutral con validez documental
de forma UNILATERAL para padres separados que buscan protegerse legalmente sin depender
de que la otra parte quiera colaborar."

## Qué NUNCA debe hacer la app (derivado del anexo jurídico, pendiente de confirmación)
1. Nunca declararse juez, conciliador ni certificador oficial de deuda.
2. Nunca reportar automáticamente a alguien en REDAM ni afirmar que existe mora jurídica
   declarada — solo mostrar el estado contable de los registros.
3. Nunca borrar mensajes, soportes o versiones anteriores sin dejar rastro.
4. Nunca compartir los datos del usuario ni de sus hijos con terceros sin autorización expresa.
5. Nunca presionar con culpa ni lenguaje acusatorio hacia "el otro padre" (tono neutral siempre).

## Promesa central (derivada del reporte de posicionamiento)
"Ayudamos a padres separados a convertir sus pagos y gastos de sus hijos en un expediente
digital probatorio y organizado — sin depender de que su ex use la app, sin pelear por
WhatsApp y sin gastar en abogados solo para aclarar cuentas."

## Reglas de negocio especiales (del anexo jurídico Colombia)
- NO terminación automática de la cuota a los 25 años (parámetro jurisprudencial, no regla).
- NO compensación automática de gastos unilaterales.
- NO declaración automática de mora jurídica ni inscripción automática en REDAM (Ley 2097/2021)
  — solo advertir el supuesto de 3 cuotas y explicar que el trámite requiere autoridad competente.
- Reajuste: primero fórmula del título; solo si no hay, regla legal supletiva (IPC, Ley 1098/2006).
- La app NUNCA se declara juez, conciliador ni certificador de deuda — presenta información
  calculada a partir de títulos y registros suministrados por los usuarios.
- Biblioteca normativa dinámica con fuentes oficiales (Constitución, Código Civil, Ley 1098/2006,
  Ley 2097/2021, Decreto 1310/2022, Ley 2220/2022, CGP, Código Penal Art. 233, Ley 1581/2012
  datos personales, Ley 527/1999 mensajes de datos).
- Portal para abogados: acceso temporal autorizado, solo lectura/descarga.
- Marcar documentos aportados por una sola parte vs. aceptados por ambas.

## Decisiones técnicas pendientes de tomar en Sesión 1 (criterio del agente, no se preguntan)
- Modelo de monetización: a evaluar con matriz A-F de 02C (hard paywall vs onboarding-first)
  dado que el uso puede ser unilateral.
- Framework, arquitectura, base de datos, auth: pendiente (04-ARQUITECTURA, 25, 26).
- Unit economics: ya viene con margen 92% del PDF — validar contra 40-UNIT-ECONOMICS.md.

## Siguiente paso
Preguntar al usuario el campo 20 (ventaja/contactos) y continuar con B3 — completar la
Constitución del Producto (primera victoria ya definida, funciones MVP ya definidas por el
PDF, falta el "qué NUNCA debe hacer la app" y confirmar promesa central) antes de pasar a
02-VALIDACION / 57-AVATAR / 02C-PRICING / 40-UNIT-ECONOMICS / 04-ARQUITECTURA / 25 / 26.
