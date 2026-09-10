# VEREDICTO revisor-visual — Pantalla principal (Inicio)
Fecha: 2026-09-10 00:00
Screenshot: docs/revisiones/inicio-375.png
Usabilidad: 28/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Modal "Nuevo registro" (el formulario que abre el botón de Inicio) — el nav inferior TAPA el CTA "Guardar registro": `ContenedorApp` usa `relative isolate` (components/app/ui.tsx:354) y crea un contexto de apilamiento, así que el z-30 del modal, el z-40 de `VisorImagen` y el z-40 de `SelloConfianza` quedan por debajo del `<BottomNav>` z-20 del layout → fix: montar modal/visor/sello con `createPortal(document.body)` (o quitar `isolate` y aislar solo el halo).
2. Inicio — el `<BotonFlotante>` SIGUE montado sobre la tercera tarjeta: `Dashboard()` renderiza `<ContenedorApp>` sin la prop nueva (app/(app)/inicio/page.tsx:482); `conBotonFlotante` solo se pasa en la rama de error (línea 64), que no tiene FAB → fix: `<ContenedorApp conBotonFlotante>` en `Dashboard`.
3. Modal de registro — CTA muerto por defecto (`disabled={!archivo || !monto || !concepto.trim()}`, pagos/page.tsx:457) al 40% de opacidad y sin decir qué falta → fix: habilitado siempre, validar al click con hint bajo el campo incompleto.
4. Pagos, error de fila — texto sin tildes ("conexion", "intentalo", pagos/page.tsx:91) frente al resto de la app con tildes; `errorArchivo` sin `role="alert"` (línea 450) y `obtenerTitulo()` del modal sin `.catch` (línea 281) → fix: corregir el copy, añadir role y catch.
5. Inicio — el vacío de "Últimos movimientos" enseña pero no ofrece salida (sin CTA, inicio/page.tsx:604) y el escalonado no es cascada (índices 0,1,2 en las stats y otra vez 0,1,2 en la lista); la flecha de Ajustes vuelve siempre a /expediente → fix: CTA en el vacío, índice continuo, y back que respete el origen.
