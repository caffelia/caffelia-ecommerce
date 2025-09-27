import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="content-container py-6 sm:py-8 lg:py-12" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="space-y-6 lg:space-y-0">
            {/* Mobile Layout */}
            <div className="lg:hidden space-y-6">
              {/* Sign In Prompt - Mobile */}
              {!customer && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <SignInPrompt />
                </div>
              )}
              
              {/* Cart Items - Mobile */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <ItemsTemplate cart={cart} />
              </div>
              
              {/* Summary - Mobile */}
              {cart && cart.region && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <Summary cart={cart as any} />
                </div>
              )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-8 space-y-6">
                {/* Sign In Prompt - Desktop */}
                {!customer && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <SignInPrompt />
                  </div>
                )}
                
                {/* Cart Items - Desktop */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <ItemsTemplate cart={cart} />
                </div>
              </div>
              
              {/* Right Column - Summary */}
              <div className="lg:col-span-4">
                {cart && cart.region && (
                  <div className="sticky top-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <Summary cart={cart as any} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
