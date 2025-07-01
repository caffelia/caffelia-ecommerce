<?php

return [
    'mercadopago_checkout_pro' => [
        'code'             => 'mercadopago_checkout_pro',
        'title'            => 'MercadoPago Checkout Pro',
        'description'      => 'Checkout Pro - Redirect to MercadoPago website',
        'class'            => 'Webkul\MercadoPago\Payment\CheckoutPro',
        'sandbox'          => true,
        'active'           => false,
        'sort'             => 5,
    ],

    'mercadopago_checkout_api' => [
        'code'             => 'mercadopago_checkout_api',
        'title'            => 'MercadoPago Checkout API',
        'description'      => 'Checkout API - Payment form on your website',
        'class'            => 'Webkul\MercadoPago\Payment\CheckoutAPI',
        'sandbox'          => true,
        'active'           => false,
        'sort'             => 6,
    ],
];
