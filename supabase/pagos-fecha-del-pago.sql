-- FECHA DEL PAGO vs. FECHA DE CARGA (2026-10-13, auditoría externa) — pégalo completo en
-- Supabase → SQL Editor → New query → Run. Debe responder "Success".
--
-- El problema: la app fechaba cada comprobante con el día en que se SUBÍA. Quien sube hoy los
-- recibos de tres meses atrás los dejaba los tres fechados hoy y contados en la cuota de este mes.
--
-- Lo que esto NO cambia (a propósito, cambio mínimo):
--   · No agrega ninguna columna. `fecha` (date) pasa a ser "la fecha del pago" — la que elige la
--     persona — y `created_at` (timestamptz) ya existía como "la fecha y hora de carga". Los pagos
--     viejos quedan intactos: su `fecha` ya es la que tenían guardada.
--   · No toca permisos ni las políticas de seguridad por filas de `pagos`.
--   · No abre ninguna forma de editar un pago: el candado de supabase/pagos-inmutables.sql
--     (UPDATE/DELETE) sigue igual, y esa regla ya protege `fecha` y `created_at`.
--
-- Lo que SÍ hace — una regla que corre en la base cada vez que se GUARDA un pago nuevo:
--   1. Fija `created_at` con el reloj del servidor. Aunque alguien mande otro valor desde el
--      navegador, se ignora: la fecha de carga nunca la pone quien carga.
--   2. Rechaza una fecha de pago futura, medida en hora de Colombia (igual que lib/fecha.ts).
--
-- Se puede correr más de una vez sin problema.

create or replace function public.fijar_fechas_pago()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.created_at := now();
  if new.fecha > (now() at time zone 'America/Bogota')::date then
    raise exception 'La fecha del pago no puede ser futura.';
  end if;
  return new;
end;
$$;

drop trigger if exists pagos_fijar_fechas on public.pagos;
create trigger pagos_fijar_fechas
  before insert on public.pagos
  for each row execute function public.fijar_fechas_pago();

comment on function public.fijar_fechas_pago() is
  'Al guardar un pago: created_at = reloj del servidor (la fecha de carga no la elige quien carga) y fecha del pago no futura (hora de Colombia).';
