// Logo horizontal sobre una placa azul marino (decisión del dueño, 2026-10-20): el isotipo cromado
// se perdía sobre el fondo claro. El archivo del logo no se toca; la placa solo le da contraste.
// Misma pieza en encabezados y pie para que la marca se vea igual en todas partes.
// `shrink-0` + ancho automático: sin eso el menú del encabezado comprimía la imagen (65 px de ancho a
// 375 px, 50 px a 360 px) y el logo se leía a ~20 px de alto aunque el alto fuera de 32 (medido 2026-10-20).

export function LogoPlaca({
  alt = 'Coparentia',
  compacto = false,
  className = '',
}: {
  alt?: string;
  /** Encabezado con menú (página principal): logo de 30 px. Sin menú (recorrido, planes, pie): 36 px. */
  compacto?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-[22px] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--accent-deep,#2757a8)_75%,black),color-mix(in_srgb,var(--accent-deep,#2757a8)_50%,black))] shadow-[0_6px_18px_-8px_color-mix(in_oklab,var(--accent-deep,#2757a8)_70%,transparent)] ${
        compacto ? 'px-2.5 py-[5px]' : 'px-3.5 py-1.5'
      } ${className}`}
    >
      <img src="/logo-horizontal.webp" alt={alt} className={`w-auto shrink-0 object-contain ${compacto ? 'h-[30px]' : 'h-9'}`} />
    </span>
  );
}
