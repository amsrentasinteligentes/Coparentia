-- LISTA DE ESPERA POR PAÍS (2026-10-21, decisión #8: por ahora solo Colombia). Guarda el correo y el país de quien
-- pide que Coparentia llegue a su país, desde la pregunta "¿Funciona fuera de Colombia?" de la página principal.
-- Sirve para medir interés real por país antes de construir nada para otro mercado.
--
-- SEGURIDAD: RLS activo y SIN ninguna política → desde el navegador nadie puede leer ni escribir esta tabla
-- (ni anónimo ni con sesión). Solo el endpoint del servidor /api/lista-espera, con la service_role key, inserta;
-- y solo el dueño la lee desde el panel de Supabase (Table Editor).
--
-- Cómo correrlo: Supabase → SQL Editor → New query → pegar todo → Run. Debe responder "Success".
-- Cómo leerlo: Table Editor → lista_espera_paises, o en el SQL Editor:
--   select pais, count(*) from public.lista_espera_paises group by pais order by count(*) desc;

create table if not exists public.lista_espera_paises (
  id          uuid primary key default gen_random_uuid(),
  email       text not null check (char_length(email) between 5 and 254),
  pais        text not null check (pais in ('México', 'Chile', 'Argentina', 'Ecuador', 'Perú', 'Otro')),
  pais_otro   text check (pais_otro is null or char_length(pais_otro) between 2 and 60),
  autoriza    boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists lista_espera_paises_pais_idx
  on public.lista_espera_paises (pais, created_at desc);

create index if not exists lista_espera_paises_email_idx
  on public.lista_espera_paises (lower(email), created_at desc);

alter table public.lista_espera_paises enable row level security;

-- Sin políticas a propósito. Y por si algún privilegio por defecto del proyecto los concediera:
revoke all on public.lista_espera_paises from anon, authenticated;
