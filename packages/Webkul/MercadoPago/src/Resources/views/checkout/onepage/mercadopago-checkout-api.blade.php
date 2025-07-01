@php
    $publicKey = core()->getConfigData('sales.payment_methods.mercadopago_checkout_api.public_key');
    $sandbox = core()->getConfigData('sales.payment_methods.mercadopago_checkout_api.sandbox');
    $installmentsEnabled = core()->getConfigData('sales.payment_methods.mercadopago_checkout_api.installments_enabled');
    $maxInstallments = core()->getConfigData('sales.payment_methods.mercadopago_checkout_api.max_installments');
@endphp

<div class="w-full" v-show="selectedPayment?.method === 'mercadopago_checkout_api'">
    <v-mercadopago-checkout-api
        public-key="{{ $publicKey }}"
        :sandbox="{{ $sandbox ? 'true' : 'false' }}"
        :installments-enabled="{{ $installmentsEnabled ? 'true' : 'false' }}"
        :max-installments="{{ $maxInstallments ?: 12 }}"
        @payment-success="onPaymentSuccess"
        @payment-error="onPaymentError"
    >
    </v-mercadopago-checkout-api>
</div>

@pushOnce('scripts')
<!-- MercadoPago SDK -->
<script src="https://sdk.mercadopago.com/js/v2"></script>

<script type="text/x-template" id="v-mercadopago-checkout-api-template">
    <div class="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
            <img
                src="{{ bagisto_asset('images/mercadopago-logo.png', 'shop') }}"
                alt="MercadoPago"
                class="w-12 h-8 object-contain"
                onerror="this.style.display='none'"
            >
            <div>
                <h3 class="text-lg font-medium text-gray-900">
                    {{ trans('mercadopago::app.checkout.checkout-api.title') }}
                </h3>
                <p class="text-sm text-gray-600">
                    {{ trans('mercadopago::app.checkout.checkout-api.description') }}
                </p>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-sm text-gray-600">{{ trans('mercadopago::app.checkout.loading-payment-methods') }}</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center gap-2">
                <span class="icon-error text-red-600"></span>
                <h4 class="text-sm font-medium text-red-800">{{ trans('mercadopago::app.errors.configuration-error') }}</h4>
            </div>
            <p class="text-sm text-red-600 mt-1">@{{ error }}</p>
        </div>

        <!-- Payment Form -->
        <form v-if="!isLoading && !error" @submit.prevent="processPayment" class="space-y-4">
            <!-- Identification -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ trans('mercadopago::app.checkout.identification-type') }} *
                    </label>
                    <select
                        v-model="form.identificationType"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">{{ trans('mercadopago::app.checkout.select-identification') }}</option>
                        <option
                            v-for="idType in identificationTypes"
                            :key="idType.id"
                            :value="idType.id"
                        >
                            @{{ idType.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ trans('mercadopago::app.checkout.identification-number') }} *
                    </label>
                    <input
                        type="text"
                        v-model="form.identificationNumber"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        :placeholder="trans('mercadopago::app.checkout.identification-placeholder')"
                        required
                    >
                </div>
            </div>

            <!-- Card Details Container -->
            <div class="bg-white p-4 rounded-lg border">
                <h4 class="text-sm font-medium text-gray-900 mb-3">
                    {{ trans('mercadopago::app.checkout.card-details') }}
                </h4>

                <!-- Card Number -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ trans('mercadopago::app.checkout.card-number') }} *
                    </label>
                    <div id="mp-card-number" class="mp-field border border-gray-300 rounded-md p-3"></div>
                    <div class="text-xs text-red-600 mt-1" id="mp-card-number-error"></div>
                </div>

                <!-- Expiry and CVV -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ trans('mercadopago::app.checkout.expiry-date') }} *
                        </label>
                        <div id="mp-expiry-date" class="mp-field border border-gray-300 rounded-md p-3"></div>
                        <div class="text-xs text-red-600 mt-1" id="mp-expiry-date-error"></div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ trans('mercadopago::app.checkout.security-code') }} *
                        </label>
                        <div id="mp-security-code" class="mp-field border border-gray-300 rounded-md p-3"></div>
                        <div class="text-xs text-red-600 mt-1" id="mp-security-code-error"></div>
                    </div>
                </div>

                <!-- Cardholder Name -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ trans('mercadopago::app.checkout.cardholder-name') }} *
                    </label>
                    <input
                        type="text"
                        v-model="form.cardholderName"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        :placeholder="trans('mercadopago::app.checkout.cardholder-placeholder')"
                        required
                    >
                </div>
            </div>

            <!-- Installments (if enabled) -->
            <div v-if="installmentsEnabled && installmentOptions.length > 1" class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label class="block text-sm font-medium text-blue-800 mb-2">
                    {{ trans('mercadopago::app.checkout.installments') }}
                </label>
                <select
                    v-model="form.installments"
                    class="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                    <option
                        v-for="option in installmentOptions"
                        :key="option.installments"
                        :value="option.installments"
                    >
                        @{{ option.installments }}x {{ trans('mercadopago::app.checkout.of') }} @{{ option.installment_amount | currency }}
                        <span v-if="option.total_amount !== option.installment_amount * option.installments">
                            ({{ trans('mercadopago::app.checkout.total') }}: @{{ option.total_amount | currency }})
                        </span>
                    </option>
                </select>
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                :disabled="isProcessing"
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                <span v-if="isProcessing" class="flex items-center justify-center gap-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {{ trans('mercadopago::app.checkout.processing') }}
                </span>
                <span v-else>
                    {{ trans('mercadopago::app.checkout.pay-now') }}
                </span>
            </button>
        </form>

        <!-- Security Badge -->
        <div class="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
            <span class="icon-security text-green-600"></span>
            {{ trans('mercadopago::app.checkout.secure-payment') }}
        </div>
    </div>
