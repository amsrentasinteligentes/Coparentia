-- FRENO DE GASTO DE IA, PARTE 2 DE 2 (2026-10-29, auditoría #2) — córrelo SOLO DESPUÉS de publicar el
-- código nuevo de `lib/ocr-recibo.ts` y comprobar que la lectura de recibos sigue funcionando.
-- Pégalo completo en Supabase → SQL Editor → New query → Run.
--
-- QUÉ CIERRA:
-- 1. La política `ai_calls_insert_propio`, que dejaba a CUALQUIER usuario con sesión insertar filas en
--    `ai_calls` desde el navegador con el costo que quisiera (una fila falsa de costo alto agotaba el tope
--    diario y apagaba la lectura automática para todos). Sin política de insert, solo el servidor con la
--    clave de servicio (que se salta la seguridad por filas) puede anotar llamadas.
-- 2. La versión vieja de `presupuesto_ia_disponible(text)`, que no conoce el tope por persona.
--
-- ⚠️ Si se corre ANTES de publicar el código nuevo, la lectura automática se apaga (el código viejo
-- no puede anotar ni consultar) y la gente escribe el monto a mano hasta que se publique. No se pierde
-- ningún dato, pero por eso va en dos partes.

drop policy if exists "ai_calls_insert_propio" on public.ai_calls;

drop function if exists public.presupuesto_ia_disponible(text);
