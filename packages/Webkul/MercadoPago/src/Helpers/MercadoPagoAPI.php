<?php

namespace Webkul\MercadoPago\Helpers;

use Illuminate\Support\Facades\Http;
use Webkul\MercadoPago\Payment\MercadoPago;

class MercadoPagoAPI
{
    /**
     * MercadoPago payment instance.
     *
     * @var MercadoPago
     */
    protected $payment;

    /**
     * API base URL.
     *
     * @var string
     */
    protected $baseUrl = 'https://api.mercadopago.com';

    /**
     * Create a new API helper instance.
     *
     * @param MercadoPago $payment
     */
    public function __construct(MercadoPago $payment)
    {
        $this->payment = $payment;
    }

    /**
     * Get headers for API requests.
     *
     * @return array
     */
    protected function getHeaders()
    {
        return [
            'Authorization' => 'Bearer ' . $this->payment->getAccessToken(),
            'Content-Type' => 'application/json',
            'X-Idempotency-Key' => $this->generateIdempotencyKey(),
        ];
    }

    /**
     * Generate idempotency key for API requests.
     *
     * @return string
     */
    protected function generateIdempotencyKey()
    {
        return uniqid('bagisto_mp_', true);
    }

    /**
     * Make API request.
     *
     * @param string $method
     * @param string $endpoint
     * @param array $data
     * @return array|null
     */
    protected function makeRequest($method, $endpoint, $data = [])
    {
        try {
            $url = $this->baseUrl . $endpoint;

            $response = Http::withHeaders($this->getHeaders())
                ->timeout(30)
                ->{strtolower($method)}($url, $data);

            if ($response->successful()) {
                return $response->json();
            }

            logger()->error('MercadoPago API Error', [
                'url' => $url,
                'method' => $method,
                'status' => $response->status(),
                'response' => $response->body(),
                'data' => $data,
            ]);

            return null;

        } catch (\Exception $e) {
            logger()->error('MercadoPago API Exception: ' . $e->getMessage(), [
                'endpoint' => $endpoint,
                'method' => $method,
                'data' => $data,
            ]);

            return null;
        }
    }

    /**
     * Create checkout preference.
     *
     * @param array $preferenceData
     * @return array|null
     */
    public function createPreference($preferenceData)
    {
        return $this->makeRequest('POST', '/checkout/preferences', $preferenceData);
    }

    /**
     * Get preference by ID.
     *
     * @param string $preferenceId
     * @return array|null
     */
    public function getPreference($preferenceId)
    {
        return $this->makeRequest('GET', "/checkout/preferences/{$preferenceId}");
    }

    /**
     * Create payment.
     *
     * @param array $paymentData
     * @return array|null
     */
    public function createPayment($paymentData)
    {
        return $this->makeRequest('POST', '/v1/payments', $paymentData);
    }

    /**
     * Get payment by ID.
     *
     * @param string $paymentId
     * @return array|null
     */
    public function getPayment($paymentId)
    {
        return $this->makeRequest('GET', "/v1/payments/{$paymentId}");
    }

    /**
     * Get payment methods.
     *
     * @param string $currencyId
     * @return array|null
     */
    public function getPaymentMethods($currencyId = null)
    {
        $endpoint = '/v1/payment_methods';

        if ($currencyId) {
            $endpoint .= '?currency_id=' . $currencyId;
        }

        return $this->makeRequest('GET', $endpoint);
    }

    /**
     * Get installments.
     *
     * @param string $paymentMethodId
     * @param float $amount
     * @param string $issuerId
     * @return array|null
     */
    public function getInstallments($paymentMethodId, $amount, $issuerId = null)
    {
        $params = [
            'payment_method_id' => $paymentMethodId,
            'amount' => $amount,
        ];

        if ($issuerId) {
            $params['issuer_id'] = $issuerId;
        }

        $endpoint = '/v1/payment_methods/installments?' . http_build_query($params);

        return $this->makeRequest('GET', $endpoint);
    }

    /**
     * Get card issuers.
     *
     * @param string $paymentMethodId
     * @return array|null
     */
    public function getCardIssuers($paymentMethodId)
    {
        $endpoint = "/v1/payment_methods/card_issuers?payment_method_id={$paymentMethodId}";

        return $this->makeRequest('GET', $endpoint);
    }

