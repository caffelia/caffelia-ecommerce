import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="p-6 sm:p-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <Heading level="h2" className="text-lg sm:text-xl font-bold text-gray-900">
                  ¿Ya tienes una cuenta?
                </Heading>
              </div>
            </div>
            <Text className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Inicia sesión para una mejor experiencia de compra y acceso a tu historial de pedidos.
            </Text>
          </div>
          
          {/* Button */}
          <div className="flex-shrink-0">
            <LocalizedClientLink href="/account">
              <Button 
                className="w-full sm:w-auto h-12 sm:h-11 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                data-testid="sign-in-button"
              >
                Iniciar Sesión
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPrompt
