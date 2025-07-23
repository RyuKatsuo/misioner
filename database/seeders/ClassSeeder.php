<?php

namespace Database\Seeders;

use App\Models\Child;
use App\Models\ClassModel;
use App\Models\Graduate;
use App\Models\Period;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $period = Period::first();

        if ($period) {
            ClassModel::factory()->create([
                'period_id' => $period->id,
                'class_name' => 'Kelas Tunas Iman A',
            ]);
            ClassModel::factory()->create([
                'period_id' => $period->id,
                'class_name' => 'Kelas Tunas Iman B',
            ]);
        }
    }
}
