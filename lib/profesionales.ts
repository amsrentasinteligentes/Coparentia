// BANCO DE PROFESIONALES (2026-09-28) — fuente única para el directorio, usada tanto dentro de la
// app (components/app/DirectorioProfesionales.tsx) como en la página de ventas
// (components/landing/AnuncioAbogados.tsx): un profesional nuevo se agrega UNA vez, aquí, y
// aparece en los dos lugares. Mismo criterio de siempre — nunca un perfil inventado.

import { Scale, Brain, HeartHandshake, type LucideIcon } from 'lucide-react';

export type CategoriaProfesional = 'abogado' | 'psicologo' | 'trabajador_social';

export interface Profesional {
  categoria: CategoriaProfesional;
  nombre: string;
  /** Ej. "Derecho de familia · Cuota alimentaria" */
  especialidad: string;
  ciudad?: string;
  /** mailto:, tel:, o https://wa.me/… — a dónde escribe el usuario. */
  contactoUrl: string;
  /** Foto de perfil (headshot) — debe vivir en /public. */
  fotoUrl?: string;
}

// Colores YA definidos en tokens-app-claro.css/globals.css (nunca hex nuevo) — uno por categoría,
// para que el selector no se vea plano en gris. Reutiliza los mismos tonos que ya usa Calendario:
// `--cat-visita` (azul, ya asociado a "legal/formal" en el resto de la app), `--cat-extra`
// (morado, mente/psicología) y `--cat-vacaciones` (verde, cuidado/bienestar).
export const CATEGORIAS_PROFESIONAL: {
  id: CategoriaProfesional;
  etiqueta: string;
  corta: string;
  icon: LucideIcon;
  motivoVacio: string;
  color: string;
  colorBg: string;
}[] = [
  {
    id: 'abogado',
    etiqueta: 'Abogados de familia',
    corta: 'Asesoría legal para tus decisiones',
    icon: Scale,
    motivoVacio: 'Pronto verás aquí abogados de familia de tu ciudad, listos para acompañarte con lo que ya tienes documentado.',
    color: 'var(--cat-visita)',
    colorBg: 'var(--cat-visita-bg)',
  },
  {
    id: 'psicologo',
    etiqueta: 'Psicólogos familiares',
    corta: 'Bienestar emocional para todos',
    icon: Brain,
    motivoVacio: 'Pronto verás aquí psicólogos especializados en familias en proceso de separación.',
    color: 'var(--cat-extra)',
    colorBg: 'var(--cat-extra-bg)',
  },
  {
    id: 'trabajador_social',
    etiqueta: 'Trabajadores sociales',
    color: 'var(--cat-vacaciones)',
    colorBg: 'var(--cat-vacaciones-bg)',
    corta: 'Acompañamiento social a tu familia',
    icon: HeartHandshake,
    motivoVacio: 'Pronto verás aquí trabajadores sociales que pueden acompañar el proceso de tu familia.',
  },
];

// ⬇️ Cuando un profesional pague por su cupo, agrega su fila acá.
// Primer anuncio real (2026-09-17, actualizado 2026-09-28 a foto + formato de tarjeta — antes era
// un banner de imagen completa): Dra. Ivonne Reyes.
export const PROFESIONALES: Profesional[] = [
  {
    categoria: 'abogado',
    nombre: 'Ivonne Reyes',
    especialidad: 'Abogada especialista en relaciones jurídico negociables',
    ciudad: 'Bogotá D.C.',
    contactoUrl: 'https://wa.me/573012283506',
    fotoUrl: '/anuncios/ivonne-reyes.png',
  },
];

// Email al que escriben los profesionales interesados en anunciarse (mismo de siempre).
export const CONTACTO_ALIANZAS = 'alianzas@coparentia.co';
