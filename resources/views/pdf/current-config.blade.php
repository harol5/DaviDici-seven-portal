<!DOCTYPE html>
<html>
<head>
    <title>Current Config PDF</title>
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

        .content .composition-header {
            text-align: center;
            page-break-inside: avoid; /* Prevent section from splitting across pages */
        }

        .content .composition-header h1 {
            font-size: 12px;
            margin-bottom: 10px;
        }

        .content .composition-header img {
            width: 65%;
            margin-bottom: 10px;
        }

        .content .composition-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            page-break-inside: avoid; /* Prevent section from splitting across pages */
        }

        .content .composition-table,
        .content th, .content td {
            border: 1px solid #000;
        }

        .content th,
        .content td {
            padding: 8px;
            text-align: left;
        }

        .title-row th {
            text-align: center;
            font-weight: bold;
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
    <section class="composition-header">
        <h1>{{ $currentConfig['description'] }}</h1>
        <img src="{{ $currentConfig['image'] }}" alt="composition image">
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
            @foreach ($currentConfig['products'] as $product)
                <tr>
                    <td>{{ $product['description'] }}</td>
                    <td>{{ $product['compositionName'] }}</td>
                    <td>{{ $product['sku'] }}</td>
                    <td>${{ $product['unitPrice'] }}</td>
                    <td>{{ $product['quantity'] }}</td>
                    <td>${{ $product['total'] }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5">Total</td>
                <td>{{ $currentConfig['grandTotal'] }}</td>
            </tr>
        </tfoot>
    </table>
</section>
</body>
</html>
