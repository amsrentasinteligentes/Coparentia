-- CERRAR TODAS LAS SESIONES DEL DUEÑO (2026-09-22) — pedido del usuario después de que un token de
-- sesión temporal quedara escrito en el registro de una prueba automatizada.
--
-- QUÉ HACE: borra las sesiones y los "refresh tokens" de la cuenta. A partir de aquí, cualquier
-- dispositivo que estuviera dentro tendrá que volver a entrar con su enlace o su código.
--
-- QUÉ NO PUEDE HACER (y es importante saberlo): el token de acceso ya emitido NO se invalida —
-- por diseño vive hasta su vencimiento, una hora después de haberse creado. Lo que esto impide es
-- que se RENUEVE, así que pasado ese plazo queda inservible.
--
-- Cómo correrlo: Supabase → SQL Editor → New query → pegar → Run.

delete from auth.refresh_tokens
 where user_id = (select id::text from auth.users where email = 'amsrentasinteligentes@gmail.com');

delete from auth.sessions
 where user_id = (select id from auth.users where email = 'amsrentasinteligentes@gmail.com');
