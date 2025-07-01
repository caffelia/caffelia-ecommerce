<?php

namespace Webkul\MercadoPago\Payment;

class CheckoutPro extends MercadoPago
{
    /**
     * Payment method code.
     *
     * @var string
     */
    protected $code = 'mercadopago_checkout_pro';

    /**
     * Return MercadoPago Checkout Pro redirect URL.
     *
     * @return string
     */
    public function getRedirectUrl()
    {
        return route('mercadopago.checkout-pro.redirect');
    }

    /**
     * Create preference for Checkout Pro.
     *
     * @return array|null
     */
    public function createPreference()
    {
        try {
            $cart = $this->getCart();

            $preferenceData = [
                'items' => $this->getOrderItems(),
                'payer' => $this->getPayerInfo(),
                'back_urls' => [
                    'success' => route('mercadopago.checkout-pro.success'),
                    'failure' => route('mercadopago.checkout-pro.failure'),
                    'pending' => route('mercadopago.checkout-pro.pending'),
                ],
                'external_reference' => $this->getExternalReference(),
                'statement_descriptor' => core()->getCurrentChannel()->name,
                'expires' => false,
                'binary_mode' => false,
            ];

            if (! app()->environment('local')) {
                $preferenceData['notification_url'] = route('mercadopago.webhook');
            }

            if ($this->getConfigData('auto_return')) {
                $preferenceData['auto_return'] = 'approved';
            }

            // Add installments configuration if enabled
            if ($this->getConfigData('installments_enabled')) {
                $maxInstallments = (int) $this->getConfigData('max_installments', 12);
                $preferenceData['payment_methods'] = [
                    'installments' => $maxInstallments,
                ];
            }

            // Add excluded payment methods if configured
            $excludedPaymentMethods = $this->getConfigData('excluded_payment_methods');
            if (! empty($excludedPaymentMethods)) {
                $excluded = array_map('trim', explode(',', $excludedPaymentMethods));
                $preferenceData['payment_methods']['excluded_payment_methods'] = array_map(function($method) {
                    return ['id' => $method];
                }, $excluded);
            }

            // Add excluded payment types if configured
            $excludedPaymentTypes = $this->getConfigData('excluded_payment_types');
            if (! empty($excludedPaymentTypes)) {
                $excluded = array_map('trim', explode(',', $excludedPaymentTypes));
                $preferenceData['payment_methods']['excluded_payment_types'] = array_map(function($type) {
                    return ['id' => $type];
                }, $excluded);
            }

            return $this->apiHelper->createPreference($preferenceData);

        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout Pro - Error creating preference: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get checkout Pro initialization URL.
     *
     * @return string|null
     */
    public function getCheckoutUrl()
    {
        $preference = $this->createPreference();

        if (! $preference || ! isset($preference['id'])) {
            return null;
        }

        if ($this->getConfigData('sandbox')) {
            return $preference['sandbox_init_point'];
        }

        return $preference['init_point'];
    }

    /**
     * Get additional payment details.
     *
     * @return array
     */
    public function getAdditionalDetails()
    {
        return [
            'title' => trans('mercadopago::app.checkout.checkout-pro.title'),
            'value' => view('mercadopago::checkout.onepage.mercadopago-checkout-pro')->render(),
        ];
    }
}
