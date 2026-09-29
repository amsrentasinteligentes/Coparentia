-- ORDEN PERSONALIZADO DEL DIRECTORIO DE PROFESIONALES (2026-09-29) — pégalo completo en
-- Supabase → SQL Editor → New query → Run. Va DESPUÉS de profesionales.sql.
--
-- `orden` en NULL (el default de siempre) = se ordena por nombre (A-Z). En cuanto el dueño mueve
-- a alguien desde el panel, TODA la lista pasa a tener un número explícito (ver
-- `moverProfesional` en app/admin/profesionales/acciones.ts) — así "fijar a alguien primero y el
-- resto alfabético" es solo mover a esa persona una vez arriba de todo.
alter table public.profesionales add column if not exists orden integer;
create index if not exists profesionales_orden_idx on public.profesionales(orden);
