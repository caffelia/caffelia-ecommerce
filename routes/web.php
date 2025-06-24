<?php
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Route;

/**
 * Route to handle Bagisto's Image Cache requests.
 *
 * This is the primary fix. Bagisto creates URLs like `/cache/large/theme/1/image.webp`.
 * This route intercepts everything after `/cache/` into a single `$path` variable.
 * We then parse this path to extract the real file path for the cloud storage bucket.
 * This is a more robust method than using multiple route parameters.
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

    // Manually construct the full URL. This is a more direct approach to avoid
    // potential issues with the Storage facade that might be causing a 500 error.
    // It uses the AWS_URL environment variable provided by Laravel Cloud.
    $baseUrl = rtrim(env('AWS_URL'), '/');
    $correctCloudUrl = $baseUrl . '/' . $realPath;

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
    // Manually construct the full URL, same as in the route above.
    $baseUrl = rtrim(env('AWS_URL'), '/');
    $correctCloudUrl = $baseUrl . '/' . $path;

    // Redirect the browser to the correct file in the cloud.
    return redirect($correctCloudUrl);

})->where('path', '.*');
