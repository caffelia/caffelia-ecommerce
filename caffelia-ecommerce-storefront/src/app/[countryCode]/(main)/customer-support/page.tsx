import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Soporte al Cliente",
  description: "Contacta con nosotros y encuentra respuestas a tus preguntas.",
}

const CustomerSupportPage = () => {
  return (
    <div className="bg-gray-50 py-12 lg:py-24">
      <div className="content-container-mobile sm:content-container">
        <div className="prose prose-lg mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Soporte al Cliente
          </h1>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            Contáctanos
          </h2>
          <p>
            Estamos aquí para ayudarte. Si tienes alguna pregunta o necesitas asistencia con tu pedido, no dudes in contactarnos a través de los siguientes canales:
          </p>
          <ul>
            <li><strong>Correo Electrónico:</strong> <a href="mailto:admin@caffelia.co">admin@caffelia.co</a></li>
            <li><strong>Teléfono:</strong> +57 311 524 4162</li>
            <li><strong>Horario de Atención:</strong> Lunes a Sábado de 8:00AM a 6:00PM</li>
          </ul>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            Preguntas Frecuentes (FAQ)
          </h2>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-900">¿Cómo puedo saber el estado de mi pedido?</h3>
            <p className="mt-2 text-gray-600">
              Una vez que su pedido haya sido despachado, recibirá un correo electrónico con el número de guía para que pueda rastrear su paquete directamente en el sitio web del transportista.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-900">¿Qué métodos de pago aceptan?</h3>
            <p className="mt-2 text-gray-600">
              Aceptamos una amplia variedad de métodos de pago, incluyendo tarjetas de crédito (Visa, Mastercard, American Express), PSE (Pagos Seguros en Línea) y pagos en efectivo a través de Efecty.
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-900">¿Puedo cambiar o devolver un producto?</h3>
            <p className="mt-2 text-gray-600">
              Sí, tienes un plazo de 5 días hábiles desde que recibes tu producto para solicitar un cambio o devolución, siempre y cuando el producto se encuentre en perfectas condiciones y en su empaque original. Para iniciar el proceso, por favor contáctanos a nuestro correo de soporte.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CustomerSupportPage
