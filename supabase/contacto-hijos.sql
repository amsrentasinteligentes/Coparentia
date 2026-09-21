-- CONTACTO CON LOS HIJOS (2026-09-21) — pégalo completo en Supabase → SQL Editor → New query → Run.
-- Pedido del usuario (evaluado frente a OurFamilyWizard): registrar las llamadas y videollamadas
-- que el padre/madre hace a sus hijos como PRUEBA de contacto real — unilateral (no depende de la
-- otra parte), con fecha del Sello de Confianza y SIN posibilidad de editar ni borrar (lo que le
-- da valor probatorio). Se guardan como dos tipos nuevos de evento del calendario (llamada,
-- videollamada) con sus columnas propias. NUNCA se graba audio ni video: solo el hecho.

-- ── 1. Columnas del registro de contacto ─────────────────────────────────────────────────────
alter table public.eventos
  add column if not exists hora          time,
  add column if not exists duracion_min  integer check (duracion_min is null or duracion_min between 0 and 600),
  add column if not exists medio         text check (medio is null or medio in ('llamada', 'whatsapp', 'videollamada', 'otro')),
  add column if not exists resultado     text check (resultado is null or resultado in ('contestada', 'no_contestada', 'no_posible'));

-- ── 2. Dos tipos nuevos de evento ────────────────────────────────────────────────────────────
do $$
declare c text;
begin
  select conname into c
    from pg_constraint
   where conrelid = 'public.eventos'::regclass
     and contype = 'c'
     and pg_get_constraintdef(oid) like '%tipo = ANY%';
  if c is not null then
    execute format('alter table public.eventos drop constraint %I', c);
  end if;
end $$;
alter table public.eventos
  add constraint eventos_tipo_check
  check (tipo in ('visita', 'medica', 'vacaciones', 'extracurricular', 'salida_pais', 'llamada', 'videollamada'));

-- ── 3. Inmutables: un registro de contacto no se modifica ni se borra (es evidencia) ─────────
create or replace function public.bloquear_cambios_contacto()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if old.tipo in ('llamada', 'videollamada') then
    raise exception 'Los registros de contacto no se pueden modificar ni borrar: son tu prueba.';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;
revoke all on function public.bloquear_cambios_contacto() from public;
drop trigger if exists eventos_contacto_inmutable on public.eventos;
create trigger eventos_contacto_inmutable before update or delete on public.eventos
  for each row execute function public.bloquear_cambios_contacto();
