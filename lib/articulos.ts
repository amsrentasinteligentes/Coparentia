// BANCO DE ARTÍCULOS DE ASISTENCIA (2026-09-28, pedido del usuario) — contenido estático, sin
// CMS: agregar uno nuevo es agregar un objeto a este arreglo. `icon`/`color` reemplazan una foto
// de stock (no hay fotos reales de personas para esto, y una foto genérica de banco de imágenes
// es justo el tipo de relleno que el SO pide evitar — mejor un ícono propio sobre un color con
// intención, coherente con el resto del kit visual).
//
// Rotación: por ahora se muestran los 3 más recientes (ver ArticulosAsistencia.tsx) — cuando haya
// más de 3, los de arriba reemplazan a los de abajo automáticamente por orden de fecha.

export interface Articulo {
  slug: string;
  titulo: string;
  resumen: string;
  cuerpo: string[]; // un párrafo por elemento
  color: 'accent' | 'exito' | 'info' | 'pendiente';
  publicadoEn: string; // ISO, solo para ordenar
}

export const ARTICULOS: Articulo[] = [
  {
    slug: 'como-documentar-tu-cuota-alimentaria',
    titulo: 'Cómo documentar tu cuota alimentaria para que nadie la dude',
    resumen: 'Los 4 datos que un juez o un abogado buscan primero en un comprobante — y cómo tenerlos siempre listos.',
    color: 'accent',
    publicadoEn: '2026-09-01',
    cuerpo: [
      'Un comprobante de pago sirve poco si no se puede leer con claridad quién pagó, cuánto, cuándo y por qué concepto. Antes de guardar cualquier comprobante, revisa que se vean estos 4 datos: la fecha exacta (no solo el mes), el monto completo, el nombre de quien envía o recibe, y una referencia al concepto — "cuota alimentaria de [mes]" es suficiente, no hace falta más.',
      'Si tu banco no incluye el concepto en el comprobante, agrégalo tú mismo antes de subirlo: una nota escrita a mano sobre la foto, o el campo de "descripción" de la transferencia. Ese detalle, que toma cinco segundos, es la diferencia entre un comprobante que cualquiera puede interpretar y uno que necesita explicación.',
      'Guarda el comprobante el mismo día del pago, no cuando tengas tiempo. Entre más tiempo pase, más fácil es perder el archivo original o confundir de qué mes era. Por eso el Sello de Confianza de Coparentia fecha automáticamente cada comprobante apenas lo subes — ese registro de fecha es, en la práctica, más confiable que la memoria de cualquiera.',
      'Si la cuota se paga en efectivo (todavía pasa, sobre todo entre familiares), pide un recibo firmado con los mismos 4 datos. Un recibo firmado a mano vale como prueba tanto como una transferencia — lo que no vale es no tener nada.',
    ],
  },
  {
    slug: 'que-hacer-si-tu-expareja-deja-de-pagar',
    titulo: 'Qué hacer (y qué no) si tu expareja deja de pagar la cuota',
    resumen: 'Los primeros pasos antes de pensar en una demanda — y por qué documentar bien es el que más importa.',
    color: 'pendiente',
    publicadoEn: '2026-09-10',
    cuerpo: [
      'Este artículo es información general, no asesoría legal para tu caso — cada situación familiar tiene detalles que solo un abogado que la conozca puede evaluar. Dicho eso, hay pasos generales que aplican casi siempre.',
      'Primero, confirma que de verdad no hay pago, no que llegó tarde o por un medio distinto al de costumbre. Revisa todos los canales (efectivo, transferencia, consignación a un tercero) antes de asumir que no hubo pago.',
      'Segundo, no dejes de registrar el mes solo porque no hubo comprobante que subir. En Coparentia puedes dejar constancia de que el mes quedó sin pago — ese vacío, fechado, es tan importante como los meses que sí tienes documentados: muestra el patrón completo, no solo lo favorable.',
      'Tercero, junta el contexto: mensajes donde se habló del pago, acuerdos previos, cualquier comunicación relacionada. No necesitas construir un caso tú mismo — eso lo hace un abogado —, pero sí necesitas que esa información no se pierda mientras decides tus siguientes pasos.',
      'Por último, busca orientación profesional antes de actuar por tu cuenta (enviar mensajes amenazantes, publicar en redes, etc.). Un abogado de familia puede decirte en una sola consulta qué tan sólido está tu caso y cuál es el camino más corto — desde la sección de Asistencia de la app puedes escribirle directamente a uno.',
    ],
  },
  {
    slug: 'hablar-con-tu-coparent-sin-que-termine-en-pelea',
    titulo: 'Cómo hablar de dinero con tu coparent sin que termine en pelea',
    resumen: 'Tres cambios pequeños en cómo se comunica el tema de la cuota que bajan la tensión de verdad.',
    color: 'info',
    publicadoEn: '2026-09-18',
    cuerpo: [
      'La plata es, casi siempre, el tema donde más rápido se cae la comunicación entre copadres — no porque el monto en sí sea el problema, sino porque cada mensaje sobre dinero carga encima todo lo demás que no se resolvió en la separación.',
      'Primer cambio: separa el mensaje del dato. En vez de "otra vez tarde, como siempre", prueba con "el pago de este mes no ha llegado, ¿me confirmas cuándo?". El segundo mensaje pide información; el primero pide pelea, aunque no sea la intención.',
      'Segundo cambio: que el registro hable por ti. Si ya llevas un expediente ordenado (con o sin la app), no necesitas convencer a nadie de que tienes razón en una conversación — el registro mismo es la prueba, y eso te permite mantener el mensaje corto y neutral.',
      'Tercer cambio: acuerda un canal fijo para hablar de dinero, y no mezcles otros temas ahí. Un chat aparte solo para cuota y comprobantes (o la constancia mensual automática de Coparentia) evita que cada conversación sobre plata se vuelva también una conversación sobre todo lo demás.',
    ],
  },
];

export function obtenerArticulo(slug: string): Articulo | undefined {
  return ARTICULOS.find((a) => a.slug === slug);
}