    /**
     * Get identification types.
     *
     * @return array|null
     */
    public function getIdentificationTypes()
    {
        return $this->makeRequest('GET', '/v1/identification_types');
    }

    /**
     * Refund payment.
     *
     * @param string $paymentId
     * @param float $amount
     * @return array|null
     */
    public function refundPayment($paymentId, $amount = null)
    {
        $data = [];

        if ($amount !== null) {
            $data['amount'] = $amount;
        }

        return $this->makeRequest('POST', "/v1/payments/{$paymentId}/refunds", $data);
    }

    /**
     * Cancel payment.
     *
     * @param string $paymentId
     * @return array|null
     */
    public function cancelPayment($paymentId)
    {
        $data = ['status' => 'cancelled'];

        return $this->makeRequest('PUT', "/v1/payments/{$paymentId}", $data);
    }

    /**
     * Get merchant account information.
     *
     * @return array|null
     */
    public function getMerchantInfo()
    {
        return $this->makeRequest('GET', '/users/me');
    }

    /**
     * Get merchant order by ID.
     *
     * @param string $merchantOrderId
     * @return array|null
     */
    public function getMerchantOrder($merchantOrderId)
    {
        return $this->makeRequest('GET', "/merchant_orders/{$merchantOrderId}");
    }

    /**
     * Create merchant order.
     *
     * @param array $merchantOrderData
     * @return array|null
     */
    public function createMerchantOrder($merchantOrderData)
    {
        return $this->makeRequest('POST', '/merchant_orders', $merchantOrderData);
    }

    /**
     * Update merchant order.
     *
     * @param string $merchantOrderId
     * @param array $merchantOrderData
     * @return array|null
     */
    public function updateMerchantOrder($merchantOrderId, $merchantOrderData)
    {
        return $this->makeRequest('PUT', "/merchant_orders/{$merchantOrderId}", $merchantOrderData);
    }

    /**
     * Get webhook events for a specific payment.
     *
     * @param string $paymentId
     * @return array|null
     */
    public function getWebhookEvents($paymentId)
    {
        return $this->makeRequest('GET', "/v1/payments/{$paymentId}/webhook_events");
    }

    /**
     * Get payment method configurations.
     *
     * @return array|null
     */
    public function getPaymentMethodsConfig()
    {
        return $this->makeRequest('GET', '/v1/payment_methods');
    }



    /**
     * Validate webhook signature.
     *
     * @param string $payload
     * @param string $signature
     * @param string $secret
     * @return bool
     */
    public function validateWebhookSignature($payload, $signature, $secret)
    {
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Enhanced webhook signature validation using MercadoPago's v1 format.
     *
     * @param string $payload
     * @param string $signature
     * @param string $secret
     * @param string $timestamp
     * @return bool
     */
    public function validateWebhookSignatureV1($payload, $signature, $secret, $timestamp)
    {
        try {
            // MercadoPago v1 signature format: "ts=timestamp,v1=signature"
            $expectedSignature = hash_hmac('sha256', $timestamp . $payload, $secret);

            // Parse signature header
            $signatureParts = [];
            foreach (explode(',', $signature) as $part) {
                [$key, $value] = explode('=', $part, 2);
                $signatureParts[$key] = $value;
            }

            $providedSignature = $signatureParts['v1'] ?? '';

            return hash_equals($expectedSignature, $providedSignature);
        } catch (\Exception $e) {
            logger()->error('MercadoPago API - Webhook signature validation error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Test webhook connectivity.
     *
     * @param string $webhookUrl
     * @return array|null
     */
    public function testWebhookConnectivity($webhookUrl)
    {
        try {
            $response = \Illuminate\Support\Facades\Http::timeout(10)->get($webhookUrl);

            return [
                'accessible' => $response->status() === 405, // Method not allowed is expected
                'status_code' => $response->status(),
                'response_time' => $response->handlerStats()['total_time'] ?? null,
            ];
        } catch (\Exception $e) {
            return [
                'accessible' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
