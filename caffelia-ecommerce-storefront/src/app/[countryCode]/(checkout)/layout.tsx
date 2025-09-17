import { Suspense } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import CartButton from "@modules/layout/components/cart-button"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      {/* Header matching main route design */}
      <div className="sticky top-0 inset-x-0 z-50 group">
        <header className="relative h-16 mx-auto border-b duration-200 border-primary-200 bg-white shadow-sm py-5">
          <nav className="content-container txt-xsmall-plus text-neutral-dark-700 flex items-center justify-between w-full h-full text-small-regular">
            {/* Back to cart link */}
            <div className="flex-1 basis-0 h-full flex items-center">
              <LocalizedClientLink
                href="/cart"
                className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase"
                data-testid="back-to-cart-link"
              >
                <ChevronDown className="rotate-90" size={16} />
                <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                  Volver al carrito
                </span>
                <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                  Volver
                </span>
              </LocalizedClientLink>
            </div>

            {/* Logo - matching main header */}
            <div className="flex items-center h-full">
              <LocalizedClientLink
                href="/"
                className="txt-compact-xlarge-plus hover:text-primary-700 text-secondary-900 uppercase font-bold transition-colors duration-200"
                data-testid="store-link"
              >
                <Image
                  src="/images/caffelia-icon-red-1.png"
                  width={180}
                  height={40}
                  alt="Caffelia"
                />
              </LocalizedClientLink>
            </div>

            {/* Cart button - matching main header */}
            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="text-lg hover:text-primary-700 text-neutral-dark-800 flex gap-2 transition-colors duration-200"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    Carrito (0)
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </nav>
        </header>
      </div>

      <div className="relative" data-testid="checkout-container">{children}</div>
      <div className="py-4 w-full flex items-center justify-center">
        <MedusaCTA />
      </div>
    </div>
  )
}
