# VEREDICTO revisor-visual — pantalla principal (Inicio)
Fecha: 2026-09-10 18:40
Screenshot: docs/revisiones/inicio-375.png
Usabilidad: 28/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:2 h4:3 h5:2 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Top defectos:
1. [Dashboard, estado de fallo] Con `falloCarga` en true se muestra `<ErrorDeCarga>` pero DEBAJO se
   siguen pintando "Últimos movimientos" + el vacío "Todavía no hay movimientos" + el CTA: el mismo
   mensaje "no tienes nada" que el arreglo #1 venía a matar → meter todo desde el h2 "Últimos
   movimientos" hasta el CTA dentro del mismo ternario de `falloCarga`.
2. [Primeros pasos / Pagos — lib/datos.ts] Un comprobante registrado es IRREVERSIBLE: no existe
   `eliminarPago` ni edición en ninguna pantalla, y elegir el archivo sube y registra sin
   previsualización ni confirmación → paso de revisión antes de guardar + "Eliminar comprobante"
   con confirmación en Pagos.
3. [Inicio, primera vista 375×812] La única acción primaria ("Subir un comprobante") queda fuera de
   la primera vista, mientras Pagos y Calendario usan `BotonFlotante` siempre visible → usar el
   mismo `BotonFlotante` (o CTA sticky) en Inicio.
4. [Primeros pasos, paso 1] `confirmarTitulo` guarda `Number(dia)||1` y `Number(monto)||0` sin
   validar rango (Ajustes sí lo hace): se puede guardar "día 45" y verlo en el header → reutilizar
   la validación de `EditorCuota` antes de guardar.
5. [Tarjeta del anillo + Ajustes] Desvío de FICHA-ARTE: la píldora "AL DÍA" es verde #63b58f cuando
   la ficha declara éxito = #5B93E8 con ícono de check; y la flecha de Ajustes vuelve siempre a
   /expediente aunque se entre desde Inicio → píldora azul con check (o firmar la excepción en la
   ficha) + `router.back()`.

Menores verificados en código: `obtenerTitulo().then` de PrimerosPasos sin `.catch` (rechazo sin
manejar), skeleton `aria-hidden` sin `aria-busy`/`aria-live`, `ErrorDeCarga` sin `role="alert"`,
y sin estado vacío cuando no hay próximo evento (la tarjeta simplemente desaparece).
