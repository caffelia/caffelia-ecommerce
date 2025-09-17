import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"
import { clx } from "@medusajs/ui"

type MainProductImageProps = {
  images: HttpTypes.StoreProductImage[]
  selectedIndex: number
}

const MainProductImage = ({ images, selectedIndex }: MainProductImageProps) => {
  const [isZoomed, setIsZoomed] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    )
  }

  const selectedImage = images[selectedIndex]

  return (
    <div className="relative">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
        {selectedImage?.url && (
          <Image
            src={selectedImage.url}
            alt={`Product image ${selectedIndex + 1}`}
            fill
            className={clx(
              "object-contain transition-transform duration-300 cursor-zoom-in",
              {
                "scale-110": isZoomed,
              }
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onClick={() => setIsZoomed(!isZoomed)}
            priority={selectedIndex <= 2}
          />
        )}
      </div>
      
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={clx(
                "w-2 h-2 rounded-full transition-all duration-200",
                {
                  "bg-primary-500": index === selectedIndex,
                  "bg-gray-300 hover:bg-gray-400": index !== selectedIndex,
                }
              )}
              onClick={() => setIsZoomed(false)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MainProductImage
