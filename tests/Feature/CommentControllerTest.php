<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\User;
use App\Models\Decision;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_fetch_comments_for_decision()
    {
        $decision = Decision::factory()->create();
        $user = User::factory()->create();

        Comment::factory()->count(20)->create([
            'decision_id' => $decision->id,
            'user_id' => $user->id,
        ]);

        $response = $this->getJson("/api/decisions/{$decision->id}/comments");

        $response->assertStatus(200)
                 ->assertJsonCount(20, 'data');
    }

    /** @test */
    public function can_create_comment()
    {
        $decision = Decision::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($user);

        $payload = [
            'content' => 'Este es un comentario de prueba'
        ];

        $response = $this->postJson("/api/decisions/{$decision->id}/comments", $payload);

        $response->assertStatus(201)
                 ->assertJsonFragment(['content' => $payload['content']]);

        $this->assertDatabaseHas('comments', [
            'content' => $payload['content'],
            'decision_id' => $decision->id,
            'user_id' => $user->id,
        ]);
    }
}
