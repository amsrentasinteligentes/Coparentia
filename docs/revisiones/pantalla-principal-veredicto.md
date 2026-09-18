# VEREDICTO revisor-visual — pantalla-principal (Inicio)
Variante: clara r1 (arranca la variante clara del interior — commit c3a50a4)
Fecha: 2026-09-17 21:40
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 28/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos:
1. [Actividad reciente / esquina inferior derecha] El FAB "Registrar" (BotonFlotante, sticky bottom-4) tapa la 2ª y 3ª fila de la lista (fecha "10 de sept" y el ícono quedan debajo del botón); ContenedorApp solo deja pb-6 → dar pb-24 al contenedor cuando hay FAB (o mover el FAB a la cabecera de Actividad como acción inline) para que ninguna fila quede oculta.
2. [Cabecera] El isotipo (/logo-isotipo.png, 32px) se ve como un cuadrado gris borroso, no como el logo azul de la referencia; y la foto del saludo pixelada con corte recto arriba/derecha → reemplazar el asset por el isotipo real (SVG/PNG 2x) y la foto por el original; desplazar el blob (-right-3 -top-2) para que el recorte lo haga la forma orgánica, no el borde.
3. [Tarjeta Cuota alimentaria / píldora "Al día"] #1F8F60 sobre #DFF5EA mide 3.6:1 (no 4.2 como dice tokens-app-claro.css) en 11px bold → falla AA; subir a #157A4F (≈4.6:1) o usar --status-success como texto sobre fondo blanco.
4. [Tres captions] text-[10.5px] en "Mes actual · día 5", "meses que lleva tu expediente · $ 10.027.000" y las fechas de la lista: por debajo del mínimo 11px del SO y 8 tamaños tipográficos en pantalla (26/18/17/15/13/12/11/10.5) → subir a 11.5-12px y consolidar a 4 tamaños.
5. [Cabecera / campana] Punto azul hardcodeado (ui.tsx:432) sin nada detrás: sugiere avisos nuevos y la campana solo lleva a /calendario; y "Ver todo ›" usa un carácter de texto donde toda la pantalla usa ChevronRight de Lucide → mostrar el punto solo si hay eventos en las próximas 48h; usar el mismo ícono.
Notas: FICHA-ARTE.md aún dice que el interior conserva el kit oscuro (líneas 84-85) — documentar la variante clara del interior con tokens-app-claro.css como fuente de verdad. Pagos/Calendario/Expediente/Asistencia siguen en tema oscuro: al tocar un acceso la app cambia de modo (h4).
