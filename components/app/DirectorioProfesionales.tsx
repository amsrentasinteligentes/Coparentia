'use client';

// DIRECTORIO DE PROFESIONALES — reemplaza a AbogadoDestacado.tsx (2026-09-28, pedido del usuario:
// sumar Psicólogos familiares y Trabajadores sociales al espacio que antes solo tenía abogados).
// Selector de 3 categorías arriba (ronda 2 del diseño, con referencia del usuario): solo se
// muestra la lista de la categoría elegida, no las 3 apiladas — "más resumido y ordenado".
//
// Los profesionales viven en la tabla `public.profesionales` de Supabase (2026-09-28 — antes
// era un arreglo fijo en código; ahora el dueño los agrega/edita/quita desde /admin/profesionales,
// sin tocar código). Este componente se usa dentro de la app Y en la landing, así que consulta la
// base directo con el cliente de navegador (anon key + RLS pública de solo-activos) en vez de
// recibir los datos por prop — misma fuente para los dos lugares, un profesional nuevo aparece
// automáticamente en ambos.
//
// Mismo modelo de negocio de siempre: un profesional PAGA por su cupo en una categoría — "Espacio
// publicitario" (el texto NO cambia: decisión explícita del usuario, aunque hoy sea gratis el
// arranque, la intención real es que se pague más adelante).
//
// TRES ESTADOS POR CATEGORÍA, NUNCA UN PERFIL INVENTADO:
//   · Con profesionales reales → sus tarjetas de perfil (foto, nombre, especialidad, ciudad, botón
//     de WhatsApp), con la etiqueta "Patrocinado" — divulgación honesta de que es publicidad.
//   · Sin ninguno todavía → estado honesto invitando a anunciarse, específico de esa categoría.

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Scale, MapPin, MessageCircle } from 'lucide-react';
import { Tarjeta, IconoCirculo, TarjetaSkeleton } from '@/components/app/ui';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { CATEGORIAS_PROFESIONAL, CONTACTO_ALIANZAS, filaAProfesional, type CategoriaProfesional, type Profesional, type FilaProfesional } from '@/lib/profesionales';

// Cuenta el clic en "Contactar" en event_log (2026-09-28, pedido del usuario: "¿podemos llevar un
// récord de cuántos contactaron a un profesional?") — funciona con o sin sesión (dentro de la app
// Y en la landing pública), ver supabase/contacto-profesional.sql para el permiso del lado sin
// sesión. Nunca bloquea el clic real: si falla el registro, el enlace se abre igual (regla de
// lib/datos.ts: medir importa menos que la acción del usuario).
function registrarClicContactar(profesional: Profesional): void {
  const supabase = crearClienteSupabase();
  supabase.auth.getUser().then(({ data: { user } }) => {
    supabase
      .from('event_log')
      .insert({
        user_id: user?.id ?? null,
        nombre: 'contacto_profesional_click',
        propiedades: { profesional_id: profesional.id, nombre: profesional.nombre, categoria: profesional.categoria },
      })
      .then(() => {});
  });
}

// Formato de tarjeta (2026-09-28, referencia del usuario): foto + nombre + especialidad + ciudad +
// botón de contacto — SIN calificaciones ni reseñas (pedido explícito: "elimina el tema de las
// calificaciones" — además, inventar una reseña sería la misma prueba social falsa que el SO
// prohíbe en toda la auditoría).
function TarjetaPerfil({ profesional }: { profesional: Profesional }) {
  return (
    <Tarjeta destacada className="mt-3">
      <div className="flex items-start gap-3">
        {profesional.fotoUrl ? (
          <Image
            src={profesional.fotoUrl}
            alt={`Foto de ${profesional.nombre}`}
            width={64}
            height={64}
            className="size-16 shrink-0 rounded-[var(--radius-card)] object-cover object-top"
          />
        ) : (
          <IconoCirculo icon={Scale} size={22} />
        )}
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[15px] font-bold leading-[1.25] text-[var(--text-primary)]">{profesional.nombre}</p>
          <p className="mt-0.5 text-[13px] leading-[1.3] text-[var(--text-secondary)]">{profesional.especialidad}</p>
          {profesional.ciudad && (
            <p className="mt-1 flex items-center gap-1 text-[12px] text-[var(--text-tertiary)]">
              <MapPin size={12} aria-hidden="true" />
              {profesional.ciudad}
            </p>
          )}
        </div>
      </div>

      <a
        href={profesional.contactoUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => registrarClicContactar(profesional)}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[13.5px] font-semibold text-[var(--on-accent,var(--bg))] [touch-action:manipulation]"
      >
        <MessageCircle size={16} aria-hidden="true" />
        Contactar
      </a>
    </Tarjeta>
  );
}

