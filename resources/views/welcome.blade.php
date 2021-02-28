<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" ng-app="aspiria">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Aspiria  - Like system</title>


        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

        <!-- Styles -->
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
        <link rel="stylesheet" href="{{ asset('css/tailwind.css') }}">


        <!-- Scripts -->
        <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>        
    </head>
    <body class="bg-gray-100" ng-controller="IndexController" ng-init="init()">
        
    </body>
</html>
