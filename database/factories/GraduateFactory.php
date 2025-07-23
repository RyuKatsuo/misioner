<?php

namespace Database\Factories;

use App\Models\Child;
use Illuminate\Database\Eloquent\Factories\Factory;

class GraduateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'children_id' => Child::factory(),
            'graduated_at' => now(),
        ];
    }
}