-- FRENO DE GASTO DE IA, PARTE 1 DE 2 (2026-10-29, auditoría #2) — pégalo completo en Supabase →
-- SQL Editor → New query → Run. Es solo ADITIVO: crea una función nueva y no quita nada, así que se
-- puede correr antes de publicar el código sin que la app en vivo note nada.
--
-- QUÉ AGREGA: una segunda versión de `presupuesto_ia_disponible` que además de mirar el tope global
-- de US$1.00 al día (todos los usuarios juntos) mira un tope POR PERSONA: máximo 30 lecturas al día,
-- contando el día de Colombia. Recibe a la persona y devuelve solo sí/no.
--
-- QUIÉN PUEDE LLAMARLA: únicamente el servidor (clave de servicio). Antes la llamaba el navegador con la
-- sesión del usuario; ahora que recibe un `p_user_id`, dejar que cualquiera la llame permitiría
-- preguntar por la cuenta de otro. El servidor siempre le pasa el id de la persona que tiene sesión.
--
-- LA PARTE 2 (`freno-gasto-ia-v2-cierre.sql`) se corre DESPUÉS de publicar el código nuevo.

create or replace function public.presupuesto_ia_disponible(p_user_id uuid, p_feature text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  with hoy as (
    -- Medianoche de Colombia (America/Bogota) de hoy, como instante absoluto.
    select (date_trunc('day', now() at time zone 'America/Bogota') at time zone 'America/Bogota') as inicio
  )
  select
    p_user_id is not null
    -- Tope global: US$1.00 al día entre todos.
    and coalesce((
      select sum(c.cost_usd)
      from public.ai_calls c, hoy
      where c.feature = p_feature and c.created_at >= hoy.inicio
    ), 0) < 1.0
    -- Tope por persona: 30 lecturas al día. No cuentan los avisos internos de "no se llamó a la IA".
    and (
      select count(*)
      from public.ai_calls c, hoy
      where c.feature = p_feature
        and c.user_id = p_user_id
        and c.created_at >= hoy.inicio
        and coalesce(c.error, '') not in ('presupuesto_diario_agotado', 'tope_por_persona')
    ) < 30;
$$;

-- ⚠️ En Supabase hay que revocar a `anon` y `authenticated` POR SU NOMBRE (revocar a `public` no alcanza:
-- el proyecto concede EXECUTE a esos roles por defecto — ver supabase/freno-gasto-ia.sql). Solo el
-- servidor, con la clave de servicio, puede preguntarle a esta función.
revoke all on function public.presupuesto_ia_disponible(uuid, text) from public;
revoke all on function public.presupuesto_ia_disponible(uuid, text) from anon;
revoke all on function public.presupuesto_ia_disponible(uuid, text) from authenticated;
grant execute on function public.presupuesto_ia_disponible(uuid, text) to service_role;
