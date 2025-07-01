<?php

namespace Webkul\MercadoPago\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Webkul\Sales\Models\Order;

class WebhookEvent extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mercadopago_webhook_events';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'webhook_id',
        'event_type',
        'action',
        'payload',
        'headers',
        'ip_address',
        'user_agent',
        'status',
        'order_id',
        'payment_id',
        'processed_at',
        'processing_time',
        'response_data',
        'error_message',
        'received_at',
        'retry_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'payload' => 'array',
        'headers' => 'array',
        'response_data' => 'array',
        'received_at' => 'datetime',
        'processed_at' => 'datetime',
        'processing_time' => 'float',
        'retry_count' => 'integer',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'received_at',
        'processed_at',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the order associated with this webhook event.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Scope a query to only include events of a specific type.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $eventType
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, string $eventType)
    {
        return $query->where('event_type', $eventType);
    }

    /**
     * Scope a query to only include events with a specific status.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include unprocessed events.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUnprocessed($query)
    {
        return $query->whereIn('status', ['received', 'error']);
    }

    /**
     * Scope a query to only include failed events.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Get the formatted processing time in milliseconds.
     *
     * @return string
     */
    public function getFormattedProcessingTimeAttribute(): string
    {
        return $this->processing_time ? number_format($this->processing_time, 2) . 'ms' : 'N/A';
    }

    /**
     * Check if the event was processed successfully.
     *
     * @return bool
     */
    public function isProcessed(): bool
    {
        return $this->status === 'processed';
    }

    /**
     * Check if the event failed to process.
     *
     * @return bool
     */
    public function isFailed(): bool
    {
        return in_array($this->status, ['failed', 'error']);
    }

    /**
     * Mark the event as processed.
     *
     * @param array $responseData
     * @param float $processingTime
     * @return bool
     */
    public function markAsProcessed(array $responseData = [], float $processingTime = 0): bool
    {
        return $this->update([
            'status' => 'processed',
            'processed_at' => now(),
            'response_data' => $responseData,
            'processing_time' => $processingTime,
        ]);
    }

    /**
     * Mark the event as failed.
     *
     * @param string $errorMessage
     * @param float $processingTime
     * @return bool
     */
    public function markAsFailed(string $errorMessage, float $processingTime = 0): bool
    {
        return $this->update([
            'status' => 'failed',
            'error_message' => $errorMessage,
            'processing_time' => $processingTime,
            'retry_count' => $this->retry_count + 1,
        ]);
    }
}
