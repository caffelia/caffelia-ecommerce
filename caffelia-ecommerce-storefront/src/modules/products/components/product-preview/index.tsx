"use client"

import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import StarRating from "@modules/common/components/star-rating"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Generate a deterministic rating between 4.0 and 5.0 for coffee products
  // Use product ID to create a consistent rating that's the same on server and client
  const getDeterministicRating = (productId: string) => {
    let hash = 0
    for (let i = 0; i < productId.length; i++) {
      const char = productId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    // Convert hash to a value between 0 and 1, then scale to 4.0-5.0
    return 4.0 + (Math.abs(hash) % 100) / 100
  }
  
  const rating = getDeterministicRating(product.id)

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div 
        data-testid="product-wrapper" 
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/60 hover:border-primary-200"
      >
        {/* Product Image - Smaller and more compact */}
        <div className="relative overflow-hidden bg-gray-50">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="group-hover:scale-105 transition-transform duration-300 border-0 shadow-none bg-transparent p-2"
          />
        </div>
        
        {/* Product Info - More compact spacing */}
        <div className="p-4 space-y-3">
          {/* Product Title */}
          <h3 
            className="text-sm font-semibold text-neutral-dark-900 line-clamp-2 group-hover:text-primary-700 transition-colors duration-200 leading-tight" 
            data-testid="product-title"
          >
            {product.title}
          </h3>
          
          {/* Star Rating */}
          <StarRating 
            rating={Number(rating.toFixed(1))} 
            size="sm"
            showRating={true}
            className="text-xs"
          />
          
          {/* Price Section */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
            {cheapestPrice?.price_type === "sale" && (
              <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-md font-medium">
                -{Math.round(((parseFloat(cheapestPrice.original_price?.replace(/[^0-9.-]+/g,"") || "0") - parseFloat(cheapestPrice.calculated_price?.replace(/[^0-9.-]+/g,"") || "0")) / parseFloat(cheapestPrice.original_price?.replace(/[^0-9.-]+/g,"") || "1")) * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
