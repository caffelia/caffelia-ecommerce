"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  
  // Don't render anything if cart is empty
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Heading className="text-2xl sm:text-3xl font-bold text-gray-900">
          Carrito
        </Heading>
        <p className="text-sm text-gray-600 mt-2">
          {items.length} {items.length === 1 ? 'artículo' : 'artículos'} en tu carrito
        </p>
      </div>

      {/* Mobile Layout - Card-based Design */}
      <div className="lg:hidden space-y-3">
        {items
          .sort((a, b) => {
            return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
          })
          .map((item) => {
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Product Info Section */}
                <div className="p-4">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50">
                        <Thumbnail
                          thumbnail={item.thumbnail}
                          images={item.variant?.product?.images}
                          size="square"
                        />
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 leading-tight mb-1">
                        {item.product_title}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <LineItemOptions variant={item.variant} />
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        <LineItemPrice
                          item={item}
                          style="tight"
                          currencyCode={cart?.currency_code}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions Section */}
                <div className="px-4 pb-4 border-t border-gray-50">
                  <div className="flex items-center justify-between pt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 font-medium">Cantidad</span>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button 
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateLineItem({
                                lineId: item.id,
                                quantity: item.quantity - 1,
                              })
                            }
                          }}
                        >
                          −
                        </button>
                        <span className="w-12 h-8 flex items-center justify-center text-sm font-medium text-gray-900 bg-white">
                          {item.quantity}
                        </span>
                        <button 
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium"
                          onClick={() => {
                            updateLineItem({
                              lineId: item.id,
                              quantity: item.quantity + 1,
                            })
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          updateLineItem({
                            lineId: item.id,
                            quantity: 0,
                          })
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm font-medium">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="overflow-hidden">
          <Table>
            <Table.Header className="border-b border-gray-200">
              <Table.Row className="bg-gray-50">
                <Table.HeaderCell className="!pl-0 py-4 text-sm font-semibold text-gray-700">
                  Artículo
                </Table.HeaderCell>
                <Table.HeaderCell className="py-4 text-sm font-semibold text-gray-700">
                  Cantidad
                </Table.HeaderCell>
                <Table.HeaderCell className="py-4 text-sm font-semibold text-gray-700 text-right">
                  Precio
                </Table.HeaderCell>
                <Table.HeaderCell className="!pr-0 py-4 text-sm font-semibold text-gray-700 text-right">
                  Total
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default ItemsTemplate
