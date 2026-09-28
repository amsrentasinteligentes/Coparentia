-- HISTORIAL DE NOTIFICACIONES DENTRO DE LA APP (2026-09-28, pedido del usuario) — pégalo completo
-- en Supabase → SQL Editor → New query → Run.
--
-- El recordatorio push que ya se manda al teléfono es "de un solo uso": si la persona lo cierra
-- sin tocarlo, desaparece de la bandeja del sistema y no queda ningún rastro dentro de la app.
-- Esta tabla guarda una copia de cada aviso enviado, para mostrarla en Inicio hasta que la
-- persona la vea — así nadie se pierde un recordatorio solo por no haber estado mirando el
-- teléfono en ese momento.

create table if not exists public.notificaciones_app (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  titulo       text not null,
  cuerpo       text not null,
  url          text not null default '/inicio',
  leida        boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists notificaciones_app_user_id_idx on public.notificaciones_app(user_id, created_at desc);

alter table public.notificaciones_app enable row level security;

-- Cada quien ve y marca como leídas solo las suyas; nadie inserta desde el cliente (solo el
-- servidor, con la service_role key, cuando manda el aviso real).
create policy "notificaciones_app_select_propias" on public.notificaciones_app
  for select using ((select auth.uid()) = user_id);
create policy "notificaciones_app_marcar_leida" on public.notificaciones_app
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- Solo puede cambiar `leida` — ni el título, ni el cuerpo, ni de quién es el aviso.
revoke insert, delete, update on public.notificaciones_app from authenticated;
grant update (leida) on public.notificaciones_app to authenticated;
