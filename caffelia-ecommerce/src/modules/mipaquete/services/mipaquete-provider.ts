import { AbstractFulfillmentProviderService, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import axios, { AxiosInstance } from "axios"
import { MedusaError } from "@medusajs/utils"

type MipaqueteOptions = {
  apiKey: string
  sessionTracker?: string
  originDaneCode?: string
  baseUrl?: string
}

type InjectedDependencies = {
  logger: Logger
}

export class MipaqueteProviderService extends AbstractFulfillmentProviderService {
  static identifier = "mipaquete"

  protected logger_: Logger
  protected options_: MipaqueteOptions
  protected client_: AxiosInstance

  constructor({ logger }: InjectedDependencies, options: MipaqueteOptions) {
    super()
    this.logger_ = logger
    this.options_ = options

    const baseURL = this.options_.baseUrl || "https://api-v2.dev.mpr.mipaquete.com"
    const apiKey = this.options_.apiKey
    this.client_ = axios.create({
      baseURL,
      headers: {
        // Mipaquete v2 accepts `apikey` header. Also send Authorization Bearer just in case the environment requires it.
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        "session-tracker":
          this.options_.sessionTracker || "medusa-mipaquete-integration",
      },
    })
    // Minimal visibility to ensure config is loaded without leaking secrets
    this.logger_.info(
      `Mipaquete client initialized: baseURL=${baseURL}, apiKeyPresent=${Boolean(apiKey)}`
    )
  }

  async getFulfillmentOptions(): Promise<any[]> {
    return [
      {
        id: "mipaquete-standard",
        name: "Envío Estándar (Mipaquete.com)",
      },
    ]
  }

  private resolveDestinyDaneCode(
    shipping_address: any
  ): string | undefined {
    // Priority: explicit municipality code from metadata → computed DANE (muni5 + '000')
    const muniCode =
      shipping_address?.metadata?.municipality_code ||
      shipping_address?.metadata?.muni_code ||
      shipping_address?.metadata?.municipio_codigo
    if (muniCode) {
      const muni5 = String(muniCode).padStart(5, "0")
      return `${muni5}000`
    }

    // Fallbacks: precomputed dane_code in metadata, or postal_code if used that way
    const fromMetadata = shipping_address?.metadata?.dane_code
    const fromPostal = shipping_address?.postal_code
    return fromMetadata || fromPostal
  }

  async calculatePrice(optionData: any, data: any, context: any) {
    // Per docs, context already carries the cart props for fulfillment
    const ctx = (context || {}) as any
    const shipping_address = ctx.shipping_address
    const items = Array.isArray(ctx.items) ? ctx.items : []
    const subtotal = typeof ctx.subtotal === "number" ? ctx.subtotal : 0
    if (!shipping_address && ctx.id) {
      // fallback: fetch minimal cart data by id
      try {
        const query: any = (this as any).container_.resolve(ContainerRegistrationKeys.QUERY)
        const result = await query.graph({
          entity: "cart",
          filters: { id: ctx.id },
          fields: [
            "id",
            "subtotal",
            "items.quantity",
            "shipping_address.address_1",
            "shipping_address.postal_code",
            "shipping_address.province",
            "shipping_address.city",
            "shipping_address.metadata",
          ],
        })
        const dataArr = (result as any)?.data
        const fetched = Array.isArray(dataArr) ? dataArr[0] : dataArr?.[0] ?? dataArr
        ctx.shipping_address = fetched?.shipping_address
      } catch (e: any) {
        this.logger_.warn(
          `Mipaquete: fallback fetch by id failed: ${
            e?.message || JSON.stringify(e)
          }`
        )
      }
    }

    if (!ctx.shipping_address) {
      return {
        calculated_amount: 0,
        is_calculated_price_tax_inclusive: false,
      }
    }

    const shipping_address2 = ctx.shipping_address
    const items2 = items
    const subtotal2 = subtotal || 0

    if (!shipping_address) {
      return {
        calculated_amount: 0,
        is_calculated_price_tax_inclusive: false,
      }
    }

    const destinyLocationCode = this.resolveDestinyDaneCode(shipping_address2)
    if (!destinyLocationCode) {
      this.logger_.warn(
        "Mipaquete: destiny DANE/postal code is missing on shipping address"
      )
      return {
        calculated_amount: 0,
        is_calculated_price_tax_inclusive: false,
      }
    }

    try {
      const quoteBody = {
        originLocationCode: this.options_.originDaneCode || "11001000",
        destinyLocationCode,
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        width: 15,
        length: 15,
        height: 15,
        weight: 1,
        declaredValue: subtotal,
        // Extra address context (if supported by API in future)
        destinationDetails: {
          department: shipping_address2.province,
          city: shipping_address2.city,
          neighborhood: shipping_address2?.metadata?.barrio,
          address: shipping_address2.address_1,
          directions: shipping_address2?.metadata?.indicacion,
        },
      }
      this.logger_.info(`Mipaquete: quoteBody: ${JSON.stringify(quoteBody)}`)

      const { data: quoteResponse } = await this.client_.post(
        "/quoteShipping",
        quoteBody
      )

      const cheapestOption = quoteResponse?.deliveryCompanies
        ?.sort((a: any, b: any) => a.price - b.price)
        ?.at(0)

      if (!cheapestOption?.price) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Mipaquete.com did not return any valid shipping options."
        )
      }

      const unitAmount = Math.round(Number(cheapestOption.price) * 100)
      this.logger_.info(`Mipaquete quote successful. Price: ${cheapestOption.price} → unit: ${unitAmount}`)
      return {
        calculated_amount: unitAmount,
        is_calculated_price_tax_inclusive: false,
      }
    } catch (error: any) {
      const status = error?.response?.status
      const body = error?.response?.data
      this.logger_.error(
        `Error calculating Mipaquete price (status=${status}): ${JSON.stringify(
          body
        )}`
      )
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Failed to get shipping quote from Mipaquete.com."
      )
    }
  }

  async createFulfillment(data: any, items: any[], order: any, fulfillment: any) {
    const { shipping_address, subtotal, email } = (order || {}) as any

    if (!shipping_address) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Missing shipping address for fulfillment."
      )
    }

    const destinyDaneCode = this.resolveDestinyDaneCode(shipping_address)
    if (!destinyDaneCode) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Missing destiny DANE/postal code for fulfillment."
      )
    }

    try {
      const sendingBody = {
        criteria: "price",
        locate: {
          originDaneCode: this.options_.originDaneCode || "11001000",
          destinyDaneCode,
        },
        productInformation: {
          declaredValue: subtotal,
          quantity: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
          weight: 1,
          height: 15,
          width: 15,
          large: 15,
        },
        receiver: {
          name: shipping_address.first_name,
          surname: shipping_address.last_name,
          cellPhone: shipping_address.phone,
          destinationAddress: shipping_address.address_1,
          email,
          department: shipping_address.province,
          city: shipping_address.city,
          neighborhood: shipping_address?.metadata?.barrio,
          directions: shipping_address?.metadata?.indicacion,
        },
        sender: {
          name: "Caffelia Coffee",
          cellPhone: "3001234567",
          email: "sender@caffelia.com",
          pickupAddress: "Your Warehouse Address",
        },
        requestPickup: "true",
      }

      const { data: sendingResponse } = await this.client_.post(
        "/createSending",
        sendingBody
      )

      this.logger_.info(
        `Mipaquete guide created: ${sendingResponse.guideNumber}`
      )

      return {
        data: sendingResponse,
        labels: [
          {
            tracking_number: sendingResponse.guideNumber,
            tracking_url: `https://www.mipaquete.com/rastreo/${sendingResponse.guideNumber}`,
            label_url: sendingResponse?.pdfGuide?.uri,
          },
        ],
      }
    } catch (error) {
      this.logger_.error("Error creating Mipaquete fulfillment:", error)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to create shipment with Mipaquete.com."
      )
    }
  }

  async canCalculate(data: any): Promise<boolean> {
    return true
  }
  async cancelFulfillment(data: Record<string, unknown>): Promise<any> {
    return {}
  }
  async createReturnFulfillment(fulfillment: any) {
    return { data: {}, labels: [] }
  }
  async validateFulfillmentData(
    optionData: any,
    data: any,
    context: any
  ): Promise<any> {
    return { ...data }
  }
  async validateOption(data: any): Promise<boolean> {
    return true
  }
}

// no default export here; see services/index.ts


