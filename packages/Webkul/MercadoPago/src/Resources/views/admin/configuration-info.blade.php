@php
    $webhookUrl = route('mercadopago.webhook');
@endphp

<div class="flex items-center gap-2.5">
    <div class="grid gap-1.5">
        <p class="text-gray-600 dark:text-gray-300 text-xs font-semibold">
            {{ trans('mercadopago::app.admin.configuration.webhook-url') }}
        </p>

        <div class="flex items-center gap-2">
            <code class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded border select-all">
                {{ $webhookUrl }}
            </code>

                        <button
                type="button"
                class="text-blue-600 hover:text-blue-700 text-xs underline"
                onclick="copyWebhookUrl()"
            >
                {{ trans('mercadopago::app.admin.configuration.copy') }}
            </button>

            <script>
                function copyWebhookUrl() {
                    navigator.clipboard.writeText('{{ $webhookUrl }}');
                    alert('{{ trans("mercadopago::app.admin.configuration.webhook-copied") }}');
                }
            </script>
        </div>

        <p class="text-gray-500 dark:text-gray-400 text-xs">
            {{ trans('mercadopago::app.admin.configuration.webhook-instructions') }}
        </p>
    </div>
</div>

<div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
    <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
        {{ trans('mercadopago::app.admin.configuration.setup-instructions') }}
    </h4>

    <ol class="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
        <li>{{ trans('mercadopago::app.admin.configuration.step1') }}</li>
        <li>{{ trans('mercadopago::app.admin.configuration.step2') }}</li>
        <li>{{ trans('mercadopago::app.admin.configuration.step3') }}</li>
        <li>{{ trans('mercadopago::app.admin.configuration.step4') }}</li>
        <li>{{ trans('mercadopago::app.admin.configuration.step5') }}</li>
    </ol>
</div>

<div class="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded">
    <h4 class="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
        {{ trans('mercadopago::app.admin.configuration.testing-notice') }}
    </h4>

    <p class="text-xs text-amber-700 dark:text-amber-300">
        {{ trans('mercadopago::app.admin.configuration.testing-instructions') }}
    </p>
</div>

<div class="mt-4">
    <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {{ trans('mercadopago::app.admin.configuration.supported-countries') }}
    </h4>

    <div class="flex flex-wrap gap-2">
        @foreach(['Argentina (ARS)', 'Brazil (BRL)', 'Chile (CLP)', 'Colombia (COP)', 'Mexico (MXN)', 'Peru (PEN)', 'Uruguay (UYU)'] as $country)
            <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded">
                {{ $country }}
            </span>
        @endforeach
    </div>
</div>
