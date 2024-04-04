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
        FoxproApi::call([
            'action' => 'GetOrdersByUser',
            'params' => [$username],
            'keep_session' => false,
        ]);
        return view('orders.orders');
    }

    // Show single order overview.
    public function orderOverview(){
        return view('order.order-overview');
    }

    // Show single order details.
    public function orderDetails(){
        return view('order.order-details');
    }

    // Show single order delivery form.
    public function orderDelivery(){
        return view('order.order-delivery');
    }

    // Show single order payment form.
    public function orderPayment(){
        return view('order.order-payment');
    }
}

