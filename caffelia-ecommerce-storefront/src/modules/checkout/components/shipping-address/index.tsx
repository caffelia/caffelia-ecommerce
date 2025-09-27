import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import { mapKeys } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"
import NativeSelect from "@modules/common/components/native-select"
import { sdk } from "@lib/config"

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code": cart?.shipping_address?.country_code || "co",
    "shipping_address.province": cart?.shipping_address?.province || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
    "shipping_address.metadata.barrio":
      (cart?.shipping_address as any)?.metadata?.barrio || "",
    "shipping_address.metadata.indicacion":
      (cart?.shipping_address as any)?.metadata?.indicacion || "",
    // New metadata fields for department/municipality codes
    "shipping_address.metadata.dept_code": (cart?.shipping_address as any)?.metadata?.dept_code || "",
    "shipping_address.metadata.muni_code": (cart?.shipping_address as any)?.metadata?.municipality_code || "",
    email: cart?.email || "",
  })

  const [departments, setDepartments] = useState<Array<{ dept_code: string; name: string }>>([])
  const [municipalities, setMunicipalities] = useState<Array<{ muni_code: string; name: string }>>([])

  const selectedDept = formData["shipping_address.metadata.dept_code"] as string
  const selectedMuni = formData["shipping_address.metadata.muni_code"] as string

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c.iso_2),
    [cart?.region]
  )

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.addresses, countriesInRegion]
  )

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    address &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        "shipping_address.first_name": address?.first_name || "",
        "shipping_address.last_name": address?.last_name || "",
        "shipping_address.address_1": address?.address_1 || "",
        "shipping_address.postal_code": address?.postal_code || "",
        "shipping_address.city": address?.city || "",
        "shipping_address.country_code": address?.country_code || "co",
        "shipping_address.province": address?.province || "",
        "shipping_address.phone": address?.phone || "",
        "shipping_address.metadata.barrio": (address as any)?.metadata?.barrio || "",
        "shipping_address.metadata.indicacion": (address as any)?.metadata?.indicacion || "",
        "shipping_address.metadata.dept_code": (address as any)?.metadata?.dept_code || "",
        "shipping_address.metadata.muni_code": (address as any)?.metadata?.municipality_code || "",
      }))

    email &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        email: email,
      }))
  }

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart && cart.shipping_address) {
      setFormAddress(cart?.shipping_address, cart?.email)
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
  }, [cart]) // Add cart as a dependency

  // Fetch departments once
  useEffect(() => {
    sdk.client
      .fetch<{ departments: Array<{ dept_code: string; name: string }> }>(
        "/store/geo/departments",
        { method: "GET" }
      )
      .then((data) => setDepartments(data.departments || []))
      .catch(() => setDepartments([]))
  }, [])

  // Fetch municipalities when department changes
  useEffect(() => {
    if (!selectedDept) {
      setMunicipalities([])
      return
    }
    sdk.client
      .fetch<{ municipalities: Array<{ muni_code: string; name: string }> }>(
        "/store/geo/municipalities",
        { method: "GET", query: { dept_code: selectedDept } as any }
      )
      .then((data) => setMunicipalities(data.municipalities || []))
      .catch(() => setMunicipalities([]))
  }, [selectedDept])

  // Keep city/province text fields aligned with selected muni/dept for compatibility
  useEffect(() => {
    const muniName = municipalities.find((m) => m.muni_code === selectedMuni)?.name || ""
    const deptName = departments.find((d) => d.dept_code === selectedDept)?.name || ""
    setFormData((prev) => ({
      ...prev,
      "shipping_address.city": muniName,
      "shipping_address.province": deptName,
    }))
  }, [selectedDept, selectedMuni, municipalities, departments])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect
            addresses={customer.addresses}
            addressInput={
              mapKeys(formData, (_, key) =>
                key.replace("shipping_address.", "")
              ) as HttpTypes.StoreCartAddress
            }
            onSelect={setFormAddress}
          />
        </Container>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label="Apellido"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />
        <div className="col-span-1 md:col-span-2">
          <Input
            label="Dirección"
            name="shipping_address.address_1"
            autoComplete="address-line1"
            value={formData["shipping_address.address_1"]}
            onChange={handleChange}
            required
            data-testid="shipping-address-input"
          />
        </div>
        {/* 2) Department */}
        <div>
          <label className="text-small-regular mb-1 block text-xs md:text-sm">Departamento</label>
          <NativeSelect
            name="shipping_address.metadata.dept_code"
            value={selectedDept}
            onChange={handleChange}
            placeholder="Seleccionar..."
            required
            data-testid="shipping-dept-select"
          >
            {departments.map((d) => (
              <option key={d.dept_code} value={d.dept_code}>
                {d.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        {/* 3) City */}
        <div>
          <label className="text-small-regular mb-1 block text-xs md:text-sm">Ciudad</label>
          <NativeSelect
            name="shipping_address.metadata.muni_code"
            value={selectedMuni}
            onChange={handleChange}
            placeholder={selectedDept ? "Seleccionar..." : "Seleccione departamento"}
            required
            disabled={!selectedDept}
            data-testid="shipping-muni-select"
          >
            {municipalities.map((m) => (
              <option key={m.muni_code} value={m.muni_code}>
                {m.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        {/* 4) Neighborhood */}
        <Input
          label="Barrio"
          name="shipping_address.metadata.barrio"
          value={formData["shipping_address.metadata.barrio"]}
          onChange={handleChange}
          data-testid="shipping-barrio-input"
        />
        {/* 5) Indications */}
        <Input
          label="Indicaciones"
          name="shipping_address.metadata.indicacion"
          value={formData["shipping_address.metadata.indicacion"]}
          onChange={handleChange}
          data-testid="shipping-indicacion-input"
        />
        {/* 6) Postal code */}
        <Input
          label="Código postal"
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-postal-code-input"
        />
        {/* Hidden city/province/country/company inputs still present in form submission */}
        <input type="hidden" name="shipping_address.city" value={formData["shipping_address.city"]} />
        <input type="hidden" name="shipping_address.province" value={formData["shipping_address.province"]} />
        <input type="hidden" name="shipping_address.country_code" value={formData["shipping_address.country_code"]} />
        <input type="hidden" name="shipping_address.company" value="" />
      </div>
      <div className="my-8">
        <Checkbox
          label="La dirección de facturación es la misma que la de envío"
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
          data-testid="billing-address-checkbox"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="shipping-email-input"
        />
        <Input
          label="Teléfono"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          data-testid="shipping-phone-input"
        />
      </div>
    </>
  )
}

export default ShippingAddress
