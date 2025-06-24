<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Caffelia\ShopTheme\Http\Controllers\BookingProductController;
use Caffelia\ShopTheme\Http\Controllers\CompareController;
use Caffelia\ShopTheme\Http\Controllers\HomeController;
use Caffelia\ShopTheme\Http\Controllers\PageController;
use Caffelia\ShopTheme\Http\Controllers\ProductController;
use Caffelia\ShopTheme\Http\Controllers\ProductsCategoriesProxyController;
use Caffelia\ShopTheme\Http\Controllers\SearchController;
use Caffelia\ShopTheme\Http\Controllers\SubscriptionController;
Route::get('storage/{path}', function ($path) {
    /**
     * This route handles requests for files stored on the 'public' disk.
     * In a Laravel Cloud environment with an attached S3-compatible bucket,
     * the 'public' disk points to that bucket.
     *
     * The problem this solves:
     * Bagisto (and other systems) may store relative paths in the database (e.g., 'theme/1/image.png').
     * The frontend then requests `https://your-domain.com/storage/theme/1/image.png`.
     * This route intercepts that request.
     */

    // First, check if the requested file actually exists in our cloud bucket.
    // The `Storage::disk('public')` automatically points to your attached bucket.
    if (!Storage::disk('public')->exists($path)) {
        // If the file doesn't exist, return a standard 404 Not Found error.
        abort(404);
    }

    /**
     * If the file exists, we ask Laravel's Storage facade for the correct, full URL
     * to that file in the cloud bucket. This works because the `url` key in your
     * `config/filesystems.php` for the `public` disk is configured to use the `AWS_URL`
     * environment variable provided by Laravel Cloud.
     */
    $correctCloudUrl = Storage::disk('public')->url($path);

    /**
     * Finally, we return an HTTP 302 redirect. This tells the user's browser:
     * "The file you asked for isn't here. It's over at this other URL."
     * The browser will then automatically make a new request to the correct cloud URL.
     */
    return redirect($correctCloudUrl);

})->where('path', '.*');

/**
 * CMS pages.
 */
Route::get('page/{slug}', [PageController::class, 'view'])
    ->name('shop.cms.page')
    ->middleware('cache.response');

/**
 * Fallback route.
 */
Route::fallback(ProductsCategoriesProxyController::class.'@index')
    ->name('shop.product_or_category.index')
    ->middleware('cache.response');

/**
 * Store front home.
 */
Route::get('/', [HomeController::class, 'index'])
    ->name('shop.home.index')
    ->middleware('cache.response');

Route::get('contact-us', [HomeController::class, 'contactUs'])
    ->name('shop.home.contact_us')
    ->middleware('cache.response');

Route::post('contact-us/send-mail', [HomeController::class, 'sendContactUsMail'])
    ->name('shop.home.contact_us.send_mail')
    ->middleware('cache.response');

/**
 * Store front search.
 */
Route::get('search', [SearchController::class, 'index'])
    ->name('shop.search.index')
    ->middleware('cache.response');

Route::post('search/upload', [SearchController::class, 'upload'])->name('shop.search.upload');

/**
 * Subscription routes.
 */
Route::controller(SubscriptionController::class)->group(function () {
    Route::post('subscription', 'store')->name('shop.subscription.store');

    Route::get('subscription/{token}', 'destroy')->name('shop.subscription.destroy');
});

/**
 * Compare products
 */
Route::get('compare', [CompareController::class, 'index'])
    ->name('shop.compare.index')
    ->middleware('cache.response');

/**
 * Downloadable products
 */
Route::controller(ProductController::class)->group(function () {
    Route::get('downloadable/download-sample/{type}/{id}', 'downloadSample')->name('shop.downloadable.download_sample');

    Route::get('product/{id}/{attribute_id}', 'download')->name('shop.product.file.download');
});

/**
 * Booking products
 */
Route::get('booking-slots/{id}', [BookingProductController::class, 'index'])
    ->name('shop.booking-product.slots.index');
