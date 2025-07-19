import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: [collection.id],
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  // Show "CAFÉS DE ESPECIALIDAD" for coffee collections
  const displayTitle = collection.title?.toLowerCase().includes('new') || !collection.title ? 
    'CAFÉS DE ESPECIALIDAD' : collection.title.toUpperCase()

  return (
    <div className="content-container py-12 small:py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl small:text-3xl font-bold text-neutral-dark-900 tracking-tight">
          {displayTitle}
        </h2>
        <div className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200">
          <InteractiveLink href={`/collections/${collection.handle}`}>
            Ver Todo
          </InteractiveLink>
        </div>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-4 small:gap-6">
        {pricedProducts &&
          pricedProducts.slice(0, 4).map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
