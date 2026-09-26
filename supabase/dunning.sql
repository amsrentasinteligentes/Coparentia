-- CADENCIA DE RECORDATORIOS DE PAGO FALLIDO (2026-09-25, hallazgo de auditoría externa) — pégalo
-- completo en Supabase → SQL Editor → New query → Run.
--
-- Antes: un pago fallido mandaba UN correo único (al entrar a `past_due`) y nada más durante los
-- 5 días de gracia — sin recordatorio a mitad de camino ni aviso final antes de perder el acceso.
-- Esto agrega el rastro de qué recordatorio ya se mandó; el cron real vive en
-- app/api/cron/dunning/route.ts (lib/email.ts tiene las 2 plantillas nuevas).
--
-- Etapas (sobre los mismos 5 días de gracia ya existentes, sin cambiarlos):
--   0 = solo el correo inmediato que ya mandaba el webhook al entrar a past_due
--   1 = recordatorio a mitad de gracia (quedan ~2-3 días)
--   2 = último aviso (queda ~1 día antes de perder el acceso)

alter table public.suscripciones
  add column if not exists aviso_dunning_paso int not null default 0;

-- Igual que con el aviso de pre-cobro: si empieza un período de gracia NUEVO (otro cobro falla
-- más adelante), la cadencia se reinicia — se detecta porque `grace_ends_at` cambia a una fecha
-- distinta a la que ya había guardada.
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
declare v_current text;
begin
  begin
    insert into public.hotmart_eventos_procesados (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status', 'duplicate');
  end;

  select status into v_current from public.suscripciones
  where email = p_email
     or (p_subscriber_code is not null and hotmart_subscriber_code = p_subscriber_code)
  limit 1;

  if v_current in ('refunded','chargeback') and p_new_status in ('active','trialing') then
    return jsonb_build_object('status', 'illegal_transition', 'from', v_current);
  end if;

  insert into public.suscripciones (email, status, plan, hotmart_subscriber_code,
                                     trial_ends_at, first_paid_at, access_until, grace_ends_at)
  values (p_email, p_new_status,
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
    aviso_pre_cobro_enviado = case
      when excluded.trial_ends_at is not null
       and excluded.trial_ends_at is distinct from public.suscripciones.trial_ends_at
        then false
      else public.suscripciones.aviso_pre_cobro_enviado
    end,
    aviso_dunning_paso = case
      when excluded.grace_ends_at is not null
       and excluded.grace_ends_at is distinct from public.suscripciones.grace_ends_at
        then 0
      else public.suscripciones.aviso_dunning_paso
    end,
    updated_at = now();

  return jsonb_build_object('status', 'applied', 'new_status', p_new_status);
end;
$$;

revoke execute on function public.aplicar_evento_hotmart from anon, authenticated;

create index if not exists suscripciones_pendientes_dunning_idx
  on public.suscripciones(grace_ends_at)
  where status = 'past_due';
