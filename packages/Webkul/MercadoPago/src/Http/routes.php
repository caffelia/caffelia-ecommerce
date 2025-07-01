<?php

use Illuminate\Support\Facades\Route;
use Webkul\MercadoPago\Http\Controllers\CheckoutProController;
use Webkul\MercadoPago\Http\Controllers\CheckoutAPIController;
use Webkul\MercadoPago\Http\Controllers\WebhookController;

Route::group(['middleware' => ['web']], function () {
    // Checkout Pro Routes
    Route::prefix('mercadopago/checkout-pro')->group(function () {
        Route::get('/redirect', [CheckoutProController::class, 'redirect'])->name('mercadopago.checkout-pro.redirect');
        Route::get('/success', [CheckoutProController::class, 'success'])->name('mercadopago.checkout-pro.success');
        Route::get('/failure', [CheckoutProController::class, 'failure'])->name('mercadopago.checkout-pro.failure');
        Route::get('/pending', [CheckoutProController::class, 'pending'])->name('mercadopago.checkout-pro.pending');
    });

    // Checkout API Routes
    Route::prefix('mercadopago/checkout-api')->group(function () {
        Route::post('/process', [CheckoutAPIController::class, 'process'])->name('mercadopago.checkout-api.process');
        Route::get('/success', [CheckoutAPIController::class, 'success'])->name('mercadopago.checkout-api.success');
        Route::get('/failure', [CheckoutAPIController::class, 'failure'])->name('mercadopago.checkout-api.failure');

        // API endpoints for frontend JavaScript
        Route::get('/payment-methods', [CheckoutAPIController::class, 'getPaymentMethods'])->name('mercadopago.checkout-api.payment-methods');
        Route::get('/installments', [CheckoutAPIController::class, 'getInstallments'])->name('mercadopago.checkout-api.installments');
        Route::get('/card-issuers', [CheckoutAPIController::class, 'getCardIssuers'])->name('mercadopago.checkout-api.card-issuers');
        Route::get('/identification-types', [CheckoutAPIController::class, 'getIdentificationTypes'])->name('mercadopago.checkout-api.identification-types');
    });
});

// Admin routes
Route::group(['middleware' => ['web', 'admin']], function () {
    Route::prefix('admin/mercadopago')->group(function () {
        Route::post('/test-connection', [\Webkul\MercadoPago\Http\Controllers\Admin\ConfigurationController::class, 'testConnection'])
            ->name('mercadopago.admin.test-connection');

        Route::post('/account-info', [\Webkul\MercadoPago\Http\Controllers\Admin\ConfigurationController::class, 'getAccountInfo'])
            ->name('mercadopago.admin.account-info');

        Route::post('/validate-webhook', [\Webkul\MercadoPago\Http\Controllers\Admin\ConfigurationController::class, 'validateWebhook'])
            ->name('mercadopago.admin.validate-webhook');
    });
});

// Webhook route (without CSRF protection)
Route::post('mercadopago/webhook', [WebhookController::class, 'handle'])
    ->name('mercadopago.webhook');
