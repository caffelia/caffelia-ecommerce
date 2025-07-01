# MercadoPago Payment Integration for Bagisto

A comprehensive MercadoPago payment integration for Bagisto e-commerce platform with support for Checkout Pro, Checkout API, installments, and webhook processing.

## Features

- **Dual Payment Methods**: Checkout Pro (redirect) and Checkout API (on-site)
- **Multi-Currency Support**: ARS, BRL, CLP, COP, MXN, PEN, UYU
- **Installments**: Configurable installments with interest rates
- **Webhook Processing**: Real-time payment status updates with signature validation
- **Security**: IP validation, signature verification, and secure credential handling
- **Admin Interface**: Complete configuration with test connectivity
- **Multilingual**: English and Spanish translations included
- **Production Ready**: Comprehensive error handling, logging, and retry mechanisms

## Installation

### 1. Package Installation

The package is already included in your Bagisto installation. To register it:

```bash
# Navigate to your Bagisto root directory
cd /path/to/your/bagisto

# Register the package
php artisan package:discover

# Publish and run migrations
php artisan migrate

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### 2. MercadoPago Account Setup

1. **Create a MercadoPago Developer Account**:
   - Visit [https://developers.mercadopago.com](https://developers.mercadopago.com)
   - Create an account or login to existing account
   - Navigate to "Your integrations" → "Create application"

2. **Get Your Credentials**:
   - **Sandbox Credentials** (for testing):
     - Access Token: `TEST-xxxxx`
     - Public Key: `TEST-xxxxx`
   - **Production Credentials** (for live transactions):
     - Access Token: `APP_USR-xxxxx`
     - Public Key: `APP_USR-xxxxx`

3. **Configure Webhook URL**:
   - Add your webhook URL in MercadoPago dashboard:
   - `https://yourstore.com/mercadopago/webhook`

### 3. Bagisto Configuration

Navigate to **Admin Panel** → **Configuration** → **Sales** → **Payment Methods**

#### MercadoPago Checkout Pro Configuration

1. **Basic Settings**:
   - **Status**: Enable
   - **Title**: MercadoPago Checkout Pro
   - **Description**: Pay with MercadoPago (redirect to MercadoPago)

2. **API Credentials**:
   - **Environment**: Sandbox (for testing) / Production (for live)
   - **Access Token**: Your MercadoPago access token
   - **Public Key**: Your MercadoPago public key
   - **Webhook Secret**: Generate a secure random string

3. **Payment Options**:
   - **Auto Return**: Enable automatic return from MercadoPago
   - **Max Installments**: 1-24 (or leave empty for default)
   - **Exclude Payment Types**: Optional (e.g., "ticket,bank_transfer")
   - **Binary Mode**: Enable for immediate approval/rejection

#### MercadoPago Checkout API Configuration

1. **Basic Settings**:
   - **Status**: Enable
   - **Title**: Credit Card via MercadoPago
   - **Description**: Pay with credit card directly on our site

2. **API Credentials**: (Same as Checkout Pro)

3. **Payment Options**:
   - **Capture Payment**: Enable automatic capture
   - **Save Customer Cards**: Enable card tokenization
   - **Statement Descriptor**: Your store name (max 22 chars)
   - **Enable Installments**: Allow installment payments
   - **Max Installments**: 1-24 installments

## Testing

### Running Tests

```bash
# Navigate to the package directory
cd packages/Webkul/MercadoPago

# Run all tests
./vendor/bin/pest

# Run specific test suites
./vendor/bin/pest tests/Unit
./vendor/bin/pest tests/Feature

# Run with coverage
./vendor/bin/pest --coverage
```

### Manual Testing

#### 1. Checkout Pro Testing

1. **Test Card Numbers** (Sandbox):
   ```
   Visa: 4170068810108020
   Mastercard: 5031755734530604
   American Express: 373486623605021
   ```

2. **Test Scenarios**:
   - Approved payment: Use test cards with expiry in future
   - Rejected payment: Use card `4000000000000002`
   - Pending payment: Use ticket payment methods

#### 2. Checkout API Testing

1. **Create Card Token**: Use MercadoPago.js to tokenize test cards
2. **Test Payment Flow**: Process payments with different scenarios
3. **Installments**: Test with different installment options

#### 3. Webhook Testing

1. **Use ngrok** for local development:
   ```bash
   ngrok http 8000
   # Update webhook URL in MercadoPago dashboard
   ```

2. **Test Events**: Trigger payments to receive webhook notifications

