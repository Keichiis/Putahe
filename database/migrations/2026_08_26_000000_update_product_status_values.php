<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('products')->where('status', 'Active')->update(['status' => 'Available']);
        DB::table('products')->whereNotIn('status', ['Available', 'Out of Stock'])->update(['status' => 'Out of Stock']);
        DB::statement("ALTER TABLE products MODIFY status ENUM('Available', 'Out of Stock') NOT NULL DEFAULT 'Available'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE products MODIFY status ENUM('Available', 'Out of Stock', 'Active', 'Draft', 'Out of stock') NOT NULL DEFAULT 'Available'");
        DB::table('products')->where('status', 'Available')->update(['status' => 'Active']);
        DB::table('products')->where('status', 'Out of Stock')->update(['status' => 'Out of stock']);
        DB::statement("ALTER TABLE products MODIFY status ENUM('Active', 'Draft', 'Out of stock') NOT NULL DEFAULT 'Active'");
    }
};
