<?php

namespace Webkul\MercadoPago\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        Event::listen('sales.invoice.save.after', 'Webkul\MercadoPago\Listeners\Transaction@saveTransaction');
    }
}
