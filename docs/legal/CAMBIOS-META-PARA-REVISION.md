# Cambios propuestos por el Pixel de Meta — para revisión de la abogada (NO publicados)

Contexto: en la cuenta de Meta del Pixel "Coparentia" (ID 29032956989677482) están ACTIVADAS dos funciones de Meta:
1. "Incluir automáticamente información más detallada de las páginas y los productos" (IA que lee contenido público de la página: textos, precios).
2. "Medir conversiones en los dispositivos de los clientes" (medición desde el navegador de la persona; Meta anuncia que empieza el 12/11/2026).
Están apagadas por defecto: "Eventos automáticos" y "Coincidencias automáticas del sitio web". "Cookies de origen" está activada (así funciona el Pixel).
Si se dejan prendidas, los textos actuales quedan cortos. Rama: `meta-textos-legales`.

## 1. Política de privacidad (sección de cookies, `app/privacidad/page.tsx`)
Agrega, justo después de "…(como la dirección IP y las cookies de Meta).":
> Meta también puede leer el contenido público de estas páginas (por ejemplo, textos y precios) y medir, desde tu navegador, si una visita que llegó desde nuestros anuncios terminó en una acción en nuestro sitio, para mostrarnos qué anuncios funcionan.

Se mantiene sin cambios: "No le enviamos tu correo, tu nombre, tus respuestas ni ningún contenido de tu expediente… Coparentia no autorizará a terceros a utilizar datos sensibles o datos de NNA para publicidad comportamental."

## 2. Aviso de cookies (`components/BannerCookies.tsx`)
Antes: "Usamos cookies del Pixel de Meta para medir qué pasos del proceso funcionan y mejorar nuestros anuncios. No enviamos tu correo, tu nombre ni lo que respondes. Tú decides."
Ahora: "Usamos el Pixel de Meta para medir qué pasos del proceso funcionan y qué anuncios te trajeron hasta aquí. Meta puede medir tu visita desde tu navegador. No enviamos tu correo, tu nombre ni lo que respondes. Tú decides."

## 3. Nueva versión de la elección (`lib/meta-pixel.ts`)
La clave guardada pasa de `coparentia_cookies_meta_v1` a `_v2`: quien aceptó el texto anterior vuelve a ver el aviso y elige de nuevo.

## 4. Pendiente al publicar
- Actualizar la fecha "Última actualización" de la política (hoy dice "octubre de 2026").
- Preguntas para la abogada: ¿basta con este texto?, ¿la fecha de entrada en vigor?, ¿hace falta avisar de otra forma a quienes ya aceptaron?