export function DirectorioProfesionales() {
  const [activa, setActiva] = useState<CategoriaProfesional>('abogado');
  const [profesionales, setProfesionales] = useState<Profesional[] | null>(null); // null = cargando
  const [error, setError] = useState(false);

  useEffect(() => {
    let vigente = true;
    crearClienteSupabase()
      .from('profesionales')
      .select('id, categoria, nombre, especialidad, ciudad, contacto_url, foto_url, activo, orden')
      .eq('activo', true)
      // Orden fijado desde /admin/profesionales primero; sin uno asignado, por nombre (A-Z) —
      // así "fijar a alguien primero y el resto alfabético" es solo mover a esa persona una vez.
      .order('orden', { ascending: true, nullsFirst: false })
      .order('nombre', { ascending: true })
      .then(({ data, error: errorConsulta }) => {
        if (!vigente) return;
        if (errorConsulta) {
          setError(true);
          return;
        }
        setProfesionales(((data ?? []) as FilaProfesional[]).map(filaAProfesional));
      });
    return () => {
      vigente = false;
    };
  }, []);

  const categoria = CATEGORIAS_PROFESIONAL.find((c) => c.id === activa)!;
  const deLaCategoria = (profesionales ?? []).filter((p) => p.categoria === activa);

  return (
    <div className="mt-6">
      <p className="text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">Profesionales que pueden ayudarte</p>

      {/* Selector de categoría — solo la elegida muestra su lista abajo (pedido del usuario,
          2026-09-28, ronda 2: "más resumido y ordenado" que las 3 apiladas). */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {CATEGORIAS_PROFESIONAL.map((cat) => {
          const seleccionada = cat.id === activa;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiva(cat.id)}
              aria-pressed={seleccionada}
              className="flex flex-col items-start gap-1.5 rounded-[var(--radius-card)] border p-3 text-left [touch-action:manipulation]"
              style={{
                borderColor: seleccionada ? cat.color : 'color-mix(in oklab, var(--text-tertiary) 18%, transparent)',
                background: seleccionada ? cat.colorBg : 'var(--surface)',
              }}
            >
              {/* El ícono SIEMPRE lleva el color propio de su categoría (no solo cuando está
                  activa) — pedido del usuario, 2026-09-28: "que no se vea tan plano". */}
              <cat.icon size={18} style={{ color: cat.color }} aria-hidden="true" />
              <span className="text-[12.5px] font-bold leading-[1.2] text-[var(--text-primary)]" style={seleccionada ? { color: cat.color } : undefined}>
                {cat.etiqueta}
              </span>
              <span className="text-[10.5px] leading-[1.3] text-[var(--text-tertiary)]">{cat.corta}</span>
            </button>
          );
        })}
      </div>

      {profesionales === null ? (
        <div className="mt-3">
          <TarjetaSkeleton filas={1} />
        </div>
      ) : error ? (
        <Tarjeta className="mt-3">
          <p className="text-[13px] leading-[1.5] text-[var(--text-secondary)]">
            No pudimos cargar el directorio. Puede ser una falla pasajera de conexión — vuelve a intentarlo en un momento.
          </p>
        </Tarjeta>
      ) : deLaCategoria.length > 0 ? (
        deLaCategoria.map((p) => <TarjetaPerfil key={p.id} profesional={p} />)
      ) : (
        <Tarjeta className="mt-3">
          <div className="flex items-start gap-3">
            <IconoCirculo icon={categoria.icon} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-[1.5] text-[var(--text-secondary)]">{categoria.motivoVacio}</p>
            </div>
          </div>
          <a
            href={`mailto:${CONTACTO_ALIANZAS}?subject=${encodeURIComponent(`Quiero anunciarme en Coparentia — ${categoria.etiqueta}`)}`}
            className="mt-3 inline-block text-[12px] text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]"
          >
            ¿Trabajas en esto? Anúnciate aquí
          </a>
        </Tarjeta>
      )}

      <p className="mt-3 text-[11px] leading-[1.5] text-[var(--text-tertiary)]">
        Espacio publicitario. Coparentia no presta estos servicios ni responde por la asesoría de terceros.
      </p>
    </div>
  );
}
