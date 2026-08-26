<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Product::insert([
            ['name' => 'Wireless Headphones', 'category' => 'Electronics', 'price' => 2499.00, 'stock' => 18, 'status' => 'Available', 'image' => 'https://placehold.co/96x96/eaf2ff/2563eb?text=WH', 'description' => 'Noise-isolating wireless headphones.', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Everyday Tote Bag', 'category' => 'Accessories', 'price' => 850.00, 'stock' => 7, 'status' => 'Available', 'image' => 'https://placehold.co/96x96/fef3c7/92400e?text=TB', 'description' => 'Durable canvas tote for daily essentials.', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Ceramic Coffee Mug', 'category' => 'Home & Living', 'price' => 399.00, 'stock' => 0, 'status' => 'Out of Stock', 'image' => 'https://placehold.co/96x96/f3e8ff/7e22ce?text=CM', 'description' => 'Hand-finished ceramic mug.', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Classic Cotton Tee', 'category' => 'Apparel', 'price' => 599.00, 'stock' => 32, 'status' => 'Available', 'image' => 'https://placehold.co/96x96/dcfce7/166534?text=CT', 'description' => 'Soft, everyday cotton shirt.', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
