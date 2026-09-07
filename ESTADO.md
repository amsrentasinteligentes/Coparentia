# ESTADO.md — Coparentia (nombre provisional: PensiónClara)

## Fase actual
Sesión 3 (página de ventas) construida — ver "Problemas conocidos" antes de avanzar a Sesión 4.

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

## Dirección de arte — comparativa A/B/C presentada (pendiente elección del usuario)
Archivo: `direcciones-abc.html` (raíz del proyecto) y copia archivada en `docs/revisiones/`.
Tabla de líderes usada (nicho legal/documental + fintech de confianza): Clio, DocuSign,
Notion (gestión legal/documentos) + Mercury/Revolut (claridad financiera, cifras tabulares).
Tres fusiones distintas del banco de direcciones (54):
- **Opción A — Blindaje Directo** (Brutalista suave, banco #2): claro, borde 2px + sombra
  dura offset, azul rotulador #2743D6, Archivo Black + Work Sans. Ángulo: control/autoridad.
- **Opción B — Cuenta Clara** (Fintech de bolsillo, banco #3): oscuro, verde saldo #46B583,
  Geologica + Wix Madefor Text, cifras tabulares. Ángulo: claridad financiera.
- **Opción C — Expediente Editorial** (Papel y tinta, banco #9): claro, lacre #8C2F23,
  EB Garamond + Inter Tight, timeline editorial con doble regla. Ángulo: seriedad jurídica.
Ninguna se repite de un proyecto anterior (no hay proyecto anterior en este SO todavía).

**RONDA 2** (el usuario pidió 3 opciones distintas, sin borrar la ronda 1): archivo actual
`direcciones-abc.html` en raíz + copia en `docs/revisiones/direcciones-abc-ronda2.html`.
La ronda 1 completa quedó intacta en `docs/revisiones/direcciones-abc.html`.
- **Opción A — Cuidado Documentado** (Clínica humana, banco #5): claro, teal #0F766E,
  Gantari + Atkinson Hyperlegible, hairline suave + sombra tintada. Ángulo: calma/protección.
- **Opción B — Estudio de Caso** (Nocturna de estudio, banco #6): oscuro, dorado #E0B458,
  Spectral + IBM Plex Sans, halo cálido detrás del anillo. Ángulo: revisión nocturna a solas.
- **Opción C — Bitácora Familiar** (Editorial cálida, banco #1): claro cálido, óxido #7A3E2E,
  Newsreader + Mulish, subrayado marcador en el titular. Ángulo: diario/acuerdo, no litigio.
**RONDA 3** (combinación explícita de B+C de ronda 2, en tonos azules): archivo actual
`direcciones-abc.html` en raíz + copia en `docs/revisiones/direcciones-abc-ronda3.html`.
Rondas 1 y 2 completas quedaron intactas en sus archivos respectivos.
- **Opción A — Confianza Nocturna** (hero+cards, azul #4C82E0): halo detrás del dato + subrayado
  marcador en el titular. Fusiona el halo de "Estudio de Caso" con el marcador de "Bitácora".
- **Opción B — Revisión en Confianza** (anillo+grid, azul #5B93E8): peso mayor en el lado
  "Estudio de Caso" — anillo de avance con halo, tono más financiero/serio.
- **Opción C — Bitácora en Azul** (timeline, azul #6FA8FF): peso mayor en el lado "Bitácora
  Familiar" — línea de tiempo editorial con halo sutil detrás del masthead.
Tipografía compartida: Spectral (display) + IBM Plex Sans (body) en las 3.

⚠️ Bug real encontrado y corregido: la URL de Google Fonts con sintaxis de rango
(`wght@400..700`) solo es válida para fuentes VARIABLES. Spectral es estática (pesos
discretos) — con esa sintaxis, Google Fonts descarta la familia completa en silencio (sin
error visible) y el navegador cae al fallback-trampa (monospace). Corregido a `wght@400;700`
(punto y coma). Revisar si se reutiliza EB Garamond (ronda 1, banco #9) más adelante — mismo
riesgo por ser también una fuente estática.

## DIRECCIÓN DE ARTE — COSA JUZGADA (Sesión 2 cerrada — 2026-09-07)
El usuario eligió y aprobó la **Opción B de la ronda 3 — "Revisión en Confianza"** (tour visto
y aprobado). Detalle completo, tokens, tabla de líderes y trazabilidad → `FICHA-ARTE.md`
(raíz del proyecto). Resumen rápido:
- Paleta: `--bg #0B1524 · --surface #13233A · --text-1 #E6EDF7 · --text-2 #7F93B3 · --accent #5B93E8`
- Tipografía: Spectral (display) + IBM Plex Sans (body) · radios card 14px / botón 10px
- Dispositivo ownable: halo azul + subrayado marcador (fusión banco 54 dir.1 + dir.6)
- Personalidad compilada: Sereno + Sobrio + Cálido · voz: mentor sereno
- Mapa de rutas planeado: / -> /onboarding -> /paywall -> /login -> /app

## Sesión 2 — TERMINADA
Identidad visual completa: FICHA-ARTE.md aprobada, tokens definidos, tour de la app aprobado.

## Sesión 3 — TERMINADA (2026-09-07): Página de ventas
Stack decidido (regla del stack, 12-FLUJO-AGENTICO.md): **Next.js App Router** — la app
necesita landing con SEO + app tras login, no es solo herramienta interna.
- Scaffold: Next.js 16 + React 19 + TypeScript + Tailwind v4 + `motion` + `lucide-react`.
- `FICHA-AVATAR.md` creada y aprobada (derivada del RESUMEN FINAL ya validado del usuario).
- Mecanismo bautizado: **"el Sello de Confianza"** (sube comprobante → se fecha y asocia →
  queda en el expediente). Big Idea en `docs/copy/landing.md`.
- Landing construida con el KIT CANÓNICO (`plantillas-codigo/landing/` → `components/landing/`),
  10 secciones en el orden inmutable de `19-PAGINA-DE-VENTAS.md`. `tokens.css` tematizado con
  FICHA-ARTE.md (azul de confianza). Copy en `docs/copy/landing.md`, cableado en `app/page.tsx`.
- Verificado: `tsc --noEmit` ✓ · `next build` ✓ · dev server arranca sin errores · rendering a
  375px revisado sección por sección (hero, problema, agitación, solución, carrusel, oferta,
  garantía, FAQ, CTA final, footer) — todas correctas, presupuesto de copy dentro de límites.
- Páginas legales creadas y enlazadas (privacidad, términos, reembolsos, aviso de IA) — CONTENIDO
  REAL pero marcado explícitamente como "en revisión legal final antes del lanzamiento" (no son
  enlaces muertos, cumple la regla dura del footer, pero NO reemplaza validación de un abogado).
- ⚠️ PENDIENTE (anotado, no bloquea cierre de sesión): el carrusel de "La app por dentro" usa
  PLACEHOLDERS honestos (rotulados) porque la app interna aún no existe — se reemplazan por
  screenshots reales al cerrar la Sesión 5. CTA lleva a `/onboarding`, ruta que se construye en
  la Sesión 4.
- Modelo de monetización: **onboarding-first (Modelo 2)** — CTAs llevan a /onboarding, no a
  checkout directo. (Decisión técnica, no se preguntó al usuario — DECIDE-INFORMA-AVANZA.)

## Siguiente paso — Sesión 4: Onboarding, paywall y login
Construir la landing con las 10 secciones canónicas (19-PAGINA-DE-VENTAS.md): hero 4U's →
problema → agitación → mecanismo → carrusel → oferta (anual+mensual con trial) → garantía →
FAQ → CTA emocional → footer legal. Copy derivado 100% de FICHA-AVATAR (el avatar "Carlos" ya
está en ESTADO.md, sección "4. Cliente ideal"). Diseño con la Ficha de Arte ya cerrada — sin
volver a discutir estilo.

## Problemas conocidos

### veredicto landing — NO LISTA, deliberadamente diferido a Sesión 5
El revisor-visual independiente evaluó la landing tres veces (docs/revisiones/landing-veredicto.md
tiene el último resultado): última pasada **Usabilidad 29/40 · Craft 14/20 · Copy 15/20 · Veredicto
NO LISTA** (umbral de cierre: ≥36/40 y ≥16/20). Se corrigieron los defectos reales encontrados:
- Inconsistencia de precio ($0.33/día vs $0.25/día en distintas secciones) → unificado a $0.25/día.
- El dispositivo ownable de FICHA-ARTE (halo + subrayado marcador) no estaba implementado en
  `<Accent>` (components/landing/ui.tsx) → implementado con `linear-gradient` + `box-decoration-break`.
- La garantía no aparecía cerca del CTA de compra → agregada como feature en ambos planes de Oferta.

Defectos que se DEJAN pendientes a propósito, con su razón:
- **Placeholders del hero y del carrusel "La app por dentro"**: son placeholders honestos
  (rotulados, no capturas falsas) porque la app interna todavía no existe — esto es la regla
  explícita de `19-PAGINA-DE-VENTAS.md` §5 "MOCKUPS HONESTOS PRE-LANZAMIENTO". Se reemplazan por
  screenshots reales al cerrar la Sesión 5 (app interna) y ahí se vuelve a correr el revisor-visual.
  Es la causa principal de que Usabilidad/Craft no lleguen al umbral — no es corregible sin
  inventar assets falsos, que el SO prohíbe explícitamente.
- **Badge "X días gratis" en AMBOS planes (Anual y Mensual)**: el revisor lo marcó como ruido
  duplicado, pero `19-PAGINA-DE-VENTAS.md` §6 exige literalmente "DOS PLANES SIEMPRE: ANUAL y
  MENSUAL, AMBOS con PRUEBA GRATUITA visible" — no se quita, es la regla canónica del kit.
- **Contraste base/elevado entre secciones poco perceptible**: ajustar requeriría tocar los hex
  de `--bg`/`--surface` en FICHA-ARTE.md, que es cosa juzgada y requiere OK explícito del usuario
  para cambiarse (regla de la ficha). Se deja como candidato de pulido fino para la Sesión 7
  (`07-PULIDO.md`), no se toca ahora sin permiso.
- No se modificaron los componentes `.tsx` del kit protegido (`components/landing/*`, salvo
  `ui.tsx` → `<Accent>`, un cambio de props/estilo, no de estructura) — el kit documenta
  explícitamente qué NO se toca sin justificación (`plantillas-codigo/landing/README.md`).

Screenshot vigente: `docs/revisiones/landing-375.png` (capturado con scroll real simulado para
disparar las animaciones whileInView — un `fullPage` sin scroll incremental deja el contenido
en opacity:0 y produce falsos negativos, ya corregido en el método de captura).

### FICHA-MODELO y FICHA-MERCADO — resueltos
Ambas fichas se crearon en esta sesión con datos investigados y fuentes reales (ver
FICHA-MODELO.md y FICHA-MERCADO.md en la raíz). La garantía de 15 días quedó verificada contra
los plazos reales que permite Hotmart (7/15/21/30 días) y corregida para cumplir la regla dura
garantía > prueba (antes ambas eran de 7 días, error ya corregido en todo el copy).

## Siguiente paso
Sesión 4: Onboarding, paywall y login (ver sección de arriba). Antes de darla por *vendible* de
verdad, falta cerrar el pendiente de "veredicto landing" cuando la Sesión 5 entregue screenshots
reales de la app interna.
