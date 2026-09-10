'use client';

// INICIO — dashboard de la app interna + LA PRIMERA VICTORIA (ESTADO.md §11: registrar el
// título, subir el último comprobante, ver el primer "Estado de Cuenta Organizado" en <5 min).
// Sin backend todavía (Sesión 6): todo vive en lib/datos.ts (localStorage), con datos semilla
// realistas — la app nunca se enseña vacía (32).

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Upload, Check, CalendarClock, ShieldCheck, ChevronRight, FileCheck2, Globe } from 'lucide-react';
import { MiniRing } from '@/components/landing/ui';
import { BarraAtras, Halo } from '@/components/funnel/ui';
import Link from 'next/link';
import { ContenedorApp, PageHeader, Tarjeta, IconoCirculo, Pildora, TarjetaSkeleton, NumeroContado } from '@/components/app/ui';
import {
  type Titulo,
  type Pago,
  type Evento,
  tieneOnboardingCompleto,
  obtenerTitulo,
  guardarTitulo,
  obtenerPagos,
  agregarPago,
  obtenerEventos,
  formatoCOP,
  formatoFechaCorta,
  formatoFechaLarga,
} from '@/lib/datos';

const ICONO_EVENTO = { visita: CalendarClock, medica: ShieldCheck, vacaciones: CalendarClock, extracurricular: CalendarClock, salida_pais: Globe } as const;
const LABEL_EVENTO = { visita: 'Visita', medica: 'Cita médica', vacaciones: 'Vacaciones', extracurricular: 'Actividad', salida_pais: 'Salida del país' } as const;

export default function Inicio() {
  const [listo, setListo] = useState(false);
  const [completo, setCompleto] = useState(false);

  useEffect(() => {
    tieneOnboardingCompleto().then((c) => {
      setCompleto(c);
      setListo(true);
    });
  }, []);

  // Mientras se resuelve si la persona ya pasó los primeros pasos, esto devolvía `null`: una
  // pantalla EN BLANCO durante el arranque, que en un celular lento se lee como "la app no cargó".
  // Ahora se muestra la silueta de lo que viene (regla del SO: nunca spinner, nunca vacío).
  if (!listo) {
    return (
      <ContenedorApp>
        <div className="pb-6 pt-2">
          <div className="h-8 w-2/3 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] [animation-duration:1.6s]" />
        </div>
        <TarjetaSkeleton filas={3} />
      </ContenedorApp>
    );
  }
  if (!completo) return <PrimerosPasos onListo={() => setCompleto(true)} />;
  return <Dashboard />;
}

/* ── PRIMEROS PASOS — 2 micro-pasos: configurar la cuota, subir el primer comprobante.
   Termina mostrando el primer "Estado de Cuenta Organizado" (la primera victoria real). ── */
