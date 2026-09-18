'use client';

// PERFIL — pestaña propia (6ª del menú, al lado de Asistencia; decisión del usuario 2026-09-18).
// Composición de su referencia (docs/referencias/ref-3-perfil.jpeg): tarjeta de perfil con foto,
// nombre y rol + dos datos; "Mi familia" con los hijos; lista "Ajustes y cuenta"; tarjetitas de
// miembro/plan; cerrar sesión. Aquí la persona PERSONALIZA la app: su nombre (el saludo de Inicio
// pasa a "Hola, Carlos"), su foto (reemplaza las iniciales en la cabecera), su rol, sus hijos y el
// nombre de la otra parte. Datos en lib/perfil.ts (Supabase + bucket privado `perfiles`).

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  LogOut, ExternalLink, UserRound, CreditCard, LifeBuoy, ShieldCheck, FileText, Scale, ChevronRight,
  CalendarCheck, Crown, Camera, Pencil, Plus, Trash2, Check, X, Baby, Users, Settings, type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { ContenedorApp, Tarjeta, IconoCirculo, TarjetaSkeleton, ErrorDeCarga, CabeceraApp, TituloSeccion, Pildora } from '@/components/app/ui';
import { obtenerPagos, obtenerTitulo, formatoCOP, type Titulo } from '@/lib/datos';
import { crearClienteSupabase } from '@/lib/supabase/client';
import {
  type Perfil, type Hijo, type RolFamiliar,
  obtenerPerfil, guardarPerfil, guardarAvatar, quitarAvatar, urlFoto,
  obtenerHijos, agregarHijo, actualizarHijo, guardarFotoHijo, eliminarHijo, edadTexto, nombreCorto,
} from '@/lib/perfil';

const MAX_FOTO_MB = 3;

function validarFoto(archivo: File): string | null {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) return 'Solo fotos JPG, PNG o WebP.';
  if (archivo.size > MAX_FOTO_MB * 1024 * 1024) return `La foto pesa más de ${MAX_FOTO_MB} MB. Prueba con otra.`;
  return null;
}