</script>

<script type="module">
app.component('v-mercadopago-checkout-api', {
    template: '#v-mercadopago-checkout-api-template',

    props: {
        publicKey: String,
        sandbox: Boolean,
        installmentsEnabled: Boolean,
        maxInstallments: Number,
    },

    emits: ['payment-success', 'payment-error'],

    data() {
        return {
            mp: null,
            cardForm: null,
            isLoading: true,
            isProcessing: false,
            error: null,
            identificationTypes: [],
            installmentOptions: [],
            form: {
                identificationType: '',
                identificationNumber: '',
                cardholderName: '',
                installments: 1,
            },
        };
    },

    async mounted() {
        try {
            await this.initializeMercadoPago();
            await this.loadIdentificationTypes();
            this.createCardForm();
            this.isLoading = false;
        } catch (error) {
            this.error = error.message;
            this.isLoading = false;
        }
    },

    methods: {
        async initializeMercadoPago() {
            if (!this.publicKey) {
                throw new Error('{{ trans("mercadopago::app.errors.missing-public-key") }}');
            }

            this.mp = new MercadoPago(this.publicKey, {
                locale: '{{ app()->getLocale() }}',
            });
        },

        async loadIdentificationTypes() {
            try {
                const response = await this.$axios.get('{{ route("mercadopago.checkout-api.identification-types") }}');
                if (response.data.success) {
                    this.identificationTypes = response.data.identification_types;
                }
            } catch (error) {
                console.error('Error loading identification types:', error);
            }
        },

        createCardForm() {
            const cardForm = this.mp.cardForm({
                amount: '{{ Cart::getCart()->grand_total ?? 0 }}',
                iframe: true,
                form: {
                    id: 'mp-checkout-form',
                    cardNumber: {
                        id: 'mp-card-number',
                        placeholder: '{{ trans("mercadopago::app.checkout.card-number-placeholder") }}',
                    },
                    expirationDate: {
                        id: 'mp-expiry-date',
                        placeholder: '{{ trans("mercadopago::app.checkout.expiry-placeholder") }}',
                    },
                    securityCode: {
                        id: 'mp-security-code',
                        placeholder: '{{ trans("mercadopago::app.checkout.cvv-placeholder") }}',
                    },
                },
                callbacks: {
                    onFormMounted: (error) => {
                        if (error) {
                            this.error = error.message;
                        }
                    },
                    onCardTokenReceived: (error, token) => {
                        if (error) {
                            this.handlePaymentError(error.message);
                        } else {
                            this.handleTokenReceived(token);
                        }
                    },
                    onPaymentMethodsReceived: (error, paymentMethods) => {
                        if (!error && paymentMethods.length > 0) {
                            this.loadInstallments(paymentMethods[0].id);
                        }
                    },
                },
            });

            this.cardForm = cardForm;
        },

        async loadInstallments(paymentMethodId) {
            if (!this.installmentsEnabled) return;

            try {
                const response = await this.$axios.get('{{ route("mercadopago.checkout-api.installments") }}', {
                    params: {
                        payment_method_id: paymentMethodId,
                        amount: '{{ Cart::getCart()->grand_total ?? 0 }}',
                    }
                });

                if (response.data.success && response.data.installments.length > 0) {
                    this.installmentOptions = response.data.installments[0].payer_costs.filter(
                        option => option.installments <= this.maxInstallments
                    );
                }
            } catch (error) {
                console.error('Error loading installments:', error);
            }
        },

        async processPayment() {
            if (this.isProcessing) return;

            this.isProcessing = true;

            try {
                // Create token using MercadoPago SDK
                const token = await this.cardForm.createCardToken({
                    cardholderName: this.form.cardholderName,
                    identificationType: this.form.identificationType,
                    identificationNumber: this.form.identificationNumber,
                });

                if (token) {
                    await this.submitPayment(token);
                }
            } catch (error) {
                this.handlePaymentError(error.message || '{{ trans("mercadopago::app.errors.payment-failed") }}');
            } finally {
                this.isProcessing = false;
            }
        },

        async submitPayment(token) {
            try {
                const response = await this.$axios.post('{{ route("mercadopago.checkout-api.process") }}', {
                    token: token,
                    payment_method_id: this.cardForm.getPaymentMethodId(),
                    installments: this.form.installments,
                    identification_type: this.form.identificationType,
                    identification_number: this.form.identificationNumber,
                    _token: '{{ csrf_token() }}',
                });

                if (response.data.success) {
                    this.$emit('payment-success', response.data);
                    if (response.data.redirect_url) {
                        window.location.href = response.data.redirect_url;
                    }
                } else {
                    this.handlePaymentError(response.data.message);
                }
            } catch (error) {
                const message = error.response?.data?.message || '{{ trans("mercadopago::app.errors.payment-failed") }}';
                this.handlePaymentError(message);
            }
        },

        handleTokenReceived(token) {
            // Token received, form will handle submission
            console.log('Token received:', token);
        },

        handlePaymentError(message) {
            this.$emit('payment-error', message);
            this.$emitter.emit('add-flash', { type: 'error', message: message });
            this.isProcessing = false;
        },
    },
});
</script>
@endPushOnce

<style>
.mp-field {
    min-height: 45px;
}

.mp-field iframe {
    border: none;
    width: 100%;
    height: 100%;
}
</style>
