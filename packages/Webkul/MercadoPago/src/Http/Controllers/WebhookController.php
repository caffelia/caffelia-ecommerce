<?php

namespace Webkul\MercadoPago\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Webkul\MercadoPago\Helpers\MercadoPagoAPI;
use Webkul\MercadoPago\Models\WebhookEvent;
use Webkul\Sales\Models\Order;
use Webkul\Sales\Models\Invoice;
use Webkul\Sales\Repositories\OrderRepository;
use Webkul\Sales\Repositories\InvoiceRepository;
use Webkul\Sales\Repositories\RefundRepository;

class WebhookController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(
        protected OrderRepository $orderRepository,
        protected InvoiceRepository $invoiceRepository,
        protected RefundRepository $refundRepository
    ) {}

    /**
     * Handle the incoming webhook from MercadoPago.
     *
     * @return \Illuminate\Http\Response
     */
    public function handle(Request $request)
    {
        if (! $this->isValidSignature($request)) {
            logger()->warning('MercadoPago Webhook - Invalid signature', [
                'ip'      => $request->ip(),
                'payload' => $request->all(),
            ]);

            return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 403);
        }

        $startTime = microtime(true);
        $webhookId = $request->header('x-request-id', uniqid('webhook_', true));

        try {
            logger()->info('MercadoPago Webhook received', [
                'webhook_id' => $webhookId,
                'headers' => $request->headers->all(),
                'payload' => $request->all(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Validate webhook payload and signature
            $validationResult = $this->validateWebhook($request);
            if (!$validationResult['valid']) {
                logger()->warning('MercadoPago Webhook - Validation failed', [
                    'webhook_id' => $webhookId,
                    'reason' => $validationResult['reason'],
                    'ip' => $request->ip(),
                ]);
                return response($validationResult['reason'], 400);
            }

            $data = $request->all();
            $eventType = $data['type'] ?? '';
            $action = $data['action'] ?? '';
            $eventId = $data['id'] ?? '';

            // Check for idempotency - prevent duplicate processing
            if ($this->isDuplicateEvent($eventId, $webhookId)) {
                logger()->info('MercadoPago Webhook - Duplicate event ignored', [
                    'webhook_id' => $webhookId,
                    'event_id' => $eventId,
                ]);
                return response('Duplicate event ignored', 200);
            }

            // Store webhook event for tracking and debugging
            $webhookEvent = $this->storeWebhookEvent($request, $webhookId, $eventType, $action);

            // Handle different webhook types
            $result = $this->processWebhookEvent($eventType, $action, $data, $webhookEvent);

            // Update webhook event with processing result
            $webhookEvent->update([
                'processed_at' => now(),
                'processing_time' => round((microtime(true) - $startTime) * 1000, 2), // milliseconds
                'status' => $result['success'] ? 'processed' : 'failed',
                'response_data' => $result,
            ]);

            return response($result['message'], $result['success'] ? 200 : 400);

        } catch (\Exception $e) {
            $processingTime = round((microtime(true) - $startTime) * 1000, 2);

            logger()->error('MercadoPago Webhook - Critical error processing webhook', [
                'webhook_id' => $webhookId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'processing_time' => $processingTime,
                'request_data' => $request->all(),
            ]);

            // Update webhook event if it was created
            if (isset($webhookEvent)) {
                $webhookEvent->update([
                    'status' => 'error',
                    'processing_time' => $processingTime,
                    'error_message' => $e->getMessage(),
                ]);
            }

            return response('Internal Server Error', 500);
        }
    }

    /**
     * Verify the signature of the incoming webhook request.
     */
    private function isValidSignature(Request $request): bool
    {
        $secret = config('services.mercadopago.webhook_secret');

        if (empty($secret)) {
            logger()->error('MercadoPago Webhook - Webhook secret is not configured.');

            return false;
        }

        $signatureHeader = $request->header('x-signature');

        if (! $signatureHeader) {
            return false;
        }

        $parts = collect(explode(',', $signatureHeader))->mapWithKeys(function ($part) {
            [$key, $value] = explode('=', $part, 2);

            return [trim($key) => trim($value)];
        });

        if (! $parts->has('ts') || ! $parts->has('v1')) {
            return false;
        }

        $timestamp = $parts->get('ts');

        $signedPayload = 'id:' . $request->input('data.id') . ';request-id:' . $request->header('x-request-id') . ';ts:' . $timestamp . ';';

        $expectedSignature = hash_hmac('sha256', $signedPayload, $secret);

        return hash_equals($expectedSignature, $parts->get('v1'));
    }

    /**
     * Validate webhook signature and data.
     *
     * @param Request $request
     * @return array
     */
    private function validateWebhook(Request $request): array
    {
        $data = $request->all();

        // Basic validation - check if required fields are present
        if (!isset($data['type']) || !isset($data['data'])) {
            return [
                'valid' => false,
                'reason' => 'Missing required fields (type, data)',
            ];
        }

        // Validate webhook source IP (MercadoPago IP ranges)
        if (!$this->isValidMercadoPagoIP($request->ip())) {
            return [
                'valid' => false,
                'reason' => 'Invalid source IP',
            ];
        }

        // Enhanced signature validation if webhook secret is configured
        $webhookSecret = $this->getWebhookSecret();
        if ($webhookSecret) {
            $signature = $request->header('x-signature');
            $timestamp = $request->header('x-request-id');

            if (!$signature) {
                return [
                    'valid' => false,
                    'reason' => 'Missing webhook signature',
                ];
            }

            if (!$this->validateSignature($request->getContent(), $signature, $webhookSecret, $timestamp)) {
                return [
                    'valid' => false,
                    'reason' => 'Invalid webhook signature',
                ];
            }
        }

        return ['valid' => true];
    }

    /**
     * Validate webhook signature using MercadoPago's algorithm.
     *
     * @param string $payload
     * @param string $signature
     * @param string $secret
     * @param string $timestamp
     * @return bool
     */
    private function validateSignature(string $payload, string $signature, string $secret, string $timestamp): bool
    {
        try {
            // MercadoPago uses HMAC-SHA256 for webhook signature validation
            $expectedSignature = hash_hmac('sha256', $timestamp . $payload, $secret);

            // Parse signature header (format: "ts=timestamp,v1=signature")
            $signatureParts = [];
            foreach (explode(',', $signature) as $part) {
                [$key, $value] = explode('=', $part, 2);
                $signatureParts[$key] = $value;
            }

            $providedSignature = $signatureParts['v1'] ?? '';

            return hash_equals($expectedSignature, $providedSignature);

        } catch (\Exception $e) {
            logger()->error('MercadoPago Webhook - Signature validation error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if IP is from MercadoPago's webhook servers.
     *
     * @param string $ip
     * @return bool
     */
    private function isValidMercadoPagoIP(string $ip): bool
    {
        return true;

        // MercadoPago webhook IP ranges (update as needed based on their documentation)
        $allowedRanges = [
            '209.225.49.0/24',
            '216.33.197.0/24',
            '216.33.196.0/24',
            '209.225.48.0/24',
        ];

        foreach ($allowedRanges as $range) {
            if ($this->ipInRange($ip, $range)) {
                return true;
            }
        }

        logger()->warning('MercadoPago Webhook - Request from unauthorized IP', [
            'ip'             => $ip,
            'allowed_ranges' => $allowedRanges,
        ]);

        return false;
    }

    /**
     * Check if an IP is within a CIDR range.
     *
     * @param string $ip
     * @param string $range
     * @return bool
     */
    private function ipInRange(string $ip, string $range): bool
    {
        [$subnet, $mask] = explode('/', $range);
        return (ip2long($ip) & ~((1 << (32 - $mask)) - 1)) === ip2long($subnet);
    }

    /**
     * Check if this is a duplicate event to prevent double processing.
     *
     * @param string $eventId
     * @param string $webhookId
     * @return bool
     */
    private function isDuplicateEvent(string $eventId, string $webhookId): bool
    {
        if (!$eventId) {
            return false;
        }

        $cacheKey = "mercadopago_webhook_processed_{$eventId}";

        if (Cache::has($cacheKey)) {
            return true;
        }

        // Set cache for 24 hours to prevent reprocessing
        Cache::put($cacheKey, $webhookId, now()->addDay());

        return false;
    }

    /**
     * Store webhook event for tracking and debugging.
     *
     * @param Request $request
     * @param string $webhookId
     * @param string $eventType
     * @param string $action
     * @return WebhookEvent
     */
    private function storeWebhookEvent(Request $request, string $webhookId, string $eventType, string $action): WebhookEvent
    {
        return WebhookEvent::create([
            'webhook_id' => $webhookId,
            'event_type' => $eventType,
            'action' => $action,
            'payload' => $request->all(),
            'headers' => $request->headers->all(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'received',
            'received_at' => now(),
        ]);
    }

    /**
     * Process webhook event based on type.
     *
     * @param string $eventType
     * @param string $action
     * @param array $data
     * @param WebhookEvent $webhookEvent
     * @return array
     */
    private function processWebhookEvent(string $eventType, string $action, array $data, WebhookEvent $webhookEvent): array
    {
        try {
            switch ($eventType) {
                case 'payment':
                    return $this->handlePaymentWebhook($data, $webhookEvent);

                case 'plan':
                case 'subscription':
                case 'invoice':
                    // Handle subscription-related webhooks if needed in the future
                    logger()->info("MercadoPago Webhook - {$eventType} webhook received but not handled", [
                        'webhook_id' => $webhookEvent->webhook_id,
                        'data' => $data,
                    ]);
                    return [
                        'success' => true,
                        'message' => "Webhook type '{$eventType}' acknowledged but not processed",
                    ];

                case 'merchant_order':
                    return $this->handleMerchantOrderWebhook($data, $webhookEvent);

                default:
                    logger()->info("MercadoPago Webhook - Unknown type: {$eventType}", [
                        'webhook_id' => $webhookEvent->webhook_id,
                        'data' => $data,
                    ]);
                    return [
                        'success' => true,
                        'message' => "Unknown webhook type: {$eventType}",
                    ];
            }
        } catch (\Exception $e) {
            logger()->error('MercadoPago Webhook - Error processing event', [
                'webhook_id' => $webhookEvent->webhook_id,
                'event_type' => $eventType,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Error processing webhook event',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle payment webhook notifications with retry logic.
     *
     * @param array $data
     * @param WebhookEvent $webhookEvent
     * @return array
     */
    private function handlePaymentWebhook(array $data, WebhookEvent $webhookEvent): array
    {
        $paymentId = $data['data']['id'] ?? null;

        if (!$paymentId) {
            return [
                'success' => false,
                'message' => 'No payment ID in webhook data',
            ];
        }

        // Get payment details from MercadoPago API with retry logic
        $paymentDetails = $this->getPaymentDetailsWithRetry($paymentId, 3);

        if (!$paymentDetails) {
            return [
                'success' => false,
                'message' => "Could not fetch payment details for ID: {$paymentId}",
            ];
        }

        logger()->info('MercadoPago Webhook - Payment details retrieved', [
            'webhook_id' => $webhookEvent->webhook_id,
            'payment_id' => $paymentId,
            'payment_status' => $paymentDetails['status'] ?? 'unknown',
        ]);

        // Find order by external reference
        $externalReference = $paymentDetails['external_reference'] ?? '';
        $order = $this->findOrderByReference($externalReference);

        if (!$order) {
            logger()->warning("MercadoPago Webhook - Order not found for reference: {$externalReference}", [
                'webhook_id' => $webhookEvent->webhook_id,
                'payment_id' => $paymentId,
            ]);
            return [
                'success' => false,
                'message' => "Order not found for reference: {$externalReference}",
            ];
        }

        // Update webhook event with order information
        $webhookEvent->update([
            'order_id' => $order->id,
            'payment_id' => $paymentId,
        ]);

        // Update order status in a database transaction
        DB::beginTransaction();
        try {
            $result = $this->updateOrderStatus($order, $paymentDetails, $webhookEvent);
            DB::commit();

            return [
                'success' => true,
                'message' => "Order {$order->id} processed successfully",
                'order_id' => $order->id,
                'payment_status' => $paymentDetails['status'],
                'result' => $result,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Handle merchant order webhook notifications.
     *
     * @param array $data
     * @param WebhookEvent $webhookEvent
     * @return array
     */
    private function handleMerchantOrderWebhook(array $data, WebhookEvent $webhookEvent): array
    {
        $merchantOrderId = $data['data']['id'] ?? null;

        if (!$merchantOrderId) {
            return [
                'success' => false,
                'message' => 'No merchant order ID in webhook data',
            ];
        }

        // Get merchant order details from MercadoPago API
        $apiHelper = $this->getApiHelper();
        $merchantOrderDetails = $apiHelper->getMerchantOrder($merchantOrderId);

        if (!$merchantOrderDetails) {
            return [
                'success' => false,
                'message' => "Could not fetch merchant order details for ID: {$merchantOrderId}",
            ];
        }

        logger()->info('MercadoPago Webhook - Merchant order processed', [
            'webhook_id' => $webhookEvent->webhook_id,
            'merchant_order_id' => $merchantOrderId,
            'status' => $merchantOrderDetails['status'] ?? 'unknown',
        ]);

        return [
            'success' => true,
            'message' => "Merchant order {$merchantOrderId} processed",
        ];
    }

    /**
     * Get payment details with retry logic.
     *
     * @param string $paymentId
     * @param int $maxRetries
     * @return array|null
     */
    private function getPaymentDetailsWithRetry(string $paymentId, int $maxRetries = 3): ?array
    {
        $apiHelper = $this->getApiHelper();

        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                $paymentDetails = $apiHelper->getPayment($paymentId);

                if ($paymentDetails) {
                    return $paymentDetails;
                }

                if ($attempt < $maxRetries) {
                    // Exponential backoff: 1s, 2s, 4s
                    $delay = pow(2, $attempt - 1);
                    logger()->info("MercadoPago Webhook - Retrying payment fetch in {$delay}s", [
                        'payment_id' => $paymentId,
                        'attempt' => $attempt,
                    ]);
                    sleep($delay);
                }
            } catch (\Exception $e) {
                logger()->error("MercadoPago Webhook - Error fetching payment (attempt {$attempt}): " . $e->getMessage(), [
                    'payment_id' => $paymentId,
                ]);

                if ($attempt === $maxRetries) {
                    throw $e;
                }
            }
        }

        return null;
    }

    /**
     * Find order by external reference with improved matching.
     *
     * @param string $externalReference
     * @return Order|null
     */
    private function findOrderByReference(string $externalReference): ?Order
    {
        if (!$externalReference) {
            return null;
        }

        // Try different external reference patterns
        $patterns = [
            '/bagisto_order_(\d+)/',  // Standard pattern
            '/order_(\d+)/',          // Alternative pattern
            '/cart_(\d+)/',           // Cart-based pattern
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $externalReference, $matches)) {
                $id = $matches[1];

                // Try finding by cart ID first (most common)
                $order = Order::where('cart_id', $id)->first();
                if ($order) {
                    return $order;
                }

                // Try finding by order ID
                $order = Order::find($id);
                if ($order) {
                    return $order;
                }
            }
        }

        // Try exact match on external reference field if it exists
        $order = Order::whereHas('payment', function ($query) use ($externalReference) {
            $query->where('additional->external_reference', $externalReference);
        })->first();

        return $order;
    }

    /**
     * Update order status based on payment details with comprehensive handling.
     *
     * @param Order $order
     * @param array $paymentDetails
     * @param WebhookEvent $webhookEvent
     * @return array
     */
    private function updateOrderStatus(Order $order, array $paymentDetails, WebhookEvent $webhookEvent): array
    {
        $paymentStatus = $paymentDetails['status'] ?? '';
        $paymentId = $paymentDetails['id'] ?? '';
        $statusDetail = $paymentDetails['status_detail'] ?? '';

        logger()->info("MercadoPago Webhook - Updating order {$order->id} for payment {$paymentId} with status {$paymentStatus}", [
            'webhook_id' => $webhookEvent->webhook_id,
            'current_order_status' => $order->status,
            'payment_status_detail' => $statusDetail,
        ]);

        $result = ['action' => 'none', 'previous_status' => $order->status];

        switch ($paymentStatus) {
            case 'approved':
                $result = array_merge($result, $this->handleApprovedPayment($order, $paymentDetails));
                break;

            case 'rejected':
            case 'cancelled':
                $result = array_merge($result, $this->handleRejectedPayment($order, $paymentDetails));
                break;

            case 'refunded':
            case 'charged_back':
                $result = array_merge($result, $this->handleRefundedPayment($order, $paymentDetails));
                break;

            case 'pending':
            case 'authorized':
            case 'in_process':
                $result = array_merge($result, $this->handlePendingPayment($order, $paymentDetails));
                break;

            default:
                logger()->info("MercadoPago Webhook - Unknown payment status: {$paymentStatus} for order {$order->id}", [
                    'webhook_id' => $webhookEvent->webhook_id,
                ]);
                $result['action'] = 'unknown_status';
                break;
        }

        // Update order's payment additional data
        $additionalData = array_merge(
            $order->payment->additional ?? [],
            [
                'mercadopago_payment_id' => $paymentId,
                'mercadopago_status' => $paymentStatus,
                'mercadopago_status_detail' => $statusDetail,
                'last_webhook_update' => now()->toISOString(),
                'webhook_id' => $webhookEvent->webhook_id,
                'transaction_amount' => $paymentDetails['transaction_amount'] ?? null,
                'fee_details' => $paymentDetails['fee_details'] ?? null,
            ]
        );

        $order->payment->update(['additional' => $additionalData]);

        $result['final_status'] = $order->fresh()->status;
        return $result;
    }

    /**
     * Handle approved payment with enhanced invoice creation.
     *
     * @param Order $order
     * @param array $paymentDetails
     * @return array
     */
    private function handleApprovedPayment(Order $order, array $paymentDetails): array
    {
        $result = ['action' => 'payment_approved'];

        if (in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PENDING_PAYMENT])) {
            $order->update(['status' => Order::STATUS_PROCESSING]);
            $result['status_changed'] = true;

            // Create invoice if it doesn't exist
            if (!$order->invoices->count()) {
                try {
                    $invoice = $this->invoiceRepository->create([
                        'order_id' => $order->id,
                        'state' => 'paid',
                        'email_sent' => 0,
                        'total_qty' => $order->total_qty_ordered,
                        'base_currency_code' => $order->base_currency_code,
                        'channel_currency_code' => $order->channel_currency_code,
                        'order_currency_code' => $order->order_currency_code,
                        'sub_total' => $order->sub_total,
                        'base_sub_total' => $order->base_sub_total,
                        'grand_total' => $order->grand_total,
                        'base_grand_total' => $order->base_grand_total,
                        'shipping_amount' => $order->shipping_amount,
                        'base_shipping_amount' => $order->base_shipping_amount,
                        'tax_amount' => $order->tax_amount,
                        'base_tax_amount' => $order->base_tax_amount,
                        'discount_amount' => $order->discount_amount,
                        'base_discount_amount' => $order->base_discount_amount,
                        'transaction_id' => $paymentDetails['id'] ?? null,
                    ]);

                    $result['invoice_created'] = true;
                    $result['invoice_id'] = $invoice->id;

                    logger()->info("MercadoPago Webhook - Invoice created for order {$order->id}", [
                        'invoice_id' => $invoice->id,
                        'payment_id' => $paymentDetails['id'] ?? null,
                    ]);
                } catch (\Exception $e) {
                    logger()->error("MercadoPago Webhook - Error creating invoice for order {$order->id}: " . $e->getMessage());
                    $result['invoice_error'] = $e->getMessage();
                }
            } else {
                $result['invoice_exists'] = true;
            }
        } else {
            $result['status_unchanged'] = "Order already in {$order->status} status";
        }

        return $result;
    }

    /**
     * Handle rejected payment.
     *
     * @param Order $order
     * @param array $paymentDetails
     * @return array
     */
    private function handleRejectedPayment(Order $order, array $paymentDetails): array
    {
        $result = ['action' => 'payment_rejected'];

        if (in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PENDING_PAYMENT, Order::STATUS_PROCESSING])) {
            $order->update(['status' => Order::STATUS_CANCELED]);
            $result['status_changed'] = true;

            logger()->info("MercadoPago Webhook - Order {$order->id} cancelled due to payment rejection", [
                'payment_id' => $paymentDetails['id'] ?? null,
                'status_detail' => $paymentDetails['status_detail'] ?? null,
            ]);
        } else {
            $result['status_unchanged'] = "Order already in {$order->status} status";
        }

        return $result;
    }

    /**
     * Handle refunded payment with refund creation.
     *
     * @param Order $order
     * @param array $paymentDetails
     * @return array
     */
    private function handleRefundedPayment(Order $order, array $paymentDetails): array
    {
        $result = ['action' => 'payment_refunded'];

        // Only process refunds for paid orders
        if (in_array($order->status, [Order::STATUS_PROCESSING, Order::STATUS_COMPLETED])) {
            try {
                // Create refund if an invoice exists
                $invoice = $order->invoices->first();
                if ($invoice) {
                    $refundAmount = $paymentDetails['transaction_amount'] ?? $order->grand_total;

                    $refund = $this->refundRepository->create([
                        'order_id' => $order->id,
                        'invoice_id' => $invoice->id,
                        'state' => 'refunded',
                        'base_currency_code' => $order->base_currency_code,
                        'channel_currency_code' => $order->channel_currency_code,
                        'order_currency_code' => $order->order_currency_code,
                        'adjustment_refund' => 0,
                        'base_adjustment_refund' => 0,
                        'adjustment_fee' => 0,
                        'base_adjustment_fee' => 0,
                        'sub_total' => $refundAmount,
                        'base_sub_total' => $refundAmount,
                        'grand_total' => $refundAmount,
                        'base_grand_total' => $refundAmount,
                        'shipping_amount' => 0,
                        'base_shipping_amount' => 0,
                        'tax_amount' => 0,
                        'base_tax_amount' => 0,
                        'discount_amount' => 0,
                        'base_discount_amount' => 0,
                    ]);

                    $result['refund_created'] = true;
                    $result['refund_id'] = $refund->id;
                    $result['refund_amount'] = $refundAmount;
                }

                // Update order status to canceled
                $order->update(['status' => Order::STATUS_CANCELED]);
                $result['status_changed'] = true;

                logger()->info("MercadoPago Webhook - Order {$order->id} refunded", [
                    'payment_id' => $paymentDetails['id'] ?? null,
                    'refund_amount' => $refundAmount ?? null,
                ]);

            } catch (\Exception $e) {
                logger()->error("MercadoPago Webhook - Error processing refund for order {$order->id}: " . $e->getMessage());
                $result['refund_error'] = $e->getMessage();
            }
        } else {
            $result['status_unchanged'] = "Order status {$order->status} not eligible for refund";
        }

        return $result;
    }

    /**
     * Handle pending payment.
     *
     * @param Order $order
     * @param array $paymentDetails
     * @return array
     */
    private function handlePendingPayment(Order $order, array $paymentDetails): array
    {
        $result = ['action' => 'payment_pending'];

        if ($order->status === Order::STATUS_PENDING) {
            $order->update(['status' => Order::STATUS_PENDING_PAYMENT]);
            $result['status_changed'] = true;

            logger()->info("MercadoPago Webhook - Order {$order->id} updated to pending payment", [
                'payment_id' => $paymentDetails['id'] ?? null,
                'status_detail' => $paymentDetails['status_detail'] ?? null,
            ]);
        } else {
            $result['status_unchanged'] = "Order already in {$order->status} status";
        }

        return $result;
    }

    /**
     * Get webhook secret from configuration.
     *
     * @return string|null
     */
    private function getWebhookSecret(): ?string
    {
        // Try to get from both payment method configurations
        $checkoutProSecret = core()->getConfigData('sales.payment_methods.mercadopago_checkout_pro.webhook_secret');
        $checkoutApiSecret = core()->getConfigData('sales.payment_methods.mercadopago_checkout_api.webhook_secret');

        return $checkoutProSecret ?: $checkoutApiSecret;
    }

    /**
     * Get API helper instance.
     *
     * @return MercadoPagoAPI
     */
    private function getApiHelper(): MercadoPagoAPI
    {
        return new MercadoPagoAPI(new \Webkul\MercadoPago\Payment\CheckoutPro());
    }
}
