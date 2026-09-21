'use client';

// PAGOS — registro de pagos y gastos extraordinarios (MVP #2 de ESTADO.md §11). Filtros por
// tipo (regla 14 del SO: listas >8-10 ítems necesitan filtro; aquí se agrega desde ya porque
// la lista crece rápido con el uso real). Subir comprobante = 1 acción primaria de la sección.

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, ShieldCheck, FileCheck2, X, ChevronRight, Sparkles, CalendarDays, CreditCard, BarChart3, ReceiptText, Wallet, Users } from 'lucide-react';
import { ContenedorApp, Tarjeta, IconoCirculo, BotonFlotante, ErrorDeCarga, CabeceraApp, Pildora, TituloSeccion } from '@/components/app/ui';
import { VisorImagen } from '@/components/app/VisorImagen';
import { Portal } from '@/components/app/Portal';
import { SelloConfianza } from '@/components/app/SelloConfianza';
import { VistaPreviaArchivo } from '@/components/app/VistaPreviaArchivo';
import { SelectorHijo, useHijos, inicialHijo, type ValorHijo } from '@/components/app/SelectorHijo';
import { type Hijo } from '@/lib/perfil';
import {
  type Pago,
  type Titulo,
  type TipoMovimiento,
  obtenerPagos,
  agregarPago,
  eliminarPago,
  obtenerTitulo,
  obtenerUrlArchivo,
  formatoCOP,
  formatoFechaLarga,
  validarArchivoAdjunto,
} from '@/lib/datos';
import { hoyEnColombia, mesEnColombia, diaDelMesEnColombia, anioEnColombia } from '@/lib/fecha';
import { leerMontoDeRecibo } from '@/lib/ocr-recibo';
import { comprimirParaLectura } from '@/lib/comprimir-imagen';

type Filtro = 'todos' | TipoMovimiento;
// Filtro por hijo dentro de la lista: 'todos' · id de un hijo · 'sin' (registros sin hijo asignado).
type FiltroHijo = 'todos' | 'sin' | string;

