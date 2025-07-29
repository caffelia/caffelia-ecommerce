import React from "react"
import { IconProps } from "types/icon"

const AmericanExpress: React.FC<IconProps> = ({
  size = "32",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <rect width="32" height="24" rx="3" fill="#006FCF" />
      <path
        d="M16 12H22V10H16V12ZM16 14H22V16H16V14Z"
        fill="white"
      />
      <path
        d="M10 10H14V12H10V10ZM10 14H14V16H10V14Z"
        fill="white"
      />
    </svg>
  )
}

export default AmericanExpress 