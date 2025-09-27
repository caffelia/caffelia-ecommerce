import { Heading, Text, Button } from "@medusajs/ui";
import Image from "next/image"; 

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { 
  ShoppingCartIcon, 
  MagnifyingGlassIcon,
  SparklesIcon 
} from "@heroicons/react/24/outline";

const EmptyCartMessage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header with Light Background */}
          <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-6 py-8 sm:px-8 sm:py-12">
            {/* Icon Container */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Background Circle */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                  <ShoppingCartIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                {/* Floating Sparkles */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <SparklesIcon className="w-3 h-3 text-yellow-600" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>

            {/* Title */}
            <Heading
              level="h1"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 text-center"
            >
              Tu carrito está vacío
            </Heading>

            {/* Subtitle */}
            <Text className="text-sm sm:text-base text-gray-600 mb-8 text-center leading-relaxed max-w-sm mx-auto">
              Parece que aún no has añadido nada a tu carrito. ¡Empieza a explorar nuestros productos!
            </Text>
          </div>

          {/* Content Section */}
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>Productos de alta calidad</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>Envío rápido y seguro</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>Garantía de satisfacción</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              {/* Primary CTA */}
              <LocalizedClientLink href="/store" passHref>
                <Button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 text-base">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Explorar productos</span>
                </Button>
              </LocalizedClientLink>

              {/* Secondary CTA */}
              <div className="pt-2">
                <LocalizedClientLink href="/collections" passHref>
                  <Button className="w-full bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                    <ShoppingCartIcon className="w-4 h-4" />
                    <span>Ver colecciones</span>
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="mt-8 text-center">
              <Text className="text-xs text-gray-500">
                ¿Necesitas ayuda? <span className="text-primary-600 font-medium cursor-pointer hover:underline">Contáctanos</span>
              </Text>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCartMessage;
