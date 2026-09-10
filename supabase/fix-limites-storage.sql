-- FIX DE SEGURIDAD — límite de tamaño y tipo de archivo en el bucket "comprobantes".
-- Pégalo completo en Supabase → SQL Editor → New query → Run.
--
-- QUÉ PASABA: el bucket se creó sin ningún tope — cualquier cuenta autenticada podía subir un
-- archivo de cualquier tamaño y de cualquier tipo dentro de su propia carpeta (hallazgo real de
-- la auditoría de seguridad: "importante", no crítico, porque RLS ya impide ver la carpeta de
-- otro usuario — pero sí permite gastar espacio de más o subir algo que no es ni foto ni PDF).
--
-- FIX: 15 MB por archivo (de sobra para una foto de celular o un PDF escaneado) y solo los tipos
-- que la app realmente usa. Esto lo aplica Supabase del lado del SERVIDOR, en el propio servicio
-- de Storage — no depende de que el navegador respete el atributo `accept` del input de archivo.

update storage.buckets
set
  file_size_limit = 15728640, -- 15 MB en bytes
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
where id = 'comprobantes';
