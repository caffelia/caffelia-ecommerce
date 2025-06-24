<?php

namespace Caffelia\ShopTheme\Providers;

use Illuminate\Pagination\Paginator;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Webkul\Core\Http\Middleware\PreventRequestsDuringMaintenance;
use Webkul\Shop\Http\Middleware\AuthenticateCustomer;
use Webkul\Shop\Http\Middleware\CacheResponse;
use Webkul\Shop\Http\Middleware\Currency;
use Webkul\Shop\Http\Middleware\Locale;
use Webkul\Shop\Http\Middleware\Theme;

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
        // Register middleware group for our theme
        $router->middlewareGroup('caffelia-shop', [
            Theme::class,
            Locale::class,
            Currency::class,
        ]);

        // Alias middleware
        $router->aliasMiddleware('theme', Theme::class);
        $router->aliasMiddleware('locale', Locale::class);
        $router->aliasMiddleware('currency', Currency::class);
        $router->aliasMiddleware('cache.response', CacheResponse::class);
        $router->aliasMiddleware('customer', AuthenticateCustomer::class);

        // Load routes if they exist
        if (file_exists(__DIR__.'/../Routes/web.php')) {
            Route::middleware(['web', 'shop', PreventRequestsDuringMaintenance::class])->group(__DIR__.'/../Routes/web.php');
        }

        if (file_exists(__DIR__.'/../Routes/api.php')) {
            Route::middleware(['web', 'shop', PreventRequestsDuringMaintenance::class])->group(__DIR__.'/../Routes/api.php');
        }

        // Load migrations if they exist
        if (is_dir(__DIR__.'/../Database/Migrations')) {
            $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');
        }

        // Load translations with caffelia-shop namespace
        $this->loadTranslationsFrom(__DIR__.'/../Resources/lang', 'caffelia-shop');

        // Load our custom views with the caffelia-shop namespace
        $this->loadViewsFrom(__DIR__.'/../Resources/views', 'caffelia-shop');

        // Set pagination views to use caffelia-shop theme views if they exist
        if (view()->exists('caffelia-shop::partials.pagination')) {
            Paginator::defaultView('caffelia-shop::partials.pagination');
            Paginator::defaultSimpleView('caffelia-shop::partials.pagination');
        }

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
        // Merge menu configuration
        if (file_exists(dirname(__DIR__).'/Config/menu.php')) {
            $this->mergeConfigFrom(
                dirname(__DIR__).'/Config/menu.php',
                'menu.customer'
            );
        }

        // Merge any additional theme configuration
        if (file_exists(dirname(__DIR__).'/Config/theme.php')) {
            $this->mergeConfigFrom(
                dirname(__DIR__).'/Config/theme.php',
                'themes.caffelia-shop'
            );
        }
    }
}
