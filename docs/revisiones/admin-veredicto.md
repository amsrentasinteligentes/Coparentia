# VEREDICTO revisor-visual — admin
Fecha: 2026-09-09 00:00
Screenshot: docs/revisiones/admin-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Bloque "Métricas futuras" expandido] Al abrirlo reaparecen 5 sub-bloques (Ventas, Negocio, Retención, Recorrido de bienvenida, Errores) con el mismo patrón de guiones repetido uno tras otro — la sobrecarga de la ronda anterior no se eliminó, se aplazó un tap. Fix: recortar a 2 métricas realmente próximas a activarse (Ventas, Retención) y sacar Errores/Recorrido de bienvenida hasta que existan esos sistemas.
2. [Header, esquina superior derecha] "Volver a la app" y "Cerrar sesión" tienen el mismo peso visual (mismo tamaño, mismo borde) pese a ser acciones de frecuencia y riesgo distintos — el ojo no distingue cuál es la de uso diario. Fix: bajar el énfasis visual de "Cerrar sesión" (texto sin borde) o moverla a un menú.
3. [Ícono "i" junto a cada título de card] Área táctil de 44px correcta, pero el glifo visible mide 14px sin fondo — a simple vista no se lee como botón de ayuda, se confunde con un adorno. Fix: fondo circular sutil (igual al de los íconos de card) para que se note tapable.
4. [Card "Ganancia real" y "Uso de la app"] Ambas resuelven con el mismo componente SinDatos (caja punteada con 3 líneas de texto) inmediatamente debajo del título — dos cards seguidas con la misma caja gris alargan el scroll antes de llegar a un dato real (Usuarios). Fix: la primera card con dato real (Usuarios) debería ir antes que "Ganancia real" si esta última sigue sin datos.
5. [Gate doble de cierre] 30/40 usabilidad y 15/20 craft quedan por debajo de 36/40 y 16/20 — mejora real sobre la ronda anterior pero todavía no cumple el umbral de "lista".
