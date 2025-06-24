<?php

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Route;

/**
 * Route to handle Bagisto's Image Cache requests.
 *
 * This is the primary fix. Bagisto creates URLs like `/cache/{template}/{path}`.
 * This route intercepts those requests, finds the original image in your cloud bucket,
 * and redirects the browser to the correct cloud URL.
 */
Route::get('cache/{template}/{path}', function ($template, $path) {
    // Check if the original file exists on the 'public' disk (our cloud bucket).
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }

    // Get the full, correct URL for the original file from the cloud bucket.
    $correctCloudUrl = Storage::disk('public')->url($path);

    // Redirect the browser to the correct file in the cloud.
    return redirect($correctCloudUrl);

})->where('path', '.*');


/**
 * Fallback Route for direct /storage/ links.
 *
 * This route handles any direct requests for files in the /storage/ directory.
 * While the /cache/ route is the main fix for the frontend, this is a good
 * fallback to have for other potential links.
 */
Route::get('storage/{path}', function ($path) {
    // Check if the requested file actually exists in our cloud bucket.
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }

    // Get the full, correct URL from the cloud bucket.
    $correctCloudUrl = Storage::disk('public')->url($path);

    // Redirect the browser to the correct file in the cloud.
    return redirect($correctCloudUrl);

})->where('path', '.*');

/**
 * Store front routes.
 */
require 'store-front-routes.php';

/**
 * Customer routes. All routes related to customer
 * in storefront will be placed here.
 */
require 'customer-routes.php';

/**
 * Checkout routes. All routes related to checkout like
 * cart, coupons, etc will be placed here.
 */
require 'checkout-routes.php';
