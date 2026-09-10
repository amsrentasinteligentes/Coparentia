-- ACUERDO DE LA CUOTA (acta de conciliación o sentencia) — pégalo completo en
-- Supabase → SQL Editor → New query → Run. Guarda la REFERENCIA del documento base que fija la
-- cuota, para consultarlo desde la pantalla de Expediente. El archivo en sí vive en el mismo
-- bucket privado "comprobantes" que ya existe (supabase/storage.sql), en la carpeta
-- "{userId}/acuerdo/..." — sin necesitar otro bucket ni otra política de Storage.

alter table public.titulos add column if not exists acuerdo_path   text;
alter table public.titulos add column if not exists acuerdo_nombre text;
