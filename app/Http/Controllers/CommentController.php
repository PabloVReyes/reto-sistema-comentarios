<?php

namespace App\Http\Controllers;

use App\Models\Decision;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Decision $decision)
    {
        $comments = $decision->comments()
            ->with('user:id,name,email')
            ->latest()
            ->paginate(20);

        return response()->json($comments);
    }

    public function store(Request $request, Decision $decision) {
        $validated = $request->validate([
            'content' => 'required|string|min:10|max:1000'
        ]);

        $comment = $decision->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content']
        ]);

        $comment->load('user:id:name,email');
        $request->user()->increment('karma', 5);

        if($request->wantsJson()) {
            return response()->json([
                'message' => 'Comentario creado',
                'comment' => $comment
            ]);
        }

        return back();
    }
}
