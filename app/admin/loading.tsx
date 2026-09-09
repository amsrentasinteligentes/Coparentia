// Skeleton mientras cargan las 3 consultas en paralelo de la página (usuarios/uso/lista de
// cuentas) — encontrado por el revisor-visual (ronda 8): sin esto, entrar al panel se sentía
// congelado un instante sin ningún feedback (regla de latencia del SO: 100ms-1s pide feedback).

import { ContenedorAdmin } from '@/components/admin/ui';

function BarraEsqueleto({ ancho }: { ancho: string }) {
  return <div className={`h-3 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] ${ancho}`} />;
}

function TarjetaEsqueleto({ alto = 'h-32' }: { alto?: string }) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-5 ${alto}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="size-9 shrink-0 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]" />
        <BarraEsqueleto ancho="w-24" />
      </div>
      <BarraEsqueleto ancho="w-full" />
      <BarraEsqueleto ancho="w-2/3" />
    </div>
  );
}

export default function CargandoAdmin() {
  return (
    <ContenedorAdmin>
      <div className="flex flex-col gap-1 pb-6 pt-2">
        <BarraEsqueleto ancho="w-40" />
        <div className="mt-2">
          <BarraEsqueleto ancho="w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TarjetaEsqueleto alto="h-24" />
        <TarjetaEsqueleto />
        <TarjetaEsqueleto />
        <TarjetaEsqueleto alto="h-40" />
      </div>
    </ContenedorAdmin>
  );
}
