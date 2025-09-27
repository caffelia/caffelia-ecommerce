import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "./src/modules/mipaquete",
            id: "mipaquete",
            options: {
              apiKey: process.env.MIPAQUETE_API_KEY,
              sessionTracker: process.env.MIPAQUETE_SESSION_TRACKER,
              originDaneCode:
                process.env.MIPAQUETE_ORIGIN_DANE_CODE || "11001000",
              baseUrl: process.env.MIPAQUETE_BASE_URL,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/cart-session",
    },
    {
      resolve: "./src/modules/chat-session",
    },
    {
      resolve: "./src/modules/geo",
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/mercadopago",
            id: "mercadopago",
            options: {
              accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
              publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
              webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
              successUrl: process.env.MERCADOPAGO_SUCCESS_URL,
              failureUrl: process.env.MERCADOPAGO_FAILURE_URL,
              pendingUrl: process.env.MERCADOPAGO_PENDING_URL,
              baseUrl: process.env.MERCADOPAGO_BASE_URL,
            },
          },
        ],
      },
    },
  ],
})
