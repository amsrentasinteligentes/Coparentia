-- QUITA EL PERMISO DE ESCRITURA ANÓNIMA SOBRE event_log (auditoría de seguridad, 2026-10-14).
-- Pégalo completo en Supabase → SQL Editor → New query → Run.
--
-- ⚠️ ORDEN: ejecútalo SOLO DESPUÉS de que el código nuevo esté publicado y funcionando
-- (el clic en "Contactar" ya se registra desde el servidor: app/api/contacto-profesional).
-- Si lo ejecutas antes, la versión vieja de la página deja de contar los clics durante ese rato.
--
-- Qué hace: elimina la política que dejaba a CUALQUIER visitante sin sesión insertar eventos
-- `contacto_profesional_click` directo desde el navegador (se podía inflar el conteo). El servidor
-- escribe con la clave de servicio, que no depende de esta política.
-- NO toca `event_log_insert_propio` (usuarios con sesión) ni `event_log_select_admin` (el panel
-- del dueño sigue leyendo igual) ni los registros que ya existen.
drop policy if exists "event_log_insert_anonimo_contacto_profesional" on public.event_log;

-- Comprobación (debe devolver solo las políticas 'event_log_select_admin' y 'event_log_insert_propio'):
-- select policyname, cmd, roles from pg_policies where tablename = 'event_log';
