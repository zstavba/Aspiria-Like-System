<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSettings extends Model
{
    use HasFactory;

    public $table = "user_settings";

 	protected $fillable = [
        'user_id',
        'profile_image',
        "phone_number",
        'adress',
    ];

    public function user(){
    	return $this->belongsTo(User::class,"user_id");
    }


}
