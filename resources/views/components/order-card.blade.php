@php
$order = [
    'number' => 'SO00001'
]
@endphp
<div class="order-container">
    <div class="order">
        <h2>SO#000004</h2>
        <div class="order-details-wrapper">
            <p>details 1</p>
            <p>details 2</p>
            <p>details 3</p>
            <p>details 4</p>
            <p>details 5</p>
            <p>details 5</p>
        </div>
        <a href="/orders/{{$order['number']}}/overview">View Order</a>
    </div>
</div>