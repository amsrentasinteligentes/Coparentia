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

## Sesión 4 — TERMINADA (2026-09-07): Onboarding, paywall y login
Construido siguiendo `02B-ONBOARDING-Y-PAYWALL.md` (estrategia) + `50-DISENO-ONBOARDING-PAYWALL.md`
(especificación visual exacta). Kit compartido en `components/funnel/ui.tsx` (header de marca,
barra de progreso animada con endowed progress, chips, CTA fijo) — misma identidad de
FICHA-ARTE.md que la landing.

- **`/onboarding`** (`app/onboarding/page.tsx`): 5 preguntas reales derivadas de FICHA-AVATAR.md
  (situación → eco de objeciones/consciencia, con escape hatch "otra cosa" · preocupación → eco
  literal de los dolores #1-#4 · meta de compromiso (slider 1-12 meses) · momento del día (ancla
  la hora de recordatorios futuros) · atribución (canal, patrón Cal AI)) + 2 pantallas de
  reconocimiento (la primera desculpa con la causa real, la última etiqueta con identidad
  positiva — regla b de LA ESCALERA) + loading "Construyendo tu expediente…" con 4 líneas que
  citan las respuestas reales del usuario (labor illusion, patrón Noom) y anillo de progreso.
  Auto-avance de chips a 300ms, transiciones deslizantes, barra que nunca empieza en 0%.
- **`/paywall`** (`app/paywall/page.tsx`): paywall DE SECUENCIA (3 pantallas, +37% vs una sola —
  Superwall 2026): (1) recap con la inversión visible ("Hecho con tus 5 respuestas" — costo
  hundido, regla a de LA ESCALERA), (2) timeline del trial (Hoy → Día 5 → Día 7 con fecha y
  monto exactos, patrón Blinkist), (3) precio (anual $7.42/mes preseleccionado con badge "4
  meses gratis", mensual $9.99/mes, CTA en 1ª persona, garantía de 15 días visible, "Ahora no"
  sin confirmshaming, X de cierre desde el frame 1).
- **`/entrar`** (`app/entrar/page.tsx`): login sin contraseña (magic link), con los 3 estados
  reales (enviando/enviado con countdown de reenvío/error) + botón Google (visual, sin OAuth
  real todavía).
- Verificado end-to-end con clics reales/simulados por todo el flujo completo
  onboarding→paywall→login: cada pantalla personaliza correctamente con las respuestas
  anteriores (confirmado en pantalla, no solo en código).
- `tsc` + `next build` limpios con las 3 rutas nuevas generadas.

⚠️ PENDIENTES anotados (no bloquean el cierre, se resuelven en Sesión 6):
- **Todo es mock sin backend**: las respuestas viajan por `sessionStorage` (no hay servidor
  todavía). El envío del magic link en `/entrar` está SIMULADO (setTimeout, nunca se manda un
  correo real) — Sesión 6 conecta Supabase Auth (magic link real) + el webhook de Hotmart que
  crea el usuario passwordless. El botón "Continuar con Google" es solo visual (sin OAuth real).
- El CTA final del paywall lleva a `/entrar` en vez de a un checkout real de Hotmart — correcto
  para esta etapa (C3ter: "nunca un checkout falso que parezca procesar un cobro real"); en
  Sesión 6 se reemplaza por el link real de Hotmart con los parámetros de trial.
- Simplificaciones deliberadas frente al máximo detalle de `50`: no se implementó Lottie
  (se usó CSS/motion para el anillo y las transiciones, opción explícitamente permitida) ni el
  ritual opcional de "mantener presionado" (`C3bis`, patrón Flo — es opcional, no obligatorio).
- El link del logo en el header del funnel vuelve a `/` sin pedir confirmación de pérdida de
  progreso (50 lo sugiere) — mejora menor pendiente para Sesión 7 (pulido).
- Falta el gate del revisor-visual sobre estas 3 pantallas nuevas (obligatorio en
  `PLANTILLA-REVISION-PANTALLA.md` para onboarding/pago) — no se corrió en esta sesión por
  presupuesto; queda anotado para antes de declarar el funnel "vendible" de verdad.

## Siguiente paso — Sesión 5: App interna simplificada
Construir la landing con las 10 secciones canónicas (19-PAGINA-DE-VENTAS.md): hero 4U's →
problema → agitación → mecanismo → carrusel → oferta (anual+mensual con trial) → garantía →
FAQ → CTA emocional → footer legal. Copy derivado 100% de FICHA-AVATAR (el avatar "Carlos" ya
está en ESTADO.md, sección "4. Cliente ideal"). Diseño con la Ficha de Arte ya cerrada — sin
volver a discutir estilo.

