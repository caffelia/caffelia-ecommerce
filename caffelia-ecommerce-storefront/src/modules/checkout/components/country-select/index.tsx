import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { HttpTypes } from "@medusajs/types"

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    region?: HttpTypes.StoreRegion
    label?: string
  }
>(({ placeholder = "País", region, defaultValue, label, ...props }, ref) => {
  const innerRef = useRef<HTMLSelectElement>(null)

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  )

  const countryOptions = useMemo(() => {
    if (!region) {
      return []
    }

    return region.countries?.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    }))
  }, [region])

  return (
    <div className="flex flex-col w-full">
      <div className="flex relative z-0 w-full txt-compact-medium">
        <NativeSelect
          ref={innerRef}
          placeholder={label || placeholder}
          defaultValue={defaultValue}
          {...props}
        >
          {countryOptions?.map(({ value, label }, index) => (
            <option key={index} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>
        {label && (
          <label
            htmlFor={props.name}
            className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 text-neutral-600 font-medium"
          >
            {label}
            {props.required && <span className="text-secondary-600 ml-1">*</span>}
          </label>
        )}
      </div>
    </div>
  )
})

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
