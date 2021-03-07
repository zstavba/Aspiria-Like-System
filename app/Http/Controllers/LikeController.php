<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Likes;

class LikeController extends Controller
{
    

	public function createLike($user_id,$image_id,$like_type){
		$like = new Likes();
		$like->user_id = $user_id;
		$like->image_id = $image_id;
		$like->like_type = $like_type;

		return $like;
	}


	public function like_up($user_id){
		$check_like = Likes::where([
			"user_id" => $user_id,
			"image_id" => \Request::get("image_id")
		])->first();

		if(!empty($check_like)){

			$check_like->like_type = 1;

			if($check_like->update([])){
				return response()->json([
					"message" => [
						"text" => "Izbrano sliko ste upsšeno všečkali.",
						"time" => date("H:i")
					]
				],200);
			}

			return response()->json([
				"message" => [
					"text" => "Med všečkanjem slike je prišlo do napake.",
					"time" => date("H:i")
				]				
			],200);
		}

		$like = $this->createLike($user_id,\Request::get('image_id'),1);
		
		if($like->save([])){
			return response()->json([
				"message" => [
					"text" => "Sliko ste uspešno všečkali",
					"time" => date("H:i")
				]				
			],200);
		}
		
		return response()->json([
			"message" => [
				"text" => "Med všečkanjem slike je prišlo do napake.",
				"time" => date("H:i")
			]				
		],200);
	}

	public function like_down($user_id){

		$check_like = Likes::where([
			"user_id" => $user_id,
			"image_id" => \Request::get("image_id")
		])->first();

		if(empty($check_like)){
			$like = $this->createLike($user_id,\Request::get('image_id'),0);
			if($like->save([])){
				return response()->json([
					"message" => [
						"text" => "Sliko ste uspešno všečkali",
						"time" => date("H:i")
					]				
				],200);
			}
			
			return response()->json([
				"message" => [
					"text" => "Med všečkanjem slike je prišlo do napake.",
					"time" => date("H:i")
				]				
			],200);
		}

		$check_like->like_type = 0;

		if($check_like->update([])){
			return response()->json([
				"message" => [
					"text" => "Izbrano sliko ste upsšeno všečkali.",
					"time" => date("H:i")
				]
			],200);
		}

		return response()->json([
			"message" => [
				"text" => "Med všečkanjem slike je prišlo do napake.",
				"time" => date("H:i")
			]				
		],200);


	}


}
