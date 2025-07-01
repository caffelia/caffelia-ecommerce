<?php

namespace Webkul\MercadoPago\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Webkul\Checkout\Facades\Cart;
use Webkul\MercadoPago\Payment\CheckoutAPI;
use Webkul\Sales\Repositories\OrderRepository;
use Webkul\Sales\Transformers\OrderResource;

class CheckoutAPIController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(
        protected OrderRepository $orderRepository,
        protected CheckoutAPI $checkoutAPI
    ) {}

    /**
     * Process payment via MercadoPago API.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function process(Request $request)
    {
        try {
            $cart = Cart::getCart();

            if (! $cart || ! $cart->items->count()) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.errors.invalid-payment'),
                ], 400);
            }

            // Set the cart for the payment method
            $this->checkoutAPI->setCart();

            // Check if currency is supported
            if (! $this->checkoutAPI->isCurrencySupported()) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.errors.invalid-configs'),
                ], 400);
            }

            // Validate request data
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'payment_method_id' => 'required|string',
                'installments' => 'required|integer|min:1',
                'identification_type' => 'required|string',
                'identification_number' => 'required|string',
                'issuer_id' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.errors.invalid-payment'),
                    'errors' => $validator->errors(),
                ], 422);
            }

            $paymentData = $validator->validated();

            // Process payment
            $paymentResponse = $this->checkoutAPI->processPayment($paymentData);

            if (! $paymentResponse) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.errors.payment-failed'),
                ], 400);
            }

            $status = $paymentResponse['status'] ?? 'pending';
            $paymentId = $paymentResponse['id'] ?? null;

            // Handle different payment statuses
            switch ($status) {
                case 'approved':
                    $order = $this->createOrder($cart, $paymentResponse);

                    return response()->json([
                        'success' => true,
                        'message' => trans('mercadopago::app.success.payment-completed'),
                        'redirect_url' => route('mercadopago.checkout-api.success', ['order_id' => $order->id]),
                        'order_id' => $order->id,
                    ]);

                case 'pending':
                case 'in_process':
                    $order = $this->createOrder($cart, $paymentResponse);

                    return response()->json([
                        'success' => true,
                        'message' => trans('mercadopago::app.info.payment-pending'),
                        'redirect_url' => route('mercadopago.checkout-api.success', ['order_id' => $order->id]),
                        'order_id' => $order->id,
                        'status' => 'pending',
                    ]);

                case 'rejected':
                    return response()->json([
                        'success' => false,
                        'message' => trans('mercadopago::app.errors.payment-failed'),
                        'payment_id' => $paymentId,
                        'status' => $status,
                        'status_detail' => $paymentResponse['status_detail'] ?? '',
                    ], 400);

                default:
                    return response()->json([
                        'success' => false,
                        'message' => trans('mercadopago::app.errors.something-went-wrong'),
                        'status' => $status,
                    ], 400);
            }

        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout API - Process payment error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => trans('mercadopago::app.errors.something-went-wrong'),
            ], 500);
        }
    }

    /**
     * Handle successful payment redirect.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function success(Request $request)
    {
        $orderId = $request->get('order_id');

        if ($orderId) {
            session()->flash('order_id', $orderId);
            session()->flash('success', trans('mercadopago::app.success.order-placed'));
        }

        return redirect()->route('shop.checkout.onepage.success');
    }

    /**
     * Handle failed payment redirect.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function failure(Request $request)
    {
        session()->flash('error', trans('mercadopago::app.errors.payment-failed'));

        return redirect()->route('shop.checkout.cart.index');
    }

    /**
     * Get payment methods for the current cart.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPaymentMethods()
    {
        try {
            $cart = Cart::getCart();

            if (! $cart) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.errors.invalid-payment'),
                ], 400);
            }

            $this->checkoutAPI->setCart();
            $paymentMethods = $this->checkoutAPI->getPaymentMethods();

            if (! $paymentMethods) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.errors.connection-error'),
                ], 500);
            }

            return response()->json([
                'success' => true,
                'payment_methods' => $paymentMethods,
            ]);

        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout API - Get payment methods error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => trans('mercadopago::app.errors.something-went-wrong'),
            ], 500);
        }
    }

    /**
     * Get installments for a payment method.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInstallments(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'payment_method_id' => 'required|string',
                'amount' => 'required|numeric|min:0',
                'issuer_id' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $this->checkoutAPI->setCart();
            $installments = $this->checkoutAPI->getInstallments(
                $request->payment_method_id,
                $request->amount,
                $request->issuer_id
            );

            if (! $installments) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.errors.connection-error'),
                ], 500);
            }

            return response()->json([
                'success' => true,
                'installments' => $installments,
            ]);

        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout API - Get installments error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => trans('mercadopago::app.errors.something-went-wrong'),
            ], 500);
        }
    }

    /**
     * Get card issuers for a payment method.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCardIssuers(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'payment_method_id' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $this->checkoutAPI->setCart();
            $cardIssuers = $this->checkoutAPI->getCardIssuers($request->payment_method_id);

            if (! $cardIssuers) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.errors.connection-error'),
                ], 500);
            }

            return response()->json([
                'success' => true,
                'card_issuers' => $cardIssuers,
            ]);

        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout API - Get card issuers error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => trans('mercadopago::app.errors.something-went-wrong'),
            ], 500);
        }
    }

    /**
     * Get identification types.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getIdentificationTypes()
    {
        try {
            $this->checkoutAPI->setCart();
            $identificationTypes = $this->checkoutAPI->getIdentificationTypes();

            if (! $identificationTypes) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.errors.connection-error'),
                ], 500);
            }

            return response()->json([
                'success' => true,
                'identification_types' => $identificationTypes,
            ]);

        } catch (\Exception $e) {
            logger()->error('MercadoPago Checkout API - Get identification types error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => trans('mercadopago::app.errors.something-went-wrong'),
            ], 500);
        }
    }

    /**
     * Create order from payment response.
     *
     * @param mixed $cart
     * @param array $paymentResponse
     * @return mixed
     */
    private function createOrder($cart, $paymentResponse)
    {
        $data = (new OrderResource($cart))->jsonSerialize();

        $data['payment']['additional'] = [
            'payment_id' => $paymentResponse['id'] ?? null,
            'payment_method' => 'mercadopago_checkout_api',
            'status' => $paymentResponse['status'] ?? 'pending',
            'status_detail' => $paymentResponse['status_detail'] ?? '',
            'payment_method_id' => $paymentResponse['payment_method_id'] ?? '',
            'payment_type_id' => $paymentResponse['payment_type_id'] ?? '',
            'installments' => $paymentResponse['installments'] ?? 1,
        ];

        $order = $this->orderRepository->create($data);

        Cart::deActivateCart();

        return $order;
    }
}
