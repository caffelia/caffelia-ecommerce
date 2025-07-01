<?php

namespace Webkul\MercadoPago\Payment;

class CheckoutAPI extends MercadoPago
{
    /**
     * Payment method code.
     *
     * @var string
     */
    protected $code = 'mercadopago_checkout_api';

    /**
     * Return MercadoPago Checkout API redirect URL.
     *
     * @return string
     */
    public function getRedirectUrl()
    {
        // For API checkout, we don't redirect immediately
        // The payment is processed via AJAX
        return '';
    }

    /**
     * Process payment via API.
     *
     * @param array $paymentData
     * @return array|null
     */
    public function processPayment($paymentData)
    {
        try {
            $cart = $this->getCart();

            $paymentPayload = [
                'transaction_amount' => $this->formatCurrencyValue($cart->grand_total),
                'token' => $paymentData['token'],
                'description' => $this->getOrderDescription(),
                'installments' => (int) ($paymentData['installments'] ?? 1),
                'payment_method_id' => $paymentData['payment_method_id'],
                'issuer_id' => $paymentData['issuer_id'] ?? null,
                'payer' => [
                    'email' => $cart->billing_address->email,
                    'identification' => [
                        'type' => $paymentData['identification_type'] ?? 'DNI',
                        'number' => $paymentData['identification_number'] ?? '',
                    ],
                ],
                'external_reference' => $this->getExternalReference(),
                'notification_url' => route('mercadopago.webhook'),
                'metadata' => [
                    'cart_id' => $cart->id,
                    'store_name' => core()->getCurrentChannel()->name,
                ],
            ];

            // Add additional payer info if available
            $billingAddress = $cart->billing_address;
            if ($billingAddress) {
                $paymentPayload['additional_info'] = [
                    'payer' => [
                        'first_name' => $billingAddress->first_name,
                        'last_name' => $billingAddress->last_name,
                        'phone' => [
                            'area_code' => '',
                            'number' => $billingAddress->phone ?? '',
                        ],
                        'address' => [
                            'street_name' => $billingAddress->address,
                            'street_number' => '',
                            'zip_code' => $billingAddress->postcode,
                        ],
                    ],
                    'items' => $this->getOrderItems(),
                ];
            }

            return $this->apiHelper->createPayment($paymentPayload);

        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout API - Error processing payment: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get payment methods available for the current amount.
     *
     * @return array|null
     */
    public function getPaymentMethods()
    {
        try {
            $cart = $this->getCart();
            return $this->apiHelper->getPaymentMethods($cart->cart_currency_code);
        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout API - Error getting payment methods: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get installments for a specific payment method.
     *
     * @param string $paymentMethodId
     * @param float $amount
     * @param string $issuerId
     * @return array|null
     */
    public function getInstallments($paymentMethodId, $amount, $issuerId = null)
    {
        try {
            return $this->apiHelper->getInstallments($paymentMethodId, $amount, $issuerId);
        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout API - Error getting installments: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get card issuers for a specific payment method.
     *
     * @param string $paymentMethodId
     * @return array|null
     */
    public function getCardIssuers($paymentMethodId)
    {
        try {
            return $this->apiHelper->getCardIssuers($paymentMethodId);
        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout API - Error getting card issuers: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get identification types available.
     *
     * @return array|null
     */
    public function getIdentificationTypes()
    {
        try {
            return $this->apiHelper->getIdentificationTypes();
        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout API - Error getting identification types: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Check if payment method supports installments.
     *
     * @return bool
     */
    public function supportsInstallments()
    {
        return (bool) $this->getConfigData('installments_enabled', true);
    }

    /**
     * Get maximum installments allowed.
     *
     * @return int
     */
    public function getMaxInstallments()
    {
        return (int) $this->getConfigData('max_installments', 12);
    }

    /**
     * Get additional payment details.
     *
     * @return array
     */
    public function getAdditionalDetails()
    {
        $details = parent::getAdditionalDetails();

        // Add Checkout API frontend component
        $details['mercadopago_checkout_api_form'] = [
            'title' => trans('mercadopago::app.checkout.checkout-api.title'),
            'value' => view('mercadopago::checkout.onepage.mercadopago-checkout-api')->render(),
        ];

        return $details;
    }
}
