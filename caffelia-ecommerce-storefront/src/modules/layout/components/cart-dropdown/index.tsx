"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { 
  ShoppingCartIcon, 
  MagnifyingGlassIcon 
} from "@heroicons/react/24/outline"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="relative hover:text-primary-600 text-neutral-dark-800 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group flex items-center gap-2"
            href="/cart"
            data-testid="nav-cart-link"
          >
            <div className="relative">
              <ShoppingCartIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-lg">
                  {totalItems}
                </span>
              )}
            </div>
            <span>Carrito</span>
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 translate-y-2 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-2 scale-95"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+8px)] right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 w-[420px] text-neutral-dark-800 overflow-hidden backdrop-blur-sm"
            data-testid="nav-cart-dropdown"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Carrito</h3>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-full px-3 py-1">
                    <span className="text-sm font-semibold">{totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}</span>
                  </div>
                </div>
              </div>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                {/* Cart Items */}
                <div className="overflow-y-auto max-h-[400px] px-6 py-4 space-y-4">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-md"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <LocalizedClientLink
                            href={`/products/${item.product_handle}`}
                            className="flex-shrink-0"
                          >
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300">
                              <Thumbnail
                                thumbnail={item.thumbnail}
                                images={item.variant?.product?.images}
                                size="square"
                              />
                            </div>
                          </LocalizedClientLink>
                          
                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors duration-200">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                    className="hover:text-primary-600"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <div className="mt-1">
                                  <LineItemOptions
                                    variant={item.variant}
                                    data-testid="cart-item-variant"
                                    data-value={item.variant}
                                  />
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span
                                    className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full"
                                    data-testid="cart-item-quantity"
                                    data-value={item.quantity}
                                  >
                                    Cantidad: {item.quantity}
                                  </span>
                                  <div className="text-right">
                                    <LineItemPrice
                                      item={item}
                                      style="tight"
                                      currencyCode={cartState.currency_code}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <div className="mt-3 flex justify-end">
                              <DeleteButton
                                id={item.id}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200"
                                data-testid="cart-item-remove-button"
                              >
                                Eliminar
                              </DeleteButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {/* Footer */}
                <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5">
                  <div className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          Subtotal
                        </span>
                        <span className="text-xs text-gray-500">
                          (sin impuestos)
                        </span>
                      </div>
                      <span
                        className="text-xl font-bold text-primary-600"
                        data-testid="cart-subtotal"
                        data-value={subtotal}
                      >
                        {convertToLocale({
                          amount: subtotal,
                          currency_code: cartState.currency_code,
                        })}
                      </span>
                    </div>
                    
                    {/* CTA Button */}
                    <LocalizedClientLink href="/cart" passHref>
                      <Button
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                        size="large"
                        data-testid="go-to-cart-button"
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        Ir al carrito
                      </Button>
                    </LocalizedClientLink>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-6 py-12">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  {/* Empty Cart Icon */}
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <ShoppingCartIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">0</span>
                    </div>
                  </div>
                  
                  {/* Empty State Text */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Tu carrito está vacío</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Agrega algunos productos deliciosos para comenzar tu pedido
                    </p>
                  </div>
                  
                  {/* CTA Button */}
                  <LocalizedClientLink href="/store">
                    <Button 
                      onClick={close}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      <MagnifyingGlassIcon className="w-5 h-5" />
                      Explorar productos
                    </Button>
                  </LocalizedClientLink>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
