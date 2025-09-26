/**
 * MercadoPago Payment Provider Configuration Example
 * 
 * This file demonstrates how to configure the MercadoPago payment provider
 * with various options for different use cases.
 */

import { defineConfig } from "@medusajs/medusa"

// Basic Configuration
export const basicConfig = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/mercadopago",
            id: "mercadopago",
            options: {
              // Required configuration
              accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
              publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
              webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
              successUrl: process.env.MERCADOPAGO_SUCCESS_URL || "http://localhost:3000/checkout/success",
              failureUrl: process.env.MERCADOPAGO_FAILURE_URL || "http://localhost:3000/checkout/failure",
              pendingUrl: process.env.MERCADOPAGO_PENDING_URL || "http://localhost:3000/checkout/pending",
              baseUrl: process.env.MERCADOPAGO_BASE_URL || "https://api.mercadopago.com",
            }
          }
        ]
      }
    }
  ]
})

// Advanced Configuration with all options
export const advancedConfig = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/mercadopago",
            id: "mercadopago",
            options: {
              // Required configuration
              accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
              publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
              webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
              successUrl: process.env.MERCADOPAGO_SUCCESS_URL || "http://localhost:3000/checkout/success",
              failureUrl: process.env.MERCADOPAGO_FAILURE_URL || "http://localhost:3000/checkout/failure",
              pendingUrl: process.env.MERCADOPAGO_PENDING_URL || "http://localhost:3000/checkout/pending",
              baseUrl: process.env.MERCADOPAGO_BASE_URL || "https://api.mercadopago.com",
              
              // Advanced configuration options
              autoReturn: "approved", // "approved" | "all"
              binaryMode: false, // Enable for immediate payment processing
              expires: true, // Enable preference expiration
              expirationDateFrom: new Date().toISOString(),
              expirationDateTo: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
              externalReference: "medusajs-store",
              notificationUrl: `${process.env.BACKEND_URL}/hooks/payment/mercadopago_mercadopago`,
              
              // Payment methods configuration
              paymentMethods: {
                excludedPaymentMethods: [
                  { id: "visa" }, // Exclude Visa cards
                  { id: "master" } // Exclude Mastercard
                ],
                excludedPaymentTypes: [
                  { id: "credit_card" } // Exclude all credit cards
                ],
                installments: 12 // Maximum installments
              },
              
              // Custom back URLs
              backUrls: {
                success: "https://yourstore.com/checkout/success",
                failure: "https://yourstore.com/checkout/failure",
                pending: "https://yourstore.com/checkout/pending"
              },
              
              // Marketplace configuration
              marketplace: "your-marketplace-id",
              marketplaceFee: 2.5, // 2.5% marketplace fee
              
              // Differential pricing
              differentialPricingId: "your-differential-pricing-id",
              
              // Taxes configuration
              taxes: [
                {
                  type: "IVA",
                  value: 19.0
                }
              ],
              
              // Additional information
              additionalInfo: "Additional information about your store",
              
              // Custom metadata
              metadata: {
                store_version: "2.0",
                integration_version: "1.0.0",
                custom_field: "custom_value"
              }
            }
          }
        ]
      }
    }
  ]
})

// Production Configuration
export const productionConfig = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/mercadopago",
            id: "mercadopago",
            options: {
              // Required configuration
              accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
              publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
              webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
              successUrl: process.env.MERCADOPAGO_SUCCESS_URL,
              failureUrl: process.env.MERCADOPAGO_FAILURE_URL,
              pendingUrl: process.env.MERCADOPAGO_PENDING_URL,
              baseUrl: "https://api.mercadopago.com",
              
              // Production-specific configuration
              autoReturn: "approved",
              binaryMode: true, // Enable for production
              expires: true,
              expirationDateFrom: new Date().toISOString(),
              expirationDateTo: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
              notificationUrl: `${process.env.BACKEND_URL}/hooks/payment/mercadopago_mercadopago`,
              
              // Payment methods for production
              paymentMethods: {
                excludedPaymentMethods: [],
                excludedPaymentTypes: [],
                installments: 24 // More installments for production
              },
              
              // Production metadata
              metadata: {
                environment: "production",
                store_id: process.env.STORE_ID,
                version: process.env.APP_VERSION
              }
            }
          }
        ]
      }
    }
  ]
})

// Development/Testing Configuration
export const developmentConfig = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/mercadopago",
            id: "mercadopago",
            options: {
              // Required configuration
              accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
              publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
              webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
              successUrl: "http://localhost:3000/checkout/success",
              failureUrl: "http://localhost:3000/checkout/failure",
              pendingUrl: "http://localhost:3000/checkout/pending",
              baseUrl: "https://api.mercadopago.com", // Use production API for testing
              
              // Development-specific configuration
              autoReturn: "all", // Return for all statuses in development
              binaryMode: false, // Disable for testing
              expires: false, // No expiration for testing
              notificationUrl: "https://your-ngrok-url.ngrok.io/hooks/payment/mercadopago_mercadopago",
              
              // Development metadata
              metadata: {
                environment: "development",
                debug: true,
                test_mode: true
              }
            }
          }
        ]
      }
    }
  ]
})

// Environment-specific configuration
export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  
  switch (env) {
    case 'production':
      return productionConfig
    case 'development':
      return developmentConfig
    default:
      return basicConfig
  }
}

export default getConfig()
