import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import ProductShowcase from "@modules/products/components/product-showcase"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  // Get products from the first collection for the showcase
  const firstCollection = collections[0]
  
  if (!firstCollection) {
    return null
  }

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: [firstCollection.id],
      fields: "*variants.calculated_price",
      limit: 4, // Limit to 4 products for showcase
    },
  })

  if (!products?.length) {
    return null
  }

  return (
    <section className="relative overflow-hidden">
      {/* Enhanced Gradient Background for entire section */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-red-50 to-amber-50"></div>
      
      {/* Content */}
      <div className="relative content-container py-16 small:py-24">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h2 className="text-3xl small:text-4xl font-bold text-secondary-900 tracking-tight mb-4">
              CAFÉS DE ESPECIALIDAD
            </h2>
            <p className="text-neutral-dark-700 text-lg max-w-2xl mx-auto font-medium">
              Explora nuestros cafés cuidadosamente seleccionados de las mejores fincas del mundo
            </p>
          </div>
{/*           <div className="hidden small:block">
            <LocalizedClientLink href={`/collections/${firstCollection.handle}`}>
              <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Ver Todo
              </button>
            </LocalizedClientLink>
          </div> */}
        </div>
        
        <ProductShowcase products={products} region={region} />
        
        
          </div>
    </section>
  )
}
