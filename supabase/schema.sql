-- ESQUEMA REAL DE COPARENTIA (Sesión 6) — reemplaza el mock de localStorage (lib/datos.ts).
-- Pégalo completo en Supabase → SQL Editor → New query → Run.
-- Sigue 25-BASE-DE-DATOS.md: uuid, numeric para dinero, timestamptz, RLS con
-- (select auth.uid()) = user_id, índice en toda foreign key.
--
-- ⚠️ ESTE ARCHIVO ES LA VERDAD COMPLETA DEL ESQUEMA BASE. Las columnas que se agregaron después
-- por parches sueltos (`acuerdo-titulo.sql`, `eventos-adjuntos.sql`) ya están incorporadas aquí,
-- para que una instalación desde cero quede idéntica a la que está en producción. Estuvieron
-- desincronizadas hasta la auditoría del 2026-09-11: recrear la base con este archivo habría
-- dejado la app rota. Si vuelves a agregar una columna por parche, agrégala TAMBIÉN aquí.
-- (Los parches se siguen conservando para bases que ya existen; `if not exists` los hace
--  inofensivos si se corren dos veces.)
--
-- ORDEN DE INSTALACIÓN DESDE CERO: schema.sql → storage.sql → admin.sql → ai.sql →
-- freno-gasto-ia.sql → fix-limites-storage.sql → fix-privilegios-profiles.sql

-- ── TÍTULO (la cuota alimentaria) — uno por usuario ──────────────────────────
create table if not exists public.titulos (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null unique references auth.users(id) on delete cascade,
  monto_mensual    numeric(12,2) not null check (monto_mensual > 0),
  dia_pago         int not null check (dia_pago between 1 and 31),
  indice_reajuste  text not null default 'IPC (Índice de Precios al Consumidor)',
  fecha_inicio     date not null default current_date,
  -- Acta de conciliación o sentencia que fija la cuota ("Consultar acuerdo", pantalla Expediente).
  -- El archivo vive en Storage, en {user_id}/acuerdo/... ; aquí solo su referencia.
  acuerdo_path     text,
  acuerdo_nombre   text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists titulos_user_id_idx on public.titulos(user_id);

-- ── PAGOS y gastos extraordinarios ───────────────────────────────────────────
create table if not exists public.pagos (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  fecha                date not null,
  monto                numeric(12,2) not null check (monto > 0),
  concepto             text not null check (length(concepto) between 1 and 200),
  tipo                 text not null check (tipo in ('cuota', 'gasto_extra')),
  comprobante_nombre   text not null,
  comprobante_path     text, -- ruta en Supabase Storage cuando se conecte la subida real
  created_at           timestamptz not null default now()
);
create index if not exists pagos_user_id_idx on public.pagos(user_id);
create index if not exists pagos_user_fecha_idx on public.pagos(user_id, fecha desc);

-- ── AUTORIZACIONES y controversias ───────────────────────────────────────────
create table if not exists public.autorizaciones (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  fecha       date not null,
  concepto    text not null check (length(concepto) between 1 and 200),
  monto       numeric(12,2) not null check (monto > 0),
  estado      text not null default 'pendiente' check (estado in ('aprobada', 'pendiente', 'objetada')),
  nota        text,
  created_at  timestamptz not null default now()
);
create index if not exists autorizaciones_user_id_idx on public.autorizaciones(user_id);

-- ── EVENTOS del calendario (visitas, citas, vacaciones, salida del país) ─────
create table if not exists public.eventos (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  fecha                date not null,
  tipo                 text not null check (tipo in ('visita', 'medica', 'vacaciones', 'extracurricular', 'salida_pais')),
  titulo               text not null check (length(titulo) between 1 and 200),
  nota                 text,
  documento_adjunto        text, -- nombre real del archivo adjunto (fórmula médica, permiso, etc.)
  documento_adjunto_path   text, -- ruta real en Storage, bucket "comprobantes"
  created_at               timestamptz not null default now()
);
create index if not exists eventos_user_id_idx on public.eventos(user_id);
create index if not exists eventos_user_fecha_idx on public.eventos(user_id, fecha);

-- ── RLS: cada usuario ve y toca SOLO sus propios datos ───────────────────────
alter table public.titulos enable row level security;
alter table public.pagos enable row level security;
alter table public.autorizaciones enable row level security;
alter table public.eventos enable row level security;

create policy "titulos_propios" on public.titulos
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "pagos_propios" on public.pagos
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "autorizaciones_propias" on public.autorizaciones
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "eventos_propios" on public.eventos
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ── updated_at automático en titulos ──────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger titulos_set_updated_at
  before update on public.titulos
  for each row execute function public.set_updated_at();
