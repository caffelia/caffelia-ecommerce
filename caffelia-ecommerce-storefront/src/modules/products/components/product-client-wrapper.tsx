"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ThumbnailGallery from "./thumbnail-gallery"
import MainProductImage from "./main-product-image"
import ProductInfo from "../templates/product-info"
import ProductActions from "./product-actions"
import ExpandableInfo from "./expandable-info"

type ProductClientWrapperProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  images: HttpTypes.StoreImage[]
}

const ProductClientWrapper: React.FC<ProductClientWrapperProps> = ({
  product,
  region,
  images,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  return (
    <div
      className="content-container flex flex-col lg:flex-row gap-8 py-6 relative"
      data-testid="product-container"
    >
      {/* Left Column - Thumbnail Gallery */}
      <div className="order-2 lg:order-1 lg:w-24 lg:flex-shrink-0">
        <ThumbnailGallery
          images={images}
          selectedIndex={selectedImageIndex}
          onImageSelect={setSelectedImageIndex}
        />
      </div>

      {/* Center Column - Main Product Image */}
      <div className="order-1 lg:order-2 flex-1 lg:max-w-2xl">
        <MainProductImage
          images={images}
          selectedIndex={selectedImageIndex}
        />
      </div>

      {/* Right Column - Product Information Panel */}
      <div className="order-3 lg:w-96 lg:flex-shrink-0">
        <div className="lg:sticky lg:top-24 space-y-6">
          <ProductInfo product={product} />
          <ProductActions
            product={product}
            region={region}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
          <ExpandableInfo product={product} />
        </div>
      </div>
    </div>
  )
}

export default ProductClientWrapper
