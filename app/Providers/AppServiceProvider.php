<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

// -- PRACTICING MIDDLEWRE AND SERVICE CONTAINER BINDINGS -- MUST DELETE!!!! --
use App\Services\TestingService;
use App\Services\TestingServiceTwo;
use Illuminate\Http\Request;
// ----

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->singleton(TestingService::class, function ($app) {
            return new TestingService(new Request(), new TestingServiceTwo());
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('create-user', function (User $user) {
            return $user->role === 3478;
        });

        Gate::define('create-salesperson', function (User $user) {
            return $user->role === 3478 || $user->role === 1919;
        });

        Gate::define('update-salesperson', function (User $user) {
            return $user->role === 3478 || $user->role === 1919 || $user->role === 1950;
        });
    }
}
