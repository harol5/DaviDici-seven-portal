<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\FoxproApi\FoxproApi;
use App\Models\ModelCompositionImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;


class ExpressProgramController extends Controller
{
    public function all(Request $request){
        $message = $request->session()->get('message');
        $input = $request->all();
        $listingType;

        array_key_exists('listing-type',$input) ? $listingType = $input['listing-type'] : $listingType = 'fullInventory';
        
        // call foxpro program to get items in stock
        $response = FoxproApi::call([
            'action' => 'GETINVSTOCK',
            'params' => ['','','','S'],
            'keep_session' => false,
        ]);
                                                                    
        if($response['status'] === 201){
            return Inertia::render('ExpressProgram/ProductsAvailable',
                [                       
                    'rawProducts' => $response['rows'],
                    'message' => $message,
                    'listingType' => $listingType,                 
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

    public function getShoppingCart(Request $request) {
        $shoppingCartProducts;
        if($request->user()) {            
            $shoppingCart = DB::table('shopping_cart')->where('user_id', $request->user()->id)->first();
            $shoppingCartProducts = $shoppingCart ? json_decode($shoppingCart->products) : [];            
        }else {
            $shoppingCartProducts = [];
            // return redirect("/")->with('location','express-program');
        }        
        
        return response(['shoppingCartProducts' => $shoppingCartProducts, 'status' => 201])->header('Content-Type', 'application/json');
    }

    public function updateShoppingCart(Request $request) {

        if(!$request->user()) {
            return response(['message' => 'no user', 'status' => 500])->header('Content-Type', 'application/json');
        }

        DB::table('shopping_cart')
            ->updateOrInsert(
                ['user_id' => $request->user()->id],
                ['products' => $request->getContent()]
            );
            
        return response(['message' => 'shopping cart updated', 'status' => 201])->header('Content-Type', 'application/json');
    }

    public function fileForm(){
        return Inertia::render('Media');
    }

    public function storeImages(Request $request) {
        $request->validate([
            'model' => 'required|string',
            'images.*' => 'required|image|mimes:webp|max:2048',
        ]);

        // Handle the uploaded files
        $uploadedFiles = $request->file('images');
        $uploadedPaths = [];

        foreach ($uploadedFiles as $file) {                        
            $name = $file->getClientOriginalName();      
            $path = $file->store('/images/express_program','public');
            // $path = $file->store('/images/resource', ['disk' => 'my_files']);

            ModelCompositionImage::create([
                'composition_name' => $name,
                'model' => $request->all()['model'],
                'image_url' => $path,
            ]);
            $uploadedPaths[] = $path;
        }

        // Return a response
        return response()->json([
            'message' => 'Files uploaded successfully',
            'uploadedPaths' => $uploadedPaths,
        ]);
    }

    public function getModelCompositionImages(Request $request) {
        $model = $request->all()['model'];
        $images = ModelCompositionImage::select('composition_name','image_url')->where('model', $model)->orderBy('composition_name')->get();

        return response()->json([
            'images' => $images,            
        ]); 
    }
}