## Usage

### Frontend Implementation

#### Checkout Pro
```php
// The payment method automatically handles redirection
// Customer clicks "Pay with MercadoPago" and gets redirected
```

#### Checkout API
```javascript
// Include MercadoPago SDK
<script src="https://sdk.mercadopago.com/js/v2"></script>

// Initialize MercadoPago
const mp = new MercadoPago('YOUR_PUBLIC_KEY');

// Create card form and process payment
// (Detailed implementation in the frontend views)
```

### Backend Integration

#### Processing Payments
```php
use Webkul\MercadoPago\Payment\CheckoutPro;
use Webkul\MercadoPago\Payment\CheckoutAPI;

// Checkout Pro
$checkoutPro = new CheckoutPro();
$preference = $checkoutPro->createPreference();

// Checkout API
$checkoutAPI = new CheckoutAPI();
$payment = $checkoutAPI->processPayment($paymentData);
```

#### Webhook Handling
```php
// Webhooks are automatically processed
// Check WebhookEvent model for event history
use Webkul\MercadoPago\Models\WebhookEvent;

$events = WebhookEvent::where('status', 'processed')->get();
```

## Configuration Reference

### Environment Variables

Add to your `.env` file:

```env
# MercadoPago Configuration
MERCADOPAGO_SANDBOX=true
MERCADOPAGO_ACCESS_TOKEN=your_access_token
MERCADOPAGO_PUBLIC_KEY=your_public_key
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret
```

### Supported Countries & Currencies

| Country | Currency | Payment Methods |
|---------|----------|----------------|
| Argentina | ARS | Credit Cards, Cash, Bank Transfer |
| Brazil | BRL | Credit Cards, PIX, Boleto |
| Chile | CLP | Credit Cards, Bank Transfer |
| Colombia | COP | Credit Cards, Cash, Bank Transfer |
| Mexico | MXN | Credit Cards, OXXO, Bank Transfer |
| Peru | PEN | Credit Cards, Cash, Bank Transfer |
| Uruguay | UYU | Credit Cards, Bank Transfer |

## Troubleshooting

### Common Issues

#### 1. "Payment method not available"
- Check currency configuration
- Verify API credentials
- Ensure payment method is enabled

#### 2. "Invalid signature" webhook errors
- Verify webhook secret configuration
- Check webhook URL accessibility
- Validate IP allowlist settings

#### 3. "Preference creation failed"
- Verify API credentials
- Check cart data validity
- Review MercadoPago API response

### Debug Mode

Enable debug mode in configuration to get detailed logs:

```php
// Check logs in storage/logs/laravel.log
tail -f storage/logs/laravel.log | grep MercadoPago
```

### Support Commands

```bash
# Test webhook processing
php artisan mercadopago:process-webhook-retries

# Clean old webhook events
php artisan mercadopago:cleanup-webhook-events

# Test API connectivity
php artisan tinker
>>> app(\Webkul\MercadoPago\Helpers\MercadoPagoAPI::class)->testConnection()
```

## Security Considerations

1. **Credentials Security**: Never expose private keys in frontend
2. **Webhook Validation**: Always validate webhook signatures
3. **IP Filtering**: Restrict webhook access to MercadoPago IPs
4. **HTTPS**: Use HTTPS for all payment-related endpoints
5. **PCI Compliance**: Follow PCI DSS guidelines for card data

## API Reference

### Payment Status Mapping

| MercadoPago Status | Bagisto Order Status | Description |
|-------------------|---------------------|-------------|
| `approved` | `processing` | Payment approved |
| `pending` | `pending_payment` | Payment pending |
| `rejected` | `canceled` | Payment rejected |
| `refunded` | `refunded` | Payment refunded |
| `cancelled` | `canceled` | Payment cancelled |

### Webhook Events

- `payment.created` - New payment created
- `payment.updated` - Payment status updated
- `merchant_order.created` - New merchant order
- `merchant_order.updated` - Merchant order updated

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for your changes
4. Ensure all tests pass
5. Submit a pull request

## License

This package is open-sourced software licensed under the [MIT license](LICENSE).

## Support

For support, please:

1. Check this documentation
2. Review the troubleshooting section
3. Check the logs for detailed error messages
4. Contact your system administrator

## Changelog

### Version 1.0.0
- Initial release with Checkout Pro and Checkout API
- Webhook processing with signature validation
- Multi-currency support
- Comprehensive admin configuration
- Complete test suite 
