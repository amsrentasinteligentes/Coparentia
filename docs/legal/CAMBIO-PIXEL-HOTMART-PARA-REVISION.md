# Pixel de Meta dentro de Hotmart — cambio propuesto para revisión de la abogada (NO publicado, Pixel NO activado)

## Qué se quiere hacer
Activar el Pixel de Meta (ID 29032956989677482, público) en Hotmart → Herramientas → Píxel de seguimiento → producto Coparentia → "facebook + Instagram". El formulario de Hotmart solo pide el ID del píxel. Hotmart carga el Pixel en su página de pago y envía a Meta los eventos de esa página (inicio de pago y compra). Para qué: que Meta vea las ventas y pueda optimizar anuncios; hoy la venta ocurre en Hotmart y el Pixel de coparentia.co no la ve.

## Por qué toca la política
La política vigente (sección de cookies) dice que el Pixel solo corre en las páginas públicas de Coparentia y solo si la persona lo acepta. La página de pago es de Hotmart (proveedor independiente) y allí NO aparece el aviso de cookies de Coparentia. Hotmart puede enviar a Meta datos de la compra (p. ej. correo cifrado), sin que Coparentia los controle.

## Texto propuesto (rama `meta-hotmart-politica`, `app/privacidad/page.tsx`)
Agrega, justo después de "Puedes cambiar tu elección en cualquier momento con el botón de abajo.":
> La compra se completa en la página de pago de Hotmart, un proveedor independiente. En esa página, Hotmart puede cargar el Pixel de Meta bajo sus propios avisos y su propia política de privacidad, y compartir con Meta datos de la compra (por ejemplo, un correo en formato cifrado). Coparentia no controla ese aviso: rechazar el aviso de cookies de Coparentia no impide lo que Hotmart haga en su página. Eso no cambia lo que Coparentia envía a Meta desde sus propias páginas.

## Preguntas para la abogada
1. ¿Basta este texto, o hay que pedir consentimiento propio antes de enviar al comprador a Hotmart?
2. ¿Conviene mencionar a Hotmart como encargado/proveedor en otra sección de la política?
3. ¿Hay que actualizar la fecha "Última actualización" y avisar a clientes actuales?

## Dato que debe comprobar el dueño antes
Abrir la página de pago de Hotmart en una ventana de incógnito (desde "Empezar prueba" del paywall, sin pagar) y ver si Hotmart muestra su propio aviso de cookies. Anotar lo que diga.

## Pasos al aprobarse
1. Publicar la rama (política con la frase). 2. Pegar el ID del Pixel en Hotmart y guardar (reversible: se quita con un clic). 3. Probar con una compra real o de prueba que Meta registra la compra.
