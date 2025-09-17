import { useState } from "react"
import { clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import ChevronDown from "@modules/common/icons/chevron-down"

type ExpandableInfoProps = {
  product: HttpTypes.StoreProduct
}

const ExpandableInfo = ({ product }: ExpandableInfoProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const sections = [
    {
      key: "description",
      title: "Descripción",
      content: product.description || "No hay descripción disponible"
    },
    {
      key: "characteristics",
      title: "Características",
      content: product.handle || "No hay características disponibles"
    },
    {
      key: "score",
      title: "Puntaje (84)",
      content: "Este producto tiene una calificación de 84/100 basada en las reseñas de nuestros clientes."
    },
    {
      key: "reviews",
      title: "Reseñas",
      content: "No hay reseñas disponibles aún. Sé el primero en dejar una reseña."
    }
  ]

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.key} className="border border-ui-border-base rounded-lg">
          <button
            onClick={() => toggleSection(section.key)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-ui-bg-subtle transition-colors"
          >
            <span className="font-medium text-ui-fg-base">{section.title}</span>
            <ChevronDown
              className={clx(
                "w-4 h-4 transition-transform duration-200",
                {
                  "rotate-180": expandedSections[section.key]
                }
              )}
            />
          </button>
          {expandedSections[section.key] && (
            <div className="px-4 pb-3 border-t border-ui-border-base">
              <p className="text-sm text-ui-fg-subtle pt-3">
                {section.content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ExpandableInfo
