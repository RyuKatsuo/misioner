<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CommunitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $communities = [
            'Lingkungan Santa Bernadetta, Sendowo Blimbingsari',
            'Lingkungan Santo Thomas Aquino, Bulaksumur',
            'Lingkungan Santo Paulus, Terban Timur',
            'Lingkungan Santo Matius, Terban Barat',
            'Lingkungan Santo Yosef Benediktus, Sagan Utara',
            'Lingkungan Santa Elizabeth, Sagan Selatan',
            'Lingkungan Santa Veronika, Purbonegaran',
            'Lingkungan Santo Petrus, Kotabaru',
            'Lingkungan Santo Yosephus, Klitren Lor',
            'Lingkungan Santo Ignasius, Danukusuman Lor',
            'Lingkungan Santo Yakobus, Danukusuman Kidul',
            'Lingkungan Santa Maria Assumpta, Mangkukusuman Lor',
            'Lingkungan Santa Maria Imacullata, Mangkukusuman Kidul',
            'Lingkungan Santa Theresia Avilla, Bausasran',
            'Lingkungan Santa Theresia Kanak-Kanak Yesus, Bausasran',
            'Lingkungan Santo Agustinus, Lempuyangan',
            'Lingkungan Santo Yohanes Rasul, Tukangan',
            'Lingkungan Santo Servasius, Tegal Panggung',
            'Lingkungan Santo Yohanes Paulus, Tukangan',
            'Lingkungan Santo Yusuf, Ledok Tukangan',
            'Lingkungan Santo Aloysius, Ledok Macanan',
            'Lingkungan Santo Pancratius, Gemblakan Atas',
            'Lingkungan Santo Stefanus, Gemblakan Bawah',
            'Lingkungan Santo Gregorius, Cokrodirjan',
        ];

        foreach ($communities as $communityName) {
            DB::table('communities')->insert([
                'id' => Str::uuid(),
                'community_name' => $communityName,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
