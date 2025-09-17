import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { clx } from "@medusajs/ui"

type ThumbnailGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  selectedIndex: number
  onImageSelect: (index: number) => void
}

const ThumbnailGallery = ({ images, selectedIndex, onImageSelect }: ThumbnailGalleryProps) => {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
      {images.map((image, index) => (
        <button
          key={image.id}
          onClick={() => onImageSelect(index)}
          className={clx(
            "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 flex-shrink-0",
            {
              "border-primary-500 ring-2 ring-primary-200": index === selectedIndex,
              "border-gray-200 hover:border-gray-300": index !== selectedIndex,
            }
          )}
        >
          {image.url && (
            <Image
              src={image.url}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          )}
          {index === selectedIndex && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export default ThumbnailGallery
