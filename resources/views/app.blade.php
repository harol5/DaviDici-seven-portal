<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="{{ asset('images/icons/davidici-logo-icon.png') }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="{{ asset('css/index.css') }}" >

    <link rel="manifest"  href="{{ asset('manifest.json') }}" />
    <title>Davidici Seven</title>
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
  </head>
  <body>
    @inertia
  </body>
</html>
