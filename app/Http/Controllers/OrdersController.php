<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrdersController extends Controller
{
    // Show all orders.    
    public function all(){
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

