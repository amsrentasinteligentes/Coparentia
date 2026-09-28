'use client';

// RECORDATORIO DE CUOTA POR NOTIFICACIÓN PUSH (2026-09-28) — cumple la promesa del onboarding
// ("alertas en el momento que elegiste"), acotada al único aviso real que hoy se puede mandar de
// forma confiable: unos días antes del día de pago que la persona configuró (ver
// app/api/cron/recordatorio-cuota/route.ts).
//
// EN IPHONE: Apple solo permite Web Push cuando la PWA ya está instalada a la pantalla de inicio
// (iOS ≥ 16.4) — no es una limitación de esta app, es la plataforma. Se reutiliza la misma
// detección de components/app/InstalarApp.tsx (useEsIOS/useInstalada) en vez de duplicarla.

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { IconoCirculo } from '@/components/app/ui';
import { useEsIOS, useInstalada } from '@/components/app/InstalarApp';

// La misma clave pública VAPID que el servidor usa para firmar — es pública a propósito (viaja al
// navegador), la privada nunca sale de las variables de entorno del servidor.
const CLAVE_PUBLICA_VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// El navegador exige la clave como Uint8Array respaldado por un ArrayBuffer real (no el genérico
// ArrayBufferLike que da `Uint8Array.from`) — así lo pide el tipo de `applicationServerKey`.
function convertirClave(base64url: string): Uint8Array<ArrayBuffer> {
  const relleno = '='.repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + relleno).replace(/-/g, '+').replace(/_/g, '/');
  const cruda = window.atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(cruda.length));
  for (let i = 0; i < cruda.length; i++) bytes[i] = cruda.charCodeAt(i);
  return bytes;
}

type Estado = 'cargando' | 'soportado_apagado' | 'soportado_prendido' | 'bloqueado' | 'no_soportado_ios';

export function FilaNotificacionesPush() {
  const esIOS = useEsIOS();
  const instalada = useInstalada();
  const [estado, setEstado] = useState<Estado>('cargando');
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    let vigente = true;
    async function calcularEstado(): Promise<void> {
      if (esIOS && !instalada) {
        if (vigente) setEstado('no_soportado_ios');
        return;
      }
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !CLAVE_PUBLICA_VAPID) {
        if (vigente) setEstado('no_soportado_ios'); // mismo mensaje sirve: "este navegador no lo permite todavía"
        return;
      }
      if (Notification.permission === 'denied') {
        if (vigente) setEstado('bloqueado');
        return;
      }
      try {
        const registro = await navigator.serviceWorker.register('/sw.js');
        const suscripcion = await registro.pushManager.getSubscription();
        if (vigente) setEstado(suscripcion ? 'soportado_prendido' : 'soportado_apagado');
      } catch {
        if (vigente) setEstado('soportado_apagado');
      }
    }
    calcularEstado();
    return () => {
      vigente = false;
    };
  }, [esIOS, instalada]);

  const activar = async (): Promise<void> => {
    if (!CLAVE_PUBLICA_VAPID) return;
    setOcupado(true);
    setError(null);
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== 'granted') {
        setEstado(permiso === 'denied' ? 'bloqueado' : 'soportado_apagado');
        return;
      }
      const registro = await navigator.serviceWorker.ready;
      const suscripcion = await registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertirClave(CLAVE_PUBLICA_VAPID),
      });
      const cuerpo = suscripcion.toJSON();
      const resp = await fetch('/api/push/suscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: cuerpo.endpoint, keys: cuerpo.keys }),
      });
      if (!resp.ok) throw new Error('el servidor no confirmó la suscripción');
      setEstado('soportado_prendido');
    } catch {
      setError('No pudimos activar los recordatorios. Intenta de nuevo en un momento.');
      setEstado('soportado_apagado');
    } finally {
      setOcupado(false);
    }
  };

  const desactivar = async (): Promise<void> => {
    setOcupado(true);
    setError(null);
    try {
      const registro = await navigator.serviceWorker.ready;
      const suscripcion = await registro.pushManager.getSubscription();
      if (suscripcion) {
        const endpoint = suscripcion.endpoint;
        await suscripcion.unsubscribe();
        await fetch('/api/push/suscribir', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        });
      }
      setEstado('soportado_apagado');
    } catch {
      setError('No pudimos desactivar los recordatorios. Intenta de nuevo en un momento.');
    } finally {
      setOcupado(false);
    }
  };

  if (estado === 'cargando') return null;

  if (estado === 'no_soportado_ios') {
    return (
      <div className="flex w-full items-center gap-3 border-b border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] py-3">
        <IconoCirculo icon={Bell} size={18} tono="pendiente" />
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-[14px] font-bold text-[var(--text-primary)]">Recordatorio de cuota</span>
          <span className="block text-[12px] text-[var(--text-secondary)]">Instala la app en tu iPhone primero — es un permiso de Apple, no de Coparentia.</span>
        </span>
      </div>
    );
  }

  const prendido = estado === 'soportado_prendido';
  const bloqueado = estado === 'bloqueado';

  return (
    <>
      <div className="flex w-full items-center gap-3 border-b border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] py-3">
        <IconoCirculo icon={Bell} size={18} tono={prendido ? 'exito' : 'accent'} />
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-[14px] font-bold text-[var(--text-primary)]">Recordatorio de cuota</span>
          <span className="block text-[12px] text-[var(--text-secondary)]">
            {bloqueado
              ? 'Bloqueado en el navegador — actívalo desde su configuración de notificaciones para este sitio.'
              : prendido
                ? 'Te avisamos unos días antes de tu día de pago'
                : 'Recibe un aviso en tu teléfono unos días antes'}
          </span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={prendido}
          aria-label="Recordatorio de cuota por notificación"
          disabled={ocupado || bloqueado}
          onClick={prendido ? desactivar : activar}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 [touch-action:manipulation] disabled:opacity-40 ${prendido ? 'bg-[var(--accent)]' : 'bg-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)]'}`}
        >
          {/* `left-1` explícito (no depender de la posición "estática" implícita de un absolute
              sin left/right — dentro de un <button>, que centra su contenido por defecto, esa
              posición implícita termina pegada al borde derecho, y el transform nunca se ve
              porque ya arranca ahí: hallazgo real reportado por el usuario en su Android,
              2026-09-28). Con la base fija, `translate-x-5` mueve exactamente lo necesario para
              dejar el mismo margen (4px) a ambos lados en el estado prendido. */}
          <span className={`absolute left-1 top-1 size-5 rounded-full bg-white shadow-[var(--shadow-1)] transition-transform duration-200 ${prendido ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
      {error && <p role="alert" className="py-2 text-[12px] text-[var(--status-error)]">{error}</p>}
    </>
  );
}
