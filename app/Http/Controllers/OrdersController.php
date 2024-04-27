<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\FoxproApi\FoxproApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OrdersController extends Controller
{
    // Show all orders.    
    public function all(Request $request){
        $username = auth()->user()->username;
        $message = $request->session()->get('message');
        $data = FoxproApi::call([
            'action' => 'getordersbyuser',
            'params' => [$username],
            'keep_session' => false,
        ]);
        // dd($data);
        if($data['status'] === 500){
            // assings an empty array so template can display proper message.
            $data['rows'] = []; 
        }
        return Inertia::render('Orders/Orders',['orders' => $data['rows'], 'message' => $message]);
    }

    // Show single order overview.
    public function orderOverview(Request $request){
        // throw 404 if order number does not exist

        $username = auth()->user()->username;
        $order = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());        
        $products = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        return Inertia::render('Orders/OrderOverview',['order' => $order, 'products' => $products['rows']]);
    }

    
    // Show single order details.
    public function orderDetails(Request $request){
        // throw 404 if order number does not exist
        $username = auth()->user()->username;
        $order = $request->all();
        
        $orderNumber = getOrderNumberFromPath($request->path());      
        
        // Error: undefined rows?
        $products = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        return Inertia::render('Orders/OrderDetails',['rawOrder' => $order, 'rawProducts' => $products['rows']]);
    }

    // Update quantity product
    public function updateQuantity(Request $request){
        $product = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());
        $res = FoxproApi::call([
            'action' => 'ChangeOrderQty',
            'params' => [$orderNumber,$product['uscode'],$product['linenum'],$product['qty']],
            'keep_session' => false, 
        ]);

        return response($res)->header('Content-Type', 'application/json');
    }

    // Delete product
    public function deleteProduct(Request $request){
        $req = $request->all(); 
        $product = $req['product'];
        $numOfProducts = $req['numOfProduct'];        
        $orderNumber = getOrderNumberFromPath($request->path());
        
        $res = FoxproApi::call([
            'action' => 'DELETELINE',
            'params' => [$orderNumber, $product['uscode'], $product['linenum'], $product['qty']],
            'keep_session' => false, 
        ]);

        if($numOfProducts === 1 ){
            return redirect('/orders')->with('message', 'Order Number ' . $orderNumber . ' deleted!!');
        }else{
            return response($res)->header('Content-Type', 'application/json');        
        }        
    }

    // Show single order delivery form. 
    public function orderDelivery(Request $request){
        // throw 404 if order number does not exist
        $order = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());

        // Error: undefined rows?
        $products = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        // TODO: get delivery info if any.

        return Inertia::render('Orders/OrderDelivery',['order' => $order, 'products' => $products['rows']]);
    }

    // Save delivery info into foxpro.
    public function saveDeliveryInfo(Request $request){
        $formFields = $request->validate([
            'address' => 'required',
            'cellphoneNumber' => 'required',
            'city' => 'required',
            'contactName' => 'required',
            'customerEmail' => ['required','email'],
            'customerName' => 'required',            
            'deliveryType' => 'required',
            'state' => 'required',
            'telephoneNumber' => 'required',
            'wholesalerEmail' => 'required',
            'zipCode' => 'required'
        ]);

        return redirect('/orders')->with('message', 'info saved!!');
    }

    // Show single order payment form.
    public function orderPayment(Request $request){
        // throw 404 if order number does not exist
        $order = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());
        return Inertia::render('Orders/OrderPayment',['order' => $order]);
    }


    public function testApi(){
        $response = FoxproApi::call([
            'action' => 'OrderEnter',
            'params' => ['HarolE$Davidici_com','HAR000002','71-VB-024-M03-V03**1~71-VB-024-M03-V15**2~71-TU-012-M03-V23**3~18-048-2S-T2!!ELORA**1~'],
            'keep_session' => false, 
        ]);

        return Inertia::render('Test',['response' => $response]);
    }
}

