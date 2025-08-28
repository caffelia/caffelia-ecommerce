import { useActionState } from "react"

import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Input from "@modules/common/components/input"
import { login } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200"
      data-testid="login-page"
    >
      <h1 className="text-2xl font-bold text-center text-primary-900 mb-4">
        BIENVENIDO
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Inicia sesión para acceder a una experiencia de compra mejorada.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="Email *"
            name="email"
            type="email"
            title="Ingresa una dirección de email válida."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Contraseña *"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton
          data-testid="sign-in-button"
          className="w-full mt-6 h-11 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition-colors duration-300"
        >
          Iniciar Sesión
        </SubmitButton>
      </form>
      <div className="text-center text-gray-600 text-sm mt-6">
        ¿No eres miembro?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="font-semibold text-primary-600 hover:text-primary-700 underline transition-colors duration-200"
          data-testid="register-button"
        >
          Únete a nosotros
        </button>
        .
      </div>
    </div>
  )
}

export default Login
