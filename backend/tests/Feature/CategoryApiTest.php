<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_categories_can_be_created_and_renamed(): void
    {
        $category = $this->postJson('/api/categories', ['name' => 'Chicken Dishes'])
            ->assertCreated()
            ->assertJsonPath('name', 'Chicken Dishes');

        Product::create([
            'name' => 'Chicken Adobo',
            'category' => 'Chicken Dishes',
            'price' => 180,
            'stock' => 4,
            'status' => 'Available',
        ]);

        $this->putJson('/api/categories/'.$category->json('id'), ['name' => 'Chicken Meals'])
            ->assertOk()
            ->assertJsonPath('name', 'Chicken Meals');

        $this->assertDatabaseHas('products', ['name' => 'Chicken Adobo', 'category' => 'Chicken Meals']);
    }

    public function test_categories_with_products_cannot_be_deleted(): void
    {
        $category = Category::create(['name' => 'Soup']);
        Product::create([
            'name' => 'Bulalo',
            'category' => 'Soup',
            'price' => 250,
            'stock' => 2,
            'status' => 'Available',
        ]);

        $this->deleteJson('/api/categories/'.$category->id)
            ->assertUnprocessable();
    }
}
