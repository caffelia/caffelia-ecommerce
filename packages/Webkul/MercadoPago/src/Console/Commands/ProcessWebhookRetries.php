<?php

namespace Webkul\MercadoPago\Console\Commands;

use Illuminate\Console\Command;
use Webkul\MercadoPago\Models\WebhookEvent;
use Webkul\MercadoPago\Http\Controllers\WebhookController;
use Illuminate\Http\Request;

class ProcessWebhookRetries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mercadopago:process-webhook-retries
                            {--limit=10 : Maximum number of events to process}
                            {--max-retries=3 : Maximum retry attempts per event}
                            {--dry-run : Show events that would be processed without actually processing them}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process failed MercadoPago webhook events for retry';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $limit = $this->option('limit');
        $maxRetries = $this->option('max-retries');
        $dryRun = $this->option('dry-run');

        $this->info("Processing MercadoPago webhook retries...");
        $this->info("Limit: {$limit}, Max retries: {$maxRetries}, Dry run: " . ($dryRun ? 'Yes' : 'No'));

        // Get failed events that are eligible for retry
        $failedEvents = WebhookEvent::where('status', 'failed')
            ->where('retry_count', '<', $maxRetries)
            ->where('created_at', '>', now()->subDays(7)) // Only retry events from last 7 days
            ->orderBy('created_at', 'asc')
            ->limit($limit)
            ->get();

        if ($failedEvents->isEmpty()) {
            $this->info('No failed webhook events found for retry.');
            return 0;
        }

        $this->info("Found {$failedEvents->count()} failed events to retry:");

        $processed = 0;
        $successful = 0;
        $failed = 0;

        foreach ($failedEvents as $event) {
            $this->line("Processing event: {$event->webhook_id} (Type: {$event->event_type}, Retries: {$event->retry_count})");

            if ($dryRun) {
                $this->info("  [DRY RUN] Would retry webhook event {$event->webhook_id}");
                continue;
            }

            try {
                // Create a mock request from stored payload
                $request = new Request();
                $request->initialize(
                    $event->payload ?? [],
                    [],
                    [],
                    [],
                    [],
                    array_merge($_SERVER, [
                        'REQUEST_METHOD' => 'POST',
                        'CONTENT_TYPE' => 'application/json',
                    ])
                );

                // Add stored headers
                if ($event->headers) {
                    foreach ($event->headers as $key => $value) {
                        $request->headers->set($key, is_array($value) ? $value[0] : $value);
                    }
                }

                // Process the webhook
                $webhookController = app(WebhookController::class);
                $response = $webhookController->handle($request);

                if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
                    $event->update([
                        'status' => 'processed',
                        'processed_at' => now(),
                        'error_message' => null,
                    ]);
                    $successful++;
                    $this->info("  ✓ Successfully processed event {$event->webhook_id}");
                } else {
                    $event->increment('retry_count');
                    $event->update([
                        'error_message' => "Retry failed with status: {$response->getStatusCode()}",
                    ]);
                    $failed++;
                    $this->error("  ✗ Failed to process event {$event->webhook_id} (Status: {$response->getStatusCode()})");
                }

            } catch (\Exception $e) {
                $event->increment('retry_count');
                $event->update([
                    'error_message' => "Retry failed: " . $e->getMessage(),
                ]);
                $failed++;
                $this->error("  ✗ Error processing event {$event->webhook_id}: " . $e->getMessage());
            }

            $processed++;
        }

        if (!$dryRun) {
            $this->info("\nRetry processing completed:");
            $this->info("  Total processed: {$processed}");
            $this->info("  Successful: {$successful}");
            $this->info("  Failed: {$failed}");
        }

        return 0;
    }
}
