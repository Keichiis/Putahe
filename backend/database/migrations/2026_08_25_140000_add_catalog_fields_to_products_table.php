<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'category')) {
                $table->string('category')->default('Uncategorized')->after('name');
            }

            if (! Schema::hasColumn('products', 'status')) {
                $table->string('status')->default('Available')->after('stock');
            }

            if (! Schema::hasColumn('products', 'image')) {
                $table->string('image', 2048)->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $columns = array_filter(['image', 'status', 'category'], fn ($column) => Schema::hasColumn('products', $column));

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};
