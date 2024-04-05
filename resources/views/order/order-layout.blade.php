@extends('layout')
@section('content')
<div class="main-content-wrapper -order">
    <div class="order-options-menu-wrapper">
        <ul>
            <li class="options"><a href="/orders/{{$order['ordernum']}}/overview">Overview</a></li>
            <li class="options"><a href="/orders/{{$order['ordernum']}}/details">Order details</a></li>
            <li class="options"><a href="/orders/{{$order['ordernum']}}/delivery">Delivery options</a></li>
            <li class="options"><a href="/orders/{{$order['ordernum']}}/payment">Payment details</a></li>
        </ul>
    </div>
    <div class="order-main-content-wrapper">
        <div class="order-header-wrapper">
            <div class="order-number-wrapper">
                <h1>Order Number:</h1>
                <span>{{$order['ordernum']}}</span>
            </div>
            <div class="order-buttons-wrapper">
                <button>print order</button>
                <button>approve order</button>
            </div>
        </div>
        <div class="order-body-wrapper">
            @yield('order-body')
        </div>
    </div>
</div>    
@endsection