function PrimerosPasos({ onListo }: { onListo: () => void }) {
  // Si el título ya se guardó en un intento anterior (ej. recargó la página a mitad de camino),
  // se retoma en el paso del comprobante — nunca se vuelve a pedir la cuota ni se salta al
  // dashboard con datos que no son del usuario.
  const [paso, setPaso] = useState<'titulo' | 'comprobante' | 'revelacion'>('titulo');
  const [monto, setMonto] = useState('450000');
  const [dia, setDia] = useState('5');
  const [reajuste, setReajuste] = useState('IPC (Índice de Precios al Consumidor)');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [procesando, setProcesando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Si el título ya se guardó en un intento anterior (ej. recargó la página a mitad de camino),
  // se retoma en el paso del comprobante — nunca se vuelve a pedir la cuota ni se salta al
  // dashboard con datos que no son del usuario.
  useEffect(() => {
    obtenerTitulo().then((t) => {
      if (t) setPaso('comprobante');
    });
  }, []);

  const confirmarTitulo = async (): Promise<void> => {
    const t: Titulo = {
      montoMensual: Number(monto) || 0,
      diaPago: Number(dia) || 1,
      indiceReajuste: reajuste,
      fechaInicio: new Date().toISOString().slice(0, 10),
    };
    await guardarTitulo(t);
    setPaso('comprobante');
  };

  const subirComprobante = (f: File): void => {
    setArchivo(f);
    setProcesando(true);
    // Sello de Confianza: fecha + asocia el comprobante — mock honesto (sin OCR real todavía,
    // Sesión 6), pero el NOMBRE del archivo es real (lo eligió el usuario, no se inventa).
    agregarPago(
      {
        fecha: new Date().toISOString().slice(0, 10),
        monto: Number(monto) || 0,
        concepto: 'Primer comprobante registrado',
        tipo: 'cuota',
        comprobanteNombre: f.name,
      },
      f
    ).then(() => {
      setProcesando(false);
      setPaso('revelacion');
    });
  };

  return (
    <ContenedorApp>
      {paso !== 'revelacion' && (
        <div className="pt-2">
          <BarraAtras
            porcentaje={paso === 'titulo' ? 50 : 100}
            pasoActual={paso === 'titulo' ? 1 : 2}
            pasoTotal={2}
            onAtras={paso === 'comprobante' ? () => setPaso('titulo') : undefined}
          />
        </div>
      )}
      <div className="pt-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">Primeros pasos</p>
      </div>

      {paso === 'titulo' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col">
          <h1 className="relative mt-2 text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            <Halo />
            Configura tu cuota alimentaria
          </h1>
          <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
            Con esto armamos el título de tu expediente — puedes ajustarlo cuando quieras.
          </p>

          <label className="mt-8 text-[13px] font-medium text-[var(--text-secondary)]">Monto mensual (COP)</label>
          <input
            type="number"
            inputMode="numeric"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="mt-2 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[16px] tabular-nums text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
          />

          <label className="mt-5 text-[13px] font-medium text-[var(--text-secondary)]">Día de pago de cada mes</label>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={31}
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            className="mt-2 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[16px] tabular-nums text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
          />

          <label className="mt-5 text-[13px] font-medium text-[var(--text-secondary)]">Reajuste anual</label>
          <select
            value={reajuste}
            onChange={(e) => setReajuste(e.target.value)}
            className="mt-2 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
          >
            <option>IPC (Índice de Precios al Consumidor)</option>
            <option>Acordado en el acta o sentencia</option>
            <option>Aún no lo sé</option>
          </select>

          <motion.button
            type="button"
            disabled={!monto || !dia}
            onClick={confirmarTitulo}
            whileTap={{ scale: 0.97 }}
            className="mt-8 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-40 [touch-action:manipulation]"
          >
            Guardar y continuar
          </motion.button>
        </motion.div>
      )}

      {paso === 'comprobante' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center pt-10 text-center">
          <IconoCirculo icon={Upload} size={26} />
          <h1 className="relative mt-6 text-[24px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            <Halo />
            Sube tu primer comprobante
          </h1>
          <p className="mt-2 max-w-[34ch] text-[14px] text-[var(--text-secondary)]">
            Una foto o un PDF de tu último pago — el Sello de Confianza lo fecha y lo asocia a tu expediente.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) subirComprobante(f);
            }}
          />

          {!procesando ? (
            <motion.button
              type="button"
              onClick={() => inputRef.current?.click()}
              whileTap={{ scale: 0.97 }}
              className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
            >
              <Upload size={18} aria-hidden="true" />
              Elegir archivo
            </motion.button>
          ) : (
            <div className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] text-[15px] text-[var(--text-secondary)]">
              <span className="size-2 animate-pulse rounded-full bg-[var(--accent)]" />
              Aplicando el Sello de Confianza a &quot;{archivo?.name}&quot;…
            </div>
          )}
        </motion.div>
      )}

      {paso === 'revelacion' && <Revelacion onContinuar={onListo} />}
    </ContenedorApp>
  );
}

function Revelacion({ onContinuar }: { onContinuar: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35 }}
      className="flex flex-col items-center pt-10 text-center"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4, duration: reduce ? 0 : 0.5 }}
        className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]"
      >
        <Check size={30} strokeWidth={2.6} color="var(--accent)" aria-hidden="true" />
      </motion.span>
      <h1 className="mt-6 text-[24px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tu Estado de Cuenta Organizado
      </h1>
      <p className="mt-2 max-w-[34ch] text-[14px] text-[var(--text-secondary)]">
        Ya tienes tu primer comprobante en el expediente — fechado y listo para exportar cuando lo necesites.
      </p>
      <Tarjeta className="mt-6 w-full text-left">
        <div className="flex items-center gap-3">
          <IconoCirculo icon={FileCheck2} />
          <div>
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">1 comprobante registrado</p>
            <p className="text-[13px] text-[var(--text-secondary)]">Con Sello de Confianza · listo en tu expediente</p>
          </div>
        </div>
      </Tarjeta>
      <motion.button
        type="button"
        onClick={onContinuar}
        whileTap={{ scale: 0.97 }}
        className="mt-8 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
      >
        Ir a mi expediente
      </motion.button>
    </motion.div>
  );
}

