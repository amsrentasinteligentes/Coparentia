-- PRÓXIMO COBRO EN `suscripciones` (2026-10-13, auditoría externa) — guarda la fecha del próximo cobro
-- que Hotmart avisa en cada cobro real, para que Perfil pueda decir "Activa — próximo cobro el …".
--
-- ES UN CAMBIO SEGURO: solo AGREGA una columna vacía. No toca ninguna fila existente, ninguna política de
-- seguridad ni la función que aplica los avisos de Hotmart. Se puede correr más de una vez sin problema.
--
-- Cómo correrlo: Supabase → SQL Editor → New query → pegar todo → Run. Debe responder "Success".

alter table public.suscripciones
  add column if not exists next_charge_at timestamptz;

comment on column public.suscripciones.next_charge_at is
  'Fecha del próximo cobro según el último aviso de cobro real de Hotmart (date_next_charge). Solo informativa: el acceso NO depende de ella.';
