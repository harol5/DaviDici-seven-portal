<?php

use Illuminate\Support\Facades\Log;

if(! function_exists('getOrderNumberFromPath')) {
    function getOrderNumberFromPath($path){
        $pathSections = explode("/",$path);
        return $pathSections[1];
    }
}

if(! function_exists('logFoxproError')) {
    function logFoxproError($funcName, $controller, $params, $response ){
        Log::error("=VVVVV=== ERROR REQUESTING DATA FROM FOXPRO. function: $funcName, controller: $controller ====VVVVV");
        Log::error("----- params ----");
        Log::error($params);
        Log::error("----- response ----");
        Log::error($response);
    }
}
