-- CONTACTOS INTERESADOS (2026-10-09, auditoría externa, hallazgo 2) — el correo que la persona
-- escribe en el paso de precio del paywall, ANTES de ir a pagar a Hotmart. Sirve para dos cosas:
-- (1) poder escribirle a quien llegó hasta ahí y no pagó, y (2) cruzar el correo de la compra con
-- el correo con el que luego entra a la app.
--
-- SEGURIDAD: RLS activo y SIN ninguna política → desde el navegador nadie puede leer ni escribir
-- esta tabla (ni anónimo ni con sesión). Solo el endpoint del servidor /api/contacto-interesado,
-- con la service_role key, inserta; y solo el dueño la lee desde el panel de Supabase.
--
-- Cómo correrlo: Supabase → SQL Editor → New query → pegar todo → Run. Debe responder "Success".

create table if not exists public.contactos_interesados (
  id           uuid primary key default gen_random_uuid(),
  email        text not null check (char_length(email) between 5 and 254),
  plan         text not null check (plan in ('anual', 'mensual')),
  autoriza     boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists contactos_interesados_email_idx
  on public.contactos_interesados (lower(email), created_at desc);

alter table public.contactos_interesados enable row level security;

-- Sin políticas a propósito. Y por si algún privilegio por defecto del proyecto los concediera:
revoke all on public.contactos_interesados from anon, authenticated;
