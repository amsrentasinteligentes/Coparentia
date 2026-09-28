-- DIRECTORIO DE PROFESIONALES (panel de administración) — pégalo completo en
-- Supabase → SQL Editor → New query → Run. Va DESPUÉS de admin.sql (usa public.es_admin()).
-- Sigue 25-BASE-DE-DATOS.md (uuid, timestamptz, RLS con (select auth.uid())/es_admin(),
-- índice en la columna de la política) y 09-SEGURIDAD.md (nunca confiar en el cliente: el
-- permiso de dueño se revisa en la política de RLS, no solo ocultando el botón en pantalla).
--
-- Reemplaza el banco fijo que antes vivía en lib/profesionales.ts: ahora cualquier persona con
-- el rol admin agrega/edita/quita un profesional desde /admin/profesionales, sin tocar código.

create table if not exists public.profesionales (
  id            uuid primary key default gen_random_uuid(),
  categoria     text not null check (categoria in ('abogado', 'psicologo', 'trabajador_social')),
  nombre        text not null,
  especialidad  text not null,
  ciudad        text,
  contacto_url  text not null, -- mailto:, tel:, o https://wa.me/…
  foto_url      text,          -- ruta pública (bucket "profesionales" o /public)
  activo        boolean not null default true, -- false = pausado, sin borrar el registro
  creado_por    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index if not exists profesionales_categoria_activo_idx on public.profesionales(categoria, activo);

alter table public.profesionales enable row level security;

-- Cualquiera (con sesión o sin ella) puede VER los profesionales activos — es contenido público
-- de la landing y de la pestaña Asistencia, no un dato privado de un usuario.
drop policy if exists "profesionales_activos_publico" on public.profesionales;
create policy "profesionales_activos_publico" on public.profesionales
  for select using (activo = true);

-- Solo el dueño (role = 'admin', ver admin.sql) puede agregar, editar o quitar.
drop policy if exists "profesionales_admin_insert" on public.profesionales;
create policy "profesionales_admin_insert" on public.profesionales
  for insert with check (public.es_admin());

drop policy if exists "profesionales_admin_update" on public.profesionales;
create policy "profesionales_admin_update" on public.profesionales
  for update using (public.es_admin());

drop policy if exists "profesionales_admin_delete" on public.profesionales;
create policy "profesionales_admin_delete" on public.profesionales
  for delete using (public.es_admin());

-- El admin también necesita LEER los pausados (activo = false) para poder reactivarlos desde el
-- panel — la política pública de arriba no los cubre a propósito.
drop policy if exists "profesionales_admin_select_todos" on public.profesionales;
create policy "profesionales_admin_select_todos" on public.profesionales
  for select using (public.es_admin());

-- ── Bucket público "profesionales" — fotos de perfil subidas desde el panel ─────────────────
-- Público porque son fotos que YA se muestran sin sesión en la página de ventas; no hay nada
-- que proteger aquí (a diferencia de "comprobantes"/"perfiles", que sí son privados).
insert into storage.buckets (id, name, public)
values ('profesionales', 'profesionales', true)
on conflict (id) do nothing;

drop policy if exists "profesionales_fotos_select" on storage.objects;
create policy "profesionales_fotos_select" on storage.objects
  for select using (bucket_id = 'profesionales');

drop policy if exists "profesionales_fotos_admin_insert" on storage.objects;
create policy "profesionales_fotos_admin_insert" on storage.objects
  for insert with check (bucket_id = 'profesionales' and public.es_admin());

drop policy if exists "profesionales_fotos_admin_delete" on storage.objects;
create policy "profesionales_fotos_admin_delete" on storage.objects
  for delete using (bucket_id = 'profesionales' and public.es_admin());

-- ── Primer profesional real, migrado del banco fijo anterior (Dra. Ivonne Reyes) ────────────
-- `on conflict` no aplica (no hay columna única de negocio) — este insert es idempotente por el
-- `where not exists`, así que correr el archivo dos veces no la duplica.
insert into public.profesionales (categoria, nombre, especialidad, ciudad, contacto_url, foto_url)
select 'abogado', 'Ivonne Reyes', 'Abogada especialista en relaciones jurídico negociables', 'Bogotá D.C.',
       'https://wa.me/573012283506', '/anuncios/ivonne-reyes.png'
where not exists (select 1 from public.profesionales where nombre = 'Ivonne Reyes');
