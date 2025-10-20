<?php

namespace App\Http\Controllers;

use App\Models\Comment;
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

    public function store(Request $request, Decision $decision)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:10|max:1000'
        ]);

        $comment = $decision->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content']
        ]);

        $comment->load('user:id:name,email');
        $request->user()->increment('karma', 5);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Comentario creado',
                'comment' => $comment
            ], 201);
        }

        return back();
    }

    public function update(Request $request, Comment $comment)
    {
        // Validar que el comentario pertenece al usuario
        if ($request->user()->id !== $comment->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:10|max:1000',
        ]);

        $comment->update(['content' => $validated['content']]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Comentario actualizado',
                'comment' => $comment
            ], 200);
        }

        return back();
    }

    public function destroy(Request $request, Comment $comment) {
        // Verificar que el usuario sea el propietario
        if($request->user()->id !== $comment->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $comment->delete();

        $request->user()->decrement('karma', 5);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Comentario eliminado',
            ], 200);
        }

        return back();
    }
}
