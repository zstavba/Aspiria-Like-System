<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Auth;

use Storage;

use App\Models\Images;

class AlbumController extends Controller
{
    
	public function list() : array {
		$images = Images::all();


		if(count($images) < 0){
			return response()->json([
				"message" => [
					"text" =>  "Trenutno nimate na voljo dobenih slik za prikaz !!!",
					"time" =>  date("H:i")
				]
			],400);
		}

		$array = [];
		foreach($images as $image){
			$data = [
				"id" => $image->id,
				"path" => asset('assets/users/'.$image->user->username."/gallery/images/".$image->name),
				"title" => str_replace("_", " ", $image->name),
				"created" => $image->created_at->format("F d Y"),
				"likes" => $image->countLikes(),
				"user" => [
					"id" => $image->user->id,
					"name" => $image->user->name,
					"profile" => $image->user->profile()
				]
			];

			array_push($array, $data);

		}

		return $array;
	}


	public function uploadImage($user_id){
		$messages = [
			"title.required" => "Naslov slike je obvezen !",
		];

        $validator = \Validator::make(\Request::all(), [
            'title' => 'required'
        ], $messages);

        if ($validator->fails())
                return response()->json($validator,400);


        if(!\Request::hasFile("image")){
        	return response()->json([
        		"message" => [
        			"text" => "Preden želite shraniti podatke, morate izbrati vsaj eno sliko.",
        			"time" => date("H:i")
        		]
        	],400);
        }

        $path = public_path("assets/users/".Auth::user()->username."/gallery/images");
        $file = \Request::file("image");


        $image = new Images();
        $image->user_id = Auth::user()->id;
        $image->name = str_replace(" ","_",\Request::get("title")).".".$file->getClientOriginalExtension();
        $image->type = $file->getClientMimeType();
        $image->size = filesize($file);

        if($image->save([])){

        	$file->move($path,$image->name);

        	return response()->json([
        		"message" => [
        			"text" => "Vaša slika je bila uspešno shranjena",
        			"time" =>  date("H:i")
        		]
        	],200);

        }


        return response()->json([
        	"message" => [
        		"text" =>  "Med shranjevanjem podatkov je prišlo do napake.",
        		"time" => date("H:i")
        	]
        ],400);

	}


	public function getPrivateImages($user_id) : array{
		$images = Images::where("user_id",$user_id)->get();


		if(count($images) < 0){
			return response()->json([
				"message" => [
					"text" =>  "Trenutno nimate na voljo dobenih slik za prikaz !!!",
					"time" =>  date("H:i")
				]
			],400);
		}

		$array = [];
		foreach($images as $image){
			$data = [
				"id" => $image->id,
				"path" => asset('assets/users/'.$image->user->username."/gallery/images/".$image->name),
				"title" => str_replace("_", " ", $image->name),
				"created" => $image->created_at->format("F d Y"),
				"user" => [
					"id" => $image->user_id,
					"name" => $image->user->name,
					"profile" => $image->user->profile()
				]
			];

			array_push($array, $data);

		}


		return $array;



	}


	public function selectedImage($img_id){
		$image = Images::find($img_id);

		if(empty($img_id)){
			return response()->json([
				"message" => [
					"text" => "Iskane slike ni bilo mogoče posikati. Ste prepričani, da je v podatkovni bazi.",
					"time" => date("H:i")
				]
			],400);
		}


		return response()->json([
			"image" => [
				"id" => $image->id,
				"name" => $image->name
			]
		],200);
	}

	public function changeImageName($img_id){
		$image = Images::find($img_id);

		if(empty($img_id)){
			return response()->json([
				"message" => [
					"text" => "Iskane slike ni bilo mogoče posikati. Ste prepričani, da je v podatkovni bazi.",
					"time" => date("H:i")
				]
			],400);
		}



		//Storage::disk('3')->move('/assets/users/'.Auth::user()->username."/gallery/images/".$image->name,'/assets/users/'.Auth::user()->username."/gallery/images/".\Request::get("title"));
		$path = public_path("assets/users/".Auth::user()->username."/gallery/images/");
		rename($path.$image->name, $path.\Request::get('title'));

		$image->name = str_replace(" ", "_",\Request::get("title"));


		if($image->save([])){
			return response()->json([
				"message" => [
					"text" => "Ime slike ste uspešno spremenili.",
					"time" => date("H:i")
				]
			],200);
		}


		return response()->json([
			"message" => [
				"text" => "Med shranjevanjem je prišlo do napake. Prosimo vas, da poskusite ponovno kasneje.",
				"time" =>  date("H:i")
			]
		],400);


	}





}
