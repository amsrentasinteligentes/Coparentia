// Comprime una foto SOLO para mandarla a leer con IA — nunca reemplaza el archivo real que se
// guarda en el expediente (el comprobante se sube en su calidad original, es evidencia legal).
// Las fotos de cámara de celular pesan varios MB; sin esto, el lector de recibos podía tardar
// demasiado o cortarse en el servidor (hallazgo real: se quedaba "leyendo…" sin terminar en un
// celular real). Reducir a ~1200px de lado más largo es más que suficiente para leer un monto.

export async function comprimirParaLectura(archivo: File): Promise<File> {
  const LADO_MAXIMO = 1200;
  try {
    const bitmap = await createImageBitmap(archivo);
    let { width, height } = bitmap;
    if (width > LADO_MAXIMO || height > LADO_MAXIMO) {
      const escala = Math.min(LADO_MAXIMO / width, LADO_MAXIMO / height);
      width = Math.round(width * escala);
      height = Math.round(height * escala);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return archivo;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
    if (!blob) return archivo;
    return new File([blob], archivo.name, { type: 'image/jpeg' });
  } catch {
    return archivo; // si algo falla al comprimir, se manda la original — mejor lento que roto
  }
}
