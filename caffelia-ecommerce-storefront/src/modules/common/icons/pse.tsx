import React from "react"
import { IconProps } from "types/icon"

const PSE: React.FC<IconProps> = ({
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
      <rect width="32" height="24" rx="3" fill="#FBFBFB" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Arial"
        fontSize="10"
        fill="#000"
      >
        PSE
      </text>
    </svg>
  )
}

export default PSE 