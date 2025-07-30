import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Tratamiento de Información",
  description: "Política de Tratamiento de Información de Caffelia Coffee",
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        POLÍTICA DE TRATAMIENTO DE INFORMACIÓN (PTI)
      </h1>
      <p className="font-bold">Caffelia Coffee</p>
      <p className="text-sm text-gray-600 mb-4">
        Fecha de última actualización: 25/06/2025
      </p>
      <p className="text-sm text-gray-600 mb-6">Versión: 1.0</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-2">
            1. IDENTIFICACIÓN DEL RESPONSABLE Y/O ENCARGADO DEL TRATAMIENTO
          </h2>
          <p>
            <strong>Razón Social:</strong> Caffelia Coffee SAS
          </p>
          <p>
            <strong>NIT:</strong> 1112793743
          </p>
          <p>
            <strong>Domicilio:</strong> Carrera1 #26-31, Cartago, Valle del
            Cauca, Colombia
          </p>
          <p>
            <strong>Teléfono:</strong> 3115244162
          </p>
          <p>
            <strong>Correo electrónico:</strong> admin@caffelia.co
          </p>
          <p>
            <strong>Sitio web:</strong> https://caffelia.co
          </p>
          <h3 className="text-xl font-bold mt-4 mb-2">
            Oficial de Protección de Datos:
          </h3>
          <p>
            <strong>Nombre:</strong> Joan Manuel Serna Leiton
          </p>
          <p>
            <strong>Correo:</strong> joan.serna@caffelia.co
          </p>
          <p>
            <strong>Teléfono:</strong> 3115244162
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">2. MARCO NORMATIVO</h2>
          <p>Esta Política de Tratamiento de Información se rige por:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Constitución Política de Colombia (Art. 15)</li>
            <li>Ley 1581 de 2012 - Protección de Datos Personales</li>
            <li>
              Decreto 1377 de 2013 (incorporado en el Decreto 1074 de 2015)
            </li>
            <li>Políticas de WhatsApp Business Platform</li>
            <li>Políticas de Facebook/Meta para Desarrolladores</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">3. DEFINICIONES</h2>
          <ul className="space-y-2">
            <li>
              <strong>Autorización:</strong> Consentimiento previo, expreso e
              informado del Titular para llevar a cabo el Tratamiento de datos
              personales.
            </li>
            <li>
              <strong>Base de Datos:</strong> Conjunto organizado de datos
              personales que sea objeto de Tratamiento.
            </li>
            <li>
              <strong>Dato Personal:</strong> Cualquier información vinculada o
              que pueda asociarse a una o varias personas naturales determinadas
              o determinables.
            </li>
            <li>
              <strong>Encargado del Tratamiento:</strong> Persona natural o
              jurídica que realiza el Tratamiento de datos personales por cuenta
              del Responsable del Tratamiento.
            </li>
            <li>
              <strong>Responsable del Tratamiento:</strong> Persona natural o
              jurídica que decide sobre el Tratamiento de datos personales.
            </li>
            <li>
              <strong>Titular:</strong> Persona natural cuyos datos personales
              sean objeto de Tratamiento.
            </li>
            <li>
              <strong>Tratamiento:</strong> Cualquier operación sobre datos
              personales, tales como recolección, almacenamiento, uso,
              circulación o supresión.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            4. FINALIDADES DEL TRATAMIENTO
          </h2>
          <p>
            Los datos personales recolectados a través de nuestro bot de
            WhatsApp serán utilizados para las siguientes finalidades:
          </p>
          <h3 className="text-xl font-bold mt-4 mb-2">
            4.1 Finalidades Principales:
          </h3>
          <ul className="list-disc list-inside">
            <li>Brindar servicios de atención al cliente y soporte técnico</li>
            <li>Responder consultas, solicitudes e inquietudes</li>
            <li>Proveer información sobre productos y servicios</li>
            <li>Gestionar y procesar pedidos o solicitudes</li>
            <li>Enviar notificaciones relacionadas con el servicio</li>
            <li>
              Mantener un historial de conversaciones para mejorar el servicio
            </li>
          </ul>
          <h3 className="text-xl font-bold mt-4 mb-2">
            4.2 Finalidades Secundarias:
          </h3>
          <ul className="list-disc list-inside">
            <li>Realizar encuestas de satisfacción</li>
            <li>
              Enviar comunicaciones comerciales y promocionales (previa
              autorización)
            </li>
            <li>Realizar análisis estadísticos y de mejora del servicio</li>
            <li>Cumplir con obligaciones legales y regulatorias</li>
            <li>
              Ejercer los derechos y cumplir las obligaciones derivadas de la
              relación contractual
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            5. TIPOS DE DATOS RECOLECTADOS
          </h2>
          <p>
            Nuestro bot puede recopilar los siguientes tipos de información:
          </p>
          <h3 className="text-xl font-bold mt-4 mb-2">
            5.1 Datos de Identificación:
          </h3>
          <ul className="list-disc list-inside">
            <li>Nombre y apellidos</li>
            <li>Número de teléfono (WhatsApp)</li>
            <li>Número de documento de identidad (cuando sea necesario)</li>
          </ul>
          <h3 className="text-xl font-bold mt-4 mb-2">
            5.2 Datos de Contacto:
          </h3>
          <ul className="list-disc list-inside">
            <li>Número de WhatsApp</li>
            <li>Dirección de correo electrónico (si se proporciona)</li>
            <li>Dirección física (cuando sea requerida para el servicio)</li>
          </ul>
          <h3 className="text-xl font-bold mt-4 mb-2">
            5.3 Datos de la Conversación:
          </h3>
          <ul className="list-disc list-inside">
            <li>Mensajes intercambiados con el bot</li>
            <li>Fecha y hora de las interacciones</li>
            <li>Ubicación (solo si es compartida voluntariamente)</li>
            <li>
              Archivos multimedia compartidos (fotos, videos, documentos)
            </li>
          </ul>
          <h3 className="text-xl font-bold mt-4 mb-2">5.4 Datos Técnicos:</h3>
          <ul className="list-disc list-inside">
            <li>Metadatos de WhatsApp (información técnica de la plataforma)</li>
            <li>Información del dispositivo (cuando sea técnicamente necesaria)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            6. PRINCIPIOS PARA EL TRATAMIENTO DE DATOS
          </h2>
          <p>
            El tratamiento de sus datos personales se realizará con base en los
            siguientes principios:
          </p>
          <div className="space-y-2 mt-2">
            <p>
              <strong>6.1 Principio de Legalidad:</strong> El Tratamiento se
              realizará conforme a las disposiciones legales vigentes.
            </p>
            <p>
              <strong>6.2 Principio de Finalidad:</strong> El Tratamiento
              obedece a una finalidad legítima acorde con la Constitución y la
              ley.
            </p>
            <p>
              <strong>6.3 Principio de Libertad:</strong> El Tratamiento
              requiere el consentimiento libre, previo, expreso e informado del
              Titular.
            </p>
            <p>
              <strong>6.4 Principio de Veracidad o Calidad:</strong> La
              información objeto de Tratamiento debe ser veraz, completa, exacta
              y actualizada.
            </p>
            <p>
              <strong>6.5 Principio de Transparencia:</strong> Se garantiza el
              derecho del Titular a obtener información sobre el Tratamiento.
            </p>
            <p>
              <strong>6.6 Principio de Acceso y Circulación Restringida:</strong>{" "}
              Los datos solo son accesibles para personas autorizadas para el
              Tratamiento.
            </p>
            <p>
              <strong>6.7 Principio de Seguridad:</strong> Se adoptarán medidas
              técnicas, humanas y administrativas para proteger los datos.
            </p>
            <p>
              <strong>6.8 Principio de Confidencialidad:</strong> Todas las
              personas que intervienen en el Tratamiento están obligadas a
              guardar reserva.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            7. AUTORIZACIÓN Y CONSENTIMIENTO
          </h2>
          <h3 className="text-xl font-bold mt-4 mb-2">
            7.1 Obtención del Consentimiento:
          </h3>
          <p>
            Al iniciar una conversación con nuestro bot de WhatsApp, usted
            acepta esta Política de Tratamiento de Información y autoriza el
            tratamiento de sus datos personales para las finalidades descritas.
          </p>
          <h3 className="text-xl font-bold mt-4 mb-2">
            7.2 Consentimiento para Menores de Edad:
          </h3>
          <p>
            Para menores de edad, se requiere la autorización de los padres o
            representantes legales, conforme a la Ley 1098 de 2006.
          </p>
          <h3 className="text-xl font-bold mt-4 mb-2">
            7.3 Revocación del Consentimiento:
          </h3>
          <p>
            Puede revocar su autorización en cualquier momento a través de los
            canales establecidos en esta política.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            8. DERECHOS DE LOS TITULARES
          </h2>
          <p>
            Como titular de datos personales, usted tiene los siguientes
            derechos:
          </p>
          <div className="space-y-2 mt-2">
            <p>
              <strong>8.1 Derecho de Acceso:</strong> Conocer, actualizar y
              rectificar sus datos personales.
            </p>
            <p>
              <strong>8.2 Derecho de Actualización:</strong> Solicitar la
              actualización de sus datos cuando sea necesario.
            </p>
            <p>
              <strong>8.3 Derecho de Rectificación:</strong> Corregir datos
              parciales, inexactos, incompletos o fraccionados.
            </p>
            <p>
              <strong>8.4 Derecho de Supresión:</strong> Solicitar la eliminación
              de sus datos cuando no se requieran para las finalidades.
            </p>
            <p>
              <strong>8.5 Derecho de Revocación:</strong> Revocar la autorización
              otorgada para el Tratamiento.
            </p>
            <p>
              <strong>8.6 Derecho de Oposición:</strong> Solicitar la supresión
              de datos cuando considere que no se respetan los principios.
            </p>
            <p>
              <strong>8.7 Derecho a ser Informado:</strong> Recibir información
              sobre el uso dado a sus datos personales.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            9. PROCEDIMIENTO PARA EL EJERCICIO DE DERECHOS
          </h2>
          <h3 className="text-xl font-bold mt-4 mb-2">
            9.1 Canales de Atención:
          </h3>
          <p>Para ejercer sus derechos, puede contactarnos a través de:</p>
          <ul className="list-disc list-inside">
            <li>Correo electrónico: admin@caffelia.co</li>
            <li>WhatsApp: 3115244162</li>
            <li>Teléfono: 3115244162</li>
            <li>
              Dirección física: Carrera 1 #26-31, Cartago, Valle del Cauca,
              Colombia
            </li>
            <li>Horario de atención: 24/7</li>
          </ul>
          <h3 className="text-xl font-bold mt-4 mb-2">
            9.2 Información Requerida:
          </h3>
          <ul className="list-disc list-inside">
            <li>Nombre completo del titular</li>
            <li>Número de documento de identidad</li>
            <li>Número de teléfono registrado</li>
            <li>Descripción clara de la solicitud</li>
            <li>Documentos que soporten la solicitud (si aplica)</li>
          </ul>
          <h3 className="text-xl font-bold mt-4 mb-2">
            9.3 Plazos de Respuesta:
          </h3>
          <ul className="list-disc list-inside">
            <li>Consultas: Máximo 10 días hábiles</li>
            <li>Reclamos: Máximo 15 días hábiles</li>
            <li>Rectificación/Actualización: Máximo 5 días hábiles</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">10. MEDIDAS DE SEGURIDAD</h2>
          <p>Implementamos las siguientes medidas para proteger sus datos:</p>
          <h3 className="text-xl font-bold mt-4 mb-2">
            10.1 Medidas Técnicas:
          </h3>
          <ul className="list-disc list-inside">
            <li>Cifrado de extremo a extremo de WhatsApp</li>
            <li>Servidores seguros con protocolos HTTPS</li>
            <li>Copias de seguridad encriptadas</li>
            <li>Control de acceso mediante autenticación</li>
          </ul>
          <h3 className="text-xl font-bold mt-4 mb-2">
            10.2 Medidas Organizacionales:
          </h3>
          <ul className="list-disc list-inside">
            <li>Políticas internas de seguridad de la información</li>
            <li>Capacitación del personal en protección de datos</li>
            <li>Acuerdos de confidencialidad con colaboradores</li>
            <li>Auditorías periódicas de seguridad</li>
          </ul>
          <h3 className="text-xl font-bold mt-4 mb-2">
            10.3 Medidas Físicas:
          </h3>
          <ul className="list-disc list-inside">
            <li>Acceso restringido a instalaciones</li>
            <li>Sistemas de vigilancia y monitoreo</li>
            <li>Protección contra desastres naturales</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            11. TIEMPO DE CONSERVACIÓN
          </h2>
          <h3 className="text-xl font-bold mt-4 mb-2">
            11.1 Datos de Conversación:
          </h3>
          <p>
            Se conservarán por un período de 2 años desde la última interacción.
          </p>
          <h3 className="text-xl font-bold mt-4 mb-2">
            11.2 Datos de Contacto:
          </h3>
          <p>Se mantendrán mientras exista una relación comercial activa.</p>
          <h3 className="text-xl font-bold mt-4 mb-2">11.3 Supresión:</h3>
          <p>
            Los datos serán eliminados de manera segura al finalizar el período
            de retención, salvo obligación legal de conservación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            12. TRANSFERENCIAS INTERNACIONALES
          </h2>
          <h3 className="text-xl font-bold mt-4 mb-2">12.1 WhatsApp/Meta:</h3>
          <p>
            Los datos pueden ser transferidos a WhatsApp LLC (Estados Unidos)
            como parte del funcionamiento de la plataforma, con las garantías
            adecuadas de protección.
          </p>
          <h3 className="text-xl font-bold mt-4 mb-2">
            12.2 Proveedores de Servicios:
          </h3>
          <p>
            Podemos transferir datos a terceros proveedores ubicados en países
            con nivel adecuado de protección o con garantías apropiadas.
          </p>
          <h3 className="text-xl font-bold mt-4 mb-2">12.3 Salvaguardas:</h3>
          <p>
            Todas las transferencias se realizan con las medidas de protección
            requeridas por la ley colombiana.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            13. TRATAMIENTO DE DATOS SENSIBLES
          </h2>
          <p>
            No recolectamos intencionalmente datos sensibles. Si
            inadvertidamente recibimos información sensible (datos de salud,
            biométricos, etc.), será eliminada inmediatamente, salvo que sea
            estrictamente necesaria para el servicio y cuente con autorización
            expresa.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            14. INCIDENTES DE SEGURIDAD
          </h2>
          <p>
            En caso de un incidente de seguridad que pueda afectar sus datos
            personales:
          </p>
          <ul className="list-disc list-inside">
            <li>Notificaremos a la SIC dentro de las 72 horas</li>
            <li>Le informaremos sobre el incidente sin demora</li>
            <li>Implementaremos medidas correctivas inmediatas</li>
            <li>Documentaremos el incidente y las acciones tomadas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            15. CAMBIOS A ESTA POLÍTICA
          </h2>
          <h3 className="text-xl font-bold mt-4 mb-2">15.1 Actualizaciones:</h3>
          <p>
            Esta política puede ser actualizada para reflejar cambios en
            nuestras prácticas o en la legislación aplicable.
          </p>
          <h3 className="text-xl font-bold mt-4 mb-2">15.2 Notificación:</h3>
          <p>Los cambios importantes serán notificados a través de:</p>
          <ul className="list-disc list-inside">
            <li>Mensaje directo en WhatsApp</li>
            <li>Publicación en nuestro sitio web</li>
            <li>Correo electrónico (cuando esté disponible)</li>
          </ul>
          <h3 className="text-xl font-bold mt-4 mb-2">15.3 Vigencia:</h3>
          <p>
            Los cambios entrarán en vigor inmediatamente después de su
            publicación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            16. CONTACTO Y CONSULTAS
          </h2>
          <p>
            Para cualquier consulta relacionada con esta Política o el
            tratamiento de sus datos personales:
          </p>
          <div className="mt-2 space-y-1">
            <p>
              <strong>Caffelia Coffee SAS</strong>
            </p>
            <p>
              <strong>Oficial de Protección de Datos:</strong> Joan Manuel Serna
              Leiton
            </p>
            <p>
              <strong>Email:</strong> joan.serna@caffelia.co
            </p>
            <p>
              <strong>WhatsApp:</strong> 3115244162
            </p>
            <p>
              <strong>Teléfono:</strong> 3115244162
            </p>
            <p>
              <strong>Dirección:</strong> Carrera 1 #26-31
            </p>
            <p>
              <strong>Ciudad:</strong> Cartago, Colombia
            </p>
          </div>
          <h3 className="text-xl font-bold mt-4 mb-2">
            Superintendencia de Industria y Comercio (SIC)
          </h3>
          <p>
            En caso de no obtener respuesta satisfactoria, puede contactar a la
            SIC:
          </p>
          <ul className="list-disc list-inside">
            <li>Web: www.sic.gov.co</li>
            <li>Línea gratuita: 01 8000 910165</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">
            17. CUMPLIMIENTO Y SANCIONES
          </h2>
          <p>
            El incumplimiento de esta política puede acarrear las sanciones
            establecidas en la Ley 1581 de 2012 y sus decretos reglamentarios,
            incluyendo multas de hasta 2.000 salarios mínimos mensuales legales
            vigentes.
          </p>
        </section>

        <div className="mt-8 text-sm text-gray-600">
          <p>
            <strong>Fecha de última actualización:</strong> 25/07/2025
          </p>
          <p>
            Esta política se encuentra disponible en:{" "}
            <a
              href="https://caffelia.co/privacy-policy"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              https://caffelia.co/privacy-policy
            </a>
          </p>
          <p className="mt-4">
            Esta Política de Tratamiento de Información cumple con los
            requisitos establecidos en la Ley 1581 de 2012, el Decreto 1377 de
            2013, las políticas de WhatsApp Business Platform y las directrices
            de la Superintendencia de Industria y Comercio de Colombia.
          </p>
        </div>
      </div>
    </div>
  )
}