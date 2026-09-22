'use client';

// CONSTANCIA A LA OTRA PARTE (2026-09-22) — tarjeta del Expediente desde donde la persona envía,
// cuando quiera, el resumen del mes a la otra parte, y ve las constancias que ya envió.
//
// Idea del usuario: que la otra parte se entere aunque no use la app. Lo que se construyó NO es un
// aviso por cada registro (sería hostigamiento y quemaría la reputación del dominio de correo),
// sino esta constancia —manual o mensual— cuyo valor real es la TRAZABILIDAD: queda escrito a
// quién, cuándo y qué se informó, y eso sale en el PDF.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Send, MailCheck, AlertTriangle } from 'lucide-react';
import { Tarjeta, IconoCirculo } from '@/components/app/ui';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { obtenerPerfil } from '@/lib/perfil';
import { periodoTexto } from '@/lib/constancias';
import { enviarConstanciaAhora } from '@/app/(app)/expediente/acciones';

interface FilaConstancia {
  id: string;
  destinatario: string;
  periodo: string;
  origen: string;
  estado: string;
  created_at: string;
}

function fechaHora(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  });
}

export function ConstanciaOtraParte() {
  const [correoOtraParte, setCorreoOtraParte] = useState<string | null>(null);
  const [enviadas, setEnviadas] = useState<FilaConstancia[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = async (): Promise<void> => {
    try {
      const perfil = await obtenerPerfil();
      setCorreoOtraParte(perfil.otroProgenitorEmail || null);
      const supabase = crearClienteSupabase();
      const { data } = await supabase
        .from('constancias')
        .select('id, destinatario, periodo, origen, estado, created_at')
        .order('created_at', { ascending: false })
        .limit(4);
      setEnviadas((data ?? []) as FilaConstancia[]);
    } catch {
      // Sin datos no se bloquea la pantalla: la tarjeta simplemente invita a configurar el correo.
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const enviar = async (): Promise<void> => {
    if (enviando) return;
    setEnviando(true);
    setAviso(null);
    const r = await enviarConstanciaAhora();
    setAviso({ ok: r.ok, texto: r.mensaje });
    setEnviando(false);
    if (r.ok) void cargar();
  };

  if (cargando) return null;

  return (
    <Tarjeta className="mt-3">
      <div className="flex items-start gap-3">
        <IconoCirculo icon={MailCheck} size={20} tono="info" grande />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">Constancia a la otra parte</p>
          <p className="mt-1 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
            {correoOtraParte
              ? 'Le envías por correo el resumen del mes: totales, movimientos y contactos. Queda constancia de la fecha y la hora del envío, y sale en tu PDF.'
              : 'Guarda el correo de la otra parte en Perfil y podrás enviarle el resumen del mes. Queda constancia de que la informaste.'}
          </p>
        </div>
      </div>

      {correoOtraParte ? (
        <>
          <p className="mt-3 truncate text-[12px] text-[var(--text-secondary)]">
            Se enviará a <strong className="text-[var(--text-primary)]">{correoOtraParte}</strong>
          </p>
          <motion.button
            type="button"
            onClick={enviar}
            disabled={enviando}
            whileTap={{ scale: 0.98 }}
            aria-busy={enviando}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] text-[14px] font-bold text-[var(--accent-ink,var(--accent))] transition-opacity disabled:opacity-70 [touch-action:manipulation]"
          >
            <Send size={16} aria-hidden="true" />
            {enviando ? 'Enviando la constancia…' : 'Enviar constancia ahora'}
          </motion.button>
        </>
      ) : (
        <Link
          href="/perfil"
          className="mt-3 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] text-[14px] font-bold text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]"
        >
          Guardar el correo en Perfil
        </Link>
      )}

      {aviso && (
        <p
          role={aviso.ok ? 'status' : 'alert'}
          className={`mt-2 flex items-start gap-1.5 text-[12.5px] leading-[1.5] ${aviso.ok ? 'text-[var(--status-success)]' : 'text-[var(--status-error)]'}`}
        >
          {!aviso.ok && <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />}
          {aviso.texto}
        </p>
      )}

      {enviadas.length > 0 && (
        <ul className="mt-3 flex flex-col border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] pt-2">
          {enviadas.map((c) => (
            <li key={c.id} className="flex items-start gap-2 py-1.5">
              <MailCheck size={14} className={`mt-0.5 shrink-0 ${c.estado === 'enviada' ? 'text-[var(--status-success)]' : 'text-[var(--status-error)]'}`} aria-hidden="true" />
              <p className="min-w-0 flex-1 text-[12px] leading-[1.5] text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">{periodoTexto(c.periodo)}</strong> · {c.estado === 'enviada' ? 'enviada' : 'no pudo enviarse'} el {fechaHora(c.created_at)}
                {c.origen === 'mensual' ? ' (envío automático)' : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  );
}
