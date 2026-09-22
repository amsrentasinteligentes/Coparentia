-- CONSTANCIAS POR HIJO (2026-09-22) — pégalo completo en Supabase → SQL Editor → New query → Run
-- (después de constancias.sql). Pedido del usuario: en vez de UNA constancia general, se envía UN
-- CORREO POR CADA HIJO con sus gastos. Cada envío se registra por separado, así el expediente
-- muestra a quién se informó, de qué hijo y cuándo.

alter table public.constancias
  add column if not exists hijo_id uuid references public.hijos(id) on delete set null;
create index if not exists constancias_hijo_id_idx on public.constancias(hijo_id);

-- El tope de "una constancia mensual por período" pasa a ser por período Y por hijo. `coalesce`
-- porque un índice único trata cada NULL como distinto, y la constancia general (sin hijo) también
-- debe ser única.
drop index if exists constancias_mensual_unica;
create unique index if not exists constancias_mensual_unica
  on public.constancias (user_id, periodo, (coalesce(hijo_id::text, 'general')))
  where origen = 'mensual';
