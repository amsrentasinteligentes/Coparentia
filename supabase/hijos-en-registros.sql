-- GASTOS Y EVENTOS POR HIJO (2026-09-18) — pégalo completo en Supabase → SQL Editor → New query →
-- Run (después de perfil-familia.sql). Pedido del usuario: cuando hay 2 o 3 hijos, los gastos deben
-- poder agruparse por cada hijo para que las cuentas queden claras. Cada pago o evento puede
-- señalar a UN hijo (o a ninguno = "todos"/general). Si el hijo se borra del perfil, el registro
-- se conserva y solo pierde la etiqueta (on delete set null): un comprobante nunca desaparece por
-- editar la familia. RLS: las filas ya están protegidas por user_id en schema.sql; la FK apunta a
-- hijos, cuya RLS impide leer hijos ajenos, así que el "join" desde el navegador solo trae los
-- propios (25-BASE-DE-DATOS.md: índice en cada FK).

alter table public.pagos
  add column if not exists hijo_id uuid references public.hijos(id) on delete set null;
create index if not exists pagos_hijo_id_idx on public.pagos(hijo_id);

alter table public.eventos
  add column if not exists hijo_id uuid references public.hijos(id) on delete set null;
create index if not exists eventos_hijo_id_idx on public.eventos(hijo_id);

-- Nadie puede colgar un pago de un hijo que no es suyo: el trigger verifica que el hijo pertenezca
-- al mismo usuario de la fila (la FK sola no lo garantiza).
create or replace function public.validar_hijo_propio()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.hijo_id is not null
     and not exists (select 1 from public.hijos h where h.id = new.hijo_id and h.user_id = new.user_id) then
    raise exception 'El hijo indicado no pertenece a esta cuenta.';
  end if;
  return new;
end;
$$;
revoke all on function public.validar_hijo_propio() from public;

drop trigger if exists pagos_hijo_propio on public.pagos;
create trigger pagos_hijo_propio before insert or update of hijo_id on public.pagos
  for each row execute function public.validar_hijo_propio();

drop trigger if exists eventos_hijo_propio on public.eventos;
create trigger eventos_hijo_propio before insert or update of hijo_id on public.eventos
  for each row execute function public.validar_hijo_propio();
