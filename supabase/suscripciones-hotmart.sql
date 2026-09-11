-- SUSCRIPCIONES DE HOTMART — el estado real de cada persona: en prueba, activa, atrasada,
-- cancelada, vencida, reembolsada o con contracargo. Pégalo completo en
-- Supabase → SQL Editor → New query → Run (después de admin.sql, que ya debe estar corrido).
--
-- POR QUÉ ES UNA TABLA APARTE DE `profiles`: el aviso de Hotmart puede llegar ANTES de que esa
-- persona tenga cuenta en la app — hoy el recorrido es "paga primero, entra después" (el botón
-- de planes manda directo al cobro de Hotmart, no pide cuenta antes). `profiles.id` es una llave
-- fija hacia `auth.users`, y forzar una fila con id vacío rompería esa garantía. Esta tabla se
-- identifica por CORREO —lo único que Hotmart siempre manda— y se cruza con la cuenta real recién
-- cuando la persona inicia sesión (la revisión vive en `app/(app)/layout.tsx`).

create table if not exists public.suscripciones (
  email                    text primary key,
  status                   text not null check (status in
                             ('trialing','active','past_due','cancelled','expired','refunded','chargeback')),
  plan                     text not null default 'pro' check (plan in ('pro','free')),
  hotmart_subscriber_code  text,
  trial_ends_at            timestamptz,   -- cuándo termina la prueba gratis
  first_paid_at            timestamptz,   -- PRIMER cobro real (>0) — se fija una sola vez, nunca se pisa
  access_until             timestamptz,   -- cancelada: sigue con acceso hasta esta fecha
  grace_ends_at            timestamptz,   -- pago atrasado: días de gracia antes de cortar
  updated_at               timestamptz not null default now()
);
create index if not exists suscripciones_status_idx on public.suscripciones(status);
create index if not exists suscripciones_subscriber_idx on public.suscripciones(hotmart_subscriber_code);

alter table public.suscripciones enable row level security;

-- Cada quien lee SOLO su propia fila, por el correo de su sesión (no hay `user_id` que cruzar:
-- la fila puede haber nacido antes de que la cuenta existiera).
create policy "suscripciones_select_propia" on public.suscripciones
  for select using ((select auth.jwt() ->> 'email') = email);

-- El dueño ve todas (panel de administración, más adelante).
create policy "suscripciones_select_admin" on public.suscripciones
  for select using (public.es_admin());

-- Sin políticas de insert/update/delete para clientes: solo las escribe la función de abajo,
-- que corre con permisos elevados y el endpoint del webhook la llama con la service_role key.

-- ── AVISOS YA PROCESADOS — Hotmart REENVÍA el mismo aviso si el endpoint tarda o falla; esto
-- evita aplicarlo dos veces (doble cuenta, doble correo). ────────────────────────────────────
create table if not exists public.hotmart_eventos_procesados (
  event_id      text primary key,
  event_type    text not null,
  payload_hash  text,          -- huella del aviso completo, solo para auditoría — nunca el aviso en sí
  processed_at  timestamptz not null default now()
);

-- ── REGISTRO DE CADA INTENTO (éxito y fallo) — para detectar un ataque (muchos 'unauthorized'
-- seguidos) o que Hotmart dejó de avisar (nada nuevo en horas). ─────────────────────────────
create table if not exists public.hotmart_webhook_log (
  id            bigint generated always as identity primary key,
  event_id      text,
  event_type    text,
  result        text not null check (result in ('applied','duplicate','illegal','unauthorized','error')),
  received_at   timestamptz not null default now()
);
create index if not exists hotmart_webhook_log_received_idx on public.hotmart_webhook_log(received_at desc);

alter table public.hotmart_eventos_procesados enable row level security;
alter table public.hotmart_webhook_log enable row level security;
create policy "hotmart_eventos_admin" on public.hotmart_eventos_procesados for select using (public.es_admin());
create policy "hotmart_log_admin" on public.hotmart_webhook_log for select using (public.es_admin());

-- ── LA FUNCIÓN QUE APLICA CADA AVISO — atómica: o se guarda todo, o no se guarda nada. ───────
-- La llama el endpoint del webhook con la service_role key (que ya se salta RLS); declararla
-- `security definer` + revocarle el acceso a los roles normales de abajo es una segunda cerradura:
-- ni siquiera un usuario con sesión puede invocarla directo desde el navegador.
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
  -- (a) IDEMPOTENCIA: si este aviso exacto ya se procesó, salir sin tocar nada más.
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

  -- (b) NUNCA resucitar un reembolso/contracargo con un aviso viejo reentregado por Hotmart.
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
    -- Se fija SOLO la primera vez que llega un cobro real — nunca se pisa con eventos posteriores.
    first_paid_at = coalesce(public.suscripciones.first_paid_at, excluded.first_paid_at),
    access_until = coalesce(excluded.access_until, public.suscripciones.access_until),
    grace_ends_at = coalesce(excluded.grace_ends_at, public.suscripciones.grace_ends_at),
    updated_at = now();

  return jsonb_build_object('status', 'applied', 'new_status', p_new_status);
end;
$$;

revoke execute on function public.aplicar_evento_hotmart from anon, authenticated;
