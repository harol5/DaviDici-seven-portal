<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('admin-only', function (User $user) {
            return $user->role === 3478;
        });

        Gate::define('create-user', function (User $user) {
            return $user->role === 3478;
        });

        Gate::define('generate-token', function (User $user) {
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
