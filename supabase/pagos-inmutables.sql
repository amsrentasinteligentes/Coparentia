-- SELLO DE CONFIANZA REAL SOBRE pagos (2026-09-25, hallazgo de auditoría externa) — pégalo
-- completo en Supabase → SQL Editor → New query → Run.
--
-- El "Sello de Confianza" es la promesa central de Coparentia: "queda fechado y nadie puede
-- alterarlo en silencio" (ver onboarding/landing). Pero la tabla que el Sello dice proteger —
-- `pagos`— nunca tuvo esa protección real: un pago sellado se podía borrar de un vistazo y no
-- quedaba ningún rastro. `constancias` y `contacto-hijos` sí la tienen desde antes; a `pagos`
-- se le olvidó ponérsela.
--
-- La app SÍ necesita poder "quitar" un pago (foto equivocada, duplicado — ver el comentario de
-- eliminarPago() en lib/datos.ts), así que esto NO bloquea el borrado sin más: lo convierte en un
-- soft-delete auditable. El registro de que existió y de que se quitó queda para siempre; lo único
-- que cambia es que deja de aparecer en la lista activa y en el PDF del expediente.

alter table public.pagos
  add column if not exists eliminado_en timestamptz;

-- Las consultas activas de la app siempre filtran `eliminado_en is null` (ver lib/datos.ts,
-- lib/constancias.ts) — este índice parcial las deja tan rápidas como antes.
create index if not exists pagos_activos_idx on public.pagos(user_id, fecha desc) where eliminado_en is null;

-- Nadie hace UPDATE/DELETE directo desde el cliente — la única puerta es la RPC de abajo.
revoke update, delete on public.pagos from authenticated;

-- Defensa en profundidad: aunque algún día un grant se configure mal, este trigger bloquea
-- CUALQUIER intento de update/delete que no sea exactamente "marcar como eliminado una sola vez,
-- sin tocar ningún otro campo" — así la garantía vive en el dato, no solo en los permisos.
create or replace function public.bloquear_cambios_pagos()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if TG_OP = 'DELETE' then
    raise exception 'Un pago sellado no se borra directamente: usa eliminar_pago_propio para retirarlo del expediente sin perder el rastro.';
  end if;
  if OLD.eliminado_en is not null then
    raise exception 'Este pago ya fue eliminado: no se puede volver a modificar.';
  end if;
  if NEW.eliminado_en is null
     or NEW.user_id is distinct from OLD.user_id
     or NEW.fecha is distinct from OLD.fecha
     or NEW.monto is distinct from OLD.monto
     or NEW.concepto is distinct from OLD.concepto
     or NEW.tipo is distinct from OLD.tipo
     or NEW.comprobante_nombre is distinct from OLD.comprobante_nombre
     or NEW.comprobante_path is distinct from OLD.comprobante_path
     or NEW.hijo_id is distinct from OLD.hijo_id
     or NEW.created_at is distinct from OLD.created_at then
    raise exception 'Un pago sellado no se puede modificar: solo se puede marcar como eliminado.';
  end if;
  return NEW;
end;
$$;
revoke all on function public.bloquear_cambios_pagos() from public;
drop trigger if exists pagos_inmutables on public.pagos;
create trigger pagos_inmutables before update or delete on public.pagos
  for each row execute function public.bloquear_cambios_pagos();

-- Única forma real de "eliminar" un pago: lo marca (nunca lo borra), solo el dueño, solo una vez.
-- SECURITY DEFINER: corre con el dueño de la función (no con los permisos de `authenticated`,
-- que ya no tiene UPDATE en la tabla) — por eso puede hacer la marca aunque el cliente no pueda.
create or replace function public.eliminar_pago_propio(p_pago_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_filas int;
begin
  update public.pagos
     set eliminado_en = now()
   where id = p_pago_id
     and user_id = (select auth.uid())
     and eliminado_en is null;
  get diagnostics v_filas = row_count;
  if v_filas = 0 then
    raise exception 'No se pudo eliminar: el pago no existe, no es tuyo, o ya estaba eliminado.';
  end if;
end;
$$;
revoke all on function public.eliminar_pago_propio(uuid) from public;
grant execute on function public.eliminar_pago_propio(uuid) to authenticated;
