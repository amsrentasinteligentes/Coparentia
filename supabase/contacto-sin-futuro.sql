-- CONTACTO SIN FECHA FUTURA (2026-10-26) — pégalo completo en Supabase → SQL Editor → New query → Run.
-- Un registro de contacto (llamada o videollamada) es PRUEBA de algo que YA ocurrió y queda sellado
-- sin poder editarse ni borrarse (ver contacto-hijos.sql). La app ya impide guardarlo con fecha u hora
-- futuras, pero esa regla vivía solo en el navegador: quien hablara directo con la base de datos
-- podía sellar una "prueba" de una llamada que aún no pasó. Esta regla vive en el dato mismo.
--
-- Usa la hora de Colombia (America/Bogota). Margen de 2 minutos por si el reloj del teléfono va
-- un poco adelantado. Solo mira los INSERT nuevos: no toca ni valida ningún registro ya guardado.
-- Es seguro correrlo más de una vez.

create or replace function public.bloquear_contacto_futuro()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  ahora_col timestamp := (now() at time zone 'America/Bogota');
begin
  if new.tipo in ('llamada', 'videollamada') then
    if new.fecha > ahora_col::date then
      raise exception 'Un contacto solo se registra después de que ocurrió: la fecha no puede ser futura.';
    end if;
    if new.fecha = ahora_col::date and new.hora is not null
       and (new.fecha + new.hora) > (ahora_col + interval '2 minutes') then
      raise exception 'Un contacto solo se registra después de que ocurrió: la hora no puede ser futura.';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.bloquear_contacto_futuro() from public;
drop trigger if exists eventos_contacto_sin_futuro on public.eventos;
create trigger eventos_contacto_sin_futuro before insert on public.eventos
  for each row execute function public.bloquear_contacto_futuro();
