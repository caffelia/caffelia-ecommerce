import { Suspense } from "react"
import Image from "next/image"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { ShoppingCartIcon } from "@heroicons/react/24/outline"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 border-primary-200 bg-white shadow-sm py-5">
        <nav className="content-container txt-xsmall-plus text-neutral-dark-700 flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-primary-700 text-secondary-900 uppercase font-bold transition-colors duration-200"
              data-testid="nav-store-link"
            >
              <Image
                src="/images/caffelia-icon-red-1.png"
                width={180}
                height={40}
                alt="Caffelia"
              />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-8 h-full flex-1 basis-0 justify-end align-middle">
            <div className="hidden small:flex items-center h-full">
              <LocalizedClientLink
                className="text-lg hover:text-primary-700 text-neutral-dark-800 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                href="/account"
                data-testid="nav-account-link"
              >
                Cuenta
              </LocalizedClientLink>
            </div>
            <div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-lg hover:text-primary-700 text-neutral-dark-800 flex items-center gap-2 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Carrito (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
