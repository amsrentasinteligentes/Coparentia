# VEREDICTO revisor-visual — expediente
Fecha: 2026-10-23 12:00
Screenshot: docs/revisiones/expediente-375.png
Usabilidad: 26/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [ALTA] Seccion "Autorizaciones y controversias" (parte baja) es un callejon sin salida: agregarAutorizacion() en lib/datos.ts no tiene ningun llamador en la UI, el estado vacio no tiene CTA, y el texto de ayuda ("?") promete "cada pago o autorizacion que registras queda aqui automaticamente". Fix: anadir boton y formulario "Pedir autorizacion" dentro del estado vacio, o retirar la seccion y esa frase hasta que exista.
2. [ALTA] Tarjeta "Constancia a la otra parte": el boton "Enviar constancia ahora" manda un correo a la contraparte con un toque, sin confirmacion (onClick={enviar} directo) y sin deshacer; es irreversible y de contexto legal. Fix: confirmacion en linea ("Se enviara a X. Enviar / Cancelar") antes de llamar enviarConstanciaAhora.
3. [MEDIA] Tarjetas hermanas inconsistentes: titulo "Consultar acuerdo" 14px medium vs "Constancia a la otra parte" 16px extrabold display; chip de icono 40px vs 48px; boton 44px semibold vs 48px bold con distinto tono de azul. Fix: un unico patron de tarjeta-accion (titulo 16/800, chip 48, boton h-12 mismo peso/color).
4. [MEDIA] Cabecera de la pantalla: el chip de carpeta (derecha de "Expediente") parece boton y no hace nada (regla 11); el "?" al lado no lleva chip, asi que el par es asimetrico. Fix: quitar la carpeta (duplica la pestana) o hacerla funcional; dejar solo el "?" con el mismo tratamiento.
5. [MEDIA] Movimiento/identidad: las tres tarjetas superiores entran a la vez (no se pasa `indice` a Tarjeta/AcuerdoCuota/Constancia), sin celebracion al exportar con exito (solo texto), sin conteo ni dibujado, y sin ningun dispositivo ownable (halo/marcador) visible en esta pantalla; se ve como el kit azul-SaaS generico. Fix: escalonar con indice 0-3, animar el exito de la exportacion, aplicar Halo detras de la tarjeta del PDF.
Notas de verificacion: el screenshot mide ~1990px de alto, no un viewport real de telefono (375x812); el vacio muerto sobre la barra inferior es artefacto del render y no se puntuo, pero conviene recapturar a 375x812. Valores visibles coinciden con tokens-app-claro.css (fondo #EDF0F7, azul #1A63DC, radios 18/999, Figtree/Nunito); sin desvio contra FICHA-ARTE. CTA heroe vivo: cumple los 4 (contraste, whileTap, no disabled por defecto, h-14 ancho completo).
