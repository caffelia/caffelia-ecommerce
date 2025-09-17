import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductPrice } from "@lib/util/get-product-price"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-sm text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base font-bold"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <div className="flex items-center gap-x-2">
          <span className="text-2xl font-bold text-ui-fg-base">
            {(() => {
              const { cheapestPrice } = getProductPrice({ product })
              return cheapestPrice ? cheapestPrice.calculated_price : 'N/A'
            })()}
          </span>
          <div className="flex items-center gap-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span className="text-sm text-ui-fg-subtle">
              Apúrate, pocas unidades disponibles!
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
