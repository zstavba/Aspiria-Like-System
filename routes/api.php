<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\UserController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\LikeController;

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


Route::group(["prefix" => "album"],function(){
	Route::post("/image/{user_id}",[AlbumController::class,"uploadImage"]);
	Route::get("/private/{user_id}",[AlbumController::class,"getPrivateImages"]);
	Route::get("/all",[AlbumController::class,"list"]);
	Route::get("/selected/{img_id}",[AlbumController::class,"selectedImage"]);
	Route::post("/update/{img_id}",[AlbumController::class,"changeImageName"]);
});


Route::group(["prefix" => "like"],function(){
	Route::post("/up/{img_id}",[LikeController::class,"like_up"]);
	Route::post("/down/{img_id}",[LikeController::class,"like_down"]);
});