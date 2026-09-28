-- NOTIFICACIONES PUSH (2026-09-28, pedido del usuario tras la auditoría externa) — pégalo
-- completo en Supabase → SQL Editor → New query → Run.
--
-- El onboarding YA pregunta "¿pagas o recibes la cuota?" para adaptar su copy, pero esa respuesta
-- nunca se guardaba de verdad — vivía solo en sessionStorage y se perdía. Se guarda aquí, en
-- `titulos` (junto al monto y el día de pago, que es donde ya se configura la cuota de verdad,
-- con sesión real — no se intenta arrastrar la respuesta del onboarding a través del checkout de
-- Hotmart, que no es confiable).

alter table public.titulos
  add column if not exists rol_pago text check (rol_pago in ('paga', 'recibe'));

-- Evita mandar el mismo recordatorio varios días seguidos dentro de la ventana antes del día de
-- pago — guarda 'YYYY-MM' del último mes en que ya se avisó (app/api/cron/recordatorio-cuota).
alter table public.titulos
  add column if not exists recordatorio_cuota_enviado_mes text;

-- Suscripciones de notificaciones push del navegador (Web Push estándar) — una fila por
-- dispositivo/navegador en el que la persona activó los recordatorios (puede tener varias: el
-- celular Y la laptop). Guarda solo lo que el protocolo exige para poder mandarle un aviso; nunca
-- contenido de las notificaciones en sí.
create table if not exists public.push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  endpoint     text not null unique,
  p256dh       text not null,
  auth         text not null,
  created_at   timestamptz not null default now()
);
create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

create policy "push_subscriptions_propias" on public.push_subscriptions
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
