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
        $orderNumber = getOrderNumberFromPath($request->path());
        $data = FoxproApi::call([
            'action' => 'getordersbyuser',
            'params' => [$username],
            'keep_session' => false,
        ]);
        $products = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);

        $order;
        foreach($data['rows'] as $row){
            if ( $row['ordernum'] === $orderNumber ) {
                $order = $row;
                break;
            }
        }

        return Inertia::render('Orders/OrderOverview',['order' => $order, 'products' => $products['rows']]);
    }

    
    // Show single order details.
    public function orderDetails(Request $request){
        // throw 404 if order number does not exist
        $username = auth()->user()->username;
        $orderNumber = getOrderNumberFromPath($request->path());
        $data = FoxproApi::call([
            'action' => 'getordersbyuser',
            'params' => [$username],
            'keep_session' => false,
        ]);
        $products = FoxproApi::call([
            'action' => 'GetSoStatus',
            'params' => [$orderNumber],
            'keep_session' => false,
        ]);
        
        $order;
        foreach($data['rows'] as $row){
            if ( $row['ordernum'] === $orderNumber ) {
                $order = $row;
                break;
            }
        }
        return Inertia::render('Orders/OrderDetails',['order' => $order, 'products' => $products['rows']]);
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
        $product = $request->all();
        $orderNumber = getOrderNumberFromPath($request->path());
        $res = FoxproApi::call([
            'action' => 'DELETELINE',
            'params' => [$orderNumber, $product['uscode'], $product['linenum'], $product['qty']],
            'keep_session' => false, 
        ]);

        return redirect()->route('order.details',['orderNumber' => $orderNumber]);
    }

    // Show single order delivery form.
    public function orderDelivery(Request $request){
        // throw 404 if order number does not exist
        $orderNumber = getOrderNumberFromPath($request->path());
        return Inertia::render('Orders/OrderDelivery',['order' => ['ordernum' => $orderNumber]]);
    }

    // Show single order payment form.
    public function orderPayment(Request $request){
        // throw 404 if order number does not exist
        $orderNumber = getOrderNumberFromPath($request->path());
        return Inertia::render('Orders/OrderPayment',['order' => ['ordernum' => $orderNumber]]);
    }



    public function testApi(){
        $products = FoxproApi::call([
            'action' => 'DELETELINE',
            'params' => ['HAR000002','18-024-T2','1','1'],
            'keep_session' => false, 
        ]);
    }
}

