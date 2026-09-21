-- CONSENTIMIENTOS (2026-09-21) — pégalo completo en Supabase → SQL Editor → New query → Run.
-- Pedido del equipo jurídico del usuario: la primera vez que la persona entra a la app tras
-- comprar, debe aceptar de forma expresa (Ley 1581 de 2012 y Decreto 1377 de 2013, Colombia):
--   1. Términos y Condiciones   2. Política de Tratamiento de Datos   3. Renovación automática
-- y, opcionalmente, 4. recibir novedades (marketing). La prueba del consentimiento es lo que vale
-- ante la SIC, así que la tabla es un REGISTRO (append-only: cada aceptación es una fila nueva con
-- fecha, versión del texto y navegador) — nunca se edita ni se borra desde la app.

create table if not exists public.consentimientos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  version      text not null,                 -- versión de los textos aceptados (ej. 'v1-2026-09-21')
  terminos     boolean not null,
  datos        boolean not null,
  renovacion   boolean not null,
  marketing    boolean not null default false,
  user_agent   text,
  created_at   timestamptz not null default now()
);
create index if not exists consentimientos_user_id_idx on public.consentimientos(user_id, created_at desc);

alter table public.consentimientos enable row level security;

-- La persona solo puede LEER e INSERTAR sus propias filas. Sin update ni delete: el registro es
-- evidencia y no se reescribe (si cambia de opinión, se inserta una fila nueva).
create policy "consentimientos_select_propios" on public.consentimientos
  for select using ((select auth.uid()) = user_id);
create policy "consentimientos_insert_propios" on public.consentimientos
  for insert with check ((select auth.uid()) = user_id);

revoke update, delete on public.consentimientos from authenticated;
