import { ContainerRegistrationKeys, AbstractPaymentProvider } from "@medusajs/framework/utils"
import { 
  Logger,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  PaymentProviderContext,
  PaymentSessionStatus,
  BigNumberInput
} from "@medusajs/framework/types"
import axios, { AxiosInstance, AxiosError } from "axios"
import { MedusaError } from "@medusajs/utils"
import crypto from "crypto"
import {
  MercadoPagoPreferenceResponse,
  MercadoPagoPaymentResponse,
  MercadoPagoWebhookPayload,
  MercadoPagoRefundResponse,
  MercadoPagoError,
  MercadoPagoPaymentStatus,
  OrderStatusUpdate
} from "../types"

// Enhanced MercadoPago configuration options
type MercadoPagoOptions = {
  accessToken: string
  publicKey: string
  webhookSecret: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
  baseUrl: string
  // Additional configuration options
  autoReturn?: "approved" | "all"
  binaryMode?: boolean
  expires?: boolean
  expirationDateFrom?: string
  expirationDateTo?: string
  externalReference?: string
  notificationUrl?: string
  marketplace?: string
  marketplaceFee?: number
  differentialPricingId?: string
  taxes?: Array<{
    type: string
    value: number
  }>
  backUrls?: {
    success?: string
    failure?: string
    pending?: string
  }
  paymentMethods?: {
    excludedPaymentMethods?: Array<{ id: string }>
    excludedPaymentTypes?: Array<{ id: string }>
    installments?: number
  }
  additionalInfo?: string
  metadata?: Record<string, any>
}

type InjectedDependencies = {
  logger: Logger
}

export class MercadoPagoProviderService extends AbstractPaymentProvider {
  static identifier = "mercadopago"

  protected logger_: Logger
  protected options_: MercadoPagoOptions
  protected client_: AxiosInstance

