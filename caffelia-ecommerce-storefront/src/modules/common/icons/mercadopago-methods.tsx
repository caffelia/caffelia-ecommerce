import React from "react"
import Image from "next/image"

interface MercadoPagoMethodsProps {
  size?: string | number
  color?: string
  className?: string
}

const MercadoPagoMethods: React.FC<MercadoPagoMethodsProps> = ({
  size = "32",
  className = "",
}) => {
  const sizeNum = parseInt(size.toString())
  return (
    <Image
      src="/images/mercadopago-methods.webp"
      alt="MercadoPago payment methods"
      width={sizeNum * 6}
      height={sizeNum * 1.5}
      className={className}
      style={{ 
        objectFit: "contain",
        maxWidth: "300px",
        height: "auto"
      }}
    />
  )
}

export default MercadoPagoMethods 