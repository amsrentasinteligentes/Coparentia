import Link from 'next/link';

// POLÍTICA INTEGRAL DE TRATAMIENTO DE DATOS PERSONALES — texto completo revisado y aportado por
// el equipo jurídico del usuario (2026-09-25), incorporado tal cual, sin recortar ni reinterpretar
// el contenido legal. Los campos que el documento original dejaba como "[PENDIENTE]" se resolvieron
// con el usuario antes de publicar (ver ESTADO.md): responsable = persona natural (Alejandro Muñoz,
// sin NIT de empresa), domicilio = Colombia (sin dirección exacta), correo de privacidad =
// soporte@coparentia.co (el que ya existe y ya se revisa — nunca se creó una bandeja nueva).
export const metadata = { title: 'Política de Tratamiento de Datos Personales — Coparentia' };

function Seccion({ numero, titulo, children }: { numero: string; titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
        {numero}. {titulo}
      </h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

export default function Privacidad() {
  return (
    <main className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)] px-6 py-16">
      <div className="mx-auto max-w-[70ch]">
        <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
          ← Volver a Coparentia
        </Link>
        <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
          Política Integral de Tratamiento de Datos Personales de Coparentia
        </h1>
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">
          Vigente desde el 25 de septiembre de 2026 · Última actualización: septiembre de 2026
        </p>

        <div className="mt-8 space-y-10 text-[var(--text-secondary)] leading-relaxed">
          <Seccion numero="1" titulo="Objeto y alcance">
            <p>
              La presente Política Integral de Tratamiento de Datos Personales (la &quot;Política&quot;)
              establece las reglas aplicables a la recolección, almacenamiento, uso, circulación,
              transmisión, transferencia, actualización, rectificación, conservación, consulta,
              anonimización y supresión de datos personales tratados a través de Coparentia,
              incluyendo su aplicación móvil, sitio web, paneles administrativos, canales de soporte
              y demás servicios asociados.
            </p>
            <p>
              La Política aplica a usuarios adultos, padres, madres, representantes legales,
              cuidadores autorizados, niños, niñas y adolescentes cuyos datos sean tratados
              legítimamente, profesionales vinculados al directorio de Coparentia, prospectos,
              visitantes del sitio web, proveedores, contratistas y demás titulares respecto de los
              cuales Coparentia actúe como Responsable del Tratamiento.
            </p>
            <p>
              Coparentia está diseñada como plataforma de organización de corresponsabilidad
              parental. Por la naturaleza de sus funcionalidades puede tratar información de alta
              sensibilidad contextual, incluyendo datos familiares, documentos relacionados con
              alimentos, custodia, visitas, salud, educación, situaciones de violencia,
              comunicaciones entre adultos responsables y datos de niños, niñas y adolescentes. En
              consecuencia, Coparentia adopta un estándar reforzado de privacidad, seguridad,
              minimización y acceso restringido.
            </p>
          </Seccion>

          <Seccion numero="2" titulo="Identificación del Responsable del Tratamiento">
            <p>
              <strong>Responsable del Tratamiento:</strong> Alejandro Muñoz, persona natural,
              operando como Coparentia desde Colombia.
            </p>
            <p>
              Domicilio: Colombia. Correo general: soporte@coparentia.co. Correo exclusivo para
              privacidad y hábeas data: soporte@coparentia.co. Sitio web: https://coparentia.co.
            </p>
            <p>
              La marca Coparentia podrá ser utilizada comercialmente por el Responsable. La
              identidad del Responsable deberá permanecer visible y fácilmente accesible en el
              sitio web, la aplicación y los canales destinados al ejercicio de derechos.
            </p>
          </Seccion>

          <Seccion numero="3" titulo="Marco normativo">
            <p>
              Esta Política se adopta principalmente con fundamento en los artículos 15 y 44 de la
              Constitución Política de Colombia; la Ley Estatutaria 1581 de 2012; el Decreto 1074 de
              2015, especialmente las disposiciones que incorporaron la reglamentación del Decreto
              1377 de 2013; las instrucciones aplicables de la Superintendencia de Industria y
              Comercio; y las demás normas que modifiquen, adicionen o sustituyan el régimen
              colombiano de protección de datos personales.
            </p>
            <p>
              Cuando resulten aplicables, Coparentia observará igualmente las reglas sobre
              conservación de libros y papeles de comercio, comercio electrónico, mensajes de datos,
              protección al consumidor, secreto profesional y obligaciones especiales de abogados,
              psicólogos y demás profesionales independientes que utilicen la plataforma.
            </p>
          </Seccion>

          <Seccion numero="4" titulo="Definiciones">
            <p>
              Para efectos de esta Política se aplicarán las definiciones legales de Autorización,
              Base de Datos, Dato Personal, Dato Público, Dato Privado, Dato Semiprivado, Dato
              Sensible, Encargado del Tratamiento, Responsable del Tratamiento, Titular, Tratamiento,
              Transferencia y Transmisión.
            </p>
            <p>
              <strong>Dato sensible:</strong> Información que afecta la intimidad del Titular o cuyo
              uso indebido puede generar discriminación, incluyendo, entre otros, datos relativos a
              salud, vida sexual, biometría, origen racial o étnico, convicciones religiosas o
              filosóficas y demás categorías previstas en la ley.
            </p>
            <p>
              <strong>Datos de niños, niñas y adolescentes (&quot;NNA&quot;):</strong> cualquier
              información vinculada o que pueda asociarse con una persona menor de dieciocho (18)
              años. Su tratamiento se somete a un estándar reforzado de protección.
            </p>
            <p>
              <strong>Espacio familiar:</strong> Entorno digital de Coparentia en el cual usuarios
              adultos vinculados pueden, según sus permisos, organizar calendarios, visitas, gastos,
              pagos, documentos, acuerdos, mensajes y otra información relacionada con la crianza
              compartida.
            </p>
            <p>
              <strong>Profesional independiente:</strong> abogado, psicólogo u otro profesional que
              ofrece sus servicios bajo su propia responsabilidad y que puede aparecer en Coparentia
              mediante un perfil informativo, patrocinado o no patrocinado. Coparentia no convierte
              al profesional en empleado ni asume la prestación profesional que este realice.
            </p>
          </Seccion>

          <Seccion numero="5" titulo="Principios aplicables al tratamiento">
            <p>
              Coparentia aplicará los principios de legalidad, finalidad, libertad, veracidad o
              calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad.
              Adicionalmente, por diseño del producto aplicará criterios de necesidad,
              proporcionalidad, minimización, privacidad desde el diseño y por defecto,
              segmentación de accesos y responsabilidad demostrada. Coparentia no recolectará
              información que no sea razonablemente necesaria para la funcionalidad utilizada. Las
              finalidades no se interpretarán de manera expansiva. Cuando se pretenda utilizar
              información para una finalidad materialmente distinta de la previamente informada, se
              solicitará una nueva autorización cuando legalmente corresponda.
            </p>
          </Seccion>

          <Seccion numero="6" titulo="Categorías de titulares y datos tratados">
            <p>
              <strong>6.1. Usuarios adultos.</strong> Datos de identificación y cuenta; datos de
              contacto; información de autenticación; datos de relación familiar; preferencias;
              datos de facturación y suscripción; historial de soporte; registros de consentimiento;
              información de uso de la plataforma; y contenido que el propio usuario decida cargar.
            </p>
            <p>
              <strong>6.2. Niños, niñas y adolescentes.</strong> Únicamente cuando el tratamiento sea
              legítimo y necesario: nombre o identificador familiar, fecha de nacimiento o edad,
              relación con los adultos vinculados, fotografía si se habilita, calendario de cuidado,
              información escolar, información de salud cuando se cargue voluntariamente, soportes,
              autorizaciones, datos relacionados con gastos, alimentos, visitas, custodia y otras
              circunstancias familiares indispensables para la funcionalidad utilizada.
            </p>
            <p>
              <strong>6.3. Profesionales.</strong> Nombre, fotografía, ciudad, datos profesionales,
              tarjeta profesional o credencial cuando corresponda, experiencia, especialidades,
              modalidad de atención, disponibilidad, tarifa informada, datos de contacto, datos
              contractuales y de facturación, contenido del perfil y métricas de interacción
              permitidas.
            </p>
            <p>
              <strong>6.4. Datos técnicos.</strong> Dirección IP, identificadores de dispositivo o
              sesión, sistema operativo, versión de la aplicación, fecha y hora de accesos, eventos
              de seguridad, registros de auditoría, idioma, zona horaria y datos de diagnóstico
              estrictamente necesarios para operación, seguridad y soporte.
            </p>
            <p>
              <strong>6.5. Datos de pago.</strong> Coparentia procurará que los datos completos de
              tarjetas u otros instrumentos de pago sean tratados directamente por la pasarela de
              pagos autorizada. Coparentia podrá recibir identificadores de transacción, estado del
              pago, últimos dígitos u otra información limitada necesaria para conciliación,
              soporte, facturación y prevención de fraude.
            </p>
            <p>
              <strong>6.6. Geolocalización.</strong> No se realizará seguimiento continuo de la
              ubicación de padres, madres o menores por defecto. Si una funcionalidad requiere
              ubicación, esta será opcional, se informará la finalidad y se solicitará el permiso
              correspondiente antes de su uso.
            </p>
            <p>
              <strong>6.7. Biometría.</strong> Coparentia no recolectará datos biométricos por
              defecto. Si en el futuro se implementa verificación biométrica, su tratamiento
              requerirá información previa y autorización expresa y separada para datos sensibles,
              además de medidas reforzadas de seguridad.
            </p>
          </Seccion>

          <Seccion numero="7" titulo="Finalidades del tratamiento">
            <p>
              Los datos personales podrán tratarse, según el tipo de titular y la funcionalidad
              utilizada, para las siguientes finalidades específicas:
            </p>
            <ol className="list-[lower-alpha] space-y-2.5 pl-5 marker:text-[var(--text-tertiary)]">
              <li>Crear, autenticar, administrar y proteger cuentas de usuario; verificar identidad cuando sea razonablemente necesario; recuperar acceso y prevenir suplantación.</li>
              <li>Permitir la organización del calendario parental, visitas, entregas, vacaciones, eventos escolares, citas y demás actividades registradas por los usuarios.</li>
              <li>Permitir el registro y organización de cuotas alimentarias, pagos, diferencias registradas, gastos ordinarios y extraordinarios, soportes y comprobantes, sin que Coparentia declare por sí misma la existencia jurídica de una deuda.</li>
              <li>Permitir la creación, almacenamiento, clasificación, consulta, descarga y trazabilidad de documentos, soportes, propuestas, autorizaciones y acuerdos cargados por los usuarios.</li>
              <li>Habilitar comunicaciones entre usuarios adultos vinculados al espacio familiar, registrar eventos técnicos de entrega, fecha, hora y acciones realizadas cuando la funcionalidad así lo requiera.</li>
              <li>Generar reportes cronológicos, resúmenes organizativos y exportaciones solicitadas por el usuario.</li>
              <li>Prestar soporte técnico, responder consultas, reclamos y solicitudes de hábeas data; investigar fallas, fraudes, accesos indebidos o usos contrarios a los términos.</li>
              <li>Gestionar planes, suscripciones, facturación, cobros, renovaciones, cancelaciones, devoluciones y obligaciones contables o comerciales.</li>
              <li>Mantener la seguridad de la plataforma, efectuar monitoreo preventivo de incidentes, auditoría de accesos, copias de respaldo, continuidad del negocio y recuperación ante fallas.</li>
              <li>Permitir al usuario buscar abogados, psicólogos u otros profesionales mediante filtros objetivos y mostrar perfiles patrocinados debidamente identificados.</li>
              <li>Compartir datos mínimos con un profesional únicamente cuando el usuario lo solicite o autorice de manera inequívoca. Los documentos, mensajes, datos sensibles o información de NNA no serán entregados automáticamente a anunciantes o profesionales por el solo hecho de aparecer en Coparentia.</li>
              <li>Enviar comunicaciones operativas indispensables: confirmaciones de cuenta, alertas de seguridad, recordatorios configurados, avisos de cambios contractuales o de privacidad, facturación y comunicaciones necesarias para ejecutar el servicio.</li>
              <li>Enviar novedades, promociones o comunicaciones comerciales únicamente cuando exista autorización separada o cuando la normativa permita el contacto. El Titular podrá retirarse de comunicaciones promocionales mediante mecanismos sencillos.</li>
              <li>Realizar analítica del funcionamiento de la plataforma, medición de rendimiento y mejora de experiencia utilizando, cuando sea posible, datos agregados, anonimizados o seudonimizados.</li>
              <li>Cumplir obligaciones legales, regulatorias, judiciales, fiscales, contractuales y requerimientos válidos de autoridades competentes.</li>
              <li>Defender derechos de Coparentia o de sus usuarios cuando resulte jurídicamente procedente y dentro de los límites de la normativa aplicable.</li>
            </ol>
          </Seccion>

          <Seccion numero="8" titulo="Tratamiento de datos sensibles">
            <p>
              El suministro de datos sensibles es facultativo salvo que exista una excepción legal
              aplicable o que el dato sea indispensable para una funcionalidad expresamente
              solicitada por el Titular. Ninguna funcionalidad general de Coparentia se condicionará
              a suministrar datos sensibles que no sean necesarios. Antes de recolectar datos
              sensibles, Coparentia informará expresamente cuáles datos tienen esa naturaleza, la
              finalidad concreta para la cual serán utilizados y el carácter facultativo de su
              entrega, y obtendrá una autorización explícita mediante el mecanismo electrónico
              correspondiente. Coparentia aplicará restricciones de acceso y medidas reforzadas para
              información médica, psicológica, biométrica, de violencia, de vida sexual o cualquier
              otra información sensible que pueda aparecer en documentos o comunicaciones.
              Coparentia no utilizará datos sensibles para publicidad comportamental, perfiles
              comerciales de terceros, venta de audiencias ni segmentación publicitaria. Los
              perfiles patrocinados podrán mostrarse de manera contextual por la sección que el
              usuario consulta, sin revelar al profesional o anunciante datos sensibles del usuario.
            </p>
          </Seccion>

          <Seccion numero="9" titulo="Tratamiento de datos de niños, niñas y adolescentes">
            <p>
              Coparentia no habilitará, como regla general, cuentas contractuales directas para
              menores de edad. Los datos de NNA solo serán tratados cuando el tratamiento responda y
              respete su interés superior, asegure sus derechos fundamentales y exista la
              autorización de su representante legal en los términos aplicables. Antes de otorgar la
              autorización, el representante legal deberá garantizar el derecho del NNA a ser
              escuchado cuando su madurez, autonomía y capacidad le permitan comprender el
              tratamiento. Su opinión deberá valorarse de forma adecuada a su edad y desarrollo.
            </p>
            <p>
              Coparentia podrá solicitar documentos razonables para acreditar la representación
              legal cuando exista duda, conflicto, restricción judicial, medida de protección o
              riesgo para el menor. La sola vinculación de una persona como &quot;papá&quot;,
              &quot;mamá&quot; o &quot;cuidador&quot; dentro de la interfaz no reemplaza la
              acreditación jurídica cuando esta sea necesaria.
            </p>
            <p>
              Los datos de NNA no se utilizarán para publicidad personalizada de terceros,
              perfilamiento comercial, venta de datos, entrenamiento comercial de modelos de
              inteligencia artificial ni finalidades incompatibles con su protección. Cuando los
              datos del NNA sean además sensibles, deberá obtenerse, adicionalmente, la autorización
              especial para datos sensibles otorgada por la persona legalmente facultada. Coparentia
              procurará ofrecer explicaciones de privacidad en lenguaje comprensible para niños y
              adolescentes cuando ello sea apropiado, sin trasladarles responsabilidades
              contractuales propias de los adultos.
            </p>
          </Seccion>

          <Seccion numero="10" titulo="Información de otro progenitor y datos de terceros">
            <p>
              Coparentia procurará que la vinculación del otro progenitor se realice mediante
              invitación y aceptación directa del tercero. Si un usuario suministra un correo
              electrónico o número telefónico únicamente para enviar una invitación, Coparentia
              limitará su uso a esa finalidad y eliminará o anonimizará el dato si la invitación no
              es aceptada dentro del plazo técnico definido por la compañía, que no deberá exceder
              de treinta (30) días salvo causa justificada.
            </p>
            <p>
              El usuario que cargue documentos o información personal de terceros declara que
              cuenta con autorización o con una base jurídica válida para hacerlo. Esta declaración
              no exonera a Coparentia de sus deberes legales. Coparentia podrá solicitar
              aclaraciones, restringir tratamiento, ocultar información, requerir redacción de datos
              innecesarios o eliminar contenido cuando advierta un tratamiento manifiestamente
              incompatible con la ley o con los derechos de terceros. Coparentia no utilizará datos
              de terceros contenidos incidentalmente en sentencias, actas, facturas, historias
              clínicas, soportes u otros documentos para finalidades propias de marketing,
              perfilamiento o publicidad.
            </p>
          </Seccion>

          <Seccion numero="11" titulo="Espacios privados, compartidos y permisos">
            <p>
              La plataforma diferenciará, en la medida en que su diseño lo permita, entre
              información privada, información compartida con otro adulto vinculado e información
              compartida con profesionales. El usuario será informado antes de compartir un
              documento o dato con otro adulto o con un profesional. La vinculación familiar no
              implica autorización automática para que todos los participantes accedan a toda la
              información disponible. Coparentia podrá implementar controles por roles, permisos de
              lectura, edición, descarga y compartición. Determinados eventos podrán conservar
              trazabilidad técnica para seguridad, integridad, prevención de fraude y transparencia
              de las actuaciones realizadas dentro de la plataforma.
            </p>
          </Seccion>

          <Seccion numero="12" titulo="Abogados, psicólogos y otros profesionales">
            <p>
              Los profesionales que aparezcan en Coparentia actuarán, respecto de los servicios
              profesionales que presten directamente, como responsables independientes de los datos
              que reciban de sus clientes o pacientes, salvo que contractual y jurídicamente se
              defina un rol distinto. Coparentia no entregará a los profesionales el historial
              familiar, documentos, mensajes, datos de menores o datos sensibles de un usuario por el
              solo hecho de que el profesional haya pagado publicidad. El usuario decidirá qué
              información desea compartir y con quién.
            </p>
            <p>
              Los perfiles pagados o destacados deberán identificarse de manera clara como
              &quot;Patrocinado&quot; o expresión equivalente. Coparentia no afirmará que un
              profesional es &quot;el mejor&quot; ni garantizará resultados jurídicos, terapéuticos
              o de cualquier otra naturaleza. La información que un usuario entregue directamente a
              un abogado o psicólogo estará sujeta, además, a los deberes legales, éticos, de
              secreto profesional y políticas propias del profesional receptor.
            </p>
          </Seccion>

          <Seccion numero="13" titulo="Publicidad y comunicaciones comerciales">
            <p>
              Coparentia podrá mostrar publicidad contextual relacionada con la sección consultada,
              por ejemplo, profesionales de derecho de familia en una guía sobre cuota alimentaria o
              psicología familiar en contenidos sobre comunicación parental. Coparentia no venderá
              datos personales de usuarios o NNA a anunciantes ni utilizará datos sensibles o
              información de menores para construir audiencias de publicidad comportamental. Las
              comunicaciones promocionales directas de Coparentia requerirán la autorización
              correspondiente y siempre incluirán un mecanismo razonable para dejar de recibirlas.
              La revocatoria de la autorización comercial no afectará las comunicaciones operativas
              necesarias para la prestación del servicio.
            </p>
          </Seccion>

          <Seccion numero="14" titulo="Inteligencia artificial, analítica y automatización">
            <p>
              Si Coparentia incorpora funcionalidades de inteligencia artificial o automatización,
              informará de forma comprensible su finalidad y alcance cuando el tratamiento de datos
              personales sea relevante. Coparentia no utilizará datos sensibles ni datos de NNA para
              entrenar modelos de propósito comercial propio o de terceros sin una base jurídica
              suficiente y una autorización separada cuando esta sea exigible. Tampoco adoptará
              decisiones exclusivamente automatizadas que pretendan determinar derechos de custodia,
              existencia de deudas, aptitud parental, diagnósticos psicológicos o resultados
              jurídicos. Las sugerencias automatizadas tendrán carácter organizativo o informativo y
              no reemplazarán decisiones de autoridades, profesionales de la salud, psicólogos o
              abogados.
            </p>
          </Seccion>

          <Seccion numero="15" titulo="Autorización y prueba del consentimiento">
            <p>
              La autorización podrá obtenerse mediante documento escrito, formato electrónico,
              casilla de aceptación no premarcada, firma electrónica, grabación u otra conducta
              inequívoca que permita concluir razonablemente que el Titular otorgó su consentimiento.
              El silencio no se considerará autorización. Coparentia conservará evidencia del
              consentimiento incluyendo, cuando corresponda, identidad o identificador del Titular,
              fecha y hora, versión del texto aceptado, finalidades autorizadas, canal de obtención,
              registro técnico de aceptación y modificaciones posteriores.
            </p>
            <p>
              Las autorizaciones de adultos, datos sensibles y NNA estarán separadas. Aceptar
              Términos y Condiciones no reemplaza por sí mismo la autorización para tratamiento de
              datos personales, y la autorización general de datos personales no reemplaza la
              autorización explícita para datos sensibles ni el estándar especial aplicable a NNA.
            </p>
          </Seccion>

          <Seccion numero="16" titulo="Casos en los que puede no requerirse autorización">
            <p>
              Coparentia podrá tratar datos sin autorización únicamente en los eventos expresamente
              permitidos por la ley, tales como requerimientos de una entidad pública o
              administrativa en ejercicio de sus funciones legales, orden judicial, datos de
              naturaleza pública, urgencia médica o sanitaria, tratamientos autorizados por ley para
              finalidades históricas, estadísticas o científicas con las garantías aplicables, o
              datos relacionados con el Registro Civil de las Personas, entre otros supuestos
              legales. La existencia de una excepción a la autorización no elimina el deber de
              cumplir los demás principios y obligaciones del régimen de protección de datos.
            </p>
          </Seccion>

          <Seccion numero="17" titulo="Encargados del Tratamiento y proveedores">
            <p>
              Coparentia podrá utilizar proveedores para alojamiento en nube, almacenamiento,
              mensajería, autenticación, atención al cliente, analítica técnica, pasarelas de pago,
              facturación, ciberseguridad, respaldo y otros servicios necesarios. Cuando un
              proveedor trate datos por cuenta de Coparentia actuará como Encargado del Tratamiento
              y deberá estar sujeto a obligaciones contractuales sobre alcance, finalidad,
              confidencialidad, seguridad, subcontratación, atención de derechos, devolución o
              supresión de datos y cumplimiento de las instrucciones de Coparentia. Coparentia
              mantendrá un inventario interno actualizado de encargados; la lista de proveedores que
              hoy tratan datos por cuenta de Coparentia (alojamiento, base de datos, correo,
              inteligencia artificial y procesamiento de pagos) puede solicitarse escribiendo a
              soporte@coparentia.co.
            </p>
          </Seccion>

          <Seccion numero="18" titulo="Transferencias y transmisiones nacionales e internacionales">
            <p>
              Los datos podrán ser transmitidos a proveedores ubicados dentro o fuera de Colombia
              cuando ello sea necesario para prestar el servicio y exista el contrato o instrumento
              jurídico requerido. Las transferencias a terceros que actúen como responsables
              independientes se efectuarán únicamente cuando exista una autorización válida, una
              excepción legal o se cumplan las condiciones exigidas por el régimen colombiano.
              Coparentia evaluará los países de destino, el rol del receptor, las medidas
              contractuales, el nivel de protección, la necesidad de la operación y las
              instrucciones vigentes de la Superintendencia de Industria y Comercio. La arquitectura
              tecnológica deberá aplicar privacidad desde el diseño, minimización y controles
              proporcionales al riesgo.
            </p>
          </Seccion>

          <Seccion numero="19" titulo="Seguridad y confidencialidad">
            <p>
              Coparentia adoptará medidas técnicas, humanas y administrativas razonables y
              proporcionales a la naturaleza y riesgo de la información. Entre ellas podrán
              incluirse cifrado de comunicaciones, cifrado de información sensible en reposo cuando
              sea técnicamente procedente, controles de acceso por roles, autenticación reforzada
              para administradores, gestión de privilegios, registros de auditoría, copias de
              respaldo, monitoreo, segmentación, gestión de vulnerabilidades, controles de
              proveedores y capacitación. Las medidas de seguridad no se describen públicamente con
              un nivel de detalle que pueda facilitar ataques o elusión de controles. Las personas
              que accedan a datos personales por razón de sus funciones estarán sujetas a deberes de
              confidencialidad incluso después de terminar su vínculo con Coparentia.
            </p>
          </Seccion>

          <Seccion numero="20" titulo="Gestión de incidentes">
            <p>
              Coparentia contará con un procedimiento de detección, análisis, contención,
              investigación, mitigación, preservación de evidencia, recuperación y documentación de
              incidentes de seguridad. Cuando legalmente corresponda, Coparentia realizará los
              reportes exigibles ante la Superintendencia de Industria y Comercio y/o el Registro
              Nacional de Bases de Datos dentro de los términos e instrumentos aplicables, y
              evaluará la necesidad de informar a los titulares afectados atendiendo la naturaleza
              del incidente, el riesgo y las instrucciones de la autoridad.
            </p>
          </Seccion>

          <Seccion numero="21" titulo="Conservación, cierre de cuenta y supresión">
            <p>
              Los datos se conservarán únicamente durante el tiempo necesario para cumplir las
              finalidades autorizadas, la ejecución del contrato y las obligaciones legales
              aplicables. Como regla de diseño, el contenido familiar generado por el usuario
              permanecerá mientras la cuenta se encuentre activa y podrá conservarse durante un
              periodo de transición de hasta noventa (90) días calendario después del cierre para
              permitir recuperación, exportación, seguridad y atención de reclamos. Transcurrido ese
              periodo será suprimido o anonimizado, salvo obligación legal, litigio, investigación
              de seguridad o instrucción válida que justifique una conservación distinta.
            </p>
            <p>
              Las copias de respaldo podrán persistir por un ciclo técnico adicional que no deberá
              exceder de ciento ochenta (180) días, salvo incidentes o obligaciones legales. Durante
              ese tiempo no se utilizarán para finalidades ordinarias. Los registros contables,
              comprobantes comerciales, facturación y documentos que la ley exija conservar podrán
              mantenerse por los plazos legales correspondientes, incluso después del cierre de la
              cuenta. Las pruebas de autorización y registros indispensables para acreditar
              cumplimiento podrán conservarse mientras sea necesario para atender obligaciones
              legales, reclamaciones o responsabilidades relacionadas con el tratamiento.
            </p>
            <p>
              La forma más rápida de ejercer tu supresión es entrar a{' '}
              <strong>Perfil → Ajustes → Eliminar mi cuenta</strong> dentro de la app: borra tu
              cuenta, tus registros y tus archivos, sujeto a los plazos de este artículo.
            </p>
          </Seccion>

          <Seccion numero="22" titulo="Derechos de los Titulares">
            <p>
              Los Titulares tienen derecho a conocer, actualizar y rectificar sus datos personales;
              solicitar prueba de la autorización; ser informados sobre el uso dado a sus datos;
              presentar quejas ante la Superintendencia de Industria y Comercio una vez agotado el
              trámite previo cuando corresponda; revocar la autorización y/o solicitar la supresión
              cuando sea procedente; y acceder gratuitamente a sus datos en los términos legales. La
              revocatoria o supresión no procederá cuando exista un deber legal o contractual que
              obligue a conservar determinada información, ni cuando la eliminación pueda afectar
              derechos de terceros o evidencias que deban preservarse de acuerdo con la ley. En
              estos casos Coparentia informará la razón de la limitación.
            </p>
          </Seccion>

          <Seccion numero="23" titulo="Personas legitimadas para ejercer los derechos">
            <p>
              Los derechos podrán ejercerse por el Titular, sus causahabientes, representante,
              apoderado o persona debidamente legitimada. Tratándose de NNA, podrán ejercerse por
              quienes estén jurídicamente facultados para representarlos, sin perjuicio de reconocer
              progresivamente su voz y autonomía conforme a su madurez. Coparentia podrá solicitar
              información razonable para verificar identidad, representación o legitimación y evitar
              accesos indebidos a información familiar.
            </p>
          </Seccion>

          <Seccion numero="24" titulo="Canales y procedimiento para consultas y reclamos">
            <p>
              Área responsable: privacidad de Coparentia. Correo:{' '}
              <a href="mailto:soporte@coparentia.co" className="text-[var(--accent)] underline">
                soporte@coparentia.co
              </a>
              . Domicilio: Colombia.
            </p>
            <p>
              Las consultas serán atendidas en un término máximo de diez (10) días hábiles desde su
              recibo. Si no fuera posible responder dentro de dicho término, se informarán las
              razones y la nueva fecha, que no podrá superar los cinco (5) días hábiles siguientes al
              vencimiento inicial. Los reclamos sobre corrección, actualización, supresión,
              revocatoria o presunto incumplimiento serán atendidos en un término máximo de quince
              (15) días hábiles contados desde el día siguiente a su recepción. Cuando no sea
              posible resolverlos en ese plazo, se informarán los motivos y la fecha de respuesta,
              que no podrá superar ocho (8) días hábiles adicionales. Si un reclamo está incompleto,
              se requerirá al interesado para que subsane dentro de los términos legales. Si quien
              recibe el reclamo no es competente, se trasladará a quien corresponda e informará al
              interesado. Coparentia aplicará la leyenda &quot;reclamo en trámite&quot; cuando
              resulte procedente.
            </p>
          </Seccion>

          <Seccion numero="25" titulo="Revocatoria de autorizaciones y preferencias">
            <p>
              El Titular podrá gestionar autorizaciones y preferencias desde las herramientas de
              privacidad que Coparentia habilite (Perfil → Ajustes) o mediante los canales previstos
              en esta Política.
            </p>
            <p>
              La revocatoria de comunicaciones comerciales no implicará el cierre de la cuenta. La
              revocatoria de una autorización indispensable para una funcionalidad específica podrá
              impedir que dicha funcionalidad continúe operando, lo cual será informado antes de
              ejecutar la solicitud. La revocatoria no tendrá efectos retroactivos sobre tratamientos
              realizados lícitamente con anterioridad.
            </p>
          </Seccion>

          <Seccion numero="26" titulo="Cookies, SDK y tecnologías de seguimiento">
            <p>
              El sitio web y la aplicación podrán utilizar cookies, SDK u otras tecnologías
              necesarias para autenticación, seguridad, preferencias y funcionamiento. Las
              herramientas no esenciales que involucren datos personales se sujetarán a la
              información y autorización aplicables. Hoy Coparentia usa únicamente una cookie de
              sesión (de nuestro proveedor de autenticación) estrictamente necesaria para mantenerte
              con la sesión iniciada — no usamos cookies de publicidad ni de analítica de terceros.
              Coparentia no autorizará a terceros a utilizar datos sensibles o datos de NNA para
              publicidad comportamental.
            </p>
          </Seccion>

          <Seccion numero="27" titulo="Registro Nacional de Bases de Datos">
            <p>
              Coparentia verificará periódicamente si se encuentra dentro de los sujetos obligados a
              registrar sus bases de datos en el Registro Nacional de Bases de Datos – RNBD. Si se
              configura el supuesto legal, realizará la inscripción, actualización y reportes
              correspondientes. La ausencia de obligación de inscripción en el RNBD no exime a
              Coparentia del cumplimiento de la Ley 1581 de 2012 y las demás normas aplicables.
            </p>
          </Seccion>

          <Seccion numero="28" titulo="Cambios a la Política">
            <p>
              Coparentia podrá modificar esta Política por cambios normativos, regulatorios,
              tecnológicos o funcionales. Los cambios materiales serán comunicados antes de su
              implementación o, a más tardar, cuando entren en vigor, según corresponda. Cuando un
              cambio modifique materialmente las finalidades autorizadas, Coparentia solicitará una
              nueva autorización cuando la ley lo exija. Se conservará un historial de versiones con
              fecha de vigencia.
            </p>
          </Seccion>

          <Seccion numero="29" titulo="Vigencia">
            <p>
              La presente Política rige a partir del 25 de septiembre de 2026 y permanecerá vigente
              mientras Coparentia realice actividades de tratamiento sujetas a ella. Última
              actualización: septiembre de 2026.
            </p>
          </Seccion>

          <p className="text-sm text-[var(--text-tertiary)] pt-4 border-t border-[var(--surface-2)]">
            ¿Preguntas sobre tus datos? Escríbenos a{' '}
            <a href="mailto:soporte@coparentia.co" className="underline">soporte@coparentia.co</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
