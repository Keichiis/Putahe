<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'category', 'price', 'stock', 'status', 'image', 'description'];

    protected function casts(): array
    {
        return ['price' => 'decimal:2'];
    }
}
