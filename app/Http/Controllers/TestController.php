<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TestController extends Controller
{
    public function getItems(){
        $response = Http::get('https://jsonplaceholder.typicode.com/posts');
        $items = $response->json();

        return view('test.index',['posts'=>$items]);
    }
    public function getVanityParts(){
        $request_origin = env('FOXPRO_REQUEST_ORIGIN_URL'); 
        $api_url = env('FOXPRO_API_URL');
        $api_user = env('FOXPRO_API_USER');
        $api_secret = env('FOXPRO_API_SECRET');

        $data = [
            'action' => 'GetProductPrice',
            'params' => ['Cheskie_celnycorp$g','71-WU-012-M03-V03'],
            'keep_session' => false,
        ];
        $js_data = json_encode($data);

        $response = Http::withHeaders([
            'Origin' => $request_origin,
            'Authorization' => 'Basic ' . base64_encode($api_user . ':' . $api_secret),
        ])->withBody($js_data,'application/json')->get($api_url);
        
        $items = $response->json();
        dd($response);
    }

    public function reactPage(){
        return Inertia::render('Users/Login');
    }
}
