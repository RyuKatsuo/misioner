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
        Schema::create('childrens', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 150);
            $table->integer('attendance_count')->default(0);
            $table->float('total_score')->default(0);
            $table->string('school');
            $table->string('hobby');
            $table->string('avatar_url')->nullable();
            $table->string('qr_url')->nullable();
            $table->date('date_of_birth');
            $table->boolean('special_needs_status')->default(false);
            $table->text('special_needs_description')->nullable();
            $table->enum('gender', ['Male', 'Female']);
            $table->boolean('is_active')->default(false);
            $table->foreignUuid('parent_id')->constrained('users');
            $table->string('qr_code', 8)->nullable();
            $table->foreignUuid('class_id')->nullable()->constrained('class');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('childrens');
    }
};
