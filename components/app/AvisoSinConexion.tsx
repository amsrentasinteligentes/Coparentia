'use client';

// AVISO DE SIN CONEXIÓN.
//
// La app no distinguía "estás sin internet" de "algo falló": las pantallas mostraban su error de
// carga genérico y la persona no sabía si el problema era suyo o de la app. Peor: al intentar
// subir un comprobante sin señal, el intento fallaba sin explicar por qué.
//
// Esto importa especialmente aquí porque el momento de uso real es en la calle, justo después de
// hacer la transferencia — donde la señal es peor, no mejor.
//
// Es una franja, no un modal: sin conexión la app SIGUE siendo útil para leer lo ya cargado, así
// que bloquear la pantalla sería castigar de más.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudOff } from 'lucide-react';

export function AvisoSinConexion() {
  // Arranca en `true` a propósito: en el primer render del servidor no existe `navigator`, y
  // asumir "sin conexión" haría parpadear la franja en cada carga. Se corrige al montar.
  const [enLinea, setEnLinea] = useState(true);

  useEffect(() => {
    const actualizar = (): void => setEnLinea(navigator.onLine);
    actualizar();
    window.addEventListener('online', actualizar);
    window.addEventListener('offline', actualizar);
    return () => {
      window.removeEventListener('online', actualizar);
      window.removeEventListener('offline', actualizar);
    };
  }, []);

  return (
    <AnimatePresence>
      {!enLinea && (
        <motion.div
          role="status"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed inset-x-0 top-0 z-30 flex items-center justify-center gap-2 bg-[color-mix(in_oklab,var(--status-warning)_18%,var(--surface))] px-4 py-2 text-[12.5px] font-medium text-[var(--text-primary)] [padding-top:max(8px,env(safe-area-inset-top))]"
        >
          <CloudOff size={14} color="var(--status-warning)" aria-hidden="true" />
          Sin conexión — puedes seguir viendo lo guardado, pero no registrar nada nuevo.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