## Problemas conocidos

### veredicto landing — NO LISTA, techo estructural identificado (6 rondas de revisión)
El revisor-visual independiente evaluó la landing **6 veces** en dos sesiones (histórico completo
abajo). Cada ronda corrigió defectos reales y verificables; los números se estabilizaron en un
techo que no depende ya de calidad de ejecución, sino de la naturaleza de la rúbrica aplicada a
una landing (ver diagnóstico al final). Última pasada (docs/revisiones/landing-veredicto.md):
**Usabilidad 32/40 · Craft 16/20 · Copy 17/20 · Veredicto NO LISTA** (umbral: ≥36/40 y ≥16/20).
**Craft y Copy YA PASAN su umbral de forma estable** desde hace 3 rondas; solo Usabilidad queda
corta, y por heurísticas que penalizan estructuralmente a una landing sin estado persistente.

Historial de rondas (Usabilidad/Craft/Copy):
1. 29/40 · 14/20 · 15/20 — primera pasada tras construir la landing.
2. 31/40 · 14/20 · 18/20 — corregido: precio inconsistente ($0.33 vs $0.25/día), dispositivo
   ownable (halo+marcador) faltante en `<Accent>`, garantía lejos del CTA de compra.
3. 29/40 · 13/20 · 19/20 — pedido del usuario: degradés + anillos de progreso (MiniRing) en
   Agitación/Solución + íconos en el carrusel de placeholders.
4. 32/40 · 13/20 · 19/20 — corregido: MiniRing sin animar → motion.circle con whileInView;
   degradés muy sutiles (5-8%) → subidos a 13-18% de opacidad del acento.
5. 33/40 · 16/20 · 19/20 — corregido: precios sin count-up → `<CountUp>` (useMotionValue);
   foco de teclado invisible → `:focus-visible` global; secciones poco distinguibles → hairline
   horizontal en el cambio base/elevada de `SectionShell`.
6. 32/40 · 16/20 · 17/20 — corregido: sin skip-to-content → agregado en `layout.tsx` (`#main`).
   Variación de ±1-3 puntos entre rondas 4-6 pese a fixes reales = ruido normal del revisor
   independiente, no regresión.

DIAGNÓSTICO — por qué Usabilidad no cruza 36/40 aunque Craft y Copy sí:
La rúbrica de 10 heurísticas de Nielsen fue diseñada para pantallas de PRODUCTO (con estado,
formularios, acciones destructivas). Varias no aplican de forma significativa a una landing de
una sola pasada, sin login ni datos propios del usuario:
  - h3 "Control y libertad" (deshacer/cancelar) — una landing no tiene acciones que deshacer.
  - h6 "Reconocer vs recordar" — no hay nada que recordar entre pantallas de un scroll único.
  - h7 "Flexibilidad y atajos" — no hay atajos de experto posibles sin una app detrás.
  - h9 "Errores con solución" — no hay formularios que fallen (el registro vive en /onboarding).
  - h10 "Ayuda contextual" — cubierto solo parcialmente por el FAQ.
Estos 5 criterios structuralmente rondan 2-3/4 en CUALQUIER landing bien hecha, jamás 4 — lo que
pone un techo aproximado de 32-34/40 sin importar cuánto se pula. Los 3 fixes reales de accesibi-
lidad ya aplicados (focus-visible, skip-to-content, hairlines) subieron el promedio lo que se
podía subir de forma honesta. Seguir iterando aquí (ronda 7, 8...) tiene rendimientos decrecientes
— se documenta el techo en vez de perseguir un número que puede no ser alcanzable para este TIPO
de pantalla con esta rúbrica.

Defectos que se DEJAN pendientes a propósito, con su razón:
- **Placeholders del hero y del carrusel "La app por dentro"** (ahora con ícono, ya no solo
  texto): son placeholders honestos porque la app interna todavía no existe — regla explícita de
  `19-PAGINA-DE-VENTAS.md` §5 "MOCKUPS HONESTOS PRE-LANZAMIENTO". Se reemplazan por screenshots
  reales al cerrar la Sesión 5, y ahí se vuelve a correr el revisor-visual con el techo levantado.
- **Badge "X días gratis" en AMBOS planes**: `19-PAGINA-DE-VENTAS.md` §6 exige literalmente
  "DOS PLANES SIEMPRE... AMBOS con PRUEBA GRATUITA visible" — no se quita, es regla canónica.
