-- Hace que `aplicar_evento_hotmart` devuelva también el ESTADO ANTERIOR de la suscripción, no
-- solo el nuevo. Pégalo completo en Supabase → SQL Editor → New query → Run.
--
-- PARA QUÉ SIRVE: al conectar los correos de Resend (bienvenida / cancelación / pago fallido), el
-- endpoint necesita saber si un aviso "aprobado" es la PRIMERA vez que esta persona tiene acceso
-- (→ manda bienvenida) o si ya lo tenía desde antes (→ no manda nada, sería el segundo aviso de la
-- MISMA compra — Hotmart suele mandar "aprobada" y "completa" para la misma transacción). Sin este
-- dato, el endpoint tendría que adivinar y arriesgarse a mandar bienvenida dos veces.

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
  begin
    insert into public.hotmart_eventos_procesados (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status', 'duplicate');
  end;

  select email, status into v_email_existente, v_current
  from public.suscripciones
  where (p_email is not null and email = p_email)
     or (p_subscriber_code is not null and hotmart_subscriber_code = p_subscriber_code)
  limit 1;

  if v_current in ('refunded','chargeback') and p_new_status in ('active','trialing') then
    return jsonb_build_object('status', 'illegal_transition', 'from', v_current);
  end if;

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

  -- ÚNICO cambio real de este archivo: 'previous_status' en la respuesta (antes se perdía).
  return jsonb_build_object(
    'status', 'applied',
    'new_status', p_new_status,
    'previous_status', v_current,
    'email', coalesce(p_email, v_email_existente)
  );
end;
$$;

revoke all on function public.aplicar_evento_hotmart(text, text, text, text, text, text, timestamptz, timestamptz, timestamptz)
  from public;
revoke all on function public.aplicar_evento_hotmart(text, text, text, text, text, text, timestamptz, timestamptz, timestamptz)
  from anon, authenticated;
