<!DOCTYPE html>
<html>
<head>
    <title>Shopping Cart PDF</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        h1 {
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table, th, td {
            border: 1px solid #000;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        .title-row th {
            text-align: center;
            font-weight: bold;
        }
    </style>
</head>
<body>
<h1>Your current Compositions:</h1>
@foreach ($compositions as $composition)
    <table>
        <thead>
            <tr class="title-row">
                <th colspan="6">Composition: {{ $composition['description'] }}</th>
            </tr>
            <tr>
                <th>Product</th>
                <th>Label</th>
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
                    <td>{{ $composition['vanity']['unitPrice'] }}</td>
                    <td>{{ $composition['vanity']['quantity'] }}</td>
                    <td>{{ $composition['vanity']['total'] }}</td>
                </tr>
            @endif
            @if( isset($composition['washbasin']) && $composition['washbasin'] )
                <tr>
                    <td>{{ $composition['washbasin']['productObj']['descw'] }}</td>
                    <td>{{ $composition['label'] }}</td>
                    <td>{{ $composition['washbasin']['productObj']['uscode'] }}</td>
                    <td>{{ $composition['washbasin']['unitPrice'] }}</td>
                    <td>{{ $composition['washbasin']['quantity'] }}</td>
                    <td>{{ $composition['washbasin']['total'] }}</td>
                </tr>
            @endif
        </tbody>
    </table>
@endforeach
</body>
</html>
