import React from "react"
import { IconProps } from "types/icon"

const Mastercard: React.FC<IconProps> = ({
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
      <circle cx="10" cy="12" r="7" fill="#EA001B" />
      <circle cx="22" cy="12" r="7" fill="#F79E1B" />
      <path
        d="M16 12C16 15.866 13.866 19 11 19C8.13401 19 6 15.866 6 12C6 8.13401 8.13401 5 11 5C13.866 5 16 8.13401 16 12Z"
        fill="#FF5F00"
      />
    </svg>
  )
}
export default Mastercard 