<!DOCTYPE html>
<html>
<head>
    <title>{{ $orderInfo['orderNumber'] }}</title>
    <style>
        * {
            margin: 0;
            box-sizing: border-box;
        }

        body {
            margin: 20px;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            font-size: 12px;
        }

        h1 {
            font-size: 16px;
        }

        .main-header,
        .products,
        .payment-details,
        .balance-details,
        .order-status {
            margin-bottom: 20px;
        }

        .main-header {
            background-color: #d1aa68;
        }

        .date-orderNumber-wrapper p {
            display: inline;
        }

        @page {
            margin: 1in;
            size: A4;
        }
    </style>
</head>
<body>
    <section class="main-header">
        <div class="date-orderNumber-wrapper">
            <p><strong>{{ $orderInfo['date'] }}</strong></p>
            <p><strong>Invoice # {{ $orderInfo['orderNumber'] }}</strong></p>
        </div>
        <p>{{ $orderInfo['billTo'] }}</p>
        <p>{{ $orderInfo['address'] }}</p>
        <p>{{ $orderInfo['cityStateZip'] }}</p>
    </section>
    <section class="products">
        <h1>PRODUCTS:</h1>
        <table>
            <thead>
                <tr>
                    <th>Quantity</th>
                    <th>Model</th>
                    <th>Finish</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Product</th>
                </tr>
            </thead>
            <tbody>
            @foreach($orderInfo['products'] as $product)
                <tr>
                    <td>{{ $product['quantity'] }}</td>
                    <td>{{ $product['model'] }}</td>
                    <td>{{ $product['finish'] }}</td>
                    <td>{{ $product['sku'] }}</td>
                    <td>{{ $product['price'] }}</td>
                    <td>{{ $product['total'] }}</td>
                    <td>{{ $product['product'] }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
        <h2>Grand Total:</h2>
        <p>{{ $orderInfo['grandTotal'] }}</p>
    </section>
    <section class="payment-details">
        <h1>PAYMENT DETAILS:</h1>
        @foreach($orderInfo['paymentDetails'] as $payment)
            <div>
                <p>{{ $payment['date'] }}</p>
                <p>{{ $payment['method'] }}</p>
                <p>{{ $payment['amount'] }}</p>
            </div>
        @endforeach
        @if(count($orderInfo['paymentDetails']) === 0)
            <p>No payments</p>
        @endif
    </section>
    <section class="balance-details">
        <h1>BALANCE DETAILS:</h1>
        <div>
            <p>{{ $orderInfo['balanceDetails']['shipped'] }}</p>
            <p>{{ $orderInfo['balanceDetails']['inWarehouse'] }}</p>
            <p>{{ $orderInfo['balanceDetails']['inTransit'] }}</p>
            <p>{{ $orderInfo['balanceDetails']['open'] }}</p>
            <p>{{ $orderInfo['balanceDetails']['balance'] }}</p>
        </div>
    </section>
    <section class="order-status">
        <h1>ORDER STOCK STATUS:</h1>
        <table>
            <thead>
                <tr>
                    <th>Sku</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            @foreach($orderInfo['orderStockStatusByProduct'] as $productStatus)
                <tr>
                    <td>{{ $productStatus['sku'] }}</td>
                    <td>{{ $productStatus['product'] }}</td>
                    <td>{{ $productStatus['status'] }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </section>
</body>
</html>
