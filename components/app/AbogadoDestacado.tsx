'use client';

// TARJETA DE ABOGADO PATROCINADO — segundo ingreso de Coparentia: un abogado de familia paga por
// aparecer aquí, en la pantalla de Expediente, justo donde el usuario piensa "¿y ahora a quién le
// muestro esto?". NO es un banner: es una tarjeta tipo directorio, del mismo kit visual que el
// resto de la app.
//
// DOS ESTADOS, UN SOLO COMPONENTE:
//   · Con patrocinador (ABOGADO_ACTUAL != null) → muestra su perfil real: nombre, especialidad,
//     ciudad, foto si la dio, y un botón para contactarlo. Lleva la etiqueta "Patrocinado" —
//     divulgación honesta, es publicidad pagada.
//   · Sin patrocinador → estado honesto: le dice al usuario que pronto verá abogados verificados,
//     y ofrece a los abogados anunciarse. NUNCA un abogado de relleno inventado.
//
// Cuando un abogado de verdad pague, se completan los datos de ABOGADO_ACTUAL abajo (o se pasa
// por prop `abogado`). No hace falta base de datos todavía.

import Image from 'next/image';
import { Briefcase, ExternalLink } from 'lucide-react';
import { Tarjeta, IconoCirculo } from '@/components/app/ui';

export interface AbogadoDestacado {
  nombre: string;
  /** Ej. "Derecho de familia · Cuota alimentaria" */
  especialidad: string;
  ciudad: string;
  /** mailto:, tel:, o https://wa.me/… — a dónde escribe el usuario. */
  contactoUrl: string;
  /** Foto de perfil (opcional). Debe vivir en /public o ser una URL https permitida. */
  fotoUrl?: string;
}

// ⬇️ Cuando un abogado pague por el cupo, poné sus datos acá. Mientras sea `null`, la tarjeta
//    muestra el estado honesto de "todavía no hay abogados verificados".
const ABOGADO_ACTUAL: AbogadoDestacado | null = null;

// Email al que escriben los abogados interesados (mismo que la sección de la landing).
const CONTACTO_ALIANZAS = 'alianzas@coparentia.app';

export function AbogadoDestacado({ abogado = ABOGADO_ACTUAL }: { abogado?: AbogadoDestacado | null }) {
  if (!abogado) {
    return (
      <Tarjeta className="mt-6">
        <div className="flex items-start gap-3">
          <IconoCirculo icon={Briefcase} />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-[var(--text-primary)]">
              ¿Necesitas que un abogado revise tu expediente?
            </p>
            <p className="mt-1 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
              Pronto verás aquí abogados de familia de tu ciudad, listos para acompañarte con lo que
              ya tienes documentado.
            </p>
          </div>
        </div>
        <a
          href={`mailto:${CONTACTO_ALIANZAS}?subject=${encodeURIComponent('Quiero anunciarme en Coparentia')}`}
          className="mt-3 inline-block text-[12px] text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]"
        >
          ¿Eres abogado de familia? Anúnciate aquí
        </a>
      </Tarjeta>
    );
  }

  return (
    <Tarjeta destacada className="mt-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
        Abogado de familia · Patrocinado
      </p>
      <div className="mt-3 flex items-center gap-3">
        {abogado.fotoUrl ? (
          <Image
            src={abogado.fotoUrl}
            alt={`Foto de ${abogado.nombre}`}
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <IconoCirculo icon={Briefcase} size={22} />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">{abogado.nombre}</p>
          {/* Especialidad y ciudad en líneas separadas: juntas con " · " la ciudad se cortaba en
              móvil cuando la especialidad es larga. */}
          <p className="truncate text-[13px] text-[var(--text-secondary)]">{abogado.especialidad}</p>
          <p className="truncate text-[12px] text-[var(--text-tertiary)]">{abogado.ciudad}</p>
        </div>
      </div>
      <a
        href={abogado.contactoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] text-[13.5px] font-semibold text-[var(--accent)] [touch-action:manipulation]"
      >
        Escribir a {abogado.nombre.split(' ')[0]}
        <ExternalLink size={15} aria-hidden="true" />
      </a>
      <p className="mt-2 text-[11px] leading-[1.5] text-[var(--text-tertiary)]">
        Espacio publicitario. Coparentia no presta servicios legales ni responde por la asesoría de
        terceros.
      </p>
    </Tarjeta>
  );
}
