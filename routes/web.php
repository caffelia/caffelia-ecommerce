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

    // Directly generate the public URL for the real file path on the 'public' disk (your cloud bucket).
    $correctCloudUrl = Storage::disk('public')->url($realPath);

    // Redirect the browser to the correct file in the cloud.
    return redirect($correctCloudUrl);

})->where('path', '.*');


/**
 * Fallback Route for direct /storage/ links.
 *
 * This route handles any direct requests for files in the /storage/ directory.
 */
Route::get('storage/{path}', function ($path) {
    // Directly generate the public URL for the file.
    $correctCloudUrl = Storage::disk('public')->url($path);

    // Redirect the browser to the correct file in the cloud.
    return redirect($correctCloudUrl);

})->where('path', '.*');
