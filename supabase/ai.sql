-- REGISTRO DE LLAMADAS A IA — pégalo completo en Supabase → SQL Editor → New query → Run.
-- Sigue 31-EVALS-OBSERVABILIDAD-OPERACION.md: una fila por llamada real, costo calculado, sin
-- guardar el contenido crudo de la imagen/prompt (privacidad). Es lo que el panel de
-- administración (sección "Inteligencia artificial") lee para mostrar el gasto REAL, nunca
-- inventado.

create table if not exists public.ai_calls (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  feature      text not null,              -- qué función la disparó, ej. 'lector_recibo'
  model        text not null,              -- el modelo usado (para detectar regresiones al cambiarlo)
  tokens_in    integer,
  tokens_out   integer,
  cost_usd     numeric(10,6),              -- costo calculado de ESTA llamada
  latency_ms   integer,
  status       text not null check (status in ('ok', 'error', 'timeout')),
  error        text,
  created_at   timestamptz not null default now()
);
create index if not exists ai_calls_user_created_idx on public.ai_calls(user_id, created_at desc);
create index if not exists ai_calls_feature_idx on public.ai_calls(feature, created_at desc);

alter table public.ai_calls enable row level security;

-- Solo el dueño lee el registro completo (es el costo del NEGOCIO, no de un usuario navegando) —
-- mismo principio que event_log en supabase/admin.sql.
create policy "ai_calls_select_admin" on public.ai_calls
  for select using (public.es_admin());

-- Nadie inserta desde el navegador: NO hay política de insert. Las llamadas las anota solo el servidor
-- con la clave de servicio (lib/ocr-recibo.ts), que se salta la seguridad por filas.
--
-- ⚠️ Antes existía aquí la política `ai_calls_insert_propio` (insert con la sesión del propio usuario).
-- Era un hueco: cualquier usuario podía anotar una fila con el costo que quisiera y agotar el tope diario
-- de TODOS (auditoría 2026-10-29). Se eliminó con supabase/freno-gasto-ia-v2-cierre.sql.
