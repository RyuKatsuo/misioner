<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    protected static ?string $password;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = Admin::create([

            'name' => "ananda admin",
            'email' => "anandaandreas11@gmail.com",
            'password' => Hash::make('qweqweqwe'),
            'phone_number'=> "0820203012",
            'address' => "asdasdasdas",
            'gender' => 'Male'
        ]);

        $superadmin->assignRole('Superadmin');

    }
}