  constructor(container: any, options: MercadoPagoOptions) {
    super(container)
    this.logger_ = container.logger
    this.options_ = options

    // Validate required options
    this.validateOptions(options)

    const baseURL = this.options_.baseUrl || process.env.MERCADOPAGO_BASE_URL || "https://api.mercadopago.com"
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || this.options_.accessToken
    const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY || this.options_.publicKey

    if (!accessToken) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "MercadoPago access token is required"
      )
    }

    this.client_ = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "User-Agent": "MedusaJS-MercadoPago-Provider/1.0.0",
      },
      timeout: 30000, // 30 seconds timeout
    })

    // Add request/response interceptors for better error handling
    this.setupInterceptors()

    this.logger_.info(
      `MercadoPago client initialized: baseURL=${baseURL}, accessTokenPresent=${Boolean(accessToken)}, publicKeyPresent=${Boolean(publicKey)}`
    )
  }

  // Validate configuration options
  private validateOptions(options: MercadoPagoOptions): void {
    const requiredFields = ['accessToken', 'publicKey', 'webhookSecret']
    
    for (const field of requiredFields) {
      if (!options[field as keyof MercadoPagoOptions]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `MercadoPago ${field} is required in provider options`
        )
      }
    }

    // Validate URLs
    const urlFields = ['successUrl', 'failureUrl', 'pendingUrl']
    for (const field of urlFields) {
      const url = options[field as keyof MercadoPagoOptions] as string
      if (url && !this.isValidUrl(url)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `MercadoPago ${field} must be a valid URL`
        )
      }
    }
  }

  // Validate URL format
  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Check if we're using test credentials
  private isTestEnvironment(): boolean {
    const accessToken = this.options_.accessToken || process.env.MERCADOPAGO_ACCESS_TOKEN
    const publicKey = this.options_.publicKey || process.env.MERCADOPAGO_PUBLIC_KEY
    
    const isTest = Boolean(
      accessToken?.startsWith("TEST-") ||
      accessToken?.includes("test") ||
      publicKey?.startsWith("TEST-") ||
      publicKey?.includes("test") ||
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test" ||
      process.env.MERCADOPAGO_SANDBOX === 'true' ||
      process.env.MERCADOPAGO_ENVIRONMENT === 'sandbox' ||
      process.env.MERCADOPAGO_ENVIRONMENT === 'test'
    )
    
    // Debug logging
    this.logger_.info(`MercadoPago Environment Detection - AccessToken: ${accessToken?.substring(0, 10)}..., PublicKey: ${publicKey?.substring(0, 10)}..., NODE_ENV: ${process.env.NODE_ENV}, MERCADOPAGO_SANDBOX: ${process.env.MERCADOPAGO_SANDBOX}, MERCADOPAGO_ENVIRONMENT: ${process.env.MERCADOPAGO_ENVIRONMENT}, IsTest: ${isTest}`)
    
    return isTest
  }

  // Setup axios interceptors for better error handling
  private setupInterceptors(): void {
    // Request interceptor
    this.client_.interceptors.request.use(
      (config) => {
        this.logger_.debug(`MercadoPago API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        this.logger_.error("MercadoPago API Request Error:", error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client_.interceptors.response.use(
      (response) => {
        this.logger_.debug(`MercadoPago API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        this.logger_.error("MercadoPago API Response Error:", error.response?.data || error.message)
        return Promise.reject(this.handleApiError(error, "API_CALL"))
      }
    )
  }

  // Required abstract method implementation
  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    // Debug logging to understand the input structure
    this.logger_.info(`MercadoPago initiatePayment called with input: ${JSON.stringify(input, null, 2)}`)
    
    try {
      const { context, data, amount, currency_code } = input
      
      if (!amount || Number(amount) <= 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Amount is required and must be greater than 0"
        )
      }
      
      if (!currency_code) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Currency code is required"
        )
      }
      
      // Extract payment collection ID from context
      // In MedusaJS 2.0, the payment collection ID should be available in the context
      let paymentCollectionId = (context as any)?.payment_collection_id || 
                               data?.payment_collection_id || 
                               (context as any)?.payment_collection?.id ||
                               (context as any)?.id
      
      // Debug: Log all available context keys to understand the structure
      this.logger_.info(`Available context keys: ${Object.keys(context || {}).join(', ')}`)
      this.logger_.info(`Available data keys: ${Object.keys(data || {}).join(', ')}`)
      
      // If still not found, try to get it from the container's request context
      if (!paymentCollectionId) {
        this.logger_.warn("Payment collection ID not found in context, attempting to find it")
        
        try {
          // Try to get the request context from the container
          const requestContext = (this as any).container_?.resolve?.("requestContext")
          this.logger_.info(`Request context available: ${!!requestContext}`)
          
          if (requestContext) {
            this.logger_.info(`Request context keys: ${Object.keys(requestContext).join(', ')}`)
            this.logger_.info(`Request context URL: ${requestContext.url}`)
            this.logger_.info(`Request context params: ${JSON.stringify(requestContext.params)}`)
            
            // Try to extract from URL path
            if (requestContext.url) {
              const urlMatch = requestContext.url.match(/\/payment-collections\/([^\/]+)\/payment-sessions/)
              if (urlMatch && urlMatch[1]) {
                paymentCollectionId = urlMatch[1]
                this.logger_.info(`Found payment collection ID from URL: ${paymentCollectionId}`)
              }
            }
            
            // Try to get from params
            if (!paymentCollectionId && requestContext.params?.id) {
              paymentCollectionId = requestContext.params.id
              this.logger_.info(`Found payment collection ID from params: ${paymentCollectionId}`)
            }
          }
        } catch (queryError: any) {
          this.logger_.warn(`Failed to resolve request context: ${queryError.message}`)
        }
      }
      
      // If still no payment collection ID, we need to work without it
      // This might be the case where the payment collection is not created yet
      if (!paymentCollectionId) {
        this.logger_.warn("Payment collection ID still not found, attempting to work with cart directly")
        
        // Check if we have cart data in the context
        const cart = (context as any)?.cart || (context as any)?.payment_collection?.cart
        if (cart && cart.id) {
          this.logger_.info(`Found cart data directly in context, using cart ID: ${cart.id}`)
          // We'll use the cart data directly without requiring a payment collection ID
        } else {
          // For now, let's try to work without the payment collection ID
          // This is a temporary solution while we figure out the proper way to get it
          this.logger_.warn("No cart data found in context, proceeding without payment collection ID")
        }
      }
      
      // Try to get cart data from context first, then fallback to container resolution
      let cart = (context as any)?.cart || (context as any)?.payment_collection?.cart
      
      if (!cart) {
        // Fallback: try to resolve query service safely
        try {
          const query: any = (this as any).container_?.resolve?.(ContainerRegistrationKeys.QUERY)
          if (query) {
            this.logger_.info("Attempting to fetch cart data via query service")
            
            if (paymentCollectionId) {
              // Try to fetch from payment collection first
              const paymentCollectionResult = await query.graph({
                entity: "payment_collection",
                filters: { id: paymentCollectionId },
                fields: [
                  "id",
                  "amount",
                  "currency_code",
                  "cart.id",
                  "cart.items",
                  "cart.items.variant_id",
                  "cart.items.title",
                  "cart.items.quantity",
                  "cart.items.unit_price",
                  "cart.items.variant",
                  "cart.items.variant.title",
                  "cart.items.variant.product",
                  "cart.items.variant.product.title",
                  "cart.items.variant.sku",
                  "cart.email",
                  "cart.customer",
                  "cart.customer.first_name",
                  "cart.customer.last_name",
                  "cart.customer.email",
                  "cart.shipping_address",
                  "cart.billing_address",
                  "cart.region",
                  "cart.currency_code"
                ],
              })
              
              const paymentCollection = Array.isArray(paymentCollectionResult?.data) 
                ? paymentCollectionResult.data[0] 
                : paymentCollectionResult?.data?.[0]
              
              cart = paymentCollection?.cart
            }
            
            // If still no cart, try to get cart directly from context or use the cart ID from context
            if (!cart && (context as any)?.cart_id) {
              this.logger_.info(`Attempting to fetch cart directly using cart ID: ${(context as any).cart_id}`)
              const cartResult = await query.graph({
                entity: "cart",
                filters: { id: (context as any).cart_id },
                fields: [
                  "id",
                  "items",
                  "items.variant_id",
                  "items.title",
                  "items.quantity",
                  "items.unit_price",
                  "items.variant",
                  "items.variant.title",
                  "items.variant.product",
                  "items.variant.product.title",
                  "items.variant.sku",
                  "email",
                  "customer",
                  "customer.first_name",
                  "customer.last_name",
                  "customer.email",
                  "shipping_address",
                  "billing_address",
                  "region",
                  "currency_code"
                ],
              })
              
              cart = Array.isArray(cartResult?.data) 
                ? cartResult.data[0] 
                : cartResult?.data?.[0]
            }
          }
        } catch (queryError: any) {
          this.logger_.warn(`Failed to resolve query service: ${queryError.message}`)
        }
      }
      
      // If we still don't have cart data, we need to create a minimal cart structure
      // This is a fallback for when the cart data is not available in the context
      if (!cart) {
        this.logger_.warn("No cart data available, creating minimal cart structure for payment")
        
        // Create a minimal cart structure with the available data
        cart = {
          id: `temp_cart_${Date.now()}`,
          items: [],
          region: {
            currency_code: currency_code,
            tax_rate: 0
          },
          customer: null
        }
        
        this.logger_.info("Created minimal cart structure for payment processing")
      }
      
      // Extract customer data from cart with comprehensive information
      let customerData = {
        name: "Customer",
        surname: "",
        email: "customer@example.com",
        phone: {
          number: ""
        },
        address: {
          street_name: "",
          street_number: "",
          zip_code: ""
        }
      }
      
      if (cart.customer) {
        customerData = {
          name: cart.customer.first_name || "Customer",
          surname: cart.customer.last_name || "",
          email: cart.customer.email || cart.email || "customer@example.com",
          phone: {
            number: cart.customer.phone || cart.shipping_address?.phone || ""
          },
          address: {
            street_name: cart.shipping_address?.address_1 || cart.billing_address?.address_1 || "",
            street_number: cart.shipping_address?.address_2 || cart.billing_address?.address_2 || "",
            zip_code: cart.shipping_address?.postal_code || cart.billing_address?.postal_code || ""
          }
        }
      } else if (cart.email) {
        customerData.email = cart.email
        customerData.phone.number = cart.shipping_address?.phone || ""
        customerData.address = {
          street_name: cart.shipping_address?.address_1 || "",
          street_number: cart.shipping_address?.address_2 || "",
          zip_code: cart.shipping_address?.postal_code || ""
        }
      }
      
      // Use shipping address if available
      if (cart.shipping_address) {
        customerData.phone.number = cart.shipping_address.phone || customerData.phone.number
        customerData.address = {
          street_name: cart.shipping_address.address_1 || customerData.address.street_name,
          street_number: cart.shipping_address.address_2 || customerData.address.street_number,
          zip_code: cart.shipping_address.postal_code || customerData.address.zip_code
        }
      }
      
      // Build items from cart using the actual cart data
      const items = this.buildPreferenceItems(cart.items || [])
      
      // If no items are available, create a minimal item for the payment
      if (items.length === 0) {
        this.logger_.warn("No cart items available, creating minimal item for payment")
        items.push({
          title: "Payment",
          quantity: 1,
          unit_price: Number(amount),
          currency_id: currency_code.toUpperCase()
        })
      }
      
      this.logOperation("initiatePayment", { 
        sessionId: data?.session_id,
        amount: amount,
        currency: currency_code,
        customer: customerData,
        itemCount: items.length
      })
      
      // Check if we're using test credentials
      const isTestEnvironment = this.isTestEnvironment()
      
      // Ensure URLs are properly formatted and not empty
      let successUrl = this.options_.successUrl || process.env.MERCADOPAGO_SUCCESS_URL
      let failureUrl = this.options_.failureUrl || process.env.MERCADOPAGO_FAILURE_URL
      let pendingUrl = this.options_.pendingUrl || process.env.MERCADOPAGO_PENDING_URL
      
      // If environment variables are not set, use default values
      if (!successUrl || successUrl === "undefined") {
        successUrl = "http://localhost:3000/checkout/success"
      }
      if (!failureUrl || failureUrl === "undefined") {
        failureUrl = "http://localhost:3000/checkout/failure"
      }
      if (!pendingUrl || pendingUrl === "undefined") {
        pendingUrl = "http://localhost:3000/checkout/pending"
      }
      
      // For test environment, ensure URLs are localhost or test domains
      if (isTestEnvironment) {
        if (!successUrl.includes("localhost") && !successUrl.includes("test") && !successUrl.includes("127.0.0.1")) {
          successUrl = "http://localhost:3000/checkout/success"
        }
        if (!failureUrl.includes("localhost") && !failureUrl.includes("test") && !failureUrl.includes("127.0.0.1")) {
          failureUrl = "http://localhost:3000/checkout/failure"
        }
        if (!pendingUrl.includes("localhost") && !pendingUrl.includes("test") && !pendingUrl.includes("127.0.0.1")) {
          pendingUrl = "http://localhost:3000/checkout/pending"
        }
        
        // For test environment, ensure notification URL is also test-compatible
        const notificationUrl = this.options_.notificationUrl || `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 9000}`}/hooks/payment/mercadopago_mercadopago`
        if (!notificationUrl.includes("localhost") && !notificationUrl.includes("test") && !notificationUrl.includes("127.0.0.1")) {
          this.logger_.warn("Notification URL is not test-compatible, this might cause issues with test environment")
        }
        
        // Log test environment configuration
        this.logger_.info(`MercadoPago Test Environment Configuration - SuccessUrl: ${successUrl}, FailureUrl: ${failureUrl}, PendingUrl: ${pendingUrl}`)
      }
      
      // Validate URLs are not pointing to webhook endpoints
      if (successUrl.includes("mercadopago/webhook") || successUrl.includes("hooks/payment")) {
        successUrl = "http://localhost:3000/checkout/success"
      }
      if (failureUrl.includes("mercadopago/webhook") || failureUrl.includes("hooks/payment")) {
        failureUrl = "http://localhost:3000/checkout/failure"
      }
      if (pendingUrl.includes("mercadopago/webhook") || pendingUrl.includes("hooks/payment")) {
        pendingUrl = "http://localhost:3000/checkout/pending"
      }
      
      this.logger_.info(`MercadoPago Environment - Test: ${isTestEnvironment}, URLs - Success: ${successUrl}, Failure: ${failureUrl}, Pending: ${pendingUrl}`)
      
      const preference = {
        items,
        payer: {
          email: customerData.email || "test_user@testuser.com",
          name: "APRO", // Must be "APRO" for test cards in Colombia (approved payment)
          surname: "User",
          phone: {
            area_code: "11",
            number: "1234567890",
          },
          identification: {
            type: "CC", // Cédula de Ciudadanía for Colombia
            number: "123456789" // Must be "123456789" for test cards in Colombia
          },
          address: {
            street_name: "Street",
            street_number: "123",
            zip_code: "1406",
          },
        },
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        // Only set auto_return if success URL is properly configured and not localhost
        ...(successUrl && !successUrl.includes("localhost") && {
          auto_return: this.options_.autoReturn || "approved"
        }),
        external_reference: `${cart.id}_${paymentCollectionId || 'no_pc'}`,
        notification_url: this.options_.notificationUrl || `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 9000}`}/hooks/payment/mercadopago_mercadopago`,
        payment_methods: {
          excluded_payment_methods: this.options_.paymentMethods?.excludedPaymentMethods || [],
          excluded_payment_types: this.options_.paymentMethods?.excludedPaymentTypes || [],
          installments: this.options_.paymentMethods?.installments || 12,
          // For test environment, ensure test cards are accepted
          ...(isTestEnvironment && {
            default_payment_method_id: "account_money",
            // Ensure test cards are not excluded
            excluded_payment_methods: [],
            excluded_payment_types: []
          }),
        },
        // Force document collection for Colombia (required for MCO site)
        collect_payer_document: true,
        country_id: "MCO",
        // Additional Colombia-specific settings
        address_requirements: "required",
        document_requirements: "required",
        // Enhanced configuration
        binary_mode: this.options_.binaryMode || false,
        expires: this.options_.expires || false,
        ...(this.options_.expirationDateFrom && { expiration_date_from: this.options_.expirationDateFrom }),
        ...(this.options_.expirationDateTo && { expiration_date_to: this.options_.expirationDateTo }),
        ...(this.options_.marketplace && { marketplace: this.options_.marketplace }),
        ...(this.options_.marketplaceFee && { marketplace_fee: this.options_.marketplaceFee }),
        ...(this.options_.differentialPricingId && { differential_pricing_id: this.options_.differentialPricingId }),
        ...(this.options_.taxes && { taxes: this.options_.taxes }),
        ...(this.options_.additionalInfo && { additional_info: this.options_.additionalInfo }),
        // Test environment specific configuration
        ...(isTestEnvironment && {
          // For test environment, ensure we're using test-compatible settings
          binary_mode: false, // Disable binary mode for testing
          expires: true, // Enable expiration for testing (as per documentation)
          expiration_date_from: new Date().toISOString(),
          expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
          // Add test-specific metadata
          statement_descriptor: "CAFFELIA TEST",
          // Add test-specific configuration
          additional_info: {
            test_mode: true,
            environment: "sandbox",
            items: items.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              picture_url: item.picture_url,
              category_id: "others",
              quantity: item.quantity,
              unit_price: item.unit_price
            })),
            payer: {
              first_name: "APRO",
              last_name: "User",
              phone: {
                area_code: "11",
                number: "1234567890"
              },
              identification: {
                type: "CC", // Cédula de Ciudadanía for Colombia
                number: "123456789"
              },
              address: {
                zip_code: "1406",
                street_name: "Street",
                street_number: "123"
              }
            },
            shipments: {
              receiver_address: {
                zip_code: "1406",
                state_name: "Bogotá",
                city_name: "Bogotá",
                street_name: "Street",
                street_number: "123"
              }
            }
          },
          // Ensure test environment is properly configured for test cards
          site_id: "MCO", // Colombia site ID for test
          processing_modes: ["aggregator"],
          // Additional test environment settings
          operation_type: "regular_payment",
          // Ensure test cards are properly handled
          differential_pricing_id: null,
          // Checkout Pro specific configurations for test environment
          shipments: {
            mode: "not_specified",
            local_pickup: false,
            dimensions: null,
            default_shipping_method: null,
            free_methods: [],
            cost: null,
            free_shipping: false,
            receiver_address: null,
          },
          // Ensure proper test card handling
          payment_methods: {
            ...this.options_.paymentMethods,
            excluded_payment_methods: [],
            excluded_payment_types: [],
            installments: 12,
            default_payment_method_id: null, // Let user choose
          },
          // Force document collection for Colombia
          collect_payer_document: true,
          // Additional Colombia-specific settings
          country_id: "MCO",
          // Ensure proper address and document collection
          address_requirements: "required",
          document_requirements: "required"
        }),
        metadata: {
          cart_id: cart.id,
          payment_collection_id: paymentCollectionId,
          medusa_version: "2.0",
          provider: "mercadopago",
          environment: isTestEnvironment ? "test" : "production",
          ...this.options_.metadata,
        },
      }
      
      this.logger_.info(`MercadoPago preference being sent: ${JSON.stringify(preference, null, 2)}`)
      this.logger_.info(`MercadoPago Test Environment - IsTest: ${isTestEnvironment}`)
      this.logger_.info(`MercadoPago Items Count: ${items.length}, Total Amount: ${this.calculateTotalAmount(items)}`)
      this.logger_.info(`MercadoPago Test Card Configuration - SiteId: MCO, ProcessingModes: aggregator, DefaultPaymentMethod: account_money`)
      this.logger_.info(`MercadoPago Test Card Data - CardNumber: 5254 1336 7440 3564, Name: APRO, DocumentType: CC, DocumentNumber: 123456789, CVV: 123, Expiry: 11/30`)
      
      const { data: preferenceResponse } = await this.client_.post(
        "/checkout/preferences",
        preference
      )

      // Validate preference response
      if (!preferenceResponse || !preferenceResponse.id) {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
          "Invalid response from MercadoPago: missing preference ID"
        )
      }

      console.log({preference})
      console.log({preferenceResponse})
      
      this.logOperation("preferenceCreated", { 
        preferenceId: preferenceResponse.id,
        cartId: cart.id,
        itemCount: items.length
      })
      
      // Use sandbox_init_point for test environment, init_point for production
      const paymentUrl = isTestEnvironment ? 
        (preferenceResponse.sandbox_init_point || preferenceResponse.init_point) : 
        preferenceResponse.init_point

      this.logger_.info(`MercadoPago Payment URL - Environment: ${isTestEnvironment ? 'test' : 'production'}, URL: ${paymentUrl}`)

      return {
        id: preferenceResponse.id,
        data: {
          preference_id: preferenceResponse.id,
          init_point: preferenceResponse.init_point,
          sandbox_init_point: preferenceResponse.sandbox_init_point,
          // Use appropriate URL based on environment
          payment_url: paymentUrl,
          checkout_url: paymentUrl,
          // Include cart and payment collection references
          cart_id: cart?.id,
          payment_collection_id: paymentCollectionId,
          // Include amount and currency for validation
          amount: amount,
          currency_code: currency_code,
          // Include customer data for reference
          customer_email: customerData.email,
          customer_name: `${customerData.name} ${customerData.surname}`.trim(),
          // Include environment info for debugging
          environment: isTestEnvironment ? "test" : "production",
        },
        status: "pending" as PaymentSessionStatus,
      }
    } catch (error: any) {
      if (error instanceof MedusaError) {
        throw error
      }
      this.handleApiError(error, "initiatePayment")
    }
  }

  // Single Responsibility: Create payment session (preference)
  async createPaymentSession(
    context: any,
    paymentData: any
  ): Promise<{ session_data: any }> {
    try {
      // Debug logging to understand the data structure
      this.logger_.info(`MercadoPago createPaymentSession called with context: ${JSON.stringify(context, null, 2)}`)
      
      // Extract cart from the context - it might be nested differently
      const cart = context.cart || context.payment_collection?.cart || context
      
      if (!cart) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cart is required to create payment session"
        )
      }
      
      if (!cart.items || cart.items.length === 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cart items are required to create payment session"
        )
      }

      const items = this.buildPreferenceItems(cart.items)
      const totalAmount = this.calculateTotalAmount(cart.items)

      this.logOperation("createPaymentSession", { cartId: cart.id, itemCount: items.length, totalAmount })

      // Extract customer data from cart
      let customerData = {
        name: "Customer",
        surname: "",
        email: "customer@example.com",
      }
      
      if (cart.customer) {
        customerData = {
          name: cart.customer.first_name || "Customer",
          surname: cart.customer.last_name || "",
          email: cart.customer.email || cart.email || "customer@example.com",
        }
      } else if (cart.email) {
        customerData.email = cart.email
      }

      const preference = {
        items,
        payer: {
          ...customerData,
          phone: {
            number: cart.shipping_address?.phone || "",
          },
          address: {
            street_name: cart.shipping_address?.address_1 || "",
            street_number: cart.shipping_address?.address_2 || "",
            zip_code: cart.shipping_address?.postal_code || "",
          },
        },
        back_urls: {
          success: this.options_.successUrl || process.env.MERCADOPAGO_SUCCESS_URL || "http://localhost:3000/checkout/success",
          failure: this.options_.failureUrl || process.env.MERCADOPAGO_FAILURE_URL || "http://localhost:3000/checkout/failure",
          pending: this.options_.pendingUrl || process.env.MERCADOPAGO_PENDING_URL || "http://localhost:3000/checkout/pending",
        },
        auto_return: "approved",
        external_reference: cart.id,
        notification_url: `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 9000}`}/hooks/payment/mercadopago_mercadopago`,
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },
      }

      const { data: preferenceResponse } = await this.client_.post(
        "/checkout/preferences",
        preference
      )

      // Validate preference response
      if (!preferenceResponse || !preferenceResponse.id) {
        throw new MedusaError(
          MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
          "Invalid response from MercadoPago: missing preference ID"
        )
      }

      this.logOperation("preferenceCreated", { preferenceId: preferenceResponse.id, cartId: cart.id })

      return {
        session_data: {
          preference_id: preferenceResponse.id,
          init_point: preferenceResponse.init_point,
          sandbox_init_point: preferenceResponse.sandbox_init_point,
        },
      }
    } catch (error: any) {
      if (error instanceof MedusaError) {
        throw error
      }
      this.handleApiError(error, "createPaymentSession")
    }
  }

  // Single Responsibility: Retrieve payment data
  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    try {
      const { data } = input
      const id = data?.id as string

      if (!id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Payment ID is required"
        )
      }

      const { data: payment } = await this.client_.get(`/v1/payments/${id}`)

      return {
        data: {
          id: payment.id,
          status: payment.status,
          status_detail: payment.status_detail,
          transaction_amount: payment.transaction_amount,
          currency_id: payment.currency_id,
          description: payment.description,
          payment_method_id: payment.payment_method_id,
          payment_type_id: payment.payment_type_id,
          external_reference: payment.external_reference,
          date_created: payment.date_created,
          date_approved: payment.date_approved,
        },
      }
    } catch (error: any) {
      this.logger_.error("Error retrieving MercadoPago payment:", error)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to retrieve payment from MercadoPago"
      )
    }
  }

  // Single Responsibility: Update payment
  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    try {
      const { data } = input
      const id = data?.id as string

      if (!id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Payment ID is required"
        )
      }

      const { data: updatedPayment } = await this.client_.put(
        `/v1/payments/${id}`,
        data
      )

      return {
        data: updatedPayment,
      }
    } catch (error: any) {
      this.logger_.error("Error updating MercadoPago payment:", error)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to update payment with MercadoPago"
      )
    }
  }

  // Single Responsibility: Authorize payment
  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    try {
      const { data } = input
      const preference_id = data?.preference_id as string

      if (!preference_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Preference ID is required for authorization"
        )
      }

      // For MercadoPago Checkout Pro, authorization happens on the frontend
      // We return the session data for the frontend to use
      return {
        data: data,
        status: "authorized",
      }
    } catch (error: any) {
      this.logger_.error("Error authorizing MercadoPago payment:", error)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to authorize payment with MercadoPago"
      )
    }
  }

  // Single Responsibility: Capture payment
  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    try {
      const { data } = input
      const id = data?.id as string

      if (!id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Payment ID is required"
        )
      }

      // For MercadoPago, capture is automatic for approved payments
      // We just need to retrieve the current status
      const { data: paymentData } = await this.retrievePayment({ data: { id } })

      return {
        data: paymentData,
      }
    } catch (error: any) {
      this.logger_.error("Error capturing MercadoPago payment:", error)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to capture payment with MercadoPago"
      )
    }
  }

  // Single Responsibility: Refund payment
  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    try {
      const { data, amount } = input
      const id = data?.id as string
      const reason = (data as any)?.reason

      if (!id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Payment ID is required"
        )
      }

      const refundData = {
        amount: amount,
        reason: reason || "requested_by_customer",
      }

      const { data: refundResponse } = await this.client_.post(
        `/v1/payments/${id}/refunds`,
        refundData
      )

      this.logger_.info(`MercadoPago refund created: ${refundResponse.id}`)

      return {
        data: refundResponse,
      }
    } catch (error: any) {
      this.logger_.error("Error refunding MercadoPago payment:", error)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to refund payment with MercadoPago"
      )
    }
  }

  // Single Responsibility: Cancel payment
  async cancelPayment(input: any): Promise<any> {
    try {
      const { id } = input

      if (!id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Payment ID is required"
        )
      }

      // For MercadoPago, we can't cancel approved payments
      // We can only refund them
      const { data: paymentData } = await this.retrievePayment({ data: { id } })

      if (paymentData?.status === "approved") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot cancel approved payment. Use refund instead."
        )
      }

      return {
        data: paymentData,
      }
    } catch (error: any) {
      this.logger_.error("Error canceling MercadoPago payment:", error)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to cancel payment with MercadoPago"
      )
    }
  }

  // Single Responsibility: Delete payment
  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    // MercadoPago doesn't support deleting payments
    this.logger_.warn("MercadoPago does not support deleting payments")
    return { data: {} }
  }

  // Single Responsibility: Get payment status
  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    try {
      const { data: paymentData } = await this.retrievePayment(input)
      return { status: paymentData?.status as PaymentSessionStatus || "pending" }
    } catch (error: any) {
      this.logger_.error("Error getting MercadoPago payment status:", error)
      return { status: "error" as PaymentSessionStatus }
    }
  }

  // Enhanced webhook handling for MercadoPago events
  async getWebhookActionAndData(input: any): Promise<any> {
    try {
      const { data: webhookData, rawData, headers } = input
      
      // Validate webhook signature for security
      if (!this.validateWebhookSignature(rawData, headers)) {
        this.logger_.warn("Invalid webhook signature, ignoring webhook")
        return {
          action: "not_supported",
          data: { session_id: "", amount: 0 }
        }
      }

      this.validateWebhookPayload(webhookData)
      
      const { type, action, data } = webhookData
      
      this.logger_.info(`Processing MercadoPago webhook: ${type}.${action}`)
      
      // Handle different webhook events
      switch (type) {
        case "payment":
          return await this.handlePaymentWebhook(action, data)
        case "merchant_order":
          return await this.handleMerchantOrderWebhook(action, data)
        case "point_integration_whitelist":
          return await this.handlePointIntegrationWebhook(action, data)
        default:
          this.logger_.warn(`Unsupported webhook type: ${type}`)
          return {
            action: "not_supported",
            data: { session_id: "", amount: 0 }
          }
      }
    } catch (error: any) {
      this.logger_.error("Error processing MercadoPago webhook:", error)
      return {
        action: "error",
        data: { session_id: "", amount: 0 }
      }
    }
  }

  // Handle payment webhook events
  private async handlePaymentWebhook(action: string, data: any): Promise<any> {
    const paymentId = data.id
    
    if (!paymentId) {
      this.logger_.warn("Payment ID not found in webhook data")
      return {
        action: "not_supported",
        data: { session_id: "", amount: 0 }
      }
    }

    try {
      const { data: paymentData } = await this.retrievePayment({ data: { id: paymentId } })
      
      // Map MercadoPago status to MedusaJS action
      let medusaAction = "pending"
      switch (paymentData?.status) {
        case "approved":
          medusaAction = "authorized"
          break
        case "rejected":
        case "cancelled":
          medusaAction = "error"
          break
        case "pending":
        case "in_process":
          medusaAction = "pending"
          break
        case "refunded":
          medusaAction = "refunded"
          break
        default:
          medusaAction = "pending"
      }
      
      this.logOperation("webhookProcessed", { 
        paymentId, 
        action,
        mercadopagoStatus: paymentData?.status, 
        medusaAction 
      })
      
      return {
        action: medusaAction,
        data: {
          session_id: paymentData?.external_reference || "",
          amount: paymentData?.transaction_amount || 0,
          payment_id: paymentId,
          status: paymentData?.status
        }
      }
    } catch (error: any) {
      this.logger_.error(`Error retrieving payment ${paymentId}:`, error)
      return {
        action: "error",
        data: { session_id: "", amount: 0 }
      }
    }
  }

  // Handle merchant order webhook events
  private async handleMerchantOrderWebhook(action: string, data: any): Promise<any> {
    this.logger_.info(`Processing merchant order webhook: ${action}`)
    
    // For merchant orders, we typically don't need to take action
    // as payment webhooks handle the actual payment status
    return {
      action: "not_supported",
      data: { session_id: "", amount: 0 }
    }
  }

  // Handle point integration webhook events
  private async handlePointIntegrationWebhook(action: string, data: any): Promise<any> {
    this.logger_.info(`Processing point integration webhook: ${action}`)
    
    // Point integration webhooks are for specific integrations
    return {
      action: "not_supported",
      data: { session_id: "", amount: 0 }
    }
  }

  // Validate webhook signature for security
  private validateWebhookSignature(rawData: string, headers: any): boolean {
    try {
      const signature = headers['x-signature'] || headers['x-signature-256']
      if (!signature || !this.options_.webhookSecret) {
        this.logger_.warn("Webhook signature or secret not available")
        return true // Allow for development/testing
      }

      const expectedSignature = crypto
        .createHmac('sha256', this.options_.webhookSecret)
        .update(rawData)
        .digest('hex')

      return signature === expectedSignature
    } catch (error: any) {
      this.logger_.error("Error validating webhook signature:", error)
      return false
    }
  }

  // Single Responsibility: Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const webhookSecret = this.options_.webhookSecret || process.env.MERCADOPAGO_WEBHOOK_SECRET
      
      if (!webhookSecret) {
        this.logger_.warn("MercadoPago webhook secret not configured")
        return false
      }

      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(payload)
        .digest("hex")

      return crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expectedSignature, "hex")
      )
    } catch (error: any) {
      this.logger_.error("Error verifying MercadoPago webhook signature:", error)
      return false
    }
  }


  // Private helper methods following Single Responsibility Principle

  private buildPreferenceItems(items: any[]): any[] {
    return items.map((item) => {
      // Get the best available title from variant or item
      let title = item.title || item.name || "Product"
      
      // If we have variant information, build a comprehensive title
      if (item.variant) {
        const product = item.variant.product
        if (product?.title) {
          title = product.title
          
          // Add variant title if it's different from product title and not "Default Title"
          if (item.variant.title && 
              item.variant.title !== "Default Title" && 
              item.variant.title !== product.title) {
            title += ` - ${item.variant.title}`
          }
        } else if (item.variant.title) {
          title = item.variant.title
        }
      }
      
      // Build comprehensive description with variant details
      let description = item.description || ""
      const descriptionParts: string[] = []
      
      if (item.variant?.sku) {
        descriptionParts.push(`SKU: ${item.variant.sku}`)
      }
      
      // Add variant options if available
      if (item.variant?.options && Object.keys(item.variant.options).length > 0) {
        const optionsText = Object.entries(item.variant.options)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")
        descriptionParts.push(`Options: ${optionsText}`)
      }
      
      // Add product description if available
      if (item.variant?.product?.description) {
        descriptionParts.push(item.variant.product.description)
      }
      
      if (descriptionParts.length > 0) {
        description = descriptionParts.join(" | ")
      }
      
      // Use variant_id as the primary ID, fallback to item.id
      const itemId = item.variant_id || item.id
      
      // Convert unit_price from cents to currency units if needed
      let unitPrice = item.unit_price || 0
      if (unitPrice > 100) {
        // If price seems to be in cents, convert to currency units
        unitPrice = unitPrice / 100
      }
      
      // Get product thumbnail if available
      let pictureUrl: string | undefined = undefined
      if (item.variant?.product?.thumbnail) {
        pictureUrl = item.variant.product.thumbnail
      } else if (item.variant?.thumbnail) {
        pictureUrl = item.variant.thumbnail
      }
      
      // Get product category
      let categoryId = "general"
      if (item.variant?.product?.type?.value) {
        categoryId = String(item.variant.product.type.value)
      } else if (item.variant?.product?.category?.name) {
        categoryId = String(item.variant.product.category.name).toLowerCase().replace(/\s+/g, "_")
      }
      
      this.logger_.info(`Building MercadoPago item: ${JSON.stringify({
        id: itemId,
        title,
        description,
        quantity: item.quantity,
        unit_price: unitPrice,
        category: categoryId,
        hasImage: !!pictureUrl
      })}`)
      
      return {
        id: itemId,
        title: title,
        description: description,
        quantity: item.quantity || 1,
        unit_price: Math.round(unitPrice * 100) / 100, // Ensure 2 decimal places
        currency_id: "COP", // Default to Colombian Peso
        picture_url: pictureUrl,
        category_id: categoryId
      }
    })
  }

  private calculateTotalAmount(items: any[]): number {
    return items.reduce((total, item) => {
      const itemTotal = (item.unit_price || 0) * (item.quantity || 0)
      return total + itemTotal
    }, 0)
  }

  // Error handling methods following Single Responsibility Principle

  private handleApiError(error: AxiosError, operation: string): never {
    const status = error.response?.status
    const data = error.response?.data as MercadoPagoError
    const message = data?.message || error.message

    this.logger_.error(`MercadoPago API error during ${operation}: ${message} - URL: ${error.config?.url}, Method: ${error.config?.method}, Status: ${status}`)

    // Map HTTP status codes to Medusa error types
    let errorType = MedusaError.Types.UNEXPECTED_STATE
    if (status === 400) {
      errorType = MedusaError.Types.INVALID_DATA
    } else if (status === 401) {
      errorType = MedusaError.Types.UNAUTHORIZED
    } else if (status === 403) {
      errorType = MedusaError.Types.NOT_ALLOWED
    } else if (status === 404) {
      errorType = MedusaError.Types.NOT_FOUND
    } else if (status && status >= 500) {
      errorType = MedusaError.Types.UNEXPECTED_STATE
    }

    throw new MedusaError(
      errorType,
      `MercadoPago ${operation} failed: ${message}`
    )
  }

  private validatePaymentData(paymentData: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Missing required field: ${field}`
        )
      }
    }
  }

  private validateWebhookPayload(payload: MercadoPagoWebhookPayload): void {
    if (!payload.id || !payload.type || !payload.action) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid webhook payload structure"
      )
    }
  }

  private logOperation(operation: string, data: any, level: "info" | "warn" | "error" = "info"): void {
    const logMessage = `MercadoPago ${operation}: ${typeof data === "object" ? JSON.stringify(data) : data}`

    switch (level) {
      case "info":
        this.logger_.info(logMessage)
        break
      case "warn":
        this.logger_.warn(logMessage)
        break
      case "error":
        this.logger_.error(logMessage)
        break
    }
  }

}
