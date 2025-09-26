# MercadoPago Payment Provider for MedusaJS

A comprehensive MercadoPago payment provider integration for MedusaJS e-commerce platform.

## Features

- ✅ **Checkout Pro Integration**: Full support for MercadoPago Checkout Pro
- ✅ **Webhook Handling**: Secure webhook processing with signature validation
- ✅ **Payment Methods**: Support for all MercadoPago payment methods
- ✅ **Refunds**: Complete refund processing
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **TypeScript**: Full TypeScript support with proper types
- ✅ **Configuration**: Flexible configuration options
- ✅ **Security**: Webhook signature validation and secure API calls

## Installation

1. **Install Dependencies**:
   ```bash
   npm install axios crypto
   ```

2. **Environment Variables**:
   Add the following to your `.env` file:
   ```env
   MERCADOPAGO_ACCESS_TOKEN=your_access_token
   MERCADOPAGO_PUBLIC_KEY=your_public_key
   MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret
   MERCADOPAGO_BASE_URL=https://api.mercadopago.com
   BACKEND_URL=http://localhost:9000
   ```

3. **Register Provider**:
   Add to your `medusa-config.ts`:
   ```typescript
   import { defineConfig } from "@medusajs/medusa"

   export default defineConfig({
     modules: [
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
                 // Optional advanced configuration
                 autoReturn: "approved",
                 binaryMode: false,
                 expires: false,
                 paymentMethods: {
                   excludedPaymentMethods: [],
                   excludedPaymentTypes: [],
                   installments: 12
                 }
               }
             }
           ]
         }
       }
     ]
   })
   ```

## Configuration Options

### Required Options
- `accessToken`: Your MercadoPago access token
- `publicKey`: Your MercadoPago public key
- `webhookSecret`: Secret for webhook signature validation
- `successUrl`: URL to redirect after successful payment
- `failureUrl`: URL to redirect after failed payment
- `pendingUrl`: URL to redirect for pending payments
- `baseUrl`: MercadoPago API base URL

### Optional Advanced Options
- `autoReturn`: Auto-return behavior ("approved" | "all")
- `binaryMode`: Enable binary mode for immediate payment processing
- `expires`: Enable preference expiration
- `expirationDateFrom`: Start date for preference validity
- `expirationDateTo`: End date for preference validity
- `externalReference`: External reference for payments
- `notificationUrl`: Custom notification URL
- `marketplace`: Marketplace identifier
- `marketplaceFee`: Marketplace fee percentage
- `differentialPricingId`: Differential pricing ID
- `taxes`: Array of tax configurations
- `backUrls`: Custom back URLs configuration
- `paymentMethods`: Payment methods configuration
- `additionalInfo`: Additional information for preferences
- `metadata`: Custom metadata for preferences

## Webhook Setup

1. **Configure Webhook URL**:
   Set your webhook URL in MercadoPago dashboard:
   ```
   https://your-domain.com/hooks/payment/mercadopago_mercadopago
   ```

2. **Webhook Events**:
   The provider handles the following events:
   - `payment.created`
   - `payment.updated`
   - `payment.cancelled`
   - `merchant_order.created`
   - `merchant_order.updated`

## API Methods

### initiatePayment
Creates a MercadoPago preference for payment processing.

**Input**: `InitiatePaymentInput`
**Output**: `InitiatePaymentOutput`

### authorizePayment
Authorizes a payment session.

**Input**: `AuthorizePaymentInput`
**Output**: `AuthorizePaymentOutput`

### capturePayment
Captures an authorized payment.

**Input**: `CapturePaymentInput`
**Output**: `CapturePaymentOutput`

### refundPayment
Processes a refund for a payment.

**Input**: `RefundPaymentInput`
**Output**: `RefundPaymentOutput`

### retrievePayment
Retrieves payment details from MercadoPago.

**Input**: `RetrievePaymentInput`
**Output**: `RetrievePaymentOutput`

### deletePayment
Deletes a payment session.

**Input**: `DeletePaymentInput`
**Output**: `DeletePaymentOutput`

### updatePayment
Updates a payment session.

**Input**: `UpdatePaymentInput`
**Output**: `UpdatePaymentOutput`

### getPaymentStatus
Gets the current status of a payment.

**Input**: `GetPaymentStatusInput`
**Output**: `GetPaymentStatusOutput`

### getWebhookActionAndData
Processes webhook events from MercadoPago.

**Input**: Webhook payload
**Output**: Action and data for MedusaJS

## Error Handling

The provider includes comprehensive error handling:

- **API Errors**: Proper handling of MercadoPago API errors
- **Validation Errors**: Input validation with descriptive messages
- **Network Errors**: Timeout and connection error handling
- **Webhook Errors**: Secure webhook processing with signature validation

## Logging

The provider includes detailed logging for:

- Payment operations
- Webhook processing
- API calls
- Error conditions
- Debug information

## Security

- **Webhook Signature Validation**: Validates webhook signatures for security
- **Secure API Calls**: Uses HTTPS and proper authentication
- **Input Validation**: Validates all inputs before processing
- **Error Sanitization**: Prevents sensitive data exposure in errors

## Testing

Use MercadoPago's sandbox environment for testing:

1. Set `MERCADOPAGO_BASE_URL=https://api.mercadopago.com` (production)
2. Use sandbox credentials for testing
3. Test webhook events using MercadoPago's webhook testing tools

## Support

For issues and questions:

1. Check the logs for detailed error information
2. Verify your configuration matches the requirements
3. Ensure webhook URLs are accessible
4. Test with MercadoPago's sandbox environment

## License

This provider is part of the MedusaJS ecosystem and follows the same licensing terms.