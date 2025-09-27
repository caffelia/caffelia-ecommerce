// MercadoPago API Response Types
export interface MercadoPagoPreferenceResponse {
  id: string
  init_point: string
  sandbox_init_point: string
  date_created: string
  application_id: string
  owner_id: string
  items: MercadoPagoPreferenceItem[]
  payer: MercadoPagoPayer
  back_urls: MercadoPagoBackUrls
  auto_return: string
  payment_methods: MercadoPagoPaymentMethods
  notification_url: string
  external_reference: string
  additional_info: string
  expires: boolean
  expiration_date_from: string
  expiration_date_to: string
  collector_id: number
  client_id: string
  marketplace: string
  marketplace_fee: number
  differential_pricing_id: string
  financing_deals: any[]
  binary_mode: boolean
  taxes: any[]
  metadata: Record<string, any>
}

export interface MercadoPagoPreferenceItem {
  id: string
  title: string
  description: string
  picture_url: string
  category_id: string
  quantity: number
  currency_id: string
  unit_price: number
}

export interface MercadoPagoPayer {
  name: string
  surname: string
  email: string
  phone: MercadoPagoPhone
  identification: MercadoPagoIdentification
  address: MercadoPagoAddress
  date_created: string
  last_purchase: string
}

export interface MercadoPagoPhone {
  area_code: string
  number: string
}

export interface MercadoPagoIdentification {
  type: string
  number: string
}

export interface MercadoPagoAddress {
  street_name: string
  street_number: number
  zip_code: string
}

export interface MercadoPagoBackUrls {
  success: string
  pending: string
  failure: string
}

export interface MercadoPagoPaymentMethods {
  excluded_payment_methods: MercadoPagoExcludedPaymentMethod[]
  excluded_payment_types: MercadoPagoExcludedPaymentType[]
  default_payment_method_id: string
  installments: number
  default_installments: number
}

export interface MercadoPagoExcludedPaymentMethod {
  id: string
}

export interface MercadoPagoExcludedPaymentType {
  id: string
}

// Payment Response Types
export interface MercadoPagoPaymentResponse {
  id: number
  date_created: string
  date_approved: string
  date_last_updated: string
  date_of_expiration: string
  money_release_date: string
  operation_type: string
  issuer_id: string
  payment_method_id: string
  payment_type_id: string
  status: MercadoPagoPaymentStatus
  status_detail: string
  currency_id: string
  description: string
  live_mode: boolean
  sponsor_id: number
  authorization_code: string
  money_release_schema: string
  counter_currency: string
  collector_id: number
  payer: MercadoPagoPayer
  metadata: Record<string, any>
  order: MercadoPagoOrder
  external_reference: string
  transaction_amount: number
  transaction_amount_refunded: number
  coupon_amount: number
  differential_pricing_id: string
  deduction_schema: string
  transaction_details: MercadoPagoTransactionDetails
  fee_details: MercadoPagoFeeDetail[]
  captured: boolean
  binary_mode: boolean
  call_for_authorize_id: string
  statement_descriptor: string
  installments: number
  card: MercadoPagoCard
  notification_url: string
  refunds: any[]
  additional_info: string
  processing_mode: string
  merchant_account_id: string
  merchant_number: string
  acquirer: string
  acquirer_reconciliation: any[]
  merchant_services: MercadoPagoMerchantServices
  point_of_interaction: MercadoPagoPointOfInteraction
}

export type MercadoPagoPaymentStatus = 
  | "pending"
  | "approved"
  | "authorized"
  | "in_process"
  | "in_mediation"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back"

export interface MercadoPagoOrder {
  id: number
  type: string
}

export interface MercadoPagoTransactionDetails {
  payment_method_reference_id: string
  net_received_amount: number
  total_paid_amount: number
  overpaid_amount: number
  external_resource_url: string
  installment_amount: number
  financial_institution: string
  payable_deferral_period: string
  acquirer_reconciliation: any[]
}

export interface MercadoPagoFeeDetail {
  type: string
  amount: number
  fee_payer: string
}

export interface MercadoPagoCard {
  id: string
  last_four_digits: string
  first_six_digits: string
  expiration_month: number
  expiration_year: number
  date_created: string
  date_last_updated: string
  user_id: string
  live_mode: boolean
  require_esc: boolean
  card_number_length: number
  security_code_length: number
  security_code_mode: string
  expire_month: number
  expire_year: number
  cardholder: MercadoPagoCardholder
}

export interface MercadoPagoCardholder {
  name: string
  identification: MercadoPagoIdentification
}

export interface MercadoPagoMerchantServices {
  fraud_scoring: boolean
  fraud_manual_review: boolean
  merchant_account_id: string
}

export interface MercadoPagoPointOfInteraction {
  type: string
  application_data: MercadoPagoApplicationData
  transaction_data: MercadoPagoTransactionData
}

export interface MercadoPagoApplicationData {
  name: string
  version: string
}

export interface MercadoPagoTransactionData {
  qr_code: string
  qr_code_base64: string
  ticket_url: string
}

// Webhook Types
export interface MercadoPagoWebhookPayload {
  id: string
  live_mode: boolean
  type: MercadoPagoWebhookType
  date_created: string
  user_id: string
  api_version: string
  action: MercadoPagoWebhookAction
  data: {
    id: string
  }
}

export type MercadoPagoWebhookType = 
  | "payment"
  | "plan"
  | "subscription"
  | "invoice"
  | "point_integration_wh"

export type MercadoPagoWebhookAction = 
  | "payment.created"
  | "payment.updated"
  | "payment.updated"
  | "plan.created"
  | "plan.updated"
  | "subscription.created"
  | "subscription.updated"
  | "invoice.created"
  | "invoice.updated"
  | "point_integration_wh.created"
  | "point_integration_wh.updated"

// Refund Types
export interface MercadoPagoRefundResponse {
  id: number
  payment_id: number
  amount: number
  status: MercadoPagoRefundStatus
  date_created: string
  unique_sequence_number: string
  reason: string
  metadata: Record<string, any>
}

export type MercadoPagoRefundStatus = 
  | "pending"
  | "approved"
  | "cancelled"

// Error Types
export interface MercadoPagoError {
  message: string
  error: string
  status: number
  cause: MercadoPagoErrorCause[]
}

export interface MercadoPagoErrorCause {
  code: string
  description: string
  data: any
}

// Provider Configuration Types
export interface MercadoPagoProviderConfig {
  accessToken: string
  publicKey: string
  webhookSecret: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
  baseUrl: string
}

// Payment Session Types
export interface MercadoPagoPaymentSession {
  preference_id: string
  init_point: string
  sandbox_init_point: string
}

// Order Update Types
export interface OrderStatusUpdate {
  orderId: string
  status: string
  paymentId: string
  paymentStatus: MercadoPagoPaymentStatus
}

