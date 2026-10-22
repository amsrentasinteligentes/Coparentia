-- ALERTA DE CAPACIDAD (2026-10-22) — pégalo completo en Supabase → SQL Editor → New query → Run. Debe responder "Success".
--
-- PARA QUÉ: la tarea automática `app/api/cron/alerta-capacidad` mide cuánto del plan gratuito de Supabase se está usando
-- y te manda un correo cuando conviene pasar a Pro (base de datos o fotos de comprobantes cerca del tope, o ya hay
-- clientes pagando y no hay copias de seguridad). Esta función SOLO LEE tamaños y conteos: no modifica nada.
--
-- SEGURIDAD: es `security definer` (lee tablas del sistema que un usuario normal no puede ver), por eso:
--   · fija `search_path = ''` y usa nombres completos de tablas;
--   · devuelve solo números agregados (nunca filas, correos ni nombres);
--   · se REVOCA a public, anon y authenticated: solo la puede llamar el servidor con la service_role key.

create or replace function public.uso_del_proyecto()
returns jsonb
language sql
security definer
set search_path = ''
stable
as $$
  select jsonb_build_object(
    'db_bytes', pg_database_size(current_database()),
    'storage_bytes', coalesce((select sum((metadata->>'size')::bigint) from storage.objects), 0),
    'usuarios', (select count(*) from auth.users),
    -- Clientes que ya pagaron al menos una vez y siguen con acceso de pago. Se excluyen las filas de prueba de Hotmart
    -- (correos que empiezan por "test", como testeComprador… y test@hotmart.com).
    'suscripciones_con_cobro', (
      select count(*) from public.suscripciones
      where status in ('active', 'past_due')
        and first_paid_at is not null
        and email !~* '^test'
    )
  );
$$;

revoke all on function public.uso_del_proyecto() from public;
revoke all on function public.uso_del_proyecto() from anon;
revoke all on function public.uso_del_proyecto() from authenticated;
grant execute on function public.uso_del_proyecto() to service_role;

-- Memoria de cuándo se avisó cada cosa, para no escribirte todos los días por lo mismo (re-aviso cada 7 días).
create table if not exists public.alertas_capacidad (
  clave        text primary key,
  ultimo_envio timestamptz not null default now()
);

alter table public.alertas_capacidad enable row level security;
-- Sin políticas a propósito: solo el servidor (service_role) la lee y la escribe.
revoke all on public.alertas_capacidad from anon, authenticated;
