<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Category::query()->orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(Category::create($this->validatedData($request)), 201);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json($category);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $this->validatedData($request, $category);

        DB::transaction(function () use ($category, $data): void {
            Product::query()->where('category', $category->name)->update(['category' => $data['name']]);
            $category->update($data);
        });

        return response()->json($category->fresh());
    }

    public function destroy(Category $category): JsonResponse
    {
        if (Product::query()->where('category', $category->name)->exists()) {
            return response()->json([
                'message' => 'A category with products cannot be deleted. Move or delete its products first.',
            ], 422);
        }

        $category->delete();

        return response()->json(null, 204);
    }

    private function validatedData(Request $request, ?Category $category = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories', 'name')->ignore($category),
            ],
        ]);
    }
}
