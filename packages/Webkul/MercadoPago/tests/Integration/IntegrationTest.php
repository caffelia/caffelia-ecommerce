<?php

use Webkul\MercadoPago\Tests\MercadoPagoTestCase;
use Webkul\MercadoPago\Payment\CheckoutPro;
use Webkul\MercadoPago\Payment\CheckoutAPI;
use Webkul\MercadoPago\Helpers\MercadoPagoAPI;
use Webkul\MercadoPago\Models\WebhookEvent;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Artisan;

uses(MercadoPagoTestCase::class);

beforeEach(function () {
    $this->setupMercadoPagoConfig();
});

test('complete integration - checkout pro flow', function () {
    Http::fake([
        'api.mercadopago.com/checkout/preferences' => Http::response([
            'id' => 'test-preference-id',
            'init_point' => 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?preference-id=test-preference-id',
            'sandbox_init_point' => 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?preference-id=test-preference-id',
        ], 201),
        'api.mercadopago.com/v1/payments/*' => Http::response([
            'id' => '123456789',
            'status' => 'approved',
            'status_detail' => 'accredited',
            'payment_method_id' => 'visa',
            'transaction_amount' => 100.00,
            'external_reference' => 'bagisto_order_1',
        ], 200)
    ]);

    // 1. Create payment method instance
    $checkoutPro = new CheckoutPro();
    expect($checkoutPro->isAvailable())->toBeTrue();

    // 2. Test preference creation
    $cart = $this->createTestCart();
    $reflection = new \ReflectionClass($checkoutPro);
    $cartProperty = $reflection->getProperty('cart');
    $cartProperty->setAccessible(true);
    $cartProperty->setValue($checkoutPro, $cart);

    $preference = $checkoutPro->createPreference();
    expect($preference)->not->toBeNull();
    expect($preference['id'])->toBe('test-preference-id');

    // 3. Test checkout URL generation
    $checkoutUrl = $checkoutPro->getCheckoutUrl();
    expect($checkoutUrl)->toContain('mercadopago.com');

    // 4. Test redirect endpoint
    session(['cart' => $cart]);
    $response = $this->get(route('mercadopago.checkout-pro.redirect'));
    $response->assertRedirect();

    // 5. Test success callback
    $response = $this->get(route('mercadopago.checkout-pro.success', [
        'payment_id' => '123456789',
        'status' => 'approved',
        'external_reference' => 'bagisto_order_' . $cart->id
    ]));
    $response->assertRedirect();
});

test('complete integration - checkout api flow', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments' => Http::response([
            'id' => '123456789',
            'status' => 'approved',
            'status_detail' => 'accredited',
            'payment_method_id' => 'visa',
            'transaction_amount' => 100.00,
        ], 201),
        'api.mercadopago.com/v1/payment_methods' => Http::response([
            ['id' => 'visa', 'name' => 'Visa', 'payment_type_id' => 'credit_card']
        ], 200),
        'api.mercadopago.com/v1/payment_methods/installments*' => Http::response([
            [
                'payment_method_id' => 'visa',
                'payer_costs' => [
                    ['installments' => 1, 'installment_rate' => 0, 'total_amount' => 100.00]
                ]
            ]
        ], 200)
    ]);

    // 1. Create payment method instance
    $checkoutAPI = new CheckoutAPI();
    expect($checkoutAPI->isAvailable())->toBeTrue();

    // 2. Test payment methods endpoint
    $response = $this->get(route('mercadopago.checkout-api.payment-methods'));
    $response->assertSuccessful();

    // 3. Test installments endpoint
    $response = $this->get(route('mercadopago.checkout-api.installments', [
        'payment_method_id' => 'visa',
        'amount' => 100.00
    ]));
    $response->assertSuccessful();

    // 4. Test payment processing
    $cart = $this->createTestCart();
    session(['cart' => $cart]);

    $paymentData = [
        'token' => 'test-card-token',
        'payment_method_id' => 'visa',
        'installments' => 1,
        'identification_type' => 'DNI',
        'identification_number' => '12345678',
    ];

    $response = $this->post(route('mercadopago.checkout-api.process'), $paymentData);
    $response->assertSuccessful();
});

