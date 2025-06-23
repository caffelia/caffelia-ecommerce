<?php

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

if (! function_exists('safe_storage_url')) {
    /**
     * Generate a safe storage URL that handles null values
     *
     * @param string|null $path
     * @param string $default
     * @return string
     */
    function safe_storage_url($path, $default = '') {
        if (empty($path)) {
            return $default;
        }

        try {
            // Check if file exists before generating URL
            if (Storage::exists($path)) {
                return Storage::url($path);
            }
            return $default;
        } catch (Exception $e) {
            // Log the error and return default
            Log::warning('Failed to generate storage URL for path: ' . $path, [
                'error' => $e->getMessage(),
                'path' => $path
            ]);
            return $default;
        }
    }
}
