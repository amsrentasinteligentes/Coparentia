-- PERFIL PERSONALIZABLE + "MI FAMILIA" (2026-09-18) — pégalo completo en Supabase → SQL Editor →
-- New query → Run (después de admin.sql y storage.sql). Pedido del usuario: una pestaña Perfil donde
-- la persona ponga su nombre, su foto, su rol (papá/mamá), sus hijos y el nombre de la otra parte,
-- para que la app le hable por su nombre. Sigue 25-BASE-DE-DATOS.md (RLS con (select auth.uid()),
-- índice en cada FK) y 09-SEGURIDAD.md (el usuario solo toca SUS columnas y SU carpeta de Storage).

-- ── 1. Columnas nuevas del perfil ──────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists rol_familiar text check (rol_familiar in ('papa', 'mama')),
  add column if not exists avatar_path text,
  add column if not exists otro_progenitor_nombre text;

-- El usuario puede actualizar SOLO estas columnas de su fila (admin.sql ya revocó el update total
-- para que nadie se auto-ascienda a admin). `email`, `role`, `source` y `creado_manualmente` siguen
-- fuera de su alcance.
grant update (nombre, rol_familiar, avatar_path, otro_progenitor_nombre) on public.profiles to authenticated;

-- ── 2. Hijos — uno por fila, del usuario dueño ────────────────────────────────────────────────
create table if not exists public.hijos (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  nombre            text not null check (char_length(nombre) between 1 and 60),
  fecha_nacimiento  date,
  avatar_path       text,
  created_at        timestamptz not null default now()
);
create index if not exists hijos_user_id_idx on public.hijos(user_id);

alter table public.hijos enable row level security;

create policy "hijos_select_propios" on public.hijos
  for select using ((select auth.uid()) = user_id);
create policy "hijos_insert_propios" on public.hijos
  for insert with check ((select auth.uid()) = user_id);
create policy "hijos_update_propios" on public.hijos
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "hijos_delete_propios" on public.hijos
  for delete using ((select auth.uid()) = user_id);

-- Tope razonable para que nadie llene la tabla desde el navegador: máximo 8 hijos por cuenta.
create or replace function public.limitar_hijos()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (select count(*) from public.hijos where user_id = new.user_id) >= 8 then
    raise exception 'Máximo 8 hijos por cuenta.';
  end if;
  return new;
end;
$$;
revoke all on function public.limitar_hijos() from public;
drop trigger if exists hijos_limite on public.hijos;
create trigger hijos_limite before insert on public.hijos
  for each row execute function public.limitar_hijos();

-- ── 3. Bucket privado "perfiles" para fotos (propia y de los hijos): carpeta {user_id}/… ───────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('perfiles', 'perfiles', false, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "perfiles_propios_select" on storage.objects
  for select using (
    bucket_id = 'perfiles' and (select auth.uid())::text = (storage.foldername(name))[1]
  );
create policy "perfiles_propios_insert" on storage.objects
  for insert with check (
    bucket_id = 'perfiles' and (select auth.uid())::text = (storage.foldername(name))[1]
  );
create policy "perfiles_propios_update" on storage.objects
  for update using (
    bucket_id = 'perfiles' and (select auth.uid())::text = (storage.foldername(name))[1]
  );
create policy "perfiles_propios_delete" on storage.objects
  for delete using (
    bucket_id = 'perfiles' and (select auth.uid())::text = (storage.foldername(name))[1]
  );
