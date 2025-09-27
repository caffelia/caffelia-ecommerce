"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Heading level="h2" className="text-2xl sm:text-3xl font-bold text-gray-900">
          Resumen
        </Heading>
        <p className="text-sm text-gray-600 mt-2">
          Revisa tu pedido antes de continuar
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Discount Code */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <DiscountCode cart={cart} />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Cart Totals */}
        <div className="space-y-4">
          <CartTotals totals={cart} />
        </div>

        {/* Checkout Button */}
        <div className="pt-4">
          <LocalizedClientLink
            href={"/checkout?step=" + step}
            data-testid="checkout-button"
          >
            <Button className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
              Ir a pagar
            </Button>
          </LocalizedClientLink>
        </div>

        {/* Security Badge */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Compra segura y protegida</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Summary
