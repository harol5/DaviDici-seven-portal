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
            font-size: 12px;
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

        .content .content-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .content .units-section .unit {
            border-bottom: 1px solid #000;
            padding: 10px 0;
            page-break-inside: avoid; /* Prevent section from splitting across pages */
        }

        .content .units-section .unit .product {
            margin: 10px 0;
        }

        .content .signatures-container {
            width: 100%;
            margin: 10px 0;
            page-break-inside: avoid; /* Prevent section from splitting across pages */
        }

        .content .signatures-container .signature {
            float: left;
            width: 50%;
            text-align: center;
        }

        .content .signatures-container .signature img {
            width: 80%;
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
    <section class="content-header">
        <h1>Pending Tasks</h1>
        <h2>Aqua Reserve - New Post Richey, Florida</h2>
    </section>
    <section class="units-section">
        @foreach ($data as $content)
            @if( $content[0] === 'unitOne' || $content[0] === 'unitTwo' || $content[0] === 'unitThree' || $content[0] === 'unitFour' || $content[0] === 'unitClub')
                <section class="unit">
                    <h1>{{ $content[0] }}</h1>
                    @foreach ($content[1] as $product => $state)
                        @if(!$state["isCompleted"])
                            <article class="product">
                                <h3>{{ $product }}:</h3>
                                <p>{{ $state['comments'] }}</p>
                            </article>
                        @endif
                    @endforeach
                </section>
            @endif
        @endforeach
    </section>
    <section class="signatures-container">
        <article class="signature">
            <p>{{ $dataCollection['clientName'] }}</p>
            <img src="{{ $dataCollection['clientSignature'] }}" alt="client signature image">
        </article>
        <article class="signature">
            <p>{{ $dataCollection['projectManagerName'] }}</p>
            <img src="{{ $dataCollection['projectManagerSignature'] }}" alt="manager signature image">
        </article>
    </section>
</section>
</body>
</html>
