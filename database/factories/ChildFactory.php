<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChildFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'school' => 'SD ' . fake()->city(),
            'hobby' => fake()->word(),
            'date_of_birth' => fake()->dateTimeBetween('-10 years', '-5 years'),
            'gender' => fake()->randomElement(['Male', 'Female']),
            'is_active' => true,
            'parent_id' => User::factory(),
        ];
    }
}