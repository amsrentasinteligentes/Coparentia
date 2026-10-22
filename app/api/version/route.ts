// VERSIÓN PUBLICADA (2026-10-22, certificación pre-lanzamiento): devuelve el commit que está en producción, para comprobar
// que lo publicado coincide con lo auditado. No expone nada sensible: solo el identificador corto del commit y el entorno.

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET(): NextResponse {
  return NextResponse.json({
    commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7),
    entorno: process.env.VERCEL_ENV ?? 'local',
  });
}
