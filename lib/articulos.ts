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

// Revisados por el equipo jurídico del usuario (2026-09-29) — reemplazan a los 3 anteriores
// (escritos por mí, nunca revisados por un abogado real). Contenido pegado tal cual lo entregó
// el equipo jurídico, solo partido en párrafos para el arreglo `cuerpo`.
export const ARTICULOS: Articulo[] = [
  {
    slug: 'como-hablar-de-dinero-sin-pelear',
    titulo: 'Cómo hablar de dinero sin que cada gasto termine en una pelea',
    resumen: 'Escuchar, explicar y dejar constancia de lo acordado — para que la conversación parta de información compartida.',
    color: 'info',
    publicadoEn: '2026-09-27',
    cuerpo: [
      'Después de una separación, hablar de dinero puede despertar frustraciones que van más allá de las cifras. Sin embargo, la cuota alimentaria y los gastos de los hijos merecen una conversación clara y respetuosa. Por ejemplo, si llega el momento de pagar una matrícula y nunca se habló de cómo asumirla, una necesidad del niño puede convertirse en una discusión entre sus padres.',
      'Escuchar, explicar y dejar constancia de lo acordado ayuda a prevenir malentendidos. En Coparentia puedes organizar pagos y gastos para que la conversación parta de información compartida. El propósito no es ganar una discusión: es que tu hijo tenga lo que necesita.',
    ],
  },
  {
    slug: 'que-hacer-si-no-pagan-la-cuota-alimentaria',
    titulo: '¿Qué hacer cuando no se paga la cuota alimentaria?',
    resumen: 'Revisa fechas, valores y comprobantes antes de discutir — y a dónde acudir si no llegan a un acuerdo.',
    color: 'pendiente',
    publicadoEn: '2026-09-28',
    cuerpo: [
      'Un pago que no llega puede alterar los planes del hogar y generar preocupación. Antes de discutir sobre lo que cada uno recuerda, revisa las fechas, los valores y los comprobantes. Si no se lleva un registro, con el paso de los meses puede ser difícil saber qué se pagó, qué está pendiente y sobre qué deben conversar.',
      'Coparentia te ayuda a ordenar esa información y a plantear el tema con claridad. Dialogar es un primer paso para comprender lo ocurrido y buscar una solución; si no es posible llegar a un acuerdo, puedes consultar a los especialistas en derecho que encuentras en la plataforma. No dejes que la incertidumbre se acumule junto con los pagos pendientes.',
    ],
  },
  {
    slug: 'acuerdos-claros-para-tus-hijos',
    titulo: 'Acuerdos claros para que tus hijos no queden en medio',
    resumen: 'Coordinar horarios y cambios de planes con claridad, para que ningún niño quede esperando.',
    color: 'accent',
    publicadoEn: '2026-09-29',
    cuerpo: [
      'La crianza compartida también se construye en los detalles: quién recoge a los niños, a qué hora regresan o cómo se informa un cambio de planes. Si una visita se modifica y solo uno de los padres conoce el nuevo horario, el niño puede esperar un encuentro que no sucede. Esa confusión se puede evitar con diálogo y acuerdos claros.',
      'Coparentia te permite organizar fechas, compromisos y conversaciones importantes para que ambos padres puedan coordinarse mejor. Y cuando una situación se vuelve difícil de manejar, buscar orientación jurídica o psicológica puede ayudarles a encontrar una forma de avanzar. Cumplir lo acordado también es una manera de cuidar.',
    ],
  },
];

export function obtenerArticulo(slug: string): Articulo | undefined {
  return ARTICULOS.find((a) => a.slug === slug);
}
