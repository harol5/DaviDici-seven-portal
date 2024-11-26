<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        
        DB::table('users')->insert([
            'first_name' => 'harol',
            'last_name' => 'rojas',
            'phone' => 3219483992,
            'email' => 'harole@davidici.com',
            'username' => 'HarolE$Davidici_com',
            'role' => 3478,
            'password' => Hash::make(env('FOXPRO_PWD')),
        ]);

        DB::table('users')->insert([
            'first_name' => 'john',
            'last_name' => 'doe',
            'phone' => 1234567890,
            'email' => 'hrcode95@gmail.com',
            'username' => 'hrcode95%40gmail.com',
            'role' => 1950,
            'password' => Hash::make(env('FOXPRO_PWD')),
        ]);
    }
}
