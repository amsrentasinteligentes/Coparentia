-- FRENO DE GASTO DE IA QUE DE VERDAD FRENA — pégalo completo en
-- Supabase → SQL Editor → New query → Run.
--
-- EL BUG QUE ARREGLA (auditoría 2026-09-11): `lib/ocr-recibo.ts` comprobaba el gasto del día
-- leyendo la tabla `ai_calls` con la sesión del propio usuario. Pero la política de seguridad de
-- esa tabla (supabase/ai.sql) solo deja LEERLA al dueño de la app. Para cualquier usuario normal la
-- consulta devolvía CERO FILAS, así que el gasto del día siempre daba $0 y el tope nunca cortaba:
-- el freno existía en el código pero no frenaba a nadie.
--
-- LA SOLUCIÓN: una función `security definer` — corre con los permisos de quien la creó, así que sí
-- puede sumar TODAS las llamadas del día — que devuelve únicamente un sí/no. El usuario nunca ve
-- las filas ni el monto: solo si todavía hay presupuesto. Y el límite vive AQUÍ, en el servidor,
-- no en el código del navegador: nadie puede pedir un tope más alto.
--
-- ⚠️ PARA CAMBIAR EL TOPE DIARIO hay que editar el 1.0 de abajo y volver a correr este archivo.

create or replace function public.presupuesto_ia_disponible(p_feature text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(sum(cost_usd), 0) < 1.0
  from public.ai_calls
  where feature = p_feature
    -- El día arranca a medianoche EN COLOMBIA, no en el reloj universal (si no, la ventana de
    -- gasto se abría a las 7 de la noche del día anterior).
    and created_at >= (date_trunc('day', now() at time zone 'America/Bogota') at time zone 'America/Bogota');
$$;

-- Nadie más que un usuario con sesión puede preguntarle a la función, y solo eso: preguntar.
revoke all on function public.presupuesto_ia_disponible(text) from public;
grant execute on function public.presupuesto_ia_disponible(text) to authenticated;
