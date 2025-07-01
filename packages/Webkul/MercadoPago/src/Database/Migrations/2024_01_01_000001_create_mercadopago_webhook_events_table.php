<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mercadopago_webhook_events', function (Blueprint $table) {
            $table->id();
            $table->string('webhook_id')->unique()->index();
            $table->string('event_type')->index();
            $table->string('action')->nullable()->index();
            $table->json('payload');
            $table->json('headers')->nullable();
            $table->string('ip_address')->nullable()->index();
            $table->text('user_agent')->nullable();
            $table->enum('status', ['received', 'processed', 'failed', 'error'])->default('received')->index();
            $table->unsignedBigInteger('order_id')->nullable()->index();
            $table->string('payment_id')->nullable()->index();
            $table->timestamp('received_at')->index();
            $table->timestamp('processed_at')->nullable()->index();
            $table->decimal('processing_time', 8, 2)->nullable()->comment('Processing time in milliseconds');
            $table->json('response_data')->nullable();
            $table->text('error_message')->nullable();
            $table->integer('retry_count')->default(0);
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');

            // Indexes for better performance
            $table->index(['event_type', 'status']);
            $table->index(['received_at', 'status']);
            $table->index(['payment_id', 'event_type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mercadopago_webhook_events');
    }
};
