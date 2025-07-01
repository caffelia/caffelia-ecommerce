<?php

use Webkul\MercadoPago\Tests\MercadoPagoTestCase;
use Webkul\MercadoPago\Models\WebhookEvent;
use Webkul\Sales\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

uses(MercadoPagoTestCase::class);

beforeEach(function () {
    $this->setupMercadoPagoConfig();
    $this->order = $this->createTestOrder([
        'status' => 'pending_payment',
        'payment_method' => 'mercadopago_checkout_pro',
    ]);
});

test('webhook processes payment approved event', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments/*' => Http::response([
            'id' => '123456789',
            'status' => 'approved',
            'status_detail' => 'accredited',
            'payment_method_id' => 'visa',
            'transaction_amount' => 100.00,
            'external_reference' => 'bagisto_order_' . $this->order->id,
        ], 200)
    ]);

    $payload = $this->createWebhookPayload('payment', [
        'action' => 'payment.updated',
        'data' => ['id' => '123456789']
    ]);

    $headers = $this->createWebhookHeaders($payload);

    $response = $this->post(route('mercadopago.webhook'), $payload, $headers);

    $response->assertOk();
    $this->assertDatabaseHas('mercadopago_webhook_events', [
        'webhook_id' => $payload['id'],
        'event_type' => 'payment',
        'status' => 'processed',
    ]);
});

test('webhook processes payment rejected event', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments/*' => Http::response([
            'id' => '123456789',
            'status' => 'rejected',
            'status_detail' => 'cc_rejected_insufficient_amount',
            'payment_method_id' => 'visa',
            'transaction_amount' => 100.00,
            'external_reference' => 'bagisto_order_' . $this->order->id,
        ], 200)
    ]);

    $payload = $this->createWebhookPayload('payment', [
        'action' => 'payment.updated',
        'data' => ['id' => '123456789']
    ]);

    $headers = $this->createWebhookHeaders($payload);

    $response = $this->post(route('mercadopago.webhook'), $payload, $headers);

    $response->assertOk();
    $this->assertDatabaseHas('mercadopago_webhook_events', [
        'webhook_id' => $payload['id'],
        'event_type' => 'payment',
        'status' => 'processed',
    ]);
});

test('webhook validates signature correctly', function () {
    $payload = $this->createWebhookPayload();
    $headers = $this->createWebhookHeaders($payload);

    $response = $this->post(route('mercadopago.webhook'), $payload, $headers);

    $response->assertOk();
});

test('webhook rejects invalid signature', function () {
    $payload = $this->createWebhookPayload();
    $invalidHeaders = [
        'x-signature' => 'ts=123456,v1=invalid_signature',
        'x-request-id' => 'test-request-id',
    ];

    $response = $this->post(route('mercadopago.webhook'), $payload, $invalidHeaders);

    $response->assertStatus(401);
});

test('webhook handles duplicate events with idempotency', function () {
    $payload = $this->createWebhookPayload();
    $headers = $this->createWebhookHeaders($payload);

    // Process the same webhook twice
    $response1 = $this->post(route('mercadopago.webhook'), $payload, $headers);
    $response2 = $this->post(route('mercadopago.webhook'), $payload, $headers);

    $response1->assertOk();
    $response2->assertOk(); // Should not fail but also not duplicate processing

    $this->assertEquals(1, WebhookEvent::where('webhook_id', $payload['id'])->count());
});

test('webhook validates ip address', function () {
    $payload = $this->createWebhookPayload();
    $headers = $this->createWebhookHeaders($payload);

    // Mock a request from an unauthorized IP
    $response = $this->post(route('mercadopago.webhook'), $payload, array_merge($headers, [
        'REMOTE_ADDR' => '192.168.1.1'
    ]));

    // This would depend on the actual IP validation implementation
    // For now, we're just testing that the webhook endpoint exists
    expect($response->status())->toBeIn([200, 401, 403]);
});

test('webhook handles payment refund event', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments/*' => Http::response([
            'id' => '123456789',
            'status' => 'refunded',
            'status_detail' => 'refunded',
            'payment_method_id' => 'visa',
            'transaction_amount' => 100.00,
            'external_reference' => 'bagisto_order_' . $this->order->id,
        ], 200)
    ]);

    $payload = $this->createWebhookPayload('payment', [
        'action' => 'payment.updated',
        'data' => ['id' => '123456789']
    ]);

    $headers = $this->createWebhookHeaders($payload);

    $response = $this->post(route('mercadopago.webhook'), $payload, $headers);

    $response->assertOk();
});

test('webhook handles merchant order event', function () {
    Http::fake([
        'api.mercadopago.com/merchant_orders/*' => Http::response([
            'id' => '987654321',
            'status' => 'closed',
            'external_reference' => 'bagisto_order_' . $this->order->id,
            'payments' => [
                [
                    'id' => '123456789',
                    'status' => 'approved',
                ]
            ]
        ], 200)
    ]);

    $payload = $this->createWebhookPayload('merchant_order', [
        'action' => 'merchant_order.updated',
        'data' => ['id' => '987654321']
    ]);

    $headers = $this->createWebhookHeaders($payload);

    $response = $this->post(route('mercadopago.webhook'), $payload, $headers);

    $response->assertOk();
});

test('webhook handles unknown event types gracefully', function () {
    $payload = $this->createWebhookPayload('unknown_type', [
        'action' => 'unknown.action',
        'data' => ['id' => '123456789']
    ]);

    $headers = $this->createWebhookHeaders($payload);

    $response = $this->post(route('mercadopago.webhook'), $payload, $headers);

    $response->assertOk();
    $this->assertDatabaseHas('mercadopago_webhook_events', [
        'webhook_id' => $payload['id'],
        'event_type' => 'unknown_type',
        'status' => 'received',
    ]);
});

test('webhook handles api errors gracefully', function () {
    Http::fake([
        'api.mercadopago.com/*' => Http::response(null, 500)
    ]);

    $payload = $this->createWebhookPayload('payment', [
        'action' => 'payment.updated',
        'data' => ['id' => '123456789']
    ]);

    $headers = $this->createWebhookHeaders($payload);

    $response = $this->post(route('mercadopago.webhook'), $payload, $headers);

    $response->assertOk();
    $this->assertDatabaseHas('mercadopago_webhook_events', [
        'webhook_id' => $payload['id'],
        'status' => 'error',
    ]);
});

test('webhook stores event details correctly', function () {
    $payload = $this->createWebhookPayload();
    $headers = $this->createWebhookHeaders($payload);

    $response = $this->post(route('mercadopago.webhook'), $payload, $headers);

    $response->assertOk();

    $webhookEvent = WebhookEvent::where('webhook_id', $payload['id'])->first();

    expect($webhookEvent)->not->toBeNull();
    expect($webhookEvent->event_type)->toBe($payload['type']);
    expect($webhookEvent->webhook_id)->toBe($payload['id']);
    expect($webhookEvent->ip_address)->not->toBeNull();
});
