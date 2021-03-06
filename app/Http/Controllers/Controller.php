<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function index(){
    	return view("welcome");
    }

    public function home(){
        return view("user/index");
    }

    public function login(){

    	return view("user/login");

    }

    public function register(){
    	return view('user/register');
    }


    public function private_images(){
        return view('user/private_images');
    }

    public function all_images(){
        return view("user/all_images");
    }

    public function members(){
        return view("user/members");
    }

}