export default function Pagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [titulo, setTitulo] = useState<Titulo | null>(null);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  // Hijos del perfil: con 2 o más, los gastos se agrupan y filtran por cada uno (pedido del
  // usuario 2026-09-18: "que las cuentas puedan quedar claras").
  const { hijos } = useHijos();
  const [filtroHijo, setFiltroHijo] = useState<FiltroHijo>('todos');
  const variosHijos = hijos.length >= 2;
  const parametros = useSearchParams();
  // Se abre solo cuando se llega desde el boton de Inicio, para no cobrar dos toques por una
  // sola intencion.
  const [modalAbierto, setModalAbierto] = useState(parametros.get('registrar') === '1');
  const [abriendo, setAbriendo] = useState<string | null>(null);
  const [urlVisor, setUrlVisor] = useState<string | null>(null);
  const [selloDe, setSelloDe] = useState<string | null>(null);
  const [falloCarga, setFalloCarga] = useState(false);
  const [intento, setIntento] = useState(0);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState<string | null>(null);
  const [borrando, setBorrando] = useState<string | null>(null);
  // El error vive en la FILA afectada, no al final de la lista: puesto al final quedaba fuera de
  // pantalla y la persona no se enteraba de que su accion habia fallado.
  const [errorFila, setErrorFila] = useState<{ id: string; mensaje: string } | null>(null);

  const borrarPago = async (p: Pago): Promise<void> => {
    if (borrando) return;
    setBorrando(p.id);
    setErrorFila(null);
    try {
      await eliminarPago(p);
      // Se quita de la lista SOLO después de que el borrado real terminó bien: adelantarse
      // mostraría como eliminado algo que sigue en el expediente.
      setPagos((prev) => prev.filter((x) => x.id !== p.id));
      setConfirmandoBorrado(null);
    } catch {
      setErrorFila({ id: p.id, mensaje: 'No pudimos borrar el registro. Revisa tu conexión e inténtalo de nuevo.' });
    } finally {
      setBorrando(null);
    }
  };

  // Un fallo de red mostraba la lista VACIA, indistinguible de "no tienes comprobantes".
  useEffect(() => {
    let vigente = true;
    setFalloCarga(false);
    Promise.all([obtenerPagos(), obtenerTitulo()])
      .then(([r, t]) => { if (vigente) { setPagos(r); setTitulo(t); } })
      .catch(() => { if (vigente) setFalloCarga(true); });
    return () => { vigente = false; };
  }, [intento]);

  // Abre el archivo REAL del comprobante (URL firmada, temporal — el bucket es privado). Las
  // fotos se ven en el visor propio de la app (encaja a pantalla + pellizco para acercar — antes
  // se abrían crudas en una pestaña nueva y no siempre ajustaban al tamaño de la pantalla,
  // hallazgo real del usuario); un PDF sigue abriendo en una pestaña nueva, el navegador ya trae
  // su propio visor con zoom.
  const verComprobante = async (p: Pago): Promise<void> => {
    if (!p.comprobantePath || abriendo) return;
    setAbriendo(p.id);
    const url = await obtenerUrlArchivo(p.comprobantePath);
    setAbriendo(null);
    // Antes era `if (!url) return`: la persona tocaba su comprobante, no pasaba NADA y no sabia
    // si el archivo se habia perdido o si la app estaba rota. El silencio es el peor error.
    if (!url) {
      setErrorFila({ id: p.id, mensaje: 'No pudimos abrir este comprobante. Revisa tu conexión e inténtalo de nuevo.' });
      return;
    }
    setErrorFila(null);
    if (p.comprobanteNombre.toLowerCase().endsWith('.pdf')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setUrlVisor(url);
    }
  };

  const visibles = pagos
    .filter((p) => filtro === 'todos' || p.tipo === filtro)
    .filter((p) => filtroHijo === 'todos' || (filtroHijo === 'sin' ? !p.hijoId : p.hijoId === filtroHijo))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Cuentas por hijo (solo gastos extra: la cuota alimentaria es de todos). Año en curso.
  const anioEnCurso = String(anioEnColombia());
  const extrasDelAnio = pagos.filter((p) => p.tipo === 'gasto_extra' && p.fecha.startsWith(anioEnCurso));
  const porHijo = hijos.map((h) => {
    const suyos = extrasDelAnio.filter((p) => p.hijoId === h.id);
    return { hijo: h, cantidad: suyos.length, total: suyos.reduce((acc, p) => acc + p.monto, 0) };
  });
  const sinAsignar = extrasDelAnio.filter((p) => !p.hijoId);
  const totalSinAsignar = sinAsignar.reduce((acc, p) => acc + p.monto, 0);
  const verGastosDe = (v: FiltroHijo): void => {
    setFiltro('gasto_extra');
    setFiltroHijo(v);
  };

  const totalVisible = visibles.reduce((acc, p) => acc + p.monto, 0);

  // ── Datos del resumen (composición de la referencia del usuario, Ref 4) ──
  const mesActual = mesEnColombia();
  const cuotaDelMes = pagos.find((p) => p.tipo === 'cuota' && p.fecha.slice(0, 7) === mesActual);
  const diaHoy = diaDelMesEnColombia();
  const vencida = titulo ? !cuotaDelMes && diaHoy > titulo.diaPago : false;
  const estadoCuota: { texto: string; tono: 'exito' | 'pendiente' | 'alerta' } = cuotaDelMes
    ? { texto: 'Registrada', tono: 'exito' }
    : vencida
      ? { texto: 'Sin registrar', tono: 'alerta' }
      : { texto: 'Por registrar', tono: 'pendiente' };
  const extrasDelMes = pagos.filter((p) => p.tipo !== 'cuota' && p.fecha.slice(0, 7) === mesActual);
  const totalExtrasMes = extrasDelMes.reduce((acc, p) => acc + p.monto, 0);
  const anioActual = String(anioEnColombia());
  const cuotasDelAnio = pagos.filter((p) => p.tipo === 'cuota' && p.fecha.startsWith(anioActual)).length;
  const nombreMesRaw = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric', timeZone: 'America/Bogota' }).format(new Date());
  // Próximo vencimiento: el día de pago de este mes si no ha pasado; si ya pasó, el del mes siguiente.
  const proximoVencimiento = (() => {
    if (!titulo) return null;
    const [y, m] = mesActual.split('-').map(Number);
    const enEsteMes = diaHoy <= titulo.diaPago;
    const fecha = new Date(Date.UTC(enEsteMes ? y : m === 12 ? y + 1 : y, enEsteMes ? m - 1 : m % 12, titulo.diaPago));
    return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(fecha);
  })();

  return (
    <>
      <CabeceraApp aviso={vencida} />
      <ContenedorApp conFab sinTope>
        <TituloSeccion titulo="Pagos y cuota alimentaria" subtitulo="Controla tu cuota, los gastos extra y sus comprobantes." icon={Wallet} />

        {falloCarga ? (
          <ErrorDeCarga onReintentar={() => setIntento((n) => n + 1)} />
        ) : (
          <>
            {/* RESUMEN — la tarjeta ancha de la referencia: cuota del mes con estado | próximo vencimiento */}
            <Tarjeta className="mt-4 flex flex-col gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <IconoCirculo icon={CreditCard} size={22} tono={estadoCuota.tono === 'exito' ? 'exito' : estadoCuota.tono === 'alerta' ? 'pendiente' : 'accent'} grande />
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Cuota de {nombreMesRaw}</p>
                  <div className="mt-1"><Pildora texto={estadoCuota.texto} tono={estadoCuota.tono} /></div>
                  <p className="mt-1.5 text-[18px] font-extrabold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                    {titulo ? formatoCOP(cuotaDelMes?.monto ?? titulo.montoMensual) : '—'}
                  </p>
                  <p className="text-[11.5px] text-[var(--text-secondary)]">
                    {cuotaDelMes ? `Registrada el ${formatoFechaLarga(cuotaDelMes.fecha)}` : titulo ? `Vence el día ${titulo.diaPago}` : 'Define tu cuota en Ajustes'}
                  </p>
                </div>
              </div>
              {proximoVencimiento && (
                <div className="flex items-center gap-2 border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] pt-3">
                  <IconoCirculo icon={CalendarDays} size={16} />
                  <div className="min-w-0">
                    <p className="text-[11px] text-[var(--text-secondary)]">Próximo vencimiento</p>
                    <p className="text-[13px] font-bold text-[var(--text-primary)]">{proximoVencimiento}</p>
                  </div>
                  <ChevronRight size={16} className="ml-auto shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
                </div>
              )}
            </Tarjeta>

            {/* DOS CIFRAS — saldo pendiente y gastos extra del mes */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Tarjeta indice={1}>
                <IconoCirculo icon={BarChart3} tono={vencida ? 'pendiente' : 'exito'} />
                <div className="mt-3 min-w-0">
                  <p className="text-[12px] font-bold text-[var(--text-primary)]">Saldo pendiente</p>
                  <p className="mt-1 text-[17px] font-extrabold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                    {vencida && titulo ? formatoCOP(titulo.montoMensual) : formatoCOP(0)}
                  </p>
                  <p className="text-[11.5px] text-[var(--text-secondary)]">{vencida ? 'Cuota del mes sin comprobante' : 'Sin pagos vencidos'}</p>
                </div>
              </Tarjeta>
              <Tarjeta indice={2}>
                <IconoCirculo icon={ReceiptText} tono="info" />
                <div className="mt-3 min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-[var(--text-primary)]">Gastos extra</p>
                  <p className="mt-1 text-[17px] font-extrabold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{formatoCOP(totalExtrasMes)}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]">
                    <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.min(100, extrasDelMes.length * 25)}%` }} />
                  </div>
                  <p className="mt-1 text-[11.5px] text-[var(--text-secondary)]">{extrasDelMes.length} este mes</p>
                </div>
              </Tarjeta>
            </div>

            {/* GASTOS POR HIJO — con 2 o más hijos, cada uno con su cuenta del año (pedido del usuario).
                Tocar una fila filtra la lista de abajo a los gastos de ese hijo. */}
            {variosHijos && (
              <Tarjeta indice={3} className="mt-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">Gastos extra por hijo</h2>
                  <p className="text-[12px] text-[var(--text-secondary)]">{anioEnCurso}</p>
                </div>
                <ul className="mt-1 flex flex-col">
                  {porHijo.map(({ hijo, cantidad, total }, i) => (
                    <li key={hijo.id} className={i > 0 ? 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]' : ''}>
                      <button type="button" onClick={() => verGastosDe(hijo.id)} className="flex w-full items-center gap-3 py-2.5 text-left [touch-action:manipulation]">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[13px] font-bold text-[var(--accent-ink,var(--accent))]">{inicialHijo(hijo.nombre)}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-bold text-[var(--text-primary)]">{hijo.nombre}</p>
                          <p className="text-[11.5px] text-[var(--text-secondary)]">{cantidad === 0 ? 'Sin gastos este año' : cantidad === 1 ? '1 gasto extra' : `${cantidad} gastos extra`}</p>
                        </div>
                        <p className="shrink-0 text-[13.5px] font-extrabold tabular-nums text-[var(--text-primary)]">{formatoCOP(total)}</p>
                        <ChevronRight size={16} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                  {sinAsignar.length > 0 && (
                    <li className="border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]">
                      <button type="button" onClick={() => verGastosDe('sin')} className="flex w-full items-center gap-3 py-2.5 text-left [touch-action:manipulation]">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)]"><Users size={16} aria-hidden="true" /></span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-bold text-[var(--text-primary)]">Sin hijo asignado</p>
                          <p className="text-[11.5px] text-[var(--text-secondary)]">{sinAsignar.length === 1 ? '1 gasto extra' : `${sinAsignar.length} gastos extra`} · comunes o anteriores</p>
                        </div>
                        <p className="shrink-0 text-[13.5px] font-extrabold tabular-nums text-[var(--text-primary)]">{formatoCOP(totalSinAsignar)}</p>
                        <ChevronRight size={16} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
                      </button>
                    </li>
                  )}
                </ul>
              </Tarjeta>
            )}

            {/* SEGMENTOS (referencia: Cuotas · Gastos · Historial) */}
            <div role="tablist" aria-label="Filtrar registros" className="mt-4 grid grid-cols-3 gap-1 rounded-[var(--radius-button)] bg-[var(--surface-2)] p-1">
              {([
                { valor: 'cuota' as const, label: 'Cuotas' },
                { valor: 'gasto_extra' as const, label: 'Gastos' },
                { valor: 'todos' as const, label: 'Historial' },
              ]).map(({ valor, label }) => (
                <button
                  key={valor}
                  type="button"
                  role="tab"
                  aria-selected={filtro === valor}
                  onClick={() => { setFiltro(valor); setFiltroHijo('todos'); }}
                  className={`h-9 rounded-[var(--radius-button)] text-[13px] font-bold transition-colors duration-150 [touch-action:manipulation] ${
                    filtro === valor ? 'bg-[var(--accent)] text-[var(--on-accent,var(--bg))] shadow-[var(--shadow-1)]' : 'text-[var(--accent-ink,var(--accent))]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* FILTRO POR HIJO (regla 14 del SO: el filtro activo se ve resaltado) */}
            {variosHijos && filtro !== 'cuota' && (
              <div role="tablist" aria-label="Filtrar por hijo" className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {([{ v: 'todos' as FiltroHijo, l: 'Todos' }, ...hijos.map((h) => ({ v: h.id as FiltroHijo, l: h.nombre })), { v: 'sin' as FiltroHijo, l: 'Sin asignar' }]).map(({ v, l }) => (
                  <button
                    key={v}
                    type="button"
                    role="tab"
                    aria-selected={filtroHijo === v}
                    onClick={() => setFiltroHijo(v)}
                    className={`h-9 shrink-0 rounded-[var(--radius-chip,999px)] border px-3 text-[12.5px] font-semibold transition-colors duration-150 [touch-action:manipulation] ${
                      filtroHijo === v ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent-ink,var(--accent))]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}

            {/* LISTA — dentro de una tarjeta, filas con chip, mes/fecha, monto y estado */}
            <Tarjeta indice={4} className="mt-3">
              <div className="flex items-center justify-between">
                <h2 className="truncate text-[15px] font-extrabold text-[var(--text-primary)] [font-family:var(--font-display)]">
                  {filtro === 'cuota' ? 'Detalle de cuotas' : filtro === 'gasto_extra' ? 'Gastos extra' : 'Historial'}
                  {filtroHijo !== 'todos' && (
                    <span className="font-semibold text-[var(--accent-ink,var(--accent))]"> · {filtroHijo === 'sin' ? 'sin asignar' : hijos.find((h) => h.id === filtroHijo)?.nombre}</span>
                  )}
                </h2>
                <p className="text-[12px] text-[var(--text-secondary)]">{visibles.length} · {formatoCOP(totalVisible)}</p>
              </div>
              {visibles.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <IconoCirculo icon={filtro === 'gasto_extra' ? FileCheck2 : ShieldCheck} size={22} />
                  <p className="mt-3 text-[14px] font-bold text-[var(--text-primary)]">
                    {filtroHijo !== 'todos' ? 'Nada registrado con este filtro' : filtro === 'todos' ? 'Todavía no hay comprobantes' : filtro === 'cuota' ? 'Ninguna cuota registrada aún' : 'Ningún gasto extra aún'}
                  </p>
                  <p className="mt-1 max-w-[30ch] text-[13px] text-[var(--text-secondary)]">
                    Toca "Registrar", sube la foto del comprobante y queda fechado con el Sello de Confianza.
                  </p>
                </div>
              ) : (
                <ul className="mt-1 flex flex-col">
                  {visibles.map((p, i) => {
                    const esCuota = p.tipo === 'cuota';
                    const contenido = (
                      <>
                        <IconoCirculo icon={esCuota ? CalendarDays : ReceiptText} size={18} tono={esCuota ? 'accent' : 'info'} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-bold text-[var(--text-primary)]">{p.concepto}</p>
                          <p className="truncate text-[11.5px] text-[var(--text-secondary)]">
                            {p.hijoNombre && <span className="font-semibold text-[var(--accent-ink,var(--accent))]">{p.hijoNombre} · </span>}
                            Registrado el {formatoFechaLarga(p.fecha)}
                          </p>
                        </div>
                        <p className="shrink-0 text-[13.5px] font-extrabold tabular-nums text-[var(--text-primary)]">{formatoCOP(p.monto)}</p>
                        <Pildora texto={esCuota ? 'Sello' : 'Extra'} tono={esCuota ? 'exito' : 'neutro'} />
                        {p.comprobantePath && <ChevronRight size={16} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />}
                      </>
                    );
                    return (
                      <li key={p.id} className={`flex flex-col gap-1.5 py-2.5 ${i > 0 ? 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]' : ''}`}>
                        {p.comprobantePath ? (
                          <button type="button" onClick={() => verComprobante(p)} disabled={abriendo === p.id} className="flex w-full items-center gap-2.5 text-left [touch-action:manipulation]">
                            {contenido}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2.5">{contenido}</div>
                        )}
                        {confirmandoBorrado === p.id ? (
                          <div className="flex items-center gap-2 pt-1">
                            <p className="flex-1 text-[12.5px] text-[var(--text-secondary)]">¿Borrar este registro y su comprobante?</p>
                            <button type="button" onClick={() => setConfirmandoBorrado(null)} disabled={borrando === p.id} className="h-9 rounded-[var(--radius-button)] px-3 text-[12.5px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]">No</button>
                            <button type="button" onClick={() => borrarPago(p)} disabled={borrando === p.id} className="h-9 rounded-[var(--radius-button)] bg-[var(--status-error)] px-3 text-[12.5px] font-semibold text-white transition-opacity disabled:opacity-60 [touch-action:manipulation]">
                              {borrando === p.id ? 'Borrando…' : 'Sí, borrar'}
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => setConfirmandoBorrado(p.id)} aria-label={`Borrar ${p.concepto}`} className="self-end py-1 text-[11.5px] text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]">Borrar</button>
                        )}
                        {errorFila?.id === p.id && (
                          <p role="alert" className="text-[12.5px] leading-[1.5] text-[var(--status-error)]">{errorFila.mensaje}</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Tarjeta>

            {/* CIFRAS DE CIERRE — pagos este año y comprobantes con Sello */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Tarjeta indice={5} className="flex items-center gap-3">
                <IconoCirculo icon={BarChart3} />
                <div><p className="text-[11.5px] text-[var(--text-secondary)]">Cuotas este año</p><p className="text-[17px] font-extrabold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{cuotasDelAnio}</p></div>
              </Tarjeta>
              <Tarjeta indice={6} className="flex items-center gap-3">
                <IconoCirculo icon={ShieldCheck} tono="exito" />
                <div><p className="text-[11.5px] text-[var(--text-secondary)]">Con Sello</p><p className="text-[17px] font-extrabold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{pagos.length}</p></div>
              </Tarjeta>
            </div>
          </>
        )}

      <BotonFlotante onClick={() => setModalAbierto(true)}>
        <Upload size={18} aria-hidden="true" />
        Registrar
      </BotonFlotante>

      <Portal>
      <AnimatePresence>
        {modalAbierto && (
          <ModalRegistro
            hijos={hijos}
            onCerrar={() => setModalAbierto(false)}
            onGuardado={(nuevo) => {
              setPagos((prev) => [nuevo, ...prev]);
              setModalAbierto(false);
              // El comprobante queda guardado ANTES de mostrar el sello: la celebración refleja
              // algo que ya pasó de verdad, nunca la promesa de algo que todavía puede fallar.
              setSelloDe(nuevo.fecha);
            }}
          />
        )}
      </AnimatePresence>
      </Portal>

      <Portal>
      <AnimatePresence>
        {selloDe && <SelloConfianza fecha={formatoFechaLarga(selloDe)} onTerminar={() => setSelloDe(null)} />}
      </AnimatePresence>
      </Portal>

      <Portal>
        <VisorImagen url={urlVisor} onCerrar={() => setUrlVisor(null)} />
      </Portal>
      </ContenedorApp>
    </>
  );
}

function ModalRegistro({ hijos, onCerrar, onGuardado }: { hijos: Hijo[]; onCerrar: () => void; onGuardado: (p: Pago) => void }) {
  const [tipo, setTipo] = useState<TipoMovimiento>('cuota');
  // Con un solo hijo, un gasto extra se le asigna solo (cero toques); la cuota es de todos.
  // Mientras la persona no toque el selector, el valor se DERIVA del tipo (sin efectos).
  const [hijoElegido, setHijoElegido] = useState<ValorHijo | undefined>(undefined);
  const hijoId: ValorHijo = hijoElegido !== undefined ? hijoElegido : tipo === 'gasto_extra' && hijos.length === 1 ? hijos[0].id : null;
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [leyendoRecibo, setLeyendoRecibo] = useState(false);
  const [montoDetectado, setMontoDetectado] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Con .catch: si falla, el campo queda vacio para escribir a mano en vez de dejar un rechazo
    // sin manejar en la consola.
    obtenerTitulo()
      .then((t: Titulo | null) => {
        if (t) setMonto(String(t.montoMensual));
      })
      .catch(() => {});
  }, []);

  // Lector automático de recibos: al elegir la foto, se le pide a la IA que lea el monto y se
  // pre-llena el campo — el usuario SIEMPRE ve el número y puede corregirlo antes de guardar
  // (nunca se confía a ciegas en la lectura). Solo funciona con fotos, no con PDF.
  const elegirArchivo = async (f: File): Promise<void> => {
    const error = validarArchivoAdjunto(f);
    if (error) {
      setErrorArchivo(error);
      return;
    }
    setErrorArchivo(null);
    setArchivo(f);
    setMontoDetectado(false);
    if (!f.type.startsWith('image/')) return;
    setLeyendoRecibo(true);
    // Se manda una copia comprimida SOLO para la lectura — el archivo real que se guarda en el
    // expediente (arriba, `setArchivo(f)`) sigue siendo la foto original sin tocar.
    // Tope de 20s en el cliente: si la red va lenta y nada responde, se libera el campo para
    // escribir a mano en vez de dejar a la persona mirando "Leyendo el recibo…" para siempre.
    const resultado = await Promise.race([
      comprimirParaLectura(f).then(leerMontoDeRecibo),
      new Promise<{ monto: null; confianza: null }>((resolve) => setTimeout(() => resolve({ monto: null, confianza: null }), 20_000)),
    ]);
    setLeyendoRecibo(false);
    if (resultado.monto && resultado.confianza !== 'baja') {
      setMonto(String(Math.round(resultado.monto)));
      setMontoDetectado(true);
    }
  };

  // Qué falta para poder guardar, dicho en palabras. Se calcula solo al INTENTAR guardar (no
  // mientras se escribe): regañar antes de que la persona termine de llenar es hostil.
  const [faltante, setFaltante] = useState<string | null>(null);

  const guardar = (): void => {
    if (procesando) return;
    if (!concepto.trim()) {
      setFaltante('Falta el concepto: escribe de qué es este pago.');
      return;
    }
    if (!monto) {
      setFaltante('Falta el monto.');
      return;
    }
    if (!archivo) {
      setFaltante('Falta el comprobante: adjunta la foto o el PDF.');
      return;
    }
    setFaltante(null);
    setProcesando(true);
    agregarPago(
      {
        fecha: hoyEnColombia(),
        monto: Number(monto),
        concepto: concepto.trim(),
        tipo,
        comprobanteNombre: archivo.name,
        hijoId: hijoId ?? undefined,
      },
      archivo
    )
      .then((nuevo) => {
        setProcesando(false);
        onGuardado(nuevo);
      })
      // El MISMO bug que ya se había corregido en primeros pasos seguía vivo aquí, que es la
      // puerta principal de registro: sin `.catch`, un fallo al subir dejaba el botón en
      // "Aplicando el Sello de Confianza…" para siempre, sin un solo mensaje. La persona no sabía
      // si su comprobante quedó guardado o no — la peor duda posible en esta app.
      .catch(() => {
        setProcesando(false);
        setErrorArchivo('No pudimos guardar el comprobante. Revisa tu conexión e inténtalo de nuevo.');
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex items-end bg-[color-mix(in_oklab,black_55%,transparent)]"
      onClick={onCerrar}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[var(--radius-card)] bg-[var(--surface)] p-5 pb-[max(24px,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Nuevo registro</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="flex size-9 items-center justify-center text-[var(--text-secondary)]">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {([{ v: 'cuota' as const, l: 'Cuota' }, { v: 'gasto_extra' as const, l: 'Gasto extra' }]).map(({ v, l }) => (
            <button
              key={v}
              type="button"
              onClick={() => setTipo(v)}
              className={`flex-1 rounded-[var(--radius-button)] border py-2.5 text-[14px] font-medium [touch-action:manipulation] ${
                tipo === v ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[var(--text-secondary)]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <SelectorHijo
          hijos={hijos}
          valor={hijoId}
          onCambio={setHijoElegido}
          textoTodos="Todos"
          ocultarSinHijos={tipo === 'cuota'}
        />

        <label className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">Concepto</label>
        <input
          type="text"
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          placeholder="Ej. Cuota de octubre"
          className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />

        <div className="mt-4 flex items-center justify-between">
          <label className="text-[13px] font-medium text-[var(--text-secondary)]">Monto (COP)</label>
          {leyendoRecibo && (
            <span className="flex items-center gap-1 text-[12px] text-[var(--accent)]">
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
              Leyendo el recibo…
            </span>
          )}
          {montoDetectado && !leyendoRecibo && (
            <span className="flex items-center gap-1 text-[12px] font-medium text-[var(--accent)]">
              <Sparkles size={12} aria-hidden="true" />
              Detectado automáticamente
            </span>
          )}
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={monto}
          onChange={(e) => {
            setMonto(e.target.value);
            setMontoDetectado(false); // el usuario corrigió a mano: ya no es "detectado", es suyo
          }}
          className="mt-2 h-12 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--bg)] px-4 text-[15px] tabular-nums text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />

        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) elegirArchivo(f);
          }}
        />
        {/* Con archivo elegido se muestra la FOTO, no solo su nombre: el error típico no es haber
            elegido "un archivo que no era", es haber elegido LA FOTO que no era — y eso solo se
            detecta viéndola antes de que entre al expediente. */}
        {archivo ? (
          <div className="mt-4">
            <VistaPreviaArchivo archivo={archivo} />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-2 text-[12.5px] text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]"
            >
              Elegir otro archivo
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] text-[14px] text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <Upload size={16} aria-hidden="true" />
            Adjuntar comprobante
          </button>
        )}
        {errorArchivo ? (
          <p role="alert" className="mt-1.5 text-[12px] text-[var(--status-error)]">{errorArchivo}</p>
        ) : (
          <p className="mt-1.5 text-[12px] text-[var(--text-tertiary)]">Con una foto, el monto se completa solo — revísalo antes de guardar.</p>
        )}

        {/* El botón estaba muerto al 40% sin decir qué faltaba: había que adivinar cuál de los tres
            campos estaba incompleto. Ahora se ve activo, y al tocarlo dice exactamente qué falta —
            que es como funciona el editor de Ajustes. Solo se deshabilita mientras guarda. */}
        {faltante && (
          <p role="alert" className="mt-3 text-center text-[12.5px] text-[var(--status-error)]">
            {faltante}
          </p>
        )}
        <button
          type="button"
          disabled={procesando}
          onClick={guardar}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent,var(--bg))] transition-opacity disabled:opacity-40 [touch-action:manipulation]"
        >
          {procesando ? 'Aplicando el Sello de Confianza…' : 'Guardar registro'}
        </button>
      </motion.div>
    </motion.div>
  );
}
