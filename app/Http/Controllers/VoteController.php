<?php

namespace App\Http\Controllers;

use App\Models\Decision;
use App\Models\Vote;
use App\Models\Option;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'decision_id' => 'required|exists:decisions,id',
            'option_id' => 'required|exists:options,id',
            'comment' => 'nullable|string|max:255',
        ]);

        $decision = Decision::findOrFail($validated['decision_id']);
        $option = Option::findOrFail($validated['option_id']);

        // Verify option belongs to decision
        if ($option->decision_id !== $decision->id) {
            return response()->json(['message' => 'Invalid option for this decision'], 422);
        }

        // Check if decision is open
        if ($decision->status !== 'open') {
            return response()->json(['message' => 'Decision is not open for voting'], 422);
        }

        // Check if decision has expired
        if ($decision->is_expired) {
            $decision->update(['status' => 'expired']);
            return response()->json(['message' => 'Decision has expired'], 422);
        }

        // Check if user is trying to vote on their own decision
        if ($decision->user_id === Auth::id()) {
            return response()->json(['message' => 'You cannot vote on your own decision'], 422);
        }

        // Check if user has already voted
        if ($decision->hasUserVoted(Auth::user())) {
            return response()->json(['message' => 'You have already voted on this decision'], 422);
        }

        DB::transaction(function () use ($validated) {
            Vote::create([
                'user_id' => Auth::id(),
                'decision_id' => $validated['decision_id'],
                'option_id' => $validated['option_id'],
                'comment' => $validated['comment'] ?? null,
            ]);
        });

        $decision->fresh()->load(['options', 'votes']);

        return response()->json([
            'message' => 'Vote cast successfully',
            'decision' => $decision,
        ], 201);
    }

    public function destroy($id)
    {
        $vote = Vote::findOrFail($id);

        if ($vote->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $vote->delete();

        return response()->json(['message' => 'Vote removed successfully']);
    }
}