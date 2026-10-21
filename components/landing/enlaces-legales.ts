// ENLACES DEL PIE LEGAL — una sola lista para la página principal y para /especialistas, así el pie
// dice lo mismo en las dos y un enlace nuevo se agrega UNA vez.

import type { EnlaceLegal } from './FooterLegal';

export const ENLACES_LEGALES: EnlaceLegal[] = [
  { label: 'Privacidad', href: '/privacidad' },
  { label: 'Términos y Condiciones', href: '/terminos' },
  { label: 'Reembolsos', href: '/reembolsos' },
  { label: 'Aviso de IA', href: '/aviso-ia' },
  // Exigido por la normativa colombiana de protección al consumidor (2026-09-24, aportada
  // por el equipo jurídico): enlace visible a la autoridad de protección al consumidor.
  { label: 'SIC (Superintendencia)', href: 'https://www.sic.gov.co/' },
];

/** Salida discreta hacia el directorio y los artículos (2026-10-14): ya no viven al final de la página de
 *  ventas, justo donde la persona decide suscribirse; esta es la única puerta desde la principal. */
export const ENLACE_ESPECIALISTAS: EnlaceLegal = { label: 'Especialistas y artículos', href: '/especialistas' };
