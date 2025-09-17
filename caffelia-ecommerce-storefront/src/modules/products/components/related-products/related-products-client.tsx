"use client"

import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsClientProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const RelatedProductsClient: React.FC<RelatedProductsClientProps> = ({
  products,
  region,
}) => {
  return (
    <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
      {products.map((product) => (
        <li key={product.id}>
          <Product region={region} product={product} />
        </li>
      ))}
    </ul>
  )
}

export default RelatedProductsClient
