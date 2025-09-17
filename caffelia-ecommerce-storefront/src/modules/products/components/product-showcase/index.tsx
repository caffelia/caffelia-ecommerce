import { HttpTypes } from "@medusajs/types"
import ProductPreview from "../product-preview"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ProductShowcaseProps {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ products, region }) => {
  const coffeeDescriptions = [
    {
      title: "Café de Especialidad Premium",
      description: "Descubre nuestros granos de café seleccionados cuidadosamente de las mejores fincas del mundo. Cada taza te transporta a un viaje sensorial único, con notas distintivas que resaltan el terroir de cada región.",
      features: [
        { name: "100% Arábica", icon: "🌱" },
        { name: "Tueste Artesanal", icon: "🔥" },
        { name: "Origen Único", icon: "🌍" },
        { name: "Comercio Justo", icon: "🤝" }
      ],
      origin: "Colombia",
      altitude: "1,800m",
      process: "Lavado",
      rating: 4.8,
      reviews: 127,
      notes: ["Chocolate", "Caramelo", "Cítricos"],
      certification: "Honey"
    },
    {
      title: "Experiencia de Café Auténtica",
      description: "Sumérgete en la cultura del café con nuestras variedades exclusivas. Desde el proceso de selección hasta el momento de servir, cada paso está diseñado para ofrecerte la experiencia de café más auténtica.",
      features: [
        { name: "Tostado Diario", icon: "☀️" },
        { name: "Empaque Hermético", icon: "📦" },
        { name: "Trazabilidad Completa", icon: "🔍" },
        { name: "Sostenible", icon: "🌿" }
      ],
      origin: "Brasil",
      altitude: "1,200m", 
      process: "Natural",
      rating: 4.6,
      reviews: 94,
      notes: ["Nueces", "Frutal", "Miel"],
      certification: "Suave lavado"
    }
  ]

  return (
    <div className="space-y-16 md:space-y-20">
      {products.map((product, index) => {
        const description = coffeeDescriptions[index] || coffeeDescriptions[0]
        const isEven = index % 2 === 0

        return (
          <div 
            key={product.id} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Product Card - Smaller size */}
            <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'} order-1`}>
              <div className="max-w-xs mx-auto lg:max-w-sm">
                <ProductPreview product={product} region={region} isFeatured />
              </div>
            </div>

            {/* Enhanced Description Section */}
            <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} order-2 space-y-6`}>
              {/* Header with rating and certification badge */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-secondary-900 leading-tight mb-2">
                    {description.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-primary-500 text-lg">★</span>
                      <span className="font-semibold text-neutral-dark-900">{description.rating}</span>
                      <span className="text-sm text-neutral-600">({description.reviews} reseñas)</span>
                    </div>
                  </div>
                </div>
                <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {description.certification}
                </div>
              </div>

              <p className="text-neutral-dark-700 text-base md:text-lg leading-relaxed">
                {description.description}
              </p>
              <h2 className="font-bold text-secondary-900 mb-2">Notas de Sabor</h2>
                <div className="flex flex-wrap gap-2">
                  {description.notes.map((note, noteIndex) => (
                    <span 
                      key={noteIndex}
                      className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <LocalizedClientLink href={`/products/${product.handle}`} className="w-1/2">
                    <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      Comprar Ahora
                    </button>
                  </LocalizedClientLink>
                </div>

              {/* Flavor Notes */}
              {/* <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/60">
          
              </div> */}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductShowcase 