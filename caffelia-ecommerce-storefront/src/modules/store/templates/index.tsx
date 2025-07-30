import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-25 via-white to-primary-50">
      <div
        className="flex flex-col small:flex-row small:items-start py-6 content-container"
        data-testid="category-container"
      >
        <RefinementList sortBy={sort} />
        <div className="w-full">
          <div className="mb-8 text-center">
            <h1 
              className="text-3xl font-bold text-secondary-900 mb-2 tracking-tight" 
              data-testid="store-page-title"
            >
              CAFÉS DE ESPECIALIDAD
            </h1>
            <p className="text-neutral-dark-700 text-base max-w-2xl mx-auto font-medium">
              Explora nuestros cafés cuidadosamente seleccionados de las mejores fincas del mundo. 
              Cada variedad ofrece un perfil de sabor único para una experiencia extraordinaria.
            </p>
          </div>
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
