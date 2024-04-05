@props(['order'])
@php
if($order['status'] === ''){
    $order['status'] = "to be determined";
}
@endphp

<div class="order-container" id="{{$order['ordernum']}}">
    <div class="order">
        <h2>{{$order['ordernum']}}</h2>
        <div class="order-details-wrapper">
            <span>
                <h2>Status:</h2>
                <p>{{$order['status']}}</p>
            </span>
            <span>
                <h2>Sub-total:</h2>
                <p>${{$order['subtotal']}}</p>
            </span>
            <span>
                <h2>Order date:</h2>
                <p>{{$order['orderdate']}}</p>
            </span>
            <span>
                <h2>Total Credit:</h2>
                <p>${{$order['totcredit']}}</p>
            </span>
            <span>
                <h2>Submitted date:</h2>
                <p>{{$order['submitted']}}</p>
            </span>
            <span>
                <h2>Total:</h2>
                <p>${{$order['total']}}</p>
            </span>
        </div>
        <a href="/orders/{{$order['ordernum']}}/overview">View Order</a>
    </div>
</div>