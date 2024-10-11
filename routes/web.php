<?php

use Inertia\Inertia;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ExpressProgramController;

Route::get('/', [UserController::class, 'login'])->name('login');

Route::post('/auth', [UserController::class, 'authenticate']);

// Only admin routes or by signed url.
Route::get('/register', [UserController::class, 'register'])->name('user.register');
Route::post('/users', [UserController::class, 'create']);
Route::get('/users/welcome', [UserController::class, 'welcome']);

// Express Program routes
Route::get('/express-program', [ExpressProgramController::class, 'all']);
Route::post('/express-program/set-product', [ExpressProgramController::class, 'setProduct']);
Route::get('/express-program/{product}', [ExpressProgramController::class, 'productConfigurator'])->name('expressProgram.product');
Route::get('/express-program/shopping-cart/products', [ExpressProgramController::class, 'getShoppingCart']);
Route::post('/express-program/shopping-cart/update', [ExpressProgramController::class, 'updateShoppingCart']);

Route::middleware(['auth','auth.session'])->group(function () {

    // Admin only endpoints.
    Route::post('/users/invite', [UserController::class, 'sendInvitation']);
    Route::get('/users/change-password', [UserController::class, 'showFormChangePassword']);
    Route::post('/users/change-password/handle', [UserController::class, 'ChangePassword']);
    Route::get('/users/add-to-portal', [UserController::class, 'showFormAddUserToPortal']);
    Route::post('/users/add-to-portal/add', [UserController::class, 'addUserToPortal']);
    Route::get('/media', [ExpressProgramController::class, 'fileForm']);
    Route::post('/media/upload-images', [ExpressProgramController::class, 'storeImages']);

    // Owner only endpoints.    
    Route::get('/register/salesperson', [UserController::class, 'registerSalesPerson'])->name('user.register.salesperson');
    Route::post('/users/salesperson', [UserController::class, 'createSalesPerson']);

    // Salesperson endpoints.
    Route::get('/salesperson/update', [UserController::class, 'updateSalesPersonForm'])->name('user.update.salesperson');
    Route::post('/salesperson/update', [UserController::class, 'updateSalesPersonInfo']);

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
        return Inertia::render("Inventory/Inventory");
    });

    // Others
    Route::post('/logout', [UserController::class, 'logout']);
});

//===========TESTING ROUTE================//
Route::get('/testing', [OrdersController::class, 'testApi']);

