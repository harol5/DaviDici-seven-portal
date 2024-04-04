<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        @vite('resources/css/app.css')
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" type="text/css" href="{{ asset('css/index.css') }}" >
        <script src="{{ asset('js/index.js') }}" defer></script>
        <title>Davidici Seven</title>
    </head>
    <body>
        <nav>
            <div>
                <img class="nav-logo" src="{{ asset('images/davidici-logo-nav-cropped.png') }}">
                <ul class="nav-links">
                    <li><a href="/orders">Orders</a></li>
                    <li><a href="/inventory">Inventory</a></li>
                </ul>
                <form method="POST" action="/logout">
                    @csrf
                    <button type="submit">
                      Logout
                    </button>
                </form>
            </div>
        </nav>
        <main>
            @yield('content')
        </main>
        <x-flash-message />
    </body>
</html>