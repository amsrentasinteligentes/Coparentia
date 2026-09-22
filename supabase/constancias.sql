-- CONSTANCIAS A LA OTRA PARTE (2026-09-22) — pégalo completo en Supabase → SQL Editor → New query →
-- Run. Idea del usuario: que la otra parte se entere por correo de lo que se va registrando, aunque
-- no use la app. Decisión (opción 1): NO un correo por registro —sería hostigamiento y quemaría la
-- reputación del dominio—, sino un RESUMEN mensual automático + un botón "Enviar constancia ahora".
-- Lo que de verdad vale es la trazabilidad: queda registrado a quién se envió, cuándo y qué contenía,
-- y eso entra al expediente en PDF. El registro es append-only: es evidencia, no se edita ni se borra.

-- ── 1. Datos de la otra parte y preferencia del usuario ────────────────────────────────────────
alter table public.profiles
  add column if not exists otro_progenitor_email text,
  add column if not exists constancias_mensuales boolean not null default false;

grant update (nombre, rol_familiar, avatar_path, otro_progenitor_nombre, otro_progenitor_email, constancias_mensuales)
  on public.profiles to authenticated;

-- ── 2. Registro de constancias enviadas ────────────────────────────────────────────────────────
create table if not exists public.constancias (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  destinatario   text not null,
  periodo        text not null,                 -- 'YYYY-MM' del resumen enviado
  origen         text not null check (origen in ('manual', 'mensual')),
  resumen        jsonb not null default '{}'::jsonb,  -- totales que se comunicaron (prueba de contenido)
  proveedor_id   text,                          -- id del envío en Resend (para rastrear entrega)
  estado         text not null default 'enviada' check (estado in ('enviada', 'fallida')),
  created_at     timestamptz not null default now()
);
create index if not exists constancias_user_id_idx on public.constancias(user_id, created_at desc);
-- Una sola constancia mensual automática por período (el botón manual sí puede repetirse).
create unique index if not exists constancias_mensual_unica on public.constancias(user_id, periodo) where origen = 'mensual';

alter table public.constancias enable row level security;

create policy "constancias_select_propias" on public.constancias
  for select using ((select auth.uid()) = user_id);
create policy "constancias_insert_propias" on public.constancias
  for insert with check ((select auth.uid()) = user_id);

-- Nadie edita ni borra una constancia desde la app: es prueba de que se informó.
revoke update, delete on public.constancias from authenticated;

create or replace function public.bloquear_cambios_constancias()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  raise exception 'Las constancias enviadas no se pueden modificar ni borrar: son tu prueba de que informaste.';
end;
$$;
revoke all on function public.bloquear_cambios_constancias() from public;
drop trigger if exists constancias_inmutables on public.constancias;
create trigger constancias_inmutables before update or delete on public.constancias
  for each row execute function public.bloquear_cambios_constancias();
