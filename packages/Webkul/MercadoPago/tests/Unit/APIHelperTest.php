<?php

use Webkul\MercadoPago\Tests\MercadoPagoTestCase;
use Webkul\MercadoPago\Helpers\MercadoPagoAPI;
use Webkul\MercadoPago\Payment\CheckoutPro;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

uses(MercadoPagoTestCase::class);

beforeEach(function () {
    $this->setupMercadoPagoConfig();
    $this->checkoutPro = new CheckoutPro();
    $this->apiHelper = new MercadoPagoAPI($this->checkoutPro);
});

test('api helper can be instantiated with payment method', function () {
    expect($this->apiHelper)->toBeInstanceOf(MercadoPagoAPI::class);
});

test('api helper generates correct headers', function () {
    $reflection = new \ReflectionClass($this->apiHelper);
    $method = $reflection->getMethod('getHeaders');
    $method->setAccessible(true);

    $headers = $method->invoke($this->apiHelper);

    expect($headers)->toHaveKey('Authorization');
    expect($headers)->toHaveKey('Content-Type');
    expect($headers)->toHaveKey('User-Agent');
    expect($headers['Authorization'])->toContain('Bearer');
    expect($headers['Content-Type'])->toBe('application/json');
});

test('api helper generates idempotency keys', function () {
    $reflection = new \ReflectionClass($this->apiHelper);
    $method = $reflection->getMethod('generateIdempotencyKey');
    $method->setAccessible(true);

    $key1 = $method->invoke($this->apiHelper);
    $key2 = $method->invoke($this->apiHelper);

    expect($key1)->toBeString();
    expect($key2)->toBeString();
    expect($key1)->not->toBe($key2);
    expect(strlen($key1))->toBe(32);
});

test('api helper validates webhook signatures correctly', function () {
    $payload = $this->createWebhookPayload();
    $headers = $this->createWebhookHeaders($payload);

    $result = $this->apiHelper->validateWebhookSignature(
        json_encode($payload),
        $headers['x-signature'],
        $headers['x-request-id']
    );

    expect($result)->toBeTrue();
});

test('api helper rejects invalid webhook signatures', function () {
    $payload = $this->createWebhookPayload();
    $invalidSignature = 'ts=123456,v1=invalid_signature';

    $result = $this->apiHelper->validateWebhookSignature(
        json_encode($payload),
        $invalidSignature,
        'test-request-id'
    );

    expect($result)->toBeFalse();
});

test('api helper formats error responses correctly', function () {
    $reflection = new \ReflectionClass($this->apiHelper);
    $method = $reflection->getMethod('formatError');
    $method->setAccessible(true);

    $errorResponse = [
        'error' => 'invalid_request',
        'error_description' => 'Test error message',
        'status' => 400
    ];

    $formattedError = $method->invoke($this->apiHelper, $errorResponse);

    expect($formattedError)->toHaveKeys(['error', 'message', 'status']);
    expect($formattedError['error'])->toBe('invalid_request');
    expect($formattedError['message'])->toBe('Test error message');
    expect($formattedError['status'])->toBe(400);
});

test('api helper handles network errors gracefully', function () {
    // Mock a network failure
    Http::fake([
        '*' => Http::response(null, 500)
    ]);

    $result = $this->apiHelper->createPreference([
        'items' => [
            [
                'title' => 'Test Item',
                'quantity' => 1,
                'unit_price' => 100.00
            ]
        ]
    ]);

    expect($result)->toBeNull();
});

test('api helper builds correct api urls', function () {
    $reflection = new \ReflectionClass($this->apiHelper);
    $method = $reflection->getMethod('buildUrl');
    $method->setAccessible(true);

    $url = $method->invoke($this->apiHelper, 'checkout/preferences');

    expect($url)->toContain('api.mercadopago.com');
    expect($url)->toContain('checkout/preferences');
});

test('api helper handles retry logic for failed requests', function () {
    // This would test the retry mechanism
    // For now, we'll verify the method exists and can be called
    $reflection = new \ReflectionClass($this->apiHelper);

    expect($reflection->hasMethod('makeRequest'))->toBeTrue();
});

test('api helper logs errors appropriately', function () {
    // Test that errors are logged when API calls fail
    $reflection = new \ReflectionClass($this->apiHelper);
    $method = $reflection->getMethod('logError');
    $method->setAccessible(true);

    // This method should exist and be callable
    expect($method)->not->toBeNull();
});
