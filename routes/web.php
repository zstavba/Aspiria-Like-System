<?php

use Illuminate\Support\Facades\Route;
use  App\Http\Controllers\Controller;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [Controller::class, 'index']);


Route::get('/home', [Controller::class, 'home']);
Route::get('/login', [Controller::class, 'login'])->middleware('guest');
Route::get('/register', [Controller::class, 'register'])->middleware('guest');;


Route::get('/private/images', [Controller::class, 'private_images'])->middleware('auth');
Route::get('/all/images', [Controller::class, 'all_images'])->middleware('auth');
Route::get('/members', [Controller::class, 'members'])->middleware('auth');
