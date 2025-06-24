<?php
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Route;

Route::get('cache/{template}/{path}', function ($template, $path) {
    // Directly generate the public URL for the file on the 'public' disk (your cloud bucket).
    // We are skipping the `exists()` check, as it might be the source of the 500 error.
    // If the file does not exist in the bucket, the user will get a proper 404 error
    // from the cloud storage provider, which is the correct behavior.
    $correctCloudUrl = Storage::disk('public')->url($path);

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
