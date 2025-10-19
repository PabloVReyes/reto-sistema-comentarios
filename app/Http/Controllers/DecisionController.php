<?php

namespace App\Http\Controllers;

use App\Models\Decision;
use App\Models\Option;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DecisionController extends Controller
{
    public function index(Request $request)
    {
        $query = Decision::with(['user', 'options', 'votes'])
            ->where('status', 'open');

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('filter')) {
            switch ($request->filter) {
                case 'most_voted':
                    $query->withCount('votes')->orderBy('votes_count', 'desc');
                    break;
                case 'expiring_soon':
                    $query->orderBy('expires_at', 'asc');
                    break;
                case 'no_votes':
                    $query->has('votes', '=', 0);
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $decisions = $query->paginate(12);

        foreach ($decisions as $decision) {
            $decision->checkAndUpdateExpiredStatus();
            if (Auth::check()) {
                $decision->user_has_voted = $decision->hasUserVoted(Auth::user());
                $decision->user_vote = $decision->getUserVote(Auth::user());
            }
        }

        return response()->json($decisions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'context' => 'required|string',
            'type' => 'required|in:career,technical,life,financial,startup',
            'is_anonymous' => 'boolean',
            'expires_at' => 'required|date|after:now',
            'options' => 'required|array|min:2|max:4',
            'options.*' => 'required|string|max:255',
        ]);

        DB::transaction(function () use ($validated, &$decision) {
            $decision = Decision::create([
                'user_id' => Auth::id(),
                'title' => $validated['title'],
                'context' => $validated['context'],
                'type' => $validated['type'],
                'is_anonymous' => $validated['is_anonymous'] ?? false,
                'expires_at' => $validated['expires_at'],
                'status' => 'open',
            ]);

            foreach ($validated['options'] as $optionText) {
                Option::create([
                    'decision_id' => $decision->id,
                    'text' => $optionText,
                ]);
            }

            Auth::user()->increment('karma', 10);
            Auth::user()->updateBadge();
        });

        return response()->json([
            'message' => 'Decision created successfully',
            'decision' => $decision->load('options'),
        ], 201);
    }

    public function show($id)
    {
        $decision = Decision::with(['user', 'options', 'votes.user', 'finalOption'])
            ->findOrFail($id);

        $decision->checkAndUpdateExpiredStatus();

        if (Auth::check()) {
            $decision->user_has_voted = $decision->hasUserVoted(Auth::user());
            $decision->user_vote = $decision->getUserVote(Auth::user());
        }

        return response()->json($decision);
    }

    public function update(Request $request, $id)
    {
        $decision = Decision::findOrFail($id);

        if ($decision->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:decided,archived',
            'final_option_id' => 'sometimes|exists:options,id',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'decided') {
            if (!isset($validated['final_option_id'])) {
                return response()->json(['message' => 'Final option is required when marking as decided'], 422);
            }

            $option = Option::findOrFail($validated['final_option_id']);
            if ($option->decision_id !== $decision->id) {
                return response()->json(['message' => 'Invalid option for this decision'], 422);
            }
        }

        $decision->update($validated);

        return response()->json([
            'message' => 'Decision updated successfully',
            'decision' => $decision->fresh()->load('options', 'finalOption'),
        ]);
    }

    public function destroy($id)
    {
        $decision = Decision::findOrFail($id);

        if ($decision->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $decision->delete();

        return response()->json(['message' => 'Decision deleted successfully']);
    }

    public function myDecisions()
    {
        $decisions = Auth::user()
            ->decisions()
            ->with(['options', 'votes', 'finalOption'])
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        foreach ($decisions as $decision) {
            $decision->checkAndUpdateExpiredStatus();
        }

        return response()->json($decisions);
    }

    public function votedDecisions()
    {
        $decisionIds = Auth::user()
            ->votes()
            ->pluck('decision_id')
            ->unique();

        $decisions = Decision::with(['user', 'options', 'votes', 'finalOption'])
            ->whereIn('id', $decisionIds)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        foreach ($decisions as $decision) {
            $decision->checkAndUpdateExpiredStatus();
            $decision->user_vote = $decision->getUserVote(Auth::user());
        }

        return response()->json($decisions);
    }
}