<?php

namespace Caffelia\ShopTheme\Providers;

use Illuminate\Pagination\Paginator;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Webkul\Core\Http\Middleware\PreventRequestsDuringMaintenance;

class CaffeliaShopThemeServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->registerConfig();
    }

    /**
     * Bootstrap services.
     */
    public function boot(Router $router): void
    {
        // Load our custom views with the caffelia-shop namespace
        $this->loadViewsFrom(__DIR__.'/../Resources/views', 'caffelia-shop');

        // Load translations with caffelia-shop namespace
        $this->loadTranslationsFrom(__DIR__.'/../Resources/lang', 'caffelia-shop');

        // Register Blade components with caffelia-shop namespace
        Blade::anonymousComponentPath(__DIR__.'/../Resources/views/components', 'caffelia-shop');

        // Register our custom event service provider
        $this->app->register(EventServiceProvider::class);
    }

    /**
     * Register package config.
     */
    protected function registerConfig(): void
    {
        $this->mergeConfigFrom(
            dirname(__DIR__).'/Config/menu.php',
            'menu.customer'
        );
    }
}
