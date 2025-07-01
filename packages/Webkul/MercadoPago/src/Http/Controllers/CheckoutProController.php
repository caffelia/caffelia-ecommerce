<?php

namespace Webkul\MercadoPago\Http\Controllers;

use Illuminate\Http\Request;
use Webkul\Checkout\Facades\Cart;
use Webkul\MercadoPago\Payment\CheckoutPro;
use Webkul\Sales\Repositories\OrderRepository;
use Webkul\Sales\Transformers\OrderResource;

class CheckoutProController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(
        protected OrderRepository $orderRepository,
        protected CheckoutPro $checkoutPro
    ) {}

    /**
     * Redirects to MercadoPago Checkout Pro.
     *
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     */
    public function redirect()
    {
        try {
            $cart = Cart::getCart();

            if (! $cart || ! $cart->items->count()) {
                session()->flash('error', trans('mercadopago::app.errors.invalid-payment'));
                return redirect()->route('shop.checkout.cart.index');
            }

            // Set the cart for the payment method
            $this->checkoutPro->setCart();

            // Check if currency is supported
            if (! $this->checkoutPro->isCurrencySupported()) {
                session()->flash('error', trans('mercadopago::app.errors.invalid-configs'));
                return redirect()->route('shop.checkout.cart.index');
            }

            // Get the checkout URL
            $checkoutUrl = $this->checkoutPro->getCheckoutUrl();

            if (! $checkoutUrl) {
                logger()->error('MercadoPago Checkout Pro - Failed to create preference');
                session()->flash('error', trans('mercadopago::app.errors.something-went-wrong'));
                return redirect()->route('shop.checkout.cart.index');
            }

            // Create view with checkout URL for redirect
            return view('mercadopago::checkout-pro-redirect', [
                'checkoutUrl' => $checkoutUrl,
                'cart' => $cart,
            ]);

        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout Pro - Redirect error: ' . $e->getMessage());
            session()->flash('error', trans('mercadopago::app.errors.something-went-wrong'));
            return redirect()->route('shop.checkout.cart.index');
        }
    }

    /**
     * Handle successful payment from MercadoPago.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function success(Request $request)
    {
        try {
            $cart = Cart::getCart();

            if (! $cart) {
                session()->flash('error', trans('mercadopago::app.errors.invalid-payment'));
                return redirect()->route('shop.checkout.cart.index');
            }

            // Get payment details from MercadoPago
            $paymentId = $request->get('payment_id');
            $status = $request->get('status');
            $externalReference = $request->get('external_reference');

            // Verify the external reference matches our cart
            $expectedReference = 'bagisto_order_' . $cart->id;
            if ($externalReference !== $expectedReference) {
                logger()->warning('MercadoPago Checkout Pro - External reference mismatch', [
                    'expected' => $expectedReference,
                    'received' => $externalReference,
                ]);
            }

            // For approved payments, create the order
            if ($status === 'approved' && $paymentId) {
                // Get payment details from MercadoPago API to verify
                $this->checkoutPro->setCart();
                $apiHelper = new \Webkul\MercadoPago\Helpers\MercadoPagoAPI($this->checkoutPro);
                $paymentDetails = $apiHelper->getPayment($paymentId);

                if ($paymentDetails && $paymentDetails['status'] === 'approved') {
                    // Create order
                    $data = (new OrderResource($cart))->jsonSerialize();
                    $data['payment']['additional'] = [
                        'payment_id' => $paymentId,
                        'payment_method' => 'mercadopago_checkout_pro',
                        'status' => $status,
                    ];

                    $order = $this->orderRepository->create($data);

                    Cart::deActivateCart();

                    session()->flash('order_id', $order->id);
                    session()->flash('success', trans('mercadopago::app.success.payment-completed'));

                    return redirect()->route('shop.checkout.onepage.success');
                }
            }

            // If we reach here, payment was not approved or verification failed
            session()->flash('error', trans('mercadopago::app.errors.payment-failed'));
            return redirect()->route('shop.checkout.cart.index');

        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout Pro - Success handler error: ' . $e->getMessage());
            session()->flash('error', trans('mercadopago::app.errors.something-went-wrong'));
            return redirect()->route('shop.checkout.cart.index');
        }
    }

    /**
     * Handle failed payment from MercadoPago.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function failure(Request $request)
    {
        logger()->info('MercadoPago Checkout Pro - Payment failed', $request->all());

        session()->flash('error', trans('mercadopago::app.errors.payment-failed'));

        return redirect()->route('shop.checkout.cart.index');
    }

    /**
     * Handle pending payment from MercadoPago.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function pending(Request $request)
    {
        try {
            $cart = Cart::getCart();

            if (! $cart) {
                session()->flash('error', trans('mercadopago::app.errors.invalid-payment'));
                return redirect()->route('shop.checkout.cart.index');
            }

            $paymentId = $request->get('payment_id');
            $externalReference = $request->get('external_reference');

            // Verify the external reference matches our cart
            $expectedReference = 'bagisto_order_' . $cart->id;
            if ($externalReference !== $expectedReference) {
                logger()->warning('MercadoPago Checkout Pro - External reference mismatch in pending', [
                    'expected' => $expectedReference,
                    'received' => $externalReference,
                ]);
            }

            if ($paymentId) {
                // Create order with pending status
                $data = (new OrderResource($cart))->jsonSerialize();
                $data['payment']['additional'] = [
                    'payment_id' => $paymentId,
                    'payment_method' => 'mercadopago_checkout_pro',
                    'status' => 'pending',
                ];

                $order = $this->orderRepository->create($data);

                Cart::deActivateCart();

                session()->flash('order_id', $order->id);
                session()->flash('info', trans('mercadopago::app.info.payment-pending'));

                return redirect()->route('shop.checkout.onepage.success');
            }

            session()->flash('warning', trans('mercadopago::app.info.payment-pending'));
            return redirect()->route('shop.checkout.cart.index');

        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout Pro - Pending handler error: ' . $e->getMessage());
            session()->flash('error', trans('mercadopago::app.errors.something-went-wrong'));
            return redirect()->route('shop.checkout.cart.index');
        }
    }
}
