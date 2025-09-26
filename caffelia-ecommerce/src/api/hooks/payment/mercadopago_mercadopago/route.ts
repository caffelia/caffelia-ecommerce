import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import crypto from "crypto"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const paymentModuleService = req.scope.resolve(Modules.PAYMENT)
    
    // Get webhook data and headers
    const webhookData = req.body
    const headers = req.headers
    const query = req.query
    
    // Extract signature for validation
    const xSignature = headers['x-signature'] as string
    const xRequestId = headers['x-request-id'] as string
    
    // Get webhook secret from environment
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET
    
    if (!webhookSecret) {
      console.error("MercadoPago webhook secret not configured")
      return res.status(500).json({ 
        success: false, 
        error: "Webhook secret not configured" 
      })
    }
    
    // Validate webhook signature if present
    if (xSignature && webhookSecret) {
      const isValid = validateWebhookSignature(webhookData, xSignature, xRequestId, query, webhookSecret)
      if (!isValid) {
        console.error("Invalid MercadoPago webhook signature")
        return res.status(401).json({ 
          success: false, 
          error: "Invalid webhook signature" 
        })
      }
    }
    
    // Process the webhook using the payment module service
    const result = await paymentModuleService.processWebhook({
      provider_id: "mercadopago",
      data: {
        ...webhookData,
        rawData: webhookData,
        headers: headers,
        query: query
      },
    })
    
    // Return HTTP 200 as required by MercadoPago
    res.status(200).json({ success: true, result })
  } catch (error: any) {
    console.error("MercadoPago webhook error:", error)
    res.status(500).json({ 
      success: false, 
      error: error.message || "Internal server error" 
    })
  }
}

// Validate MercadoPago webhook signature
function validateWebhookSignature(
  body: any, 
  xSignature: string, 
  xRequestId: string, 
  query: any, 
  secret: string
): boolean {
  try {
    // Extract timestamp and hash from x-signature header
    const parts = xSignature.split(',')
    let ts = ''
    let hash = ''
    
    parts.forEach(part => {
      const [key, value] = part.split('=')
      if (key === 'ts') ts = value
      if (key === 'v1') hash = value
    })
    
    // Build the signature template
    const dataId = query['data.id'] || body?.data?.id || ''
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
    
    // Generate HMAC-SHA256 signature
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(manifest)
      .digest('hex')
    
    return expectedHash === hash
  } catch (error) {
    console.error("Error validating webhook signature:", error)
    return false
  }
}
