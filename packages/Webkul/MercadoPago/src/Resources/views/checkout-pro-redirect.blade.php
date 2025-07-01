<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ trans('mercadopago::app.info.redirecting') }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        }
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 1rem;
        }
        .spinner {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 3px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 1rem auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        h1 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
            font-weight: 600;
        }
        p {
            margin: 0;
            opacity: 0.9;
        }
        .error {
            color: #ff6b6b;
            background: rgba(255, 107, 107, 0.1);
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="{{ asset('themes/shop/caffelia-shop/build/assets/mercadopago-C_nUP1gf.png') }}" alt="MercadoPago" class="logo">

        @if(isset($checkoutUrl) && $checkoutUrl)
            <h1>{{ trans('mercadopago::app.info.redirecting') }}</h1>
            <div class="spinner"></div>
            <p>{{ trans('mercadopago::app.info.payment-pending') }}</p>

            <script>
                // Redirect immediately to MercadoPago
                setTimeout(function() {
                    window.location.href = '{{ $checkoutUrl }}';
                }, 1000);

                // Fallback: show manual link after 3 seconds
                setTimeout(function() {
                    document.body.innerHTML += '<div style="margin-top: 2rem;"><a href="{{ $checkoutUrl }}" style="color: white; text-decoration: underline;">{{ trans("mercadopago::app.checkout.click-here-to-continue") }}</a></div>';
                }, 3000);
            </script>
        @else
            <h1>{{ trans('mercadopago::app.errors.something-went-wrong') }}</h1>
            <div class="error">
                <p>{{ trans('mercadopago::app.errors.invalid-configs') }}</p>
                <p style="margin-top: 0.5rem;">
                    <a href="{{ route('shop.checkout.cart.index') }}" style="color: white; text-decoration: underline;">
                        {{ trans('mercadopago::app.checkout.back-to-cart') }}
                    </a>
                </p>
            </div>
        @endif
    </div>
</body>
</html>