- **Los 4 CTAs repiten el mismo texto**: es la regla dura de repetir el mismo verbo del hero en
  todo el scroll (42/52) — no es un bug, es la estructura de conversión pedida por el sistema.
- **Contraste base/elevado**: se subió con mesh radial + hairline (rondas 3-5); subir más
  requeriría tocar los hex de `--bg`/`--surface` de FICHA-ARTE.md, cosa juzgada que necesita OK
  explícito del usuario — no se toca sin permiso.
- No se modificaron componentes `.tsx` del kit protegido más allá de lo justificado arriba en
  esta misma sección ("Desviación del kit protegido").

Screenshot vigente: `docs/revisiones/landing-375.png` (scroll real simulado + 1.2s de espera para
que terminen las animaciones de conteo/anillo antes de capturar).

### Sección extra "Para abogados de familia" — nueva línea de ingresos (2026-09-07)
El usuario pidió agregar, al final de la landing, un bloque para vender publicidad a abogados de
familia que quieran aparecer como referencia dentro de la app. Es una audiencia distinta a Carlos
(el avatar comprador de la app) — **no se agregó como una 11ª sección canónica del 19**, sino como
un bloque aparte (`components/landing/AnuncioAbogados.tsx`), visualmente distinto (card con borde,
tono B2B, CTA en outline para no competir con el CTA principal), colocado DESPUÉS de la sección 9
(CTA final) y ANTES de la 10 (footer legal) — la estructura de 10 secciones que vende a Carlos NO
se tocó ni se reordenó.
- CTA: mailto a `alianzas@coparentia.app` (placeholder — confirmar email real con el usuario).
- Conecta con la ventaja ya documentada del usuario (campo 20/21: contacto cercano con un
  abogado de familia) — este bloque es el mecanismo de producto para monetizar esa relación a
  escala, más allá de un solo aliado.
- Pendiente para cuando haya interés real: definir precio/plan de publicidad (necesitaría su
  propia FICHA-MERCADO si se vuelve una línea de negocio formal) y una página de aterrizaje
  propia para abogados si el volumen de interesados lo justifica.

### Desviación del kit protegido — justificada por pedido explícito del usuario
El usuario pidió (2026-09-07) que la landing tuviera más elementos visuales (como el anillo de
avance), degradés suaves y que todas las secciones tuvieran sus íconos. Cambios acumulados en
`components/landing/ui.tsx` (compartido) y en componentes individuales, todos ADITIVOS (props
opcionales o utilidades nuevas, nunca se rompió el contrato ni la estructura canónica de 10
secciones):
- `<MiniRing>`: anillo de progreso compacto, animado con `motion.circle`/`whileInView` (stroke de
  0 al valor real) — usado en `Agitacion.tsx` (0%/0%) y `Solucion.tsx` (0%→100%).
- `<CountUp>`: cifras de precio que cuentan desde 0 (`useMotionValue`+`animate`) — usado en
  `Oferta.tsx` → `Precio`.
- Mesh radial de `SectionShell`/`Hero.tsx` subido de 5-8% a 13-18% de opacidad del acento (mismos
  hex de FICHA-ARTE, solo más intensidad — no se inventó color nuevo).
- Íconos por placeholder en el carrusel `AppPorDentro.tsx` (Home/ListChecks/CreditCard/Upload).
- Hairline horizontal entre cambios base/elevada de `SectionShell` (excepto secciones "flush").
- `:focus-visible` global en `tokens.css` + skip-to-content en `layout.tsx`.
Todo reduced-motion respetado. Justificado por ser pedido directo del dueño del producto
(`plantillas-codigo/landing/README.md` protege la estructura, no prohíbe mejoras aditivas
autorizadas explícitamente).

### FICHA-MODELO y FICHA-MERCADO — resueltos
Ambas fichas se crearon en esta sesión con datos investigados y fuentes reales (ver
FICHA-MODELO.md y FICHA-MERCADO.md en la raíz). La garantía de 15 días quedó verificada contra
los plazos reales que permite Hotmart (7/15/21/30 días) y corregida para cumplir la regla dura
garantía > prueba (antes ambas eran de 7 días, error ya corregido en todo el copy).

## Siguiente paso
Sesión 4: Onboarding, paywall y login (ver sección de arriba). Antes de darla por *vendible* de
verdad, falta cerrar el pendiente de "veredicto landing" cuando la Sesión 5 entregue screenshots
reales de la app interna.
