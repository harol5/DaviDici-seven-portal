@extends('layout')
@section('content')
<div class="main-content-wrapper">
    <div class="gretting-search-wrapper">
        <h1 class="greeting">Good Afternoon {{auth()->user()->name}}</h1>
        <input class="search-order-input" type="search" placeholder="Search Order..."/>
    </div>

    @if(count($orders) === 0)
        <p id="empty-orders-message">orders not found!. To report any issues, please contact support</p>
    @else
        <p id="empty-orders-message" class="search-result">orders not found!</p>
        <div class="orders-wrapper">
            @foreach($orders as $order)
            <x-order-card :order="$order" />
            @endforeach
        </div>
    @endif

</div>
<script src="{{ asset('js/order-page.js') }}" defer></script>   
@endsection