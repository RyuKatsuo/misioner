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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 150);
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone_number', 15);
            $table->enum('gender', ['Male', 'Female']);
            $table->boolean('is_active')->default(false);
            $table->foreignUuid('community_id')->nullable()->constrained('communities')->onDelete('set null');
            $table->date('date_of_birth');
            $table->boolean('outside_community')->nullable();
            $table->text('outside_community_address')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
