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

test('checkout api process handles successful payment', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments' => Http::response([
            'id' => '123456789',
            'status' => 'approved',
            'status_detail' => 'accredited',
            'payment_method_id' => 'visa',
            'transaction_amount' => 100.00,
            'card' => [
                'last_four_digits' => '1234'
            ]
        ], 201)
    ]);

    $paymentData = [
        'token' => 'test-card-token',
        'payment_method_id' => 'visa',
        'issuer_id' => '310',
        'installments' => 1,
        'identification_type' => 'DNI',
        'identification_number' => '12345678',
    ];

    $response = $this->post(route('mercadopago.checkout-api.process'), $paymentData);

    $response->assertSuccessful();
    $response->assertJsonStructure(['success', 'message', 'data']);
});

test('checkout api process handles payment rejection', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments' => Http::response([
            'id' => '123456789',
            'status' => 'rejected',
            'status_detail' => 'cc_rejected_insufficient_amount',
            'payment_method_id' => 'visa',
            'transaction_amount' => 100.00,
        ], 201)
    ]);

    $paymentData = [
        'token' => 'test-card-token',
        'payment_method_id' => 'visa',
        'issuer_id' => '310',
        'installments' => 1,
        'identification_type' => 'DNI',
        'identification_number' => '12345678',
    ];

    $response = $this->post(route('mercadopago.checkout-api.process'), $paymentData);

    $response->assertStatus(422);
    $response->assertJsonStructure(['success', 'message']);
});

test('checkout api gets payment methods successfully', function () {
    Http::fake([
        'api.mercadopago.com/v1/payment_methods' => Http::response([
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
            ]
        ], 200)
    ]);

    $response = $this->get(route('mercadopago.checkout-api.payment-methods'));

    $response->assertSuccessful();
    $response->assertJsonStructure([
        '*' => ['id', 'name', 'payment_type_id']
    ]);
});

test('checkout api gets installments successfully', function () {
    Http::fake([
        'api.mercadopago.com/v1/payment_methods/installments*' => Http::response([
            [
                'payment_method_id' => 'visa',
                'payer_costs' => [
                    [
                        'installments' => 1,
                        'installment_rate' => 0,
                        'total_amount' => 100.00,
                    ],
                    [
                        'installments' => 3,
                        'installment_rate' => 15.00,
                        'total_amount' => 115.00,
                    ]
                ]
            ]
        ], 200)
    ]);

    $response = $this->get(route('mercadopago.checkout-api.installments', [
        'payment_method_id' => 'visa',
        'amount' => 100.00,
        'issuer_id' => '310'
    ]));

    $response->assertSuccessful();
    $response->assertJsonStructure([
        '*' => [
            'payment_method_id',
            'payer_costs' => [
                '*' => ['installments', 'installment_rate', 'total_amount']
            ]
        ]
    ]);
});

test('checkout api gets card issuers successfully', function () {
    Http::fake([
        'api.mercadopago.com/v1/payment_methods/card_issuers*' => Http::response([
            [
                'id' => '310',
                'name' => 'Banco Test',
                'secure_thumbnail' => 'https://img.test.com/logo.png'
            ]
        ], 200)
    ]);

    $response = $this->get(route('mercadopago.checkout-api.card-issuers', [
        'payment_method_id' => 'visa'
    ]));

    $response->assertSuccessful();
    $response->assertJsonStructure([
        '*' => ['id', 'name']
    ]);
});

test('checkout api gets identification types successfully', function () {
    Http::fake([
        'api.mercadopago.com/v1/identification_types' => Http::response([
            [
                'id' => 'DNI',
                'name' => 'DNI',
                'type' => 'number',
                'min_length' => 7,
                'max_length' => 8
            ]
        ], 200)
    ]);

    $response = $this->get(route('mercadopago.checkout-api.identification-types'));

    $response->assertSuccessful();
    $response->assertJsonStructure([
        '*' => ['id', 'name', 'type']
    ]);
});

test('checkout api validates required payment data', function () {
    $response = $this->post(route('mercadopago.checkout-api.process'), []);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors([
        'token',
        'payment_method_id',
        'installments'
    ]);
});

test('checkout api handles invalid payment method', function () {
    $paymentData = [
        'token' => 'test-card-token',
        'payment_method_id' => 'invalid_method',
        'issuer_id' => '310',
        'installments' => 1,
        'identification_type' => 'DNI',
        'identification_number' => '12345678',
    ];

    $response = $this->post(route('mercadopago.checkout-api.process'), $paymentData);

    $response->assertStatus(422);
});

test('checkout api handles api errors gracefully', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments' => Http::response(null, 500)
    ]);

    $paymentData = [
        'token' => 'test-card-token',
        'payment_method_id' => 'visa',
        'issuer_id' => '310',
        'installments' => 1,
        'identification_type' => 'DNI',
        'identification_number' => '12345678',
    ];

    $response = $this->post(route('mercadopago.checkout-api.process'), $paymentData);

    $response->assertStatus(500);
    $response->assertJsonStructure(['success', 'message']);
});
