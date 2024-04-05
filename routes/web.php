<?php

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrdersController;

Route::get('/', [UserController::class, 'login'])->name('login');
Route::post('/auth', [UserController::class, 'authenticate']);
Route::middleware(['auth','auth.session'])->group(function () {
    // Only admin routes
    Route::get('/register', [UserController::class, 'register']);
    Route::post('/users', [UserController::class, 'create']);
    // Orders routes
    Route::get('/orders', [OrdersController::class, 'all']);
    Route::get('/orders/{orderNumber}/overview', [OrdersController::class, 'orderOverview']);
    Route::get('/orders/{orderNumber}/details', [OrdersController::class, 'orderDetails']);
    Route::get('/orders/{orderNumber}/delivery', [OrdersController::class, 'orderDelivery']);
    Route::get('/orders/{orderNumber}/payment', [OrdersController::class, 'orderPayment']);
    // Inventory routes
    Route::get('/inventory', function(){
        return view('inventory.inventory');
    });
    // Others
    Route::post('/logout', [UserController::class, 'logout']);
});


//=======routes for testing==========//
Route::get('/hello',function(){
    return response('<h1>hello world</h1>',200)
        ->header('Content-Type', 'text/plain');
});
Route::get('post/{id}', function($id){
    return response('Post ' . $id);
})->where('id','[0-9]+');
Route::get('search',function(Request $request){
    return $request->name . ' ' . $request->city;
});
Route::get('/test-api', [TestController::class, 'getVanityParts']);