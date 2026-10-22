# Coparentia

App web para padres separados: registra cada pago de la cuota alimentaria con comprobante y fecha, y arma un expediente listo para mostrar. Next.js (App Router) + Supabase + Vercel + Hotmart (cobro) + Resend (correo).

## Arrancar en tu computador
1. `npm ci`
2. Copia `.env.example` a `.env.local` y llena los valores (nunca los pegues en el chat ni los subas a git).
3. `npm run dev` y abre http://localhost:3000

## Comandos
- `npm run typecheck` — revisa los tipos (debe terminar sin errores).
- `npm run lint` — estilo del código (hoy quedan 22 errores conocidos, ver `docs/release/CERTIFICADO-PRE-LANZAMIENTO.md`).
- `npm run build` — compila para producción.

## Base de datos
Los cambios de la base están en `supabase/*.sql`. Se corren a mano en Supabase → SQL Editor, en el orden indicado en `ESTADO.md`. No hay un `db push` automático todavía.

## Publicar
Cada push a `master` publica en Vercel (coparentia.co). Cada otra rama genera una copia de prueba. Ver `docs/MANUAL-DEL-DUENO.md`.

## Documentos de la certificación
`docs/release/` — claims, pagos, economía, privacidad, publicación y el certificado /100.
