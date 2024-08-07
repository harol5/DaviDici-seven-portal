<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\FoxproApi\FoxproApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Http;


class ExpressProgramController extends Controller
{
    public function all(Request $request){
        $message = $request->session()->get('message');
        
        // call foxpro program to get items in stock
        $response = FoxproApi::call([
            'action' => 'GETINVSTOCK',
            'params' => ['','',''],
            'keep_session' => false,
        ]);
                
                        
        if($response['status'] === 201){
            return Inertia::render('ExpressProgram/ProductsAvailable',
                [                    
                    'rawProducts' => $response['rows'],
                    'message' => $message                   
                ]
            );
        }
        
        logFoxproError('getStockProducts','all', ['param1'], $response);
        return back()->with(['message' => 'Something went wrong. please contact support']);
                
    }

    public function setProduct(Request $request){
        $composition = $request->all();        
        return redirect()->route('expressProgram.product', ['product' => $composition['name']])->with(['data' => $composition]);
    }

    public function productConfigurator(Request $request){
        $composition = $request->session()->get('data');   
        
        if(!$composition) {
            return redirect('/express-program')->with('message', 'Product expired!!!');
        }

        return Inertia::render('ExpressProgram/ProductConfigurator',
            [                    
                'composition' => $composition,                     
            ]
        );
    }
}