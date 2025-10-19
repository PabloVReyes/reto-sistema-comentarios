<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    protected $fillable = [
        'user_id',
        'decision_id',
        'option_id',
        'comment',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function decision(): BelongsTo
    {
        return $this->belongsTo(Decision::class);
    }

    public function option(): BelongsTo
    {
        return $this->belongsTo(Option::class);
    }

    protected static function booted()
    {
        static::created(function ($vote) {
            $vote->option->incrementVoteCount();
            $vote->user->increment('karma', 5);
        });

        static::deleted(function ($vote) {
            $vote->option->decrementVoteCount();
            $vote->user->decrement('karma', 5);
        });
    }
}