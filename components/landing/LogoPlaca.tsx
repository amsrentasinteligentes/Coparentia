// Logo horizontal plateado, solo, sin placa (decisión del dueño, 2026-10-20): con la placa azul el logo
// perdió presencia y nitidez. Se sirven versiones re-muestreadas y afinadas (240 y 360 px de ancho) para que
// el navegador no tenga que encoger el archivo de 800 px, que era lo que lo emborronaba.
// `shrink-0` + ancho automático: sin eso el menú del encabezado comprimía la imagen.

export function LogoPlaca({
  alt = 'Coparentia',
  compacto = false,
  className = '',
}: {
  alt?: string;
  /** Encabezado con menú (página principal): logo de 32 px. Sin menú (recorrido, planes, pie): 40 px. */
  compacto?: boolean;
  className?: string;
}) {
  return (
    <img
      src="/logo-horizontal-360.webp"
      srcSet="/logo-horizontal-240.webp 240w, /logo-horizontal-360.webp 360w"
      sizes={compacto ? '105px' : '132px'}
      width={compacto ? 105 : 132}
      height={compacto ? 32 : 40}
      alt={alt}
      className={`inline-block w-auto shrink-0 object-contain ${compacto ? 'h-8' : 'h-10'} ${className}`}
    />
  );
}
