-- PANEL DE ADMINISTRACIÓN — base real (acceso solo-dueño + registro de eventos).
-- Pégalo completo en Supabase → SQL Editor → New query → Run (después de schema.sql).
-- Sigue 25-BASE-DE-DATOS.md (uuid, timestamptz, RLS con (select auth.uid()), índice en cada FK)
-- y 09-SEGURIDAD.md (acceso admin verificado EN EL SERVIDOR, nunca solo ocultando la ruta).

-- ── PERFILES — uno por usuario real, creado automáticamente al registrarse ──────────────────
create table if not exists public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  email                text not null,
  nombre               text,
  role                 text not null default 'user' check (role in ('user', 'admin')),
  source               text, -- canal de adquisición (36-ANALITICA-Y-EVENTOS.md); vacío hoy, sin Hotmart
  creado_manualmente   boolean not null default false, -- true si el dueño lo agregó a mano desde el panel
  created_at           timestamptz not null default now()
);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_created_at_idx on public.profiles(created_at desc);

-- Crea el perfil automáticamente cuando alguien se registra (magic link o alta manual del panel
-- — ambos caminos pasan por auth.users, así que este único trigger cubre los dos).
create or replace function public.gestionar_nuevo_usuario()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, nombre)
  values (new.id, new.email, new.raw_user_meta_data->>'nombre')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.gestionar_nuevo_usuario();

-- ── ¿ES EL DUEÑO? — función usada por las políticas de abajo Y por el servidor (lib/supabase/
-- admin.ts) para decidir acceso. security definer: lee profiles sin quedar atrapada en su propia
-- política de RLS (si no, "select role from profiles" dentro de una política de profiles crea un
-- ciclo infinito).
create or replace function public.es_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

create policy "profiles_select_propio_o_admin" on public.profiles
  for select using ((select auth.uid()) = id or public.es_admin());

create policy "profiles_update_propio" on public.profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- RLS controla FILAS, no COLUMNAS: sin esto, la política de arriba dejaría a cualquier usuario
-- actualizar su PROPIO `role` a 'admin' con una llamada directa a la API (auto-escalada de
-- privilegios, A01 de 27-REVISION-SEGURIDAD.md). Un usuario normal solo puede tocar su nombre.
revoke update on public.profiles from authenticated;
grant update (nombre) on public.profiles to authenticated;

-- Sin política de insert/delete para clientes: los perfiles solo nacen del trigger (arriba,
-- security definer) o de una acción de servidor con la service_role key (alta manual, ver
-- app/admin/acciones.ts) — nunca directo desde el navegador.

-- ── EVENT LOG — la fuente de verdad de "qué hace la gente en la app" (36-ANALITICA-Y-EVENTOS.md
-- / 21-BACKOFFICE.md). Cada fila es UN evento real; el panel lee de aquí, nunca inventa. ─────────
create table if not exists public.event_log (
  id            bigint generated always as identity primary key,
  user_id       uuid references auth.users(id) on delete set null,
  nombre        text not null, -- convención objeto_accion snake_case (36)
  propiedades   jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists event_log_user_idx on public.event_log(user_id, created_at desc);
create index if not exists event_log_nombre_idx on public.event_log(nombre, created_at desc);

alter table public.event_log enable row level security;

-- Solo el dueño lee el registro completo (es un dato operativo del negocio, no de un usuario
-- individual navegando la app) — coherente con la regla de 09/21: "solo el backoffice lee".
create policy "event_log_select_admin" on public.event_log
  for select using (public.es_admin());

-- Cualquier usuario autenticado puede registrar SU PROPIO evento (ej. "abrí la app hoy"), nunca
-- el de otro ni leerlos de vuelta.
create policy "event_log_insert_propio" on public.event_log
  for insert with check ((select auth.uid()) = user_id);

-- ── NOTA PARA ACTIVAR TU CUENTA COMO DUEÑO (una sola vez, hazlo tú en el SQL Editor) ─────────
-- update public.profiles set role = 'admin' where email = 'tu-correo-real@ejemplo.com';
