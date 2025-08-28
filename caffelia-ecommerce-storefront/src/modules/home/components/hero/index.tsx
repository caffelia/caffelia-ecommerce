import { Button, Heading } from "@medusajs/ui"
import UnderlineLink from "@modules/common/components/underline-link"
import Image from "next/image"
import Facebook from "@modules/common/icons/facebook"
import Instagram from "@modules/common/icons/instagram"
import Twitter from "@modules/common/icons/twitter"

const Hero = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-primary-50 to-secondary-100 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-8 h-8 bg-accent-600 transform rotate-45 opacity-60"></div>
      <div className="absolute top-32 right-32 w-6 h-6 bg-primary-400 rounded-full opacity-40"></div>
      <div className="absolute bottom-20 left-20 w-4 h-4 bg-secondary-500 transform rotate-45 opacity-50"></div>

      <div className="h-[75vh] flex items-center justify-between max-w-7xl mx-auto px-6 lg:px-8">
        {/* Content Section */}
        <div className="flex-1 z-10 max-w-2xl">
          <div className="space-y-6">
            <Heading
              level="h1"
              className="text-5xl lg:text-6xl font-bold text-neutral-dark-900 leading-tight"
            >
              DESCUBRE CAFÉ
              <br />
              <span className="text-primary-600">DE ORIGEN</span>
              <br />
              COLOMBIANO
            </Heading>

            <p className="text-lg text-neutral-dark-700 max-w-lg leading-relaxed">
              Explora nuestra selección de cafés premium cuidadosamente tostados,
              desde granos de origen único hasta mezclas artesanales que despiertan tus sentidos.
            </p>

            <div className="pt-4">
              <Button
                size="large"
                className="bg-primary-800 hover:bg-primary-700 text-white px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Comprar Ahora
              </Button>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-1 relative hidden lg:block">
          <div className="relative">
            {/* Placeholder for main image - replace with actual image */}
            <div className="w-full h-96 bg-gradient-to-br from-secondary-200 to-primary-300 rounded-2xl shadow-2xl flex items-center justify-center">
              <span className="text-neutral-dark-600 text-xl font-medium">
                Imagen de Café Premium
              </span>
            </div>

            {/* Decorative accent */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-accent-500 rounded-full opacity-80"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-primary-500 transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Promotional Banner */}
      <div className="bg-neutral-dark-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-400">25% OFF</p>
                <p className="text-sm text-gray-300">Cafés de Origen</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <p className="text-lg font-semibold">ENVÍO GRATIS</p>
                <p className="text-sm text-gray-300">En compras superiores a $80.000</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <p className="text-lg font-semibold">TOSTADO FRESCO</p>
                <p className="text-sm text-gray-300">Semanalmente</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Síguenos:</span>
              <div className="flex space-x-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-500 transition-colors"
                >
                  <Instagram className="text-white" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-500 transition-colors"
                >
                  <Facebook className="text-white" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-500 transition-colors"
                >
                  <Twitter className="text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero