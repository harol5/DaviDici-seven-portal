<?php

use App\Http\Controllers\ExpressProgramController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/hello-world', function (Request $request) {
    return response(['message' => 'hello world'])->header('Content-Type', 'application/json');
})->middleware('auth:sanctum');

Route::post('/user/update-pwd', [UserController::class, 'updatePassword'])->middleware('auth:sanctum');

Route::get('/express-program/composition-images',[ExpressProgramController::class, 'getModelCompositionImages']);
