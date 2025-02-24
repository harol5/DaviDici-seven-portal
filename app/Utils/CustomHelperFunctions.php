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

if(! function_exists('logErrorDetails')) {
    function logErrorDetails($funcName, $controller, $description, $details, $user ){
        Log::error("=VVVVV=== ERROR at FUNCTION: $funcName, controller: $controller ====VVVVV");
        Log::error("----- user ----");
        Log::error($user);
        Log::error("----- description ----");
        Log::error($description);
        Log::error("----- details ----");
        Log::error($details);
    }
}

if(! function_exists('transformNullsToEmptyStrings')) {
    function transformNullsToEmptyStrings($data) {
        // Iterate through the data and replace null values recursively
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                // Recursively process nested arrays
                $data[$key] = transformNullsToEmptyStrings($value);
            } elseif (is_null($value)) {
                // Replace null with an empty string
                $data[$key] = '';
            }
        }
        return $data;
    }
}
