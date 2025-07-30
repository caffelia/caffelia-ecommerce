import React from "react"
import { IconProps } from "types/icon"

const DinersClub: React.FC<IconProps> = ({
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
      <rect width="32" height="24" rx="3" fill="white" />
      <circle cx="16" cy="12" r="8" fill="#006FCF" />
      <path
        d="M16 4C11.5817 4 8 7.58172 8 12C8 16.4183 11.5817 20 16 20C20.4183 20 24 16.4183 24 12C24 7.58172 20.4183 4 16 4ZM16 18C12.6863 18 10 15.3137 10 12C10 8.68629 12.6863 6 16 6C19.3137 6 22 8.68629 22 12C22 15.3137 19.3137 18 16 18Z"
        fill="white"
      />
    </svg>
  )
}

export default DinersClub 