# VEREDICTO revisor-visual — Pantalla principal (Inicio)
Fecha: 2026-09-10 12:00
Screenshot: docs/revisiones/inicio-375.png
Usabilidad: 22/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:2 h2:3 h3:2 h4:3 h5:2 h6:2 h7:2 h8:3 h9:1 h10:2
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Gate: ≥36/40 y ≥16/20 — falla ambos.

Top defectos:
1. [Dashboard — carga de datos, `app/(app)/inicio/page.tsx:37-42` y `:286-294`] Ni un solo `.catch`: si Supabase falla, la red se cae o la sesión expiró, o el esqueleto pulsa para SIEMPRE (nunca se pone `listo`), o el expediente se pinta vacío ($0 · 0 comprobantes · "Todavía no hay movimientos") como si la persona no tuviera nada guardado — el miedo exacto del usuario. `obtenerPagos/obtenerEventos` además se tragan el `error` y devuelven `[]`, así que el estado vacío MIENTE. → Añadir estado de error con "Reintentar" + timeout en el arranque; nunca renderizar el vacío cuando la carga falló.
2. [Primeros pasos — "Elegir archivo", `page.tsx:95-113`] Sube sin `validarArchivoAdjunto` (que SÍ usan Pagos y Calendario) y sin `.catch`: una foto de 20 MB o un .docx deja "Aplicando el Sello de Confianza a…" girando indefinidamente justo en la primera victoria. → Validar tamaño/tipo antes de subir y mostrar el fallo con qué hacer.
3. [Encabezado — "Cuota de $ 850.000 · día 5"] La cuota no se puede editar en NINGUNA pantalla de la app (`guardarTitulo` solo se invoca en primeros pasos), pero el copy del paso 1 promete "puedes ajustarlo cuando quieras". → Hacer el subtítulo tocable hacia una hoja de edición del título.
4. [CTA "Subir un comprobante", pie de pantalla] La única acción primaria queda cortada detrás de la nav fija en la primera vista y es un `<Link>` sin `whileTap` ni `:active` — los botones idénticos del flujo sí responden al tap. → Fijarlo sobre la nav (`sticky bottom-[calc(76px+env(safe-area-inset-bottom))]`) y darle feedback de tap.
5. [Tarjeta del anillo — "Meses con registro 3 de 6"] El "6" es una meta inventada en código (`metaMeses = 6`), sin rótulo ni relación con el caso del usuario; y la pantalla no responde la pregunta diaria ("¿voy al día este mes?") — la `Pildora` semántica del kit no se usa en Inicio. → Explicar/derivar la meta y agregar píldora de estado del mes en curso.

Notas de verificación (lo declarado por quien construyó):
- CONFIRMADO: `BarraAtras` con "Paso X de 2"; `tieneOnboardingCompleto` derivado de datos reales (título + ≥1 pago); `PageHeader` con `palabraClave`+`halo` (el marcador sobre "expediente" se ve claramente en el render); esqueleto de arranque y de carga; `NumeroContado` en los 3 números; `Tarjeta` con `indice` (escalonado); estado vacío real en "Últimos movimientos"; navegación con `Link`; luz ambiental al 9%; pulso de celebración condicionado a hito nuevo; `prefers-reduced-motion` respetado en todo (Tarjeta, NumeroContado, template, nav, celebración, skeleton).
- MATIZADO: el escalonado no es una cascada coherente — la tarjeta del anillo y la de "Próximo" van con `indice` 0 y la lista de movimientos reinicia en 0, así que las tarjetas de abajo entran antes que las de arriba. El halo del header queda tapado por la luz ambiental (ambos aclaran la misma zona superior): el dispositivo ownable que se lee es el marcador, no el halo. La celebración se dispara en falso la primera vez que se abre la app en un navegador nuevo con datos ya existentes (la marca en localStorage arranca en 0).
- DESVÍO DE FICHA-ARTE: la ficha declara "hairline degradada" como parte de la profundidad; `Tarjeta` usa un borde sólido plano. El tercer nivel de superficie (`--surface-2`, "hundido") existe en tokens y no se usa en esta pantalla.
