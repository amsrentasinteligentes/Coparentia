// Logo horizontal sobre una placa azul marino (decisión del dueño, 2026-10-20): el isotipo cromado
// se perdía sobre el fondo claro. El archivo del logo no se toca; la placa solo le da contraste.
// Misma pieza en encabezados y pie para que la marca se vea igual en todas partes.

export function LogoPlaca({ alt = 'Coparentia', className = '' }: { alt?: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[22px] bg-[linear-gradient(150deg,var(--accent-deep,#2757a8),color-mix(in_oklab,var(--accent-deep,#2757a8)_62%,black))] px-3.5 py-1.5 shadow-[0_6px_18px_-8px_color-mix(in_oklab,var(--accent-deep,#2757a8)_70%,transparent)] ${className}`}
    >
      <img src="/logo-horizontal.webp" alt={alt} className="h-8 w-auto object-contain" />
    </span>
  );
}
