<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Images extends Model
{
    use HasFactory;

    public $table = "images";

 	protected $fillable = [
        'album_id',
        'name',
        'type',
        "size"
    ];


    public function album(){
    	return $this->belongsTo(Album::class,"album_id");
    }


}
