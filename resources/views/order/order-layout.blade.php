@php
$order = [
    'number' => 'SO00001'
]
@endphp

@extends('layout')
@section('content')
<div class="main-content-wrapper -order">
    <div class="order-options-menu-wrapper">
        <ul>
            <li class="options"><a href="/orders/{{$order['number']}}/overview">Overview</a></li>
            <li class="options"><a href="/orders/{{$order['number']}}/details">Order details</a></li>
            <li class="options"><a href="/orders/{{$order['number']}}/delivery">Delivery options</a></li>
            <li class="options"><a href="/orders/{{$order['number']}}/payment">Payment details</a></li>
        </ul>
    </div>
    <div class="order-main-content-wrapper">
        <div class="order-header-wrapper">
            <div class="order-number-wrapper">
                <h1>Order Number:</h1>
                <span>SO#00001</span>
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