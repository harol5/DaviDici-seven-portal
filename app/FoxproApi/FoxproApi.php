<?php

namespace App\FoxproApi;

use Illuminate\Support\Facades\Http;

class FoxproApi{
    public static function call($options){
        $request_origin = env('FOXPRO_REQUEST_ORIGIN_URL'); 
        $api_url = env('FOXPRO_API_URL');
        $api_user = env('FOXPRO_API_USER');
        $api_secret = env('FOXPRO_API_SECRET');
        $js_data = json_encode($options);

        $response = Http::withHeaders([
            'Origin' => $request_origin,
            'Authorization' => 'Basic ' . base64_encode($api_user . ':' . $api_secret),
        ])->withBody($js_data,'application/json')->get($api_url);

        self::formatResponse($response->json());
        
        return $response->json();
    }

    public static function formatResponse($object){
        $cols = $object['cols'];
        $rows = $object['rows'];
        // TODO: must format the return value from the api like key/value pairs.
        dd($object);
    }
}