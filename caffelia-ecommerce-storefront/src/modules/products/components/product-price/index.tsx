import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-primary-100 animate-pulse rounded-md" />
  }

  return (
    <div className="flex flex-col text-neutral-dark-800">
      <span
        className={clx("text-xl-semi font-bold", {
          "text-secondary-600": selectedPrice.price_type === "sale",
          "text-neutral-dark-900": selectedPrice.price_type !== "sale",
        })}
      >
        {!variant && "Desde "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-neutral-600">Original: </span>
            <span
              className="line-through text-neutral-500"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-secondary-600 font-semibold">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
