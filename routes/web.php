<?php

use Inertia\Inertia;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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
    Route::get('/orders/create-so-num', [OrdersController::class, 'createOrderNumber']); // coming from davidici pricelist.
    Route::get('/orders/{orderNumber}/products', [OrdersController::class, 'getProducts']);
    Route::get('/orders/{orderNumber}/overview', [OrdersController::class, 'orderOverview']);
    Route::get('/orders/{orderNumber}/details', [OrdersController::class, 'orderDetails'])->name('order.details');
    Route::get('/orders/{orderNumber}/delivery', [OrdersController::class, 'orderDelivery']);
    Route::get('/orders/{orderNumber}/payment', [OrdersController::class, 'orderPayment']);

    // Orders routes - create operations.    
    Route::post('/orders/create', [OrdersController::class, 'createOrder']);
    Route::post('/orders/{orderNumber}/products/update', [OrdersController::class, 'updateQuantity']);
    Route::post('/orders/{orderNumber}/products/note', [OrdersController::class, 'updateProductNote']);
    Route::post('/orders/{orderNumber}/products/model', [OrdersController::class, 'updateProductModel']);
    Route::post('/orders/{orderNumber}/products/delete', [OrdersController::class, 'deleteProduct']);
    Route::post('/orders/{orderNumber}/products/delivery', [OrdersController::class, 'saveDeliveryInfo']);
    Route::post('/orders/{orderNumber}/products/payment', [OrdersController::class, 'createCharge']);
    Route::post('/orders/{orderNumber}/products/payment-bank', [OrdersController::class, 'createBankCharge']);
    Route::post('/orders/{orderNumber}/products/payment-bank/status', [OrdersController::class, 'getStatusCheck']);

    // Inventory routes.
    Route::get('/inventory', function(){
        // return view('inventory.inventory');
        return Inertia::render("Inventory/Inventory");
    });

    // Others
    Route::post('/logout', [UserController::class, 'logout']);
});

//===========TESTING ROUTE================//
Route::get('/testing', [OrdersController::class, 'testApi']);

