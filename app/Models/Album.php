<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;


    public $table = "album";

 	protected $fillable = [
        'user_id',
        'name',
        'type',
    ];


    public function user(){
    	return $this->belongsTo(User::class,"user_id");
    }

}
