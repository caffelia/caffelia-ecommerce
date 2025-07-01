<?php

namespace Webkul\MercadoPago\Console\Commands;

use Illuminate\Console\Command;
use Webkul\MercadoPago\Models\WebhookEvent;

class CleanupWebhookEvents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mercadopago:cleanup-webhook-events
                            {--days=30 : Number of days to keep webhook events}
                            {--keep-failed=90 : Number of days to keep failed events}
                            {--batch-size=1000 : Number of records to delete in each batch}
                            {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old MercadoPago webhook events from the database';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $days = $this->option('days');
        $keepFailedDays = $this->option('keep-failed');
        $batchSize = $this->option('batch-size');
        $dryRun = $this->option('dry-run');

        $this->info("Cleaning up MercadoPago webhook events...");
        $this->info("Keep processed events: {$days} days");
        $this->info("Keep failed events: {$keepFailedDays} days");
        $this->info("Batch size: {$batchSize}");
        $this->info("Dry run: " . ($dryRun ? 'Yes' : 'No'));

        $cutoffDate = now()->subDays($days);
        $failedCutoffDate = now()->subDays($keepFailedDays);

        // Count events to be deleted
        $processedEventsToDelete = WebhookEvent::where('status', 'processed')
            ->where('created_at', '<', $cutoffDate)
            ->count();

        $failedEventsToDelete = WebhookEvent::whereIn('status', ['failed', 'error'])
            ->where('created_at', '<', $failedCutoffDate)
            ->count();

        $receivedEventsToDelete = WebhookEvent::where('status', 'received')
            ->where('created_at', '<', $cutoffDate)
            ->count();

        $totalToDelete = $processedEventsToDelete + $failedEventsToDelete + $receivedEventsToDelete;

        if ($totalToDelete === 0) {
            $this->info('No webhook events found for cleanup.');
            return 0;
        }

        $this->info("\nEvents to be deleted:");
        $this->info("  Processed events (older than {$days} days): {$processedEventsToDelete}");
        $this->info("  Failed events (older than {$keepFailedDays} days): {$failedEventsToDelete}");
        $this->info("  Received events (older than {$days} days): {$receivedEventsToDelete}");
        $this->info("  Total: {$totalToDelete}");

        if ($dryRun) {
            $this->warn("\n[DRY RUN] No events will be actually deleted.");
            return 0;
        }

        if (!$this->confirm("\nDo you want to continue with the cleanup?")) {
            $this->info('Cleanup cancelled.');
            return 0;
        }

        $totalDeleted = 0;

        // Delete processed events
        if ($processedEventsToDelete > 0) {
            $this->info("\nDeleting processed events...");
            $deleted = $this->deleteInBatches(
                WebhookEvent::where('status', 'processed')->where('created_at', '<', $cutoffDate),
                $batchSize
            );
            $totalDeleted += $deleted;
            $this->info("Deleted {$deleted} processed events.");
        }

        // Delete failed events
        if ($failedEventsToDelete > 0) {
            $this->info("\nDeleting failed events...");
            $deleted = $this->deleteInBatches(
                WebhookEvent::whereIn('status', ['failed', 'error'])->where('created_at', '<', $failedCutoffDate),
                $batchSize
            );
            $totalDeleted += $deleted;
            $this->info("Deleted {$deleted} failed events.");
        }

        // Delete received events (likely stuck)
        if ($receivedEventsToDelete > 0) {
            $this->info("\nDeleting stuck received events...");
            $deleted = $this->deleteInBatches(
                WebhookEvent::where('status', 'received')->where('created_at', '<', $cutoffDate),
                $batchSize
            );
            $totalDeleted += $deleted;
            $this->info("Deleted {$deleted} stuck received events.");
        }

        $this->info("\nCleanup completed. Total events deleted: {$totalDeleted}");

        // Show remaining counts
        $remainingCounts = WebhookEvent::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $this->info("\nRemaining webhook events:");
        foreach ($remainingCounts as $status => $count) {
            $this->info("  {$status}: {$count}");
        }

        return 0;
    }

    /**
     * Delete records in batches to avoid memory issues.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $batchSize
     * @return int
     */
    private function deleteInBatches($query, int $batchSize): int
    {
        $totalDeleted = 0;
        $progressBar = $this->output->createProgressBar($query->count());

        do {
            $deleted = $query->limit($batchSize)->delete();
            $totalDeleted += $deleted;
            $progressBar->advance($deleted);

            // Small delay to prevent overwhelming the database
            if ($deleted > 0) {
                usleep(10000); // 10ms
            }
        } while ($deleted > 0);

        $progressBar->finish();
        $this->line('');

        return $totalDeleted;
    }
}
