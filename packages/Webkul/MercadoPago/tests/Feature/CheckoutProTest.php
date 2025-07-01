<?php

use Webkul\MercadoPago\Tests\MercadoPagoTestCase;
use Webkul\Checkout\Models\Cart;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

uses(MercadoPagoTestCase::class);

beforeEach(function () {
    $this->setupMercadoPagoConfig();
    $this->cart = $this->createTestCart();
    Session::put('cart', $this->cart);
});

test('checkout pro redirect creates preference and redirects', function () {
    Http::fake([
        'api.mercadopago.com/checkout/preferences' => Http::response([
            'id' => 'test-preference-id',
            'init_point' => 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?preference-id=test-preference-id',
        ], 201)
    ]);

    $response = $this->get(route('mercadopago.checkout-pro.redirect'));

    $response->assertRedirect();
    $response->assertRedirectContains('mercadopago.com');
});

test('checkout pro success handles approved payment', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments/*' => Http::response([
            'id' => '123456789',
            'status' => 'approved',
            'status_detail' => 'accredited',
            'payment_method_id' => 'visa',
            'transaction_amount' => 100.00,
        ], 200)
    ]);

    $response = $this->get(route('mercadopago.checkout-pro.success', [
        'payment_id' => '123456789',
        'status' => 'approved',
        'external_reference' => 'bagisto_order_' . $this->cart->id
    ]));

    $response->assertRedirect();
    $response->assertSessionHas('success');
});

test('checkout pro failure handles rejected payment', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments/*' => Http::response([
            'id' => '123456789',
            'status' => 'rejected',
            'status_detail' => 'cc_rejected_other_reason',
            'payment_method_id' => 'visa',
            'transaction_amount' => 100.00,
        ], 200)
    ]);

    $response = $this->get(route('mercadopago.checkout-pro.failure', [
        'payment_id' => '123456789',
        'status' => 'rejected',
        'external_reference' => 'bagisto_order_' . $this->cart->id
    ]));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('checkout pro pending handles pending payment', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments/*' => Http::response([
            'id' => '123456789',
            'status' => 'pending',
            'status_detail' => 'pending_waiting_payment',
            'payment_method_id' => 'rapipago',
            'transaction_amount' => 100.00,
        ], 200)
    ]);

    $response = $this->get(route('mercadopago.checkout-pro.pending', [
        'payment_id' => '123456789',
        'status' => 'pending',
        'external_reference' => 'bagisto_order_' . $this->cart->id
    ]));

    $response->assertRedirect();
    $response->assertSessionHas('success');
});

test('checkout pro handles missing payment parameters', function () {
    $response = $this->get(route('mercadopago.checkout-pro.success'));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('checkout pro handles invalid external reference', function () {
    $response = $this->get(route('mercadopago.checkout-pro.success', [
        'payment_id' => '123456789',
        'status' => 'approved',
        'external_reference' => 'invalid_reference'
    ]));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('checkout pro handles api errors gracefully', function () {
    Http::fake([
        'api.mercadopago.com/checkout/preferences' => Http::response(null, 500)
    ]);

    $response = $this->get(route('mercadopago.checkout-pro.redirect'));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('checkout pro validates cart before processing', function () {
    // Clear the cart
    Session::forget('cart');

    $response = $this->get(route('mercadopago.checkout-pro.redirect'));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});
