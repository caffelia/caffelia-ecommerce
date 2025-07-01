<?php

namespace Webkul\MercadoPago\Tests\Concerns;

use Illuminate\Support\Facades\Config;
use Webkul\Core\Models\Currency;
use Webkul\Sales\Models\Order;
use Webkul\Checkout\Models\Cart;
use Webkul\MercadoPago\Payment\CheckoutPro;
use Webkul\MercadoPago\Payment\CheckoutAPI;

trait MercadoPagoTestBench
{
    /**
     * Setup MercadoPago configuration for testing.
     */
    public function setupMercadoPagoConfig(array $config = []): void
    {
        $defaultConfig = [
            'core.sales.payment_methods.mercadopago_checkout_pro.title' => 'MercadoPago Checkout Pro',
            'core.sales.payment_methods.mercadopago_checkout_pro.description' => 'Pay with MercadoPago Checkout Pro',
            'core.sales.payment_methods.mercadopago_checkout_pro.active' => 1,
            'core.sales.payment_methods.mercadopago_checkout_pro.sandbox' => 1,
            'core.sales.payment_methods.mercadopago_checkout_pro.access_token' => 'TEST-1234567890',
            'core.sales.payment_methods.mercadopago_checkout_pro.public_key' => 'TEST-pub-1234567890',
            'core.sales.payment_methods.mercadopago_checkout_pro.webhook_secret' => 'test-webhook-secret',

            'core.sales.payment_methods.mercadopago_checkout_api.title' => 'MercadoPago Checkout API',
            'core.sales.payment_methods.mercadopago_checkout_api.description' => 'Pay with MercadoPago Checkout API',
            'core.sales.payment_methods.mercadopago_checkout_api.active' => 1,
            'core.sales.payment_methods.mercadopago_checkout_api.sandbox' => 1,
            'core.sales.payment_methods.mercadopago_checkout_api.access_token' => 'TEST-1234567890',
            'core.sales.payment_methods.mercadopago_checkout_api.public_key' => 'TEST-pub-1234567890',
            'core.sales.payment_methods.mercadopago_checkout_api.webhook_secret' => 'test-webhook-secret',
        ];

        $config = array_merge($defaultConfig, $config);

        foreach ($config as $key => $value) {
            Config::set($key, $value);
        }
    }

    /**
     * Create a test cart with MercadoPago supported currency.
     */
    public function createTestCart(array $cartData = []): Cart
    {
        $defaultData = [
            'customer_email' => 'test@example.com',
            'customer_first_name' => 'Test',
            'customer_last_name' => 'Customer',
            'billing_address' => [
                'company_name' => 'Test Company',
                'first_name' => 'Test',
                'last_name' => 'Customer',
                'email' => 'test@example.com',
                'address1' => 'Test Address',
                'country' => 'BR',
                'state' => 'SP',
                'city' => 'São Paulo',
                'postcode' => '01000-000',
                'phone' => '11999999999',
            ],
            'shipping_address' => [
                'company_name' => 'Test Company',
                'first_name' => 'Test',
                'last_name' => 'Customer',
                'email' => 'test@example.com',
                'address1' => 'Test Address',
                'country' => 'BR',
                'state' => 'SP',
                'city' => 'São Paulo',
                'postcode' => '01000-000',
                'phone' => '11999999999',
            ],
        ];

        $cartData = array_merge($defaultData, $cartData);

        return Cart::factory()->create($cartData);
    }

    /**
     * Create a test order for webhook testing.
     */
    public function createTestOrder(array $orderData = []): Order
    {
        $defaultData = [
            'increment_id' => 'ORD-' . rand(100000, 999999),
            'status' => 'pending',
            'channel_name' => 'Default',
            'is_guest' => 1,
            'customer_email' => 'test@example.com',
            'customer_first_name' => 'Test',
            'customer_last_name' => 'Customer',
            'grand_total' => 100.00,
            'base_grand_total' => 100.00,
            'sub_total' => 90.00,
            'base_sub_total' => 90.00,
            'tax_amount' => 10.00,
            'base_tax_amount' => 10.00,
            'order_currency_code' => 'BRL',
            'base_currency_code' => 'BRL',
        ];

        $orderData = array_merge($defaultData, $orderData);

        return Order::factory()->create($orderData);
    }

    /**
     * Mock MercadoPago API responses.
     */
    public function mockMercadoPagoAPI(): void
    {
        // Mock successful preference creation
        $this->mockApiResponse('POST', 'checkout/preferences', [
            'id' => 'test-preference-id',
            'init_point' => 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?preference-id=test-preference-id',
            'sandbox_init_point' => 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?preference-id=test-preference-id',
        ]);

        // Mock successful payment creation
        $this->mockApiResponse('POST', 'v1/payments', [
            'id' => '123456789',
            'status' => 'approved',
            'status_detail' => 'accredited',
            'payment_method_id' => 'visa',
            'payment_type_id' => 'credit_card',
            'transaction_amount' => 100.00,
            'date_approved' => now()->toISOString(),
        ]);

        // Mock payment methods
        $this->mockApiResponse('GET', 'v1/payment_methods', [
            [
                'id' => 'visa',
                'name' => 'Visa',
                'payment_type_id' => 'credit_card',
                'status' => 'active',
            ],
            [
                'id' => 'master',
                'name' => 'Mastercard',
                'payment_type_id' => 'credit_card',
                'status' => 'active',
            ],
        ]);
    }

    /**
     * Mock API response.
     */
    private function mockApiResponse(string $method, string $endpoint, array $response): void
    {
        // This would need to be implemented based on the HTTP client used
        // For now, this is a placeholder for the concept
    }

    /**
     * Create webhook payload for testing.
     */
    public function createWebhookPayload(string $type = 'payment', array $data = []): array
    {
        $defaultData = [
            'id' => rand(100000, 999999),
            'live_mode' => false,
            'type' => $type,
            'date_created' => now()->toISOString(),
            'application_id' => '123456789',
            'user_id' => '987654321',
            'version' => 1,
            'api_version' => 'v1',
            'action' => 'payment.updated',
            'data' => [
                'id' => '123456789',
            ],
        ];

        return array_merge($defaultData, $data);
    }

    /**
     * Create webhook headers with valid signature.
     */
    public function createWebhookHeaders(array $payload, string $secret = 'test-webhook-secret'): array
    {
        $dataID = $payload['data']['id'] ?? '';
        $ts = now()->timestamp;

        $manifest = "id:{$dataID};request-id:test-request-id;ts:{$ts};";
        $cyphedSignature = hash_hmac('sha256', $manifest, $secret);
        $signature = "ts={$ts},v1={$cyphedSignature}";

        return [
            'x-signature' => $signature,
            'x-request-id' => 'test-request-id',
        ];
    }

    /**
     * Assert order status and payment details.
     */
    public function assertOrderPaymentStatus(Order $order, string $expectedStatus, array $expectedPaymentData = []): void
    {
        $this->assertEquals($expectedStatus, $order->fresh()->status);

        if (!empty($expectedPaymentData)) {
            $payment = $order->payments()->first();
            $this->assertNotNull($payment);

            foreach ($expectedPaymentData as $key => $expectedValue) {
                $this->assertEquals($expectedValue, $payment->$key);
            }
        }
    }
}
