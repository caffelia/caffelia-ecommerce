<?php
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Route;

/**
 * Route to handle Bagisto's Image Cache requests.
 *
 * This is the primary fix. Bagisto creates URLs like `/cache/large/theme/1/image.webp`.
 * This route intercepts everything after `/cache/` into a single `$path` variable.
 * We then parse this path to extract the real file path for the cloud storage bucket.
 */
Route::get('cache/{path}', function ($path) {
    // The incoming $path variable will look like "large/theme/1/image.webp".
    // We need to find the first slash to separate the cache template ("large")
    // from the actual file path ("theme/1/image.webp").
    $firstSlashPos = strpos($path, '/');

    // If there's no slash, the path is malformed, so we can't find the file.
    if ($firstSlashPos === false) {
        abort(404);
    }

    // The real path is the part of the string *after* the first slash.
    $realPath = substr($path, $firstSlashPos + 1);

    // Use the Storage facade to get the URL. This is more reliable than using the
    // env() helper directly in a route, as it uses the cached configuration.
    $correctCloudUrl = Storage::disk('public')->url($realPath);

    // Redirect the browser to the correct file in the cloud.
    return redirect($correctCloudUrl);

})->where('path', '.*');


/**
 * Fallback Route for direct /storage/ links.
 *
 * This route handles any direct requests for files in the /storage/ directory,
 * which Bagisto also generates in the `srcset` attribute.
 */
Route::get('storage/{path}', function ($path) {
    // Use the Storage facade here as well for consistency and reliability.
    $correctCloudUrl = Storage::disk('public')->url($path);

    // Redirect the browser to the correct file in the cloud.
    return redirect($correctCloudUrl);

})->where('path', '.*');
