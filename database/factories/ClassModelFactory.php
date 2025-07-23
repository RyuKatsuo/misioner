<?php

namespace Database\Factories;

use App\Models\Period;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClassModelFactory extends Factory
{
    public function definition(): array
    {
        return [
            'period_id' => Period::factory(),
            'class_name' => 'Kelas ' . $this->faker->unique()->word(),
        ];
    }
}