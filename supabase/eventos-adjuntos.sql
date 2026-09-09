-- ADJUNTOS REALES EN EVENTOS (Sesión 6, continuación) — pégalo completo en
-- Supabase → SQL Editor → New query → Run. Antes solo "Salida del país" permitía adjuntar un
-- documento, y solo se guardaba el NOMBRE (igual que pasaba con los pagos) — ahora CUALQUIER
-- evento puede llevar un archivo real (ej. la fórmula médica de una cita), guardado de verdad
-- en el mismo bucket privado "comprobantes" que ya existe (supabase/storage.sql), solo que en
-- su propia carpeta dentro del usuario.

alter table public.eventos add column if not exists documento_adjunto_path text;
