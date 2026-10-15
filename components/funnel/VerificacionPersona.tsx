'use client';

// VERIFICACIÓN "NO SOY UN ROBOT" (Cloudflare Turnstile) para /entrar — auditoría de seguridad
// 2026-10-14: doce contraseñas equivocadas seguidas no frenaban nada. Supabase valida el token del
// lado de Auth (Authentication → Attack Protection); aquí solo se obtiene y se entrega.
//
// · Modo "Managed" con `appearance: 'interaction-only'`: la persona normal no ve nada; solo si
//   Cloudflare duda aparece el desafío.
// · Sin NEXT_PUBLIC_TURNSTILE_SITE_KEY no se pinta nada y `obtenerToken` devuelve undefined: el
//   ingreso funciona como antes (así el código se puede publicar ANTES de activar la protección).
// · Un token sirve UNA sola vez: tras cada uso, `reiniciar()` pide uno nuevo.

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const ESPERA_MAXIMA_MS = 8000;

interface TurnstileApi {
  render: (
    el: HTMLElement,
    opciones: {
      sitekey: string;
      appearance?: 'always' | 'execute' | 'interaction-only';
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    }
  ) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export interface VerificacionPersonaHandle {
  /** Devuelve el token listo (o espera hasta ~8 s); undefined si no hay verificación configurada. */
  obtenerToken: () => Promise<string | undefined>;
  /** Pide un token nuevo — llamar después de CADA uso, haya salido bien o mal. */
  reiniciar: () => void;
}

function cargarScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const existente = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existente) {
      existente.addEventListener('load', () => resolve());
      existente.addEventListener('error', () => reject());
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
}

export const VerificacionPersona = forwardRef<VerificacionPersonaHandle>(function VerificacionPersona(_props, ref) {
  const contenedor = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const token = useRef<string | undefined>(undefined);
  const esperando = useRef<((t: string | undefined) => void)[]>([]);

  const entregar = (t: string | undefined): void => {
    token.current = t;
    if (t) {
      esperando.current.forEach((r) => r(t));
      esperando.current = [];
    }
  };

  useEffect(() => {
    if (!SITE_KEY || !contenedor.current) return;
    let cancelado = false;
    cargarScript()
      .then(() => {
        if (cancelado || !window.turnstile || !contenedor.current) return;
        widgetId.current = window.turnstile.render(contenedor.current, {
          sitekey: SITE_KEY,
          appearance: 'interaction-only',
          callback: (t) => entregar(t),
          'expired-callback': () => entregar(undefined),
          'error-callback': () => entregar(undefined),
        });
      })
      .catch(() => {});
    return () => {
      cancelado = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    obtenerToken: () => {
      if (!SITE_KEY) return Promise.resolve(undefined);
      if (token.current) return Promise.resolve(token.current);
      return new Promise<string | undefined>((resolve) => {
        const temporizador = setTimeout(() => resolve(undefined), ESPERA_MAXIMA_MS);
        esperando.current.push((t) => {
          clearTimeout(temporizador);
          resolve(t);
        });
      });
    },
    reiniciar: () => {
      token.current = undefined;
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    },
  }));

  if (!SITE_KEY) return null;
  return <div ref={contenedor} className="mt-3 flex justify-center empty:hidden" />;
});
