<?php
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Route;

/**
 * Route to handle Bagisto's Image Cache requests.
 *
 * This is the primary fix. This route intercepts requests for cached images,
 * finds the original image in your cloud bucket, and then streams the file
 * directly to the browser. This avoids redirect errors.
 */
Route::get('cache/{path}', function ($path) {
    // The incoming $path variable will look like "large/theme/1/image.webp".
    // We need to extract the actual file path ("theme/1/image.webp").
    $firstSlashPos = strpos($path, '/');

    if ($firstSlashPos === false) {
        abort(404);
    }

    $realPath = substr($path, $firstSlashPos + 1);

    // Before serving, we must check if the file actually exists in the bucket.
    if (!Storage::disk('public')->exists($realPath)) {
        abort(404);
    }

    // This is the key change: instead of redirecting, we find the file in the
    // 'public' disk (your cloud bucket) and return it directly as a response.
    // Laravel handles all the correct headers (like Content-Type).
    return Storage::disk('public')->response($realPath);

})->where('path', '.*');


/**
 * Fallback Route for direct /storage/ links.
 *
 * This route handles any direct requests for files in the /storage/ directory,
 * which Bagisto also generates in the `srcset` attribute.
 */
Route::get('storage/{path}', function ($path) {
    // First, check if the file exists to avoid errors.
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }

    // Serve the file directly from the cloud bucket.
    return Storage::disk('public')->response($path);

})->where('path', '.*');
