import React from "react"
import { IconProps } from "types/icon"

const Codensa: React.FC<IconProps> = ({
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
      <rect width="32" height="24" rx="3" fill="#FFD700" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Arial"
        fontSize="8"
        fill="#000"
      >
        Codensa
      </text>
    </svg>
  )
}

export default Codensa 