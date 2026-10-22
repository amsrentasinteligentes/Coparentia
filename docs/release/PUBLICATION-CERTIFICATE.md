# PUBLICATION-CERTIFICATE — publicación (2026-10-22)

| Verificación | Resultado | Evidencia |
|---|---|---|
| Repositorio GitHub conectado a Vercel | ✅ | Cada push a `master` crea un despliegue Production y cada otra rama uno Preview (panel de Deployments, capturas del 2026-10-21) |
| Rama de producción | ✅ `master` | Despliegues Production `7e98c76` → `cf6ce00` → `6fe327a` |
| Segunda publicación automática | ✅ | Varios commits consecutivos publicados solo por push, sin `vercel --prod` |
| Preview funciona sin las claves reales | ⚠️ con 3 variables de relleno solo en Preview | ESTADO.md 2026-10-20 |
| Root Directory e Ignored Build Step | NO VERIFICADO | No se abrió Settings de Vercel |
| Supabase project-ref | `chxhyzyzpipbopskomuv` (proyecto Coparentia, rama `main`, PRODUCTION, plan FREE) | Captura del panel del 2026-10-21 |
| Migraciones | ⚠️ 35 archivos SQL corridos a mano; sin historial automático | `supabase/` |
| Callbacks de login y webhook en el dominio final | ✅ login con Google y enlace verificados en producción (ESTADO.md 2026-09-24); webhook de Hotmart activo | — |
| Versión visible | ✅ solo en la rama de correcciones (`/api/version`); producción responde 404 hasta publicar | `curl https://coparentia.co/api/version` → 404 |
| Rollback | ⚠️ posible con Promote de un despliegue anterior en Vercel; **no probado** | — |
| Copia de seguridad y restauración | ❌ Supabase Free no ofrece restauración programada | Decisión de subir a Pro ya anotada (ESTADO.md 2026-09-24) |
