'use client';

// VISTA PREVIA del archivo elegido, ANTES de guardarlo.
//
// POR QUÉ EXISTE: en "primeros pasos" el input registraba el comprobante en el mismo momento de
// elegirlo — sin verlo, sin confirmar. En una app cuyo producto es la PRUEBA, eso significa que
// una foto borrosa, la del recibo equivocado o una captura a medias entraba al expediente que se
// lleva a un juzgado y que ahora, además, se incrusta en el PDF que recibe el abogado.
// Mirar antes de guardar no es un lujo: es el paso que evita ensuciar la evidencia.
//
// Muestra la imagen real (no un ícono genérico) porque el error típico no es "elegí un archivo
// que no era", es "elegí LA FOTO que no era" — y eso solo se detecta viéndola.

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

export function VistaPreviaArchivo({ archivo }: { archivo: File }) {
  const [url, setUrl] = useState<string | null>(null);
  const esPdf = archivo.type === 'application/pdf' || archivo.name.toLowerCase().endsWith('.pdf');

  useEffect(() => {
    if (esPdf) return;
    const objeto = URL.createObjectURL(archivo);
    setUrl(objeto);
    // Sin revocar, cada foto elegida deja su copia retenida en memoria hasta recargar la página.
    return () => URL.revokeObjectURL(objeto);
  }, [archivo, esPdf]);

  const pesoMb = (archivo.size / (1024 * 1024)).toFixed(1);

  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-3">
      {esPdf ? (
        <span className="flex size-16 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
          <FileText size={26} color="var(--accent)" aria-hidden="true" />
        </span>
      ) : url ? (
        // eslint-disable-next-line @next/next/no-img-element -- es un blob local temporal, no un asset
        <img
          src={url}
          alt="Vista previa del comprobante que elegiste"
          className="size-16 shrink-0 rounded-[var(--radius-button)] object-cover"
        />
      ) : (
        <span className="size-16 shrink-0 animate-pulse rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] [animation-duration:1.6s]" />
      )}
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-[13.5px] font-medium text-[var(--text-primary)]">{archivo.name}</p>
        <p className="text-[12px] text-[var(--text-tertiary)]">
          {esPdf ? 'Documento PDF' : 'Imagen'} · {pesoMb} MB
        </p>
      </div>
    </div>
  );
}
