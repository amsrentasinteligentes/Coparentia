// CATÁLOGO DEL WEBHOOK DE HOTMART — decide si un aviso es de ESTE producto. Función pura (sin base de
// datos ni variables), para poder probarla con casos ficticios. Auditoría externa 2026-10-02.
//
// Que el aviso sea de Hotmart de verdad (el hottok coincide) no significa que sea de Coparentia: si la
// cuenta llega a vender algo más, la venta de ESE producto no puede dar acceso a esta app.

export type VeredictoProducto =
  /** HOTMART_PRODUCT_ID no está configurada: el webhook rechaza TODO aviso (falla cerrada). */
  | 'config_faltante'
  /** El aviso es de otro producto, o no dice de cuál y habría dado acceso: no se aplica. */
  | 'ajeno'
  /** El aviso es de este producto (o no dice de cuál pero NO da acceso: cancelar, reembolsar…). */
  | 'ok';

/**
 * @param esperado     HOTMART_PRODUCT_ID (el identificador de Coparentia en Hotmart).
 * @param recibido     `data.product.id` del aviso, si vino.
 * @param otorgaAcceso true si el evento llevaría a la persona a 'trialing' o 'active'.
 *
 * Regla: si el aviso trae producto, tiene que ser el nuestro. Si NO lo trae, solo se acepta cuando el
 * evento no da acceso (una cancelación o un reembolso sin producto no abre nada, y descartarlos dejaría
 * a un cliente con acceso que ya no corresponde).
 */
export function evaluarProducto(
  esperado: string | undefined,
  recibido: string | undefined,
  otorgaAcceso: boolean
): VeredictoProducto {
  const esperadoLimpio = esperado?.trim();
  if (!esperadoLimpio) return 'config_faltante';
  const recibidoLimpio = recibido?.trim();
  if (recibidoLimpio) return recibidoLimpio === esperadoLimpio ? 'ok' : 'ajeno';
  return otorgaAcceso ? 'ajeno' : 'ok';
}
