// MÁQUINA DE ESTADOS DE LA SUSCRIPCIÓN — la usan dos sitios: el webhook de Hotmart (para decidir
// a qué estado mueve cada aviso) y el candado de la app (`app/(app)/layout.tsx`, para decidir si
// alguien con sesión iniciada tiene acceso HOY). Vive en un solo archivo para que las dos partes
// nunca puedan quedar desincronizadas sobre qué significa cada estado.

export type Status = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'refunded' | 'chargeback';

// ⚠️ Nombres de eventos = los que documenta Hotmart para un producto de tipo suscripción
// ("assinatura"). VERIFICAR contra el panel real de esta cuenta (Herramientas → Webhook → la
// lista de eventos que ofrece elegir) antes de confiar ciegamente: el catálogo puede variar por
// cuenta o versión (docs/sistema/18-VENTA-HOTMART.md lo marca igual como placeholder).
export const EVENTOS_HOTMART = {
  APROBADA: 'PURCHASE_APPROVED',
  COMPLETA: 'PURCHASE_COMPLETE',
  REEMBOLSO: 'PURCHASE_REFUNDED',
  CONTRACARGO: 'PURCHASE_CHARGEBACK',
  CANCELACION: 'SUBSCRIPTION_CANCELLATION',
  VENCIDA: 'PURCHASE_EXPIRED',
  ATRASADA: 'PURCHASE_DELAYED',
  CAMBIO_PLAN: 'SWITCH_PLAN',
} as const;

// Un reembolso o un contracargo son estados TERMINALES: un aviso viejo reentregado por Hotmart
// (reintento tardío de una aprobación anterior a la disputa) nunca puede resucitarlos.
const TERMINAL_NEGATIVO: Status[] = ['refunded', 'chargeback'];

// 'trialing' y 'active' dan acceso COMPLETO — la diferencia entre los dos es de MEDICIÓN
// (¿cuántas pruebas se vuelven pago?), nunca de qué puede hacer la persona en la app.
const ACCESO_COMPLETO: Status[] = ['trialing', 'active'];

/** ¿Es legal pasar de `from` a `to`? Bloquea reactivaciones ilegales por avisos viejos. */
export function transicionValida(from: Status | null, to: Status): boolean {
  if (from === null) return true; // suscripción nueva
  if (TERMINAL_NEGATIVO.includes(from) && (to === 'active' || to === 'trialing')) return false;
  return true;
}

/** ¿Esta persona puede usar la app HOY? Se llama con la fila real de `suscripciones`. */
export function tieneAccesoCompleto(
  status: Status,
  ahora: Date,
  accessUntil?: Date | null,
  graceEndsAt?: Date | null
): boolean {
  if (ACCESO_COMPLETO.includes(status)) return true;
  if (status === 'cancelled') return !!accessUntil && ahora < accessUntil; // ya pagado, no se corta antes de tiempo
  if (status === 'past_due') return !!graceEndsAt && ahora < graceEndsAt; // días de gracia del cobro fallido
  return false; // expired / refunded / chargeback
}

// ¿Este aviso de pago es el INICIO de la prueba gratis, o un cobro real? Es plausible que Hotmart
// mande el MISMO evento (aprobación) tanto al empezar la prueba (monto 0) como al primer cobro
// real (monto > 0) — verificar con una compra de prueba real antes de confiar del todo (mismo
// placeholder que documenta 18-VENTA-HOTMART.md). Se decide por el MONTO, no solo por el nombre
// del evento: es la señal más confiable disponible sin haber visto un aviso real todavía.
export function esInicioDePrueba(montoPagado: number | null | undefined): boolean {
  return !montoPagado || montoPagado <= 0;
}

/** A qué estado mueve cada evento — `null` = el evento no cambia el acceso (se reconoce, se ignora). */
export function estadoParaEvento(evento: string, montoPagado: number | null): Status | null {
  switch (evento) {
    case EVENTOS_HOTMART.APROBADA:
    case EVENTOS_HOTMART.COMPLETA:
      return esInicioDePrueba(montoPagado) ? 'trialing' : 'active';
    case EVENTOS_HOTMART.ATRASADA:
      return 'past_due';
    case EVENTOS_HOTMART.CANCELACION:
      return 'cancelled';
    case EVENTOS_HOTMART.VENCIDA:
      return 'expired';
    case EVENTOS_HOTMART.REEMBOLSO:
      return 'refunded';
    case EVENTOS_HOTMART.CONTRACARGO:
      return 'chargeback';
    default:
      return null; // incluye SWITCH_PLAN y cualquier evento aún no mapeado
  }
}
