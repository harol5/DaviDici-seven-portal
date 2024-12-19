<!DOCTYPE html>
<html>
<head>
    <title>{{ $jsonResponse['title'] }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
    </style>
</head>
<body>
<h1>{{ $jsonResponse['title'] }}</h1>
<p>{{ $jsonResponse['description'] }}</p>

<h3>Details:</h3>
<ul>
    @foreach($jsonResponse['details'] as $key => $value)
        <li><strong>{{ ucfirst($key) }}:</strong> {{ $value }}</li>
    @endforeach
</ul>
</body>
</html>
