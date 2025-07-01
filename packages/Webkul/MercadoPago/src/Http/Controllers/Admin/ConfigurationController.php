<?php

namespace Webkul\MercadoPago\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Webkul\MercadoPago\Http\Controllers\Controller;

class ConfigurationController extends Controller
{
    /**
     * Test MercadoPago API connection.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function testConnection(Request $request)
    {
        try {
            $accessToken = $request->input('access_token');
            $sandbox = $request->boolean('sandbox', true);

            if (! $accessToken) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.admin.test-connection.missing-token'),
                ], 400);
            }

            // Determine API base URL
            $baseUrl = $sandbox
                ? 'https://api.mercadopago.com/sandbox'
                : 'https://api.mercadopago.com';

            // Test the connection by calling the payment methods endpoint
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
                'User-Agent' => 'Bagisto MercadoPago Plugin',
                'X-Integrator-Id' => 'dev_24c65fb163bf11ea96500242ac130004',
                'X-Platform-Id' => 'bagisto',
            ])->timeout(10)->get($baseUrl . '/v1/payment_methods');

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'success' => true,
                    'message' => trans('mercadopago::app.admin.test-connection.success'),
                    'data' => [
                        'payment_methods_count' => count($data),
                        'environment' => $sandbox ? 'sandbox' : 'production',
                        'user_id' => $this->extractUserIdFromToken($accessToken),
                    ],
                ]);
            }

            $errorData = $response->json();
            $errorMessage = $errorData['message'] ?? $errorData['error'] ?? 'Unknown error';

            return response()->json([
                'success' => false,
                'message' => trans('mercadopago::app.admin.test-connection.failed', ['error' => $errorMessage]),
                'status_code' => $response->status(),
            ], 400);

        } catch (\Exception $e) {
            logger()->error('MercadoPago - Test connection error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => trans('mercadopago::app.admin.test-connection.connection-error'),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get account information from MercadoPago.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAccountInfo(Request $request)
    {
        try {
            $accessToken = $request->input('access_token');
            $sandbox = $request->boolean('sandbox', true);

            if (! $accessToken) {
                return response()->json([
                    'success' => false,
                    'message' => trans('mercadopago::app.admin.test-connection.missing-token'),
                ], 400);
            }

            // Determine API base URL
            $baseUrl = $sandbox
                ? 'https://api.mercadopago.com/sandbox'
                : 'https://api.mercadopago.com';

            // Get user account information
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
                'User-Agent' => 'Bagisto MercadoPago Plugin',
            ])->timeout(10)->get($baseUrl . '/users/me');

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'success' => true,
                    'data' => [
                        'id' => $data['id'] ?? null,
                        'nickname' => $data['nickname'] ?? null,
                        'email' => $data['email'] ?? null,
                        'country_id' => $data['country_id'] ?? null,
                        'site_id' => $data['site_id'] ?? null,
                        'status' => $data['status'] ?? null,
                        'environment' => $sandbox ? 'sandbox' : 'production',
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => trans('mercadopago::app.admin.test-connection.account-info-failed'),
                'status_code' => $response->status(),
            ], 400);

        } catch (\Exception $e) {
            logger()->error('MercadoPago - Get account info error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => trans('mercadopago::app.admin.test-connection.connection-error'),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Validate webhook configuration.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateWebhook(Request $request)
    {
        try {
            $webhookUrl = route('mercadopago.webhook');

            // Test if webhook URL is accessible
            $response = Http::timeout(10)->get($webhookUrl);

            $isAccessible = $response->status() === 405; // Method not allowed is expected for GET on webhook

            return response()->json([
                'success' => true,
                'data' => [
                    'webhook_url' => $webhookUrl,
                    'is_accessible' => $isAccessible,
                    'status_code' => $response->status(),
                    'message' => $isAccessible
                        ? trans('mercadopago::app.admin.test-connection.webhook-accessible')
                        : trans('mercadopago::app.admin.test-connection.webhook-not-accessible'),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => trans('mercadopago::app.admin.test-connection.webhook-error'),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Extract user ID from access token.
     *
     * @param string $accessToken
     * @return string|null
     */
    private function extractUserIdFromToken($accessToken)
    {
        // Extract user ID from APP_USR format if present
        if (strpos($accessToken, 'APP_USR-') === 0) {
            $parts = explode('-', $accessToken);
            return $parts[1] ?? null;
        }

        return null;
    }
}
