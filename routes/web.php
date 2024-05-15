<?php

use Inertia\Inertia;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrdersController;

Route::get('/', [UserController::class, 'login'])->name('login');

Route::post('/auth', [UserController::class, 'authenticate']);

Route::middleware(['auth','auth.session'])->group(function () {
    // Only admin routes.
    Route::get('/register', [UserController::class, 'register']);
    Route::post('/users', [UserController::class, 'create']);

    // Orders routes - read operations.
    Route::get('/orders', [OrdersController::class, 'all']);
    Route::get('/orders/create-so-num', [OrdersController::class, 'createOrderNumber']); // comming from davidici pricelist.
    Route::get('/orders/{orderNumber}/overview', [OrdersController::class, 'orderOverview']);
    Route::get('/orders/{orderNumber}/details', [OrdersController::class, 'orderDetails'])->name('order.details');
    Route::get('/orders/{orderNumber}/delivery', [OrdersController::class, 'orderDelivery']);
    Route::get('/orders/{orderNumber}/payment', [OrdersController::class, 'orderPayment']);

    // Orders routes - create operations.    
    Route::post('/orders/create', [OrdersController::class, 'createOrder']);
    Route::post('/orders/{orderNumber}/products/update', [OrdersController::class, 'updateQuantity']);
    Route::post('/orders/{orderNumber}/products/delete', [OrdersController::class, 'deleteProduct']);
    Route::post('/orders/{orderNumber}/products/delivery', [OrdersController::class, 'saveDeliveryInfo']);
    Route::post('/orders/{orderNumber}/products/payment', [OrdersController::class, 'createCharge']);

    // Inventory routes.
    Route::get('/inventory', function(){
        // return view('inventory.inventory');
        return Inertia::render("Inventory/Inventory");
    });

    // Others
    Route::post('/logout', [UserController::class, 'logout']);
});

//===========TESTING ROUTES================//

Route::get('/testing', [OrdersController::class, 'testApi']);

Route::get('/csrf', function(){
    return view("users/register");
});
Route::post('/csrf/testing', function(Request $request){
    dd($request->all());
    return view("users/register");
});