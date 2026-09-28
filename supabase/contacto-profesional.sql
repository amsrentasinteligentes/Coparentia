-- CONTEO DE "CONTACTAR" EN EL DIRECTORIO DE PROFESIONALES — pégalo completo en
-- Supabase → SQL Editor → New query → Run. Va DESPUÉS de admin.sql (usa la tabla event_log
-- que ya existe ahí) y de profesionales.sql.
--
-- `event_log` ya permite que un usuario CON SESIÓN anote sus propios eventos (política
-- "event_log_insert_propio" de admin.sql) — eso ya cubre a quien toca "Contactar" DENTRO de la
-- app. Pero el mismo botón también vive en la página de ventas, donde el visitante NO tiene
-- sesión — sin esta política nueva, esos clics no quedarían contados. Se abre el insert SOLO
-- para este evento puntual (nunca cualquier evento, nunca con datos de otra persona), igual de
-- restringido en espíritu que el resto de 09-SEGURIDAD.md.
drop policy if exists "event_log_insert_anonimo_contacto_profesional" on public.event_log;
create policy "event_log_insert_anonimo_contacto_profesional" on public.event_log
  for insert
  to anon
  with check (user_id is null and nombre = 'contacto_profesional_click');
