<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

class UserController extends Controller
{
    

    public function login(){
      $messages = [
            "username.required" => "Uporabniško ime je priporočeno !",
            "password.required" => "Prosimo vas, da vnesete vaše geslo"
        ];

        $validator = \Validator::make(\Request::all(), [
            'username' => 'required|max:255',
            'password' => 'required',
        ], $messages);



        if ($validator->fails())
                return response()->json($validator,400);


        $inputs = \Request::only("username","password");
        if(Auth::attempt($inputs)){
            Auth::login(Auth::user());
            return response()->json([
                "message" => "Prijava je bila uspešna. Čez nekaj sekund boste preusmerjeni v vašo časovnico."
            ],200);
        }


        return response()->json([
            "message" => "Vnesli ste napačne podatke. V primeru, če niste naš član prosimo vas, da ustvarite nov račun."
        ],400);
    }


	public function register(){

		$user = new User();
		$user->name = \Request::get("name");
		$user->email = \Request::get("email");
		/* Adding bcrypt to the password for hasing */
		$user->password = bcrypt(\Request::get("password"));


		if($user->save([])){

			return response()->json([
				"message" => [
					"text" => "Vaša registracija je bila uspešna, na mail boste prejeli link za aktivacijo računa.",
					"time" => date("H:i")
				]				
			],200);
		}


		return response()->json([
			"message" => [
				"text" => "Med shranjevanjem podatkov je prišlo do napake. Prosimo vas, da poskusite kasneje !!!",
				"time" =>  date("H:i")

			]
		],400);


	}



}
