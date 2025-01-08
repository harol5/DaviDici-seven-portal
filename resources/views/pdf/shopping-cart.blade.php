<!DOCTYPE html>
<html>
<head>
    <title>Shopping Cart PDF</title>
    <style>
        * {
            margin: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 180px 20px 20px 20px;
            padding: 0;
            font-size: 11px;
        }

        h1 {
            text-align: center;
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
            width: 25%;
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

        .main-header .contact-info-wrapper .contact-item img[alt="location"],
        .main-header .contact-info-wrapper .contact-item img[alt="email"]
        {
            width: 10%;
        }

        .main-header .contact-info-wrapper .contact-item p,
        .main-header .contact-info-wrapper .contact-item a{
            display: inline-block;
            vertical-align: middle;
        }

        .content .composition-content .composition-header {
            text-align: center;
            page-break-inside: avoid; /* Prevent section from splitting across pages */
        }

        .content .composition-content .composition-header h1 {
            font-size: 12px;
            margin-bottom: 10px;
        }

        .content .composition-content .composition-header img {
            width: 50%;
            margin-bottom: 10px;
        }

        .content .composition-content .composition-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            page-break-inside: avoid; /* Prevent section from splitting across pages */
        }

        .content .composition-content .composition-table, .content th, .content td {
            border: 1px solid #000;
        }
        .content th, .content td {
            padding: 8px;
            text-align: left;
        }

        .title-row th {
            text-align: center;
            font-weight: bold;
        }

        .content .grand-total {
            margin-top: 20px;
            width: 100%;
            text-align: center;
        }

        .content .grand-total p {
            font-size: 16px;
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
    </section>
    <section class="content">
        @foreach ($compositions as $composition)
            <section class="composition-content">
                <section class="composition-header">
                    <h1>{{ $composition['description'] }}</h1>
                    <img src="{{ $composition['displayImage'] }}" alt="composition image">
                </section>
                <table class="composition-table">
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Configuration Name</th>
                        <th>Sku</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    @if( isset($composition['vanity']) && $composition['vanity'] )
                        <tr>
                            <td>{{ $composition['vanity']['productObj']['descw'] }}</td>
                            <td>{{ $composition['label'] }}</td>
                            <td>{{ $composition['vanity']['productObj']['uscode'] }}</td>
                            <td>${{ $composition['vanity']['unitPrice'] }}</td>
                            <td>{{ $composition['vanity']['quantity'] }}</td>
                            <td>${{ $composition['vanity']['total'] }}</td>
                        </tr>
                    @endif
                    @if( isset($composition['washbasin']) && $composition['washbasin'] )
                        <tr>
                            <td>{{ $composition['washbasin']['productObj']['descw'] }}</td>
                            <td>{{ $composition['label'] }}</td>
                            <td>{{ $composition['washbasin']['productObj']['uscode'] }}</td>
                            <td>${{ $composition['washbasin']['unitPrice'] }}</td>
                            <td>{{ $composition['washbasin']['quantity'] }}</td>
                            <td>${{ $composition['washbasin']['total'] }}</td>
                        </tr>
                    @endif
                    @if( count($composition['sideUnits']) > 0 )
                        @foreach ($composition['sideUnits'] as $sideUnit)
                            <tr>
                                <td>{{ $sideUnit['productObj']['descw'] }}</td>
                                <td>{{ $composition['label'] }}</td>
                                <td>{{ $sideUnit['productObj']['uscode'] }}</td>
                                <td>${{ $sideUnit['unitPrice'] }}</td>
                                <td>{{ $sideUnit['quantity'] }}</td>
                                <td>${{ $sideUnit['total'] }}</td>
                            </tr>
                        @endforeach
                    @endif
                    @foreach ($composition['otherProductsValidItems'] as $otherProducts)
                        @foreach ($otherProducts as $otherProduct)
                            <tr>
                                <td>{{ $otherProduct['productObj']['descw'] }}</td>
                                <td>{{ $composition['label'] }}</td>
                                <td>{{ $otherProduct['productObj']['uscode'] }}</td>
                                <td>${{ $otherProduct['unitPrice'] }}</td>
                                <td>{{ $otherProduct['quantity'] }}</td>
                                <td>${{ $otherProduct['total'] }}</td>
                            </tr>
                        @endforeach
                    @endforeach
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colspan="5">Total</td>
                        <td>{{ $currencyFormatter->formatCurrency($composition['grandTotal'], 'USD') }}</td>
                    </tr>
                    </tfoot>
                </table>
            </section>
        @endforeach
        <section class="grand-total">
            <h2>Grand Total:</h2>
            <p>{{ $grandTotal }}</p>
        </section>
    </section>
</body>
</html>
