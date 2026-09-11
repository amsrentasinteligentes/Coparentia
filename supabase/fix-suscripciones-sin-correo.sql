-- CORRIGE: los avisos a nivel de SUSCRIPCIÓN (cancelación, atraso, cambio de plan) a veces NO
-- traen el correo del comprador, solo el código de suscriptor — comprobado con un test real de
-- Hotmart (2026-09-11): "Cancelación de Suscripción" llegó sin correo y, con la versión anterior
-- de esta función, se ignoraba en silencio (Hotmart veía 200 igual, pero nada quedaba guardado).
-- Pégalo completo en Supabase → SQL Editor → New query → Run (reemplaza la función de
-- suscripciones-hotmart.sql; seguro correrlo de nuevo si hace falta).

alter table public.hotmart_webhook_log drop constraint if exists hotmart_webhook_log_result_check;
alter table public.hotmart_webhook_log add constraint hotmart_webhook_log_result_check
  check (result in ('applied','duplicate','illegal','unauthorized','error','no_match'));

create or replace function public.aplicar_evento_hotmart(
  p_event_id text, p_event_type text, p_payload_hash text,
  p_email text, p_subscriber_code text, p_new_status text,
  p_trial_ends_at timestamptz default null,
  p_access_until timestamptz default null,
  p_grace_ends_at timestamptz default null
) returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare v_current text; v_email_existente text;
begin
  -- (a) IDEMPOTENCIA: si este aviso exacto ya se procesó, salir sin tocar nada más.
  begin
    insert into public.hotmart_eventos_procesados (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status', 'duplicate');
  end;

  -- Resolver la fila existente: por CORREO si el aviso lo trae, y si no, por el CÓDIGO DE
  -- SUSCRIPTOR (los avisos a nivel de suscripción no siempre traen el correo del comprador).
  select email, status into v_email_existente, v_current
  from public.suscripciones
  where (p_email is not null and email = p_email)
     or (p_subscriber_code is not null and hotmart_subscriber_code = p_subscriber_code)
  limit 1;

  -- (b) NUNCA resucitar un reembolso/contracargo con un aviso viejo reentregado por Hotmart.
  if v_current in ('refunded','chargeback') and p_new_status in ('active','trialing') then
    return jsonb_build_object('status', 'illegal_transition', 'from', v_current);
  end if;

  -- (c) Sin correo en el aviso Y sin ningún suscriptor conocido con ese código todavía: no hay
  -- forma de saber a quién aplica (no se puede crear una fila sin correo, es la llave de la
  -- tabla). Se reconoce sin guardar nada — nunca se inventa un correo.
  if p_email is null and v_email_existente is null then
    return jsonb_build_object('status', 'no_match');
  end if;

  insert into public.suscripciones (email, status, plan, hotmart_subscriber_code,
                                     trial_ends_at, first_paid_at, access_until, grace_ends_at)
  values (coalesce(p_email, v_email_existente), p_new_status,
          case when p_new_status in ('trialing','active','past_due','cancelled') then 'pro' else 'free' end,
          p_subscriber_code, p_trial_ends_at,
          case when p_new_status = 'active' then now() else null end,
          p_access_until, p_grace_ends_at)
  on conflict (email) do update set
    status = excluded.status,
    plan = excluded.plan,
    hotmart_subscriber_code = coalesce(excluded.hotmart_subscriber_code, public.suscripciones.hotmart_subscriber_code),
    trial_ends_at = coalesce(excluded.trial_ends_at, public.suscripciones.trial_ends_at),
    first_paid_at = coalesce(public.suscripciones.first_paid_at, excluded.first_paid_at),
    access_until = coalesce(excluded.access_until, public.suscripciones.access_until),
    grace_ends_at = coalesce(excluded.grace_ends_at, public.suscripciones.grace_ends_at),
    updated_at = now();

  return jsonb_build_object('status', 'applied', 'new_status', p_new_status);
end;
$$;

revoke execute on function public.aplicar_evento_hotmart from anon, authenticated;
