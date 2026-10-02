-- Corrige dos fallas del aviso de Hotmart. Pégalo completo en Supabase → SQL Editor → New query →
-- Run. Se puede correr más de una vez sin problema ("create or replace").
--
-- INCLUYE el contenido de fix-devuelve-estado-anterior.sql (si ya lo habías corrido, no pasa nada).
--
-- QUÉ ARREGLA (caso real, 2026-10-02): a una clienta que ya había pagado le llegó otra vez el correo
-- "Tu acceso a Coparentia ya está listo" y su cuenta volvió a "en prueba". Hotmart manda el aviso
-- PURCHASE_COMPLETE ("compra completa") unos 15 días DESPUÉS de cada compra, cuando termina su
-- garantía; para la compra gratis de la prueba trae monto cero, y el sistema lo leyó como "empieza
-- una prueba nueva". Pasaría con cada cliente que empieza por la prueba gratis.
--
-- LAS REGLAS NUEVAS:
--  1. PURCHASE_COMPLETE es solo una CONFIRMACIÓN: si ya conocemos a la persona, no cambia nada
--     (no baja a quien ya pagó, no reactiva a quien canceló, no manda otra bienvenida). Solo
--     abre acceso si nunca habíamos visto a esa persona (red de seguridad por si se perdió el
--     aviso de "aprobada").
--  2. Quien ya está "activa" (pagó) nunca vuelve a "en prueba", venga el aviso que venga.
--  3. Devuelve también el estado anterior y el correo (lo que ya hacía fix-devuelve-estado-anterior).

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
  -- Idempotencia: el mismo aviso exacto nunca se aplica dos veces.
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

  -- Un reembolso o contracargo nunca se "resucita" con un aviso viejo.
  if v_current in ('refunded','chargeback') and p_new_status in ('active','trialing') then
    return jsonb_build_object('status', 'illegal_transition', 'from', v_current);
  end if;

  -- REGLA 1: "compra completa" solo confirma. Si ya conocemos a la persona, no se toca nada.
  if p_event_type = 'PURCHASE_COMPLETE' and v_current is not null then
    return jsonb_build_object('status', 'ignored', 'previous_status', v_current);
  end if;

  -- REGLA 2: quien ya pagó no vuelve a "en prueba".
  if v_current = 'active' and p_new_status = 'trialing' then
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
