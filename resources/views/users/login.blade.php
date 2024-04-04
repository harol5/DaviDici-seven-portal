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
        <section class="main-login">
            <div id="login-page">
                <div id="LogoDiv">
                    <div id="loader-wrap"><div class="loader" id="loader"></div></div>
                    <img id="Logo" src="{{ asset('images/davidici-logo.png') }}">
                </div>
                <div id="form-wrapper">
                    <form method="POST" action="/auth">
                        @csrf

                        @error('email')
                            <p class="">{{$message}}</p>
                        @enderror
                        <input type="text" name="email" placeholder="Email"/>
                        
                        <input type="password" name="password" placeholder="Password"/>                        
                        <button type="submit">Login </button>
                    </form>
                </div>
            </div>
        </section>
        <x-flash-message />
    </body>
</html>

