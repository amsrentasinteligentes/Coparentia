# VEREDICTO revisor-visual — inicio
Fecha: 2026-10-22 12:00
Screenshot: docs/revisiones/inicio-375.png
Usabilidad: 29/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) El botón flotante "Registrar" tapa el atajo "Especialistas" en la vista inicial (zona inferior derecha de la fila de accesos); no hay reserva de espacio ni se ve el atajo completo. (2) Sin héroe: todas las cifras miden 17px y los títulos 12-15px; la pantalla no tiene un dato dominante (jerarquía plana). (3) Siete bloques apilados (aviso, próximo evento, 2 cifras, 4 accesos, actividad, banner) y varios textos en 11.5px, por debajo del mínimo de 12px; el banner "expediente listo para mostrar" duplica el acceso Expediente y la tarjeta "Meses con registro". (4) Identidad débil: no se ve ningún dispositivo ownable (halo/marcador de la ficha); es un kit fintech claro de tarjetas blancas y chips azules, intercambiable con otra app. (5) Tarjeta "Meses con registro" mezcla "1 de 2", una barra y un total en pesos ($10.547.036) en el pie: dos datos distintos en una línea, confuso. Además la tarjeta de aviso se descarta con un check ambiguo (parece "confirmar", no "cerrar") sin deshacer.

LIMITACIONES: no se pudo verificar a 375 px exactos (recortes de ~420 px de ancho). La parte de arriba de la primera captura es un bloque blanco vacío, así que cabecera y saludo no se vieron ni se puntuaron en imagen. Los estados vacío, carga y error solo se leyeron en el código (TarjetaSkeleton, ErrorDeCarga, empty state de actividad, "Te falta subir tu primer comprobante"); no se vieron renderizados. Las heurísticas 3 y 7 se puntuaron desde el código: FAB y accesos como atajos (bien); sin undo en el descarte de avisos; no se verificó teclado.

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
Detalle craft: jerarquía:2 profundidad:3 identidad:2 movimiento:3 encaje:2
Gate de carga cognitiva: 2 fallas (más de 5 bloques sin agrupar, texto por debajo de 12px); no crítico.
Movimiento (código): stagger por tarjeta (indice*0.05s), conteo con NumeroContado, barra animada, whileTap en FAB y tarjetas, reduced-motion respetado; celebración solo en hito nuevo; transición entre tabs y modales no verificadas.
Ficha de arte: la variante clara con tokens medidos (fondo azulado, tarjetas blancas, azul, Figtree/Nunito) coincide con la actualización 2026-09-18 de la ficha; el halo y el marcador de la ficha no aparecen en esta pantalla.
