<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_can_be_searched_by_name_category_or_status(): void
    {
        Product::create([
            'name' => 'Chicken Adobo',
            'category' => 'Chicken Dishes',
            'price' => 180,
            'stock' => 5,
            'status' => 'Available',
        ]);
        Product::create([
            'name' => 'Bulalo',
            'category' => 'Soup',
            'price' => 250,
            'stock' => 0,
            'status' => 'Out of Stock',
        ]);

        $this->getJson('/api/products?search=chicken')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.name', 'Chicken Adobo');
    }

    public function test_product_creation_rejects_invalid_stock_and_status(): void
    {
        $this->postJson('/api/products', [
            'name' => 'Invalid Product',
            'category' => 'Test',
            'price' => 100,
            'stock' => -1,
            'status' => 'Draft',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['stock', 'status']);
    }
}
