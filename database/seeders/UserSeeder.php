<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $communityId = DB::table('communities')->first()?->id;

        $user = User::create([
            'id' => Str::uuid(),
            'name' => 'Ananda Andreas',
            'email' => 'ananda@example.com',
            'password' => Hash::make('qweqweqwe'), // jangan lupa di-hash
            'phone_number' => '081234567890',
            'gender' => 'Male',
            'is_active' => true,
            'community_id' => $communityId,
            'date_of_birth' => '2000-01-01',
            'outside_community' => false,
            'outside_community_address' => null,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $user->assignRole('Parent');

    }
}
