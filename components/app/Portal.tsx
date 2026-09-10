'use client';

// PORTAL — saca un elemento del árbol del DOM y lo monta directo en <body>.
//
// POR QUÉ HIZO FALTA (bug real, encontrado por el revisor-visual): al agregar la luz ambiental de
// fondo, `ContenedorApp` pasó a llevar `relative isolate`. `isolate` crea un CONTEXTO DE
// APILAMIENTO, y dentro de un contexto de apilamiento los z-index de los hijos solo compiten entre
// ellos — no contra el resto de la página. Resultado: el modal de registro (z-30), el visor de
// imágenes (z-40) y el Sello de Confianza (z-40) quedaron atrapados dentro de ese contexto y se
// pintaban DEBAJO del nav inferior (z-20), que vive fuera, en el layout.
//
// El síntoma era grave y silencioso: en el formulario de registro, el nav tapaba el botón "Guardar
// registro" —la acción primaria de todo el flujo— y solo asomaban unos pocos píxeles.
//
// Subir el z-index no lo arregla: mientras el elemento viva dentro del contexto aislado, ningún
// número lo saca de ahí. La solución correcta es montarlo fuera, en el <body>.

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function Portal({ children }: { children: ReactNode }) {
  // `document` no existe durante el render del servidor: se monta recién en el cliente.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  if (!montado) return null;
  return createPortal(children, document.body);
}
