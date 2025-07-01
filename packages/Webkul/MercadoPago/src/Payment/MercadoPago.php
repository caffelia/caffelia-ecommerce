<?php

namespace Webkul\MercadoPago\Payment;

use Illuminate\Support\Facades\Storage;
use Webkul\Payment\Payment\Payment;
use Webkul\MercadoPago\Helpers\MercadoPagoAPI;

abstract class MercadoPago extends Payment
{
    /**
     * MercadoPago API helper instance.
     *
     * @var MercadoPagoAPI
     */
    protected $apiHelper;

    /**
     * Create a new MercadoPago payment instance.
     */
    public function __construct()
    {
        $this->apiHelper = new MercadoPagoAPI($this);
    }

    /**
     * Get MercadoPago API base URL based on sandbox mode.
     *
     * @return string
     */
    public function getApiUrl()
    {
        return $this->getConfigData('sandbox')
            ? 'https://api.mercadopago.com'
            : 'https://api.mercadopago.com';
    }

    /**
     * Get access token from configuration.
     *
     * @return string
     */
    public function getAccessToken()
    {
        return $this->getConfigData('access_token');
    }

    /**
     * Get public key from configuration.
     *
     * @return string
     */
    public function getPublicKey()
    {
        return $this->getConfigData('public_key');
    }

    /**
     * Get client ID from configuration.
     *
     * @return string
     */
    public function getClientId()
    {
        return $this->getConfigData('client_id');
    }

    /**
     * Get client secret from configuration.
     *
     * @return string
     */
    public function getClientSecret()
    {
        return $this->getConfigData('client_secret');
    }

    /**
     * Check if payment method is available.
     *
     * @return bool
     */
    public function isAvailable()
    {
        if (! $this->cart) {
            $this->setCart();
        }

        $requiredFields = [
            'access_token',
            'public_key',
        ];

        foreach ($requiredFields as $field) {
            if (empty($this->getConfigData($field))) {
                return false;
            }
        }

        return $this->getConfigData('active') && $this->cart && $this->cart->items->count() > 0;
    }

    /**
     * Get supported currencies.
     *
     * @return array
     */
    public function getSupportedCurrencies()
    {
        $currencies = $this->getConfigData('accepted_currencies');

        if (empty($currencies)) {
            return ['ARS', 'BRL', 'CLP', 'COP', 'MXN', 'PEN', 'UYU'];
        }

        return array_map('trim', explode(',', $currencies));
    }

    /**
     * Check if current currency is supported.
     *
     * @return bool
     */
    public function isCurrencySupported()
    {
        $cart = $this->getCart();
        $supportedCurrencies = $this->getSupportedCurrencies();

        return in_array($cart->cart_currency_code, $supportedCurrencies);
    }

    /**
     * Format currency value according to MercadoPago's constraints.
     *
     * @param  float|int  $number
     * @return float
     */
    public function formatCurrencyValue($number)
    {
        return round((float) $number, 2);
    }

    /**
     * Get payment method image.
     *
     * @return string
     */
    public function getImage()
    {
        $url = $this->getConfigData('image');

        return $url ? Storage::url($url) : bagisto_asset('images/mercadopago.png', 'shop');
    }

    /**
     * Get order description for MercadoPago.
     *
     * @return string
     */
    protected function getOrderDescription()
    {
        $cart = $this->getCart();
        $channel = core()->getCurrentChannel();

        return trans('mercadopago::app.checkout.order-description', [
            'store_name' => $channel->name,
            'order_id' => $cart->id,
        ]);
    }

    /**
     * Get order external reference.
     *
     * @return string
     */
    protected function getExternalReference()
    {
        $cart = $this->getCart();

        return 'bagisto_order_' . $cart->id;
    }

    /**
     * Get payer information from cart.
     *
     * @return array
     */
    protected function getPayerInfo()
    {
        $cart = $this->getCart();
        $billingAddress = $cart->billing_address;

        return [
            'name' => $billingAddress->first_name,
            'surname' => $billingAddress->last_name,
            'email' => $billingAddress->email,
            'phone' => [
                'area_code' => '',
                'number' => $billingAddress->phone ?? '',
            ],
            'identification' => [
                'type' => 'DNI',
                'number' => '',
            ],
            'address' => [
                'street_name' => $billingAddress->address,
                'street_number' => '',
                'zip_code' => $billingAddress->postcode,
            ],
        ];
    }

    /**
     * Get order items for MercadoPago.
     *
     * @return array
     */
    protected function getOrderItems()
    {
        $cartItems = $this->getCartItems();
        $items = [];

        foreach ($cartItems as $item) {
            $itemData = [
                'id'          => (string) $item->product_id,
                'title'       => $item->name,
                'description' => $item->product->short_description ?? $item->name,
                'category_id' => $item->product->categories->first()->id ?? '',
                'quantity'    => (int) $item->quantity,
                'currency_id' => $this->getCart()->cart_currency_code,
                'unit_price'  => $this->formatCurrencyValue($item->price),
            ];

            if (! app()->environment('local')) {
                $itemData['picture_url'] = $item->product->base_image_url ?? '';
            }

            $items[] = $itemData;
        }

        return $items;
    }

    /**
     * Abstract method to get redirect URL.
     */
    abstract public function getRedirectUrl();
}