/* ── DASHBOARD — protagonista: el estado del expediente. Datos reales de lib/datos.ts. ── */
function Dashboard() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [titulo, setTitulo] = useState<Titulo | null>(null);
  // Sin esto el dashboard pintaba primero TODO en cero (0 comprobantes, $0, anillo vacío) y un
  // instante después saltaba a los datos reales: durante ese parpadeo la app le dice a la persona
  // que su expediente está vacío, que es exactamente su miedo.
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([obtenerTitulo(), obtenerPagos(), obtenerEventos()])
      .then(([t, p, e]) => {
        setTitulo(t);
        setPagos(p);
        setEventos(e);
      })
      .finally(() => setCargando(false));
  }, []);

  const totalRegistrado = pagos.reduce((acc, p) => acc + p.monto, 0);
  const mesesConRegistro = new Set(pagos.filter((p) => p.tipo === 'cuota').map((p) => p.fecha.slice(0, 7))).size;
  const metaMeses = 6;
  const progreso = Math.round((Math.min(mesesConRegistro, metaMeses) / metaMeses) * 100);

  const hoy = new Date().toISOString().slice(0, 10);
  const proximoEvento = eventos.filter((e) => e.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
  const ultimosPagos = [...pagos].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3);

  return (
    <ContenedorApp>
      {/* El <Marcador> de marca no existía en NINGUNA pantalla de la app interna, solo en el
          funnel: aquí el sello de identidad entra sobre la palabra que da nombre al producto. */}
      <PageHeader
        titulo="Tu expediente"
        palabraClave="expediente"
        halo
        subtitulo={titulo ? `Cuota de ${formatoCOP(titulo.montoMensual)} · día ${titulo.diaPago}` : undefined}
      />

      {cargando ? (
        <TarjetaSkeleton filas={3} />
      ) : (
        <>
          <Tarjeta className="flex items-center gap-4">
            <MiniRing value={progreso} size={64} stroke={6} />
            <div className="flex-1">
              <p className="text-[13px] text-[var(--text-secondary)]">Meses con registro</p>
              <p className="text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                <NumeroContado valor={Math.min(mesesConRegistro, metaMeses)} />{' '}
                <span className="text-[15px] font-normal text-[var(--text-secondary)]">de {metaMeses}</span>
              </p>
            </div>
          </Tarjeta>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Tarjeta indice={1}>
              <p className="text-[13px] text-[var(--text-secondary)]">Total registrado</p>
              <p className="mt-1 text-[19px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                <NumeroContado valor={totalRegistrado} formato={formatoCOP} />
              </p>
            </Tarjeta>
            <Tarjeta indice={2}>
              <p className="text-[13px] text-[var(--text-secondary)]">Comprobantes</p>
              <p className="mt-1 text-[19px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                <NumeroContado valor={pagos.length} />
              </p>
            </Tarjeta>
          </div>
        </>
      )}

      {proximoEvento && (
        <Link href="/calendario" className="mt-3 block [touch-action:manipulation]">
          <Tarjeta className="flex items-center gap-3">
            <IconoCirculo icon={ICONO_EVENTO[proximoEvento.tipo]} />
            <div className="flex-1">
              <p className="text-[13px] text-[var(--text-secondary)]">Próximo · {LABEL_EVENTO[proximoEvento.tipo]}</p>
              <p className="text-[15px] font-semibold text-[var(--text-primary)]">{proximoEvento.titulo}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-medium text-[var(--accent)]">{formatoFechaCorta(proximoEvento.fecha)}</p>
              <ChevronRight size={16} className="ml-auto mt-1 text-[var(--text-tertiary)]" aria-hidden="true" />
            </div>
          </Tarjeta>
        </Link>
      )}

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Últimos movimientos</h2>
        <Link href="/pagos" className="text-[13px] font-medium text-[var(--accent)] [touch-action:manipulation]">
          Ver todos
        </Link>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {/* Faltaba el estado vacío: sin registros, el título "Últimos movimientos" quedaba solo,
            colgando sobre la nada, sin decir qué hacer (regla 7 del SO). */}
        {ultimosPagos.length === 0 ? (
          <Tarjeta className="flex flex-col items-center py-8 text-center">
            <IconoCirculo icon={FileCheck2} size={22} />
            <p className="mt-3 text-[14px] font-medium text-[var(--text-primary)]">Todavía no hay movimientos</p>
            <p className="mt-1 max-w-[30ch] text-[13px] text-[var(--text-secondary)]">
              Cada comprobante que subas queda fechado aquí, listo para mostrar cuando lo necesites.
            </p>
          </Tarjeta>
        ) : (
          ultimosPagos.map((p, i) => (
            <Tarjeta key={p.id} indice={i} className="flex items-center gap-3">
              <IconoCirculo icon={p.tipo === 'cuota' ? ShieldCheck : FileCheck2} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-[var(--text-primary)]">{p.concepto}</p>
                <p className="truncate text-[12px] text-[var(--text-tertiary)]">{formatoFechaLarga(p.fecha)}</p>
              </div>
              <p className="shrink-0 text-[14px] font-semibold tabular-nums text-[var(--text-primary)]">{formatoCOP(p.monto)}</p>
            </Tarjeta>
          ))
        )}
      </div>

      <Link
        href="/pagos"
        className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
      >
        <Upload size={18} aria-hidden="true" />
        Subir un comprobante
      </Link>
    </ContenedorApp>
  );
}
