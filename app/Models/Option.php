<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Option extends Model
{
    protected $fillable = [
        'decision_id',
        'text',
        'votes_count',
    ];

    protected $appends = ['percentage'];

    public function decision(): BelongsTo
    {
        return $this->belongsTo(Decision::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function getPercentageAttribute()
    {
        $totalVotes = $this->decision->votes()->count();
        if ($totalVotes === 0) {
            return 0;
        }
        return round(($this->votes_count / $totalVotes) * 100, 1);
    }

    public function incrementVoteCount()
    {
        $this->increment('votes_count');
    }

    public function decrementVoteCount()
    {
        $this->decrement('votes_count');
    }
}