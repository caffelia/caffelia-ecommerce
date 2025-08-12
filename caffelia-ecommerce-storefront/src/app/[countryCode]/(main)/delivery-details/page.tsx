import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Detalles de Envío",
  description: "Información sobre envíos, costos y tiempos de entrega de Caffelia Ecommerce.",
}

const DeliveryDetailsPage = () => {
  return (
    <div className="bg-gray-50 py-12 lg:py-24">
      <div className="content-container-mobile sm:content-container">
        <div className="prose prose-lg mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Detalles de Envío
          </h1>
          
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            Tiempos de Entrega
          </h2>
          <p>
            Nos esforzamos por procesar y despachar todos los pedidos lo más rápido posible. A continuación, se detallan nuestros tiempos de entrega estimados:
          </p>
          <ul>
            <li><strong>Ciudades Principales:</strong> 1-3 días hábiles</li>
            <li><strong>Otras Ciudades y Municipios:</strong> 3-5 días hábiles</li>
          </ul>
          <p>
            Tenga en cuenta que los tiempos de entrega son estimados y pueden variar durante temporadas altas o debido a circunstancias imprevistas que afecten a nuestros transportistas.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            Costos de Envío
          </h2>
          <p>
            El costo del envío se calculará automáticamente durante el proceso de pago, basado en la dirección de entrega.
          </p>
          <ul>
            <li><strong>Costo para Ciudades Principales:</strong> $10,000 COP</li>
            <li><strong>Costo para Otras Regiones:</strong> $15,000 COP</li>
            <li>Ofrecemos <strong>envío gratuito</strong> para compras superiores a $100,000 COP.</li>
          </ul>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            Transportistas
          </h2>
          <p>
            Trabajamos con las principales empresas de mensajería de Colombia para garantizar que su pedido llegue de forma segura y a tiempo. Nuestro principal transportista es:
          </p>
          <ul>
            <li>Servientrega</li>
          </ul>
          
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            Seguimiento de Pedidos
          </h2>
          <p>
            Una vez que su pedido haya sido despachado, recibirá un correo electrónico con el número de guía para que pueda rastrear su paquete directamente en el sitio web del transportista.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DeliveryDetailsPage
