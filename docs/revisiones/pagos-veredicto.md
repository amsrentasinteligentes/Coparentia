# VEREDICTO revisor-visual — pagos
Fecha: 2026-10-23 12:00
Screenshot: docs/revisiones/pagos-375.png
Usabilidad: 28/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [ALTA] Tarjeta "Cuota de octubre" contradictoria: "Sin registrar" en rojo + "Vence el día 5" cuando ya venció hace 18 días, icono ámbar vs píldora roja, y sin acción directa en la tarjeta (page.tsx l.199-208) -> decir "Venció el 5 de oct", icono en tono alerta y botón "Registrar cuota de octubre" que abra el modal con tipo cuota. 2) [ALTA] Sin estado de carga: mientras llegan los datos se pintan "Por registrar", "—" y "Todavía no hay comprobantes" falsos y luego saltan (page.tsx l.42-97, 197-232, 361) -> mostrar TarjetaSkeleton mientras titulo===null y no hay falloCarga. 3) [MEDIA-ALTA] Objetivos táctiles de ~24px y ruido repetido: "Borrar" en cada fila (l.421) alineado a la derecha donde flota el botón Registrar, y el enlace "Viendo todos los meses · volver al mes actual" de 12px sin área (l.323) -> mover Borrar a un menú ⋯ o al detalle con área >=44px y convertir el enlace en chip h-11. 4) [MEDIA] Elementos que parecen tocables y no hacen nada: chip Wallet junto al "?" y fila "Próximo vencimiento" con chevron (l.187, 211-220) -> quitar chevron/chip o darles acción. 5) [MEDIA] Densidad y datos crípticos: tres tarjetas de resumen (una con "$0" vacío) empujan la lista bajo y=850; cabecera "4 · $ 1.248.000" suma cuotas con extras; cifra héroe estática sin NumeroContado; píldora "Sello" solo en cuotas aunque todo registro lo recibe -> fusionar/ocultar "Gastos extra de este mes" si es 0, rotular el total ("4 registros · $...") o quitarlo, contar la cifra héroe y rotular "Cuota"/"Extra".
