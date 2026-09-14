-- 🔴 CRÍTICO — CIERRA UN HUECO REAL: la función `aplicar_evento_hotmart` seguía siendo llamable
-- por CUALQUIERA en internet, sin pasar por el webhook ni conocer el HOTTOK. Pégalo completo en
-- Supabase → SQL Editor → New query → Run. HAZLO ANTES de cualquier compra de prueba.
--
-- CAUSA RAÍZ: en PostgreSQL, toda función nueva concede EXECUTE a **PUBLIC** por defecto (un rol
-- del que todo el mundo es miembro, incluido `anon`). Las versiones anteriores de esta función
-- solo revocaban el permiso a `anon` y `authenticated` explícitamente — nunca a PUBLIC. Como el
-- grant por defecto vive en PUBLIC, `anon` lo seguía heredando por ahí aunque su grant directo
-- estuviera revocado. Comprobado en vivo: una llamada SIN sesión (con la clave anon, la misma que
-- usa cualquier visitante de la app) SÍ pudo ejecutar la función y crear una suscripción "active"
-- de la nada — mismo patrón exacto que ya había aparecido antes con `presupuesto_ia_disponible`
-- (2026-09-11): revocar de `anon`/`authenticated` sin revocar de PUBLIC no cierra nada.

revoke all on function public.aplicar_evento_hotmart(text, text, text, text, text, text, timestamptz, timestamptz, timestamptz)
  from public;
revoke all on function public.aplicar_evento_hotmart(text, text, text, text, text, text, timestamptz, timestamptz, timestamptz)
  from anon, authenticated;

-- Borra la fila que se coló durante la comprobación de este hueco (una prueba propia, sin daño
-- real — nadie más la vio ni la usó). Si tu correo real coincidiera por error con este, NO se
-- borraría: el filtro es exacto.
delete from public.suscripciones where email = 'atacante@test.com';
