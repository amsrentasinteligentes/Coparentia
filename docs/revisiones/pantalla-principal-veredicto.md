# VEREDICTO revisor-visual — pantalla-principal
Fecha: 2026-09-07 00:00
Screenshot: docs/revisiones/inicio-375.png
Usabilidad: 21/40
Craft: 9/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Primeros pasos, pasos "comprobante" y "revelación" — app/(app)/inicio/page.tsx L142-227] Sin botón Atrás ni indicador de progreso (1/2); la única salida es la nav inferior, sin señalizar → agregar header con flecha atrás + "Paso X de 2".
2. [app/(app)/inicio/page.tsx L35-41, L56-65] tieneOnboardingCompleto() se vuelve true apenas se guarda el título (paso 1), no al terminar el flujo completo: si el usuario recarga entre el paso 1 y 2, la app salta al Dashboard con datos SEMILLA falsos (agregarPago nunca corrió), mostrando "4 de 6 meses" y comprobantes que nunca subió → usar una clave de "primeros pasos completos" separada de "título guardado" para reanudar en el paso correcto.
3. [components/landing/ui.tsx MiniRing L152-190; inicio/page.tsx L254; FICHA-ARTE.md dispositivo ownable] El halo azul radial detrás del anillo/dato héroe y el subrayado marcador en el titular, documentados en FICHA-ARTE.md como el dispositivo diferenciador de marca, no están implementados en ningún título ni en el anillo de esta pantalla → aplicar el halo detrás de <MiniRing> y el subrayado en la palabra clave de "Configura tu cuota alimentaria" / "Tu expediente".
4. [inicio-primerospasos-2-comprobante-375.png e inicio-primerospasos-3-revelacion-375.png] ~45-50% de la altura queda en fondo plano vacío debajo del CTA — la misma tensión de "vacío muerto" ya vista en onboarding/paywall reaparece aquí → añadir apoyo visual (ilustración ligera, tip) o centrar verticalmente el bloque.
5. [inicio/page.tsx: botones L131, L164, L218] Los 3 CTA primarios del flujo son `<button>` planos sin `whileTap`/motion, a diferencia de `<BotonFlotante>` del mismo kit que sí lo tiene → migrar a `motion.button` con `whileTap={{scale:0.97}}` para cumplir la baseline de feedback de tap del SO.
