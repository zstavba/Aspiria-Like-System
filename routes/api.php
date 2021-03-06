<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/* Guest functionallity */


Route::group(["prefix" => "user"],function(){

	Route::post('/login', [UserController::class, 'login']);
	Route::post('/register', [UserController::class, 'register']);
	Route::get('/logout', [UserController::class, 'logout']);


	Route::get('/info/{user_id}', [UserController::class, "info"]);
	Route::get("/members", [UserController::class,"list"]);
});

/* Authenticated functionallity */
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
