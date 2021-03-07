<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;


use App\Models\User;

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


    public function activation_successfull($user_id){
        $user = User::find($user_id);

        if(empty($user)){
            return view("email/success",[
                "message" => "Iskanega uporabnika ni bilo mogoče  najti. Ste prepričani, da ste se registrirali."
            ]);
        }

        $user->status_active = 1;

        if($user->update()){
            return view("email/success",[
                "user" => $user,
                "message" =>  "Aktivacija računa je bila uspešna."
            ]);
        }

        return view("email/success",[
            "message" => "Aktivacija vašega računa je spodletela. Prosimo vas do poskusite kasneje."
        ]);

    }

}
