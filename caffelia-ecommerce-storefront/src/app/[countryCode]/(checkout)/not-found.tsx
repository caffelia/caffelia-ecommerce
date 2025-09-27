import { Metadata } from "next"
import { Button } from "@medusajs/ui"
import Link from "next/link"
import { 
  HomeIcon, 
  MagnifyingGlassIcon,
  ShoppingCartIcon 
} from "@heroicons/react/24/outline"

export const metadata: Metadata = {
  title: "Página no encontrada - CAFFELIA",
  description: "La página que buscas no existe. Descubre nuestro café de especialidad colombiano.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header with Light Background */}
          <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-8 py-12 sm:px-12 sm:py-16">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl sm:text-9xl font-bold text-gray-700 mb-4 leading-none">
                404
              </h1>
              <div className="w-24 h-1 bg-gray-400 mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                ¡Ups! Página no encontrada
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                La página que buscas no existe o ha sido movida. Pero no te preocupes, 
                tenemos mucho café delicioso esperándote.
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-12 sm:px-12 sm:py-16">
            {/* Coffee Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 3H4v2h16V3zM2 21h20v-2H2v2zm2-4h16V7H4v10zm2-8h12v6H6V9z"/>
                </svg>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              {/* Primary CTA */}
              <Link href="/" className="block">
                <Button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 text-base">
                  <HomeIcon className="w-5 h-5" />
                  <span>Ir al inicio</span>
                </Button>
              </Link>

              {/* Secondary CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/store" className="block">
                  <Button className="w-full bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                    <MagnifyingGlassIcon className="w-4 h-4" />
                    <span>Explorar productos</span>
                  </Button>
                </Link>

                <Link href="/cart" className="block">
                  <Button className="w-full bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                    <ShoppingCartIcon className="w-4 h-4" />
                    <span>Ver carrito</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                ¿Necesitas ayuda? <span className="text-primary-600 font-medium cursor-pointer hover:underline">Contáctanos</span>
              </p>
              
              {/* Brand Message */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-primary-600">CAFFELIA</span> - 
                  Disfruta del auténtico café de especialidad de Colombia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-amber-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  )
}