/* ── <FilaAjuste> — fila de la lista "Ajustes y cuenta": chip + título + subtítulo + flecha ── */
function FilaAjuste({ icon, tono = 'accent', titulo, detalle, href, externo = false, ultima = false }: {
  icon: LucideIcon; tono?: 'accent' | 'exito' | 'info' | 'pendiente'; titulo: string; detalle: string;
  href: string; externo?: boolean; ultima?: boolean;
}) {
  const contenido = (
    <>
      <IconoCirculo icon={icon} size={18} tono={tono} />
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[14px] font-bold text-[var(--text-primary)]">{titulo}</span>
        <span className="block truncate text-[12px] text-[var(--text-secondary)]">{detalle}</span>
      </span>
      {externo ? <ExternalLink size={16} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" /> : <ChevronRight size={18} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />}
    </>
  );
  const clase = `flex w-full items-center gap-3 py-3 transition-transform duration-100 active:scale-[0.99] [touch-action:manipulation] ${ultima ? '' : 'border-b border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]'}`;
  if (externo) return <a href={href} target="_blank" rel="noopener noreferrer" className={clase}>{contenido}</a>;
  return <Link href={href} className={clase}>{contenido}</Link>;
}

/* ── <Avatar> — foto con URL firmada o iniciales; con `editable`, botón de cámara encima ── */
function Avatar({ ruta, iniciales, tamano = 56, editable, onElegir }: { ruta: string | null; iniciales: string; tamano?: number; editable?: boolean; onElegir?: (f: File) => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    let vigente = true;
    urlFoto(ruta).then((u) => { if (vigente) setUrl(u); });
    return () => { vigente = false; };
  }, [ruta]);
  return (
    <span className="relative inline-flex shrink-0" style={{ width: tamano, height: tamano }}>
      {url ? (
        <img src={url} alt="" className="h-full w-full rounded-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-[var(--accent)] font-extrabold text-[var(--on-accent,var(--bg))] [font-family:var(--font-display)]" style={{ fontSize: tamano * 0.34 }}>
          {iniciales || '·'}
        </span>
      )}
      {editable && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Cambiar foto"
            className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-1)] [touch-action:manipulation]"
          >
            <Camera size={15} aria-hidden="true" />
          </button>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f && onElegir) onElegir(f); e.target.value = ''; }} />
        </>
      )}
    </span>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [hijos, setHijos] = useState<Hijo[]>([]);
  const [titulo, setTitulo] = useState<Titulo | null>(null);
  const [nComprobantes, setNComprobantes] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState(false);
  const [intento, setIntento] = useState(0);
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  // Edición del perfil (nombre, rol, otra parte)
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<RolFamiliar | null>(null);
  const [otro, setOtro] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Alta de hijo
  const [agregando, setAgregando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [hijoEditando, setHijoEditando] = useState<string | null>(null);
  const [confirmandoHijo, setConfirmandoHijo] = useState<string | null>(null);
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setFallo(false);
    Promise.all([obtenerPerfil(), obtenerHijos(), obtenerPagos(), obtenerTitulo()])
      .then(([p, h, pagos, t]) => {
        if (!vigente) return;
        setPerfil(p); setHijos(h); setNComprobantes(pagos.length); setTitulo(t);
        setNombre(p.nombre); setRol(p.rolFamiliar); setOtro(p.otroProgenitorNombre);
        setCargando(false);
      })
      .catch(() => { if (vigente) { setFallo(true); setCargando(false); } });
    return () => { vigente = false; };
  }, [intento]);

  const avisar = (tipo: 'ok' | 'error', texto: string) => {
    setAviso({ tipo, texto });
    window.setTimeout(() => setAviso(null), 3500);
  };

  const guardarDatos = async () => {
    if (guardando || !perfil) return;
    setGuardando(true);
    try {
      await guardarPerfil({ nombre, rolFamiliar: rol, otroProgenitorNombre: otro });
      setPerfil({ ...perfil, nombre: nombre.trim(), rolFamiliar: rol, otroProgenitorNombre: otro.trim() });
      setEditando(false);
      avisar('ok', 'Perfil guardado. Inicio ya te saluda por tu nombre.');
    } catch {
      avisar('error', 'No pudimos guardar. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const cambiarAvatar = async (archivo: File) => {
    if (!perfil) return;
    const problema = validarFoto(archivo);
    if (problema) { avisar('error', problema); return; }
    try {
      const ruta = await guardarAvatar(archivo, perfil.avatarPath);
      setPerfil({ ...perfil, avatarPath: ruta });
      avisar('ok', 'Foto actualizada.');
    } catch {
      avisar('error', 'No pudimos subir la foto. Inténtalo de nuevo.');
    }
  };

  const borrarAvatar = async () => {
    if (!perfil?.avatarPath) return;
    try { await quitarAvatar(perfil.avatarPath); setPerfil({ ...perfil, avatarPath: null }); } catch { avisar('error', 'No pudimos quitar la foto.'); }
  };

  const fotoHijo = async (h: Hijo, archivo: File) => {
    const problema = validarFoto(archivo);
    if (problema) { avisar('error', problema); return; }
    try {
      const ruta = await guardarFotoHijo(h, archivo);
      setHijos((prev) => prev.map((x) => (x.id === h.id ? { ...x, avatarPath: ruta } : x)));
    } catch { avisar('error', 'No pudimos subir la foto.'); }
  };

  const guardarHijo = async (h: Hijo, nombreNuevo: string, fechaNueva: string) => {
    try {
      await actualizarHijo(h.id, { nombre: nombreNuevo, fechaNacimiento: fechaNueva || null });
      setHijos((prev) => prev.map((x) => (x.id === h.id ? { ...x, nombre: nombreNuevo.trim(), fechaNacimiento: fechaNueva || null } : x)));
      setHijoEditando(null);
    } catch { avisar('error', 'No pudimos guardar los cambios.'); }
  };

  const borrarHijo = async (h: Hijo) => {
    try {
      await eliminarHijo(h);
      setHijos((prev) => prev.filter((x) => x.id !== h.id));
      setConfirmandoHijo(null);
    } catch { avisar('error', 'No pudimos borrar. Inténtalo de nuevo.'); }
  };

  const cerrarSesion = async () => {
    if (saliendo) return;
    setSaliendo(true);
    await crearClienteSupabase().auth.signOut();
    router.push('/entrar');
  };

  const iniciales = perfil ? (perfil.nombre ? perfil.nombre.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase() : perfil.email.slice(0, 2).toUpperCase()) : '';
  const rolTexto = perfil?.rolFamiliar === 'papa' ? 'Papá' : perfil?.rolFamiliar === 'mama' ? 'Mamá' : 'Tu rol';
  const desde = perfil?.creadoEl ? new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric', timeZone: 'America/Bogota' }).format(new Date(perfil.creadoEl)) : '—';

  return (
    <>
      <CabeceraApp />
      <ContenedorApp sinTope>
        <TituloSeccion titulo="Perfil" subtitulo="Tu información, tu familia y tus ajustes." icon={UserRound} />

        {aviso && (
          <p role="status" className={`mt-3 rounded-[var(--radius-chip,14px)] px-3 py-2 text-[13px] font-semibold ${aviso.tipo === 'ok' ? 'bg-[var(--status-success-bg)] text-[var(--status-success)]' : 'bg-[var(--status-error-bg)] text-[var(--status-error)]'}`}>
            {aviso.texto}
          </p>
        )}

        {fallo ? (
          <div className="mt-4"><ErrorDeCarga onReintentar={() => setIntento((n) => n + 1)} /></div>
        ) : cargando || !perfil ? (
          <div className="mt-4"><TarjetaSkeleton filas={3} /></div>
        ) : (
          <>
            {/* ── TARJETA DE PERFIL (referencia): foto + nombre + rol + correo, "Editar perfil", 2 datos ── */}
            <Tarjeta className="mt-4">
              {!editando ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar ruta={perfil.avatarPath} iniciales={iniciales} tamano={64} editable onElegir={cambiarAvatar} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[17px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">
                        {perfil.nombre || 'Ponle tu nombre'}
                      </p>
                      <p className="text-[12px] text-[var(--text-secondary)]">{rolTexto} · Cuenta principal</p>
                      <p className="truncate text-[12px] text-[var(--text-secondary)]">{perfil.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => setEditando(true)} className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] px-4 text-[13px] font-bold text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]">
                      <Pencil size={14} aria-hidden="true" /> Editar perfil
                    </button>
                    {perfil.avatarPath && (
                      <button type="button" onClick={borrarAvatar} className="h-9 px-2 text-[12px] text-[var(--text-secondary)] underline-offset-2 hover:underline [touch-action:manipulation]">Quitar foto</button>
                    )}
                  </div>
                </>
              ) : (
                <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); guardarDatos(); }}>
                  <label className="block">
                    <span className="text-[12px] font-bold text-[var(--text-secondary)]">Tu nombre</span>
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={60} autoFocus placeholder="Como quieres que te saludemos" className="mt-1 h-12 w-full rounded-[var(--radius-chip,14px)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-[15px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]" />
                  </label>
                  <div>
                    <span className="text-[12px] font-bold text-[var(--text-secondary)]">Tu rol</span>
                    <div role="radiogroup" className="mt-1 grid grid-cols-2 gap-2">
                      {([['papa', 'Papá'], ['mama', 'Mamá']] as [RolFamiliar, string][]).map(([v, l]) => (
                        <button key={v} type="button" role="radio" aria-checked={rol === v} onClick={() => setRol(v)} className={`h-11 rounded-[var(--radius-button)] text-[14px] font-bold transition-colors [touch-action:manipulation] ${rol === v ? 'bg-[var(--accent)] text-[var(--on-accent,var(--bg))]' : 'bg-[var(--surface-2)] text-[var(--accent-ink,var(--accent))]'}`}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <label className="block">
                    <span className="text-[12px] font-bold text-[var(--text-secondary)]">Nombre de la otra parte (mamá o papá de tus hijos)</span>
                    <input value={otro} onChange={(e) => setOtro(e.target.value)} maxLength={60} placeholder="Opcional — solo para nombrarla en tu expediente" className="mt-1 h-12 w-full rounded-[var(--radius-chip,14px)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-[15px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]" />
                    <span className="mt-1 block text-[11.5px] text-[var(--text-secondary)]">No se le avisa ni se conecta con nadie: tu expediente sigue siendo solo tuyo.</span>
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setEditando(false); setNombre(perfil.nombre); setRol(perfil.rolFamiliar); setOtro(perfil.otroProgenitorNombre); }} className="h-11 flex-1 rounded-[var(--radius-button)] bg-[var(--surface-2)] text-[14px] font-bold text-[var(--text-secondary)] [touch-action:manipulation]">Cancelar</button>
                    <motion.button type="submit" disabled={guardando} whileTap={{ scale: 0.97 }} className="h-11 flex-1 rounded-[var(--radius-button)] bg-[var(--accent)] text-[14px] font-bold text-[var(--on-accent,var(--bg))] disabled:opacity-60 [touch-action:manipulation]">
                      {guardando ? 'Guardando…' : 'Guardar'}
                    </motion.button>
                  </div>
                </form>
              )}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-[var(--radius-chip,14px)] bg-[var(--surface-2)] px-3 py-2.5">
                  <p className="text-[16px] font-extrabold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{hijos.length}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{hijos.length === 1 ? 'hijo en tu expediente' : 'hijos en tu expediente'}</p>
                </div>
                <div className="rounded-[var(--radius-chip,14px)] bg-[var(--surface-2)] px-3 py-2.5">
                  <p className="text-[16px] font-extrabold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{nComprobantes ?? '—'}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">comprobantes con Sello</p>
                </div>
              </div>
            </Tarjeta>

            {/* ── MI FAMILIA (referencia): hijos con foto, nombre y edad; alta en línea ── */}
            <div className="mt-6 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">Mi familia</h2>
              {!agregando && hijos.length < 8 && (
                <button type="button" onClick={() => setAgregando(true)} className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]">
                  <Plus size={14} aria-hidden="true" /> Agregar hijo
                </button>
              )}
            </div>
            <Tarjeta indice={1} className="mt-3">
              {hijos.length === 0 && !agregando ? (
                <button type="button" onClick={() => setAgregando(true)} className="flex w-full flex-col items-center py-4 text-center [touch-action:manipulation]">
                  <IconoCirculo icon={Baby} size={22} tono="info" grande />
                  <p className="mt-3 text-[14px] font-bold text-[var(--text-primary)]">Agrega a tus hijos</p>
                  <p className="mt-1 max-w-[30ch] text-[13px] text-[var(--text-secondary)]">Con su nombre, la app y tu expediente hablan de ellos, no de "el menor".</p>
                </button>
              ) : (
                <ul className="flex flex-col">
                  {hijos.map((h, i) => (
                    <li key={h.id} className={`py-2.5 ${i > 0 ? 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]' : ''}`}>
                      {hijoEditando === h.id ? (
                        <FormHijo inicialNombre={h.nombre} inicialFecha={h.fechaNacimiento ?? ''} onCancelar={() => setHijoEditando(null)} onGuardar={(n, f) => guardarHijo(h, n, f)} />
                      ) : (
                        <div className="flex items-center gap-3">
                          <Avatar ruta={h.avatarPath} iniciales={h.nombre.slice(0, 1).toUpperCase()} tamano={44} editable onElegir={(f) => fotoHijo(h, f)} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[14px] font-bold text-[var(--text-primary)]">{h.nombre}</p>
                            <p className="text-[12px] text-[var(--text-secondary)]">{edadTexto(h.fechaNacimiento) || 'Sin fecha de nacimiento'}</p>
                          </div>
                          {confirmandoHijo === h.id ? (
                            <div className="flex items-center gap-1">
                              <button type="button" onClick={() => borrarHijo(h)} aria-label={`Sí, quitar a ${h.nombre}`} className="flex size-9 items-center justify-center rounded-full bg-[var(--status-error-bg)] text-[var(--status-error)] [touch-action:manipulation]"><Check size={16} aria-hidden="true" /></button>
                              <button type="button" onClick={() => setConfirmandoHijo(null)} aria-label="No quitar" className="flex size-9 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)] [touch-action:manipulation]"><X size={16} aria-hidden="true" /></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button type="button" onClick={() => setHijoEditando(h.id)} aria-label={`Editar a ${h.nombre}`} className="flex size-9 items-center justify-center rounded-full text-[var(--accent-ink,var(--accent))] [touch-action:manipulation]"><Pencil size={15} aria-hidden="true" /></button>
                              <button type="button" onClick={() => setConfirmandoHijo(h.id)} aria-label={`Quitar a ${h.nombre}`} className="flex size-9 items-center justify-center rounded-full text-[var(--text-tertiary)] [touch-action:manipulation]"><Trash2 size={15} aria-hidden="true" /></button>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                  {agregando && (
                    <li className={hijos.length > 0 ? 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] pt-3' : ''}>
                      <FormHijo inicialNombre={nuevoNombre} inicialFecha={nuevaFecha} onCancelar={() => { setAgregando(false); setNuevoNombre(''); setNuevaFecha(''); }} onGuardar={(n, f) => { setNuevoNombre(n); setNuevaFecha(f); return crearHijoCon(n, f); }} />
                    </li>
                  )}
                </ul>
              )}
              {perfil.otroProgenitorNombre && (
                <p className="mt-3 flex items-center gap-2 border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] pt-3 text-[12px] text-[var(--text-secondary)]">
                  <Users size={14} className="shrink-0 text-[var(--accent-ink,var(--accent))]" aria-hidden="true" />
                  La otra parte: <strong className="text-[var(--text-primary)]">{perfil.otroProgenitorNombre}</strong>
                </p>
              )}
            </Tarjeta>

            {/* ── AJUSTES Y CUENTA (referencia) ── */}
            <h2 className="mt-6 text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">Ajustes y cuenta</h2>
            <Tarjeta indice={2} className="mt-3 py-1">
              <FilaAjuste icon={Settings} titulo="Cuota alimentaria y cuenta" detalle={titulo ? `${formatoCOP(titulo.montoMensual)} · día ${titulo.diaPago} · cambiar o eliminar cuenta` : 'Define tu cuota mensual'} href="/ajustes" />
              <FilaAjuste icon={CreditCard} titulo="Suscripción y pagos" detalle="Se administra en Hotmart: cancelar, cambiar de plan, facturas" href="https://sac.hotmart.com/" externo />
              <FilaAjuste icon={Scale} tono="info" titulo="Asistencia jurídica" detalle="Escríbenos tu duda o contacta a un abogado" href="/asistencia" />
              <FilaAjuste icon={LifeBuoy} tono="exito" titulo="Ayuda y soporte" detalle="soporte@coparentia.co · respondemos en menos de 48 h" href="mailto:soporte@coparentia.co" externo />
              <FilaAjuste icon={ShieldCheck} titulo="Privacidad" detalle="Qué guardamos, dónde y cómo borrarlo" href="/privacidad" />
              <FilaAjuste icon={FileText} titulo="Términos y condiciones" detalle="Condiciones de uso y reembolsos" href="/terminos" ultima />
            </Tarjeta>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Tarjeta indice={3} className="flex flex-col gap-2 p-3">
                <IconoCirculo icon={CalendarCheck} size={18} />
                <div><p className="text-[11px] text-[var(--text-secondary)]">Miembro desde</p><p className="text-[13px] font-extrabold capitalize leading-tight text-[var(--text-primary)]">{desde}</p></div>
              </Tarjeta>
              <Tarjeta indice={4} className="flex flex-col gap-2 p-3">
                <IconoCirculo icon={Crown} size={18} tono="pendiente" />
                <div><p className="text-[11px] text-[var(--text-secondary)]">Plan actual</p><p className="text-[13px] font-extrabold leading-tight text-[var(--text-primary)]">Suscripción activa</p></div>
              </Tarjeta>
            </div>

            <div className="mt-3"><Pildora texto="Sello de Confianza activo" tono="exito" /></div>

            <button
              type="button"
              onClick={cerrarSesion}
              disabled={saliendo}
              className="mt-4 flex w-full items-center gap-3 rounded-[var(--radius-card)] bg-[var(--status-error-bg,color-mix(in_oklab,var(--status-error)_12%,transparent))] px-4 py-3.5 text-left transition-opacity disabled:opacity-60 [touch-action:manipulation]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-chip,999px)] bg-[var(--surface)] text-[var(--status-error)]"><LogOut size={18} aria-hidden="true" /></span>
              <span className="flex-1 text-[14px] font-bold text-[var(--status-error)]">{saliendo ? 'Saliendo…' : 'Cerrar sesión'}</span>
              <ChevronRight size={18} className="text-[var(--status-error)]" aria-hidden="true" />
            </button>
          </>
        )}
      </ContenedorApp>
    </>
  );

  // Alta con los valores del formulario (evita depender del estado asíncrono)
  async function crearHijoCon(n: string, f: string) {
    if (!n.trim()) return;
    try {
      const h = await agregarHijo(n, f || null);
      setHijos((prev) => [...prev, h]);
      setNuevoNombre(''); setNuevaFecha(''); setAgregando(false);
      avisar('ok', `${nombreCorto(h.nombre)} ya está en tu familia.`);
    } catch (e) {
      avisar('error', e instanceof Error && e.message.includes('Máximo') ? 'Máximo 8 hijos por cuenta.' : 'No pudimos guardar. Inténtalo de nuevo.');
    }
  }
}

/* ── <FormHijo> — nombre + fecha de nacimiento, para alta y edición ── */
function FormHijo({ inicialNombre, inicialFecha, onCancelar, onGuardar }: { inicialNombre: string; inicialFecha: string; onCancelar: () => void; onGuardar: (nombre: string, fecha: string) => void | Promise<void> }) {
  const [n, setN] = useState(inicialNombre);
  const [f, setF] = useState(inicialFecha);
  const hoy = new Date().toISOString().slice(0, 10);
  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); if (n.trim()) onGuardar(n, f); }}>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input value={n} onChange={(e) => setN(e.target.value)} maxLength={60} autoFocus placeholder="Nombre" aria-label="Nombre del hijo o hija" className="h-11 w-full rounded-[var(--radius-chip,14px)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]" />
        <input type="date" value={f} max={hoy} onChange={(e) => setF(e.target.value)} aria-label="Fecha de nacimiento" className="h-11 w-[150px] rounded-[var(--radius-chip,14px)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-3 text-[13px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]" />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancelar} className="h-10 flex-1 rounded-[var(--radius-button)] bg-[var(--surface-2)] text-[13px] font-bold text-[var(--text-secondary)] [touch-action:manipulation]">Cancelar</button>
        <button type="submit" disabled={!n.trim()} className="h-10 flex-1 rounded-[var(--radius-button)] bg-[var(--accent)] text-[13px] font-bold text-[var(--on-accent,var(--bg))] disabled:opacity-50 [touch-action:manipulation]">Guardar</button>
      </div>
    </form>
  );
}
