-- RECONCILIACIÓN HOTMART ↔ BASE DE DATOS (2026-09-25, hallazgo de auditoría externa) — pégalo
-- completo en Supabase → SQL Editor → New query → Run.
--
-- El webhook es la única fuente de verdad de `suscripciones`, y si Hotmart deja de mandar un
-- aviso alguna vez (una caída puntual, un cambio de configuración, lo que sea) el estado interno
-- se queda desincronizado PARA SIEMPRE, sin que nadie se entere. Este job (semanal, ver
-- app/api/cron/reconciliacion-hotmart/route.ts) compara lo que Hotmart dice de verdad contra
-- `suscripciones` y deja un registro de cada diferencia encontrada — NO corrige nada solo: repara
-- el acceso de alguien automáticamente, sin que el dueño lo vea primero, es más riesgoso que
-- dejarlo un poco desactualizado unos días.

create table if not exists public.hotmart_drift_log (
  id                bigint generated always as identity primary key,
  ejecutado_en      timestamptz not null default now(),
  email             text not null,
  estado_hotmart    text not null,
  deberia_tener_acceso boolean not null,
  estado_interno    text,
  tiene_acceso_interno  boolean not null,
  resuelto          boolean not null default false
);
create index if not exists hotmart_drift_log_ejecutado_idx on public.hotmart_drift_log(ejecutado_en desc);
create index if not exists hotmart_drift_log_sin_resolver_idx on public.hotmart_drift_log(resuelto) where resuelto = false;

alter table public.hotmart_drift_log enable row level security;
create policy "hotmart_drift_log_admin" on public.hotmart_drift_log for select using (public.es_admin());

-- El dueño puede marcar una diferencia como revisada desde el panel (no borra el historial).
revoke insert, delete on public.hotmart_drift_log from authenticated;
grant update (resuelto) on public.hotmart_drift_log to authenticated;
create policy "hotmart_drift_log_marcar_resuelto" on public.hotmart_drift_log for update using (public.es_admin()) with check (public.es_admin());
