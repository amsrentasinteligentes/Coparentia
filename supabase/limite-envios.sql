-- TOPE DIARIO DE ENVÍOS POR PERSONA (2026-10-29, auditoría #2) — pégalo completo en Supabase →
-- SQL Editor → New query → Run. Es solo aditivo: crea una tabla y dos funciones nuevas; no cambia nada de
-- lo que ya existe, así que se puede correr antes de publicar el código sin que nada se note.
--
-- QUÉ ARREGLA: los botones "Enviar constancia ahora" (Expediente) y "Enviar consulta" (Asistencia) no
-- tenían ningún tope: una cuenta gratis podía mandar cientos de correos desde coparentia.co. Ahora cada
-- persona tiene, POR DÍA DE COLOMBIA: 1 constancia y 1 consulta (decisión del dueño, 2026-10-29).
--
-- CÓMO FUNCIONA: cada envío se anota en `envios_limitados`. El navegador NO puede escribir ni leer esa
-- tabla (RLS activo, sin ninguna política, permisos quitados): lo único que la toca son las dos funciones
-- de abajo, que corren con permisos del dueño (SECURITY DEFINER) y siempre actúan sobre `auth.uid()` — nadie
-- puede anotar ni devolver cupo a nombre de otro. Los topes están escritos DENTRO de la función; el cliente
-- no los pasa, así que no se pueden subir desde afuera.

-- ── 1. Registro de envíos (solo lo tocan las funciones de abajo) ───────────────────────────────
create table if not exists public.envios_limitados (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  tipo        text not null check (tipo in ('constancia', 'consulta')),
  created_at  timestamptz not null default now()
);
create index if not exists envios_limitados_user_tipo_idx on public.envios_limitados(user_id, tipo, created_at desc);

alter table public.envios_limitados enable row level security;
revoke all on table public.envios_limitados from anon, authenticated;

-- ── 2. Reservar un envío: cuenta el día de Colombia, anota y responde sí/no, todo en un solo paso ──
-- El candado `pg_advisory_xact_lock` hace que dos clics simultáneos de la misma persona se pongan en fila
-- (sin él, los dos podrían contar "0 usados" a la vez y colarse).
create or replace function public.reservar_envio(p_tipo text)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_user    uuid := (select auth.uid());
  v_tope    int;
  v_inicio  timestamptz;
  v_usados  int;
begin
  if v_user is null then
    return false;
  end if;

  v_tope := case p_tipo when 'constancia' then 1 when 'consulta' then 1 else null end;
  if v_tope is null then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user::text || ':' || p_tipo, 0));

  -- Medianoche de Colombia (America/Bogota, sin horario de verano) de hoy, como instante absoluto.
  v_inicio := date_trunc('day', now() at time zone 'America/Bogota') at time zone 'America/Bogota';

  select count(*) into v_usados
    from public.envios_limitados
   where user_id = v_user and tipo = p_tipo and created_at >= v_inicio;

  if v_usados >= v_tope then
    return false;
  end if;

  insert into public.envios_limitados (user_id, tipo) values (v_user, p_tipo);
  return true;
end;
$$;
revoke all on function public.reservar_envio(text) from public;
grant execute on function public.reservar_envio(text) to authenticated;

-- ── 3. Devolver el cupo cuando al final NO salió ningún correo ─────────────────────────────────
-- Solo quita la reserva MÁS RECIENTE de hoy de esa persona y ese tipo. La app la llama únicamente cuando
-- no había nada que enviar o el envío falló (con un tope de 1 al día, un correo mal escrito no debe dejar
-- a nadie sin poder corregirlo y reenviar).
create or replace function public.liberar_envio(p_tipo text)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_user    uuid := (select auth.uid());
  v_inicio  timestamptz;
begin
  if v_user is null then
    return;
  end if;

  v_inicio := date_trunc('day', now() at time zone 'America/Bogota') at time zone 'America/Bogota';

  delete from public.envios_limitados
   where id = (
     select id from public.envios_limitados
      where user_id = v_user and tipo = p_tipo and created_at >= v_inicio
      order by created_at desc
      limit 1
   );
end;
$$;
revoke all on function public.liberar_envio(text) from public;
grant execute on function public.liberar_envio(text) to authenticated;
