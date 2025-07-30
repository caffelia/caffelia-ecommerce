import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-gradient-to-r from-primary-25 to-primary-50 flex items-center justify-between p-6 rounded-lg border border-primary-200">
      <div>
        <Heading level="h2" className="txt-xlarge text-secondary-900 font-bold">
          ¿Ya tienes una cuenta?
        </Heading>
        <Text className="txt-medium text-neutral-dark-700 mt-2 font-medium">
          Inicia sesión para una mejor experiencia.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button 
            variant="secondary" 
            className="h-10 bg-primary-500 hover:bg-primary-600 text-white border-0 font-semibold" 
            data-testid="sign-in-button"
          >
            Iniciar Sesión
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
