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

        $data = $response->json();
    
        if(array_key_exists('Result',$data)){
            return $data;
        }
        
        if(!$data || !array_key_exists('cols',$data) || !array_key_exists('rows',$data) || $data['recordcount'] === 0){
            //TODO: you must log error for debugging.
            return ['status' => 500, 'message' => 'error requesting data from foxpro'];
        }

        return self::formatResponse($data);
    }

    public static function formatResponse($object){
        $cols = $object['cols'];
        $rows = $object['rows'];
        
        $records = [];
        foreach($rows as $row){
            $record = [];
            foreach($row as $index => $value){
                $record[$cols[$index]] = $value;
            }
            $records[] = $record;
        }

        $object['rows'] = $records;
        $object['status'] = 201;
        
        return $object;
    }
}