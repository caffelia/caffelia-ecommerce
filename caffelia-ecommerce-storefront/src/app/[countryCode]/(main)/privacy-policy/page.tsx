import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de Privacidad de Caffelia Ecommerce",
}

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-50 py-12 lg:py-24">
      <div className="content-container-mobile sm:content-container">
        <div className="prose prose-lg mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Política de Tratamiento de Datos Personales
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Última actualización: 1 de Julio de 2025
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            1. Introducción
          </h2>
          <p>
            En Caffelia Coffee S.A.S, (en adelante, "La Empresa"), nos comprometemos a proteger la información personal de nuestros clientes y usuarios. Esta política de tratamiento de datos personales (en adelante, la "Política") explica de manera clara cómo recopilamos, usamos, protegemos y compartimos tus datos personales para garantizar la transparencia y seguridad en su manejo, en cumplimiento con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.
          </p>
          <ul>
            <li><strong>Aceptación:</strong> El registro y uso de nuestras plataformas implica la aceptación expresa e informada de esta Política.</li>
            <li><strong>Restricción:</strong> Si no estás de acuerdo con los términos establecidos, te recomendamos no proporcionar tus datos personales en nuestras plataformas.</li>
          </ul>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            2. Responsable del Tratamiento
          </h2>
          <p>
            El responsable del tratamiento de sus datos personales es:
          </p>
          <ul>
            <li><strong>Razón Social:</strong> Caffelia Coffee S.A.S</li>
            <li><strong>NIT:</strong> 1112793743</li>
            <li><strong>Dirección:</strong> Carrera 1 # 26 - 31, Cartago, Colombia</li>
            <li><strong>Correo Electrónico:</strong> admin@caffelia.co</li>
            <li><strong>Teléfono:</strong> +57 311 524 4162</li>
          </ul>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            3. Datos Recopilados
          </h2>
          <p>
            La Empresa podrá recolectar los siguientes datos personales:
          </p>
          <ul>
            <li><strong>Datos Personales:</strong> Nombre completo, correo electrónico, dirección postal, número de teléfono, detalles de pago y facturación.</li>
            <li><strong>Datos de Dispositivo:</strong> Información sobre su navegador, dirección IP, zona horaria y cookies.</li>
            <li><strong>Datos de Uso del Sitio:</strong> Páginas visitadas, términos de búsqueda y acciones realizadas en el sitio.</li>
          </ul>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            4. Finalidades del Tratamiento de la Información
          </h2>
          <p>
            Sus datos personales serán utilizados para las siguientes finalidades:
          </p>
          <ol>
            <li><strong>Gestión de Solicitudes:</strong> Procesar sus compras, resolver problemas y actualizar datos.</li>
            <li><strong>Estadísticas y Administración:</strong> Controlar datos para una gestión eficiente de nuestro negocio.</li>
            <li><strong>Análisis y Mejora:</strong> Optimizar nuestros servicios y personalizar su experiencia de usuario.</li>
            <li><strong>Comunicación:</strong> Enviar promociones, actualizaciones y correos informativos. Usted podrá optar por no recibir estas comunicaciones (opt-out) en cualquier momento.</li>
            <li><strong>Facturación:</strong> Gestionar procesos de pagos y envío de facturas.</li>
            <li><strong>Prevención de Fraude:</strong> Detectar actividades fraudulentas y proteger las operaciones.</li>
            <li><strong>Seguridad:</strong> Implementar medidas técnicas y organizativas para la protección de sus datos.</li>
            <li><strong>Perfilado:</strong> Entender sus intereses y comportamiento para ofrecerle ofertas personalizadas.</li>
            <li><strong>Fidelización:</strong> Manejar Peticiones, Quejas, Reclamos y Sugerencias (PQRS) y actividades de atención al cliente.</li>
          </ol>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            5. Derechos del Titular de los Datos
          </h2>
          <p>
            Como titular de los datos personales, usted tiene los siguientes derechos:
          </p>
          <ul>
            <li><strong>Acceso y Rectificación:</strong> Conocer, actualizar y corregir sus datos personales.</li>
            <li><strong>Revocación del Consentimiento:</strong> Retirar su consentimiento para el tratamiento de datos en cualquier momento.</li>
            <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos cuando ya no sean necesarios para los fines recogidos.</li>
            <li><strong>Prueba de Autorización:</strong> Solicitar prueba de la autorización otorgada para el tratamiento de sus datos.</li>
            <li><strong>Quejas:</strong> Presentar reclamaciones ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.</li>
            <li><strong>Acceso Gratuito:</strong> Consultar sus datos personales sin costo alguno.</li>
          </ul>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            6. Procedimiento para el Ejercicio de Derechos
          </h2>
          <p>
            Para ejercer sus derechos, puede seguir el siguiente procedimiento:
          </p>
          <ol>
            <li>Contactar a nuestro canal de atención a través del correo electrónico: <strong>hola@latiendadelcafe.co</strong>.</li>
            <li>Proporcionar su identificación y una descripción clara del derecho que desea ejercer.</li>
            <li>La Empresa dará respuesta a su solicitud en un término máximo de quince (15) días hábiles.</li>
          </ol>
          
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            7. Intercambio y Transferencia de Información
          </h2>
          <p>
            Podemos compartir su información en los siguientes casos:
          </p>
          <ul>
              <li><strong>Proveedores de Servicios:</strong> Con plataformas como Shopify y Google Analytics para la operación de nuestro ecommerce.</li>
              <li><strong>Cumplimiento Legal:</strong> En respuesta a órdenes judiciales o administrativas de autoridades competentes.</li>
              <li><strong>Transferencias Internacionales:</strong> Las transferencias de datos a países que no ofrezcan un nivel adecuado de protección de datos se realizarán únicamente con su consentimiento previo, expreso e inequívoco, o si se enmarcan en las excepciones legales.</li>
          </ul>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            8. Medidas de Seguridad
          </h2>
          <p>
            Implementamos medidas técnicas, humanas y administrativas para proteger sus datos, incluyendo cifrado, controles de acceso y auditorías periódicas. Sin embargo, ningún sistema es completamente infalible.
          </p>
          
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            9. Política de Cookies
          </h2>
          <p>
            Utilizamos diferentes tipos de cookies:
          </p>
          <ul>
            <li><strong>Necesarias:</strong> Para funciones básicas como el inicio de sesión y el carrito de compras.</li>
            <li><strong>Rendimiento:</strong> Para análisis que nos ayudan a mejorar el sitio.</li>
            <li><strong>Publicidad:</strong> Para mostrarle anuncios personalizados.</li>
          </ul>
          <p>
            Puede configurar el uso de cookies desde su navegador, aunque esto puede limitar algunas funcionalidades del sitio.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            10. Actualizaciones de la Política
          </h2>
          <p>
            La Empresa puede modificar esta Política en cualquier momento. Los cambios se aplicarán tras su publicación en nuestro sitio web y se le informará de las actualizaciones significativas.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
