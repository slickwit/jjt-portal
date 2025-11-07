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
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constrained('users'); // Admin who created
            $table->enum('status', ['draft', 'scheduled', 'active', 'completed', 'archived'])->default('draft');
            $table->json('settings')->nullable(); // Time limits, passing score, etc.
            $table->timestamp('scheduled_at')->nullable(); // When it becomes available
            $table->timestamp('due_at')->nullable(); // Deadline
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
