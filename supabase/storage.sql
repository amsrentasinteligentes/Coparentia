-- ALMACENAMIENTO REAL DE COMPROBANTES (Sesión 6, continuación) — pégalo completo en
-- Supabase → SQL Editor → New query → Run. Antes solo se guardaba el NOMBRE del archivo
-- (comprobante_nombre); esto crea el lugar donde vive el archivo real (foto/PDF), privado,
-- solo visible para el dueño de cada comprobante.

-- ── Bucket privado "comprobantes" — cada archivo vive en la carpeta {user_id}/... ───────────
insert into storage.buckets (id, name, public)
values ('comprobantes', 'comprobantes', false)
on conflict (id) do nothing;

-- ── RLS de storage: un usuario solo puede leer/subir/borrar dentro de SU PROPIA carpeta ─────
-- (storage.foldername(name))[1] es el primer segmento de la ruta del archivo — la carpeta con
-- el user_id que arma lib/datos.ts al subir (`${userId}/...`).
create policy "comprobantes_propios_select" on storage.objects
  for select using (
    bucket_id = 'comprobantes' and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "comprobantes_propios_insert" on storage.objects
  for insert with check (
    bucket_id = 'comprobantes' and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "comprobantes_propios_delete" on storage.objects
  for delete using (
    bucket_id = 'comprobantes' and (select auth.uid())::text = (storage.foldername(name))[1]
  );
