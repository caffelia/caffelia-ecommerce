"use client"

import React, { Suspense, useState } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ThumbnailGallery from "@modules/products/components/thumbnail-gallery"
import MainProductImage from "@modules/products/components/main-product-image"
import ExpandableInfo from "@modules/products/components/expandable-info"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product || !product.id) {
    return notFound()
  }

  const images = product?.images || []

  return (
    <>
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
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
