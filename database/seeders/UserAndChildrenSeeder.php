<?php

namespace Database\Seeders;

use App\Models\Child;
use App\Models\ClassModel;
use App\Models\Graduate;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserAndChildrenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil data kelas yang tersedia untuk anak-anak aktif
        $classes = ClassModel::all();
        if ($classes->isEmpty()) {
            $this->command->error('Tidak ada data kelas. Jalankan ClassSeeder terlebih dahulu.');
            return;
        }

        // 1. Buat 3 user yang masing-masing memiliki 4 anak
        User::factory()->count(3)->create()->each(function ($user) use ($classes) {

            // Anak 1 & 2: Status Aktif (tergabung di kelas)
            Child::factory()->count(2)->create([
                'parent_id' => $user->id,
                'class_id' => $classes->random()->id,
                'is_active' => true,
            ]);

            // Anak 3: Status Tidak Aktif
            Child::factory()->create([
                'parent_id' => $user->id,
                'class_id' => null,
                'is_active' => false,
            ]);

            // Anak 4: Status Lulus
            $graduatedChild = Child::factory()->create([
                'parent_id' => $user->id,
                'class_id' => null,
                'is_active' => false,
            ]);

            Graduate::factory()->create([
                'children_id' => $graduatedChild->id,
            ]);
        });

        // 2. Buat 1 user yang tidak memiliki anak
        User::factory()->create();
    }
}
