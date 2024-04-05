<?php

namespace App\Http\Controllers;

use App\FoxproApi\FoxproApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OrdersController extends Controller
{
    // Show all orders.    
    public function all(){
        $username = auth()->user()->username;
        $data = FoxproApi::call([
            'action' => 'getordersbyuser',
            'params' => [$username],
            'keep_session' => false,
        ]);
        if($data['status'] === 500){
            // assings an empty array so template can display proper message.
            $data['rows'] = []; 
        }
        return view('orders.orders',['orders' => $data['rows']]);
    }

    // Show single order overview.
    public function orderOverview(Request $request){
        // throw 404 if order number does not exist
        $orderNumber = getOrderNumberFromPath($request->path());
        return view('order.order-overview',['order' => ['ordernum' => $orderNumber]]);
    }

    // Show single order details.
    public function orderDetails(Request $request){
        // throw 404 if order number does not exist
        $orderNumber = getOrderNumberFromPath($request->path());
        return view('order.order-details',['order' => ['ordernum' => $orderNumber]]);
    }

    // Show single order delivery form.
    public function orderDelivery(Request $request){
        // throw 404 if order number does not exist
        $orderNumber = getOrderNumberFromPath($request->path());
        return view('order.order-delivery',['order' => ['ordernum' => $orderNumber]]);
    }

    // Show single order payment form.
    public function orderPayment(Request $request){
        // throw 404 if order number does not exist
        $orderNumber = getOrderNumberFromPath($request->path());
        return view('order.order-payment',['order' => ['ordernum' => $orderNumber]]);
    }

}

