<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Likes extends Model
{
    use HasFactory;

    public $table = "likes";

 	protected $fillable = [
        'user_id',
        'image_id',
        "like_type",
        'thumbs_up',
        "thumbs_down",
    ];


    public function user(){
    	return $this->belongsTo(User::class,"user_id");
    }

    public function user(){
    	return $this->belongsTo(Images::class,"image_id");
    }

}
