# VEREDICTO revisor-visual — Inicio (pantalla principal)
Fecha: 2026-09-25 00:00
Screenshot: docs/revisiones/_audit-inicio-actividad-375.png
Usabilidad: 27/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Actividad reciente, filas de movimientos] El monto en pesos queda truncado dentro de la misma línea que hijo+concepto ("$…", "$138…."; app/(app)/inicio/page.tsx L648, clase `truncate` sobre la cadena completa) — en 2 de 3 filas el dato de dinero, que es el valor central de la app, no se alcanza a leer. Fix: sacar el monto del bloque truncado (columna/`<span>` propio sin truncate).
2. [Debajo del botón "Registrar", antes del nav] Franja plana y vacía de ~25-30% de la pantalla capturada sin contenido ni textura antes del menú inferior — `main` es `flex-1 overflow-y-auto` sin salvaguarda para cuando el contenido es más corto que el viewport (app/(app)/layout.tsx L103). Fix: centrar verticalmente el contenido corto o darle más aire a las tarjetas en vez de dejar vacío muerto; probar en 667/812/926px y en PWA de escritorio.
3. [Menú inferior] 6 destinos (Inicio/Pagos/Calendario/Expediente/Asistencia/Perfil) superan el tope de 5 que el propio sistema define — el propio código lo documenta como excepción (components/app/ui.tsx L26-29). A 375px cada ítem queda muy angosto. Fix: mover "Perfil" al avatar de la cabecera (ya tiene chevron) y dejar 5 destinos.
4. [Campana de notificaciones, cabecera] El punto de aviso usa el mismo azul de marca que el resto de la UI en vez de un tono que distinga "hay algo nuevo" — se puede pasar por alto. Fix: usar un tono semántico o mayor contraste para el punto.
5. [Tarjeta "Contacto con tus hijos"] Introduce un cuarto matiz no neutro (ámbar) en una vista que ya usa azul+verde+morado, por encima de la restricción 60-30-10. Fix: usar el chip en tono de acento neutro aquí y reservar el color categórico para Calendario.
