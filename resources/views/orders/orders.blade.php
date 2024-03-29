@extends('layout')
@section('content')
<div class="main-content-wrapper">
    <div class="gretting-search-wrapper">
        <h1 class="greeting">Good Afternoon David</h1>
        <input class="search-order-input" type="search" placeholder="Search Order..."/>
    </div>
    <div class="orders-wrapper">
        <x-order-card />
        <x-order-card />
        <x-order-card />
        <x-order-card />
        <x-order-card />
    </div>
</div>    
@endsection