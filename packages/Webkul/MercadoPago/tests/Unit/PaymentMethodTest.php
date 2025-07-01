<?php

use Webkul\MercadoPago\Tests\MercadoPagoTestCase;
use Webkul\MercadoPago\Payment\CheckoutPro;
use Webkul\MercadoPago\Payment\CheckoutAPI;
use Webkul\Checkout\Models\Cart;
use Illuminate\Support\Facades\Config;

uses(MercadoPagoTestCase::class);

beforeEach(function () {
    $this->setupMercadoPagoConfig();
});

test('checkout pro payment method can be instantiated', function () {
    $checkoutPro = new CheckoutPro();

    expect($checkoutPro)->toBeInstanceOf(CheckoutPro::class);
    expect($checkoutPro->getCode())->toBe('mercadopago_checkout_pro');
});

test('checkout api payment method can be instantiated', function () {
    $checkoutAPI = new CheckoutAPI();

    expect($checkoutAPI)->toBeInstanceOf(CheckoutAPI::class);
    expect($checkoutAPI->getCode())->toBe('mercadopago_checkout_api');
});

test('payment methods validate supported currencies', function () {
    $checkoutPro = new CheckoutPro();
    $checkoutAPI = new CheckoutAPI();

    $supportedCurrencies = ['ARS', 'BRL', 'CLP', 'COP', 'MXN', 'PEN', 'UYU'];
    $unsupportedCurrencies = ['USD', 'EUR', 'GBP'];

    foreach ($supportedCurrencies as $currency) {
        expect($checkoutPro->isAvailable())->toBeTrue()->when(function () use ($currency) {
            Config::set('core.base_currency', $currency);
        });

        expect($checkoutAPI->isAvailable())->toBeTrue()->when(function () use ($currency) {
            Config::set('core.base_currency', $currency);
        });
    }

    foreach ($unsupportedCurrencies as $currency) {
        expect($checkoutPro->isAvailable())->toBeFalse()->when(function () use ($currency) {
            Config::set('core.base_currency', $currency);
        });

        expect($checkoutAPI->isAvailable())->toBeFalse()->when(function () use ($currency) {
            Config::set('core.base_currency', $currency);
        });
    }
});

test('payment methods require valid configuration', function () {
    $checkoutPro = new CheckoutPro();
    $checkoutAPI = new CheckoutAPI();

    // Test with missing access token
    Config::set('core.sales.payment_methods.mercadopago_checkout_pro.access_token', '');
    expect($checkoutPro->isAvailable())->toBeFalse();

    Config::set('core.sales.payment_methods.mercadopago_checkout_api.access_token', '');
    expect($checkoutAPI->isAvailable())->toBeFalse();

    // Test with missing public key
    $this->setupMercadoPagoConfig([
        'core.sales.payment_methods.mercadopago_checkout_pro.public_key' => '',
        'core.sales.payment_methods.mercadopago_checkout_api.public_key' => '',
    ]);

    expect($checkoutPro->isAvailable())->toBeFalse();
    expect($checkoutAPI->isAvailable())->toBeFalse();
});

test('payment methods can be disabled via configuration', function () {
    $checkoutPro = new CheckoutPro();
    $checkoutAPI = new CheckoutAPI();

    // Disable payment methods
    Config::set('core.sales.payment_methods.mercadopago_checkout_pro.active', 0);
    Config::set('core.sales.payment_methods.mercadopago_checkout_api.active', 0);

    expect($checkoutPro->isAvailable())->toBeFalse();
    expect($checkoutAPI->isAvailable())->toBeFalse();
});

test('payment methods handle currency support correctly', function () {
    $checkoutPro = new CheckoutPro();
    $checkoutAPI = new CheckoutAPI();

    $supportedCurrencies = $checkoutPro->getSupportedCurrencies();

    expect($supportedCurrencies)->toContain('BRL');
    expect($supportedCurrencies)->toContain('ARS');
    expect($supportedCurrencies)->toContain('MXN');
});

test('payment methods format currency values correctly', function () {
    $checkoutPro = new CheckoutPro();
    $checkoutAPI = new CheckoutAPI();

    expect($checkoutPro->formatCurrencyValue(150.756))->toBe(150.76);
    expect($checkoutAPI->formatCurrencyValue(99.994))->toBe(99.99);
    expect($checkoutPro->formatCurrencyValue(100))->toBe(100.0);
});

test('checkout pro returns correct additional details view', function () {
    $checkoutPro = new CheckoutPro();

    $details = $checkoutPro->getAdditionalDetails();

    expect($details)->toContain('mercadopago-checkout-pro');
});

test('checkout api returns correct additional details view', function () {
    $checkoutAPI = new CheckoutAPI();

    $details = $checkoutAPI->getAdditionalDetails();

    expect($details)->toContain('mercadopago-checkout-api');
});

test('payment methods have correct configuration keys', function () {
    $checkoutPro = new CheckoutPro();
    $checkoutAPI = new CheckoutAPI();

    expect($checkoutPro->getConfigData('title'))->toBe('MercadoPago Checkout Pro');
    expect($checkoutAPI->getConfigData('title'))->toBe('MercadoPago Checkout API');

    expect($checkoutPro->getConfigData('access_token'))->toBe('TEST-1234567890');
    expect($checkoutAPI->getConfigData('access_token'))->toBe('TEST-1234567890');
});

test('payment methods handle sandbox configuration', function () {
    $checkoutPro = new CheckoutPro();
    $checkoutAPI = new CheckoutAPI();

    // Test sandbox mode
    expect($checkoutPro->getConfigData('sandbox'))->toBe(1);
    expect($checkoutAPI->getConfigData('sandbox'))->toBe(1);

    // Test production mode
    $this->setupMercadoPagoConfig([
        'core.sales.payment_methods.mercadopago_checkout_pro.sandbox' => 0,
        'core.sales.payment_methods.mercadopago_checkout_api.sandbox' => 0,
    ]);

    expect($checkoutPro->getConfigData('sandbox'))->toBe(0);
    expect($checkoutAPI->getConfigData('sandbox'))->toBe(0);
});

test('checkout api payment method has specific methods', function () {
    $checkoutAPI = new CheckoutAPI();

    expect($checkoutAPI->supportsInstallments())->toBeTrue();
    expect($checkoutAPI->getMaxInstallments())->toBe(12);
    expect($checkoutAPI->getRedirectUrl())->toBe('');
});

test('checkout pro payment method creates preference data', function () {
    $cart = $this->createTestCart(['grand_total' => 100.00]);
    $checkoutPro = new CheckoutPro();

    // Mock the cart in the payment method
    $reflection = new \ReflectionClass($checkoutPro);
    $cartProperty = $reflection->getProperty('cart');
    $cartProperty->setAccessible(true);
    $cartProperty->setValue($checkoutPro, $cart);

    expect($checkoutPro->getRedirectUrl())->toContain('mercadopago.checkout-pro.redirect');
});
