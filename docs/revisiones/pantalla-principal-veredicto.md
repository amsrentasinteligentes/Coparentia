# VEREDICTO revisor-visual — pantalla principal (Inicio)
Fecha: 2026-09-10 18:40
Screenshot: docs/revisiones/inicio-375.png
Usabilidad: 28/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:2 h10:2
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:2
Capturas revisadas: docs/revisiones/inicio-375.png · docs/revisiones/inicio-vista-previa-375.png · docs/revisiones/app-pagos-375.png
Código verificado: app/(app)/inicio/page.tsx · app/(app)/pagos/page.tsx · app/(app)/ajustes/page.tsx · components/app/ui.tsx · components/app/VistaPreviaArchivo.tsx · components/funnel/ui.tsx · components/landing/ui.tsx · lib/datos.ts · FICHA-ARTE.md

Defectos 1-5 de la ronda anterior: VERIFICADOS COMO CORREGIDOS en código
(error que tapa el dashboard entero · eliminarPago + confirmación de dos pasos · VistaPreviaArchivo
elegir≠guardar · validación 1-31 y monto>0 en ambas puertas · Pildora éxito en #5B93E8 con ícono de
check, conforme a FICHA-ARTE). No alcanzan el gate: los puntos que faltaban no vivían ahí.

Top defectos:
1. [Pagos → modal "Nuevo registro", guardar()] `agregarPago(...).then(...)` sin `.catch` (page.tsx ~L294): si falla la red, el botón queda en "Aplicando el Sello de Confianza…" para siempre y NO aparece ningún error — el mismo bug que se corrigió en primeros pasos sigue vivo en la puerta principal de registro → agregar `.catch` que apague `procesando` y muestre qué pasó + qué hacer.
2. [Inicio → último ítem de "Últimos movimientos"] el `<BotonFlotante>` se monta sobre la última tarjeta: `ContenedorApp` tiene `pb-[calc(96px+safe)]` y el FAB llega a ~132px → subir el colchón inferior a `calc(150px+env(safe-area-inset-bottom))` en las pantallas con FAB.
3. [Pagos → tocar un comprobante / borrar] `verComprobante` hace `if (!url) return` (fallo silencioso, sin spinner ni mensaje) y `errorBorrado` se pinta al final de la lista, fuera de pantalla con 4+ tarjetas → indicador de carga en la fila y mensaje de error DENTRO de la tarjeta que se intentó borrar.
4. [Inicio → franja del próximo evento · Pagos → lista vacía] sin evento la tarjeta desaparece sin decir nada, y el vacío de Pagos es una línea gris sin ícono ni CTA (pantalla muda) → tarjeta "Sin eventos próximos · Agendar" y empty state de Pagos con el mismo patrón que el de Inicio.
5. [Inicio → FAB "Registrar" y primeros pasos → "Guardar y continuar"] el FAB solo navega a /pagos, donde hay otro FAB idéntico que hay que volver a tocar; y el botón del alta se apaga al 40% sin decir por qué mientras Ajustes sí lo explica → abrir el modal de registro desde Inicio y mostrar el mismo hint de validación en ambas puertas.

Pendientes menores confirmados: la flecha de Ajustes vuelve siempre a /expediente aunque se entre
desde Inicio · el escalonado no es cascada real (la tarjeta del anillo no lleva `indice` y la lista
reinicia el contador en 0) · en primeros pasos el monto del comprobante se toma del título sin que
la persona pueda revisarlo antes de que entre al expediente · el modal de registro no cierra con Esc
ni atrapa el foco · discrepancia de evidencia: en app-pagos-375.png "Borrar" aparece alineado a la
IZQUIERDA cuando el código lo declara `self-end` (captura desactualizada o clase sobrescrita) —
en ambos casos cada tarjeta arrastra una banda vacía de ~40px.
