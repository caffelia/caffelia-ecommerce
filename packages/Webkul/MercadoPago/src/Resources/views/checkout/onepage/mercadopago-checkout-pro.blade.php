<div class="w-full" v-show="selectedPayment?.method === 'mercadopago_checkout_pro'">
    <div class="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <!-- MercadoPago Checkout Pro Description -->
        <div class="flex items-center gap-3">
            <div class="flex-shrink-0">
                <img
                    src="{{ asset('themes/shop/caffelia-shop/assets/images/mercadopago.png') }}"
                    alt="MercadoPago"
                    class="w-12 h-8 object-contain"
                    onerror="this.style.display='none'"
                >
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">
                    {{ trans('mercadopago::app.checkout.checkout-pro.title') }}
                </p>
                <p class="text-xs text-gray-600 mt-1">
                    {{ trans('mercadopago::app.checkout.checkout-pro.description') }}
                </p>
            </div>
        </div>

        <!-- Payment Options Information -->
        <div class="bg-white p-3 rounded border">
            <h4 class="text-sm font-medium text-gray-900 mb-2">
                {{ trans('mercadopago::app.checkout.payment-options') }}
            </h4>
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    {{ trans('mercadopago::app.checkout.credit-cards') }}
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {{ trans('mercadopago::app.checkout.debit-cards') }}
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                    {{ trans('mercadopago::app.checkout.bank-transfer') }}
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {{ trans('mercadopago::app.checkout.cash-payments') }}
                </div>
            </div>
        </div>

        <!-- Installments Information (if enabled) -->
        @php
            $maxInstallments = core()->getConfigData('sales.payment_methods.mercadopago_checkout_pro.max_installments');
        @endphp
        @if($maxInstallments && $maxInstallments > 1)
            <div class="bg-blue-50 p-3 rounded border border-blue-200">
                <div class="flex items-center gap-2">
                    <span class="icon-card text-blue-600"></span>
                    <p class="text-sm text-blue-800">
                        {{ trans('mercadopago::app.checkout.installments-available', ['max' => $maxInstallments]) }}
                    </p>
                </div>
            </div>
        @endif

        <!-- Security Notice -->
        <div class="flex items-center gap-2 text-xs text-gray-500">
            <span class="icon-security text-green-600"></span>
            {{ trans('mercadopago::app.checkout.secure-payment') }}
        </div>

        <!-- Processing Info -->
        <div class="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
            <strong>{{ trans('mercadopago::app.checkout.important') }}:</strong>
            {{ trans('mercadopago::app.checkout.redirect-notice') }}
        </div>
    </div>
</div>

@pushOnce('scripts')
<script type="module">
    // Additional logic for Checkout Pro can be added here if needed
    console.log('MercadoPago Checkout Pro loaded');
</script>
@endPushOnce
