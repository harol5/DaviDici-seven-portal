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
            margin: 280px 20px 20px 20px;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            font-size: 11px;
        }

        h1 {
            font-size: 15px;
        }

        .main-header,
        .products,
        .payment-details,
        .balance-details,
        .order-status {
            margin-bottom: 20px;
        }

        .payment-details,
        .balance-details,
        .order-status {
            page-break-inside: avoid; /* Prevent section from splitting across pages */
        }

        .main-header {
            position: fixed;
            top: 0;
            left: 0;
            width: calc(100% - 40px);
            padding: 20px;
            border-bottom: 1px solid #000;
        }

        .main-header .logo-wrapper img {
            width: 30%;
        }

        .main-header .contact-info-wrapper {
            width: 100%;
            margin: 10px 0;
            border-bottom: 4px solid #d1aa68;
        }

        .main-header .contact-info-wrapper .contact-item {
            text-align: center;
        }

        .main-header .contact-info-wrapper .contact-item img {
            width: 14%;
        }

        .main-header .contact-info-wrapper .contact-item p,
        .main-header .contact-info-wrapper .contact-item a{
            display: inline-block;
            vertical-align: middle;
        }

        .main-header .date-orderNumber-wrapper div p {
            font-size: 13px;
        }

        .main-header .bill-to-wrapper ol {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .content .products table,
        .content .order-status table {
            border-spacing: 15px 12px;
            border-collapse: separate;
            width: 100%;
        }

        .content .products table thead th,
        .content .order-status table thead th {
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
        }

        .content .products table tbody td,
        .content .order-status table tbody td{
            border-bottom: 1px solid gray;
            padding: 10px 5px;
            text-align: center;
        }

        .content .payment-details table,
        .content .balance-details table {
            margin-top: 13px;
            border-spacing: 20px 0;
            border-collapse: separate;
        }

        @page {
            size: letter;
        }

    </style>
</head>
<body>
<section class="main-header">
    <div class="logo-wrapper" style="text-align: center; margin-bottom: 20px;">
        <img src="{{ public_path('images/davidici-logo-nav-cropped.png') }}" alt="Logo">
    </div>
    <table class="contact-info-wrapper">
        <tr>
            <td class="contact-item">
                <img src="{{ public_path('images/icons/location-icon.png') }}" alt="location">
                <p>245 10th Ave, Paterson, NJ 07524</p>
            </td>
            <td class="contact-item">
                <img src="{{ public_path('images/icons/phone-icon.png') }}" alt="phone">
                <p>+1 (718) 854-1004</p>
            </td>
            <td class="contact-item">
                <img src="{{ public_path('images/icons/website-icon.png') }}" alt="website">
                <a href="https://davidici.com">davidici.com</a>
            </td>
            <td class="contact-item">
                <img src="{{ public_path('images/icons/email-icon.png') }}" alt="email">
                <p>info@davidici.com</p>
            </td>
        </tr>
    </table>
    <div class="date-orderNumber-wrapper" style="display: table; width: 100%;">
        <div style="display: table-cell; text-align: left;">
            <p><strong>{{ $orderInfo['date'] }}</strong></p>
        </div>
        <div style="display: table-cell; text-align: right;">
            <p><strong>Invoice # {{ $orderInfo['orderNumber'] }}</strong></p>
        </div>
    </div>
    <div class="bill-to-wrapper">
        <h4>Bill to:</h4>
        <ol>
            <li>{{ $orderInfo['billTo'] }}</li>
            <li>{{ $orderInfo['address'] }}</li>
            <li>{{ $orderInfo['cityStateZip'] }}</li>
        </ol>
    </div>
</section>
<section class="content">
    <section class="products">
        <h1>PRODUCTS:</h1>
        <table>
            <thead>
            <tr>
                <th>Quantity</th>
                <th>Model</th>
                <th>Product</th>
                <th>Group</th>
                <th>Finish</th>
                <th>SKU</th>
                <th>Status</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>
            @foreach($orderInfo['products'] as $product)
                <tr>
                    <td>{{ $product['quantity'] }}</td>
                    <td>{{ $product['model'] }}</td>
                    <td>{{ $product['product'] }}</td>
                    <td>{{ $product['group'] }}</td>
                    <td>{{ $product['finish'] }}</td>
                    <td>{{ $product['sku'] }}</td>
                    <td>{{ $product['status'] }}</td>
                    <td>${{ $product['price'] }}</td>
                    <td>${{ $product['total'] }}</td>
                </tr>
            @endforeach
            </tbody>
            <tfoot>
            <tr>
                <td colspan="8" style="text-align: right;">Grand Total:</td>
                <td>${{ $orderInfo['grandTotal'] }}</td>
            </tr>
            </tfoot>
        </table>
    </section>
    <section class="payment-details">
        <h1>PAYMENT DETAILS:</h1>
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            @foreach($orderInfo['paymentDetails'] as $payment)
                <tr>
                    <td>{{ $payment['date'] }}</td>
                    <td>{{ $payment['method'] }}</td>
                    <td>${{ $payment['amount'] }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
        @if(count($orderInfo['paymentDetails']) === 0)
            <p>No payments</p>
        @endif
    </section>
    <section class="balance-details">
        <h1>BALANCE DETAILS:</h1>
        <table>
            <thead>
            <tr>
                <th>Shipped</th>
                <th>In Warehouse</th>
                <th>In Transit</th>
                <th>Open</th>
                <th>Balance</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>${{ $orderInfo['balanceDetails']['shipped'] }}</td>
                <td>${{ $orderInfo['balanceDetails']['inWarehouse'] }}</td>
                <td>${{ $orderInfo['balanceDetails']['inTransit'] }}</td>
                <td>${{ $orderInfo['balanceDetails']['open'] }}</td>
                <td>${{ $orderInfo['balanceDetails']['balance'] }}</td>
            </tr>
            </tbody>
        </table>
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
</section>

{{-- Here's the magic. This MUST be inside body tag. Page count / total, centered at bottom of page --}}
<script type="text/php">
    if (isset($pdf)) {
        $text = "page {PAGE_NUM} / {PAGE_COUNT}";
        $size = 10;
        $font = $fontMetrics->getFont("Verdana");
        $width = $fontMetrics->get_text_width($text, $font, $size) / 2;
        $x = ($pdf->get_width() - $width) / 2;
        $y = $pdf->get_height() - 35;
        $pdf->page_text($x, $y, $text, $font, $size);
    }
</script>
</body>
</html>
