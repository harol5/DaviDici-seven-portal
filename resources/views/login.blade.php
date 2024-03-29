<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" type="text/css" href="{{ asset('css/index.css') }}" >
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
                    <form>
                        <input type="text" placeholder="Username"/>
                        <input type="password" placeholder="Password"/>
                        <button type="submit">Login </button>
                    </form>
                </div>
            </div>
        </section>
    </body>
</html>

