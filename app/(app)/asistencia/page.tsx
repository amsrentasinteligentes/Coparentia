'use client';

// ASISTENCIA JURÍDICA — nueva sección de la app: arriba, un canal directo para que el usuario
// mande su duda legal (llega por correo a la abogada que responde — lib/email.ts —, con WhatsApp como respaldo de un
// solo toque); abajo, el espacio publicitario de abogados que antes vivía al final de Expediente
// (segundo ingreso de la app) — este es el lugar donde tiene más sentido: justo después de
// preguntar, el usuario ya está pensando en hablar con un abogado de verdad.

import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Send, Scale, MailCheck } from 'lucide-react';
import { ContenedorApp, Tarjeta, IconoCirculo, CabeceraApp, TituloSeccion } from '@/components/app/ui';
import { AbogadoDestacado } from '@/components/app/AbogadoDestacado';
import { enviarConsulta } from './acciones';

// Número de WhatsApp del negocio — el botón abre WhatsApp con el mensaje ya escrito; el usuario
// solo tiene que tocar "Enviar" ahí (WhatsApp no deja que ninguna app externa mande en su nombre).
const WHATSAPP_NUMERO = '573012283506';

type Estado = 'idle' | 'enviando' | 'enviado' | 'error';

const LARGO_MINIMO = 10;

export default function Asistencia() {
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const [aviso, setAviso] = useState('');

  const habilitado = mensaje.trim().length >= LARGO_MINIMO && estado !== 'enviando';

  const enviarPorCorreo = async (): Promise<void> => {
    if (!habilitado) return;
    setEstado('enviando');
    const r = await enviarConsulta(mensaje);
    setAviso(r.mensaje);
    setEstado(r.ok ? 'enviado' : 'error');
    if (r.ok) setMensaje('');
  };

  const enlaceWhatsapp = `https://wa.me/${WHATSAPP_NUMERO}${
    mensaje.trim() ? `?text=${encodeURIComponent(mensaje.trim())}` : ''
  }`;

  return (
    <>
      <CabeceraApp />
      <ContenedorApp sinTope>
      <TituloSeccion titulo="Asistencia jurídica" subtitulo="Escríbenos tu duda: te respondemos por correo o WhatsApp." icon={Scale} />

      {estado === 'enviado' ? (
        <Tarjeta className="mt-4 flex flex-col items-center text-center" role="status">
          <IconoCirculo icon={MailCheck} size={24} tono="exito" grande />
          <p className="mt-4 text-[18px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">Tu consulta ya está en camino</p>
          <p className="mt-2 max-w-[32ch] text-[14px] leading-[1.6] text-[var(--text-secondary)]">
            La recibimos y una abogada del equipo la va a leer con calma. Te respondemos a tu correo en el menor tiempo posible — no tienes que hacer nada más.
          </p>
          <p className="mt-3 text-[13px] font-bold text-[var(--accent-ink,var(--accent))]">Equipo Coparentia</p>
          <button
            type="button"
            onClick={() => setEstado('idle')}
            className="mt-5 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] text-[14px] font-bold text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]"
          >
            Enviar otra consulta
          </button>
        </Tarjeta>
      ) : (
      <Tarjeta className="mt-4">
        <div className="flex items-center gap-3">
          <IconoCirculo icon={MessageCircle} size={18} />
          <p className="text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">¿Qué necesitas resolver?</p>
        </div>

        <textarea
          value={mensaje}
          onChange={(e) => {
            setMensaje(e.target.value);
            if (estado === 'error') setEstado('idle');
          }}
          placeholder="Ej.: mi expareja lleva 2 meses sin pagar la cuota, ¿qué puedo hacer?"
          rows={3}
          className="mt-3 w-full resize-none rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] p-4 text-[15px] leading-relaxed text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />

        <motion.button
          type="button"
          disabled={!habilitado}
          onClick={enviarPorCorreo}
          whileTap={{ scale: 0.98 }}
          className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent,var(--bg))] transition-opacity disabled:opacity-60 [touch-action:manipulation]"
        >
          <Send size={18} aria-hidden="true" />
          {estado === 'enviando' ? 'Enviando…' : 'Enviar consulta'}
        </motion.button>

        <a
          href={enlaceWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] text-[14px] font-bold text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]"
        >
          O escríbenos por WhatsApp
        </a>

        {aviso && estado === 'error' && (
          <p role="alert" className="mt-2 text-[13px] leading-[1.5] text-[var(--status-error)]">
            {aviso}
          </p>
        )}
      </Tarjeta>
      )}

      {/* Espacio publicitario para abogados de familia — mudado aquí desde Expediente: este es el
          momento donde el usuario ya está pensando en hablar con un abogado de verdad. */}
      <AbogadoDestacado />
      </ContenedorApp>
    </>
  );
}
