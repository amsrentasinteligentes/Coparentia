// Formato del APROXIMADO en pesos colombianos. Código normal (no acción de servidor): solo
// transforma números, así que corre en el navegador sin pedirle nada al servidor.

// Convierte un precio en dólares a pesos usando la TRM y lo redondea a la centena más cercana.
// El redondeo es deliberado: escribir "$275.854" finge una precisión que no existe —el cobro real
// es en dólares y la tasa cambia mañana—, mientras que "$275.900" se lee como lo que es, un
// estimado. Formato con puntos de mil, como se escribe el dinero en Colombia.
export function aproximadoEnPesos(dolares: number, trm: number): string {
  const pesos = Math.round((dolares * trm) / 100) * 100;
  return `$${new Intl.NumberFormat('es-CO').format(pesos)}`;
}
