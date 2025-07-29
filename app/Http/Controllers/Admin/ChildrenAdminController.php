<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Child;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChildrenAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->input('status', 'active');
        $query = Child::query()
            ->with('classModel', 'parent', 'graduate')
            ->when($status === 'active', function ($q) {
                $q->where('is_active', true);
            })
            ->when($status === 'inactive', function ($q) {
                $q->where('is_active', false)->doesntHave('graduate');
            })
            ->when($status === 'graduated', function ($q) {
                $q->where('is_active', false)->has('graduate');
            })
            ->when($request->input('search'), function ($q, $search) {
                $q->where(function ($subq) use ($search) {
                    $subq->where('name', 'ilike', "%{$search}%")
                        ->orWhereHas('parent', function ($parentQuery) use ($search) {
                            $parentQuery->where('name', 'ilike', "%{$search}%");
                        });
                });
            });

        $childrens = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/children/index', [
            'childrens' => $childrens,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function show(Child $child): Response
    {
        $child->load(['scores.task', 'parent', 'classModel.period', 'attendances']);
        
        return Inertia::render('admin/children/show', [
            'child' => $child
        ]);
    }
}
