import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y Condiciones de Caffelia Ecommerce",
}

const TermsAndConditionsPage = () => {
  return (
    <div className="bg-gray-50 py-12 lg:py-24">
      <div className="content-container-mobile sm:content-container">
        <div className="prose prose-lg mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Términos y Condiciones
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Última actualización: 1 de Julio de 2025
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            1. Información General
          </h2>
          <p>
            Estos Términos y Condiciones regulan el uso del sitio web de Caffelia Coffee (en adelante, "el Sitio Web"), administrado por Caffelia Coffee S.A.S., con NIT 1112793743, domiciliada en Carrera 1 # 26 - 31, Cartago, Colombia. Al acceder y utilizar este Sitio Web, usted acepta estar sujeto a estos términos.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            2. Uso del Sitio Web
          </h2>
          <p>
            Usted se compromete a utilizar el Sitio Web de manera lícita y para fines no prohibidos por la ley. Queda prohibido cualquier uso que pueda dañar, sobrecargar o perjudicar el Sitio Web o interferir con el uso de otros usuarios.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            3. Proceso de Compra
          </h2>
          <p>
            Para realizar una compra, debe seguir el procedimiento de compra online, agregar los productos al carrito y realizar el pago. Una vez completado, recibirá un correo electrónico confirmando su pedido ("Confirmación de Pedido"). Todos los pedidos están sujetos a la disponibilidad de los productos.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            4. Precios y Pago
          </h2>
          <p>
            Los precios de los productos se muestran en Pesos Colombianos (COP) e incluyen los impuestos aplicables, pero excluyen los gastos de envío, que se añadirán al total. Nos reservamos el derecho de cambiar los precios en cualquier momento, pero los cambios no afectarán a los pedidos para los que ya hayamos enviado una Confirmación de Pedido.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            5. Propiedad Intelectual
          </h2>
          <p>
            Todo el contenido del Sitio Web, incluyendo textos, gráficos, logos e imágenes, es propiedad de Caffelia Coffee S.A.S. o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual de Colombia e internacionales.
          </p>
          
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            6. Limitación de Responsabilidad
          </h2>
          <p>
            Salvo que se disponga lo contrario en la ley, nuestra responsabilidad en relación con cualquier producto adquirido en nuestro Sitio Web estará limitada estrictamente al precio de compra de dicho producto.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            7. Modificaciones
          </h2>
          <p>
            Nos reservamos el derecho de revisar y modificar estos Términos y Condiciones en cualquier momento. Usted estará sujeto a las políticas y condiciones vigentes en el momento en que use el Sitio Web o efectúe cada pedido.
          </p>
          
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            8. Ley Aplicable y Jurisdicción
          </h2>
          <p>
            El uso de nuestro Sitio Web y los contratos de compra de productos a través de dicho Sitio Web se regirán por la legislación de la República de Colombia. Cualquier controversia que surja o guarde relación con el uso del Sitio Web será sometida a la jurisdicción de los tribunfos de Colombia.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditionsPage
