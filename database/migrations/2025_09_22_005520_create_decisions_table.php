<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('decisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('context');
            $table->enum('type', ['career', 'technical', 'life', 'financial', 'startup']);
            $table->boolean('is_anonymous')->default(false);
            $table->enum('status', ['draft', 'open', 'decided', 'expired', 'archived'])->default('open');
            $table->dateTime('expires_at');
            $table->unsignedBigInteger('final_option_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('decisions');
    }
};
