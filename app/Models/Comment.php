<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['decision_id', 'user_id', 'content'];

    protected $casts = [
        'created_at' => 'datetime'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function decision() {
        return $this->belongsTo(Decision::class);
    }
}