test('complete integration - webhook processing', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments/*' => Http::response([
            'id' => '123456789',
            'status' => 'approved',
            'status_detail' => 'accredited',
            'payment_method_id' => 'visa',
            'transaction_amount' => 100.00,
            'external_reference' => 'bagisto_order_1',
        ], 200)
    ]);

    // 1. Create test order
    $order = $this->createTestOrder(['id' => 1]);

    // 2. Create webhook payload
    $payload = $this->createWebhookPayload('payment', [
        'action' => 'payment.updated',
        'data' => ['id' => '123456789']
    ]);

    $headers = $this->createWebhookHeaders($payload);

    // 3. Process webhook
    $response = $this->post(route('mercadopago.webhook'), $payload, $headers);
    $response->assertOk();

    // 4. Verify webhook event was stored
    expect(WebhookEvent::where('webhook_id', $payload['id'])->count())->toBe(1);
});

test('complete integration - admin configuration', function () {
    // Test configuration endpoints exist and are accessible
    // This would require admin authentication in a real scenario

    expect(route('mercadopago.admin.test-connection'))->toContain('mercadopago');
    expect(route('mercadopago.admin.account-info'))->toContain('mercadopago');
    expect(route('mercadopago.admin.validate-webhook'))->toContain('mercadopago');
});

test('complete integration - console commands', function () {
    // Test that console commands are registered
    $commands = Artisan::all();

    expect($commands)->toHaveKey('mercadopago:process-webhook-retries');
    expect($commands)->toHaveKey('mercadopago:cleanup-webhook-events');
});

test('complete integration - api helper functionality', function () {
    Http::fake([
        'api.mercadopago.com/*' => Http::response(['status' => 'ok'], 200)
    ]);

    $checkoutPro = new CheckoutPro();
    $apiHelper = new MercadoPagoAPI($checkoutPro);

    // Test various API methods
    expect($apiHelper)->toBeInstanceOf(MercadoPagoAPI::class);

    // Test webhook signature validation
    $payload = $this->createWebhookPayload();
    $headers = $this->createWebhookHeaders($payload);

    $isValid = $apiHelper->validateWebhookSignature(
        json_encode($payload),
        $headers['x-signature'],
        $headers['x-request-id']
    );

    expect($isValid)->toBeTrue();
});

test('complete integration - payment method registration', function () {
    // Test that payment methods are properly registered in Bagisto
    $paymentMethods = config('paymentmethods');

    expect($paymentMethods)->toHaveKey('mercadopago_checkout_pro');
    expect($paymentMethods)->toHaveKey('mercadopago_checkout_api');

    expect($paymentMethods['mercadopago_checkout_pro']['class'])->toBe(CheckoutPro::class);
    expect($paymentMethods['mercadopago_checkout_api']['class'])->toBe(CheckoutAPI::class);
});

test('complete integration - multi-currency support', function () {
    $checkoutPro = new CheckoutPro();
    $supportedCurrencies = $checkoutPro->getSupportedCurrencies();

    $expectedCurrencies = ['ARS', 'BRL', 'CLP', 'COP', 'MXN', 'PEN', 'UYU'];

    foreach ($expectedCurrencies as $currency) {
        expect($supportedCurrencies)->toContain($currency);
    }
});

test('complete integration - error handling', function () {
    Http::fake([
        'api.mercadopago.com/*' => Http::response(null, 500)
    ]);

    $checkoutPro = new CheckoutPro();
    $cart = $this->createTestCart();

    $reflection = new \ReflectionClass($checkoutPro);
    $cartProperty = $reflection->getProperty('cart');
    $cartProperty->setAccessible(true);
    $cartProperty->setValue($checkoutPro, $cart);

    // Should handle API errors gracefully
    $preference = $checkoutPro->createPreference();
    expect($preference)->toBeNull();
});

test('complete integration - security features', function () {
    // Test signature validation
    $apiHelper = new MercadoPagoAPI(new CheckoutPro());

    $payload = json_encode(['test' => 'data']);
    $invalidSignature = 'ts=123456,v1=invalid';

    $isValid = $apiHelper->validateWebhookSignature(
        $payload,
        $invalidSignature,
        'test-request-id'
    );

    expect($isValid)->toBeFalse();
});

test('complete integration - package completeness', function () {
    // Verify all essential files exist
    $packagePath = __DIR__ . '/../../';

    expect(file_exists($packagePath . 'composer.json'))->toBeTrue();
    expect(file_exists($packagePath . 'src/Providers/MercadoPagoServiceProvider.php'))->toBeTrue();
    expect(file_exists($packagePath . 'src/Payment/CheckoutPro.php'))->toBeTrue();
    expect(file_exists($packagePath . 'src/Payment/CheckoutAPI.php'))->toBeTrue();
    expect(file_exists($packagePath . 'src/Helpers/MercadoPagoAPI.php'))->toBeTrue();
    expect(file_exists($packagePath . 'src/Http/Controllers/WebhookController.php'))->toBeTrue();
    expect(file_exists($packagePath . 'src/Models/WebhookEvent.php'))->toBeTrue();
    expect(file_exists($packagePath . 'README.md'))->toBeTrue();
});
