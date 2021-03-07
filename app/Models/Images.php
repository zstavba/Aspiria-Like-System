<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Images extends Model
{
    use HasFactory;

    public $table = "images";

 	protected $fillable = [
        'user_id',
        'name',
        'type',
        "size"
    ];


    public function user(){
    	return $this->belongsTo(User::class,"user_id");
    }

    public function likes(){
        return $this->hasMany(Likes::class,"image_id");
    }

    public function countLikes(){
        if(empty($this->likes)){
            return 0;
        }
        $count_up = 0;
        $count_down = 0;
        $data = [
            "like_up" => 0,
            "like_down" => 0
        ];
        foreach($this->likes as $like){

            if($like->like_type == 0){
                $count_up = $count_up+1;
                $data["like_up"] = $count_up;

            }else{
                $count_down = $count_down+1;
                $data["like_down"] = $count_down;

            }
        }

        return $data;
    }


}
