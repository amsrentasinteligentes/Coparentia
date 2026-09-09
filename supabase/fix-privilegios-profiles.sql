-- FIX DE SEGURIDAD CRÍTICO — autoescalada de privilegios en `profiles`.
-- Pégalo completo en Supabase → SQL Editor → New query → Run (después de admin.sql).
--
-- QUÉ PASABA: la política "profiles_update_propio" (supabase/admin.sql) le permite a cada
-- usuario actualizar SU PROPIA fila de `profiles` — pero Postgres RLS controla FILAS, no
-- COLUMNAS. Sin restricción de columna, cualquier usuario autenticado podía, con una llamada
-- directa a la API de Supabase (sin pasar por ninguna pantalla de la app), ejecutar el
-- equivalente a `update profiles set role = 'admin' where id = auth.uid()` y volverse dueño del
-- panel de administración él mismo. Es exactamente el hallazgo A01 (Broken Access Control) del
-- checklist de 27-REVISION-SEGURIDAD.md.
--
-- FIX: los usuarios normales solo pueden tocar el campo `nombre` de su propio perfil — nunca
-- `role`, `source` ni `creado_manualmente`. Esos tres solo cambian por el trigger de alta (ambos
-- security definer) o por una acción de servidor con la service_role key.

revoke update on public.profiles from authenticated;
grant update (nombre) on public.profiles to authenticated;
